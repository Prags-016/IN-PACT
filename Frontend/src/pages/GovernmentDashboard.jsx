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
      id: "UP-GND-2026-9401",
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
      slaRemaining: "4 hrs (Emergency SLA)",
      assignedOfficer: "Er. S.K. Sharma (EE, PWD)",
      aiTags: ["High Accident Probability", "Multi-Vehicle Impact", "Asphalt Failure"]
    },
    {
      id: "UP-GND-2026-9388",
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
      assignedOfficer: "Er. A.K. Srivastava (AE, Jal Nigam)",
      aiTags: ["Resource Wastage", "Household Disruption", "Sub-surface Erosion"]
    },
    {
      id: "UP-GND-2026-9352",
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
      id: "UP-GND-2026-9290",
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
      id: "UP-GND-2026-9211",
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
      id: "UP-GND-2026-9145",
      title: "Cluster of 18 Non-Functional LED Streetlights",
      description: "Continuous 1.2km stretch completely unlit, creating blind spots for nighttime cyclists and pedestrians.",
      category: "Street Lighting",
      department: "NPCL Power",
      severity: "medium",
      status: "triaged",
      location: "Sector Beta 1 Inner Ring Road",
      timestamp: "9 hours ago",
      upvotes: 29,
      aiConfidence: 94,
      slaRemaining: "20 hrs",
      assignedOfficer: "Sunil Tyagi (Electrical AE)",
      aiTags: ["Public Safety", "Night Commute Hazard"]
    }
  ]);

  const handleStatusChange = (id, newStatus) => {
    setGrievances((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: newStatus } : g))
    );
  };

  const handleDispatchEmergencySquad = (issue) => {
    setActiveAlertNotification(`Emergency Field Maintenance Squad successfully dispatched to ${issue.location} for ${issue.id}. Notification broadcasted to Nodal Engineer.`);
    setTimeout(() => setActiveAlertNotification(null), 5000);
  };

  const filteredGrievances = grievances.filter((g) => {
    const matchDept = filterDept === "all" || g.department.toLowerCase().includes(filterDept.toLowerCase());
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
                  value="1,428"
                  subtitle="Under current jurisdiction"
                  icon="📋"
                  trend="14 new in last 1 hr"
                  trendPositive={false}
                />
                <StatCard
                  title="Emergency Life-Safety Cases"
                  value="12"
                  subtitle="Assigned to Nodal Engineers"
                  icon="🚨"
                  trend="Statutory SLA < 6 Hrs"
                  trendPositive={false}
                  variant="warning"
                />
                <StatCard
                  title="24-Hr Disposal Rate"
                  value="94.2%"
                  subtitle="SLA compliant resolution"
                  icon="⚡"
                  trend="Above State Target (90%)"
                  trendPositive={true}
                  variant="success"
                />
                <StatCard
                  title="Predictive Alerts Active"
                  value="6 Hotspots"
                  subtitle="Monsoon silt & transformer load"
                  icon="🧠"
                  trend="Pre-emptive action ordered"
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
                      <tr>
                        <td><strong>Public Works Dept (PWD)</strong></td>
                        <td>Er. S.K. Sharma (Chief EE)</td>
                        <td>342</td>
                        <td>48</td>
                        <td><span className="badge-pill pill-green">96.8%</span></td>
                        <td><button className="text-btn" onClick={() => { setFilterDept("PWD"); setActiveTab("triage"); }}>View Queue</button></td>
                      </tr>
                      <tr>
                        <td><strong>UP Jal Nigam (Water & Drainage)</strong></td>
                        <td>Er. A.K. Srivastava (SE)</td>
                        <td>289</td>
                        <td>39</td>
                        <td><span className="badge-pill pill-amber">91.2%</span></td>
                        <td><button className="text-btn" onClick={() => { setFilterDept("Jal"); setActiveTab("triage"); }}>View Queue</button></td>
                      </tr>
                      <tr>
                        <td><strong>NPCL State Power Distribution</strong></td>
                        <td>R.K. Gupta (Divisional Eng)</td>
                        <td>194</td>
                        <td>62</td>
                        <td><span className="badge-pill pill-green">98.1%</span></td>
                        <td><button className="text-btn" onClick={() => { setFilterDept("NPCL"); setActiveTab("triage"); }}>View Queue</button></td>
                      </tr>
                      <tr>
                        <td><strong>GNIDA Sanitation & Solid Waste</strong></td>
                        <td>Dr. Vinod Pathak (CSO)</td>
                        <td>412</td>
                        <td>88</td>
                        <td><span className="badge-pill pill-green">94.5%</span></td>
                        <td><button className="text-btn" onClick={() => { setFilterDept("Sanitation"); setActiveTab("triage"); }}>View Queue</button></td>
                      </tr>
                      <tr>
                        <td><strong>Traffic & Mobility Police Cell</strong></td>
                        <td>ACP Traffic HQ</td>
                        <td>191</td>
                        <td>24</td>
                        <td><span className="badge-pill pill-green">97.0%</span></td>
                        <td><button className="text-btn" onClick={() => { setFilterDept("Traffic"); setActiveTab("triage"); }}>View Queue</button></td>
                      </tr>
                    </tbody>
                  </table>
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
                        <option value="Jal">UP Jal Nigam (Water/Drain)</option>
                        <option value="NPCL">NPCL Power</option>
                        <option value="Sanitation">GNIDA Sanitation</option>
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
                  {filteredGrievances.map((g) => (
                    <div key={g.id} className={`triage-case-card priority-border-${g.severity}`}>
                      <div className="triage-case-header">
                        <div className="case-ref-row">
                          <span className="g-ref-badge">{g.id}</span>
                          <span className={`priority-badge priority-${g.severity}`}>
                            {g.severity.toUpperCase()} PRIORITY
                          </span>
                          <span className="dept-tag">🏢 {g.department}</span>
                          <span className="assigned-officer-pill">👤 Assigned: {g.assignedOfficer}</span>
                        </div>

                        <div className="case-status-actions">
                          <select
                            className="gov-status-select"
                            value={g.status}
                            onChange={(e) => handleStatusChange(g.id, e.target.value)}
                          >
                            <option value="submitted">Registered / Auto-Triaged</option>
                            <option value="triaged">Assigned to Nodal EE</option>
                            <option value="in_progress">Field Crew Deployed (In Progress)</option>
                            <option value="resolved">Resolved & Closed (Photo Verified)</option>
                          </select>
                        </div>
                      </div>

                      <h4 className="case-title">{g.title}</h4>
                      <p className="case-desc">{g.description}</p>

                      <div className="case-ai-attributes">
                        <span className="attr-label">AI Detected Anomaly Attributes:</span>
                        <div className="attr-tags">
                          <span className="conf-pill">Confidence: {g.aiConfidence}%</span>
                          {g.aiTags.map((t, idx) => (
                            <span key={idx} className="attr-tag-chip">✓ {t}</span>
                          ))}
                        </div>
                      </div>

                      <div className="case-footer-row">
                        <div className="case-meta-left">
                          <span>📍 {g.location}</span>
                          <span>🕒 {g.timestamp}</span>
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
                  ))}
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
