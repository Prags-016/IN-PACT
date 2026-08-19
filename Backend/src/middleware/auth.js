const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/User");

// Verifies the JWT from the Authorization header and attaches req.user.
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized — user no longer exists");
    }
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized — invalid or expired token");
  }
});

// Restricts a route to one or more roles, e.g. authorize("admin")
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error(`Role '${req.user?.role}' is not permitted to perform this action`);
  }
  next();
};

// Like `protect`, but doesn't reject the request if no/invalid token is present —
// just leaves req.user undefined. Used on public GET routes that behave slightly
// differently for a logged-in user (e.g. hasUpvoted).
const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (err) {
      // invalid/expired token on an optional route — just proceed unauthenticated
    }
  }
  next();
});

module.exports = { protect, authorize, optionalAuth };
