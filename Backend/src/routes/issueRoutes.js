const express = require("express");
const {
  getIssues,
  getIssueById,
  createIssue,
  updateIssueStatus,
  toggleUpvote,
  getIssueStats,
  getDepartmentStats,
} = require("../controllers/issueController");
const { protect, authorize, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// IMPORTANT: /stats and /stats/departments must be registered before /:id, or
// Express will try to treat "stats" as an :id param and hit getIssueById instead.
// Any authenticated user can view /stats (citizens need ward resolution rate too,
// e.g. CitizenDashboard.jsx's "Ward Resolution Rate" card) — nothing here is
// officer-sensitive. /stats/departments IS the officer SLA scorecard, admin-only.
router.get("/stats/departments", protect, authorize("admin"), getDepartmentStats);
router.get("/stats", protect, getIssueStats);

router.get("/", optionalAuth, getIssues);
router.get("/:id", optionalAuth, getIssueById);
router.post("/", protect, authorize("citizen"), createIssue);
router.patch("/:id/status", protect, authorize("admin"), updateIssueStatus);
router.post("/:id/upvote", protect, toggleUpvote);

module.exports = router;