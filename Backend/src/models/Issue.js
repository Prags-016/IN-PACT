const mongoose = require("mongoose");
const {
  ISSUE_STATUSES,
  SEVERITY_LEVELS,
  SLA_HOURS_BY_SEVERITY,
} = require("../config/constants");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },

    category: { type: String, required: true, trim: true },
    department: { type: String, trim: true, default: "Auto-Routing" },

    severity: {
      type: String,
      enum: SEVERITY_LEVELS,
      default: "medium",
    },
    status: {
      type: String,
      enum: ISSUE_STATUSES,
      default: "reported",
    },

    location: {
      address: { type: String, trim: true },
      lat: { type: Number },
      lng: { type: Number },
    },

    imageUrl: { type: String, default: "" },

    // Who filed it
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Upvotes — store the user IDs so we can derive hasUpvoted per-request
    // instead of trusting a client-supplied boolean/count.
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // AI triage metadata (populate these once the AI/NLP service is wired in;
    // leave null rather than faking a number, unlike the current frontend default)
    aiConfidence: { type: Number, min: 0, max: 100, default: null },
    riskScore: { type: Number, min: 0, max: 100, default: null },

    slaDeadline: { type: Date },

    statusHistory: [
      {
        status: { type: String, enum: ISSUE_STATUSES },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        changedAt: { type: Date, default: Date.now },
        note: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

// Auto-set the SLA deadline based on severity when an issue is first created.
issueSchema.pre("save", function setSlaDeadline(next) {
  if (this.isNew && !this.slaDeadline) {
    const hours = SLA_HOURS_BY_SEVERITY[this.severity] ?? SLA_HOURS_BY_SEVERITY.medium;
    this.slaDeadline = new Date(Date.now() + hours * 60 * 60 * 1000);
  }
  next();
});

// Virtual: upvotes count, matching IssueCard.jsx's `upvotes` number prop
issueSchema.virtual("upvotes").get(function upvotesCount() {
  return this.upvotedBy.length;
});

issueSchema.set("toJSON", { virtuals: true });
issueSchema.index({ status: 1, severity: 1, category: 1 });
issueSchema.index({ "location.lat": 1, "location.lng": 1 });

module.exports = mongoose.model("Issue", issueSchema);
