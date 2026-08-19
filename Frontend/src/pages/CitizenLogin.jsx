import React, { useState } from "react";

export default function CitizenLogin({ onLogin, navigateTo }) {
  const [mobileOrEmail, setMobileOrEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input"); // 'input' | 'otp'
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!mobileOrEmail) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setOtp("7492"); // Sample OTP prefill for easy evaluation
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
        email: mobileOrEmail.includes("@") ? mobileOrEmail : "ananya.sharma@example.com",
        phone: "+91 98765 43210",
        ward: "Ward 12, Greater Noida"
      });
      navigateTo("citizen-dashboard");
    }, 500);
  };

  const handleQuickDemoLogin = () => {
    onLogin({
      id: "CIT-8821",
      name: "Ananya Sharma",
      role: "citizen",
      email: "ananya.sharma@example.com",
      phone: "+91 98765 43210",
      ward: "Ward 12, Greater Noida"
    });
    navigateTo("citizen-dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge citizen-badge">
            <span>🇮🇳</span> CITIZEN ACCESS PORTAL
          </div>
          <h2>Sign In to IN-PACT</h2>
          <p>Report civic issues, track resolution timelines, and verify government action.</p>
        </div>

        {step === "input" ? (
          <form onSubmit={handleSendOtp} className="auth-form">
            <div className="form-group">
              <label htmlFor="contactInput">Mobile Number or Email Address</label>
              <input
                id="contactInput"
                type="text"
                className="form-input"
                placeholder="e.g. +91 98765 43210 or yourname@gmail.com"
                value={mobileOrEmail}
                onChange={(e) => setMobileOrEmail(e.target.value)}
                required
              />
              <span className="form-hint">
                🔒 We will send a secure 4-digit verification code.
              </span>
            </div>

            <button type="submit" className="primary-auth-btn" disabled={loading}>
              {loading ? "Sending Secure OTP..." : "Get OTP Verification Code →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <div className="form-group">
              <label htmlFor="otpInput">Enter 4-Digit Verification Code</label>
              <input
                id="otpInput"
                type="text"
                maxLength={4}
                className="form-input otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <div className="otp-meta">
                <span className="otp-sent-to">Code sent to <strong>{mobileOrEmail || "+91 98765 43210"}</strong></span>
                <button type="button" className="resend-btn" onClick={() => setStep("input")}>Change</button>
              </div>
            </div>

            <button type="submit" className="primary-auth-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Access Dashboard →"}
            </button>
          </form>
        )}

        <div className="auth-divider">
          <span>OR FOR TESTING / DEMO EVALUATION</span>
        </div>

        <button type="button" className="demo-login-btn citizen" onClick={handleQuickDemoLogin}>
          ⚡ 1-Click Quick Sign-In as <strong>Citizen (Ananya Sharma)</strong>
        </button>

        <div className="auth-footer">
          <p>
            Are you a designated Government Authority?{" "}
            <button className="text-link" onClick={() => navigateTo("gov-login")}>
              Officer Portal Login →
            </button>
          </p>
        </div>
      </div>

      <div className="auth-sidebar-info">
        <div className="info-feature-box">
          <div className="info-icon">⚡</div>
          <h4>Zero Bureaucracy</h4>
          <p>No need to search for departmental hierarchies. AI routes your issue accurately in seconds.</p>
        </div>

        <div className="info-feature-box">
          <div className="info-icon">📍</div>
          <h4>Live Geotagged Tracking</h4>
          <p>Receive real-time notifications on field inspections and repair milestones with photo proof.</p>
        </div>

        <div className="info-feature-box">
          <div className="info-icon">🛡️</div>
          <h4>Citizen Privacy Guaranteed</h4>
          <p>Option to submit anonymous complaints while retaining full status tracking via complaint ID.</p>
        </div>
      </div>
    </div>
  );
}
