import React, { useState, useEffect } from "react";
import { NationalEmblem } from "./GovEmblem";

export default function Navbar({ currentPage, navigateTo, currentUser, onLogout }) {
  const [currentDate, setCurrentDate] = useState("");
  const [lang, setLang] = useState("EN");
  const [fontSize, setFontSize] = useState("normal"); // 'small' | 'normal' | 'large'
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      setCurrentDate(now.toLocaleString("en-IN", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    const root = document.documentElement;
    if (size === "small") root.style.fontSize = "14px";
    else if (size === "large") root.style.fontSize = "18px";
    else root.style.fontSize = "16px";
  };

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle("gov-high-contrast");
  };

  return (
    <header className="gov-header-wrapper">
      {/* 1. Official Indian Flag Tricolor Ribbon */}
      <div className="gov-tricolor-bar">
        <div className="tri-saffron"></div>
        <div className="tri-white"></div>
        <div className="tri-green"></div>
      </div>

      {/* 2. Top Government Utility & Accessibility Bar */}
      <div className="gov-utility-strip">
        <div className="gov-container utility-inner">
          <div className="utility-left">
            <span className="gov-badge-official">
              <span className="emblem-mini">🏛️</span> भारत सरकार | Government of India
            </span>
            <span className="utility-separator">|</span>
            <span className="utility-state">उत्तर प्रदेश शासन (GNIDA)</span>
          </div>

          <div className="utility-right">
            {/* National Helpline */}
            <div className="utility-helpline">
              <span className="helpline-icon">📞</span>
              <span>Toll Free: <strong>1800-180-0101</strong> / <strong>1913</strong></span>
            </div>

            <span className="utility-separator">|</span>

            {/* Accessibility Controls */}
            <div className="accessibility-tools">
              <button
                className={`font-tool-btn ${fontSize === "small" ? "active" : ""}`}
                onClick={() => handleFontSizeChange("small")}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                className={`font-tool-btn ${fontSize === "normal" ? "active" : ""}`}
                onClick={() => handleFontSizeChange("normal")}
                title="Standard Font Size"
              >
                A
              </button>
              <button
                className={`font-tool-btn ${fontSize === "large" ? "active" : ""}`}
                onClick={() => handleFontSizeChange("large")}
                title="Increase Font Size"
              >
                A+
              </button>

              <button
                className={`contrast-tool-btn ${highContrast ? "active" : ""}`}
                onClick={toggleContrast}
                title="Toggle High Contrast"
              >
                {highContrast ? "Standard" : "Contrast"}
              </button>
            </div>

            <span className="utility-separator">|</span>

            {/* Language Selector */}
            <div className="gov-lang-switch">
              <button
                className={`lang-btn ${lang === "EN" ? "active" : ""}`}
                onClick={() => setLang("EN")}
              >
                English
              </button>
              <span>/</span>
              <button
                className={`lang-btn ${lang === "HI" ? "active" : ""}`}
                onClick={() => setLang("HI")}
              >
                हिन्दी
              </button>
            </div>

            <span className="utility-separator">|</span>

            {/* Live Clock */}
            <div className="gov-live-clock">
              <span>{currentDate || "Live Telemetry"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Government Brand Header */}
      <div className="gov-main-brand-header">
        <div className="gov-container brand-inner">
          <div className="brand-left" onClick={() => navigateTo("home")} style={{ cursor: "pointer" }}>
            <NationalEmblem size={52} />
            <div className="gov-title-group">
              <div className="gov-ministry-en">
                Ministry of Housing and Urban Affairs • Government of India
              </div>
              <div className="gov-ministry-hi">
                आवासन एवं शहरी कार्य मंत्रालय • ग्रेटर नोएडा प्राधिकरण
              </div>
              <div className="gov-portal-heading">
                <span className="portal-acronym">IN-PACT</span>
                <span className="portal-pipe">|</span>
                <span className="portal-fullname">Integrated National Public Action & Grievance Redressal Portal</span>
              </div>
            </div>
          </div>

          <div className="brand-right">
            <div className="sih-mission-box">
              <div className="sih-emblem-badge">
                <span className="sih-star">★</span> SMART CITIES MISSION
              </div>
              <div className="sih-sub">e-Governance & Digital India Initiative</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Primary Government Navigation Bar */}
      <nav className="gov-nav-bar">
        <div className="gov-container nav-inner">
          <ul className="gov-nav-menu">
            <li className={`gov-nav-item ${currentPage === "home" ? "active" : ""}`}>
              <button className="gov-nav-link" onClick={() => navigateTo("home")}>
                <span className="nav-home-icon">🏠</span> Home
              </button>
            </li>

            <li className={`gov-nav-item ${currentPage === "citizen-dashboard" ? "active" : ""}`}>
              <button className="gov-nav-link" onClick={() => navigateTo("citizen-dashboard")}>
                Lodge Grievance
              </button>
            </li>

            <li className="gov-nav-item">
              <button
                className="gov-nav-link"
                onClick={() => {
                  if (currentPage !== "home") navigateTo("home");
                  setTimeout(() => {
                    document.getElementById("tracker-section")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Track Status
              </button>
            </li>

            <li className="gov-nav-item">
              <button
                className="gov-nav-link"
                onClick={() => {
                  if (currentPage !== "home") navigateTo("home");
                  setTimeout(() => {
                    document.getElementById("citizen-charter")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Citizen Charter & SLAs
              </button>
            </li>

            <li className="gov-nav-item">
              <button
                className="gov-nav-link"
                onClick={() => {
                  if (currentPage !== "home") navigateTo("home");
                  setTimeout(() => {
                    document.getElementById("nodal-officers")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Nodal Directory
              </button>
            </li>
          </ul>

          <div className="gov-nav-auth">
            {currentUser ? (
              <div className="gov-user-pill">
                <div className="user-details">
                  <span className="user-icon">👤</span>
                  <span className="user-name">{currentUser.name}</span>
                  <span className="gov-badge-role">
                    {currentUser.role === "admin" ? "Gov Officer" : "Citizen"}
                  </span>
                </div>

                <button
                  className="gov-dash-jump-btn"
                  onClick={() =>
                    navigateTo(
                      currentUser.role === "admin" ? "gov-dashboard" : "citizen-dashboard"
                    )
                  }
                >
                  {currentPage.includes("dashboard") ? "In Dashboard" : "Go to Dashboard"}
                </button>

                <button className="gov-logout-btn" onClick={onLogout} title="Logout of Session">
                  Logout
                </button>
              </div>
            ) : (
              <div className="gov-auth-btn-group">
                <button
                  className={`gov-btn-citizen ${currentPage === "citizen-login" ? "active" : ""}`}
                  onClick={() => navigateTo("citizen-login")}
                >
                  <span className="btn-icon">👤</span> Citizen Portal (जनता)
                </button>
                <button
                  className={`gov-btn-officer ${currentPage === "gov-login" ? "active" : ""}`}
                  onClick={() => navigateTo("gov-login")}
                >
                  <span className="btn-icon">🏛️</span> Officer Login (अधिकारी)
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
