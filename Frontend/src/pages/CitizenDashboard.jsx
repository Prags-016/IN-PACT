import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import IssueCard from "../components/IssueCard";
import MapView from "../components/MapView";

export default function CitizenDashboard({ currentUser, navigateTo }) {
  const [activeTab, setActiveTab] = useState("overview"); // overview | report | track | map | community
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Form State for lodging new grievance
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Roads & Arterial Infrastructure");
  const [formDepartment, setFormDepartment] = useState("Public Works Department (PWD)");
  const [formWard, setFormWard] = useState("Ward 12 - Knowledge Park III");
  const [formLocation, setFormLocation] = useState("Near Sharda University Roundabout, Sector Knowledge Park 3");
  const [formDescription, setFormDescription] = useState("");
  const [formUrgency, setFormUrgency] = useState("high");
  const [formGps, setFormGps] = useState("28.4682° N, 77.5028° E (Geotagged)");
  const [hasPhotoAttached, setHasPhotoAttached] = useState(true);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [generatedRefId, setGeneratedRefId] = useState("");

  // Citizen's personal tracked grievances
  const [myGrievances, setMyGrievances] = useState([
    {
      id: "UP-GND-2026-8091",
      title: "Major Pothole & Cave-in on Main Commercial Road",
      description: "Severe 2-foot deep road depression causing frequent two-wheeler skids and traffic jams during peak hours.",
      category: "Roads & Potholes",
      department: "Public Works Department (PWD - Division 2)",
      severity: "high",
      status: "in_progress",
      location: "Knowledge Park III, Greater Noida",
      timestamp: "20 Aug 2026, 10:15 AM",
      upvotes: 42,
      hasUpvoted: true,
      aiConfidence: 96,
      slaRemaining: "18 hrs left",
      assignedOfficer: "Er. S.K. Sharma (EE, PWD)",
      timeline: [
        { time: "10:15 AM", label: "Complaint Registered via Citizen Portal (Ref: UP-GND-2026-8091)", done: true },
        { time: "10:16 AM", label: "Automated AI Triaged & Classified: High Severity", done: true },
        { time: "10:22 AM", label: "Auto-Routed & Assigned to PWD Executive Engineer Division 2", done: true },
        { time: "01:30 PM", label: "Field Inspection Crew Dispatched (Team Lead: Er. Verma)", done: true },
        { time: "Pending", label: "Bitumen Patchwork & Surface Levelling Execution", done: false },
        { time: "Pending", label: "Citizen Verification & Formal Closure", done: false }
      ]
    },
    {
      id: "UP-GND-2026-7840",
      title: "Overflowing Garbage Dump near Sector 12 Market",
      description: "Sanitation waste accumulating for 4 days, blocking pedestrian footpath and attracting stray cattle.",
      category: "Waste Management",
      department: "GNIDA Health & Sanitation Division",
      severity: "medium",
      status: "resolved",
      location: "Sector 12 Market Gate 2",
      timestamp: "19 Aug 2026, 04:30 PM",
      upvotes: 18,
      hasUpvoted: false,
      aiConfidence: 94,
      slaRemaining: "Resolved in 22 hrs",
      assignedOfficer: "Dr. Vinod Pathak (Sanitary Inspector)",
      timeline: [
        { time: "19 Aug 04:30 PM", label: "Complaint Registered via Portal", done: true },
        { time: "19 Aug 04:31 PM", label: "AI Categorized as Sanitation - Organic Solid Waste", done: true },
        { time: "19 Aug 05:00 PM", label: "Assigned to Waste Compactor Squad Route 4", done: true },
        { time: "20 Aug 09:00 AM", label: "Trash Cleared & Bleaching Disinfection Applied", done: true },
        { time: "20 Aug 09:15 AM", label: "Resolution Photo Verified by Citizen AI", done: true }
      ]
    }
  ]);

  // Community grievances feed
  const [communityGrievances, setCommunityGrievances] = useState([
    {
      id: "UP-GND-2026-8104",
      title: "High Tension Power Cable Sparking near Primary School",
      description: "Exposed overhead cable producing electric sparks during mild wind. High hazard risk for students.",
      category: "Electricity & Power",
      department: "NPCL Power Distribution",
      severity: "critical",
      status: "in_progress",
      location: "Alpha 1 Commercial Belt",
      timestamp: "2 hours ago",
      upvotes: 89,
      hasUpvoted: false,
      aiConfidence: 98,
      slaRemaining: "3 hrs left"
    },
    {
      id: "UP-GND-2026-8072",
      title: "Broken Water Supply Main Line with Low Pressure in Homes",
      description: "Underground pipe burst flooding the street, leading to zero drinking water supply in Block C.",
      category: "Water Supply",
      department: "UP Jal Nigam",
      severity: "high",
      status: "triaged",
      location: "Delta 2 Residential Area",
      timestamp: "5 hours ago",
      upvotes: 56,
      hasUpvoted: false,
      aiConfidence: 95,
      slaRemaining: "12 hrs left"
    },
    {
      id: "UP-GND-2026-7995",
      title: "Non-Functional Streetlight Cluster along 1.5km Arterial Road",
      description: "Complete dark stretch creating severe accident risk and safety concerns for night commuters.",
      category: "Street Lighting",
      department: "NPCL / Electrical Wing",
      severity: "medium",
      status: "triaged",
      location: "Sector Beta 2 Main Boulevard",
      timestamp: "Yesterday",
      upvotes: 34,
      hasUpvoted: false,
      aiConfidence: 93,
      slaRemaining: "24 hrs left"
    }
  ]);

  const handleUpvote = (id) => {
    setCommunityGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const hasVoted = g.hasUpvoted;
          return {
            ...g,
            upvotes: hasVoted ? g.upvotes - 1 : g.upvotes + 1,
            hasUpvoted: !hasVoted
          };
        }
        return g;
      })
    );
  };

  const handleLodgeGrievance = (e) => {
    e.preventDefault();
    if (!formTitle || !formDescription) return;

    setIsAiAnalyzing(true);
    const newRefId = `UP-GND-2026-${Math.floor(8100 + Math.random() * 900)}`;

    setTimeout(() => {
      setIsAiAnalyzing(false);
      setGeneratedRefId(newRefId);
      setSubmissionSuccess(true);

      const newGrievance = {
        id: newRefId,
        title: formTitle,
        description: formDescription,
        category: formCategory,
        department: formDepartment,
        severity: formUrgency,
        status: "triaged",
        location: formLocation,
        timestamp: "Just now (Today)",
        upvotes: 1,
        hasUpvoted: true,
        aiConfidence: 97,
        slaRemaining: formUrgency === "critical" ? "6 hrs left" : "24 hrs left",
        assignedOfficer: "Er. S.K. Sharma (Nodal Officer)",
        timeline: [
          { time: "Just now", label: `Complaint Logged via Portal (Ref: ${newRefId})`, done: true },
          { time: "Just now", label: "Automated Classification: High Priority", done: true },
          { time: "1 min ago", label: `Assigned to Nodal Officer (${formDepartment})`, done: true },
          { time: "Pending", label: "Field Squad Inspection & Execution", done: false },
          { time: "Pending", label: "Citizen Verification & Closure", done: false }
        ]
      };

      setMyGrievances([newGrievance, ...myGrievances]);
    }, 600);
  };

  const handleResetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setSubmissionSuccess(false);
    setGeneratedRefId("");
    setActiveTab("track");
  };

  return (
    <div className="gov-dashboard-wrapper">
      {/* Official Government Top Bar */}
      <div className="gov-dash-header-strip">
        <div className="gov-container dash-header-inner">
          <div className="dash-header-left">
            <span className="gov-emblem-icon">🏛️</span>
            <div>
              <div className="dash-sub">GOVERNMENT OF UTTAR PRADESH • GREATER NOIDA INDUSTRIAL DEVELOPMENT AUTHORITY</div>
              <h2 className="dash-title">Integrated Citizen Grievance Portal (नागरिक डैशबोर्ड)</h2>
            </div>
          </div>

          <div className="dash-header-right">
            <div className="citizen-badge-box">
              <span className="citizen-icon">👤</span>
              <div className="citizen-info">
                <strong className="citizen-name">{currentUser?.name || "Ananya Sharma"}</strong>
                <span className="citizen-meta">
                  {currentUser?.ward || "Ward 12, Knowledge Park III"} &bull; <span className="verified-text">✓ Aadhaar Verified</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gov-container dash-layout">
        {/* Left Official Sidebar */}
        <Sidebar
          role="citizen"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNewGrievance={() => setActiveTab("report")}
        />

        {/* Right Main Content Area */}
        <div className="dash-main-pane">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="dash-tab-content">
              {/* Profile Stat Summary Cards */}
              <div className="dash-stats-row">
                <StatCard
                  title="My Total Grievances"
                  value={myGrievances.length.toString()}
                  subtitle="Complaints registered"
                  icon="📋"
                  trend="100% digitally tracked"
                  trendPositive={true}
                />
                <StatCard
                  title="In Progress / Triaged"
                  value={myGrievances.filter((g) => g.status !== "resolved").length.toString()}
                  subtitle="Under field action"
                  icon="⏳"
                  trend="Within Statutory SLA"
                  trendPositive={true}
                  variant="warning"
                />
                <StatCard
                  title="Resolved & Verified"
                  value={myGrievances.filter((g) => g.status === "resolved").length.toString()}
                  subtitle="Closed with photo proof"
                  icon="✅"
                  trend="Citizen verified"
                  trendPositive={true}
                  variant="success"
                />
                <StatCard
                  title="Ward 12 Resolution Rate"
                  value="96.4%"
                  subtitle="Greater Noida zone benchmark"
                  icon="🏆"
                  trend="Top performing ward"
                  trendPositive={true}
                  variant="purple"
                />
              </div>

              {/* Quick Action Banner */}
              <div className="gov-action-callout">
                <div className="callout-text">
                  <h3>Notice a civic hazard in your sector or ward?</h3>
                  <p>Lodge a new grievance with geotagged photo proof. Automated triaging will allocate it to the Nodal Engineer in seconds.</p>
                </div>
                <button className="gov-btn-primary" onClick={() => setActiveTab("report")}>
                  + Lodge New Grievance (शिकायत दर्ज करें)
                </button>
              </div>

              {/* Active Grievances Tracker */}
              <div className="gov-card dash-card">
                <div className="dash-card-header">
                  <div className="card-title-group">
                    <span className="card-icon">🔎</span>
                    <div>
                      <h3>Active Grievance Redressal Status</h3>
                      <p>Real-time lifecycle tracking of your registered complaints</p>
                    </div>
                  </div>
                  <button className="text-btn" onClick={() => setActiveTab("track")}>
                    View All Grievances ({myGrievances.length}) →
                  </button>
                </div>

                <div className="active-grievances-list">
                  {myGrievances.map((g) => (
                    <div key={g.id} className="grievance-row-card">
                      <div className="g-row-left">
                        <div className="g-ref-line">
                          <span className="g-ref-badge">{g.id}</span>
                          <span className={`priority-badge priority-${g.severity}`}>
                            {g.severity.toUpperCase()} PRIORITY
                          </span>
                          <span className="g-dept-text">🏢 {g.department}</span>
                        </div>
                        <h4 className="g-title">{g.title}</h4>
                        <p className="g-desc">{g.description}</p>
                        <div className="g-meta-row">
                          <span>📍 {g.location}</span>
                          <span>🕒 {g.timestamp}</span>
                          <span className="sla-pill">⏳ {g.slaRemaining}</span>
                        </div>
                      </div>

                      <div className="g-row-right">
                        <span className={`status-badge-block ${g.status === "resolved" ? "status-resolved" : "status-progress"}`}>
                          {g.status === "resolved" ? "✅ Resolved & Closed" : "⚡ In Progress (Field Action)"}
                        </span>
                        <button
                          className="gov-btn-outline-sm"
                          onClick={() => {
                            setSelectedIssue(g);
                            setActiveTab("track");
                          }}
                        >
                          View Audit Trail & Receipt →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LODGE NEW GRIEVANCE */}
          {activeTab === "report" && (
            <div className="dash-tab-content">
              {submissionSuccess ? (
                <div className="gov-card submission-success-card">
                  <div className="success-seal">✅</div>
                  <span className="success-badge-official">GRIEVANCE REGISTERED SUCCESSFULLY</span>
                  <h2>Acknowledgement Reference Number: <strong>{generatedRefId}</strong></h2>
                  <p className="success-desc">
                    Your grievance has been officially registered under the Uttar Pradesh Janhit Guarantee Act and automatically allocated to <strong>{formDepartment}</strong> with an emergency SLA timer.
                  </p>

                  <div className="official-receipt-box">
                    <div className="receipt-header">
                      <span>GOVERNMENT OF UTTAR PRADESH • OFFICIAL ACKNOWLEDGEMENT SLIP</span>
                      <span>DATE: 20 AUG 2026</span>
                    </div>
                    <div className="receipt-grid">
                      <div><span className="r-label">Grievance Ref ID:</span> <strong>{generatedRefId}</strong></div>
                      <div><span className="r-label">Complainant Name:</span> <strong>{currentUser?.name || "Ananya Sharma"}</strong></div>
                      <div><span className="r-label">Nodal Department:</span> <strong>{formDepartment}</strong></div>
                      <div><span className="r-label">Target Redressal SLA:</span> <strong className="text-saffron">6 Hours (Critical)</strong></div>
                      <div><span className="r-label">GPS Geotag:</span> <span>{formGps}</span></div>
                      <div><span className="r-label">Designated Ward:</span> <span>{formWard}</span></div>
                    </div>
                  </div>

                  <div className="success-actions">
                    <button className="gov-btn-primary" onClick={handleResetForm}>
                      Track in My Grievances →
                    </button>
                    <button className="gov-btn-secondary" onClick={() => window.print()}>
                      🖨️ Print Official Receipt (PDF)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="gov-card form-wrapper-card">
                  <div className="form-header-bar">
                    <span className="form-icon">📝</span>
                    <div>
                      <h3>Lodge a Public Civic Grievance (शिकायत दर्ज करें)</h3>
                      <p>Fill out the official redressal form. All submissions are automatically assigned an official reference number and binding SLA.</p>
                    </div>
                  </div>

                  <form onSubmit={handleLodgeGrievance} className="gov-official-form">
                    <div className="form-grid-2">
                      <div className="gov-form-group">
                        <label className="gov-form-label">Grievance Category (शिकायत श्रेणी) *</label>
                        <select
                          className="gov-select"
                          value={formCategory}
                          onChange={(e) => {
                            setFormCategory(e.target.value);
                            if (e.target.value.includes("Road")) setFormDepartment("Public Works Department (PWD)");
                            else if (e.target.value.includes("Water") || e.target.value.includes("Drain")) setFormDepartment("UP Jal Nigam (Water & Drainage)");
                            else if (e.target.value.includes("Electricity") || e.target.value.includes("Streetlight")) setFormDepartment("NPCL / State Power Distribution");
                            else setFormDepartment("GNIDA Health & Sanitation Department");
                          }}
                          required
                        >
                          <option value="Roads & Arterial Infrastructure">Roads & Pavements (PWD)</option>
                          <option value="Drinking Water & Sewerage Supply">Drinking Water & Sewerage (Jal Nigam)</option>
                          <option value="Stormwater Drainage & Flooding">Stormwater Drainage & Culverts (Jal Nigam)</option>
                          <option value="Electricity Grid & Transformer Hazard">Power Distribution & Transformers (NPCL)</option>
                          <option value="Street Lighting & Dark Spots">Street Lighting Maintenance (NPCL / Maintenance)</option>
                          <option value="Solid Waste & Garbage Dumping">Solid Waste & Sanitation (GNIDA)</option>
                          <option value="Traffic Mobility & Signal Fault">Traffic Signals & Encroachment (Traffic Cell)</option>
                        </select>
                      </div>

                      <div className="gov-form-group">
                        <label className="gov-form-label">Municipal Ward / Zone (वार्ड / जोन) *</label>
                        <select
                          className="gov-select"
                          value={formWard}
                          onChange={(e) => setFormWard(e.target.value)}
                          required
                        >
                          <option value="Ward 12 - Knowledge Park III">Ward 12 - Knowledge Park III & Expressways</option>
                          <option value="Ward 5 - Sector Alpha 1 & 2">Ward 5 - Sector Alpha 1 & 2 Commercial</option>
                          <option value="Ward 8 - Sector Beta 1 & 2">Ward 8 - Sector Beta 1 & 2</option>
                          <option value="Ward 9 - Sector Delta 1 & 2">Ward 9 - Sector Delta 1 & 2</option>
                          <option value="Ward 1 - Pari Chowk Central Zone">Ward 1 - Pari Chowk Central Zone</option>
                        </select>
                      </div>
                    </div>

                    <div className="gov-form-group">
                      <label className="gov-form-label">Grievance Subject / Title (संक्षिप्त विवरण) *</label>
                      <input
                        type="text"
                        className="gov-input"
                        placeholder="e.g. Major pothole causing vehicle accidents near Knowledge Park metro"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="gov-form-group">
                      <label className="gov-form-label">Detailed Description of Problem (समस्या का पूरा विवरण) *</label>
                      <textarea
                        className="gov-textarea"
                        rows={4}
                        placeholder="Provide details regarding exact defect, severity, hazard to pedestrians or traffic, duration of issue..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="gov-form-group">
                        <label className="gov-form-label">Exact Location & Landmark (स्थान एवं लैंडमार्क) *</label>
                        <input
                          type="text"
                          className="gov-input"
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          required
                        />
                      </div>

                      <div className="gov-form-group">
                        <label className="gov-form-label">Urgency Declaration (गंभीरता स्तर) *</label>
                        <select
                          className="gov-select"
                          value={formUrgency}
                          onChange={(e) => setFormUrgency(e.target.value)}
                        >
                          <option value="critical">Critical Priority (Emergency Life/Safety Hazard - 6 Hr SLA)</option>
                          <option value="high">High Priority (Severe Disruption - 12 Hr SLA)</option>
                          <option value="medium">Moderate Priority (Routine Defect - 24 Hr SLA)</option>
                        </select>
                      </div>
                    </div>

                    {/* Geotag & Photo Attachment Box */}
                    <div className="attachment-box-grid">
                      <div className="attach-col">
                        <span className="attach-label">📍 Live GPS Geotag:</span>
                        <div className="gps-pill">
                          <span className="gps-dot"></span>
                          <span>{formGps}</span>
                        </div>
                      </div>

                      <div className="attach-col">
                        <span className="attach-label">📸 Photo / Video Evidence:</span>
                        <div className="photo-attach-indicator">
                          <span>✓ road_crater_defect.jpg (Attached)</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-submit-row">
                      <button type="submit" className="gov-btn-primary-lg" disabled={isAiAnalyzing}>
                        {isAiAnalyzing ? "Verifying & Allocating Nodal Officer..." : "Submit Grievance Officially (शिकायत जमा करें) →"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRACK GRIEVANCES */}
          {activeTab === "track" && (
            <div className="dash-tab-content">
              <div className="gov-card track-list-card">
                <div className="dash-card-header">
                  <div className="card-title-group">
                    <span className="card-icon">📋</span>
                    <div>
                      <h3>Official Grievance Dossier & Audit Trails</h3>
                      <p>Complete status history, Nodal Officer assignments, and printable acknowledgement slips</p>
                    </div>
                  </div>
                </div>

                <div className="grievance-dossier-list">
                  {myGrievances.map((g) => (
                    <div key={g.id} className="dossier-card">
                      <div className="dossier-top">
                        <div className="dossier-ref-group">
                          <span className="dossier-ref-pill">{g.id}</span>
                          <span className={`priority-badge priority-${g.severity}`}>
                            {g.severity.toUpperCase()} PRIORITY
                          </span>
                          <span className="dossier-dept">🏢 {g.department}</span>
                        </div>
                        <span className={`status-badge-inline ${g.status === "resolved" ? "status-resolved" : "status-progress"}`}>
                          {g.status === "resolved" ? "Closed & Verified" : "In Progress"}
                        </span>
                      </div>

                      <h4 className="dossier-title">{g.title}</h4>
                      <p className="dossier-desc">{g.description}</p>

                      <div className="dossier-meta-grid">
                        <div>
                          <span className="m-label">Registered Location:</span>
                          <span>{g.location}</span>
                        </div>
                        <div>
                          <span className="m-label">Assigned Nodal Officer:</span>
                          <strong>{g.assignedOfficer || "Er. S.K. Sharma"}</strong>
                        </div>
                        <div>
                          <span className="m-label">Statutory Target SLA:</span>
                          <strong className="text-saffron">{g.slaRemaining}</strong>
                        </div>
                        <div>
                          <span className="m-label">Registered Timestamp:</span>
                          <span>{g.timestamp}</span>
                        </div>
                      </div>

                      {/* Official Timeline */}
                      {g.timeline && (
                        <div className="dossier-timeline-section">
                          <span className="timeline-section-title">Official Action & Resolution Audit Trail:</span>
                          <div className="timeline-steps">
                            {g.timeline.map((step, idx) => (
                              <div key={idx} className={`timeline-step-item ${step.done ? "completed" : "pending"}`}>
                                <div className="step-bullet">{step.done ? "✓" : "○"}</div>
                                <div className="step-details">
                                  <span className="step-time">{step.time}</span>
                                  <span className="step-desc">{step.label}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="dossier-footer-actions">
                        <button className="gov-btn-outline-sm" onClick={() => window.print()}>
                          🖨️ Print Acknowledgement Receipt
                        </button>
                        {g.status === "in_progress" && (
                          <span className="esc-notice">
                            ℹ️ Eligible for District Magistrate escalation if unresolved past SLA
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GIS MAP VIEW */}
          {activeTab === "map" && (
            <div className="dash-tab-content">
              <div className="gov-card map-tab-card">
                <div className="dash-card-header">
                  <div className="card-title-group">
                    <span className="card-icon">🗺️</span>
                    <div>
                      <h3>Greater Noida Ward 12 & Metropolitan GIS Telemetry</h3>
                      <p>Visual map of reported infrastructure defects, repair crews, and municipal zones</p>
                    </div>
                  </div>
                </div>
                <MapView city="Greater Noida" />
              </div>
            </div>
          )}

          {/* TAB 5: COMMUNITY FEED */}
          {activeTab === "community" && (
            <div className="dash-tab-content">
              <div className="gov-card community-card">
                <div className="dash-card-header">
                  <div className="card-title-group">
                    <span className="card-icon">👥</span>
                    <div>
                      <h3>Ward 12 Community Grievance Board</h3>
                      <p>Public issues reported by fellow citizens in your municipal jurisdiction. Upvote to elevate priority for municipal engineering teams.</p>
                    </div>
                  </div>
                </div>

                <div className="community-list">
                  {communityGrievances.map((item) => (
                    <IssueCard
                      key={item.id}
                      issue={item}
                      onUpvote={handleUpvote}
                      onSelect={(iss) => {
                        setSelectedIssue(iss);
                        setActiveTab("track");
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
