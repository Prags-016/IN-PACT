import React, { useState, useEffect } from "react";
import "./App.css";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import CitizenLogin from "./pages/CitizenLogin";
import CitizenDashboard from "./pages/CitizenDashboard";
import GovernmentLogin from "./pages/GovernmentLogin";
import GovernmentDashboard from "./pages/GovernmentDashboard";

function App() {
  // Available pages: 'home' | 'citizen-login' | 'citizen-dashboard' | 'gov-login' | 'gov-dashboard'
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    if (["home", "citizen-login", "citizen-dashboard", "gov-login", "gov-dashboard"].includes(hash)) {
      return hash;
    }
    return "home";
  });

  const [currentUser, setCurrentUser] = useState(null);

  // Sync state with URL hash for easy bookmarking and browser back/forward
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["home", "citizen-login", "citizen-dashboard", "gov-login", "gov-dashboard"].includes(hash)) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigateTo("home");
  };

  return (
    <div className="app">
      {/* Global Navbar */}
      <Navbar
        currentPage={currentPage}
        navigateTo={navigateTo}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Page Rendering Router */}
      <main className="app-main-body">
        {currentPage === "home" && (
          <Home navigateTo={navigateTo} />
        )}

        {currentPage === "citizen-login" && (
          <CitizenLogin
            onLogin={handleLogin}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === "citizen-dashboard" && (
          <CitizenDashboard
            currentUser={currentUser || {
              id: "CIT-8821",
              name: "Ananya Sharma",
              role: "citizen",
              email: "ananya.sharma@example.com",
              ward: "Ward 12, Greater Noida"
            }}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === "gov-login" && (
          <GovernmentLogin
            onLogin={handleLogin}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === "gov-dashboard" && (
          <GovernmentDashboard
            currentUser={currentUser || {
              id: "GOV-IAS-001",
              name: "Dr. Rajesh Mehta, IAS",
              role: "admin",
              designation: "District Magistrate & Municipal Commissioner",
              department: "GNIDA - Central Command & Administration",
              zone: "Greater Noida Metropolis"
            }}
            navigateTo={navigateTo}
          />
        )}
      </main>

      {/* Global Civic Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon-sm">I</div>
              <span>IN-PACT</span>
            </div>
            <p>AI-Powered Government Grievance Intelligence & Predictive Governance Platform.</p>
            <div className="sih-tag">Built for Smart India Hackathon (SIH) • Civic Intelligence Track</div>
          </div>

          <div className="footer-links-group">
            <div className="footer-column">
              <h4>Citizen Portals</h4>
              <button className="footer-link-btn" onClick={() => navigateTo("citizen-dashboard")}>Report a Grievance</button>
              <button className="footer-link-btn" onClick={() => navigateTo("citizen-dashboard")}>Track Resolution SLA</button>
              <button className="footer-link-btn" onClick={() => navigateTo("citizen-login")}>Citizen Login</button>
            </div>

            <div className="footer-column">
              <h4>Government Officers</h4>
              <button className="footer-link-btn" onClick={() => navigateTo("gov-dashboard")}>Officer Command Center</button>
              <button className="footer-link-btn" onClick={() => navigateTo("gov-dashboard")}>Predictive Heatmaps</button>
              <button className="footer-link-btn" onClick={() => navigateTo("gov-login")}>SSO Officer Sign-In</button>
            </div>

            <div className="footer-column">
              <h4>AI Capabilities</h4>
              <span>Multimodal NLP Ingestion</span>
              <span>Computer Vision Severity Audit</span>
              <span>GIS Spatiotemporal Clustering</span>
              <span>Pre-Monsoon Flood Prevention</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© 2026 IN-PACT Civic Intelligence Systems. All rights reserved.</p>
          <div className="footer-status-pill">
            <span className="live-dot-green"></span> All Civic AI Services Operational
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;