// Creates or updates an admin (officer) account directly in the database —
// bypasses the public /api/auth/register endpoint, which deliberately blocks
// self-granted admin roles.
//
// Usage:
//   node scripts/seed.js
//   node scripts/seed.js --email officer@gnida.in --password Passw0rd! --name "S.K. Sharma" --department PWD
//
// Valid --department codes: PWD, JAL_NIGAM, NPCL, SANITATION, GNIDA_ADMIN
// (see src/config/constants.js DEPARTMENTS — must match Issue.department values
// for GET /api/issues/stats/departments to attribute this officer's issues correctly)
//
// Safe to re-run: if the email already exists, it updates that user's role to
// "admin" and refreshes the department/designation fields instead of erroring.

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");

function parseArgs() {
    const args = process.argv.slice(2);
    const parsed = {};
    for (let i = 0; i < args.length; i += 2) {
        const key = args[i].replace(/^--/, "");
        parsed[key] = args[i + 1];
    }
    return parsed;
}

async function seedAdmin() {
    const args = parseArgs();

    const email = args.email || "admin@gnida.in";
    const password = args.password || "ChangeMe123!";
    const name = args.name || "Default Admin Officer";
    const department = args.department || "GNIDA Administration";
    const designation = args.designation || "Nodal Officer";

    await connectDB();

    let user = await User.findOne({ email }).select("+password");

    if (user) {
        user.role = "admin";
        user.name = name;
        user.department = department;
        user.designation = designation;
        // Only reset the password if one was explicitly passed in on the command line
        if (args.password) user.password = password;
        await user.save();
        console.log(`Updated existing user to admin: ${email}`);
    } else {
        user = await User.create({
            name,
            email,
            password,
            role: "admin",
            department,
            designation,
        });
        console.log(`Created new admin user: ${email}`);
    }

    console.log("---");
    console.log(`Email:    ${email}`);
    console.log(`Password: ${args.password ? "(as provided)" : password + "  <-- CHANGE THIS after first login"}`);
    console.log(`Role:     ${user.role}`);
    console.log("---");

    await mongoose.connection.close();
    process.exit(0);
}

seedAdmin().catch((err) => {
    console.error("Seed failed:", err.message);
    process.exit(1);
});