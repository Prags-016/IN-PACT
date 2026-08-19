import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import IssueCard from "../components/IssueCard";
import MapView from "../components/MapView";

export default function GovernmentDashboard({ currentUser, navigateTo }) {
  const [activeTab, setActiveTab] = useState("overview"); // overview | triage | heatmap | predictive | departments | reports
  const [filterDept, setFilterDept] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeAlertNotification, setActiveAlertNotification] = useState(null);

  // Government Live Grievance Database
  const [grievances, setGrievances] = useState([
    {
      id: "INP-2026-9401",
      title: "Severe Road Cave-in & Pothole Cluster after Heavy Rains",
      description: "Multiple 2-ft craters across a 500m arterial segment causing critical vehicle damage and gridlock.",
      category: "Roads & Infrastructure",
      department: "PWD",
      severity: "critical",
      status: "in_progress",
      location: "Knowledge Park III, Main Access Road",
      timestamp: "35 mins ago",
      upvotes: 68,
      aiConfidence: 97,
      slaRemaining: "4 hrs (Critical SLA)",
      assignedOfficer: "Er. S.K. Sharma (EE, PWD)",
      aiTags: ["High Accident Probability", "Multi-Vehicle Impact", "Asphalt Failure"]
    },
    {
      id: "INP-2026-9388",
      title: "Main 600mm Drinking Water Pipeline Burst",
      description: "Pressurized clean water gushing onto the road. Over 1,200 households reporting total loss of water supply.",
      category: "Water Supply",
      department: "UP Jal Nigam",
      severity: "critical",
      status: "submitted",
      location: "Gamma 2 Sector Road, Near Community Hall",
      timestamp: "1 hour ago",
      upvotes: 94,
      aiConfidence: 99,
      slaRemaining: "3 hrs (Emergency SLA)",
      assignedOfficer: "A.K. Srivastava (AE, Jal Nigam)",
      aiTags: ["Resource Wastage", "Household Disruption", "Sub-surface Erosion"]
    },
    {
      id: "INP-2026-9352",
      title: "Commercial 11kV Transformer Overheating & Sparking",
      description: "Severe audible buzzing and smoke plumes from pole-mounted transformer during peak evening load.",
      category: "Electricity",
      department: "NPCL Power",
      severity: "critical",
      status: "in_progress",
      location: "Alpha 1 Commercial Belt, Block B",
      timestamp: "2 hours ago",
      upvotes: 112,
      aiConfidence: 98,
      slaRemaining: "1.5 hrs (Life Safety Hazard)",
      assignedOfficer: "R.K. Gupta (Divisional Engineer)",
      aiTags: ["Fire Hazard Risk", "High Tension Line", "Commercial Zone"]
    },
    {
      id: "INP-2026-9290",
      title: "Illegal Solid Waste Dumping & Open Burning",
      description: "Unregulated industrial plastic scrap dumped along vacant plot. Strong toxic smoke drifting into residential sector.",
      category: "Sanitation & Environment",
      department: "GNIDA Sanitation",
      severity: "high",
      status: "triaged",
      location: "Delta 2 Sector Perimeter",
      timestamp: "4 hours ago",
      upvotes: 45,
      aiConfidence: 95,
      slaRemaining: "14 hrs",
      assignedOfficer: "Dr. Vinod Pathak (Sanitary Inspector)",
      aiTags: ["Air Quality Index Impact", "Pollution Control Board Violation"]
    },
    {
      id: "INP-2026-9211",
      title: "Primary Stormwater Drain Blocked by Construction Debris",
      description: "Concrete slag and plastic clogging culvert. Silt level at 85% capacity ahead of forecasted monsoon rain.",
      category: "Drainage & Flood Control",
      department: "UP Jal Nigam",
      severity: "high",
      status: "in_progress",
      location: "Pari Chowk Junction underpass",
      timestamp: "6 hours ago",
      upvotes: 51,
      aiConfidence: 96,
      slaRemaining: "12 hrs",
      assignedOfficer: "Er. Manoj Bajpai (Drainage Wing)",
      aiTags: ["Predictive Flood Risk", "Traffic Arterial Choke"]
    },
    {
      id: "INP-2026-9145",
      title: "Cluster of 18 Non-Functional LED Streetlights",
      description: "Continuous 1.2km stretch completely unlit, creating blind spots for nighttime cyclists and pedestrians.",
      category: "Street Lighting",
      department: "GNIDA Electrical",
      severity: "medium",
      status: "resolved",
      location: "Beta 1 Institutional Greenway",
      timestamp: "Yesterday",
      upvotes: 27,
      aiConfidence: 93,
      slaRemaining: "Resolved in 18 hrs",
      assignedOfficer: "Mukesh Tiwari (Electrical Cell)",
      aiTags: ["Public Safety", "Smart City LED Grid"]
    }
  ]);

  // Predictive Governance AI Models
  const predictiveForecasts = [
    {
      id: "PRED-01",
      hazard: "Pre-Monsoon Urban Waterlogging Risk",
      probability: "94% Certainty",
      severity: "critical",
      zone: "Pari Chowk & Expressway Underpass",
      leadTime: "3 Days ahead of Rain Forecast",
      rationale: "Historical AI spatial correlation shows 5 drain chokes in 200m radius with 85% silt capacity. Expected rainfall >45mm will cause 1.5ft water accumulation.",
      preventiveAction: "Dispatch High-Capacity Super Sucker Drain Cleaning Vehicle",
      actionStatus: "pending"
    },
    {
      id: "PRED-02",
      hazard: "Grid Transformer Overload & Failure Risk",
      probability: "88% Certainty",
      severity: "high",
      zone: "Alpha 1 Commercial Center",
      leadTime: "Next 48 Hours during 6-9 PM Peak",
      rationale: "Sensor telemetry and complaint clustering show 123% peak load recurrence with thermal sensor alerts.",
      preventiveAction: "Phase Load Balancing & Auxiliary Substation Rerouting",
      actionStatus: "pending"
    },
    {
      id: "PRED-03",
      hazard: "Pothole Clustering & Structural Base Collapse",
      probability: "81% Certainty",
      severity: "high",
      zone: "Knowledge Park III Heavy Vehicle Lane",
      leadTime: "Within 5-7 Days",
      rationale: "Micro-fissures and heavy container truck density indicate imminent asphalt layer collapse.",
      preventiveAction: "Cold-Mix Bitumen Resurfacing & Heavy Vehicle Speed Control",
      actionStatus: "pending"
    }
  ];

  // Department SLA Matrix
  const departmentStats = [
    { name: "Public Works Department (PWD)", active: 184, resolved: 890, slaRate: "94.2%", avgTime: "2.8 Days", head: "Er. S.K. Sharma" },
    { name: "UP Jal Nigam (Water & Sewerage)", active: 215, resolved: 742, slaRate: "88.6%", avgTime: "3.4 Days", head: "Er. V.K. Singh" },
    { name: "NPCL State Power Distribution", active: 94, resolved: 980, slaRate: "97.1%", avgTime: "1.2 Days", head: "Er. R.K. Gupta" },
    { name: "GNIDA Solid Waste Management", active: 142, resolved: 1120, slaRate: "91.8%", avgTime: "1.9 Days", head: "Dr. Vinod Pathak" }
  ];

  // Handle status update
  const handleStatusChange = (id, newStatus) => {
    setGrievances((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: newStatus } : g))
    );
  };

  // Filtered grievances for triage
  const filteredGrievances = grievances.filter((item) => {
    if (filterDept !== "all" && item.department !== filterDept) return false;
    if (filterSeverity !== "all" && item.severity !== filterSeverity) return false;
    return true;
  });

  const handleDeployPreventive = (forecast) => {
    setActiveAlertNotification(`Preventive Action Dispatched: ${forecast.preventiveAction} sent to ${forecast.zone}!`);
    setTimeout(() => setActiveAlertNotification(null), 4000);
  };

  return (
    <div className="dashboard-layout gov-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        role="admin"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={grievances.filter((g) => g.status === "submitted" || g.status === "triaged").length}
      />

      {/* Main Command Center Content */}
      <main className="dashboard-main-content">
        {/* Top Header */}
        <header className="dashboard-header gov-dashboard-header">
          <div>
            <div className="gov-title-badge">
              <span>🏛️</span> GOVERNMENT OF UTTAR PRADESH • GREATER NOIDA AUTHORITY
            </div>
            <h2>Civic Intelligence Command Center</h2>
            <p className="header-subtitle">
              Logged in as: <strong>{currentUser?.name || "Dr. Rajesh Mehta, IAS"}</strong> ({currentUser?.designation || "District Magistrate"}) • Live AI Triaging Active
            </p>
          </div>

          <div className="header-actions">
            <button className="gov-broadcast-btn" onClick={() => setActiveTab("predictive")}>
              ⚡ View Predictive Alerts (3)
            </button>
          </div>
        </header>

        {activeAlertNotification && (
          <div className="gov-alert-toast">
            <span className="toast-icon">🚀</span>
            <span>{activeAlertNotification}</span>
          </div>
        )}

        {/* =========================================================
            TAB 1: COMMAND OVERVIEW
        ========================================================= */}
        {activeTab === "overview" && (
          <div className="dashboard-view-fade">
            {/* Top KPI Metrics Bar */}
            <div className="dashboard-stats-grid gov-stats-grid">
              <StatCard
                title="Active Grievances"
                value="1,284"
                subtitle="Triaged across 18 municipal zones"
                icon="📊"
                trend="12% resolved this week"
                trendPositive={true}
                variant="default"
              />
              <StatCard
                title="Critical Emergency Alerts"
                value={grievances.filter((g) => g.severity === "critical").length.toString()}
                subtitle="Life safety / infrastructure risk"
                icon="🚨"
                trend="Requires Immediate Officer Action"
                trendPositive={false}
                variant="critical"
              />
              <StatCard
                title="AI Auto-Routing Accuracy"
                value="98.4%"
                subtitle="NLP & Computer Vision triaging"
                icon="🎯"
                trend="+3.2% precision"
                trendPositive={true}
                variant="success"
              />
              <StatCard
                title="SLA Compliance Rate"
                value="93.8%"
                subtitle="Avg resolution: 2.9 days"
                icon="⚡"
                trend="6% better than target"
                trendPositive={true}
                variant="purple"
              />
            </div>

            {/* Split Section: GIS Map & High Urgency Triage Feed */}
            <div className="gov-overview-split">
              <div className="gov-map-panel">
                <div className="card-header-bar">
                  <div>
                    <h3>🗺️ Live GIS Hotspot & Geospatial Cluster</h3>
                    <p className="card-subtitle">Real-time incident clustering with predictive failure heat zones</p>
                  </div>
                  <button className="text-btn" onClick={() => setActiveTab("heatmap")}>
                    Expand Full GIS →
                  </button>
                </div>

                <MapView
                  issues={grievances}
                  onSelectIssue={(iss) => setSelectedIssue(iss)}
                />
              </div>

              <div className="gov-critical-panel">
                <div className="card-header-bar">
                  <div>
                    <h3>🚨 Immediate Action Queue</h3>
                    <p className="card-subtitle">Critical AI severity items with active SLA timers</p>
                  </div>
                </div>

                <div className="critical-issues-scroll">
                  {grievances
                    .filter((g) => g.severity === "critical")
                    .map((item) => (
                      <IssueCard
                        key={item.id}
                        issue={item}
                        showAdminActions={true}
                        onStatusChange={handleStatusChange}
                        onSelect={(iss) => setSelectedIssue(iss)}
                      />
                    ))}
                </div>
              </div>
            </div>

            {/* Predictive Governance Teaser Banner */}
            <div className="predictive-banner-card" onClick={() => setActiveTab("predictive")}>
              <div className="predictive-banner-content">
                <div className="pred-tag">🧠 AI PREDICTIVE CIVIC DEFENSE ACTIVE</div>
                <h3>3 High-Probability Infrastructure Hazards Forecasted for Greater Noida</h3>
                <p>
                  IN-PACT AI detected an upcoming drain choke risk at Pari Chowk underpass and an 11kV transformer stress in Alpha 1. Take preventive action before citizens experience failures.
                </p>
              </div>
              <button className="predictive-action-btn">
                Launch Predictive Action Center →
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: GRIEVANCE TRIAGE
        ========================================================= */}
        {activeTab === "triage" && (
          <div className="dashboard-view-fade">
            <div className="triage-toolbar">
              <div className="triage-filters">
                <div className="filter-item">
                  <label htmlFor="deptFilter">Filter Department:</label>
                  <select
                    id="deptFilter"
                    className="filter-select"
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                  >
                    <option value="all">All Departments (1,284)</option>
                    <option value="PWD">Public Works Department (PWD)</option>
                    <option value="UP Jal Nigam">UP Jal Nigam (Water & Drainage)</option>
                    <option value="NPCL Power">NPCL Power & Distribution</option>
                    <option value="GNIDA Sanitation">GNIDA Sanitation & Waste</option>
                  </select>
                </div>

                <div className="filter-item">
                  <label htmlFor="severityFilter">AI Severity:</label>
                  <select
                    id="severityFilter"
                    className="filter-select"
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">🚨 Critical Only</option>
                    <option value="high">⚠️ High</option>
                    <option value="medium">🟡 Moderate</option>
                  </select>
                </div>
              </div>

              <div className="triage-quick-stats">
                Showing <strong>{filteredGrievances.length}</strong> active grievances
              </div>
            </div>

            <div className="grievance-cards-grid">
              {filteredGrievances.map((item) => (
                <div key={item.id} className="gov-triage-card-wrapper">
                  <IssueCard
                    issue={item}
                    showAdminActions={true}
                    onStatusChange={handleStatusChange}
                    onSelect={(iss) => setSelectedIssue(iss)}
                  />
                  <div className="triage-officer-bar">
                    <span>👤 Assigned: <strong>{item.assignedOfficer || "Auto-Allocated to On-Duty Engineer"}</strong></span>
                    <span className="ai-sla-pill">⏳ {item.slaRemaining}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: GIS HEATMAP & GEO
        ========================================================= */}
        {activeTab === "heatmap" && (
          <div className="dashboard-view-fade">
            <div className="view-heading-bar">
              <div>
                <h3>Geographic Information System (GIS) Intelligence Grid</h3>
                <p>Real-time spatial mapping, recurring complaint clusters, and municipal ward heatmaps.</p>
              </div>
            </div>

            <MapView
              issues={grievances}
              onSelectIssue={(iss) => setSelectedIssue(iss)}
            />
          </div>
        )}

        {/* =========================================================
            TAB 4: PREDICTIVE GOVERNANCE INSIGHTS
        ========================================================= */}
        {activeTab === "predictive" && (
          <div className="dashboard-view-fade">
            <div className="view-heading-bar">
              <div>
                <h3>🧠 AI Predictive Governance & Preventive Action</h3>
                <p>
                  Algorithms cross-reference historical grievance recurrence, weather forecasts, sensor data, and road load to forecast infrastructure hazards.
                </p>
              </div>
            </div>

            <div className="predictive-cards-stack">
              {predictiveForecasts.map((forecast) => (
                <div key={forecast.id} className={`predictive-card ${forecast.severity}`}>
                  <div className="predictive-card-header">
                    <div className="hazard-title-group">
                      <span className="hazard-badge">● PREDICTIVE ANOMALY DETECTED</span>
                      <h4>{forecast.hazard}</h4>
                    </div>
                    <div className="probability-badge">
                      <span>Forecast Confidence:</span>
                      <strong>{forecast.probability}</strong>
                    </div>
                  </div>

                  <div className="predictive-card-body">
                    <div className="predictive-grid-info">
                      <div className="info-cell">
                        <span className="label">Target Zone</span>
                        <strong className="value">📍 {forecast.zone}</strong>
                      </div>
                      <div className="info-cell">
                        <span className="label">Estimated Lead Time</span>
                        <strong className="value">⏳ {forecast.leadTime}</strong>
                      </div>
                      <div className="info-cell">
                        <span className="label">Risk Severity</span>
                        <strong className={`value severity-${forecast.severity}`}>
                          {forecast.severity.toUpperCase()}
                        </strong>
                      </div>
                    </div>

                    <div className="predictive-rationale">
                      <strong>AI Root Cause Analysis:</strong>
                      <p>{forecast.rationale}</p>
                    </div>

                    <div className="predictive-action-row">
                      <div className="action-recommendation">
                        <span className="rec-label">Recommended Preventive Action:</span>
                        <span className="rec-text">{forecast.preventiveAction}</span>
                      </div>
                      <button
                        className="dispatch-preventive-btn"
                        onClick={() => handleDeployPreventive(forecast)}
                      >
                        ⚡ Authorize & Dispatch Field Team
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: DEPARTMENT SLA & TEAMS
        ========================================================= */}
        {activeTab === "departments" && (
          <div className="dashboard-view-fade">
            <div className="view-heading-bar">
              <div>
                <h3>Department Performance & SLA Adherence</h3>
                <p>Inter-departmental performance monitoring, resolution efficiency, and escalation matrices.</p>
              </div>
            </div>

            <div className="department-matrix-table-card">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Department / Agency</th>
                    <th>Nodal Head</th>
                    <th>Active Issues</th>
                    <th>Resolved (MTD)</th>
                    <th>SLA Compliance</th>
                    <th>Avg Resolution</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentStats.map((dept, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{dept.name}</strong>
                      </td>
                      <td>{dept.head}</td>
                      <td>
                        <span className="active-tag">{dept.active}</span>
                      </td>
                      <td>
                        <span className="resolved-tag">{dept.resolved}</span>
                      </td>
                      <td>
                        <div className="sla-progress-group">
                          <span className="sla-value">{dept.slaRate}</span>
                          <div className="sla-bar-bg">
                            <div className="sla-bar-fill" style={{ width: dept.slaRate }}></div>
                          </div>
                        </div>
                      </td>
                      <td>{dept.avgTime}</td>
                      <td>
                        <span className="dept-healthy-badge">● Operational</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 6: GOV AI REPORTS
        ========================================================= */}
        {activeTab === "reports" && (
          <div className="dashboard-view-fade">
            <div className="view-heading-bar">
              <div>
                <h3>Autonomous AI Executive Summary & Reports</h3>
                <p>Automated weekly intelligence briefs generated for District Magistrate & State Secretariat.</p>
              </div>
            </div>

            <div className="report-brief-card">
              <div className="brief-header">
                <span className="brief-badge">🤖 AUTONOMOUS AI WEEKLY INTELLIGENCE BRIEF</span>
                <span className="brief-date">Period: August 2026 • Greater Noida Zone</span>
              </div>

              <div className="brief-content">
                <h4>Executive Summary:</h4>
                <p>
                  Over the past 7 days, IN-PACT processed <strong>1,418 citizen grievances</strong>. 
                  Autonomous NLP classification achieved a <strong>98.4% precision rate</strong> in routing tickets directly to executive engineers, reducing manual triage latency from 36 hours to under 4 minutes.
                </p>

                <h4>Key Spatial Discoveries:</h4>
                <ul>
                  <li>
                    <strong>Knowledge Park Corridor:</strong> Pothole complaints surged by 34% following drainage overflow from construction sites. Recommended road resurfacing scheduled for PWD Division 2.
                  </li>
                  <li>
                    <strong>Alpha 1 Commercial Zone:</strong> Recurrent peak-hour transformer sparking detected. 2 sub-feeders rerouted to prevent power failure.
                  </li>
                  <li>
                    <strong>Resolution Efficiency:</strong> Average citizen turnaround time improved by <strong>68%</strong> compared to traditional paper/call center mechanisms.
                  </li>
                </ul>
              </div>

              <div className="brief-footer">
                <button className="primary-action-btn" onClick={() => alert("Report downloaded as PDF/CSV.")}>
                  📄 Download Official PDF Report
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Selected Issue Modal */}
      {selectedIssue && (
        <div className="modal-backdrop" onClick={() => setSelectedIssue(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-badge gov-badge-sm">
                OFFICER INSPECTION • TICKET {selectedIssue.id}
              </div>
              <button className="modal-close" onClick={() => setSelectedIssue(null)}>✕</button>
            </div>

            <div className="modal-body">
              <h3 className="modal-title">{selectedIssue.title}</h3>

              <div className="modal-tags">
                <span className={`modal-tag-severity ${selectedIssue.severity}`}>
                  ● {selectedIssue.severity?.toUpperCase()} PRIORITY
                </span>
                <span className="modal-tag-dept">
                  🏢 {selectedIssue.department}
                </span>
                <span className="modal-tag-cat">
                  {selectedIssue.category}
                </span>
              </div>

              <div className="modal-desc-box">
                <h4>Incident Description</h4>
                <p>{selectedIssue.description}</p>
                <div className="modal-location">
                  📍 <strong>Location:</strong> {selectedIssue.location}
                </div>
              </div>

              {selectedIssue.aiTags && (
                <div className="ai-tags-section">
                  <span className="ai-tags-label">AI Detected Anomaly Attributes:</span>
                  <div className="tags-flex">
                    {selectedIssue.aiTags.map((tag, i) => (
                      <span key={i} className="ai-tag-chip">⚡ {tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-ai-box">
                <div className="ai-badge-sm">
                  <span>✨</span> TRIAGE & JURISDICTION METRICS
                </div>
                <div className="ai-metrics-row">
                  <div>
                    <span>AI Confidence</span>
                    <strong>{selectedIssue.aiConfidence || 97}%</strong>
                  </div>
                  <div>
                    <span>SLA Countdown</span>
                    <strong>{selectedIssue.slaRemaining || "4 Hours"}</strong>
                  </div>
                  <div>
                    <span>Assigned Lead</span>
                    <strong>{selectedIssue.assignedOfficer || "Er. S.K. Sharma"}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <select
                className="modal-status-select"
                value={selectedIssue.status}
                onChange={(e) => {
                  handleStatusChange(selectedIssue.id, e.target.value);
                  setSelectedIssue((prev) => ({ ...prev, status: e.target.value }));
                }}
              >
                <option value="submitted">Status: Submitted</option>
                <option value="triaged">Status: Triaged & Assigned</option>
                <option value="in_progress">Status: Work In Progress</option>
                <option value="resolved">Status: Resolved & Verified</option>
              </select>

              <button className="modal-dismiss-btn" onClick={() => setSelectedIssue(null)}>
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
