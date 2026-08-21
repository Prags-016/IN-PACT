import React, { useState } from "react";
import { NationalEmblem } from "../components/GovEmblem";
import { register } from "../services/authService";

const POPULAR_WARDS = [
  "Ward 12, Knowledge Park III, Greater Noida",
  "Ward 5, Sector Alpha 1, Greater Noida",
  "Ward 9, Delta 2 Metropolis, Greater Noida",
  "Ward 1, Pari Chowk & Commercial Belt",
  "Ward 15, Sector Gamma 2, Greater Noida",
  "Ward 18, Sector Beta 1, Greater Noida",
  "Ward 22, Ecotech Extension, Greater Noida",
  "Ward 27, Surajpur Industrial Area",
  "Other / Custom Locality",
];

export default function CitizenRegister({ onLogin, navigateTo }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ward: POPULAR_WARDS[0],
    customWard: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Captcha state
  const [captchaCode, setCaptchaCode] = useState("K4M8X");
  const [captchaInput, setCaptchaInput] = useState("K4M8X");

  const refreshCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput("");
  };

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "None", color: "#cbd5e1" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "#ef4444" };
    if (score === 2 || score === 3) return { score: 2, label: "Moderate", color: "#f59e0b" };
    return { score: 3, label: "Strong", color: "#10b981" };
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validation checks
    if (!formData.name.trim()) {
      setError("Please enter your full legal name.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }
    if (captchaInput.trim().toUpperCase() !== captchaCode.trim().toUpperCase()) {
      setError("Security Captcha verification failed. Please check the code.");
      refreshCaptcha();
      return;
    }
    if (!termsAgreed) {
      setError("Please agree to the Citizen Charter & Terms of Service to proceed.");
      return;
    }

    setLoading(true);
    const effectiveWard =
      formData.ward === "Other / Custom Locality"
        ? formData.customWard || "Greater Noida Metropolis"
        : formData.ward;

    try {
      const user = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone ? `+91 ${formData.phone.replace(/\D/g, "")}` : "",
        ward: effectiveWard,
      });

      setSuccessMsg("Registration successful! Redirecting to Citizen Dashboard...");
      setTimeout(() => {
        onLogin(user);
        navigateTo("citizen-dashboard");
      }, 700);
    } catch (err) {
      setError(err.message || "Failed to register account. Please try again.");
      setLoading(false);
    }
  };

  const handleQuickFillPreset = (presetName, presetWard, presetEmail, presetPhone) => {
    setFormData({
      name: presetName,
      email: presetEmail,
      phone: presetPhone,
      ward: presetWard,
      customWard: "",
      password: "Password@123",
      confirmPassword: "Password@123",
    });
    setCaptchaInput(captchaCode);
    setError(null);
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
        {/* Left: Official Government Register Form Card */}
        <div className="gov-auth-card">
          <div className="auth-card-top">
            <NationalEmblem size={44} />
            <div className="auth-title-texts">
              <span className="auth-dept-sub">नागरिक पंजीकरण पोर्टल • CITIZEN REGISTRATION</span>
              <h2>Create Citizen Account</h2>
              <p>Register for seamless public grievance redressal, real-time SLA tracking, and official notices</p>
            </div>
          </div>

          {/* Prompt Switcher to Login */}
          <div className="auth-switch-prompt auth-switch-top-banner">
            <span>Already have an account?</span>
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => navigateTo("citizen-login")}
            >
              Login here (लॉगिन करें) →
            </button>
          </div>

          <form onSubmit={handleRegister} className="gov-form" style={{ marginTop: "14px" }}>
            {error && <div className="auth-error-banner">{error}</div>}
            {successMsg && <div className="auth-success-banner">{successMsg}</div>}

            {/* Full Legal Name */}
            <div className="gov-form-group">
              <label className="gov-form-label">Full Legal Name (पूरा नाम) *</label>
              <input
                type="text"
                name="name"
                className="gov-input"
                placeholder="e.g. Ramesh Kumar Verma"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <span className="input-hint">Enter your name as per official government photo ID (Aadhaar/Voter ID).</span>
            </div>

            {/* Email Address */}
            <div className="gov-form-group">
              <label className="gov-form-label">Email ID (ईमेल आईडी) *</label>
              <input
                type="email"
                name="email"
                className="gov-input"
                placeholder="ramesh.verma@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span className="input-hint">Used for statutory grievance status updates and official notifications.</span>
            </div>

            {/* Mobile Number */}
            <div className="gov-form-group">
              <label className="gov-form-label">Mobile Number (मोबाइल नंबर)</label>
              <div className="phone-input-combo">
                <span className="phone-prefix">+91</span>
                <input
                  type="tel"
                  name="phone"
                  className="gov-input"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  maxLength={10}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />
              </div>
            </div>

            {/* Residential Ward / Locality */}
            <div className="gov-form-group">
              <label className="gov-form-label">Residential Ward / Locality (वार्ड / क्षेत्र) *</label>
              <select
                name="ward"
                className="gov-input"
                value={formData.ward}
                onChange={handleChange}
                required
              >
                {POPULAR_WARDS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            {formData.ward === "Other / Custom Locality" && (
              <div className="gov-form-group">
                <label className="gov-form-label">Specify Locality / Sector Name *</label>
                <input
                  type="text"
                  name="customWard"
                  className="gov-input"
                  placeholder="e.g. Sector Chi-4, Greater Noida"
                  value={formData.customWard}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* Password & Confirm Password in Grid */}
            <div className="auth-grid-two-col">
              <div className="gov-form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className="gov-form-label">Password (पासवर्ड) *</label>
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="gov-input"
                  placeholder="Min 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>

              <div className="gov-form-group">
                <label className="gov-form-label">Confirm Password (पुष्टि करें) *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="gov-input"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="password-strength-container">
                <div className="strength-meter-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(strength.score / 3) * 100}%`,
                      backgroundColor: strength.color,
                    }}
                  />
                </div>
                <div className="strength-meta">
                  <span className="strength-text" style={{ color: strength.color }}>
                    Strength: <strong>{strength.label}</strong>
                  </span>
                  {formData.confirmPassword && (
                    <span className="match-status">
                      {formData.password === formData.confirmPassword ? (
                        <span className="text-match-ok">✓ Passwords match</span>
                      ) : (
                        <span className="text-match-no">✕ Passwords do not match</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Standard Govt Captcha Box */}
            <div className="gov-captcha-box">
              <label className="gov-form-label">Security Verification Code *</label>
              <div className="captcha-row">
                <div className="captcha-display" title="Security Captcha">
                  <span>{captchaCode}</span>
                </div>
                <button
                  type="button"
                  className="captcha-refresh-btn"
                  onClick={refreshCaptcha}
                  title="Refresh Captcha"
                >
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

            {/* Terms & Consent Checkbox */}
            <div className="gov-checkbox-group" style={{ margin: "14px 0" }}>
              <label className="gov-checkbox-label">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                />
                <span>
                  I declare that the provided information is true, and agree to the{" "}
                  <strong>Digital India Citizen Charter</strong> &amp;{" "}
                  <strong>UP Janhit Guarantee Act terms</strong>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="gov-btn-primary-block"
              disabled={loading}
            >
              {loading ? "Creating Citizen Account..." : "Create Citizen Account (पंजीकरण पूर्ण करें) →"}
            </button>
          </form>

          {/* Bottom Switcher */}
          <div className="auth-switch-prompt auth-switch-bottom-box">
            <span>Already have an IN-PACT citizen account?</span>
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => navigateTo("citizen-login")}
            >
              Sign in to your account (लॉगिन करें) →
            </button>
          </div>

          {/* Fast Evaluation Fill Presets */}
          <div className="gov-demo-profile-box">
            <span className="demo-box-label">QUICK EVALUATION REGISTRATION PRESETS:</span>
            <div className="demo-chips-grid">
              <button
                type="button"
                className="gov-demo-chip"
                onClick={() =>
                  handleQuickFillPreset(
                    "Pooja Kashyap",
                    "Ward 12, Knowledge Park III, Greater Noida",
                    `pooja.${Math.floor(100 + Math.random() * 900)}@example.com`,
                    "9876501234"
                  )
                }
              >
                📝 Pooja Kashyap (Knowledge Park)
              </button>
              <button
                type="button"
                className="gov-demo-chip"
                onClick={() =>
                  handleQuickFillPreset(
                    "Aditya Narayan",
                    "Ward 5, Sector Alpha 1, Greater Noida",
                    `aditya.${Math.floor(100 + Math.random() * 900)}@example.com`,
                    "9811244556"
                  )
                }
              >
                📝 Aditya Narayan (Sector Alpha)
              </button>
            </div>
          </div>
        </div>

        {/* Right: Citizen Benefits & Help Information */}
        <div className="gov-auth-info-col">
          <div className="gov-card auth-info-card">
            <div className="info-card-header">
              <span className="info-icon">✨</span>
              <h3>Citizen Account Benefits</h3>
            </div>
            <ul className="info-points-list">
              <li>
                <strong>Instant Grievance Ingestion:</strong> Report road craters, waterlogging, streetlights, sanitation, and electrical faults with geo-tagging and photographic proof.
              </li>
              <li>
                <strong>Predictive Triage & Direct Officer Assignment:</strong> Automated allocation directly to Municipal Executive Engineers without manual desk backlogs.
              </li>
              <li>
                <strong>Real-Time SMS & Dashboard Updates:</strong> Track resolution milestones step-by-step from inspection to field completion.
              </li>
              <li>
                <strong>Statutory Janhit Guarantee Protection:</strong> Cases adhere to legally binding time-bounds with escalation to the District Magistrate.
              </li>
            </ul>

            <div className="official-helpline-box">
              <h4>Citizen Registration Support</h4>
              <div className="helpline-row">
                <span>📞 Toll-Free Helpline:</span>
                <strong>1800-180-0101 / 1913</strong>
              </div>
              <div className="helpline-row">
                <span>✉️ Registration Support:</span>
                <strong>pg-cell@gnida.in</strong>
              </div>
              <div className="helpline-row">
                <span>🏛️ Municipal HQ:</span>
                <strong>Plot 01, Knowledge Park IV, Greater Noida</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
