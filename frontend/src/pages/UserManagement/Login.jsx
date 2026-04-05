import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

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

  .login-page {
    min-height: 100vh; display: grid;
    grid-template-columns: 1fr 1fr; font-family: var(--font);
  }

  /* Left panel */
  .login-left {
    background: linear-gradient(145deg, var(--navy) 0%, #163a8a 55%, var(--blue) 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 60px 50px; position: relative; overflow: hidden;
  }
  .login-left::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 20% 25%, rgba(55,138,221,0.22) 0%, transparent 50%),
      radial-gradient(circle at 80% 75%, rgba(29,158,117,0.14) 0%, transparent 50%);
  }
  .login-left::after {
    content: ''; position: absolute;
    width: 380px; height: 380px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.06);
    top: -80px; right: -80px;
  }
  .login-left-ring {
    position: absolute; width: 260px; height: 260px;
    border-radius: 50%; border: 1px solid rgba(255,255,255,0.05);
    bottom: -60px; left: -60px;
  }
  .login-left-content { position: relative; z-index: 1; text-align: center; max-width: 340px; }
  .login-brand { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 36px; }
  .login-brand-icon {
    width: 40px; height: 40px; background: rgba(255,255,255,0.12);
    border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;
  }
  .login-brand-name { font-size: 1.35rem; font-weight: 800; color: white; letter-spacing: -0.5px; }
  .login-illustration {
    width: 170px; height: 170px; background: rgba(255,255,255,0.08);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 4.2rem; margin: 0 auto 28px;
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 0 60px rgba(55,138,221,0.25);
  }
  .login-left-title { font-size: 1.5rem; font-weight: 800; color: white; line-height: 1.3; margin-bottom: 12px; }
  .login-left-sub { font-size: 0.87rem; color: rgba(255,255,255,0.60); line-height: 1.7; }
  .login-stats { display: flex; justify-content: center; gap: 28px; margin-top: 32px; }
  .login-stat { text-align: center; }
  .login-stat-num { font-size: 1.4rem; font-weight: 800; color: white; display: block; line-height: 1; }
  .login-stat-lbl { font-size: 0.70rem; color: rgba(255,255,255,0.50); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em; }
  .login-stat-div { width: 1px; background: rgba(255,255,255,0.15); align-self: stretch; }

  /* Right panel */
  .login-right {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 56px; background: white; overflow-y: auto;
  }
  .login-form-wrap { width: 100%; max-width: 400px; }

  .login-eyebrow {
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--blue); margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
  }
  .login-eyebrow::before {
    content: ''; width: 20px; height: 2px;
    background: var(--blue); border-radius: 2px; flex-shrink: 0;
  }
  .login-title { font-size: 1.65rem; font-weight: 800; color: var(--navy); margin-bottom: 4px; letter-spacing: -0.5px; }
  .login-subtitle { font-size: 0.84rem; color: var(--text-sub); margin-bottom: 28px; line-height: 1.6; }

  .login-success {
    background: #e8f5e9; border: 1px solid rgba(46,125,50,0.22);
    color: #1b5e20; border-radius: 8px; padding: 11px 14px;
    font-size: 0.82rem; font-weight: 500;
    display: flex; align-items: flex-start; gap: 8px;
    margin-bottom: 18px; line-height: 1.5;
  }
  .login-alert {
    background: var(--rose-pale); border: 1px solid rgba(212,83,126,0.22);
    color: #7a2847; border-radius: 8px; padding: 11px 14px;
    font-size: 0.82rem; font-weight: 500;
    display: flex; align-items: flex-start; gap: 8px;
    margin-bottom: 18px; line-height: 1.5;
  }

  .login-group { margin-bottom: 14px; }
  .login-label { display: block; font-size: 0.77rem; font-weight: 600; color: var(--navy); margin-bottom: 5px; letter-spacing: 0.02em; }
  .login-input {
    width: 100%; padding: 10px 13px;
    border: 1.5px solid var(--grey-200); border-radius: 8px;
    font-family: var(--font); font-size: 0.87rem; color: var(--navy);
    background: var(--grey-50); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .login-input::placeholder { color: var(--grey-400); }
  .login-input:focus { border-color: var(--blue); background: white; box-shadow: 0 0 0 3px rgba(21,101,192,0.10); }
  .login-pw-wrap { position: relative; }
  .login-pw-wrap .login-input { padding-right: 40px; }
  .login-pw-toggle {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--grey-400); font-size: 0.85rem; padding: 0; line-height: 1;
  }
  .login-pw-toggle:hover { color: var(--blue); }
  .login-forgot-row { display: flex; justify-content: flex-end; margin-bottom: 20px; margin-top: -4px; }
  .login-forgot-link { font-size: 0.78rem; color: var(--blue); font-weight: 600; text-decoration: none; }
  .login-forgot-link:hover { text-decoration: underline; }

  .login-btn {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
    color: white; border: none; border-radius: 8px;
    font-family: var(--font); font-size: 0.9rem; font-weight: 700;
    cursor: pointer; letter-spacing: 0.02em;
    box-shadow: 0 4px 14px rgba(21,101,192,0.30);
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
  }
  .login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(21,101,192,0.40); }
  .login-btn:disabled { opacity: 0.60; cursor: not-allowed; }

  .login-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0; color: var(--grey-400); font-size: 0.78rem;
  }
  .login-divider::before, .login-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--grey-200);
  }
  .login-footer { text-align: center; font-size: 0.83rem; color: var(--text-sub); }
  .login-footer a { color: var(--blue); font-weight: 600; text-decoration: none; }
  .login-footer a:hover { text-decoration: underline; }

  @media (max-width: 860px) {
    .login-page { grid-template-columns: 1fr; }
    .login-left  { display: none; }
    .login-right { padding: 40px 28px; }
  }
  @media (max-width: 480px) { .login-right { padding: 32px 20px; } }
