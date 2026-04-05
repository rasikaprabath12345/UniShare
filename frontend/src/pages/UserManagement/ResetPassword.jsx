import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

/* ── Scoped styles — matches UniShare theme (Navy #0d2257 · Blue #1565C0 · Poppins) ── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

  :root {
    --navy:       #0d2257;
    --blue:       #1565C0;
    --blue-pale:  #e8f0fe;
    --blue-ghost: #f4f7ff;
    --rose:       #d4537e;
    --rose-pale:  #fce8ef;
    --grey-50:    #f8faff;
    --grey-100:   #eef2f9;
    --grey-200:   #dde8f8;
    --grey-400:   #9eadc8;
    --text-sub:   #5a6a8a;
    --font:       'Poppins', sans-serif;
    --success:    #2e7d32;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font); background: var(--grey-50); }

  /* ── Page layout ── */
  .rp-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: var(--font);
  }

  /* ── Left panel ── */
  .rp-left {
    background: linear-gradient(145deg, var(--navy) 0%, #163a8a 55%, var(--blue) 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 60px 50px; position: relative; overflow: hidden;
  }
  .rp-left::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 20% 25%, rgba(55,138,221,0.22) 0%, transparent 50%),
      radial-gradient(circle at 80% 75%, rgba(29,158,117,0.14) 0%, transparent 50%);
  }
  .rp-left::after {
    content: ''; position: absolute;
    width: 380px; height: 380px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.06);
    top: -80px; right: -80px;
  }
  .rp-left-ring {
    position: absolute; width: 260px; height: 260px;
    border-radius: 50%; border: 1px solid rgba(255,255,255,0.05);
    bottom: -60px; left: -60px;
  }
  .rp-left-content { position: relative; z-index: 1; text-align: center; max-width: 340px; }

  /* ── Brand ── */
  .rp-brand { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 36px; }
  .rp-brand-icon {
    width: 40px; height: 40px; background: rgba(255,255,255,0.12);
    border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;
  }
  .rp-brand-name { font-size: 1.35rem; font-weight: 800; color: white; letter-spacing: -0.5px; }

  /* ── Illustration ── */
  .rp-illustration {
    width: 170px; height: 170px; background: rgba(255,255,255,0.08);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 4.2rem; margin: 0 auto 28px;
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 0 60px rgba(55,138,221,0.25);
  }
  .rp-left-title { font-size: 1.5rem; font-weight: 800; color: white; line-height: 1.3; margin-bottom: 12px; }
  .rp-left-sub { font-size: 0.87rem; color: rgba(255,255,255,0.60); line-height: 1.7; }

  /* ── Steps list ── */
  .rp-steps { margin-top: 32px; text-align: left; display: flex; flex-direction: column; gap: 14px; }
  .rp-step { display: flex; align-items: flex-start; gap: 12px; }
  .rp-step-num {
    width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; color: white;
  }
  .rp-step-text { font-size: 0.82rem; color: rgba(255,255,255,0.65); line-height: 1.5; padding-top: 3px; }

  /* ── Right panel ── */
  .rp-right {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 56px; background: white; overflow-y: auto;
  }
  .rp-form-wrap { width: 100%; max-width: 400px; }

  /* ── Form header ── */
  .rp-eyebrow {
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--blue); margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
  }
  .rp-eyebrow::before {
    content: ''; width: 20px; height: 2px;
    background: var(--blue); border-radius: 2px; flex-shrink: 0;
  }
  .rp-title { font-size: 1.65rem; font-weight: 800; color: var(--navy); margin-bottom: 4px; letter-spacing: -0.5px; }
  .rp-subtitle { font-size: 0.84rem; color: var(--text-sub); margin-bottom: 28px; line-height: 1.6; }

  /* ── Alerts ── */
  .rp-alert {
    border-radius: 8px; padding: 11px 14px;
    font-size: 0.82rem; font-weight: 500;
    display: flex; align-items: flex-start; gap: 8px;
    margin-bottom: 18px; line-height: 1.5;
  }
  .rp-alert-error   { background: var(--rose-pale); border: 1px solid rgba(212,83,126,0.22); color: #7a2847; }
  .rp-alert-info    { background: var(--blue-pale);  border: 1px solid rgba(21,101,192,0.22); color: #0d3a7a; }
  .rp-alert-success { background: #e8f5e9;            border: 1px solid rgba(46,125,50,0.22);  color: #1b5e20; }

  /* ── Success state card ── */
  .rp-success-card {
    text-align: center; padding: 32px 24px;
    background: var(--blue-ghost); border: 1px solid var(--grey-200);
    border-radius: 12px; margin-bottom: 24px;
  }
  .rp-success-icon {
    width: 64px; height: 64px; background: #e8f5e9;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; margin: 0 auto 16px;
    border: 1px solid rgba(46,125,50,0.18);
  }
  .rp-success-title { font-size: 1.1rem; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
  .rp-success-text  { font-size: 0.83rem; color: var(--text-sub); line-height: 1.7; }

  /* ── Group / Input ── */
  .rp-group { margin-bottom: 14px; }
  .rp-label { display: block; font-size: 0.77rem; font-weight: 600; color: var(--navy); margin-bottom: 5px; letter-spacing: 0.02em; }
  .rp-label .req { color: var(--rose); margin-left: 2px; }

  .rp-input {
    width: 100%; padding: 10px 13px;
    border: 1.5px solid var(--grey-200); border-radius: 8px;
    font-family: var(--font); font-size: 0.87rem; color: var(--navy);
    background: var(--grey-50); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .rp-input::placeholder { color: var(--grey-400); }
  .rp-input:focus {
    border-color: var(--blue); background: white;
    box-shadow: 0 0 0 3px rgba(21,101,192,0.10);
  }
  .rp-input:disabled { opacity: 0.55; cursor: not-allowed; }

  /* OTP input specific */
  .rp-input-otp {
    font-size: 1.2rem;
    letter-spacing: 4px;
    font-family: 'Courier New', monospace;
    font-weight: 700;
    text-align: center;
  }

  /* ── Submit button ── */
  .rp-btn {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
    color: white; border: none; border-radius: 8px;
    font-family: var(--font); font-size: 0.9rem; font-weight: 700;
    cursor: pointer; letter-spacing: 0.02em; margin-top: 8px;
    box-shadow: 0 4px 14px rgba(21,101,192,0.30);
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
  }
  .rp-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(21,101,192,0.40);
  }
  .rp-btn:disabled { opacity: 0.60; cursor: not-allowed; }

  /* ── Back link row ── */
  .rp-back {
    display: flex; align-items: center; justify-content: center;
    gap: 6px; margin-top: 22px;
    font-size: 0.83rem; color: var(--text-sub);
  }
  .rp-back a { color: var(--blue); font-weight: 600; text-decoration: none; }
  .rp-back a:hover { text-decoration: underline; }

  /* ── Form row for two inputs ── */
  .rp-form-row { display: flex; gap: 12px; }
  .rp-form-row .rp-group { flex: 1; margin-bottom: 14px; }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .rp-page { grid-template-columns: 1fr; }
    .rp-left  { display: none; }
    .rp-right { padding: 40px 28px; }
  }
  @media (max-width: 480px) {
    .rp-right { padding: 32px 20px; }
    .rp-form-row { flex-direction: column; }
  }
`;

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [step, setStep] = useState(1); // Step 1: OTP, Step 2: Password
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  // If no email provided, redirect to forgot password page
  if (!email) {
    return (
      <>
        <style>{styles}</style>
        <div className="rp-right" style={{ minHeight: '100vh', justifyContent: 'center' }}>
          <div className="rp-form-wrap">
            <p className="rp-eyebrow">Invalid Access</p>
            <h1 className="rp-title">Page Not Accessible</h1>
            <p className="rp-subtitle" style={{ marginBottom: '20px' }}>
              Please request a password reset first to access this page.
            </p>
            <Link to="/forgot-password" style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>
              Go to Forgot Password →
            </Link>
          </div>
        </div>
      </>
    );
  }

  // STEP 1: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!otp || otp.length !== 6) {
      setMessage({ text: 'Please enter a valid 6-digit OTP', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: 'Verifying OTP...', type: 'info' });

    try {
      await axios.post('http://localhost:8000/api/users/verify-otp', {
        email: email.toLowerCase(),
        otp: otp.trim()
      });

      // OTP verified, move to step 2
      setMessage({ text: 'OTP verified successfully! Proceeding to password reset...', type: 'success' });
      setTimeout(() => {
        setStep(2);
        setMessage({ text: '', type: '' });
        // Don't clear OTP - we need it for the reset-password API call
      }, 1500);

    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Invalid OTP. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!newPassword || !confirmPassword) {
      setMessage({ text: 'All fields are required', type: 'error' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ text: 'Password must be at least 8 characters', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: 'Resetting password...', type: 'info' });

    try {
      await axios.post('http://localhost:8000/api/users/reset-password', {
        email: email.toLowerCase(),
        otp: otp.trim(),
        newPassword,
        confirmPassword
      });

      setMessage({ text: 'Password reset successfully! Redirecting to login...', type: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to reset password. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <div className="rp-page">

        {/* ══════════════ LEFT PANEL ══════════════ */}
        <div className="rp-left">
          <div className="rp-left-ring" />
          <div className="rp-left-content">

            <div className="rp-brand">
              <div className="rp-brand-icon">🎓</div>
              <span className="rp-brand-name">UniShare</span>
            </div>

            <div className="rp-illustration">{step === 1 ? '🔐' : '🔑'}</div>

            {step === 1 ? (
              <>
                <h2 className="rp-left-title">Verify Your Identity</h2>
                <p className="rp-left-sub">
                  A 6-digit OTP has been sent to your registered email. 
                  Please enter it to verify your identity and proceed.
                </p>
              </>
            ) : (
              <>
                <h2 className="rp-left-title">Create a New Password</h2>
                <p className="rp-left-sub">
                  You're almost there! Set a strong new password for your account.
                  Make sure it's at least 8 characters long.
                </p>
              </>
            )}

            <div className="rp-steps">
              <div className="rp-step">
                <div className="rp-step-num" style={{ background: step >= 1 ? 'var(--blue)' : 'rgba(255,255,255,0.12)' }}>✓</div>
                <p className="rp-step-text">Verify OTP from email</p>
              </div>
              <div className="rp-step">
                <div className="rp-step-num" style={{ background: step >= 2 ? 'var(--blue)' : 'rgba(255,255,255,0.12)' }}>
                  {step === 2 ? '2' : ''}
                </div>
                <p className="rp-step-text">Create a new password</p>
              </div>
            </div>

          </div>
        </div>

        {/* ══════════════ RIGHT PANEL ══════════════ */}
        <div className="rp-right">
          <div className="rp-form-wrap">

            {/* ═════════════ STEP 1: OTP VERIFICATION ═════════════ */}
            {step === 1 ? (
              <>
                <p className="rp-eyebrow">Step 1 of 2</p>
                <h1 className="rp-title">Verify OTP</h1>
                <p className="rp-subtitle">
                  Enter the 6-digit code sent to your email
                </p>

                {/* ── Error/Info message ── */}
                {message.text && (
                  <div className={`rp-alert rp-alert-${message.type}`}>
                    <span>
                      {message.type === 'success' ? '✓' : message.type === 'info' ? 'ℹ' : '⚠'}
                    </span>
                    <span>{message.text}</span>
                  </div>
                )}

                {/* ── OTP Form ── */}
                <form onSubmit={handleVerifyOTP} noValidate>
                  <div className="rp-group">
                    <label className="rp-label">
                      6-Digit OTP Code <span className="req">*</span>
                    </label>
                    <input
                      className="rp-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(val);
                        setMessage({ text: '', type: '' });
                      }}
                      maxLength="6"
                      required
                      disabled={loading}
                      autoFocus
                      autoComplete="off"
                      style={{ fontSize: '1.5rem', letterSpacing: '6px', textAlign: 'center' }}
                    />
                  </div>

                  <button className="rp-btn" type="submit" disabled={loading || otp.length !== 6}>
                    {loading ? 'Verifying...' : 'Verify OTP →'}
                  </button>
                </form>

                <div className="rp-back">
                  <span>←</span>
                  <Link to="/forgot-password">Back to Email Entry</Link>
                </div>
              </>
            ) : (
              <>
                {/* ═════════════ STEP 2: PASSWORD RESET ═════════════ */}
                <p className="rp-eyebrow">Step 2 of 2</p>
                <h1 className="rp-title">Set New Password</h1>
                <p className="rp-subtitle">
                  Create a strong new password for your account
                </p>

                {/* ── Error/Info message ── */}
                {message.text && (
                  <div className={`rp-alert rp-alert-${message.type}`}>
                    <span>
                      {message.type === 'success' ? '✓' : message.type === 'info' ? 'ℹ' : '⚠'}
                    </span>
                    <span>{message.text}</span>
                  </div>
                )}

                {/* ── Password Form ── */}
                <form onSubmit={handleResetPassword} noValidate>
                  {/* New Password */}
                  <div className="rp-group">
                    <label className="rp-label">
                      New Password <span className="req">*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        className="rp-input"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password (8+ characters)"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setMessage({ text: '', type: '' });
                        }}
                        required
                        disabled={loading}
                        autoComplete="new-password"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          color: 'var(--grey-400)'
                        }}
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="rp-group">
                    <label className="rp-label">
                      Confirm Password <span className="req">*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        className="rp-input"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setMessage({ text: '', type: '' });
                        }}
                        required
                        disabled={loading}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          color: 'var(--grey-400)'
                        }}
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <button className="rp-btn" type="submit" disabled={loading}>
                    {loading ? 'Resetting Password...' : 'Reset Password →'}
                  </button>
                </form>

                <div className="rp-back">
                  <span>←</span>
                  <button 
                    onClick={() => {
                      setStep(1);
                      setNewPassword('');
                      setConfirmPassword('');
                      setShowPassword(false);
                      setShowConfirmPassword(false);
                      setMessage({ text: '', type: '' });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--blue)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.83rem',
                      textDecoration: 'none'
                    }}
                  >
                    Back to OTP Verification
                  </button>
                </div>
              </>
            )}

          </div>
        </div>

      </div>
    </>
  );
}
