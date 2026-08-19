const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../middleware/asyncHandler");

// @route  POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, ward, designation, department, zone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  // Note: in production, admin/officer accounts should NOT be self-registerable
  // through this public endpoint — gate role: "admin" behind an invite flow or
  // a separate protected admin-creation route once you have a super-admin seed.
  const user = await User.create({
    name,
    email,
    password,
    role: role === "admin" ? "citizen" : role, // prevent self-granted admin role
    phone,
    ward,
    designation,
    department,
    zone,
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @route  POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @route  GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { register, login, getMe };
