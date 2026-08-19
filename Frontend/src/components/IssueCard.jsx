import React from "react";

export default function IssueCard({
  issue,
  onUpvote,
  onSelect,
  showAdminActions = false,
  onStatusChange
}) {
  const {
    id,
    title,
    description,
    category,
    department,
    severity = "medium",
    status = "in_progress",
    location,
    upvotes = 0,
    hasUpvoted = false,
    timestamp,
    imageUrl,
    aiConfidence = 94,
    slaRemaining
  } = issue;

  const severityConfig = {
    critical: { label: "Critical (Emergency)", class: "priority-critical" },
    high: { label: "High Priority", class: "priority-high" },
    medium: { label: "Moderate", class: "priority-medium" },
    low: { label: "Low Priority", class: "priority-low" }
  };

  const statusConfig = {
    submitted: { text: "Registered / Triaging", class: "status-submitted" },
    triaged: { text: "Assigned to Nodal Officer", class: "status-triaged" },
    in_progress: { text: "In Progress (Field Action)", class: "status-progress" },
    resolved: { text: "Resolved & Closed", class: "status-resolved" }
  };

  const currentSeverity = severityConfig[severity.toLowerCase()] || severityConfig.medium;
  const currentStatus = statusConfig[status.toLowerCase()] || statusConfig.in_progress;

  return (
    <div className={`gov-issue-card severity-edge-${severity.toLowerCase()}`}>
      <div className="gov-issue-top">
        <div className="issue-ref-tags">
          <span className="gov-ref-pill">{id}</span>
          <span className={`priority-badge ${currentSeverity.class}`}>
            {currentSeverity.label}
          </span>
          <span className="dept-tag">🏢 {department || "Nodal Department"}</span>
          <span className="cat-tag">{category}</span>
        </div>

        <span className={`status-badge-inline ${currentStatus.class}`}>
          {currentStatus.text}
        </span>
      </div>

      <h4 className="gov-issue-title" onClick={() => onSelect && onSelect(issue)}>
        {title}
      </h4>

      <p className="gov-issue-desc">{description}</p>

      {imageUrl && (
        <div className="gov-issue-image-box">
          <img src={imageUrl} alt="Official grievance attachment" className="issue-photo" />
        </div>
      )}

      <div className="gov-issue-meta">
        <div className="meta-block">
          <span className="m-icon">📍</span>
          <span>{location}</span>
        </div>
        <div className="meta-block">
          <span className="m-icon">🕒</span>
          <span>{timestamp || "Just now"}</span>
        </div>
        {slaRemaining && (
          <div className="meta-block sla-block">
            <span className="m-icon">⏳</span>
            <strong>SLA: {slaRemaining}</strong>
          </div>
        )}
      </div>

      <div className="gov-issue-footer">
        <div className="gov-audit-badge" title="National e-Governance AI Triage Verification">
          <span>⚖️</span> Triage Precision: <strong>{aiConfidence}%</strong>
        </div>

        <div className="gov-issue-actions">
          {onUpvote && (
            <button
              className={`gov-upvote-btn ${hasUpvoted ? "voted" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onUpvote(id);
              }}
              title="Citizen endorsement to elevate priority"
            >
              👍 Support ({upvotes})
            </button>
          )}

          {showAdminActions && onStatusChange ? (
            <select
              className="gov-status-select-sm"
              value={status}
              onChange={(e) => onStatusChange(id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="submitted">Registered</option>
              <option value="triaged">Assigned to Nodal EE</option>
              <option value="in_progress">Field Action In Progress</option>
              <option value="resolved">Resolved & Closed</option>
            </select>
          ) : (
            <button
              className="gov-view-details-btn"
              onClick={() => onSelect && onSelect(issue)}
            >
              View Official Record →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
