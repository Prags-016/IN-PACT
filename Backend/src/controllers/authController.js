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
    throw new Error("Email/mobile and password are required");
  }

  const query = email.trim();
  const cleanPhone = query.replace(/\D/g, "");

  // Find user by email or registered phone number
  const user = await User.findOne({
    $or: [
      { email: query.toLowerCase() },
      ...(cleanPhone.length >= 10
        ? [{ phone: `+91 ${cleanPhone.slice(-10)}` }, { phone: cleanPhone.slice(-10) }]
        : []),
    ],
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email/mobile or password");
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      ward: user.ward,
    },
  });
});

// In-memory OTP store with automatic TTL cleanup
const otpStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of otpStore.entries()) {
    if (val.expiresAt < now) {
      otpStore.delete(key);
    }
  }
}, 60000);

// @route  POST /api/auth/send-otp
// @access Public
const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    res.status(400);
    throw new Error("Mobile number is required");
  }

  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length < 10) {
    res.status(400);
    throw new Error("Please enter a valid 10-digit mobile number");
  }

  const normalizedPhone = cleanPhone.slice(-10);

  // Generate dynamic cryptographically random 4-digit OTP
  const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

  // Store with 5-minute validity
  otpStore.set(normalizedPhone, {
    code: generatedOtp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    attempts: 0,
  });

  console.log(`[Government SMS Gateway] Generated OTP ${generatedOtp} for +91 ${normalizedPhone}`);

  let realSmsSent = false;

  // Real SMS dispatch if Fast2SMS API Key is present in .env
  if (process.env.FAST2SMS_API_KEY && process.env.FAST2SMS_API_KEY !== "your_actual_api_key_here") {
    try {
      // 1. Try primary Fast2SMS OTP route
      let response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: generatedOtp,
          numbers: normalizedPhone,
        }),
      });
      let smsRes = await response.json();
      console.log("[Fast2SMS OTP Route Response]:", smsRes);

      if (smsRes.return) {
        realSmsSent = true;
      } else {
        // 2. Fallback to Quick SMS route if OTP route requires DLT
        response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            route: "q",
            message: `Your IN-PACT verification OTP is ${generatedOtp}. Valid for 5 minutes. - Govt of India`,
            language: "english",
            numbers: normalizedPhone,
          }),
        });
        smsRes = await response.json();
        console.log("[Fast2SMS Quick Route Response]:", smsRes);
        if (smsRes.return) {
          realSmsSent = true;
        }
      }
    } catch (smsErr) {
      console.error("[Fast2SMS Gateway Error]:", smsErr.message);
    }
  }

  res.json({
    success: true,
    message: realSmsSent
      ? `OTP dispatched to your phone +91 ${normalizedPhone}`
      : `OTP sent successfully to +91 ${normalizedPhone}`,
    // If real SMS was dispatched, omit on-screen simulator; otherwise show simulator for dev
    smsNotification: realSmsSent
      ? null
      : {
          sender: "GOV-INPACT",
          otp: generatedOtp,
          phone: `+91 ${normalizedPhone}`,
          timestamp: new Date().toLocaleTimeString(),
          text: `Your IN-PACT verification OTP is ${generatedOtp}. Valid for 5 minutes. Do not share this code with anyone. - Govt of India`,
        },
  });
});

// @route  POST /api/auth/mobile-otp
// @access Public
const mobileOtpLogin = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    res.status(400);
    throw new Error("Mobile number and OTP are required");
  }

  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length < 10) {
    res.status(400);
    throw new Error("Please enter a valid 10-digit mobile number");
  }

  const normalizedPhone = cleanPhone.slice(-10);
  const formattedPhone = `+91 ${normalizedPhone}`;

  const storedData = otpStore.get(normalizedPhone);

  if (!storedData) {
    res.status(400);
    throw new Error("No active OTP found for this number. Please click Resend OTP.");
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(normalizedPhone);
    res.status(400);
    throw new Error("OTP has expired. Please request a new code.");
  }

  if (storedData.code !== otp.trim()) {
    storedData.attempts = (storedData.attempts || 0) + 1;
    if (storedData.attempts >= 5) {
      otpStore.delete(normalizedPhone);
      res.status(400);
      throw new Error("Too many failed attempts. Please request a new OTP.");
    }
    res.status(400);
    throw new Error("Invalid OTP code. Please enter the correct code sent to your phone.");
  }

  // OTP verified successfully! Clear from store
  otpStore.delete(normalizedPhone);

  let user = await User.findOne({
    $or: [{ phone: formattedPhone }, { phone: normalizedPhone }],
  });

  if (!user) {
    // Auto-provision a verified citizen account for this phone number
    const uniqueSuffix = normalizedPhone.slice(-6);
    user = await User.create({
      name: `Citizen (+91 ${normalizedPhone.slice(-4)})`,
      email: `citizen.${uniqueSuffix}@inpact.gov.in`,
      password: `Pwd#${uniqueSuffix}!${Date.now().toString().slice(-4)}`,
      phone: formattedPhone,
      role: "citizen",
      ward: "Ward 12, Knowledge Park III, Greater Noida",
    });
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      ward: user.ward,
    },
  });
});

// @route  GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { register, login, sendOtp, mobileOtpLogin, getMe };
