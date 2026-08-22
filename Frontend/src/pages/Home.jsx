import React, { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import MapView from "../components/MapView";

export default function Home({ navigateTo, currentUser }) {
  // Default to officer mode if logged in user is admin, else citizen
  const [portalMode, setPortalMode] = useState(
    currentUser?.role === "admin" ? "officer" : "citizen"
  );

  // Sync mode if currentUser changes
  useEffect(() => {
    if (currentUser?.role === "admin") {
      setPortalMode("officer");
    }
  }, [currentUser]);

  // Reference search state for live tracking
  const [searchRefId, setSearchRefId] = useState("");
  const [searchStatusResult, setSearchStatusResult] = useState(null);

  // Interactive National Grievance Classifier Sandbox
  const [demoPrompt, setDemoPrompt] = useState("Severe deep pothole and road cave-in near Knowledge Park 3 metro causing bike accidents");
  const [demoResult, setDemoResult] = useState({
    category: "Roads & Arterial Infrastructure",
    department: "Public Works Department (PWD - Division 2)",
    severity: "CRITICAL",
    confidence: 97.4,
    sla: "6 Hours Emergency Statutory SLA",
    nodalOfficer: "Er. S.K. Sharma (Chief Executive Engineer)",
    tags: ["High Traffic Corridor", "Accident Hazard", "Bitumen Surface Failure"]
  });
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  // Active Emergency Alerts in Officer Mode
  const [activeDispatchNotice, setActiveDispatchNotice] = useState(null);

  const samplePresets = [
    {
      title: "Road Crater / Pothole",
      text: "Severe deep pothole and road cave-in near Knowledge Park 3 metro causing bike accidents",
      result: {
        category: "Roads & Arterial Infrastructure",
        department: "Public Works Department (PWD - Division 2)",
        severity: "CRITICAL",
        confidence: 97.4,
        sla: "6 Hours Emergency Statutory SLA",
        nodalOfficer: "Er. S.K. Sharma (Chief Executive Engineer)",
        tags: ["High Traffic Corridor", "Accident Hazard", "Bitumen Surface Failure"]
      }
    },
    {
      title: "Stormwater Drain Choke",
      text: "Main culvert drain clogged with plastic waste causing 2-foot waterlogging at Pari Chowk underpass",
      result: {
        category: "Drainage & Flood Control",
        department: "UP Jal Nigam (Stormwater & Sewerage Wing)",
        severity: "HIGH",
        confidence: 98.6,
        sla: "12 Hours Pre-Monsoon SLA",
        nodalOfficer: "Er. A.K. Srivastava (Superintending Engineer)",
        tags: ["Culvert Silt 85%", "Monsoon Vulnerability", "Arterial Road"]
      }
    },
    {
      title: "Sparking 11kV Transformer",
      text: "11kV commercial distribution transformer sparking and humming loudly in Alpha 1 market",
      result: {
        category: "Power Grid & Electrical Safety",
        department: "NPCL State Power Distribution Grid",
        severity: "CRITICAL",
        confidence: 99.1,
        sla: "2 Hours Emergency Life-Safety SLA",
        nodalOfficer: "R.K. Gupta (Divisional Engineer)",
        tags: ["Fire Hazard Risk", "High Tension Line", "Public Market Zone"]
      }
    },
    {
      title: "Garbage Dump Overflow",
      text: "Unattended municipal garbage dump on Delta 2 perimeter attracting stray cattle for 4 days",
      result: {
        category: "Municipal Solid Waste Management",
        department: "GNIDA Health & Sanitation Department",
        severity: "MODERATE",
        confidence: 94.8,
        sla: "24 Hours Standard Sanitation SLA",
        nodalOfficer: "Dr. Vinod Pathak (Chief Sanitary Officer)",
        tags: ["Solid Waste Accumulation", "Public Health", "Footpath Blockage"]
      }
    }
  ];

  const handleSelectPreset = (preset) => {
    setDemoPrompt(preset.text);
    setIsDemoRunning(true);
    setTimeout(() => {
      setDemoResult(preset.result);
      setIsDemoRunning(false);
    }, 350);
  };

  const handleSearchTracking = (e) => {
    e.preventDefault();
    if (!searchRefId.trim()) return;

    if (searchRefId.toUpperCase().includes("8091") || searchRefId.toUpperCase().includes("PWD")) {
      setSearchStatusResult({
        id: "UP-GND-2026-8091",
        title: "Major Pothole & Cave-in on Main Commercial Road",
        department: "Public Works Department (PWD - Division 2)",
        status: "In Progress (Field Crew On-Site)",
        nodal: "Er. S.K. Sharma (EE, PWD)",
        registeredOn: "20 Aug 2026, 10:15 AM",
        slaTarget: "20 Aug 2026, 04:15 PM (6 Hours)",
        statusClass: "status-progress"
      });
    } else {
      setSearchStatusResult({
        id: searchRefId.toUpperCase(),
        title: "Stormwater Drainage Desilting & Silt Removal",
        department: "UP Jal Nigam (Zone 1)",
        status: "Assigned & Triaged to Nodal Unit",
        nodal: "Er. A.K. Srivastava (SE)",
        registeredOn: "20 Aug 2026, 08:30 AM",
        slaTarget: "21 Aug 2026, 08:30 AM (24 Hours)",
        statusClass: "status-triaged"
      });
    }
  };

  const handleOfficerQuickDispatch = (caseId, dept) => {
    setActiveDispatchNotice(`Emergency Maintenance Directive issued for ${caseId} (${dept}). Dispatched to Nodal Field Unit.`);
    setTimeout(() => setActiveDispatchNotice(null), 5000);
  };

  return (
    <div className="gov-home-wrapper">
      {/* Portal Mode Switcher Ribbon (Citizen vs Officer Mode) */}
      <div className="gov-portal-mode-strip">
        <div className="gov-container mode-strip-inner">
          <span className="mode-strip-label">SELECT PORTAL VIEW:</span>
          <div className="mode-toggle-group">
            <button
              className={`portal-toggle-btn ${portalMode === "citizen" ? "active" : ""}`}
              onClick={() => setPortalMode("citizen")}
            >
              <span className="mode-icon">👤</span> Citizen Public Portal (जनता पोर्टल)
            </button>
            <button
              className={`portal-toggle-btn officer-mode-btn ${portalMode === "officer" ? "active" : ""}`}
              onClick={() => setPortalMode("officer")}
            >
              <span className="mode-icon">🏛️</span> Officer Executive Command (अधिकारी पोर्टल)
            </button>
          </div>
        </div>
      </div>

      {activeDispatchNotice && (
        <div className="gov-alert-banner">
          <span>⚡ {activeDispatchNotice}</span>
        </div>
      )}

      {/* =======================================================================
          VIEW 1: CITIZEN PUBLIC PORTAL LANDING PAGE
      ======================================================================= */}
      {portalMode === "citizen" ? (
        <>
          {/* Official Citizen Announcement Ticker */}
          <div className="gov-marquee-bar">
            <div className="gov-container marquee-inner">
              <span className="marquee-badge">
                <span className="bell-icon">📢</span> LATEST NOTICES
              </span>
              <div className="marquee-content">
                <span>
                  <strong>[URGENT SLA DIRECTIVE]</strong> District Magistrate mandates 100% geotagged photo verification for all municipal road and drainage repairs across Greater Noida wards. &bull; 
                  <strong>[MONSOON PREPAREDNESS]</strong> All culverts and stormwater drains under UP Jal Nigam undergoing 24x7 AI telemetry monitoring. &bull; 
                  <strong>[CITIZEN CHARTER]</strong> Citizens can track statutory SLA resolution and file second-appeal escalations via this portal.
                </span>
              </div>
            </div>
          </div>

          {/* Citizen Hero Section */}
          <section className="gov-hero-section">
            <div className="gov-container hero-grid">
              <div className="hero-text-col">
                <div className="gov-official-tag">
                  <span className="gov-seal-icon">🇮🇳</span>
                  <span>SMART CITIES MISSION • NATIONAL GRIEVANCE REDRESSAL SYSTEM</span>
                </div>

                <h1 className="hero-main-title">
                  National Public Grievance & Civic Action Portal
                </h1>
                <h2 className="hero-hindi-subtitle">
                  नागरिक शिकायत निवारण एवं स्वचालित अंतर-विभागीय प्रेषण प्रणाली
                </h2>

                <p className="hero-summary-text">
                  An integrated, transparent e-governance platform empowering citizens to register civic grievances across Greater Noida metropolis. Enabled with multi-modal AI classification, computer vision triage, and automated jurisdictional routing directly to designated Nodal Executive Engineers.
                </p>

                <div className="hero-action-buttons">
                  <button
                    className="gov-btn-primary-lg"
                    onClick={() => navigateTo("citizen-dashboard")}
                  >
                    <span className="btn-icon">📝</span> Lodge a Grievance (शिकायत दर्ज करें)
                  </button>

                  <button
                    className="gov-btn-secondary-lg"
                    onClick={() => {
                      document.getElementById("tracker-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span className="btn-icon">🔍</span> Track Grievance Status
                  </button>
                </div>

                <div className="gov-compliance-strip">
                  <div className="compliance-item">
                    <span className="check-bullet">✓</span>
                    <span>Statutory SLA Tracking</span>
                  </div>
                  <div className="compliance-item">
                    <span className="check-bullet">✓</span>
                    <span>Geotagged Photo Proof</span>
                  </div>
                  <div className="compliance-item">
                    <span className="check-bullet">✓</span>
                    <span>Citizen Verification Loop</span>
                  </div>
                </div>
              </div>

              {/* Quick Grievance Reference Search Box */}
              <div className="hero-quick-search-col" id="tracker-section">
                <div className="gov-card quick-tracker-card">
                  <div className="tracker-card-header">
                    <div className="tracker-title-group">
                      <span className="tracker-icon">🔎</span>
                      <div>
                        <h3>Track Grievance / Application</h3>
                        <p>Enter your Grievance Reference ID (e.g. UP-GND-2026-8091)</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSearchTracking} className="tracker-form">
                    <div className="tracker-input-wrapper">
                      <input
                        type="text"
                        placeholder="Enter Reference No. (e.g. UP-GND-2026-8091)"
                        value={searchRefId}
                        onChange={(e) => setSearchRefId(e.target.value)}
                        className="gov-input tracker-input"
                      />
                      <button type="submit" className="gov-btn-primary tracker-submit-btn">
                        Track Status
                      </button>
                    </div>
                  </form>

                  {searchStatusResult && (
                    <div className="tracker-result-box">
                      <div className="result-header">
                        <span className="ref-number">{searchStatusResult.id}</span>
                        <span className={`status-badge-inline ${searchStatusResult.statusClass}`}>
                          {searchStatusResult.status}
                        </span>
                      </div>
                      <div className="result-title">{searchStatusResult.title}</div>
                      <div className="result-details-grid">
                        <div>
                          <span className="det-label">Department:</span>
                          <strong>{searchStatusResult.department}</strong>
                        </div>
                        <div>
                          <span className="det-label">Assigned Officer:</span>
                          <strong>{searchStatusResult.nodal}</strong>
                        </div>
                        <div>
                          <span className="det-label">Registered On:</span>
                          <span>{searchStatusResult.registeredOn}</span>
                        </div>
                        <div>
                          <span className="det-label">Target SLA:</span>
                          <strong className="text-amber">{searchStatusResult.slaTarget}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="tracker-quick-links">
                    <span className="quick-label">Citizen Quick Services:</span>
                    <div className="quick-badges-row">
                      <button onClick={() => navigateTo("citizen-dashboard")} className="quick-chip">
                        📸 Photo Grievance
                      </button>
                      <button onClick={() => navigateTo("citizen-dashboard")} className="quick-chip">
                        🎙️ Voice Complaint
                      </button>
                      <button onClick={() => navigateTo("citizen-dashboard")} className="quick-chip">
                        📋 Download Receipt
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Citizen Services Grid */}
          <section className="gov-services-section">
            <div className="gov-container">
              <div className="gov-section-header text-center">
                <span className="section-super-label">PUBLIC CONVENIENCE SERVICES</span>
                <h2 className="section-main-heading">Direct Citizen Redressal Portals</h2>
                <div className="heading-separator"></div>
                <p className="section-sub-text">
                  Unified digital access point for all civic municipal departments in Greater Noida Metropolis
                </p>
              </div>

              <div className="services-grid-4">
                <div className="service-portal-card" onClick={() => navigateTo("citizen-dashboard")}>
                  <div className="service-card-icon roads-icon">🛣️</div>
                  <h3>Roads & Pavements</h3>
                  <p>Pothole repair, bitumen cave-ins, sidewalk obstructions, and street trenching.</p>
                  <span className="service-sla-tag">SLA: 6 to 48 Hours</span>
                </div>

                <div className="service-portal-card" onClick={() => navigateTo("citizen-dashboard")}>
                  <div className="service-card-icon water-icon">💧</div>
                  <h3>Water Supply & Drainage</h3>
                  <p>Pipeline burst, low water pressure, contaminated supply, and stormwater drain clogging.</p>
                  <span className="service-sla-tag">SLA: 4 to 24 Hours</span>
                </div>

                <div className="service-portal-card" onClick={() => navigateTo("citizen-dashboard")}>
                  <div className="service-card-icon power-icon">⚡</div>
                  <h3>Electricity & Streetlights</h3>
                  <p>Transformer sparking, overhead cable hazards, non-functional streetlights, and power fluctuation.</p>
                  <span className="service-sla-tag">SLA: 2 to 12 Hours</span>
                </div>

                <div className="service-portal-card" onClick={() => navigateTo("citizen-dashboard")}>
                  <div className="service-card-icon waste-icon">🗑️</div>
                  <h3>Solid Waste & Sanitation</h3>
                  <p>Garbage overflow, illegal dumping, public bio-waste clearance, and fogging/sanitation.</p>
                  <span className="service-sla-tag">SLA: 12 to 24 Hours</span>
                </div>
              </div>
            </div>
          </section>

          {/* Real-time Public Performance Metrics */}
          <section className="gov-stats-section" id="statistics">
            <div className="gov-container">
              <div className="gov-section-header text-center">
                <span className="section-super-label">TRANSPARENCY & ACCOUNTABILITY</span>
                <h2 className="section-main-heading">Public Redressal Disposal Metrics</h2>
                <div className="heading-separator"></div>
                <p className="section-sub-text">
                  Live automated performance audit across all 18 Greater Noida Municipal Wards
                </p>
              </div>

              <div className="stats-grid">
                <StatCard
                  title="Total Grievances Registered"
                  value="14,820"
                  subtitle="Registered across all municipal wards"
                  icon="📋"
                  trend="100% digital audit trail"
                  trendPositive={true}
                />
                <StatCard
                  title="Grievances Resolved & Verified"
                  value="14,198"
                  subtitle="Verified with photo evidence"
                  icon="✅"
                  trend="95.8% Resolution Rate"
                  trendPositive={true}
                  variant="success"
                />
                <StatCard
                  title="Average Resolution Turnaround"
                  value="2.8 Days"
                  subtitle="Statutory compliance time"
                  icon="⏱️"
                  trend="68% faster than benchmark"
                  trendPositive={true}
                  variant="purple"
                />
                <StatCard
                  title="Automated Routing Precision"
                  value="98.4%"
                  subtitle="First-time nodal assignment"
                  icon="🎯"
                  trend="Zero manual delay"
                  trendPositive={true}
                  variant="warning"
                />
              </div>
            </div>
          </section>

          {/* Interactive Grievance Classification Sandbox */}
          <section className="gov-classifier-section">
            <div className="gov-container">
              <div className="gov-card classifier-card">
                <div className="classifier-header">
                  <div>
                    <span className="badge-official-sub">SYSTEM COMPONENT DEMONSTRATION</span>
                    <h2>Automated Grievance Classification & Nodal Routing Engine</h2>
                    <p>
                      Demonstration of the National Natural Language & Computer Vision Grievance Classifier used to route public reports to the exact statutory Nodal Officer.
                    </p>
                  </div>
                  <div className="classifier-seal">
                    <span className="seal-text">NAGR-IDTE COMPLIANT</span>
                  </div>
                </div>

                <div className="classifier-presets">
                  <span className="preset-label">Sample Grievance Test Cases:</span>
                  <div className="preset-buttons">
                    {samplePresets.map((p, idx) => (
                      <button
                        key={idx}
                        className={`gov-chip ${demoPrompt === p.text ? "active" : ""}`}
                        onClick={() => handleSelectPreset(p)}
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="classifier-body-grid">
                  <div className="input-pane">
                    <label htmlFor="testPrompt" className="gov-label">
                      Grievance Description (Multilingual / English / Hindi):
                    </label>
                    <textarea
                      id="testPrompt"
                      className="gov-textarea"
                      rows={4}
                      value={demoPrompt}
                      onChange={(e) => setDemoPrompt(e.target.value)}
                    />
                  </div>

                  <div className="output-pane">
                    <div className="output-header-bar">
                      <span>TRIAGE CLASSIFICATION SUMMARY</span>
                      <span className="confidence-pill">Confidence: {demoResult.confidence}%</span>
                    </div>

                    {isDemoRunning ? (
                      <div className="analyzing-state">
                        <span className="spinner-circle"></span>
                        <span>Processing through National Civic NLP Engine...</span>
                      </div>
                    ) : (
                      <div className="results-table-view">
                        <div className="res-row">
                          <span className="res-k">Statutory Department:</span>
                          <strong className="res-v text-navy">{demoResult.department}</strong>
                        </div>
                        <div className="res-row">
                          <span className="res-k">Assigned Nodal Officer:</span>
                          <strong className="res-v">{demoResult.nodalOfficer}</strong>
                        </div>
                        <div className="res-row">
                          <span className="res-k">Categorization:</span>
                          <span className="res-v">{demoResult.category}</span>
                        </div>
                        <div className="res-row">
                          <span className="res-k">Severity Level:</span>
                          <span className={`priority-badge priority-${demoResult.severity.toLowerCase()}`}>
                            {demoResult.severity} PRIORITY
                          </span>
                        </div>
                        <div className="res-row">
                          <span className="res-k">Mandated Redressal SLA:</span>
                          <strong className="res-v text-saffron">⏳ {demoResult.sla}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GIS Ward Grievance Map */}
          <section className="gov-map-section">
            <div className="gov-container">
              <div className="gov-card map-wrapper-card">
                <div className="map-card-header">
                  <div>
                    <span className="section-super-label">GIS SPATIAL TELEMETRY</span>
                    <h3>Greater Noida Metropolitan Ward Incident Map</h3>
                    <p>Real-time geographic distribution of active grievances and deployed field maintenance squads</p>
                  </div>
                  <div className="map-legend-row">
                    <span className="legend-item"><span className="dot dot-crit"></span> Critical (Under 4 Hrs)</span>
                    <span className="legend-item"><span className="dot dot-high"></span> High (Under 12 Hrs)</span>
                    <span className="legend-item"><span className="dot dot-med"></span> Moderate</span>
                    <span className="legend-item"><span className="dot dot-res"></span> Resolved & Verified</span>
                  </div>
                </div>

                <MapView city="Greater Noida" />

                <div className="map-footer-telemetry">
                  <span><strong>Active Telemetry:</strong> Ward 4 Drainage Crew on site &bull; Sector Alpha 2 Power Line Cleared &bull; PWD Patchwork underway in Knowledge Park III</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4-Step Process */}
          <section className="gov-process-section" id="how-it-works">
            <div className="gov-container">
              <div className="gov-section-header text-center">
                <span className="section-super-label">STANDARD OPERATING PROCEDURE</span>
                <h2 className="section-main-heading">End-to-End Redressal Workflow</h2>
                <div className="heading-separator"></div>
                <p className="section-sub-text">
                  Transparent 4-stage citizen-centric redressal process complying with Citizen Charter guidelines
                </p>
              </div>

              <div className="process-timeline-grid">
                <div className="process-step-card">
                  <div className="step-badge-number">1</div>
                  <div className="step-icon-box">📝</div>
                  <h4>1. Multi-Modal Registration</h4>
                  <p>Citizen logs complaint via mobile, web, photo upload, or regional voice recording with GPS location.</p>
                  <div className="step-footer-info">Instant SMS / Reference ID</div>
                </div>

                <div className="process-step-card">
                  <div className="step-badge-number">2</div>
                  <div className="step-icon-box">⚖️</div>
                  <h4>2. Automated Jurisdictional Triage</h4>
                  <p>System automatically verifies ward boundaries, classifies defect severity, and allocates statutory Nodal Officer.</p>
                  <div className="step-footer-info">SLA Timer Commences</div>
                </div>

                <div className="process-step-card">
                  <div className="step-badge-number">3</div>
                  <div className="step-icon-box">🚜</div>
                  <h4>3. Field Inspection & Execution</h4>
                  <p>Designated Executive Engineer deploys maintenance squad. Repairs completed and before/after photos uploaded.</p>
                  <div className="step-footer-info">Geotagged Proof Mandatory</div>
                </div>

                <div className="process-step-card">
                  <div className="step-badge-number">4</div>
                  <div className="step-icon-box">🏛️</div>
                  <h4>4. Citizen Feedback & Closure</h4>
                  <p>Citizen confirms resolution. If unsatisfied, one-click escalation triggers review by the District Magistrate.</p>
                  <div className="step-footer-info">Closed-Loop Accountability</div>
                </div>
              </div>
            </div>
          </section>

          {/* Citizen Charter & SLAs */}
          <section className="gov-charter-section" id="citizen-charter">
            <div className="gov-container">
              <div className="gov-card charter-card">
                <div className="charter-header">
                  <div className="charter-title-box">
                    <span className="badge-official-sub">STATUTORY COMMITMENTS</span>
                    <h3>Citizen Charter & Service Level Agreements (SLAs)</h3>
                    <p>Maximum permissible turnaround time for municipal civic grievance disposal under Uttar Pradesh Janhit Guarantee Act</p>
                  </div>
                </div>

                <div className="charter-table-responsive">
                  <table className="gov-data-table">
                    <thead>
                      <tr>
                        <th>Service Category</th>
                        <th>Nodal Department</th>
                        <th>Standard Redressal SLA</th>
                        <th>Emergency SLA</th>
                        <th>First Appellate Authority</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Road Craters & Major Potholes</strong></td>
                        <td>Public Works Dept (PWD)</td>
                        <td>48 Hours</td>
                        <td><span className="sla-urgent">6 Hours</span></td>
                        <td>Chief Executive Officer, GNIDA</td>
                      </tr>
                      <tr>
                        <td><strong>Stormwater Drain Clogging / Flood</strong></td>
                        <td>UP Jal Nigam (Drainage)</td>
                        <td>24 Hours</td>
                        <td><span className="sla-urgent">4 Hours</span></td>
                        <td>District Magistrate / Collector</td>
                      </tr>
                      <tr>
                        <td><strong>High Voltage Wire / Transformer Spark</strong></td>
                        <td>NPCL / State Power Board</td>
                        <td>12 Hours</td>
                        <td><span className="sla-urgent">2 Hours</span></td>
                        <td>Superintending Engineer (Power)</td>
                      </tr>
                      <tr>
                        <td><strong>Solid Waste Accumulation</strong></td>
                        <td>GNIDA Sanitation Division</td>
                        <td>24 Hours</td>
                        <td><span className="sla-urgent">8 Hours</span></td>
                        <td>Chief Health & Sanitation Officer</td>
                      </tr>
                      <tr>
                        <td><strong>Non-Functional Streetlights</strong></td>
                        <td>Electrical Maintenance Wing</td>
                        <td>48 Hours</td>
                        <td><span className="sla-urgent">12 Hours</span></td>
                        <td>Executive Engineer (Electrical)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Integrated Nodal Departments Directory */}
          <section className="gov-directory-section" id="nodal-officers">
            <div className="gov-container">
              <div className="gov-section-header text-center">
                <span className="section-super-label">NODAL DIRECTORY</span>
                <h2 className="section-main-heading">Participating Public Authorities</h2>
                <div className="heading-separator"></div>
                <p className="section-sub-text">
                  Direct contact channels for nodal department grievance officers across Greater Noida Metropolis
                </p>
              </div>

              <div className="directory-grid-5">
                <div className="dept-card">
                  <div className="dept-emblem">🛣️</div>
                  <h4>Public Works Department</h4>
                  <p className="dept-juris">Roads, Bridges & Pavements</p>
                  <div className="dept-contact">
                    <span>Nodal: Er. S.K. Sharma</span>
                    <span>Helpline: 0120-2326101</span>
                  </div>
                </div>

                <div className="dept-card">
                  <div className="dept-emblem">💧</div>
                  <h4>UP Jal Nigam</h4>
                  <p className="dept-juris">Drinking Water & Storm Drainage</p>
                  <div className="dept-contact">
                    <span>Nodal: Er. A.K. Srivastava</span>
                    <span>Helpline: 0120-2326104</span>
                  </div>
                </div>

                <div className="dept-card">
                  <div className="dept-emblem">⚡</div>
                  <h4>NPCL State Power</h4>
                  <p className="dept-juris">Grid Safety & Street Lighting</p>
                  <div className="dept-contact">
                    <span>Nodal: R.K. Gupta</span>
                    <span>Helpline: 1912 / 0120-6226666</span>
                  </div>
                </div>

                <div className="dept-card">
                  <div className="dept-emblem">🗑️</div>
                  <h4>GNIDA Sanitation</h4>
                  <p className="dept-juris">Waste Management & Public Health</p>
                  <div className="dept-contact">
                    <span>Nodal: Dr. Vinod Pathak</span>
                    <span>Helpline: 0120-2326108</span>
                  </div>
                </div>

                <div className="dept-card">
                  <div className="dept-emblem">🚦</div>
                  <h4>Traffic & Mobility Cell</h4>
                  <p className="dept-juris">Signal Faults & Road Encroachment</p>
                  <div className="dept-contact">
                    <span>Nodal: ACP Traffic HQ</span>
                    <span>Helpline: 1095 / 9971009001</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* =======================================================================
            VIEW 2: DEDICATED OFFICER EXECUTIVE COMMAND LANDING PAGE
        ======================================================================= */
        <div className="officer-portal-view">
          {/* Officer Command Announcement Ticker */}
          <div className="gov-marquee-bar officer-marquee">
            <div className="gov-container marquee-inner">
              <span className="marquee-badge officer-marquee-badge">
                <span className="bell-icon">🏛️</span> EXECUTIVE DIRECTIVES
              </span>
              <div className="marquee-content">
                <span>
                  <strong>[DISTRICT MAGISTRATE ORDER]</strong> Mandated 100% geotagged photo proof upload prior to work order status closure. &bull; 
                  <strong>[SLA BREACH ALERT]</strong> 3 Critical grievances in Ward 12 nearing statutory SLA deadline. Executive re-allocation initiated. &bull; 
                  <strong>[CERT-In AUDIT]</strong> Intranet Section 65B Digital Signature logging active.
                </span>
              </div>
            </div>
          </div>

          {/* Officer Hero Banner */}
          <section className="gov-hero-section officer-hero-section">
            <div className="gov-container hero-grid">
              <div className="hero-text-col">
                <div className="gov-official-tag officer-tag">
                  <span className="gov-seal-icon">🏛️</span>
                  <span>DISTRICT EXECUTIVE ADMINISTRATION • GREATER NOIDA COMMAND</span>
                </div>

                <h1 className="hero-main-title">
                  Executive Officer Command & Grievance Gateway
                </h1>
                <h2 className="hero-hindi-subtitle">
                  अधिकारी नियंत्रण, शिकायत आवंटन एवं अंतर-विभागीय समीक्षा केंद्र
                </h2>

                <p className="hero-summary-text">
                  Centralized administrative dashboard for District Magistrates, Municipal Commissioners, and Nodal Executive Engineers to monitor live municipal incidents, enforce statutory SLA compliance, oversee automated AI triage, and issue pre-emptive flood & infrastructure advisories.
                </p>

                <div className="hero-action-buttons">
                  <button
                    className="gov-btn-primary-lg officer-action-btn"
                    onClick={() => navigateTo("gov-dashboard")}
                  >
                    <span className="btn-icon">📋</span> Open Grievance Triage Queue (शिकायत प्रेषण)
                  </button>

                  <button
                    className="gov-btn-secondary-lg"
                    onClick={() => navigateTo("gov-dashboard")}
                  >
                    <span className="btn-icon">📍</span> Access GIS Spatial Heatmap
                  </button>

                  <button
                    className="gov-btn-officer-lg"
                    onClick={() => navigateTo("gov-login")}
                  >
                    <span className="btn-icon">🔑</span> Parichay Officer SSO Login
                  </button>
                </div>

                <div className="gov-compliance-strip">
                  <div className="compliance-item">
                    <span className="check-bullet">✓</span>
                    <span>Parichay NIC SSO Audited</span>
                  </div>
                  <div className="compliance-item">
                    <span className="check-bullet">✓</span>
                    <span>Section 65B Legal Evidence Log</span>
                  </div>
                  <div className="compliance-item">
                    <span className="check-bullet">✓</span>
                    <span>Automated DM Escalations</span>
                  </div>
                </div>
              </div>

              {/* Officer Quick Live Incident Monitor Card */}
              <div className="hero-quick-search-col">
                <div className="gov-card quick-tracker-card officer-summary-card">
                  <div className="tracker-card-header">
                    <div className="tracker-title-group">
                      <span className="tracker-icon">⚡</span>
                      <div>
                        <h3>District Incident Command Stream</h3>
                        <p>Real-time SLA status across 18 Metropolitan Wards</p>
                      </div>
                    </div>
                  </div>

                  <div className="officer-quick-stats-grid">
                    <div className="officer-stat-mini">
                      <span className="mini-num">1,428</span>
                      <span className="mini-lbl">Active Grievances</span>
                    </div>
                    <div className="officer-stat-mini alert-mini">
                      <span className="mini-num">12</span>
                      <span className="mini-lbl">Critical (&lt; 6h SLA)</span>
                    </div>
                    <div className="officer-stat-mini green-mini">
                      <span className="mini-num">94.2%</span>
                      <span className="mini-lbl">24-Hr Disposal</span>
                    </div>
                  </div>

                  <div className="officer-hero-dispatch-box">
                    <span className="dispatch-title">🚨 IMMEDIATE OFFICER ACTION STREAM:</span>
                    <div className="dispatch-item">
                      <div className="disp-header">
                        <span className="ref-pill-sm">UP-GND-9401</span>
                        <span className="crit-pill">CRITICAL</span>
                      </div>
                      <p className="disp-title">Severe Road Cave-in on Knowledge Park III Arterial Segment</p>
                      <div className="disp-actions">
                        <button
                          className="gov-btn-dispatch-sm"
                          onClick={() => handleOfficerQuickDispatch("UP-GND-9401", "PWD Division 2")}
                        >
                          🚜 Dispatch PWD Emergency Crew
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Officer Operations Key Modules */}
          <section className="gov-services-section officer-modules-section">
            <div className="gov-container">
              <div className="gov-section-header text-center">
                <span className="section-super-label">ADMINISTRATIVE CONTROLS</span>
                <h2 className="section-main-heading">Executive Command Modules</h2>
                <div className="heading-separator"></div>
                <p className="section-sub-text">
                  Direct administrative console controls for Designated Nodal Officers & Executive Engineers
                </p>
              </div>

              <div className="services-grid-4">
                <div className="service-portal-card officer-module-card" onClick={() => navigateTo("gov-dashboard")}>
                  <div className="service-card-icon">📋</div>
                  <h3>Grievance Triage Console</h3>
                  <p>Review automated AI department allocations, update work status, and issue field orders.</p>
                  <span className="service-sla-tag officer-tag-badge">14 Cases Pending Review</span>
                </div>

                <div className="service-portal-card officer-module-card" onClick={() => navigateTo("gov-dashboard")}>
                  <div className="service-card-icon">📍</div>
                  <h3>GIS Spatial Heatmaps</h3>
                  <p>Inspect geographic distribution of defect clusters, flood points, and unlit arterial roads.</p>
                  <span className="service-sla-tag officer-tag-badge">18 Wards Telemetry Active</span>
                </div>

                <div className="service-portal-card officer-module-card" onClick={() => navigateTo("gov-dashboard")}>
                  <div className="service-card-icon">🧠</div>
                  <h3>Predictive Civic Defense</h3>
                  <p>Pre-monsoon drainage silt alerts, power transformer thermal runaway forecasts, and sub-base wear.</p>
                  <span className="service-sla-tag officer-tag-badge">6 Active Risk Alerts</span>
                </div>

                <div className="service-portal-card officer-module-card" onClick={() => navigateTo("gov-dashboard")}>
                  <div className="service-card-icon">📈</div>
                  <h3>Statutory Audit Reports</h3>
                  <p>Generate certified PDF disposal reports for Ministry of Housing & Urban Affairs & UP Govt.</p>
                  <span className="service-sla-tag officer-tag-badge">Section 65B Compliant</span>
                </div>
              </div>
            </div>
          </section>

          {/* Inter-Departmental SLA Compliance Table */}
          <section className="gov-charter-section officer-scorecard-section">
            <div className="gov-container">
              <div className="gov-card charter-card officer-card-styled">
                <div className="charter-header">
                  <div className="charter-title-box">
                    <span className="badge-official-sub">DEPARTMENTAL PERFORMANCE AUDIT</span>
                    <h3>Inter-Departmental SLA Compliance Scorecard</h3>
                    <p>Live disposal performance & statutory SLA adherence across participating nodal departments</p>
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
                        <th>Executive Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Public Works Dept (PWD - Division 2)</strong></td>
                        <td>Er. S.K. Sharma (Chief EE)</td>
                        <td>342</td>
                        <td>48</td>
                        <td><span className="badge-pill pill-green">96.8%</span></td>
                        <td>
                          <button className="gov-btn-primary-sm" onClick={() => navigateTo("gov-dashboard")}>
                            Inspect Queue →
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>UP Jal Nigam (Water & Drainage)</strong></td>
                        <td>Er. A.K. Srivastava (Superintending Eng)</td>
                        <td>289</td>
                        <td>39</td>
                        <td><span className="badge-pill pill-amber">91.2%</span></td>
                        <td>
                          <button className="gov-btn-primary-sm" onClick={() => navigateTo("gov-dashboard")}>
                            Inspect Queue →
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>NPCL State Power Distribution</strong></td>
                        <td>R.K. Gupta (Divisional Eng)</td>
                        <td>194</td>
                        <td>62</td>
                        <td><span className="badge-pill pill-green">98.1%</span></td>
                        <td>
                          <button className="gov-btn-primary-sm" onClick={() => navigateTo("gov-dashboard")}>
                            Inspect Queue →
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>GNIDA Sanitation & Solid Waste</strong></td>
                        <td>Dr. Vinod Pathak (Chief Sanitary Officer)</td>
                        <td>412</td>
                        <td>88</td>
                        <td><span className="badge-pill pill-green">94.5%</span></td>
                        <td>
                          <button className="gov-btn-primary-sm" onClick={() => navigateTo("gov-dashboard")}>
                            Inspect Queue →
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Traffic & Mobility Police Cell</strong></td>
                        <td>ACP Traffic HQ</td>
                        <td>191</td>
                        <td>24</td>
                        <td><span className="badge-pill pill-green">97.0%</span></td>
                        <td>
                          <button className="gov-btn-primary-sm" onClick={() => navigateTo("gov-dashboard")}>
                            Inspect Queue →
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Officer Login / Authority Switcher */}
          <section className="gov-directory-section officer-auth-gateway-section">
            <div className="gov-container">
              <div className="gov-section-header text-center">
                <span className="section-super-label">AUTHENTICATION GATEWAY</span>
                <h2 className="section-main-heading">Officer Parichay SSO Access</h2>
                <div className="heading-separator"></div>
                <p className="section-sub-text">
                  Direct single sign-on access for designated nodal officers and district executive magistrates
                </p>
              </div>

              <div className="directory-grid-5">
                <div className="dept-card officer-sso-card" onClick={() => navigateTo("gov-login")}>
                  <div className="dept-emblem">🏛️</div>
                  <h4>District Magistrate</h4>
                  <p className="dept-juris">Dr. Rajesh Mehta, IAS</p>
                  <div className="dept-contact">
                    <span>Level 1 Executive Command</span>
                    <strong className="text-navy">Login via Parichay SSO →</strong>
                  </div>
                </div>

                <div className="dept-card officer-sso-card" onClick={() => navigateTo("gov-login")}>
                  <div className="dept-emblem">🛣️</div>
                  <h4>PWD Chief Engineer</h4>
                  <p className="dept-juris">Er. S.K. Sharma</p>
                  <div className="dept-contact">
                    <span>Roads & Bridges Division</span>
                    <strong className="text-navy">Login via e-Token →</strong>
                  </div>
                </div>

                <div className="dept-card officer-sso-card" onClick={() => navigateTo("gov-login")}>
                  <div className="dept-emblem">💧</div>
                  <h4>UP Jal Nigam SE</h4>
                  <p className="dept-juris">Er. A.K. Srivastava</p>
                  <div className="dept-contact">
                    <span>Water & Drainage Wing</span>
                    <strong className="text-navy">Login via e-Token →</strong>
                  </div>
                </div>

                <div className="dept-card officer-sso-card" onClick={() => navigateTo("gov-login")}>
                  <div className="dept-emblem">⚡</div>
                  <h4>NPCL Power Grid EE</h4>
                  <p className="dept-juris">R.K. Gupta</p>
                  <div className="dept-contact">
                    <span>Electrical Grid Safety</span>
                    <strong className="text-navy">Login via e-Token →</strong>
                  </div>
                </div>

                <div className="dept-card officer-sso-card" onClick={() => navigateTo("gov-login")}>
                  <div className="dept-emblem">🗑️</div>
                  <h4>Chief Sanitary Officer</h4>
                  <p className="dept-juris">Dr. Vinod Pathak</p>
                  <div className="dept-contact">
                    <span>Solid Waste & Health</span>
                    <strong className="text-navy">Login via Parichay →</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
