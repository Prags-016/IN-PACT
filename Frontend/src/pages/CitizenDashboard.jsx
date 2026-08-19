import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import IssueCard from "../components/IssueCard";
import MapView from "../components/MapView";

export default function CitizenDashboard({ currentUser, navigateTo }) {
  const [activeTab, setActiveTab] = useState("overview"); // overview | report | track | map | community
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Form State for filing new grievance
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Roads & Potholes");
  const [formLocation, setFormLocation] = useState("Knowledge Park III, Near Sharda Roundabout");
  const [formDescription, setFormDescription] = useState("");
  const [formUrgency, setFormUrgency] = useState("high");
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Citizen's personal tracked grievances
  const [myGrievances, setMyGrievances] = useState([
    {
      id: "INP-2026-8091",
      title: "Major Pothole & Cave-in on Main Commercial Road",
      description: "Severe 2-foot deep road depression causing frequent two-wheeler skids and traffic jams during peak hours.",
      category: "Roads & Potholes",
      department: "Public Works Department (PWD)",
      severity: "high",
      status: "in_progress",
      location: "Knowledge Park III, Greater Noida",
      timestamp: "Today, 10:15 AM",
      upvotes: 42,
      hasUpvoted: true,
      aiConfidence: 96,
      slaRemaining: "18 hrs left",
      timeline: [
        { time: "10:15 AM", label: "Complaint Received via Citizen Portal", done: true },
        { time: "10:16 AM", label: "AI Computer Vision Triaged & Classified: High Severity", done: true },
        { time: "10:22 AM", label: "Auto-Routed & Assigned to PWD Executive Engineer Division 2", done: true },
        { time: "01:30 PM", label: "Field Inspection Crew Dispatched (Team Lead: Er. Verma)", done: true },
        { time: "Pending", label: "Bitumen Patchwork & Surface Levelling", done: false },
        { time: "Pending", label: "Citizen Verification & Closure", done: false }
      ]
    },
    {
      id: "INP-2026-7840",
      title: "Overflowing Garbage Dump near Sector 12 Market",
      description: "Sanitation waste accumulating for 4 days, blocking pedestrian footpath and attracting stray cattle.",
      category: "Waste Management",
      department: "GNIDA Sanitation Division",
      severity: "medium",
      status: "resolved",
      location: "Sector 12 Market Gate 2",
      timestamp: "Yesterday, 04:30 PM",
      upvotes: 18,
      hasUpvoted: false,
      aiConfidence: 94,
      slaRemaining: "Resolved in 22 hrs",
      timeline: [
        { time: "Yesterday, 04:30 PM", label: "Complaint Logged", done: true },
        { time: "Yesterday, 04:31 PM", label: "AI Categorized as Sanitation - Organic Solid Waste", done: true },
        { time: "Yesterday, 05:00 PM", label: "Assigned to Waste Compactor Route 4", done: true },
        { time: "Today, 09:00 AM", label: "Trash Cleared & Bleaching Disinfection Applied", done: true },
        { time: "Today, 09:15 AM", label: "Resolution Photo Verified by Citizen AI", done: true }
      ]
    }
  ]);

  // Community grievances feed
  const [communityGrievances, setCommunityGrievances] = useState([
    {
      id: "INP-2026-8104",
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
      id: "INP-2026-8072",
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
      id: "INP-2026-8055",
      title: "14 Streetlights non-functional creating dark hotspot",
      description: "Entire arterial corridor dark since Saturday, posing safety concern for night commuters.",
      category: "Street Lighting",
      department: "GNIDA Electrical Cell",
      severity: "medium",
      status: "submitted",
      location: "Beta 1 Sector Road",
      timestamp: "1 day ago",
      upvotes: 31,
      hasUpvoted: false,
      aiConfidence: 91,
      slaRemaining: "24 hrs left"
    }
  ]);

  // Simulate AI Live Text/Image Analysis when user describes issue
  const handleTriggerAiAnalysis = () => {
    if (!formDescription.trim()) return;
    setIsAiAnalyzing(true);
    setTimeout(() => {
      let dept = "Public Works Department (PWD)";
      let cat = formCategory;
      let sev = "high";
      let confidence = 95;

      const lower = formDescription.toLowerCase();
      if (lower.includes("water") || lower.includes("drain") || lower.includes("leak") || lower.includes("pipe") || lower.includes("flood")) {
        dept = "UP Jal Nigam (Water & Sewerage)";
        cat = "Water Supply & Drainage";
        sev = lower.includes("flood") || lower.includes("burst") ? "critical" : "high";
        confidence = 97;
      } else if (lower.includes("light") || lower.includes("wire") || lower.includes("electric") || lower.includes("spark") || lower.includes("transformer")) {
        dept = "NPCL Power Distribution";
        cat = "Electricity & Power";
        sev = lower.includes("spark") || lower.includes("wire") ? "critical" : "medium";
        confidence = 98;
      } else if (lower.includes("garbage") || lower.includes("trash") || lower.includes("waste") || lower.includes("smell")) {
        dept = "GNIDA Sanitation Division";
        cat = "Waste Management";
        sev = "medium";
        confidence = 94;
      }

      setAiAnalysisResult({
        department: dept,
        category: cat,
        severity: sev,
        confidence: confidence,
        estimatedSla: sev === "critical" ? "6 Hours (Immediate Emergency SLA)" : "24-48 Hours Standard SLA",
        jurisdiction: "Greater Noida Authority Zone 2"
      });
      setFormCategory(cat);
      setFormUrgency(sev);
      setIsAiAnalyzing(false);
    }, 500);
  };

  // Handle Submit Form
  const handleSubmitGrievance = (e) => {
    e.preventDefault();
    if (!formTitle || !formDescription) return;

    const newIssue = {
      id: `INP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formTitle,
      description: formDescription,
      category: formCategory,
      department: aiAnalysisResult ? aiAnalysisResult.department : "Auto-Routed to PWD",
      severity: formUrgency,
      status: "submitted",
      location: formLocation,
      timestamp: "Just now",
      upvotes: 1,
      hasUpvoted: true,
      aiConfidence: aiAnalysisResult ? aiAnalysisResult.confidence : 95,
      slaRemaining: formUrgency === "critical" ? "6 hrs" : "24 hrs",
      timeline: [
        { time: "Just now", label: "Complaint Received via Citizen Portal", done: true },
        { time: "Just now", label: "AI Triaged: " + (aiAnalysisResult?.department || "PWD"), done: true },
        { time: "Pending", label: "Official Officer Acknowledgment", done: false },
        { time: "Pending", label: "Field Inspection & Repair Dispatch", done: false }
      ]
    };

    setMyGrievances([newIssue, ...myGrievances]);
    setSubmissionSuccess(true);

    // Reset form
    setFormTitle("");
    setFormDescription("");
    setAiAnalysisResult(null);

    setTimeout(() => {
      setSubmissionSuccess(false);
      setActiveTab("track");
    }, 1500);
  };

  // Upvoting handler
  const handleUpvote = (id) => {
    setCommunityGrievances((prev) =>
      prev.map((iss) => {
        if (iss.id === id) {
          const newVoted = !iss.hasUpvoted;
          return {
            ...iss,
            hasUpvoted: newVoted,
            upvotes: newVoted ? iss.upvotes + 1 : iss.upvotes - 1
          };
        }
        return iss;
      })
    );

    setMyGrievances((prev) =>
      prev.map((iss) => {
        if (iss.id === id) {
          const newVoted = !iss.hasUpvoted;
          return {
            ...iss,
            hasUpvoted: newVoted,
            upvotes: newVoted ? iss.upvotes + 1 : iss.upvotes - 1
          };
        }
        return iss;
      })
    );
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        role="citizen"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewGrievance={() => setActiveTab("report")}
      />

      {/* Main Dashboard Content Area */}
      <main className="dashboard-main-content">
        {/* Dashboard Top Banner */}
        <header className="dashboard-header">
          <div>
            <div className="citizen-welcome-badge">
              <span>🇮🇳</span> CITIZEN SERVICES PORTAL
            </div>
            <h2>Namaste, {currentUser?.name || "Citizen"}</h2>
            <p className="header-subtitle">
              Zone: <strong>Greater Noida Central (Ward 12)</strong> • AI Grievance Assistant Ready
            </p>
          </div>

          <div className="header-actions">
            <button className="primary-action-btn" onClick={() => setActiveTab("report")}>
              + File New Grievance
            </button>
          </div>
        </header>

        {/* =========================================================
            TAB 1: OVERVIEW
        ========================================================= */}
        {activeTab === "overview" && (
          <div className="dashboard-view-fade">
            <div className="dashboard-stats-grid">
              <StatCard
                title="My Submitted Grievances"
                value={myGrievances.length.toString()}
                subtitle="All time reports logged"
                icon="📝"
                variant="default"
              />
              <StatCard
                title="Active in Resolution"
                value={myGrievances.filter((g) => g.status !== "resolved").length.toString()}
                subtitle="Currently being resolved by authorities"
                icon="⏳"
                variant="warning"
              />
              <StatCard
                title="Successfully Resolved"
                value={myGrievances.filter((g) => g.status === "resolved").length.toString()}
                subtitle="100% geotagged verified"
                icon="✅"
                variant="success"
              />
              <StatCard
                title="Community Civic Impact"
                value="148"
                subtitle="Upvotes & co-reports supported"
                icon="🤝"
                variant="purple"
              />
            </div>

            {/* Quick Actions & Recent Tracker */}
            <div className="overview-split-layout">
              <div className="overview-card active-tracking-card">
                <div className="card-header-bar">
                  <h3>⚡ Live Complaint Tracker</h3>
                  <button className="text-btn" onClick={() => setActiveTab("track")}>
                    View All Details →
                  </button>
                </div>

                <div className="recent-grievances-list">
                  {myGrievances.map((item) => (
                    <IssueCard
                      key={item.id}
                      issue={item}
                      onUpvote={handleUpvote}
                      onSelect={(iss) => setSelectedIssue(iss)}
                    />
                  ))}
                </div>
              </div>

              <div className="overview-card quick-file-promo-card">
                <div className="promo-badge">AI MULTIMODAL INGESTION</div>
                <h3>Spot a civic hazard in your sector?</h3>
                <p>
                  Take a photo or speak in Hindi/English. IN-PACT AI automatically detects the problem, assigns priority, and alerts the nodal department.
                </p>

                <div className="promo-features">
                  <div className="feature-pill">📸 Camera Image AI</div>
                  <div className="feature-pill">🎙️ Multilingual Voice</div>
                  <div className="feature-pill">📍 GPS Auto-Locate</div>
                </div>

                <button className="cta-full-btn" onClick={() => setActiveTab("report")}>
                  Start AI Complaint Wizard →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: REPORT GRIEVANCE (AI WIZARD)
        ========================================================= */}
        {activeTab === "report" && (
          <div className="dashboard-view-fade">
            <div className="report-wizard-container">
              <div className="wizard-intro">
                <h3>Submit an AI-Assisted Civic Grievance</h3>
                <p>
                  Fill in the details below. Our AI engine will inspect your grievance in real-time, predict the department, and calculate SLA turnaround times.
                </p>
              </div>

              {submissionSuccess && (
                <div className="alert-success-banner">
                  <span className="success-icon">🎉</span>
                  <div>
                    <strong>Grievance Submitted Successfully!</strong>
                    <p>AI has assigned tracking ticket and notified the department. Redirecting to tracker...</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitGrievance} className="grievance-form">
                <div className="form-group">
                  <label htmlFor="problemTitle">Problem Summary / Headline *</label>
                  <input
                    id="problemTitle"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Deep crater pothole near Knowledge Park metro station"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="problemCat">Primary Category</label>
                    <select
                      id="problemCat"
                      className="form-select"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      <option value="Roads & Potholes">🛣️ Roads, Potholes & Footpaths</option>
                      <option value="Water Supply & Drainage">💧 Water Pipeline & Sewerage</option>
                      <option value="Electricity & Power">⚡ Power Cables, Streetlights & Transformers</option>
                      <option value="Waste Management">🗑️ Garbage Dump & Solid Waste</option>
                      <option value="Traffic & Encroachment">🚦 Traffic Signals & Encroachments</option>
                      <option value="Public Health & Parks">🌳 Public Parks, Fogging & Sanitation</option>
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label htmlFor="problemLocation">Location / Landmark *</label>
                    <div className="input-with-action">
                      <input
                        id="problemLocation"
                        type="text"
                        className="form-input"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="e.g. Sector Beta 2, near Mother Dairy booth"
                        required
                      />
                      <button
                        type="button"
                        className="gps-btn"
                        onClick={() => setFormLocation("Pari Chowk Junction (28.4682° N, 77.5097° E)")}
                        title="Use Current GPS Coordinates"
                      >
                        📍 GPS
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="problemDesc">Detailed Description (AI analyzes this text in real-time) *</label>
                  <textarea
                    id="problemDesc"
                    className="form-textarea"
                    rows={4}
                    placeholder="Describe the issue in English, Hindi or Hinglish. Mention any safety risks, duration, or affected population..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    onBlur={handleTriggerAiAnalysis}
                    required
                  />
                  <div className="textarea-footer">
                    <button
                      type="button"
                      className="ai-analyze-btn"
                      onClick={handleTriggerAiAnalysis}
                      disabled={isAiAnalyzing || !formDescription.trim()}
                    >
                      {isAiAnalyzing ? "🧠 AI Processing NLP & Vision..." : "✨ Run AI Live Classification"}
                    </button>
                    <span className="char-count">{formDescription.length} characters</span>
                  </div>
                </div>

                {/* AI Analysis Live Preview Card */}
                {aiAnalysisResult && (
                  <div className="ai-preview-card">
                    <div className="ai-preview-header">
                      <div className="ai-badge">
                        <span className="sparkle">✨</span>
                        <strong>AI Triaging Preview</strong>
                      </div>
                      <span className="confidence-pill">
                        Confidence: <strong>{aiAnalysisResult.confidence}%</strong>
                      </span>
                    </div>

                    <div className="ai-preview-grid">
                      <div className="preview-field">
                        <span className="label">Auto-Routed Department</span>
                        <strong className="value dept-val">🏢 {aiAnalysisResult.department}</strong>
                      </div>
                      <div className="preview-field">
                        <span className="label">Detected Severity</span>
                        <strong className={`value severity-tag ${aiAnalysisResult.severity}`}>
                          ● {aiAnalysisResult.severity.toUpperCase()}
                        </strong>
                      </div>
                      <div className="preview-field">
                        <span className="label">Predictive Resolution SLA</span>
                        <strong className="value">⏳ {aiAnalysisResult.estimatedSla}</strong>
                      </div>
                      <div className="preview-field">
                        <span className="label">Nodal Jurisdiction</span>
                        <strong className="value">📍 {aiAnalysisResult.jurisdiction}</strong>
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="submit-grievance-btn">
                    🚀 Dispatch Grievance to Government Authority
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setActiveTab("overview")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: TRACK COMPLAINTS
        ========================================================= */}
        {activeTab === "track" && (
          <div className="dashboard-view-fade">
            <div className="view-heading-bar">
              <div>
                <h3>Tracked Grievances ({myGrievances.length})</h3>
                <p>Real-time lifecycle monitoring with automated status updates.</p>
              </div>
            </div>

            <div className="grievance-cards-grid">
              {myGrievances.map((issue) => (
                <div key={issue.id} className="tracked-issue-container">
                  <IssueCard
                    issue={issue}
                    onUpvote={handleUpvote}
                    onSelect={(iss) => setSelectedIssue(iss)}
                  />

                  {/* Visual Status Progress Steps */}
                  {issue.timeline && (
                    <div className="inline-timeline">
                      <div className="timeline-title">STATUS PROGRESSION</div>
                      <div className="timeline-steps-flow">
                        {issue.timeline.map((step, idx) => (
                          <div
                            key={idx}
                            className={`timeline-step-item ${step.done ? "completed" : "pending"}`}
                          >
                            <div className="step-marker">{step.done ? "✓" : idx + 1}</div>
                            <div className="step-info">
                              <span className="step-label">{step.label}</span>
                              <span className="step-time">{step.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: LIVE CIVIC MAP
        ========================================================= */}
        {activeTab === "map" && (
          <div className="dashboard-view-fade">
            <div className="view-heading-bar">
              <div>
                <h3>Greater Noida Civic GIS Heatmap</h3>
                <p>Interactive spatial mapping of reported infrastructure incidents and hotspots.</p>
              </div>
            </div>

            <MapView
              issues={[...myGrievances, ...communityGrievances]}
              onSelectIssue={(issue) => setSelectedIssue(issue)}
            />
          </div>
        )}

        {/* =========================================================
            TAB 5: COMMUNITY FEED & UPVOTING
        ========================================================= */}
        {activeTab === "community" && (
          <div className="dashboard-view-fade">
            <div className="view-heading-bar">
              <div>
                <h3>Nearby Community Grievances</h3>
                <p>Upvote issues in your vicinity. High-vote grievances automatically escalate in AI urgency tiers.</p>
              </div>
            </div>

            <div className="community-grid">
              {communityGrievances.map((item) => (
                <IssueCard
                  key={item.id}
                  issue={item}
                  onUpvote={handleUpvote}
                  onSelect={(iss) => setSelectedIssue(iss)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Selected Issue Detail Modal */}
      {selectedIssue && (
        <div className="modal-backdrop" onClick={() => setSelectedIssue(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-badge">
                TICKET: {selectedIssue.id}
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
                <h4>Citizen Report Details</h4>
                <p>{selectedIssue.description}</p>
                <div className="modal-location">
                  📍 <strong>Location:</strong> {selectedIssue.location}
                </div>
              </div>

              <div className="modal-ai-box">
                <div className="ai-badge-sm">
                  <span>✨</span> AI TRIAGING & PREDICTIVE INTELLIGENCE
                </div>
                <div className="ai-metrics-row">
                  <div>
                    <span>NLP Confidence</span>
                    <strong>{selectedIssue.aiConfidence || 96}%</strong>
                  </div>
                  <div>
                    <span>Target Resolution SLA</span>
                    <strong>{selectedIssue.slaRemaining || "24 Hours"}</strong>
                  </div>
                  <div>
                    <span>Community Upvotes</span>
                    <strong>{selectedIssue.upvotes || 0} Citizens</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className={`modal-upvote-btn ${selectedIssue.hasUpvoted ? "voted" : ""}`}
                onClick={() => {
                  handleUpvote(selectedIssue.id);
                  setSelectedIssue((prev) => ({
                    ...prev,
                    hasUpvoted: !prev.hasUpvoted,
                    upvotes: prev.hasUpvoted ? prev.upvotes - 1 : prev.upvotes + 1
                  }));
                }}
              >
                👍 {selectedIssue.hasUpvoted ? "Upvoted by You" : "Upvote this Issue"} ({selectedIssue.upvotes || 0})
              </button>
              <button className="modal-dismiss-btn" onClick={() => setSelectedIssue(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
