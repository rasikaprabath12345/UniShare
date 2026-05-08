import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import { Lock, Eye, EyeOff, ChevronLeft, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ current: false, newP: false, confirm: false });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleShow = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  /* Password strength */
  const pw = formData.newPassword;
  const checks = {
    length:  pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    lower:   /[a-z]/.test(pw),
    number:  /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
  const strengthScore = Object.values(checks).filter(Boolean).length;
  const strengthLabel = ["", "Weak", "Weak", "Fair", "Good", "Strong"][strengthScore];
  const strengthColor = ["", "#d4537e", "#d4537e", "#b7830a", "#1565C0", "#0f6e56"][strengthScore];
  const strengthWidth = `${(strengthScore / 5) * 100}%`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setMessage({ text: "New passwords do not match.", type: "error" });
    }
    if (strengthScore < 3) {
      return setMessage({ text: "Please choose a stronger password.", type: "error" });
    }
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      // ✅ Extract userId from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) {
        return setMessage({ text: "User not authenticated. Please login again.", type: "error" });
      }

      const token = localStorage.getItem("token");
      console.log('📤 Sending password change request:', {
        userId: user._id,
        endpoint: '/api/users/account/change-password'
      });

      // ✅ Send to NEW endpoint: /account/change-password
      await axios.put(
        `${API_BASE_URL}/api/users/account/change-password`,
        {
          userId: user._id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: "Password changed successfully! Redirecting…", type: "success" });
      setTimeout(() => navigate("/profile"), 2200);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to change password. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; }

        /* ── HERO ── */
        .cp-hero {
          position: relative;
          min-height: 280px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow: visible;
          padding-top: 40px;
        }
        .cp-hero-bg {
          position: absolute; inset: 0;
          background-image: url("../images/background2.jpg");
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        .cp-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(13,34,87,0.70) 0%,
            rgba(21,101,192,0.50) 50%,
            rgba(255,255,255,0.65) 100%
          );
          z-index: 1;
        }

        /* ── CARD OVERLAPPING HERO ── */
        .cp-card-wrap {
          position: relative; z-index: 2;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          padding: 0 24px 48px 24px;
        }
        .cp-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e8f0fe;
          box-shadow: 0 8px 40px rgba(21,101,192,0.13);
          padding: 32px 36px 36px;
        }

        /* ── CARD HEADER ── */
        .cp-card-icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
          box-shadow: 0 4px 14px rgba(21,101,192,0.28);
        }
        .cp-title {
          font-size: 1.25rem; font-weight: 800;
          color: #0d2257; margin-bottom: 4px;
        }
        .cp-sub {
          font-size: 0.75rem; color: #888;
          font-weight: 500; margin-bottom: 28px;
        }

        /* ── FORM ── */
        .cp-form-group { margin-bottom: 18px; }
        .cp-label {
          display: block;
          font-size: 0.72rem; font-weight: 700;
          color: #0d2257; margin-bottom: 7px;
          text-transform: uppercase; letter-spacing: 0.6px;
        }
        .cp-input-wrap { position: relative; }
        .cp-input {
          width: 100%;
          padding: 11px 42px 11px 14px;
          border: 1.5px solid #e8f0fe;
          border-radius: 11px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem; color: #0d2257;
          background: #f8faff;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .cp-input:focus {
          border-color: #1565C0;
          background: white;
          box-shadow: 0 0 0 3px rgba(21,101,192,0.08);
        }
        .cp-eye {
          position: absolute; right: 13px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #aaa; display: flex; align-items: center;
          padding: 0; transition: color 0.18s;
        }
        .cp-eye:hover { color: #1565C0; }

        /* ── STRENGTH BAR ── */
        .strength-wrap { margin-top: 10px; }
        .strength-track {
          height: 5px; background: #f0f4ff;
          border-radius: 20px; overflow: hidden; margin-bottom: 6px;
        }
        .strength-fill {
          height: 100%; border-radius: 20px;
          transition: width 0.3s, background 0.3s;
        }
        .strength-checks {
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .check-chip {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.62rem; font-weight: 600; border-radius: 20px;
          padding: 2px 9px; transition: all 0.2s;
        }
        .check-chip.pass { background: #e6f4f1; color: #0f6e56; }
        .check-chip.fail { background: #f4f7ff; color: #bbb; }

        /* ── ALERT ── */
        .cp-alert {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 14px; border-radius: 11px;
          font-size: 0.78rem; font-weight: 600;
          margin-bottom: 20px; line-height: 1.4;
        }
        .cp-alert.success { background: #e6f4f1; color: #0f6e56; border: 1px solid #a8dfd4; }
        .cp-alert.error   { background: #fce8ef; color: #993556; border: 1px solid #f5c2cf; }

        /* ── BUTTONS ── */
        .cp-actions {
          display: flex; gap: 10px; margin-top: 26px;
        }
        .btn-back {
          display: flex; align-items: center; gap: 6px;
          padding: 11px 18px;
          background: transparent; color: #1565C0;
          border: 1.5px solid #1565C0; border-radius: 11px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: all 0.18s;
          white-space: nowrap;
        }
        .btn-back:hover { background: #e8f0fe; }
        .btn-submit {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 11px 18px;
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          color: white; border: none; border-radius: 11px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem; font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(21,101,192,0.30);
          transition: all 0.2s;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(21,101,192,0.40);
        }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── BODY SPACER ── */
        .cp-body {
          padding-bottom: 80px;
          background: #f4f7ff;
          min-height: 100px;
        }

        /* ══════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════ */
        @media (max-width: 1024px) {
          .cp-card-wrap { max-width: 460px; padding: 0 28px 44px; }
          .cp-hero { min-height: 270px; }
          .cp-card { padding: 28px 32px 32px; }
          .cp-title { font-size: 1.15rem; }
        }
        
        @media (max-width: 900px) {
          .cp-card-wrap { max-width: 440px; padding: 0 24px 40px; }
          .cp-hero { min-height: 260px; }
          .cp-card { padding: 26px 28px 30px; }
          .cp-title { font-size: 1.1rem; }
          .cp-sub { font-size: 0.72rem; }
          .cp-input { font-size: 0.8rem; padding: 10px 12px; }
          .cp-label { font-size: 0.68rem; margin-bottom: 6px; }
          .cp-form-group { margin-bottom: 16px; }
        }
        
        @media (max-width: 768px) {
          .cp-card-wrap { max-width: 100%; padding: 0 20px 48px; margin: 0 auto; }
          .cp-hero { min-height: 240px; padding-top: 32px; }
          .cp-card { padding: 24px 24px 28px; border-radius: 18px; }
          .cp-card-icon { width: 46px; height: 46px; margin-bottom: 14px; }
          .cp-title { font-size: 1.05rem; margin-bottom: 3px; }
          .cp-sub { font-size: 0.7rem; margin-bottom: 24px; }
          .cp-label { font-size: 0.66rem; margin-bottom: 6px; }
          .cp-input { font-size: 0.78rem; padding: 9px 12px; }
          .cp-input-wrap { position: relative; }
          .cp-eye { right: 11px; }
          .strength-wrap { margin-top: 8px; }
          .check-chip { font-size: 0.58rem; padding: 2px 7px; }
          .cp-form-group { margin-bottom: 14px; }
          .cp-actions { gap: 8px; margin-top: 22px; }
          .btn-back { padding: 9px 14px; font-size: 0.76rem; }
          .btn-submit { padding: 9px 14px; font-size: 0.78rem; }
          .cp-alert { padding: 10px 12px; font-size: 0.74rem; }
        }
        
        @media (max-width: 640px) {
          .cp-card-wrap { padding: 0 16px 40px; }
          .cp-hero { min-height: 220px; padding-top: 24px; }
          .cp-card { padding: 20px 20px 24px; border-radius: 16px; }
          .cp-card-icon { width: 42px; height: 42px; margin-bottom: 12px; }
          .cp-title { font-size: 1rem; margin-bottom: 2px; }
          .cp-sub { font-size: 0.68rem; margin-bottom: 20px; }
          .cp-label { font-size: 0.64rem; margin-bottom: 5px; }
          .cp-input { font-size: 0.76rem; padding: 8px 11px; }
          .strength-track { height: 4px; margin-bottom: 5px; }
          .check-chip { font-size: 0.56rem; padding: 1px 6px; }
          .cp-form-group { margin-bottom: 12px; }
          .strength-wrap { margin-top: 6px; }
          .cp-actions { gap: 6px; margin-top: 18px; flex-wrap: wrap; }
          .btn-back, .btn-submit { padding: 8px 12px; font-size: 0.74rem; }
          .cp-alert { padding: 9px 11px; font-size: 0.7rem; }
        }
        
        @media (max-width: 480px) {
          .cp-card-wrap { padding: 0 12px 32px; }
          .cp-hero { min-height: 200px; padding-top: 16px; }
          .cp-card { padding: 16px 16px 20px; border-radius: 14px; }
          .cp-card-icon { width: 38px; height: 38px; margin-bottom: 10px; }
          .cp-title { font-size: 0.95rem; }
          .cp-sub { font-size: 0.65rem; margin-bottom: 18px; }
          .cp-label { font-size: 0.6rem; margin-bottom: 4px; }
          .cp-input { font-size: 0.74rem; padding: 7px 10px; }
          .cp-eye { right: 9px; }
          .strength-track { height: 3px; margin-bottom: 4px; }
          .check-chip { font-size: 0.52rem; padding: 1px 5px; }
          .cp-form-group { margin-bottom: 10px; }
          .strength-wrap { margin-top: 5px; }
          .cp-actions { gap: 6px; margin-top: 14px; }
          .btn-back { padding: 7px 10px; font-size: 0.7rem; }
          .btn-submit { padding: 7px 10px; font-size: 0.72rem; }
          .cp-alert { padding: 8px 10px; font-size: 0.66rem; margin-bottom: 14px; }
          .cp-body { padding-bottom: 60px; }
        }
        
        @media (max-width: 360px) {
          .cp-card-wrap { padding: 0 8px 24px; }
          .cp-hero { min-height: 180px; padding-top: 12px; }
          .cp-card { padding: 12px 12px 16px; border-radius: 12px; }
          .cp-card-icon { width: 34px; height: 34px; margin-bottom: 8px; }
          .cp-title { font-size: 0.9rem; }
          .cp-sub { font-size: 0.62rem; margin-bottom: 16px; }
          .cp-label { font-size: 0.56rem; margin-bottom: 3px; }
          .cp-input { font-size: 0.7rem; padding: 6px 9px; }
          .strength-track { height: 3px; margin-bottom: 3px; }
          .check-chip { font-size: 0.48rem; padding: 0px 4px; }
          .cp-form-group { margin-bottom: 8px; }
          .cp-actions { gap: 4px; margin-top: 10px; flex-direction: column; }
          .btn-back, .btn-submit { padding: 6px 10px; font-size: 0.68rem; width: 100%; }
          .cp-alert { padding: 7px 8px; font-size: 0.62rem; margin-bottom: 10px; }
          .cp-body { padding-bottom: 40px; }
        }
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section className="cp-hero">
        <div className="cp-hero-bg" />
        <div className="cp-hero-overlay" />
        <div className="cp-card-wrap">
          <div className="cp-card">

            {/* Header */}
            <div className="cp-card-icon">
              <ShieldCheck size={24} color="white" />
            </div>
            <div className="cp-title">Change Password</div>
            <div className="cp-sub">Keep your account secure — choose a strong password.</div>

            {/* Alert */}
            {message.text && (
              <div className={`cp-alert ${message.type}`}>
                {message.type === "success"
                  ? <CheckCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  : <XCircle    size={16} style={{ flexShrink: 0, marginTop: 1 }} />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off">
              {/* Current Password */}
              <div className="cp-form-group">
                <label className="cp-label">Current Password</label>
                <div className="cp-input-wrap">
                  <input
                    className="cp-input"
                    type={show.current ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    placeholder="Enter your current password"
                  />
                  <button type="button" className="cp-eye" onClick={() => toggleShow("current")}>
                    {show.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="cp-form-group">
                <label className="cp-label">New Password</label>
                <div className="cp-input-wrap">
                  <input
                    className="cp-input"
                    type={show.newP ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    placeholder="Create a new password"
                  />
                  <button type="button" className="cp-eye" onClick={() => toggleShow("newP")}>
                    {show.newP ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Strength meter */}
                {pw.length > 0 && (
                  <div className="strength-wrap">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.6px" }}>Password Strength</span>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: strengthColor }}>{strengthLabel}</span>
                    </div>
                    <div className="strength-track">
                      <div className="strength-fill" style={{ width: strengthWidth, background: strengthColor }} />
                    </div>
                    <div className="strength-checks">
                      {[
                        { key: "length",  label: "8+ chars" },
                        { key: "upper",   label: "Uppercase" },
                        { key: "lower",   label: "Lowercase" },
                        { key: "number",  label: "Number" },
                        { key: "special", label: "Symbol" },
                      ].map((c) => (
                        <span key={c.key} className={`check-chip ${checks[c.key] ? "pass" : "fail"}`}>
                          {checks[c.key] ? "✓" : "·"} {c.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="cp-form-group">
                <label className="cp-label">Confirm New Password</label>
                <div className="cp-input-wrap">
                  <input
                    className="cp-input"
                    type={show.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    placeholder="Re-enter your new password"
                    style={{
                      borderColor: formData.confirmPassword && formData.confirmPassword !== formData.newPassword
                        ? "#d4537e" : undefined,
                    }}
                  />
                  <button type="button" className="cp-eye" onClick={() => toggleShow("confirm")}>
                    {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.confirmPassword !== formData.newPassword && (
                  <p style={{ fontSize: "0.68rem", color: "#993556", fontWeight: 600, marginTop: 5 }}>
                    Passwords do not match.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="cp-actions">
                <button type="button" className="btn-back" onClick={() => navigate("/profile")}>
                  <ChevronLeft size={15} /> Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                        </path>
                      </svg>
                      Updating…
                    </>
                  ) : (
                    <><Lock size={15} /> Update Password</>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      </section>

      <div className="cp-body" />
      <Footer />
    </div>
  );
}