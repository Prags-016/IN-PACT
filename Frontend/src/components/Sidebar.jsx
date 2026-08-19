import React from "react";

export default function Sidebar({
  role = "citizen",
  activeTab,
  setActiveTab,
  onNewGrievance,
  systemAlertsCount = 3,
  pendingCount = 14
}) {
  const citizenNavItems = [
    { id: "overview", label: "My Overview", icon: "📊" },
    { id: "report", label: "File Grievance", icon: "📝" },
    { id: "track", label: "Track Complaints", icon: "🔍", badge: "Live" },
    { id: "map", label: "Live Civic Map", icon: "🗺️" },
    { id: "community", label: "Community Feed", icon: "👥" }
  ];

  const govNavItems = [
    { id: "overview", label: "Intelligence Command", icon: "⚡" },
    { id: "triage", label: "Grievance Triage", icon: "📋", count: pendingCount },
    { id: "heatmap", label: "GIS Heatmap & Geo", icon: "📍" },
    { id: "predictive", label: "Predictive Insights", icon: "🧠", alert: true },
    { id: "departments", label: "Dept SLA & Teams", icon: "🏢" },
    { id: "reports", label: "Gov AI Reports", icon: "📈" }
  ];

  const items = role === "admin" ? govNavItems : citizenNavItems;

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-section-title">
        {role === "admin" ? "OFFICER CONTROLS" : "CITIZEN SERVICES"}
      </div>

      <ul className="sidebar-menu">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                className={`sidebar-link ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (item.id === "report" && onNewGrievance) {
                    onNewGrievance();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>

                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                {item.count && <span className="sidebar-count">{item.count}</span>}
                {item.alert && <span className="sidebar-alert-dot" title="AI Anomaly Alerts"></span>}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        {role === "admin" ? (
          <div className="sidebar-ai-status">
            <div className="status-indicator">
              <span className="pulse-dot"></span>
              <span className="status-title">AI Engine Active</span>
            </div>
            <p className="status-detail">NLP & Computer Vision routing 98.4% accurately</p>
          </div>
        ) : (
          <div className="sidebar-help-card">
            <span className="help-icon">💡</span>
            <div className="help-text">
              <strong>Need Emergency Help?</strong>
              <p>Call 112 for Police / 101 for Fire Emergency.</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
