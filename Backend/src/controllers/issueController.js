const Issue = require("../models/Issue");
const asyncHandler = require("../middleware/asyncHandler");
const { ISSUE_STATUSES } = require("../config/constants");

// @route  GET /api/issues
// @query  status, severity, category, department, lat, lng, radiusKm, page, limit
// @access Public (citizens see all; admins may later get extra fields)
const getIssues = asyncHandler(async (req, res) => {
  const { status, severity, category, department, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (severity) filter.severity = severity;
  if (category) filter.category = category;
  if (department) filter.department = department;

  const skip = (Number(page) - 1) * Number(limit);

  const [issues, total] = await Promise.all([
    Issue.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("reportedBy", "name ward"),
    Issue.countDocuments(filter),
  ]);

  // Derive hasUpvoted per-request from the logged-in user, rather than
  // trusting anything the client sends — matches IssueCard.jsx's hasUpvoted prop.
  const userId = req.user?._id?.toString();
  const payload = issues.map((issue) => ({
    ...issue.toJSON(),
    hasUpvoted: userId ? issue.upvotedBy.some((id) => id.toString() === userId) : false,
  }));

  res.json({
    success: true,
    count: payload.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    issues: payload,
  });
});

// @route  GET /api/issues/:id
// @access Public
const getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate("reportedBy", "name ward");
  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }

  const userId = req.user?._id?.toString();
  res.json({
    success: true,
    issue: {
      ...issue.toJSON(),
      hasUpvoted: userId ? issue.upvotedBy.some((id) => id.toString() === userId) : false,
    },
  });
});

// @route  POST /api/issues
// @access Private (citizen)
const createIssue = asyncHandler(async (req, res) => {
  const { title, description, category, severity, location, imageUrl } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error("Title, description, and category are required");
  }

  const issue = await Issue.create({
    title,
    description,
    category,
    severity,
    location,
    imageUrl,
    reportedBy: req.user._id,
    statusHistory: [{ status: "reported", changedBy: req.user._id }],
  });

  res.status(201).json({ success: true, issue });
});

// @route  PATCH /api/issues/:id/status
// @access Private (admin only)
const updateIssueStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  if (!ISSUE_STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${ISSUE_STATUSES.join(", ")}`);
  }

  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }

  issue.status = status;
  issue.statusHistory.push({ status, changedBy: req.user._id, note });
  await issue.save();

  res.json({ success: true, issue });
});

// @route  POST /api/issues/:id/upvote
// @access Private (citizen) — toggles upvote on/off for the logged-in user
const toggleUpvote = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }

  const userId = req.user._id.toString();
  const alreadyUpvoted = issue.upvotedBy.some((id) => id.toString() === userId);

  if (alreadyUpvoted) {
    issue.upvotedBy = issue.upvotedBy.filter((id) => id.toString() !== userId);
  } else {
    issue.upvotedBy.push(req.user._id);
  }

  await issue.save();

  res.json({
    success: true,
    upvotes: issue.upvotedBy.length,
    hasUpvoted: !alreadyUpvoted,
  });
});

// @route  GET /api/issues/stats
// @access Private (admin) — powers the StatCard widgets on the gov dashboard
const getIssueStats = asyncHandler(async (req, res) => {
  const [totalActive, critical, resolvedThisMonth, byStatus] = await Promise.all([
    Issue.countDocuments({ status: { $ne: "resolved" } }),
    Issue.countDocuments({ severity: "critical", status: { $ne: "resolved" } }),
    Issue.countDocuments({
      status: "resolved",
      updatedAt: { $gte: new Date(new Date().setDate(1)) },
    }),
    Issue.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  res.json({
    success: true,
    stats: {
      totalActive,
      critical,
      resolvedThisMonth,
      byStatus: byStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
    },
  });
});

module.exports = {
  getIssues,
  getIssueById,
  createIssue,
  updateIssueStatus,
  toggleUpvote,
  getIssueStats,
};
