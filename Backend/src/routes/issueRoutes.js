const express = require("express");
const {
  getIssues,
  getIssueById,
  createIssue,
  updateIssueStatus,
  toggleUpvote,
  getIssueStats,
} = require("../controllers/issueController");
const { protect, authorize, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// IMPORTANT: /stats must be registered before /:id, or Express will try to
// treat "stats" as an :id param and hit getIssueById instead.
router.get("/stats", protect, authorize("admin"), getIssueStats);

router.get("/", optionalAuth, getIssues);
router.get("/:id", optionalAuth, getIssueById);
router.post("/", protect, authorize("citizen"), createIssue);
router.patch("/:id/status", protect, authorize("admin"), updateIssueStatus);
router.post("/:id/upvote", protect, toggleUpvote);

module.exports = router;
