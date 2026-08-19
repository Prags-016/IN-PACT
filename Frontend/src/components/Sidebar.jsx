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
    { id: "overview", label: "Dashboard Overview", labelHi: "डैशबोर्ड विवरण", icon: "📊" },
    { id: "report", label: "Lodge Grievance", labelHi: "शिकायत दर्ज करें", icon: "📝" },
    { id: "track", label: "Track Complaints", labelHi: "शिकायत स्थिति", icon: "🔍", badge: "Live" },
    { id: "map", label: "Ward GIS Map", labelHi: "वार्ड मानचित्र", icon: "🗺️" },
    { id: "community", label: "Community Feed", labelHi: "सामुदायिक मुद्दे", icon: "👥" }
  ];

  const govNavItems = [
    { id: "overview", label: "Executive Command", labelHi: "कार्यकारी समीक्षा", icon: "🏛️" },
    { id: "triage", label: "Grievance Triage Queue", labelHi: "शिकायत प्रेषण", icon: "📋", count: pendingCount },
    { id: "heatmap", label: "GIS Heatmap & Geo", labelHi: "जीआईएस हॉटस्पॉट", icon: "📍" },
    { id: "predictive", label: "Predictive Civic Defense", labelHi: "पूर्वानुमान अलर्ट", icon: "🧠", alert: true },
    { id: "departments", label: "Department SLA Teams", labelHi: "विभागीय मैट्रिक्स", icon: "🏢" },
    { id: "reports", label: "Statutory Audit Reports", labelHi: "ऑडिट रिपोर्ट", icon: "📈" }
  ];

  const items = role === "admin" ? govNavItems : citizenNavItems;

  return (
    <aside className="gov-dashboard-sidebar">
      <div className="gov-sidebar-title">
        {role === "admin" ? "EXECUTIVE OFFICER PORTAL" : "CITIZEN SERVICES DIRECTORY"}
      </div>

      <ul className="gov-sidebar-menu">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                className={`gov-sidebar-link ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (item.id === "report" && onNewGrievance) {
                    onNewGrievance();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <div className="sidebar-labels-col">
                  <span className="sidebar-label-en">{item.label}</span>
                  <span className="sidebar-label-hi">{item.labelHi}</span>
                </div>

                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                {item.count && <span className="sidebar-count">{item.count}</span>}
                {item.alert && <span className="sidebar-alert-dot" title="Predictive Anomalies"></span>}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="gov-sidebar-footer">
        {role === "admin" ? (
          <div className="sidebar-gov-cert">
            <span className="cert-icon">🔒</span>
            <div className="cert-text">
              <strong>NIC Certified Intranet</strong>
              <p>Section 65B Digital Evidence Logging Active</p>
            </div>
          </div>
        ) : (
          <div className="sidebar-gov-help">
            <span className="help-icon">📞</span>
            <div className="help-text">
              <strong>National Helpline: 1913</strong>
              <p>Toll-free 24x7 Citizen Grievance Assistance</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
