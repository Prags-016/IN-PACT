import React from "react";

export default function Navbar({ currentPage, navigateTo, currentUser, onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigateTo("home")} style={{ cursor: "pointer" }}>
        <div className="logo-icon">I</div>
        <div className="logo-text-group">
          <span className="logo-title">IN-PACT</span>
          <span className="logo-subtitle">CIVIC INTELLIGENCE</span>
        </div>
      </div>

      <div className="nav-links">
        {currentPage === "home" && (
          <>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>
              How It Works
            </a>
            <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Intelligence
            </a>
            <a href="#analytics" onClick={(e) => { e.preventDefault(); document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Impact
            </a>
          </>
        )}

        {currentUser ? (
          <div className="user-nav-section">
            <div className="user-badge">
              <span className="user-role-dot"></span>
              <span className="user-name">
                {currentUser.name}
              </span>
              <span className="user-role-tag">
                {currentUser.role === "admin" ? "Gov Officer" : "Citizen"}
              </span>
            </div>
            
            <button 
              className="dashboard-shortcut-btn"
              onClick={() => navigateTo(currentUser.role === "admin" ? "gov-dashboard" : "citizen-dashboard")}
            >
              {currentPage.includes("dashboard") ? "Dashboard Active" : "Go to Dashboard"}
            </button>

            <button className="logout-btn" onClick={onLogout} title="Sign Out">
              Sign Out
            </button>
          </div>
        ) : (
          <div className="auth-nav-buttons">
            <button 
              className={`nav-btn ${currentPage === "citizen-login" ? "active" : ""}`}
              onClick={() => navigateTo("citizen-login")}
            >
              Citizen Portal
            </button>
            <button 
              className={`nav-btn primary-nav-btn ${currentPage === "gov-login" ? "active" : ""}`}
              onClick={() => navigateTo("gov-login")}
            >
              Government Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
