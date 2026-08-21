import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import IssueCard from "../components/IssueCard";
import MapView from "../components/MapView";
import { getIssues, updateIssueStatus, getStats, getDepartmentStats } from "../services/issuesService";

export default function GovernmentDashboard({ currentUser, navigateTo }) {
  const [activeTab, setActiveTab] = useState("overview"); // overview | triage | heatmap | predictive | departments | reports
  const [filterDept, setFilterDept] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeAlertNotification, setActiveAlertNotification] = useState(null);

  // Government Live Grievance Database — fetched from the real backend
  const [grievances, setGrievances] = useState([]);
  const [loadingGrievances, setLoadingGrievances] = useState(true);
  const [grievancesError, setGrievancesError] = useState(null);

  // Overview stats. NOTE: only totalActive, critical, and resolvedThisMonth
  // come from a real endpoint. "24-Hr Disposal Rate" and "Predictive Alerts"
  // have no backend behind them (no AI/ML pipeline built yet) — those two
  // StatCards stay as illustrative placeholders, clearly not live numbers.
  const [overviewStats, setOverviewStats] = useState(null);
  const [deptStats, setDeptStats] = useState([]);
  const [loadingDeptStats, setLoadingDeptStats] = useState(true);

  // Maps a raw backend Issue to what this component's JSX expects: `id` alias
  // for _id (so IssueCard's internal destructuring still works unchanged).
  const mapIssue = (issue) => ({ ...issue, id: issue._id });

  const loadGrievances = () => {
    setLoadingGrievances(true);
    setGrievancesError(null);
    getIssues()
      .then((issues) => setGrievances(issues.map(mapIssue)))
      .catch((err) => setGrievancesError(err.message))
      .finally(() => setLoadingGrievances(false));
  };

  const loadDeptStats = () => {
    setLoadingDeptStats(true);
    getDepartmentStats()
      .then(setDeptStats)
      .catch(() => setDeptStats([]))
      .finally(() => setLoadingDeptStats(false));
  };

  useEffect(() => {
    loadGrievances();
    loadDeptStats();
    getStats()
      .then(setOverviewStats)
      .catch(() => { });
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const previous = grievances;
    // Optimistic update
    setGrievances((prev) => prev.map((g) => (g.id === id ? { ...g, status: newStatus } : g)));
    try {
      const updated = await updateIssueStatus(id, { status: newStatus });
      setGrievances((prev) => prev.map((g) => (g.id === id ? mapIssue(updated) : g)));
      loadDeptStats(); // department scorecard numbers change when status changes
    } catch (err) {
      setGrievances(previous); // rollback
      alert(`Couldn't update status: ${err.message}`);
    }
  };

  const handleDepartmentChange = async (id, newDept) => {
    const target = grievances.find((g) => g.id === id);
    if (!target) return;
    const previous = grievances;
    setGrievances((prev) => prev.map((g) => (g.id === id ? { ...g, department: newDept } : g)));
    try {
      // The status endpoint doubles as the department-reassignment endpoint —
      // keep the current status unchanged, only the department field updates.
      const updated = await updateIssueStatus(id, { status: target.status, department: newDept });
      setGrievances((prev) => prev.map((g) => (g.id === id ? mapIssue(updated) : g)));
      loadDeptStats();
    } catch (err) {
      setGrievances(previous);
      alert(`Couldn't reassign department: ${err.message}`);
    }
  };

  const handleDispatchEmergencySquad = (issue) => {
    // No real dispatch system exists yet — this stays a UI-only simulation.
    setActiveAlertNotification(`Emergency Field Maintenance Squad successfully dispatched to ${issue.location?.address || issue.location?.ward || "the reported location"} for ${issue.refId}. Notification broadcasted to Nodal Engineer.`);
    setTimeout(() => setActiveAlertNotification(null), 5000);
  };

  // filterDept now uses the backend's real canonical codes (PWD, JAL_NIGAM,
  // NPCL, SANITATION, GNIDA_ADMIN) for an exact match, instead of the old
  // substring-guessing against free-text department names.
  const filteredGrievances = grievances.filter((g) => {
    const matchDept = filterDept === "all" || g.department === filterDept;
    const matchSev = filterSeverity === "all" || g.severity.toLowerCase() === filterSeverity.toLowerCase();
    return matchDept && matchSev;
  });

  return (
    <div className="gov-dashboard-wrapper officer-dashboard-wrapper">
      {/* Official Government Officer Header Strip */}
      <div className="gov-dash-header-strip officer-header-strip">
        <div className="gov-container dash-header-inner">
          <div className="dash-header-left">
            <span className="gov-emblem-icon">🏛️</span>
            <div>
              <div className="dash-sub">
                DISTRICT ADMINISTRATION • GREATER NOIDA METROPOLIS
              </div>
              <h2 className="dash-title">
                Executive Grievance Command Console (अधिकारी नियंत्रण कक्ष)
              </h2>
            </div>
          </div>

          <div className="dash-header-right">
            <div className="officer-badge-box">
              <span className="officer-icon">🎖️</span>
              <div className="officer-info">
                <strong className="officer-name">{currentUser?.name || "Dr. Rajesh Mehta, IAS"}</strong>
                <span className="officer-meta">
                  {currentUser?.designation || "District Magistrate & Municipal Commissioner"} &bull;{" "}
                  <span className="clearance-badge">{currentUser?.clearanceLevel || "Level 1 Executive"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeAlertNotification && (
        <div className="gov-alert-banner">
          <span>⚡ {activeAlertNotification}</span>
        </div>
      )}

      <div className="gov-container dash-layout">
        {/* Left Sidebar */}
        <Sidebar
          role="admin"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingCount={grievances.filter((g) => g.status !== "resolved").length}
        />

        {/* Right Main Content Area */}
        <div className="dash-main-pane">
          {/* TAB 1: EXECUTIVE COMMAND OVERVIEW */}
          {activeTab === "overview" && (
            <div className="dash-tab-content">
              {/* Top Officer Stat Row */}
              <div className="dash-stats-row">
                <StatCard
                  title="Total Active Grievances"
                  value={overviewStats ? overviewStats.totalActive.toLocaleString("en-IN") : "—"}
                  subtitle="Under current jurisdiction"
                  icon="📋"
                  trend={overviewStats ? "Live from database" : "Loading…"}
                  trendPositive={false}
                />
                <StatCard
                  title="Critical Cases"
                  value={overviewStats ? overviewStats.critical.toLocaleString("en-IN") : "—"}
                  subtitle="Unresolved, highest severity"
                  icon="🚨"
                  trend="Statutory SLA < 6 Hrs"
                  trendPositive={false}
                  variant="warning"
                />
                <StatCard
                  title="Resolved This Month"
                  value={overviewStats ? overviewStats.resolvedThisMonth.toLocaleString("en-IN") : "—"}
                  subtitle="SLA compliant resolution"
                  icon="⚡"
                  trend="Live from database"
                  trendPositive={true}
                  variant="success"
                />
                <StatCard
                  title="Predictive Alerts Active"
                  value="6 Hotspots"
                  subtitle="Illustrative — no ML pipeline yet"
                  icon="🧠"
                  trend="Not connected to live data"
                  trendPositive={true}
                  variant="purple"
                />
              </div>

              {/* Critical Attention Banner */}
              <div className="gov-critical-callout">
                <div className="critical-header">
                  <span className="crit-icon">⚠️</span>
                  <div>
                    <h4>IMMEDIATE ACTION REQUIRED: 3 Critical SLA Breaches Pending</h4>
                    <p>Knowledge Park III road cave-in and Gamma 2 pipeline burst require immediate executive clearance.</p>
                  </div>
                </div>
                <button className="gov-btn-emergency" onClick={() => setActiveTab("triage")}>
                  Open Priority Triage Queue →
                </button>
              </div>

              {/* Department Performance Summary Table */}
              <div className="gov-card dash-card">
                <div className="dash-card-header">
                  <div className="card-title-group">
                    <span className="card-icon">🏢</span>
                    <div>
                      <h3>Inter-Departmental SLA Compliance Scorecard</h3>
                      <p>Real-time disposal tracking across all 5 participating statutory departments</p>
                    </div>
                  </div>
                </div>

                <div className="charter-table-responsive">
                  {loadingDeptStats ? (
                    <p style={{ padding: "16px" }}>Loading department scorecard…</p>
                  ) : (
                    <table className="gov-data-table">
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Nodal Executive Officer</th>
                          <th>Active Load</th>
                          <th>Disposed (24h)</th>
                          <th>SLA Compliance</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deptStats.map((dept) => {
                          // Officer names aren't modeled on the backend yet (no
                          // per-department officer directory table) — this is a
                          // static display lookup, not live data.
                          const officerNames = {
                            PWD: "Er. S.K. Sharma (Chief EE)",
                            JAL_NIGAM: "Er. A.K. Srivastava (SE)",
                            NPCL: "R.K. Gupta (Divisional Eng)",
                            SANITATION: "Dr. Vinod Pathak (CSO)",
                            GNIDA_ADMIN: "District Magistrate Office",
                          };
                          const pillClass =
                            dept.slaCompliance == null ? "pill-grey" : dept.slaCompliance >= 95 ? "pill-green" : dept.slaCompliance >= 85 ? "pill-amber" : "pill-red";
                          return (
                            <tr key={dept.code}>
                              <td><strong>{dept.label}</strong></td>
                              <td>{officerNames[dept.code] || "Not yet assigned"}</td>
                              <td>{dept.activeLoad}</td>
                              <td>{dept.disposed24h}</td>
                              <td>
                                <span className={`badge-pill ${pillClass}`}>
                                  {dept.slaCompliance != null ? `${dept.slaCompliance}%` : "No data"}
                                </span>
                              </td>
                              <td>
                                <button className="text-btn" onClick={() => { setFilterDept(dept.code); setActiveTab("triage"); }}>
                                  View Queue
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRIEVANCE TRIAGE CONSOLE */}
          {activeTab === "triage" && (
            <div className="dash-tab-content">
              <div className="gov-card triage-filter-card">
                <div className="triage-top-bar">
                  <div className="card-title-group">
                    <span className="card-icon">📋</span>
                    <div>
                      <h3>Official Grievance Triage & Allocation Console</h3>
                      <p>Review autonomous AI department assignments, update status, and deploy zonal repair crews</p>
                    </div>
                  </div>

                  <div className="filter-controls-row">
                    <div className="filter-item">
                      <label>Department:</label>
                      <select
                        className="gov-select-sm"
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                      >
                        <option value="all">All Departments</option>
                        <option value="PWD">PWD (Roads)</option>
                        <option value="JAL_NIGAM">UP Jal Nigam (Water/Drain)</option>
                        <option value="NPCL">NPCL Power</option>
                        <option value="SANITATION">GNIDA Sanitation</option>
                        <option value="GNIDA_ADMIN">GNIDA Administration</option>
                      </select>
                    </div>

                    <div className="filter-item">
                      <label>Severity:</label>
                      <select
                        className="gov-select-sm"
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                      >
                        <option value="all">All Severities</option>
                        <option value="critical">Critical (Under 6 Hr SLA)</option>
                        <option value="high">High</option>
                        <option value="medium">Moderate</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grievance-triage-list">
                  {loadingGrievances ? (
                    <p style={{ padding: "16px" }}>Loading grievances…</p>
                  ) : grievancesError ? (
                    <p style={{ padding: "16px" }}>Couldn't load grievances: {grievancesError}</p>
                  ) : filteredGrievances.length === 0 ? (
                    <p style={{ padding: "16px" }}>No grievances match the current filters.</p>
                  ) : (
                    filteredGrievances.map((g) => (
                      <div key={g.id} className={`triage-case-card priority-border-${g.severity}`}>
                        <div className="triage-case-header">
                          <div className="case-ref-row">
                            <span className="g-ref-badge">{g.refId}</span>
                            <span className={`priority-badge priority-${g.severity}`}>
                              {g.severity.toUpperCase()} PRIORITY
                            </span>
                            <span className="dept-tag">
                              🏢{" "}
                              <select
                                value={g.department}
                                onChange={(e) => handleDepartmentChange(g.id, e.target.value)}
                                style={{ border: "none", background: "transparent", font: "inherit", cursor: "pointer" }}
                              >
                                <option value="Auto-Routing" disabled>Auto-Routing (unassigned)</option>
                                <option value="PWD">PWD</option>
                                <option value="JAL_NIGAM">UP Jal Nigam</option>
                                <option value="NPCL">NPCL Power</option>
                                <option value="SANITATION">GNIDA Sanitation</option>
                                <option value="GNIDA_ADMIN">GNIDA Administration</option>
                              </select>
                            </span>
                            <span className="assigned-officer-pill">👤 Assigned: {g.assignedOfficer || "Not yet assigned"}</span>
                          </div>

                          <div className="case-status-actions">
                            <select
                              className="gov-status-select"
                              value={g.status}
                              onChange={(e) => handleStatusChange(g.id, e.target.value)}
                            >
                              <option value="reported">Registered / Auto-Triaged</option>
                              <option value="verified">Verified</option>
                              <option value="assigned">Assigned to Nodal EE</option>
                              <option value="in_progress">Field Crew Deployed (In Progress)</option>
                              <option value="resolved">Resolved & Closed (Photo Verified)</option>
                              <option value="reopened">Reopened</option>
                              <option value="escalated">Escalated</option>
                            </select>
                          </div>
                        </div>

                        <h4 className="case-title">{g.title}</h4>
                        <p className="case-desc">{g.description}</p>

                        {g.aiConfidence != null && (
                          <div className="case-ai-attributes">
                            <span className="attr-label">AI Detected Anomaly Attributes:</span>
                            <div className="attr-tags">
                              <span className="conf-pill">Confidence: {g.aiConfidence}%</span>
                              {(g.aiTags || []).map((t, idx) => (
                                <span key={idx} className="attr-tag-chip">✓ {t}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="case-footer-row">
                          <div className="case-meta-left">
                            <span>📍 {g.location?.address || g.location?.ward || "—"}</span>
                            <span>🕒 {new Date(g.createdAt).toLocaleString("en-IN")}</span>
                            <span className="sla-pill">⏳ SLA: {g.slaRemaining}</span>
                          </div>

                          <div className="case-meta-right">
                            <button
                              className="gov-btn-dispatch-sm"
                              onClick={() => handleDispatchEmergencySquad(g)}
                            >
                              🚜 Dispatch Emergency Squad
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GIS HEATMAP & GEO */}
          {activeTab === "heatmap" && (
            <div className="dash-tab-content">
              <div className="gov-card map-wrapper-card">
                <div className="map-card-header">
                  <div>
                    <span className="section-super-label">GIS TELEMETRY GRID</span>
                    <h3>Greater Noida Metropolitan Infrastructure Anomaly Heatmap</h3>
                    <p>Satellite and GIS coordinate overlays showing recurring infrastructure vulnerability clusters</p>
                  </div>
                </div>
                <MapView city="Greater Noida" />
              </div>
            </div>
          )}

          {/* TAB 4: PREDICTIVE INSIGHTS */}
          {activeTab === "predictive" && (
            <div className="dash-tab-content">
              <div className="gov-card predictive-wrapper-card">
                <div className="dash-card-header">
                  <div className="card-title-group">
                    <span className="card-icon">🧠</span>
                    <div>
                      <h3>National AI Predictive Governance & Pre-Emptive Civic Defense</h3>
                      <p>Predicts infrastructure failures before citizen complaints occur by correlating weather, telemetry, and spatial history</p>
                    </div>
                  </div>
                </div>

                <div className="predictive-alerts-grid">
                  <div className="pred-alert-box alert-crit">
                    <div className="pred-top">
                      <span className="pred-tag">URGENT MONSOON FLOOD DEFENSE</span>
                      <span className="pred-prob">Probability: 94%</span>
                    </div>
                    <h4>Pari Chowk Underpass Stormwater Culvert Choke</h4>
                    <p>
                      Culvert silt levels currently at 85%. Meteorological forecast indicates 45mm rainfall within 36 hours. Immediate suction cleaning deployment recommended to prevent highway flooding.
                    </p>
                    <div className="pred-action">
                      <span>Assigned Agency: UP Jal Nigam Drainage Wing</span>
                      <button className="gov-btn-primary-sm" onClick={() => alert("Pre-emptive work order UP-PWD-PRE-092 issued to Jal Nigam Nodal Officer.")}>
                        Issue Pre-Emptive Work Order →
                      </button>
                    </div>
                  </div>

                  <div className="pred-alert-box alert-high">
                    <div className="pred-top">
                      <span className="pred-tag">POWER GRID STRESS FORECAST</span>
                      <span className="pred-prob">Probability: 89%</span>
                    </div>
                    <h4>Sector Alpha 1 Commercial Belt Feeder Overheating</h4>
                    <p>
                      Sustained peak temperature above 41°C causing thermal runaway risk on 11kV Substation 4. Load reallocation advised ahead of 7:00 PM peak.
                    </p>
                    <div className="pred-action">
                      <span>Assigned Agency: NPCL State Power Grid</span>
                      <button className="gov-btn-primary-sm" onClick={() => alert("Load balancing directive dispatched to NPCL Substation.")}>
                        Dispatch Load Balancing Directive →
                      </button>
                    </div>
                  </div>

                  <div className="pred-alert-box alert-med">
                    <div className="pred-top">
                      <span className="pred-tag">ASPHALT RECURRING DEGRADATION</span>
                      <span className="pred-prob">Probability: 82%</span>
                    </div>
                    <h4>Knowledge Park III Heavy Transit Corridor</h4>
                    <p>
                      Historical moisture intrusion patterns predict severe bitumen wear during upcoming monsoon showers. Sub-base soil stabilization required.
                    </p>
                    <div className="pred-action">
                      <span>Assigned Agency: Public Works Department (PWD)</span>
                      <button className="gov-btn-primary-sm" onClick={() => alert("PWD Pre-Monsoon resurfacing schedule prioritized.")}>
                        Prioritize Resurfacing Schedule →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DEPARTMENTS & NODAL TEAMS */}
          {activeTab === "departments" && (
            <div className="dash-tab-content">
              <div className="gov-card dept-mgmt-card">
                <div className="dash-card-header">
                  <div className="card-title-group">
                    <span className="card-icon">🏢</span>
                    <div>
                      <h3>Statutory Department Hierarchy & Escalation Matrix</h3>
                      <p>Designated Executive Engineers, contact channels, and statutory appellate officers</p>
                    </div>
                  </div>
                </div>

                <div className="dept-dossier-grid">
                  <div className="dept-dossier-card">
                    <div className="dept-d-top">
                      <span className="dept-icon">🛣️</span>
                      <div>
                        <h4>Public Works Department (PWD)</h4>
                        <p>Division 2 (Greater Noida Expressways & Roads)</p>
                      </div>
                    </div>
                    <div className="officer-contact-details">
                      <div><strong>Nodal Chief EE:</strong> Er. S.K. Sharma</div>
                      <div><strong>Office Phone:</strong> 0120-2326101</div>
                      <div><strong>Escalation Authority:</strong> Chief Executive Officer, GNIDA</div>
                      <div><strong>Active Field Squads:</strong> 8 Maintenance Teams</div>
                    </div>
                  </div>

                  <div className="dept-dossier-card">
                    <div className="dept-d-top">
                      <span className="dept-icon">💧</span>
                      <div>
                        <h4>UP Jal Nigam (Water & Drainage)</h4>
                        <p>Zone 1 (Hydraulic, Stormwater & Sewerage Wing)</p>
                      </div>
                    </div>
                    <div className="officer-contact-details">
                      <div><strong>Nodal SE:</strong> Er. A.K. Srivastava</div>
                      <div><strong>Office Phone:</strong> 0120-2326104</div>
                      <div><strong>Escalation Authority:</strong> District Magistrate / Collector</div>
                      <div><strong>Active Field Squads:</strong> 6 Jetting & Suction Units</div>
                    </div>
                  </div>

                  <div className="dept-dossier-card">
                    <div className="dept-d-top">
                      <span className="dept-icon">⚡</span>
                      <div>
                        <h4>NPCL State Power Distribution</h4>
                        <p>Substations & Urban Streetlighting Division</p>
                      </div>
                    </div>
                    <div className="officer-contact-details">
                      <div><strong>Nodal Officer:</strong> R.K. Gupta (Divisional Eng)</div>
                      <div><strong>Office Phone:</strong> 0120-6226666 / 1912</div>
                      <div><strong>Escalation Authority:</strong> Superintending Engineer (Power)</div>
                      <div><strong>Active Field Squads:</strong> 12 Mobile Line Units</div>
                    </div>
                  </div>

                  <div className="dept-dossier-card">
                    <div className="dept-d-top">
                      <span className="dept-icon">🗑️</span>
                      <div>
                        <h4>GNIDA Solid Waste Management</h4>
                        <p>Health, Sanitation & Bio-Medical Waste Wing</p>
                      </div>
                    </div>
                    <div className="officer-contact-details">
                      <div><strong>Chief Sanitary Officer:</strong> Dr. Vinod Pathak</div>
                      <div><strong>Office Phone:</strong> 0120-2326108</div>
                      <div><strong>Escalation Authority:</strong> Additional CEO (Sanitation)</div>
                      <div><strong>Active Field Squads:</strong> 24 Compactor Routes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS & AUDIT LOGS */}
          {activeTab === "reports" && (
            <div className="dash-tab-content">
              <div className="gov-card reports-card">
                <div className="dash-card-header">
                  <div className="card-title-group">
                    <span className="card-icon">📈</span>
                    <div>
                      <h3>Official Municipal Performance & Audit Reports</h3>
                      <p>Generate certified statutory disposal reports for Government of Uttar Pradesh & MoHUA</p>
                    </div>
                  </div>
                </div>

                <div className="reports-download-grid">
                  <div className="report-item-card">
                    <div className="rep-icon">📄</div>
                    <div className="rep-info">
                      <h4>Monthly Grievance Disposal & SLA Compliance Audit</h4>
                      <p>Detailed ward-wise breakdown of 14,820 registered complaints and resolution turnaround.</p>
                      <span className="rep-meta">Generated: 20 Aug 2026 • Format: PDF (Signed)</span>
                    </div>
                    <button className="gov-btn-primary-sm" onClick={() => window.print()}>
                      Download PDF Receipt
                    </button>
                  </div>

                  <div className="report-item-card">
                    <div className="rep-icon">📊</div>
                    <div className="rep-info">
                      <h4>Pre-Monsoon Drainage Infrastructure Audit (UP Jal Nigam)</h4>
                      <p>Silt level assessments and emergency suction crew deployment logs across 18 wards.</p>
                      <span className="rep-meta">Generated: 19 Aug 2026 • Format: PDF</span>
                    </div>
                    <button className="gov-btn-primary-sm" onClick={() => window.print()}>
                      Download PDF Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
