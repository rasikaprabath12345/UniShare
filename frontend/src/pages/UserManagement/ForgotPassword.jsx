import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font); background: var(--grey-50); }

  /* ── Page layout ── */
  .fp-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: var(--font);
  }

  /* ── Left panel ── */
  .fp-left {
    background: linear-gradient(145deg, var(--navy) 0%, #163a8a 55%, var(--blue) 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 60px 50px; position: relative; overflow: hidden;
  }
  .fp-left::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 20% 25%, rgba(55,138,221,0.22) 0%, transparent 50%),
      radial-gradient(circle at 80% 75%, rgba(29,158,117,0.14) 0%, transparent 50%);
  }
  .fp-left::after {
    content: ''; position: absolute;
    width: 380px; height: 380px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.06);
    top: -80px; right: -80px;
  }
  .fp-left-ring {
    position: absolute; width: 260px; height: 260px;
    border-radius: 50%; border: 1px solid rgba(255,255,255,0.05);
    bottom: -60px; left: -60px;
  }
  .fp-left-content { position: relative; z-index: 1; text-align: center; max-width: 340px; }

  /* ── Brand ── */
  .fp-brand { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 36px; }
  .fp-brand-icon {
    width: 40px; height: 40px; background: rgba(255,255,255,0.12);
    border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;
  }
  .fp-brand-name { font-size: 1.35rem; font-weight: 800; color: white; letter-spacing: -0.5px; }

  /* ── Illustration ── */
  .fp-illustration {
    width: 170px; height: 170px; background: rgba(255,255,255,0.08);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 4.2rem; margin: 0 auto 28px;
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 0 60px rgba(55,138,221,0.25);
  }
  .fp-left-title { font-size: 1.5rem; font-weight: 800; color: white; line-height: 1.3; margin-bottom: 12px; }
  .fp-left-sub { font-size: 0.87rem; color: rgba(255,255,255,0.60); line-height: 1.7; }

  /* ── Steps list ── */
  .fp-steps { margin-top: 32px; text-align: left; display: flex; flex-direction: column; gap: 14px; }
  .fp-step { display: flex; align-items: flex-start; gap: 12px; }
  .fp-step-num {
    width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; color: white;
  }
  .fp-step-text { font-size: 0.82rem; color: rgba(255,255,255,0.65); line-height: 1.5; padding-top: 3px; }

  /* ── Right panel ── */
  .fp-right {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 56px; background: white; overflow-y: auto;
  }
  .fp-form-wrap { width: 100%; max-width: 400px; }

  /* ── Form header ── */
  .fp-eyebrow {
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--blue); margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
  }
  .fp-eyebrow::before {
    content: ''; width: 20px; height: 2px;
    background: var(--blue); border-radius: 2px; flex-shrink: 0;
  }
  .fp-title { font-size: 1.65rem; font-weight: 800; color: var(--navy); margin-bottom: 4px; letter-spacing: -0.5px; }
  .fp-subtitle { font-size: 0.84rem; color: var(--text-sub); margin-bottom: 28px; line-height: 1.6; }

  /* ── Alerts ── */
  .fp-alert {
    border-radius: 8px; padding: 11px 14px;
    font-size: 0.82rem; font-weight: 500;
    display: flex; align-items: flex-start; gap: 8px;
    margin-bottom: 18px; line-height: 1.5;
  }
  .fp-alert-error   { background: var(--rose-pale); border: 1px solid rgba(212,83,126,0.22); color: #7a2847; }
  .fp-alert-info    { background: var(--blue-pale);  border: 1px solid rgba(21,101,192,0.22); color: #0d3a7a; }
  .fp-alert-success { background: #e8f5e9;            border: 1px solid rgba(46,125,50,0.22);  color: #1b5e20; }

  /* ── Success state card ── */
  .fp-success-card {
    text-align: center; padding: 32px 24px;
    background: var(--blue-ghost); border: 1px solid var(--grey-200);
    border-radius: 12px; margin-bottom: 24px;
  }
  .fp-success-icon {
    width: 64px; height: 64px; background: #e8f5e9;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; margin: 0 auto 16px;
    border: 1px solid rgba(46,125,50,0.18);
  }
  .fp-success-title { font-size: 1.1rem; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
  .fp-success-text  { font-size: 0.83rem; color: var(--text-sub); line-height: 1.7; }
  .fp-success-email {
    display: inline-block; margin-top: 10px;
    background: var(--blue-pale); color: var(--blue);
    font-size: 0.80rem; font-weight: 600;
    padding: 4px 12px; border-radius: 20px;
    border: 1px solid rgba(21,101,192,0.18);
  }

  /* ── Group / Input ── */
  .fp-group { margin-bottom: 14px; }
  .fp-label { display: block; font-size: 0.77rem; font-weight: 600; color: var(--navy); margin-bottom: 5px; letter-spacing: 0.02em; }
  .fp-label .req { color: var(--rose); margin-left: 2px; }

  .fp-input {
    width: 100%; padding: 10px 13px;
    border: 1.5px solid var(--grey-200); border-radius: 8px;
    font-family: var(--font); font-size: 0.87rem; color: var(--navy);
    background: var(--grey-50); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .fp-input::placeholder { color: var(--grey-400); }
  .fp-input:focus {
    border-color: var(--blue); background: white;
    box-shadow: 0 0 0 3px rgba(21,101,192,0.10);
  }
  .fp-input:disabled { opacity: 0.55; cursor: not-allowed; }

  /* ── Submit button ── */
  .fp-btn {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
    color: white; border: none; border-radius: 8px;
    font-family: var(--font); font-size: 0.9rem; font-weight: 700;
    cursor: pointer; letter-spacing: 0.02em; margin-top: 8px;
    box-shadow: 0 4px 14px rgba(21,101,192,0.30);
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
  }
  .fp-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(21,101,192,0.40);
  }
  .fp-btn:disabled { opacity: 0.60; cursor: not-allowed; }

  /* ── Resend button ── */
  .fp-resend-btn {
    width: 100%; padding: 11px;
    background: transparent; color: var(--blue);
    border: 1.5px solid var(--grey-200); border-radius: 8px;
    font-family: var(--font); font-size: 0.87rem; font-weight: 600;
    cursor: pointer; margin-top: 10px;
    transition: border-color 0.2s, background 0.2s;
  }
  .fp-resend-btn:hover { border-color: var(--blue); background: var(--blue-ghost); }

  /* ── Back link row ── */
  .fp-back {
    display: flex; align-items: center; justify-content: center;
    gap: 6px; margin-top: 22px;
    font-size: 0.83rem; color: var(--text-sub);
  }
  .fp-back a { color: var(--blue); font-weight: 600; text-decoration: none; }
  .fp-back a:hover { text-decoration: underline; }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .fp-page { grid-template-columns: 1fr; }
    .fp-left  { display: none; }
    .fp-right { padding: 40px 28px; }
  }
  @media (max-width: 480px) {
    .fp-right { padding: 32px 20px; }
  }
`;

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'info' | 'success' | 'error'
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [sentTo,  setSentTo]  = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!email.endsWith('@my.sliit.lk'))
      return setMessage({ text: 'Please use your @my.sliit.lk SLIIT email address.', type: 'error' });

    setLoading(true);
    setMessage({ text: 'Sending reset link…', type: 'info' });

    try {
      await axios.post('http://localhost:8000/api/users/forgot-password', {
        email: email.toLowerCase().trim(),
      });
      setSentTo(email.toLowerCase().trim());
      setSent(true);
      setMessage({ text: '', type: '' });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to send reset email. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setMessage({ text: 'Resending reset link…', type: 'info' });
    try {
      await axios.post('http://localhost:8000/api/users/forgot-password', { email: sentTo });
      setMessage({ text: 'Reset link resent successfully!', type: 'success' });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Failed to resend. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <div className="fp-page">

        {/* ══════════════ LEFT PANEL ══════════════ */}
        <div className="fp-left">
          <div className="fp-left-ring" />
          <div className="fp-left-content">

            <div className="fp-brand">
              <div className="fp-brand-icon">🎓</div>
              <span className="fp-brand-name">UniShare</span>
            </div>

            <div className="fp-illustration">🔒</div>

            <h2 className="fp-left-title">Recover your account</h2>
            <p className="fp-left-sub">
              Don't worry — it happens to everyone. We'll help you get
              back into your SLIIT account in just a few steps.
            </p>

            <div className="fp-steps">
              <div className="fp-step">
                <div className="fp-step-num">1</div>
                <p className="fp-step-text">Enter your <strong style={{color:'rgba(255,255,255,0.85)'}}>@my.sliit.lk</strong> email address below</p>
              </div>
              <div className="fp-step">
                <div className="fp-step-num">2</div>
                <p className="fp-step-text">Check your inbox for the password reset link</p>
              </div>
              <div className="fp-step">
                <div className="fp-step-num">3</div>
                <p className="fp-step-text">Follow the link to create a new secure password</p>
              </div>
            </div>

          </div>
        </div>

        {/* ══════════════ RIGHT PANEL ══════════════ */}
        <div className="fp-right">
          <div className="fp-form-wrap">

            <p className="fp-eyebrow">Account recovery</p>
            <h1 className="fp-title">Reset Password</h1>
            <p className="fp-subtitle">
              Enter your SLIIT email and we'll send you a link to reset your password
            </p>

            {/* ── Inline status message ── */}
            {message.text && (
              <div className={`fp-alert fp-alert-${message.type}`}>
                <span>
                  {message.type === 'success' ? '✓' : message.type === 'info' ? 'ℹ' : '⚠'}
                </span>
                <span>{message.text}</span>
              </div>
            )}

            {/* ── Success state ── */}
            {sent ? (
              <>
                <div className="fp-success-card">
                  <div className="fp-success-icon">📬</div>
                  <p className="fp-success-title">Check your inbox</p>
                  <p className="fp-success-text">
                    We've sent a password reset link to
                  </p>
                  <span className="fp-success-email">{sentTo}</span>
                  <p className="fp-success-text" style={{ marginTop: '12px' }}>
                    The link will expire in <strong>30 minutes</strong>. Be sure to check your spam folder too.
                  </p>
                </div>

                <button
                  className="fp-resend-btn"
                  onClick={handleResend}
                  disabled={loading}
                >
                  {loading ? 'Resending…' : '↺ Resend reset link'}
                </button>
              </>
            ) : (
              /* ── Request form ── */
              <form onSubmit={handleSubmit} noValidate>
                <div className="fp-group">
                  <label className="fp-label">
                    SLIIT Email <span className="req">*</span>
                  </label>
                  <input
                    className="fp-input"
                    type="email"
                    placeholder="it21xxxxxx@my.sliit.lk"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setMessage({ text: '', type: '' }); }}
                    required
                    disabled={loading}
                  />
                </div>

                <button className="fp-btn" type="submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Reset Link →'}
                </button>
              </form>
            )}

            <div className="fp-back">
              <span>←</span>
              <Link to="/login">Back to Sign In</Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}