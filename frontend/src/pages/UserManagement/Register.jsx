import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  .reg-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: var(--font);
  }

  /* ── Left panel ── */
  .reg-left {
    background: linear-gradient(145deg, var(--navy) 0%, #163a8a 55%, var(--blue) 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 60px 50px; position: relative; overflow: hidden;
  }
  .reg-left::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 20% 25%, rgba(55,138,221,0.22) 0%, transparent 50%),
      radial-gradient(circle at 80% 75%, rgba(29,158,117,0.14) 0%, transparent 50%);
  }
  .reg-left::after {
    content: ''; position: absolute;
    width: 380px; height: 380px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.06);
    top: -80px; right: -80px;
  }
  .reg-left-ring {
    position: absolute; width: 260px; height: 260px;
    border-radius: 50%; border: 1px solid rgba(255,255,255,0.05);
    bottom: -60px; left: -60px;
  }
  .reg-left-content { position: relative; z-index: 1; text-align: center; max-width: 340px; }
  .reg-brand { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 36px; }
  .reg-brand-icon {
    width: 40px; height: 40px; background: rgba(255,255,255,0.12);
    border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;
  }
  .reg-brand-name { font-size: 1.35rem; font-weight: 800; color: white; letter-spacing: -0.5px; }
  .reg-illustration {
    width: 170px; height: 170px; background: rgba(255,255,255,0.08);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 4.2rem; margin: 0 auto 28px;
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 0 60px rgba(55,138,221,0.25);
  }
  .reg-left-title { font-size: 1.5rem; font-weight: 800; color: white; line-height: 1.3; margin-bottom: 12px; }
  .reg-left-sub { font-size: 0.87rem; color: rgba(255,255,255,0.60); line-height: 1.7; }
  .reg-left-pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 28px; }
  .reg-left-pill {
    background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.80); font-size: 0.72rem; font-weight: 600;
    padding: 5px 12px; border-radius: 20px; letter-spacing: 0.02em;
  }

  /* ── Right panel ── */
  .reg-right {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 56px; background: white; overflow-y: auto;
  }
  .reg-form-wrap { width: 100%; max-width: 460px; }

  /* ── Form header ── */
  .reg-eyebrow {
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--blue); margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
  }
  .reg-eyebrow::before {
    content: ''; width: 20px; height: 2px;
    background: var(--blue); border-radius: 2px; flex-shrink: 0;
  }
  .reg-title { font-size: 1.65rem; font-weight: 800; color: var(--navy); margin-bottom: 4px; letter-spacing: -0.5px; }
  .reg-subtitle { font-size: 0.84rem; color: var(--text-sub); margin-bottom: 28px; line-height: 1.6; }

  /* ── Section labels ── */
  .reg-section-label {
    font-size: 0.70rem; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase; color: var(--grey-400);
    display: flex; align-items: center; gap: 10px;
    margin: 18px 0 14px;
  }
  .reg-section-label::after { content: ''; flex: 1; height: 1px; background: var(--grey-200); }

  /* ── Rows / Groups ── */
  .reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .reg-group { margin-bottom: 14px; }
  .reg-label { display: block; font-size: 0.77rem; font-weight: 600; color: var(--navy); margin-bottom: 5px; letter-spacing: 0.02em; }
  .reg-label .req { color: var(--rose); margin-left: 2px; }

  /* ── Inputs ── */
  .reg-input, .reg-select {
    width: 100%; padding: 10px 13px;
    border: 1.5px solid var(--grey-200); border-radius: 8px;
    font-family: var(--font); font-size: 0.87rem; color: var(--navy);
    background: var(--grey-50); outline: none; appearance: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .reg-input::placeholder { color: var(--grey-400); }
  .reg-input:focus, .reg-select:focus {
    border-color: var(--blue); background: white;
    box-shadow: 0 0 0 3px rgba(21,101,192,0.10);
  }

  /* ── Error alert ── */
  .reg-alert {
    background: var(--rose-pale); border: 1px solid rgba(212,83,126,0.22);
    color: #7a2847; border-radius: 8px; padding: 11px 14px;
    font-size: 0.82rem; font-weight: 500;
    display: flex; align-items: flex-start; gap: 8px;
    margin-bottom: 18px; line-height: 1.5;
  }

  /* ── Submit button ── */
  .reg-btn {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
    color: white; border: none; border-radius: 8px;
    font-family: var(--font); font-size: 0.9rem; font-weight: 700;
    cursor: pointer; letter-spacing: 0.02em; margin-top: 8px;
    box-shadow: 0 4px 14px rgba(21,101,192,0.30);
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
  }
  .reg-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(21,101,192,0.40);
  }
  .reg-btn:disabled { opacity: 0.60; cursor: not-allowed; }

  /* ── Footer ── */
  .reg-footer { text-align: center; margin-top: 20px; font-size: 0.83rem; color: var(--text-sub); }
  .reg-footer a { color: var(--blue); font-weight: 600; text-decoration: none; }
  .reg-footer a:hover { text-decoration: underline; }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .reg-page { grid-template-columns: 1fr; }
    .reg-left  { display: none; }
    .reg-right { padding: 40px 28px; }
  }
  @media (max-width: 480px) {
    .reg-row { grid-template-columns: 1fr; }
    .reg-right { padding: 32px 20px; }
  }
