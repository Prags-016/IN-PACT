// Single source of truth for the Issue status lifecycle.
// This MUST match the STATUS_CONFIG keys in the frontend's StatusBadge.jsx
// (Frontend/src/StatusBadge.jsx) — if you add/rename a status, update both.
const ISSUE_STATUSES = [
  "reported",
  "verified",
  "assigned",
  "in_progress",
  "resolved",
  "citizen_verification_pending",
  "reopened",
  "escalated",
];

const SEVERITY_LEVELS = ["low", "medium", "high", "critical"];

const USER_ROLES = ["citizen", "admin"];

// Default SLA (in hours) per severity — used to compute slaDeadline on creation.
const SLA_HOURS_BY_SEVERITY = {
  critical: 24,
  high: 72,
  medium: 168, // 7 days
  low: 336, // 14 days
};

module.exports = {
  ISSUE_STATUSES,
  SEVERITY_LEVELS,
  USER_ROLES,
  SLA_HOURS_BY_SEVERITY,
};
