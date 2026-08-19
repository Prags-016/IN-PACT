import React, { useState } from "react";

export default function GovernmentLogin({ onLogin, navigateTo }) {
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("GNIDA - Central Command & Administration");
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
        zone: "Greater Noida Authority HQ"
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
        zone: "Greater Noida Metropolis"
      });
    } else {
      onLogin({
        id: "PWD-EE-412",
        name: "Er. S.K. Sharma",
        role: "admin",
        designation: "Chief Executive Engineer",
        department: "Public Works Department (PWD)",
        zone: "Zone 2 (Knowledge Park & Expressway)"
      });
    }
    navigateTo("gov-dashboard");
  };

  return (
    <div className="auth-container gov-auth-container">
      <div className="auth-card gov-card">
        <div className="auth-header">
          <div className="auth-badge gov-badge">
            <span>🏛️</span> GOVERNMENT OF UTTAR PRADESH • IN-PACT
          </div>
          <h2>Officer Command Access</h2>
          <p>AI-Powered Civic Intelligence, Predictive Triage & Operations Portal</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="deptSelect">Administrative Department / Nodal Agency</label>
            <select
              id="deptSelect"
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="GNIDA - Central Command & Administration">
                🏛️ GNIDA - Central Command & Administration
              </option>
              <option value="Public Works Department (PWD)">
                🛣️ Public Works Department (PWD)
              </option>
              <option value="UP Jal Nigam (Water & Drainage)">
                💧 UP Jal Nigam (Water Supply & Drainage)
              </option>
              <option value="NPCL Power & Distribution">
                ⚡ NPCL / State Power Distribution
              </option>
              <option value="GNIDA Health & Solid Waste Management">
                🗑️ GNIDA Health & Solid Waste Management
              </option>
              <option value="Traffic Police & Urban Mobility">
                🚦 Traffic Police & Urban Mobility
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="officerIdInput">Government Officer ID / SSO Username</label>
            <input
              id="officerIdInput"
              type="text"
              className="form-input"
              placeholder="e.g. IAS-9042 or PWD-EE-104"
              value={officerId}
              onChange={(e) => setOfficerId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordInput">Security Passcode / Smart Token PIN</label>
            <input
              id="passwordInput"
              type="password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="primary-auth-btn gov-action-btn" disabled={loading}>
            {loading ? "Authenticating SSO Credentials..." : "Authenticate & Open Command Center →"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR QUICK DEMO OFFICER SIGN-IN</span>
        </div>

        <div className="demo-officer-buttons">
          <button
            type="button"
            className="demo-login-btn gov"
            onClick={() => handleQuickDemoAdmin("commissioner")}
          >
            🏛️ Sign-In as <strong>District Magistrate (Dr. Rajesh Mehta, IAS)</strong>
          </button>
          <button
            type="button"
            className="demo-login-btn gov secondary"
            onClick={() => handleQuickDemoAdmin("pwd")}
          >
            🛣️ Sign-In as <strong>PWD Chief Engineer (Er. S.K. Sharma)</strong>
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Are you a Citizen looking to file or track a problem?{" "}
            <button className="text-link" onClick={() => navigateTo("citizen-login")}>
              Citizen Portal Login →
            </button>
          </p>
        </div>
      </div>

      <div className="auth-sidebar-info">
        <div className="info-feature-box gov-info-box">
          <div className="info-icon">⚡</div>
          <h4>Autonomous NLP & Vision Routing</h4>
          <p>Over 98% of incoming grievances are automatically tagged with severity, jurisdiction, and assigned officer.</p>
        </div>

        <div className="info-feature-box gov-info-box">
          <div className="info-icon">🧠</div>
          <h4>Predictive Infrastructure Defense</h4>
          <p>Anticipate drain overflows, transformer failures, and road deterioration weeks before severe escalation.</p>
        </div>

        <div className="info-feature-box gov-info-box">
          <div className="info-icon">📊</div>
          <h4>Cross-Department SLA Accountability</h4>
          <p>Real-time escalation matrices for District Magistrate, Chief Engineers, and Ward Supervisors.</p>
        </div>
      </div>
    </div>
  );
}
