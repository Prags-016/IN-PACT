import React, { useState, useEffect } from "react";
import { NationalEmblem } from "../components/GovEmblem";
import { login, sendOtp, mobileOtpLogin } from "../services/authService";

export default function CitizenLogin({ onLogin, navigateTo }) {
  const [authMode, setAuthMode] = useState("email"); // 'email' | 'otp' | 'digilocker'
  const [mobileNumber, setMobileNumber] = useState("9876543210");
  const [email, setEmail] = useState("ananya.sharma@example.com");
  const [password, setPassword] = useState("Password@123");
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input"); // 'input' | 'otp'
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("7X9K2");
  const [captchaInput, setCaptchaInput] = useState("7X9K2");
  const [smsPopup, setSmsPopup] = useState(null);

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

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    if (!mobileNumber || mobileNumber.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (step === "input" && captchaInput.trim().toUpperCase() !== captchaCode.trim().toUpperCase()) {
      setError("Security Captcha verification failed. Please enter the correct code.");
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(mobileNumber);
      setStep("otp");
      setOtp(""); // EMPTY input field — citizen must type the received OTP
      setTimer(30);
      setIsTimerActive(true);
      if (res && res.smsNotification) {
        setSmsPopup(res.smsNotification);
      }
    } catch (err) {
      setError(err.message || "Failed to dispatch OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    if (!otp || otp.trim().length < 4) {
      setError("Please enter the complete 4-digit verification code sent to your phone.");
      return;
    }

    setLoading(true);
    try {
      const user = await mobileOtpLogin(mobileNumber, otp.trim());
      setSmsPopup(null);
      onLogin({
        ...user,
        verified: true,
        authType: "Aadhaar / Mobile OTP Verified",
      });
      navigateTo("citizen-dashboard");
    } catch (err) {
      setError(err.message || "Invalid or expired OTP code. Please enter the correct code.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillFromSms = () => {
    if (smsPopup && smsPopup.otp) {
      setOtp(smsPopup.otp);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      onLogin(user);
      navigateTo("citizen-dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  const handleDemoCitizen = (name, ward, phone, demoEmail = "") => {
    onLogin({
      id: "CIT-UP-" + Math.floor(1000 + Math.random() * 9000),
      name: name,
      role: "citizen",
      email: demoEmail || name.toLowerCase().replace(" ", ".") + "@example.com",
      phone: phone,
      ward: ward,
      verified: true,
      authType: "Digital Identity Verified"
    });
    navigateTo("citizen-dashboard");
  };

  return (
    <div className="gov-auth-wrapper">
      {/* Simulated Live Government SMS Notification Toast */}
      {smsPopup && (
        <div className="gov-sms-toast-overlay">
          <div className="gov-sms-toast-card">
            <div className="sms-toast-header">
              <div className="sms-sender-info">
                <span className="sms-icon-bubble">💬</span>
                <div>
                  <div className="sms-sender-name">
                    <strong>{smsPopup.sender}</strong>
                    <span className="sms-gov-pill">OFFICIAL SMS</span>
                  </div>
                  <span className="sms-time-stamp">{smsPopup.phone} • {smsPopup.timestamp}</span>
                </div>
              </div>
              <button
                type="button"
                className="sms-toast-close"
                onClick={() => setSmsPopup(null)}
                title="Dismiss SMS"
              >
                ✕
              </button>
            </div>
            <div className="sms-toast-content">
              <p>{smsPopup.text}</p>
              <div className="sms-action-row">
                <span className="sms-code-pill">OTP: <strong>{smsPopup.otp}</strong></span>
                <button
                  type="button"
                  className="sms-autofill-btn"
                  onClick={handleAutoFillFromSms}
                >
                  ⚡ Auto-fill OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

          {/* Prompt Switcher to Registration */}
          <div className="auth-switch-prompt auth-switch-top-banner">
            <span>New user or not registered yet?</span>
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => navigateTo("citizen-register")}
            >
              Register here (नया नागरिक पंजीकरण) →
            </button>
          </div>

          {/* Mode Selector Tabs */}
          <div className="gov-auth-tabs">
            <button
              className={`auth-tab-btn ${authMode === "email" ? "active" : ""}`}
              onClick={() => setAuthMode("email")}
            >
              ✉️ Email / Password
            </button>
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
          </div>

          {/* TAB 1: Email / Password (Default & Recommended) */}
          {authMode === "email" && (
            <div className="auth-tab-body">
              <form onSubmit={handleEmailLogin} className="gov-form">
                <div className="gov-form-group">
                  <label className="gov-form-label">Email ID or Registered Mobile (ईमेल या मोबाइल नंबर) *</label>
                  <input
                    type="text"
                    className="gov-input"
                    placeholder="name@example.com or 10-digit mobile"
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
                {error && <div className="auth-error-banner">{error}</div>}
                <button type="submit" className="gov-btn-primary-block" disabled={loading}>
                  {loading ? "Signing in..." : "Login to Citizen Portal (लॉगिन करें) →"}
                </button>
                <div style={{ textAlign: "center", marginTop: "12px", fontSize: "13px" }}>
                  <span style={{ color: "#64748B" }}>Not registered yet? </span>
                  <button
                    type="button"
                    style={{ color: "var(--gov-primary)", fontWeight: "800", textDecoration: "underline" }}
                    onClick={() => navigateTo("citizen-register")}
                  >
                    Register here (नया नागरिक खाता बनाएं) →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Mobile OTP Login */}
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

                  {error && <div className="auth-error-banner">{error}</div>}

                  <button type="submit" className="gov-btn-primary-block" disabled={loading}>
                    {loading ? "Generating OTP..." : "Get OTP via SMS (ओटीपी प्राप्त करें) →"}
                  </button>
                  <div style={{ textAlign: "center", marginTop: "12px", fontSize: "13px" }}>
                    <span style={{ color: "#64748B" }}>New to IN-PACT? </span>
                    <button
                      type="button"
                      style={{ color: "var(--gov-primary)", fontWeight: "800", textDecoration: "underline" }}
                      onClick={() => navigateTo("citizen-register")}
                    >
                      Register here (पंजीकरण करें) →
                    </button>
                  </div>
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
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      required
                      autoFocus
                    />
                    <div className="otp-timer-row">
                      {isTimerActive ? (
                        <span className="timer-text">Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}</span>
                      ) : (
                        <button
                          type="button"
                          className="resend-link"
                          onClick={() => handleSendOtp()}
                        >
                          Resend OTP (पुनः भेजें)
                        </button>
                      )}
                    </div>
                  </div>

                  {error && <div className="auth-error-banner">{error}</div>}

                  <button type="submit" className="gov-btn-primary-block" disabled={loading}>
                    {loading ? "Verifying..." : "Verify & Enter Portal (प्रवेश करें) ✓"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: DigiLocker Single Sign-On */}
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

          {/* Bottom Switcher */}
          <div className="auth-switch-prompt auth-switch-bottom-box">
            <span>Not registered yet on IN-PACT?</span>
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => navigateTo("citizen-register")}
            >
              Register here (नया खाता बनाएं) →
            </button>
          </div>

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