`;

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();

  /* Where to redirect after login — default to "/" */
  const from = location.state?.from?.pathname ?? "/";

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const justRegistered = location.state?.registered;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleEmailBlur = (e) => {
    let email = e.target.value.trim();
    
    // If email exists but doesn't contain @, auto-append @my.sliit.lk
    if (email && !email.includes('@')) {
      email = email + '@my.sliit.lk';
      setFormData({ ...formData, email });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/User/login', {
        email:    formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      console.log('════════════════════════════════════');
      console.log('✓ LOGIN SUCCESSFUL');
      console.log('════════════════════════════════════');
      console.log('Response:', res.data);
      console.log('User Object:', res.data.user);
      console.log('Email:', res.data.user.email);
      console.log('Role:', res.data.user.role);
      console.log('Role Type:', typeof res.data.user.role);
      console.log('════════════════════════════════════');

      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      console.log('User and token saved to localStorage');

      const userRole = res.data.user.role;
      console.log('Checking role:', userRole);
      
      if (userRole === 'admin') {
        console.log('✓ Admin role detected - navigating to /admin');
        navigate('/admin', { replace: true });
      } else {
        console.log('Student role -  navigating to', from);
        navigate(from, { replace: true });
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <div className="login-page">

        {/* LEFT PANEL */}
        <div className="login-left">
          <div className="login-left-ring" />
          <div className="login-left-content">
            <div className="login-brand">
              <div className="login-brand-icon">🎓</div>
              <span className="login-brand-name">UniShare</span>
            </div>
            <div className="login-illustration">🔑</div>
            <h2 className="login-left-title">Welcome back to UniShare</h2>
            <p className="login-left-sub">
              Sign in to access thousands of SLIIT notes, past papers, and
              student resources — all shared by your peers.
            </p>
            <div className="login-stats">
              <div className="login-stat">
                <span className="login-stat-num">5K+</span>
                <span className="login-stat-lbl">Students</span>
              </div>
              <div className="login-stat-div" />
              <div className="login-stat">
                <span className="login-stat-num">12K+</span>
                <span className="login-stat-lbl">Resources</span>
              </div>
              <div className="login-stat-div" />
              <div className="login-stat">
                <span className="login-stat-num">4</span>
                <span className="login-stat-lbl">Faculties</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          <div className="login-form-wrap">

            <p className="login-eyebrow">Welcome back</p>
            <h1 className="login-title">Sign In</h1>
            <p className="login-subtitle">
              {from !== "/"
                ? `Sign in to continue to ${from}`
                : "Access your SLIIT student account to continue learning"}
            </p>

            {justRegistered && (
              <div className="login-success">
                <span>✓</span>
                <span>Account created successfully! Please sign in to continue.</span>
              </div>
            )}

            {error && (
              <div className="login-alert">
                <span>⚠</span><span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="login-group">
                <label className="login-label">SLIIT Email</label>
                <input
                  className="login-input"
                  type="email"
                  name="email"
                  placeholder="it21xxxxxx@my.sliit.lk"
                  value={formData.email}
                  required
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                />
              </div>

              <div className="login-group">
                <label className="login-label">Password</label>
                <div className="login-pw-wrap">
                  <input
                    className="login-input"
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    required
                    onChange={handleChange}
                  />
                  <button type="button" className="login-pw-toggle"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}>
                    {showPw ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div className="login-forgot-row">
                <Link to="/ForgotPassword" className="login-forgot-link">Forgot password?</Link>
              </div>

              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>

            <div className="login-divider">or</div>

            <p className="login-footer">
              New to UniShare?&nbsp;<Link to="/register">Create an account</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}