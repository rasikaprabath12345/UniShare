import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  User, Mail, Hash, BookOpen, GraduationCap, Save, ArrowLeft,
  CheckCircle, AlertCircle, Lock, ChevronDown
} from 'lucide-react';

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', studentId: '', faculty: '', academicYear: '', semester: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      studentId: user.studentId || '',
      faculty: user.faculty || 'IT',
      academicYear: user.academicYear || 'Year 1',
      semester: user.semester || '1'
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:8000/api/users/profile',
        {
          fullName: formData.fullName,
          faculty: formData.faculty,
          academicYear: formData.academicYear,
          semester: formData.semester
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Update failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const initials = (formData.fullName || 'U')
    .split(' ').map(n => n[0]).slice(0, 2).join('');

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; background: #f8faff; }

        /* ── HERO ── */
        .ep-hero {
          position: relative;
          min-height: 210px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .ep-hero-bg {
          position: absolute; inset: 0;
          background-image: url("../images/background2.jpg");
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        .ep-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(13,34,87,0.60) 0%,
            rgba(21,101,192,0.45) 55%,
            rgba(248,250,255,0.85) 100%
          );
          z-index: 1;
        }
        .ep-hero-inner {
          position: relative; z-index: 2;
          text-align: center;
          padding: 40px 20px 60px;
        }
        .ep-hero-avatar {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
          box-shadow: 0 4px 20px rgba(21,101,192,0.40);
          font-size: 1.4rem; font-weight: 800; color: white;
          border: 3px solid rgba(255,255,255,0.25);
        }
        .ep-hero-title {
          font-size: 1.25rem; font-weight: 800;
          color: white; margin-bottom: 4px;
        }
        .ep-hero-sub {
          font-size: 0.78rem; color: rgba(255,255,255,0.70); font-weight: 500;
        }

        /* ── MAIN CARD ── */
        .ep-wrap {
          max-width: 680px;
          margin: -38px auto 60px;
          padding: 0 24px;
          position: relative; z-index: 3;
        }

        /* Back link */
        .ep-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.78rem; font-weight: 600;
          color: #1565C0; text-decoration: none;
          margin-bottom: 14px;
          cursor: pointer; background: none; border: none;
          font-family: 'Poppins', sans-serif;
          transition: gap 0.2s;
        }
        .ep-back:hover { gap: 10px; }

        .ep-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e8f0fe;
          box-shadow: 0 8px 40px rgba(21,101,192,0.11);
          overflow: hidden;
        }

        /* Card section header */
        .ep-section {
          padding: 22px 28px 0;
        }
        .ep-section-label {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1.3px;
          color: #1565C0;
          background: #e8f0fe;
          padding: 5px 13px; border-radius: 20px;
          margin-bottom: 18px;
        }
        .ep-divider {
          height: 1px; background: #e8f0fe;
          margin: 6px 28px 0;
        }

        /* Form grid */
        .ep-form-body { padding: 20px 28px 28px; }
        .ep-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px; margin-bottom: 16px;
        }
        .ep-group { display: flex; flex-direction: column; gap: 6px; }
        .ep-group.full { grid-column: 1 / -1; }

        .ep-label {
          font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.7px;
          color: #888;
          display: flex; align-items: center; gap: 6px;
        }
        .ep-label svg { color: #1565C0; }

        .ep-input-wrap { position: relative; }
        .ep-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e8f0fe;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem; color: #0d2257;
          background: white;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
        }
        .ep-input:focus {
          border-color: #1565C0;
          box-shadow: 0 0 0 3px rgba(21,101,192,0.10);
        }
        .ep-input:disabled {
          background: #f4f7ff;
          color: #aaa;
          cursor: not-allowed;
        }
        .ep-select-wrap { position: relative; }
        .ep-select-icon {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          color: #1565C0; pointer-events: none;
        }
        .ep-locked-badge {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          display: flex; align-items: center; gap: 4px;
          font-size: 0.65rem; font-weight: 700;
          color: #aaa; background: #eef1f8;
          border-radius: 6px; padding: 2px 8px;
        }

        /* Alert */
        .ep-alert {
          margin: 0 28px 20px;
          padding: 12px 16px;
          border-radius: 10px;
          display: flex; align-items: center; gap: 10px;
          font-size: 0.8rem; font-weight: 600;
          animation: slideIn 0.3s ease;
        }
        .ep-alert.success {
          background: #e6f4f1; color: #0f6e56;
          border: 1px solid #b2dfdb;
        }
        .ep-alert.error {
          background: #fce8ef; color: #993556;
          border: 1px solid #f5c2ce;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Footer actions */
        .ep-actions {
          display: flex; gap: 12px;
          padding: 20px 28px;
          border-top: 1px solid #e8f0fe;
          background: #f8faff;
          border-radius: 0 0 20px 20px;
        }
        .btn-cancel {
          flex: 1; padding: 11px;
          border: 1.5px solid #d0daf0;
          background: white; color: #555;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.82rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 7px;
        }
        .btn-cancel:hover { background: #f0f4ff; border-color: #1565C0; color: #1565C0; }
        .btn-save {
          flex: 2; padding: 11px;
          background: #1565C0; color: white; border: none;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.82rem; font-weight: 700;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(21,101,192,0.30);
          transition: all 0.2s;
        }
        .btn-save:hover:not(:disabled) {
          background: #0d47a1;
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(21,101,192,0.38);
        }
        .btn-save:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .ep-row { grid-template-columns: 1fr; }
          .ep-form-body { padding: 16px 20px 24px; }
          .ep-section { padding: 18px 20px 0; }
          .ep-divider { margin: 6px 20px 0; }
          .ep-actions { padding: 16px 20px; }
          .ep-alert { margin: 0 20px 16px; }
        }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="ep-hero">
        <div className="ep-hero-bg" />
        <div className="ep-hero-overlay" />
        <div className="ep-hero-inner">
          <div className="ep-hero-avatar">{initials}</div>
          <div className="ep-hero-title">Edit Profile</div>
          <div className="ep-hero-sub">Update your academic information</div>
        </div>
      </section>

      {/* MAIN */}
      <div className="ep-wrap">
        <button className="ep-back" onClick={() => navigate('/profile')}>
          <ArrowLeft size={14} /> Back to Profile
        </button>

        <div className="ep-card">

          {/* Alert */}
          {message.text && (
            <div className={`ep-alert ${message.type}`}>
              {message.type === 'success'
                ? <CheckCircle size={16} />
                : <AlertCircle size={16} />}
              {message.text}
            </div>
          )}

          {/* Personal Info Section */}
          <div className="ep-section">
            <div className="ep-section-label">
              <User size={12} /> Personal Information
            </div>
          </div>
          <div className="ep-divider" />

          <div className="ep-form-body">
            <form onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="ep-row">
                <div className="ep-group full">
                  <label className="ep-label"><User size={12} /> Full Name</label>
                  <div className="ep-input-wrap">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      className="ep-input"
                      required
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                  </div>
                </div>
              </div>

              {/* Locked fields */}
              <div className="ep-row">
                <div className="ep-group">
                  <label className="ep-label"><Hash size={12} /> Student ID</label>
                  <div className="ep-input-wrap">
                    <input
                      type="text"
                      value={formData.studentId}
                      className="ep-input"
                      disabled
                    />
                    <div className="ep-locked-badge"><Lock size={9} /> Locked</div>
                  </div>
                </div>
                <div className="ep-group">
                  <label className="ep-label"><Mail size={12} /> Email</label>
                  <div className="ep-input-wrap">
                    <input
                      type="email"
                      value={formData.email}
                      className="ep-input"
                      disabled
                    />
                    <div className="ep-locked-badge"><Lock size={9} /> Locked</div>
                  </div>
                </div>
              </div>

              {/* Section: Academic */}
              <div style={{ margin: '8px -28px 0', padding: '18px 28px 0', borderTop: '1px solid #e8f0fe' }}>
                <div className="ep-section-label" style={{ marginBottom: 18 }}>
                  <GraduationCap size={12} /> Academic Details
                </div>
              </div>

              <div className="ep-row">
                <div className="ep-group">
                  <label className="ep-label"><BookOpen size={12} /> Faculty</label>
                  <div className="ep-select-wrap">
                    <select name="faculty" value={formData.faculty} className="ep-input" onChange={handleChange}>
                      <option value="IT">IT</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Business">Business</option>
                      <option value="Computing">Computing</option>
                      <option value="Other">Other</option>
                    </select>
                    <span className="ep-select-icon"><ChevronDown size={14} /></span>
                  </div>
                </div>
                <div className="ep-group">
                  <label className="ep-label"><GraduationCap size={12} /> Academic Year</label>
                  <div className="ep-select-wrap">
                    <select name="academicYear" value={formData.academicYear} className="ep-input" onChange={handleChange}>
                      <option value="Year 1">Year 1</option>
                      <option value="Year 2">Year 2</option>
                      <option value="Year 3">Year 3</option>
                      <option value="Year 4">Year 4</option>
                    </select>
                    <span className="ep-select-icon"><ChevronDown size={14} /></span>
                  </div>
                </div>
              </div>

              <div className="ep-row">
                <div className="ep-group">
                  <label className="ep-label"><BookOpen size={12} /> Semester</label>
                  <div className="ep-select-wrap">
                    <select name="semester" value={formData.semester} className="ep-input" onChange={handleChange}>
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                    </select>
                    <span className="ep-select-icon"><ChevronDown size={14} /></span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="ep-actions" style={{ margin: '20px -28px -28px', borderRadius: '0 0 20px 20px' }}>
                <button type="button" className="btn-cancel" onClick={() => navigate('/profile')}>
                  <ArrowLeft size={14} /> Cancel
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading
                    ? <><div className="spinner" /> Saving…</>
                    : <><Save size={14} /> Save Changes</>}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}