`;

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    studentId: '', faculty: 'IT', academicYear: 'Year 1', semester: '1',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.endsWith('@my.sliit.lk'))
      return setError('Registration is restricted to SLIIT students only. Use your @my.sliit.lk email.');
    if (formData.password.length < 8)
      return setError('Password must be at least 8 characters long.');
    if (formData.password !== formData.confirmPassword)
      return setError('Passwords do not match. Please re-enter.');

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/users/register', {
        fullName:     formData.fullName.trim(),
        email:        formData.email.toLowerCase().trim(),
        password:     formData.password,
        studentId:    formData.studentId.trim().toUpperCase(),
        faculty:      formData.faculty,
        academicYear: formData.academicYear,
        semester:     Number(formData.semester),
      });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <div className="reg-page">

        {/* ══════════════ LEFT PANEL ══════════════ */}
        <div className="reg-left">
          <div className="reg-left-ring" />
          <div className="reg-left-content">

            <div className="reg-brand">
              <div className="reg-brand-icon">🎓</div>
              <span className="reg-brand-name">UniShare</span>
            </div>

            <div className="reg-illustration">📚</div>

            <h2 className="reg-left-title">Join the SLIIT community</h2>
            <p className="reg-left-sub">
              Share notes, download resources, and collaborate with thousands
              of SLIIT students — all in one place.
            </p>

            <div className="reg-left-pills">
              <span className="reg-left-pill">📄 Notes</span>
              <span className="reg-left-pill">📝 Past Papers</span>
              <span className="reg-left-pill">🎥 Tutorials</span>
              <span className="reg-left-pill">💬 Discussions</span>
            </div>

          </div>
        </div>

        {/* ══════════════ RIGHT PANEL ══════════════ */}
        <div className="reg-right">
          <div className="reg-form-wrap">

            <p className="reg-eyebrow">Get started</p>
            <h1 className="reg-title">Create Account</h1>
            <p className="reg-subtitle">
              SLIIT students only — use your <strong>@my.sliit.lk</strong> email to register
            </p>

            {error && (
              <div className="reg-alert">
                <span>⚠</span><span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* ── Personal Info ── */}
              <p className="reg-section-label">Personal Info</p>

              <div className="reg-group">
                <label className="reg-label">Full Name <span className="req">*</span></label>
                <input className="reg-input" type="text" name="fullName"
                  placeholder="e.g. Kavindu Perera" required onChange={handleChange} />
              </div>

              <div className="reg-row">
                <div className="reg-group">
                  <label className="reg-label">Student ID <span className="req">*</span></label>
                  <input className="reg-input" type="text" name="studentId"
                    placeholder="IT21000000" required onChange={handleChange} />
                </div>
                <div className="reg-group">
                  <label className="reg-label">SLIIT Email <span className="req">*</span></label>
                  <input className="reg-input" type="email" name="email"
                    placeholder="it21xxxxxx@my.sliit.lk" required onChange={handleChange} />
                </div>
              </div>

              {/* ── Academic Info ── */}
              <p className="reg-section-label">Academic Info</p>

              <div className="reg-row">
                <div className="reg-group">
                  <label className="reg-label">Faculty <span className="req">*</span></label>
                  <select className="reg-select" name="faculty" onChange={handleChange}>
                    <option value="IT">IT</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Computing">Computing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="reg-group">
                  <label className="reg-label">Academic Year <span className="req">*</span></label>
                  <select className="reg-select" name="academicYear" onChange={handleChange}>
                    <option value="Year 1">Year 1</option>
                    <option value="Year 2">Year 2</option>
                    <option value="Year 3">Year 3</option>
                    <option value="Year 4">Year 4</option>
                  </select>
                </div>
              </div>

              <div className="reg-group" style={{ maxWidth: '48%', paddingRight: 0 }}>
                <label className="reg-label">Semester <span className="req">*</span></label>
                <select className="reg-select" name="semester" onChange={handleChange}>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>

              {/* ── Security ── */}
              <p className="reg-section-label">Security</p>

              <div className="reg-row">
                <div className="reg-group">
                  <label className="reg-label">Password <span className="req">*</span></label>
                  <input className="reg-input" type="password" name="password"
                    placeholder="Min. 8 characters" required onChange={handleChange} />
                </div>
                <div className="reg-group">
                  <label className="reg-label">Confirm Password <span className="req">*</span></label>
                  <input className="reg-input" type="password" name="confirmPassword"
                    placeholder="Re-enter password" required onChange={handleChange} />
                </div>
              </div>

              <button className="reg-btn" type="submit" disabled={loading}>
                {loading ? 'Creating Account…' : 'Create My Account →'}
              </button>

            </form>

            <p className="reg-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}