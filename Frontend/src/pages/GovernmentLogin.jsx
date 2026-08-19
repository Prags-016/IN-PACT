import React, { useState } from "react";

export default function GovernmentLogin({ onLogin, navigateTo }) {
  const [authMode, setAuthMode] = useState("sso"); // 'sso' | 'token' | 'dept'
  const [officerId, setOfficerId] = useState("GOV-IAS-001");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [department, setDepartment] = useState("GNIDA - Central Command & Administration");
  const [zone, setZone] = useState("Greater Noida Metropolis HQ");
  const [smartTokenPin, setSmartTokenPin] = useState("9042");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        id: officerId || "GOV-OFF-9042",
        name: "Dr. Rajesh Mehta, IAS",
        role: "admin",
        designation: "District Magistrate & Municipal Commissioner",
        department: department,
        zone: zone,
        badgeId: "NIC-SSO-7729",
        clearanceLevel: "Level 1 (Executive District Command)",
        avatar: "🏛️"
      });
      navigateTo("gov-dashboard");
    }, 600);
  };

  const handleQuickDemoAdmin = (roleType) => {
    if (roleType === "commissioner") {
      onLogin({
        id: "GOV-IAS-001",
        name: "Dr. Rajesh Mehta, IAS",
        role: "admin",
        designation: "District Magistrate & Municipal Commissioner",
        department: "GNIDA - Central Command & Administration",
        zone: "Greater Noida Metropolis (All Zones)",
        badgeId: "NIC-IAS-0012",
        clearanceLevel: "Level 1 (Executive Command)",
        avatar: "🏛️"
      });
    } else if (roleType === "pwd") {
      onLogin({
        id: "PWD-EE-412",
        name: "Er. S.K. Sharma",
        role: "admin",
        designation: "Chief Executive Engineer",
        department: "Public Works Department (PWD)",
        zone: "Zone 2 (Knowledge Park & Expressway)",
        badgeId: "PWD-EE-0412",
        clearanceLevel: "Level 2 (Infrastructure Ops)",
        avatar: "🛣️"
      });
    } else if (roleType === "jal") {
      onLogin({
        id: "JAL-SE-108",
        name: "Er. A.K. Srivastava",
        role: "admin",
        designation: "Superintending Engineer",
        department: "UP Jal Nigam (Water & Drainage)",
        zone: "Zone 1 (Pari Chowk & Commercial Belt)",
        badgeId: "JN-SE-0108",
        clearanceLevel: "Level 2 (Hydraulic Ops)",
        avatar: "💧"
      });
    } else {
      onLogin({
        id: "NPCL-NO-305",
        name: "Priya Sundaram",
        role: "admin",
        designation: "Nodal Power Grid Officer",
        department: "NPCL / State Power Distribution Grid",
        zone: "Alpha-Delta Sector Substations",
        badgeId: "NPCL-NO-0305",
        clearanceLevel: "Level 2 (Electrical Safety)",
        avatar: "⚡"
      });
    }
    navigateTo("gov-dashboard");
  };

  return (
    <div className="auth-page-wrapper gov-auth-page">
      {/* Top back navigation */}
      <div className="auth-top-nav">
        <button className="auth-back-btn gov-back-btn" onClick={() => navigateTo("home")}>
          ← Return to IN-PACT Overview
        </button>
        <div className="auth-lang-badge gov-top-badge">
          <span>🏛️ Government of Uttar Pradesh • Official Command Gateway</span>
        </div>
      </div>

      <div className="auth-container gov-auth-container">
        {/* Left / Officer Login Card */}
        <div className="auth-card gov-card">
          <div className="auth-header">
            <div className="auth-badge gov-badge">
              <span className="badge-emblem">🏛️</span> GOVERNMENT OF UTTAR PRADESH • IN-PACT
            </div>
            <h2>Officer Command Access</h2>
            <p>
              AI-Powered Civic Intelligence, Predictive Hotspot Triage & Multi-Agency Operations Console
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="auth-tabs gov-tabs">
            <button
              type="button"
              className={`auth-tab-btn gov-tab-btn ${authMode === "sso" ? "active" : ""}`}
              onClick={() => setAuthMode("sso")}
            >
              🏛️ Parichay Govt SSO
            </button>
            <button
              type="button"
              className={`auth-tab-btn gov-tab-btn ${authMode === "token" ? "active" : ""}`}
              onClick={() => setAuthMode("token")}
            >
              🛡️ Smart Token / PKI
            </button>
            <button
              type="button"
              className={`auth-tab-btn gov-tab-btn ${authMode === "dept" ? "active" : ""}`}
              onClick={() => setAuthMode("dept")}
            >
              📋 Department Officer ID
            </button>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="deptSelect">Administrative Department / Nodal Agency</label>
              <select
                id="deptSelect"
                className="form-select gov-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="GNIDA - Central Command & Administration">
                  🏛️ GNIDA - Central Command & District Administration
                </option>
                <option value="Public Works Department (PWD)">
                  🛣️ Public Works Department (PWD - Road Infra)
                </option>
                <option value="UP Jal Nigam (Water & Drainage)">
                  💧 UP Jal Nigam (Water Supply & Drainage Wing)
                </option>
                <option value="NPCL / State Power Distribution Grid">
                  ⚡ NPCL / State Power Distribution Grid
                </option>
                <option value="GNIDA Health & Solid Waste Management">
                  🗑️ GNIDA Health & Solid Waste Management
                </option>
                <option value="Traffic Police & Urban Mobility Command">
                  🚦 Traffic Police & Urban Mobility Command
                </option>
                <option value="Fire & Disaster Emergency Response">
                  🚒 Emergency Response & Disaster Management
                </option>
              </select>
            </div>

            {authMode !== "token" ? (
              <>
                <div className="form-group">
                  <div className="form-label-row">
                    <label htmlFor="officerIdInput">Government Officer ID / Parichay SSO Username</label>
                    <span className="gov-sample-hint">e.g. GOV-IAS-001</span>
                  </div>
                  <input
                    id="officerIdInput"
                    type="text"
                    className="form-input gov-input"
                    placeholder="e.g. IAS-9042 or PWD-EE-412"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="form-label-row">
                    <label htmlFor="passwordInput">Security Passcode / SSO Smart Token PIN</label>
                    <button
                      type="button"
                      className="pwd-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️ Hide" : "👁️ Show"}
                    </button>
                  </div>
                  <div className="password-field-wrapper">
                    <input
                      id="passwordInput"
                      type={showPassword ? "text" : "password"}
                      className="form-input gov-input"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <span className="form-hint gov-hint">
                    🔒 Secured with 256-bit NIC hardware token cryptography.
                  </span>
                </div>
              </>
            ) : (
              <div className="smart-token-box">
                <div className="token-status-pill">
                  <span className="token-indicator pulse-gold"></span>
                  <span>Hardware Security Module (HSM) Key Detected</span>
                </div>

                <div className="form-group">
                  <label htmlFor="tokenPin">Smart Token 4-Digit Security PIN</label>
                  <input
                    id="tokenPin"
                    type="password"
                    maxLength={4}
                    className="form-input otp-input-large gov-token-pin"
                    value={smartTokenPin}
                    onChange={(e) => setSmartTokenPin(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" className="primary-auth-btn gov-action-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading-flex">
                  <span className="spinner-dot gov-spinner"></span> Authenticating via Parichay SSO...
                </span>
              ) : (
                "Authenticate & Open Officer Command Center →"
              )}
            </button>
          </form>

          {/* Quick Demo Officer Evaluation Divider */}
          <div className="auth-divider gov-divider">
            <span>⚡ 1-CLICK DEMO OFFICER SIGN-IN (FOR EVALUATORS)</span>
          </div>

          <div className="demo-officer-grid">
            <button
              type="button"
              className="demo-officer-card primary-gov"
              onClick={() => handleQuickDemoAdmin("commissioner")}
            >
              <div className="demo-officer-icon">🏛️</div>
              <div className="demo-officer-details">
                <strong>Dr. Rajesh Mehta, IAS</strong>
                <span>District Magistrate & Municipal Commissioner</span>
                <span className="dept-tag">GNIDA Central Command</span>
              </div>
              <span className="demo-arrow">→</span>
            </button>

            <button
              type="button"
              className="demo-officer-card"
              onClick={() => handleQuickDemoAdmin("pwd")}
            >
              <div className="demo-officer-icon">🛣️</div>
              <div className="demo-officer-details">
                <strong>Er. S.K. Sharma</strong>
                <span>Chief Executive Engineer</span>
                <span className="dept-tag">Public Works Department (PWD)</span>
              </div>
              <span className="demo-arrow">→</span>
            </button>

            <button
              type="button"
              className="demo-officer-card"
              onClick={() => handleQuickDemoAdmin("jal")}
            >
              <div className="demo-officer-icon">💧</div>
              <div className="demo-officer-details">
                <strong>Er. A.K. Srivastava</strong>
                <span>Superintending Engineer</span>
                <span className="dept-tag">UP Jal Nigam (Water & Drainage)</span>
              </div>
              <span className="demo-arrow">→</span>
            </button>

            <button
              type="button"
              className="demo-officer-card"
              onClick={() => handleQuickDemoAdmin("npcl")}
            >
              <div className="demo-officer-icon">⚡</div>
              <div className="demo-officer-details">
                <strong>Priya Sundaram</strong>
                <span>Nodal Grid Power Officer</span>
                <span className="dept-tag">NPCL State Electricity Grid</span>
              </div>
              <span className="demo-arrow">→</span>
            </button>
          </div>

          {/* Footer Switcher to Citizen Login */}
          <div className="auth-footer gov-footer">
            <p>
              Are you a Citizen looking to report a problem or track a ticket?{" "}
              <button className="text-link citizen-link" onClick={() => navigateTo("citizen-login")}>
                Citizen Portal Login →
              </button>
            </p>
          </div>
        </div>

        {/* Right / Sidebar Information */}
        <div className="auth-sidebar-info gov-sidebar-info">
          <div className="sidebar-intro-box gov-intro-box">
            <h3>Officer Intelligence Command</h3>
            <p>High-precision triaging and multi-agency response orchestration.</p>
          </div>

          <div className="info-feature-box gov-info-box">
            <div className="info-icon gov-icon">⚡</div>
            <div className="info-content">
              <h4>Autonomous NLP & Vision Routing</h4>
              <p>
                Over 98.4% of citizen reports are automatically triaged with urgency classification, jurisdictional routing, and SLA timers.
              </p>
            </div>
          </div>

          <div className="info-feature-box gov-info-box">
            <div className="info-icon gov-icon">🧠</div>
            <div className="info-content">
              <h4>Predictive Civic Defense</h4>
              <p>
                Cross-references weather forecasts with historical silt patterns to predict urban flood hotspots and electrical failures weeks before escalation.
              </p>
            </div>
          </div>

          <div className="info-feature-box gov-info-box">
            <div className="info-icon gov-icon">📊</div>
            <div className="info-content">
              <h4>Cross-Department SLA Accountability</h4>
              <p>
                Real-time escalation matrices alert District Magistrate, Chief Engineers, and Ward Supervisors on critical SLA risks.
              </p>
            </div>
          </div>

          <div className="info-feature-box gov-info-box">
            <div className="info-icon gov-icon">📍</div>
            <div className="info-content">
              <h4>Spatiotemporal GIS Clustering</h4>
              <p>
                Eliminates queue clutter by automatically grouping duplicate complaints in proximity into unified field work orders.
              </p>
            </div>
          </div>

          {/* Security Trust Strip */}
          <div className="security-trust-strip gov-trust-strip">
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <span>NIC CERT-In Audited</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🏛️</span>
              <span>Parichay Govt SSO</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span>Restricted Official Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
