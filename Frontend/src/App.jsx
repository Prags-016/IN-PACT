import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CitizenLogin from "./pages/CitizenLogin";
import GovernmentLogin from "./pages/GovernmentLogin";
import CitizenDashboard from "./pages/CitizenDashboard";
import GovernmentDashboard from "./pages/GovernmentDashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === "admin") {
      navigateTo("gov-dashboard");
    } else {
      navigateTo("citizen-dashboard");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigateTo("home");
  };

  // Fallback demo users if directly navigating to dashboards
  const effectiveUser =
    currentUser ||
    (currentPage === "gov-dashboard"
      ? {
          id: "GOV-IAS-001",
          name: "Dr. Rajesh Mehta, IAS",
          role: "admin",
          designation: "District Magistrate & Municipal Commissioner",
          department: "GNIDA - Central Command & Administration",
          zone: "Greater Noida Metropolis HQ",
          avatar: "🏛️"
        }
      : {
          id: "CIT-8821",
          name: "Ananya Sharma",
          role: "citizen",
          email: "ananya.sharma@example.com",
          phone: "+91 98765 43210",
          ward: "Ward 12, Greater Noida",
          avatar: "👩"
        });

  return (
    <div className="app-root">
      {/* Top Main Navbar */}
      <Navbar
        currentPage={currentPage}
        navigateTo={navigateTo}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Page Routing */}
      <main className="main-content">
        {currentPage === "home" && <Home navigateTo={navigateTo} />}

        {currentPage === "citizen-login" && (
          <CitizenLogin onLogin={handleLogin} navigateTo={navigateTo} />
        )}

        {currentPage === "gov-login" && (
          <GovernmentLogin onLogin={handleLogin} navigateTo={navigateTo} />
        )}

        {currentPage === "citizen-dashboard" && (
          <CitizenDashboard
            currentUser={effectiveUser}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === "gov-dashboard" && (
          <GovernmentDashboard
            currentUser={effectiveUser}
            navigateTo={navigateTo}
          />
        )}
      </main>

      {/* Global Application Footer on Public Pages */}
      {(currentPage === "home" ||
        currentPage === "citizen-login" ||
        currentPage === "gov-login") && (
        <footer className="app-footer">
          <div className="footer-container">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon-sm">I</div>
                <span>IN-PACT CIVIC SYSTEMS</span>
              </div>
              <p>
                Autonomous AI Grievance Triaging, Multi-Modal Ingestion, and
                Predictive Governance for Smart Metropolitan Municipalities.
              </p>
              <div className="sih-tag">
                🏛️ Smart Cities Mission • Government of India • SIH 2026
              </div>
            </div>

            <div className="footer-links-group">
              <div className="footer-column">
                <h4>Citizens</h4>
                <button
                  className="footer-link-btn"
                  onClick={() => navigateTo("citizen-login")}
                >
                  Citizen Login Portal
                </button>
                <button
                  className="footer-link-btn"
                  onClick={() => navigateTo("citizen-dashboard")}
                >
                  Report Grievance
                </button>
                <button
                  className="footer-link-btn"
                  onClick={() => navigateTo("citizen-dashboard")}
                >
                  Track SLA Timeline
                </button>
                <span>Anonymous Filing Support</span>
              </div>

              <div className="footer-column">
                <h4>Authorities</h4>
                <button
                  className="footer-link-btn"
                  onClick={() => navigateTo("gov-login")}
                >
                  Officer SSO Command
                </button>
                <button
                  className="footer-link-btn"
                  onClick={() => navigateTo("gov-dashboard")}
                >
                  Grievance Triage Console
                </button>
                <button
                  className="footer-link-btn"
                  onClick={() => navigateTo("gov-dashboard")}
                >
                  Predictive Heatmaps
                </button>
                <span>SLA Escalation Matrix</span>
              </div>

              <div className="footer-column">
                <h4>System Trust</h4>
                <span>🔒 256-Bit SSL Encrypted</span>
                <span>🛡️ NIC CERT-In Compliant</span>
                <span>⚡ 98.4% AI Accuracy</span>
                <span>📍 Live GIS Telemetry</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>
              © {new Date().getFullYear()} IN-PACT AI Governance Platform. All
              rights reserved.
            </span>
            <div className="footer-status-pill">
              <span className="live-dot-green"></span>
              <span>All 18 Ward Municipal AI Nodes Operational</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;