import React, { useState, useEffect } from "react";
import { NationalEmblem } from "../components/GovEmblem";

export default function CitizenLogin({ onLogin, navigateTo }) {
  const [authMode, setAuthMode] = useState("otp"); // 'otp' | 'digilocker' | 'email'
  const [mobileNumber, setMobileNumber] = useState("9876543210");
  const [email, setEmail] = useState("ananya.sharma@example.com");
  const [password, setPassword] = useState("••••••••");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input"); // 'input' | 'otp'
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("7X9K2");
  const [captchaInput, setCaptchaInput] = useState("7X9K2");

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

  const refreshCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput("");
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!mobileNumber) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setOtp("7492"); // Sample prefilled demo OTP
      setTimer(30);
      setIsTimerActive(true);
    }, 450);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        id: "CIT-UP-8821",
        name: "Ananya Sharma",
        role: "citizen",
        email: email || "ananya.sharma@example.com",
        phone: "+91 " + mobileNumber,
        ward: "Ward 12, Knowledge Park, Greater Noida",
        verified: true,
        authType: "Aadhaar / Mobile OTP Verified"
      });
      navigateTo("citizen-dashboard");
    }, 400);
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        id: "CIT-UP-8821",
        name: "Ananya Sharma",
        role: "citizen",
        email: email,
        phone: "+91 " + mobileNumber,
        ward: "Ward 12, Knowledge Park, Greater Noida",
        verified: true,
        authType: "Citizen e-Gov Account"
      });
      navigateTo("citizen-dashboard");
    }, 400);
  };

  const handleDigiLockerLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        id: "CIT-DL-9904",
        name: "Ananya Sharma",
        role: "citizen",
        email: "ananya.sharma@example.com",
        phone: "+91 98765 43210",
        ward: "Ward 12, Greater Noida Metropolis",
        verified: true,
        authType: "DigiLocker Govt. Verified ID"
      });
      navigateTo("citizen-dashboard");
    }, 500);
  };

  const handleDemoCitizen = (name, ward, phone) => {
    onLogin({
      id: "CIT-UP-" + Math.floor(1000 + Math.random() * 9000),
      name: name,
      role: "citizen",
      email: name.toLowerCase().replace(" ", ".") + "@example.com",
      phone: phone,
      ward: ward,
      verified: true,
      authType: "Digital Identity Verified"
    });
    navigateTo("citizen-dashboard");
  };

  return (
    <div className="gov-auth-wrapper">
      {/* Top back ribbon */}
      <div className="gov-auth-top-bar">
        <div className="gov-container auth-top-inner">
          <button className="gov-auth-back-btn" onClick={() => navigateTo("home")}>
            ← Return to National Portal Home
          </button>
          <div className="auth-cert-seal">
            🔒 256-Bit SSL Encrypted • MeitY & NIC e-Governance Compliant
          </div>
        </div>
      </div>

      <div className="gov-container auth-page-layout">
        {/* Left: Official Government Login Form Card */}
        <div className="gov-auth-card">
          <div className="auth-card-top">
            <NationalEmblem size={44} />
            <div className="auth-title-texts">
              <span className="auth-dept-sub">जनता सेवा पोर्टल • CITIZEN PORTAL</span>
              <h2>Unified Citizen Authentication</h2>
              <p>Sign in using registered Mobile OTP, DigiLocker, or Jan Parichay</p>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="gov-auth-tabs">
            <button
              className={`auth-tab-btn ${authMode === "otp" ? "active" : ""}`}
              onClick={() => {
                setAuthMode("otp");
                setStep("input");
              }}
            >
              📱 Mobile OTP
            </button>
            <button
              className={`auth-tab-btn ${authMode === "digilocker" ? "active" : ""}`}
              onClick={() => setAuthMode("digilocker")}
            >
              🪪 DigiLocker KYC
            </button>
            <button
              className={`auth-tab-btn ${authMode === "email" ? "active" : ""}`}
              onClick={() => setAuthMode("email")}
            >
              ✉️ Email / Password
            </button>
          </div>

          {/* TAB 1: Mobile OTP Login */}
          {authMode === "otp" && (
            <div className="auth-tab-body">
              {step === "input" ? (
                <form onSubmit={handleSendOtp} className="gov-form">
                  <div className="gov-form-group">
                    <label className="gov-form-label">
                      Registered Mobile Number (पंजीकृत मोबाइल नंबर) *
                    </label>
                    <div className="phone-input-combo">
                      <span className="phone-prefix">+91</span>
                      <input
                        type="tel"
                        className="gov-input"
                        placeholder="Enter 10-digit mobile number"
                        value={mobileNumber}
                        maxLength={10}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                        required
                      />
                    </div>
                    <span className="input-hint">An instant 4-digit OTP will be dispatched via Government SMS Gateway.</span>
                  </div>

                  {/* Standard Govt Captcha Box */}
                  <div className="gov-captcha-box">
                    <label className="gov-form-label">Security Verification Code *</label>
                    <div className="captcha-row">
                      <div className="captcha-display" title="Security Captcha">
                        <span>{captchaCode}</span>
                      </div>
                      <button type="button" className="captcha-refresh-btn" onClick={refreshCaptcha} title="Refresh Captcha">
                        🔄
                      </button>
                      <input
                        type="text"
                        className="gov-input captcha-input"
                        placeholder="Enter code"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="gov-btn-primary-block" disabled={loading}>
                    {loading ? "Generating OTP..." : "Get OTP via SMS (ओटीपी प्राप्त करें) →"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="gov-form">
                  <div className="otp-sent-banner">
                    <span>✅ OTP sent to <strong>+91 {mobileNumber}</strong></span>
                    <button type="button" className="text-link-btn" onClick={() => setStep("input")}>
                      Change Number
                    </button>
                  </div>

                  <div className="gov-form-group">
                    <label className="gov-form-label">Enter 4-Digit Verification Code (ओटीपी दर्ज करें) *</label>
                    <input
                      type="text"
                      className="gov-input otp-code-input"
                      placeholder="• • • •"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <div className="otp-timer-row">
                      {isTimerActive ? (
                        <span className="timer-text">Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}</span>
                      ) : (
                        <button
                          type="button"
                          className="resend-link"
                          onClick={() => {
                            setTimer(30);
                            setIsTimerActive(true);
                          }}
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="gov-btn-primary-block" disabled={loading}>
                    {loading ? "Verifying..." : "Verify & Enter Portal (प्रवेश करें) ✓"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: DigiLocker Single Sign-On */}
          {authMode === "digilocker" && (
            <div className="auth-tab-body text-center">
              <div className="digilocker-promo-box">
                <div className="digilocker-badge-lg">
                  <span className="digi-icon">🪪</span>
                  <div>
                    <h4>DigiLocker / MeriPehchaan KYC</h4>
                    <p>Government of India National Single Sign-On</p>
                  </div>
                </div>
                <p className="digi-desc">
                  Instantly authenticate using your Aadhaar-linked DigiLocker identity. No manual documentation required for grievance verification.
                </p>
                <button
                  type="button"
                  className="gov-btn-digilocker-block"
                  onClick={handleDigiLockerLogin}
                  disabled={loading}
                >
                  {loading ? "Connecting to DigiLocker..." : "Authenticate with DigiLocker →"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Email / Password */}
          {authMode === "email" && (
            <div className="auth-tab-body">
              <form onSubmit={handleEmailLogin} className="gov-form">
                <div className="gov-form-group">
                  <label className="gov-form-label">Email ID (ईमेल आईडी) *</label>
                  <input
                    type="email"
                    className="gov-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="gov-form-group">
                  <label className="gov-form-label">Account Password (पासवर्ड) *</label>
                  <input
                    type="password"
                    className="gov-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="gov-btn-primary-block" disabled={loading}>
                  {loading ? "Signing in..." : "Login to Citizen Portal (लॉगिन करें) →"}
                </button>
              </form>
            </div>
          )}

          {/* Citizen Quick Evaluation Demo Profiles */}
          <div className="gov-demo-profile-box">
            <span className="demo-box-label">QUICK EVALUATION CITIZEN PROFILES:</span>
            <div className="demo-chips-grid">
              <button
                type="button"
                className="gov-demo-chip"
                onClick={() => handleDemoCitizen("Ananya Sharma", "Ward 12, Knowledge Park III", "+91 98765 43210")}
              >
                👤 Ananya Sharma (Ward 12)
              </button>
              <button
                type="button"
                className="gov-demo-chip"
                onClick={() => handleDemoCitizen("Vikramaditya Verma", "Ward 5, Sector Alpha 1", "+91 98112 33445")}
              >
                👤 Vikramaditya Verma (Ward 5)
              </button>
              <button
                type="button"
                className="gov-demo-chip"
                onClick={() => handleDemoCitizen("Meenakshi Sundaram", "Ward 9, Delta 2 Metropolis", "+91 99201 88776")}
              >
                👤 Meenakshi S. (Ward 9)
              </button>
            </div>
          </div>
        </div>

        {/* Right: Citizen Charter & Help Information */}
        <div className="gov-auth-info-col">
          <div className="gov-card auth-info-card">
            <div className="info-card-header">
              <span className="info-icon">🏛️</span>
              <h3>Citizen Grievance Redressal Rights</h3>
            </div>
            <ul className="info-points-list">
              <li>
                <strong>Statutory Right to Redressal:</strong> Every grievance filed through this portal is assigned a binding legal SLA under the Uttar Pradesh Janhit Guarantee Act.
              </li>
              <li>
                <strong>Direct Officer Allocation:</strong> Complaints are auto-triaged to designated Executive Engineers without administrative desk delays.
              </li>
              <li>
                <strong>Geotagged Photo Verification:</strong> Field personnel must provide photographic evidence of completed repair work before case closure.
              </li>
              <li>
                <strong>Second Appeal Escalation:</strong> If unsatisfied with resolution, citizens may trigger a direct review with the District Magistrate.
              </li>
            </ul>

            <div className="official-helpline-box">
              <h4>Citizen Support Helplines</h4>
              <div className="helpline-row">
                <span>📞 Greater Noida Municipal Helpline:</span>
                <strong>0120-2326101</strong>
              </div>
              <div className="helpline-row">
                <span>📞 All-India Civic Emergency:</span>
                <strong>1913 / 112</strong>
              </div>
              <div className="helpline-row">
                <span>✉️ Support Email:</span>
                <strong>grievance-support@gnida.in</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
