import React, { useState, useEffect } from "react";

export default function CitizenLogin({ onLogin, navigateTo }) {
  const [authMode, setAuthMode] = useState("otp"); // 'otp' | 'email' | 'digilocker'
  const [mobileNumber, setMobileNumber] = useState("+91 98765 43210");
  const [email, setEmail] = useState("ananya.sharma@example.com");
  const [password, setPassword] = useState("••••••••");
  const [aadhaarVid, setAadhaarVid] = useState("XXXX-XXXX-8821");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input"); // 'input' | 'otp'
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // OTP Countdown Timer
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!mobileNumber) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setOtp("7492"); // Sample prefilled OTP for seamless demo evaluation
      setTimer(30);
      setIsTimerActive(true);
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        id: "CIT-8821",
        name: "Ananya Sharma",
        role: "citizen",
        email: email || "ananya.sharma@example.com",
        phone: mobileNumber || "+91 98765 43210",
        ward: "Ward 12, Knowledge Park, Greater Noida",
        verified: true,
        joinedDate: "March 2024"
      });
      navigateTo("citizen-dashboard");
    }, 500);
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        id: "CIT-8821",
        name: "Ananya Sharma",
        role: "citizen",
        email: email,
        phone: "+91 98765 43210",
        ward: "Ward 12, Knowledge Park, Greater Noida",
        verified: true,
        joinedDate: "March 2024"
      });
      navigateTo("citizen-dashboard");
    }, 500);
  };

  const handleDigiLockerLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        id: "CIT-DIGI-9904",
        name: "Ananya Sharma",
        role: "citizen",
        email: "ananya.sharma@example.com",
        phone: "+91 98765 43210",
        ward: "Ward 12, Greater Noida",
        verified: true,
        authProvider: "DigiLocker Verified"
      });
      navigateTo("citizen-dashboard");
    }, 700);
  };

  const handleQuickDemoCitizen = (profileKey) => {
    if (profileKey === "ananya") {
      onLogin({
        id: "CIT-8821",
        name: "Ananya Sharma",
        role: "citizen",
        email: "ananya.sharma@example.com",
        phone: "+91 98765 43210",
        ward: "Ward 12, Knowledge Park, Greater Noida",
        avatar: "👩",
        reportsCount: 4,
        verified: true
      });
    } else if (profileKey === "vikram") {
      onLogin({
        id: "CIT-7740",
        name: "Vikramaditya Singh",
        role: "citizen",
        email: "vikram.rwa@greaternoida.org",
        phone: "+91 98112 34567",
        ward: "Alpha 1 Sector RWA President",
        avatar: "👨",
        reportsCount: 12,
        verified: true
      });
    } else {
      onLogin({
        id: "CIT-6623",
        name: "Sunita Devi",
        role: "citizen",
        email: "sunita.devi@merchant.org",
        phone: "+91 98223 89012",
        ward: "Sector 62 Market Association",
        avatar: "👩‍💼",
        reportsCount: 6,
        verified: true
      });
    }
    navigateTo("citizen-dashboard");
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    setTimer(30);
    setIsTimerActive(true);
    setOtp("7492");
  };

  return (
    <div className="auth-page-wrapper">
      {/* Top back navigation */}
      <div className="auth-top-nav">
        <button className="auth-back-btn" onClick={() => navigateTo("home")}>
          ← Return to IN-PACT Overview
        </button>
        <div className="auth-lang-badge">
          <span>🇮🇳 Digital India & Smart Cities Mission</span>
        </div>
      </div>

      <div className="auth-container citizen-auth-container">
        {/* Left / Main Card */}
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-badge citizen-badge">
              <span className="badge-flag">🇮🇳</span> CITIZEN ACCESS PORTAL
            </div>
            <h2>Sign In to IN-PACT</h2>
            <p>
              Report civic hazards, track real-time resolution milestones, and verify municipal field actions.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${authMode === "otp" ? "active" : ""}`}
              onClick={() => {
                setAuthMode("otp");
                setStep("input");
              }}
            >
              📱 Mobile OTP
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${authMode === "email" ? "active" : ""}`}
              onClick={() => setAuthMode("email")}
            >
              ✉️ Email ID
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${authMode === "digilocker" ? "active" : ""}`}
              onClick={() => setAuthMode("digilocker")}
            >
              🆔 DigiLocker / Aadhaar
            </button>
          </div>

          {/* TAB 1: Mobile OTP */}
          {authMode === "otp" && (
            <>
              {step === "input" ? (
                <form onSubmit={handleSendOtp} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="mobileInput">Registered Mobile Number</label>
                    <div className="phone-input-wrapper">
                      <span className="phone-country-code">🇮🇳 +91</span>
                      <input
                        id="mobileInput"
                        type="tel"
                        className="form-input phone-field"
                        placeholder="98765 43210"
                        value={mobileNumber.replace("+91 ", "")}
                        onChange={(e) => setMobileNumber("+91 " + e.target.value)}
                        required
                      />
                    </div>
                    <span className="form-hint">
                      🔒 A secure 4-digit verification code will be sent via SMS / WhatsApp.
                    </span>
                  </div>

                  <button type="submit" className="primary-auth-btn citizen-action-btn" disabled={loading}>
                    {loading ? (
                      <span className="btn-loading-flex">
                        <span className="spinner-dot"></span> Generating OTP...
                      </span>
                    ) : (
                      "Send Secure OTP Verification Code →"
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="auth-form">
                  <div className="form-group">
                    <div className="form-label-row">
                      <label htmlFor="otpInput">Enter 4-Digit Verification Code</label>
                      <span className="demo-chip-fill" onClick={() => setOtp("7492")} title="Click to fill sample OTP">
                        ⚡ Click to Fill: 7492
                      </span>
                    </div>

                    <input
                      id="otpInput"
                      type="text"
                      maxLength={4}
                      className="form-input otp-input-large"
                      placeholder="• • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      autoFocus
                      required
                    />

                    <div className="otp-meta">
                      <span className="otp-sent-to">
                        Code sent to <strong>{mobileNumber || "+91 98765 43210"}</strong>
                      </span>
                      <button
                        type="button"
                        className="resend-link-btn"
                        onClick={() => setStep("input")}
                      >
                        Change Number
                      </button>
                    </div>

                    <div className="resend-timer-row">
                      {isTimerActive ? (
                        <span className="timer-text">Resend code in <strong>00:{timer < 10 ? `0${timer}` : timer}</strong></span>
                      ) : (
                        <button type="button" className="resend-action-btn" onClick={handleResendOtp}>
                          🔄 Resend OTP Code
                        </button>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="primary-auth-btn citizen-action-btn" disabled={loading}>
                    {loading ? (
                      <span className="btn-loading-flex">
                        <span className="spinner-dot"></span> Verifying OTP...
                      </span>
                    ) : (
                      "Verify & Open Citizen Portal →"
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {/* TAB 2: Email & Password */}
          {authMode === "email" && (
            <form onSubmit={handleEmailLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="emailInput">Registered Email Address</label>
                <input
                  id="emailInput"
                  type="email"
                  className="form-input"
                  placeholder="ananya.sharma@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="passwordInput">Citizen Portal Password</label>
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

              <button type="submit" className="primary-auth-btn citizen-action-btn" disabled={loading}>
                {loading ? "Authenticating Account..." : "Sign In with Email →"}
              </button>
            </form>
          )}

          {/* TAB 3: DigiLocker / Aadhaar */}
          {authMode === "digilocker" && (
            <div className="digilocker-auth-box">
              <div className="digilocker-badge">
                <span className="digi-icon">🛡️</span>
                <div>
                  <strong>DigiLocker National Identity Gateway</strong>
                  <p>Instant verification via Aadhaar Virtual ID or DigiLocker PIN</p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="aadhaarInput">Aadhaar Virtual ID (VID) / DigiLocker Handle</label>
                <input
                  id="aadhaarInput"
                  type="text"
                  className="form-input"
                  value={aadhaarVid}
                  onChange={(e) => setAadhaarVid(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="digilocker-submit-btn"
                onClick={handleDigiLockerLogin}
                disabled={loading}
              >
                {loading ? "Connecting to DigiLocker API..." : "🔒 Authenticate via DigiLocker Instant e-Sign"}
              </button>
            </div>
          )}

          {/* Demo Profiles Divider */}
          <div className="auth-divider">
            <span>⚡ 1-CLICK DEMO CITIZEN PROFILES (FOR EVALUATORS)</span>
          </div>

          {/* Demo Profiles Grid */}
          <div className="demo-profiles-grid">
            <button
              type="button"
              className="demo-profile-chip"
              onClick={() => handleQuickDemoCitizen("ananya")}
            >
              <div className="demo-chip-avatar">👩</div>
              <div className="demo-chip-info">
                <strong className="demo-chip-name">Ananya Sharma</strong>
                <span className="demo-chip-role">Ward 12 Resident • Active Reporter</span>
              </div>
              <span className="demo-chip-arrow">→</span>
            </button>

            <button
              type="button"
              className="demo-profile-chip"
              onClick={() => handleQuickDemoCitizen("vikram")}
            >
              <div className="demo-chip-avatar">👨</div>
              <div className="demo-chip-info">
                <strong className="demo-chip-name">Vikramaditya Singh</strong>
                <span className="demo-chip-role">Alpha-1 RWA President • 12 Reports</span>
              </div>
              <span className="demo-chip-arrow">→</span>
            </button>

            <button
              type="button"
              className="demo-profile-chip"
              onClick={() => handleQuickDemoCitizen("sunita")}
            >
              <div className="demo-chip-avatar">👩‍💼</div>
              <div className="demo-chip-info">
                <strong className="demo-chip-name">Sunita Devi</strong>
                <span className="demo-chip-role">Sector 62 Market Association Lead</span>
              </div>
              <span className="demo-chip-arrow">→</span>
            </button>
          </div>

          {/* Footer Switcher to Gov Login */}
          <div className="auth-footer">
            <p>
              Are you a designated Government Authority or Field Officer?{" "}
              <button className="text-link gov-link" onClick={() => navigateTo("gov-login")}>
                Officer Command Portal →
              </button>
            </p>
          </div>
        </div>

        {/* Right / Sidebar Information */}
        <div className="auth-sidebar-info">
          <div className="sidebar-intro-box">
            <h3>Why Citizens Love IN-PACT</h3>
            <p>Direct civic empowerment powered by real-time artificial intelligence.</p>
          </div>

          <div className="info-feature-box citizen-info-box">
            <div className="info-icon">⚡</div>
            <div className="info-content">
              <h4>Zero Bureaucracy</h4>
              <p>
                No need to guess departments or officer names. Our AI understands your description and routes directly to PWD, Jal Nigam, or NPCL.
              </p>
            </div>
          </div>

          <div className="info-feature-box citizen-info-box">
            <div className="info-icon">📸</div>
            <div className="info-content">
              <h4>Multi-Modal Submissions</h4>
              <p>
                Capture photos, speak a voice memo in Hindi/English, or share live GPS coordinates in under 15 seconds.
              </p>
            </div>
          </div>

          <div className="info-feature-box citizen-info-box">
            <div className="info-icon">📍</div>
            <div className="info-content">
              <h4>Live Geotagged Proof</h4>
              <p>
                Track repair crews on interactive maps and receive timestamped before-and-after photographic evidence upon job completion.
              </p>
            </div>
          </div>

          <div className="info-feature-box citizen-info-box">
            <div className="info-icon">🛡️</div>
            <div className="info-content">
              <h4>Privacy & Anonymous Filing</h4>
              <p>
                Choose to report civic hazards anonymously while retaining full status tracking via your unique grievance tracking ticket.
              </p>
            </div>
          </div>

          {/* Security Trust Strip */}
          <div className="security-trust-strip">
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span>256-Bit SSL Encrypted</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🇮🇳</span>
              <span>Digital India Compliant</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✨</span>
              <span>24/7 AI Triage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
