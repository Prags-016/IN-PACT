import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import IssueCard from "../components/IssueCard";
import MapView from "../components/MapView";
import { getMyIssues, getIssues, createIssue, toggleUpvote, getStats } from "../services/issuesService";

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
  const [formError, setFormError] = useState(null);

  // Citizen's personal tracked grievances — now fetched from the real backend
  const [myGrievances, setMyGrievances] = useState([]);
  const [loadingMy, setLoadingMy] = useState(true);
  const [myError, setMyError] = useState(null);

  // Community grievances feed — now fetched from the real backend
  const [communityGrievances, setCommunityGrievances] = useState([]);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [communityError, setCommunityError] = useState(null);

  // Ward-level resolution rate stat
  const [wardStats, setWardStats] = useState(null);

  // Maps a raw backend Issue object to what this component's JSX expects:
  // adds `id` (aliasing _id, so IssueCard's internal `id` destructuring still
  // works unchanged) while keeping `refId` around for the human-readable badges.
  const mapIssue = (issue) => ({ ...issue, id: issue._id });

  const loadMyGrievances = () => {
    setLoadingMy(true);
    setMyError(null);
    getMyIssues()
      .then((issues) => setMyGrievances(issues.map(mapIssue)))
      .catch((err) => setMyError(err.message))
      .finally(() => setLoadingMy(false));
  };

  const loadCommunityFeed = () => {
    setLoadingCommunity(true);
    setCommunityError(null);
    // TODO: exclude the citizen's own issues once the backend supports an
    // "exclude mine" filter — for now this shows everyone's issues, including yours.
    getIssues()
      .then((issues) => setCommunityGrievances(issues.map(mapIssue)))
      .catch((err) => setCommunityError(err.message))
      .finally(() => setLoadingCommunity(false));
  };

  useEffect(() => {
    loadMyGrievances();
    loadCommunityFeed();
    if (currentUser?.ward) {
      getStats(currentUser.ward)
        .then((stats) => setWardStats(stats.ward))
        .catch(() => { }); // non-critical — the card just falls back to a placeholder
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpvote = async (id) => {
    // Optimistic update so the UI feels instant, then reconcile with the real response
    setCommunityGrievances((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, upvotes: g.hasUpvoted ? g.upvotes - 1 : g.upvotes + 1, hasUpvoted: !g.hasUpvoted } : g
      )
    );
    try {
      const result = await toggleUpvote(id);
      setCommunityGrievances((prev) =>
        prev.map((g) => (g.id === id ? { ...g, upvotes: result.upvotes, hasUpvoted: result.hasUpvoted } : g))
      );
    } catch (err) {
      // Revert on failure
      setCommunityGrievances((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, upvotes: g.hasUpvoted ? g.upvotes - 1 : g.upvotes + 1, hasUpvoted: !g.hasUpvoted } : g
        )
      );
      alert(`Couldn't register your upvote: ${err.message}`);
    }
  };

  const handleLodgeGrievance = async (e) => {
    e.preventDefault();
    if (!formTitle || !formDescription) return;

    setIsAiAnalyzing(true);
    setFormError(null);

    try {
      const newIssue = await createIssue({
        title: formTitle,
        description: formDescription,
        category: formCategory,
        severity: formUrgency,
        location: { address: formLocation, ward: formWard },
      });

      setGeneratedRefId(newIssue.refId);
      setSubmissionSuccess(true);
      setMyGrievances((prev) => [mapIssue(newIssue), ...prev]);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsAiAnalyzing(false);
    }
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
              {loadingMy ? (
                <div className="gov-card dash-card">Loading your grievances…</div>
              ) : myError ? (
                <div className="gov-card dash-card">Couldn't load your grievances: {myError}</div>
              ) : (
                <>
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
                      title={wardStats?.name ? `${wardStats.name} Resolution Rate` : "Ward Resolution Rate"}
                      value={wardStats?.resolutionRate != null ? `${wardStats.resolutionRate}%` : "—"}
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

                    {myGrievances.length === 0 ? (
                      <p style={{ padding: "16px" }}>
                        You haven't filed any grievances yet. Use "Lodge New Grievance" above to file your first one.
                      </p>
                    ) : (
                      <div className="active-grievances-list">
                        {myGrievances.map((g) => (
                          <div key={g.id} className="grievance-row-card">
                            <div className="g-row-left">
                              <div className="g-ref-line">
                                <span className="g-ref-badge">{g.refId}</span>
                                <span className={`priority-badge priority-${g.severity}`}>
                                  {g.severity.toUpperCase()} PRIORITY
                                </span>
                                <span className="g-dept-text">🏢 {g.department}</span>
                              </div>
                              <h4 className="g-title">{g.title}</h4>
                              <p className="g-desc">{g.description}</p>
                              <div className="g-meta-row">
                                <span>📍 {g.location?.address || g.location?.ward || "—"}</span>
                                <span>🕒 {new Date(g.createdAt).toLocaleString("en-IN")}</span>
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
                    )}
                  </div>
                </>
              )}
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
                    Your grievance has been officially registered and will be reviewed by a nodal officer with an SLA timer attached.
                  </p>

                  <div className="official-receipt-box">
                    <div className="receipt-header">
                      <span>GOVERNMENT OF UTTAR PRADESH • OFFICIAL ACKNOWLEDGEMENT SLIP</span>
                      <span>DATE: {new Date().toLocaleDateString("en-IN")}</span>
                    </div>
                    <div className="receipt-grid">
                      <div><span className="r-label">Grievance Ref ID:</span> <strong>{generatedRefId}</strong></div>
                      <div><span className="r-label">Complainant Name:</span> <strong>{currentUser?.name || "Ananya Sharma"}</strong></div>
                      <div><span className="r-label">Nodal Department:</span> <strong>Pending AI Auto-Routing</strong></div>
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

                    {formError && (
                      <div className="auth-error-banner" style={{ marginBottom: "12px" }}>
                        Couldn't submit your grievance: {formError}
                      </div>
                    )}

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

                {loadingMy ? (
                  <p style={{ padding: "16px" }}>Loading…</p>
                ) : myError ? (
                  <p style={{ padding: "16px" }}>Couldn't load your grievances: {myError}</p>
                ) : myGrievances.length === 0 ? (
                  <p style={{ padding: "16px" }}>No grievances filed yet.</p>
                ) : (
                  <div className="grievance-dossier-list">
                    {myGrievances.map((g) => (
                      <div key={g.id} className="dossier-card">
                        <div className="dossier-top">
                          <div className="dossier-ref-group">
                            <span className="dossier-ref-pill">{g.refId}</span>
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
                            <span>{g.location?.address || g.location?.ward || "—"}</span>
                          </div>
                          <div>
                            <span className="m-label">Assigned Nodal Officer:</span>
                            <strong>{g.assignedOfficer || "Not yet assigned"}</strong>
                          </div>
                          <div>
                            <span className="m-label">Statutory Target SLA:</span>
                            <strong className="text-saffron">{g.slaRemaining}</strong>
                          </div>
                          <div>
                            <span className="m-label">Registered Timestamp:</span>
                            <span>{new Date(g.createdAt).toLocaleString("en-IN")}</span>
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
                )}
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

                {loadingCommunity ? (
                  <p style={{ padding: "16px" }}>Loading community feed…</p>
                ) : communityError ? (
                  <p style={{ padding: "16px" }}>Couldn't load community feed: {communityError}</p>
                ) : communityGrievances.length === 0 ? (
                  <p style={{ padding: "16px" }}>No community grievances reported yet.</p>
                ) : (
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
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
