import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  User, Mail, Hash, BookOpen, GraduationCap, Save, ArrowLeft,
  CheckCircle, AlertCircle, Lock, ChevronDown
} from 'lucide-react';

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    faculty: '',
    academicYear: '',
    semester: '',
    profilePicture: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      studentId: user.studentId || '',
      faculty: user.faculty || 'IT',
      academicYear: user.academicYear || 'Year 1',
      semester: user.semester || '1',
      profilePicture: user.profilePicture || ''
    });
  }, []);

  useEffect(() => {
    return () => {
      if (profilePreviewUrl) URL.revokeObjectURL(profilePreviewUrl);
    };
  }, [profilePreviewUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfileFile(file);

    if (profilePreviewUrl) URL.revokeObjectURL(profilePreviewUrl);
    setProfilePreviewUrl(file ? URL.createObjectURL(file) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // If no token, prompt user to log in again
      if (!token) {
        setMessage({ text: 'Session expired. Please log in again.', type: 'error' });
        setTimeout(() => navigate('/login'), 2000);
        setLoading(false);
        return;
      }

      // Upload profile picture (optional)
      if (profileFile) {
        const fd = new FormData();
        fd.append('profilePicture', profileFile);
        const picRes = await axios.put(`${API_BASE_URL}/api/users/profile-picture`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (picRes?.data?.user) {
          localStorage.setItem('user', JSON.stringify(picRes.data.user));
          setFormData((p) => ({ ...p, profilePicture: picRes.data.user.profilePicture || p.profilePicture }));
        }
      }

      const res = await axios.put(`${API_BASE_URL}/api/users/profile`,
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
      // If authorization error, clear token and redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setMessage({ text: 'Session expired. Please log in again.', type: 'error' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage({ text: err.response?.data?.message || 'Update failed. Please try again.', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const initials = (formData.fullName || 'U')
    .split(' ').map(n => n[0]).slice(0, 2).join('');

  const avatarSrc = profilePreviewUrl || formData.profilePicture || '';

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
          overflow: hidden;
        }
        .ep-hero-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ep-photo-actions {
          margin-top: 12px;
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .ep-photo-btn {
          padding: 7px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.92);
          font-family: 'Poppins', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.18s, transform 0.14s;
        }
        .ep-photo-btn:hover { background: rgba(255,255,255,0.18); transform: translateY(-1px); }
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

        /* ══════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════ */
        @media (max-width: 1024px) {
          .ep-wrap { padding: 0 28px; }
          .ep-card { border-radius: 18px; }
          .ep-hero { min-height: 200px; }
          .ep-hero-inner { padding: 36px 20px 56px; }
        }
        
        @media (max-width: 900px) {
          .ep-wrap { padding: 0 24px; }
          .ep-hero { min-height: 190px; }
          .ep-hero-inner { padding: 32px 20px 52px; }
          .ep-hero-title { font-size: 1.15rem; }
          .ep-row { grid-template-columns: 1fr; }
          .ep-label { font-size: 0.68rem; }
          .ep-input { font-size: 0.82rem; padding: 9px 12px; }
          .ep-form-body { padding: 18px 24px 24px; }
        }
        
        @media (max-width: 768px) {
          .ep-wrap { padding: 0 20px; margin: -32px auto 50px; }
          .ep-hero { min-height: 180px; }
          .ep-hero-inner { padding: 28px 16px 48px; }
          .ep-hero-avatar { width: 64px; height: 64px; margin-bottom: 12px; }
          .ep-hero-title { font-size: 1.1rem; margin-bottom: 3px; }
          .ep-hero-sub { font-size: 0.74rem; }
          .ep-photo-actions { gap: 8px; margin-top: 10px; }
          .ep-photo-btn { padding: 6px 10px; font-size: 0.68rem; }
          .ep-card { border-radius: 16px; padding: 0; }
          .ep-row { grid-template-columns: 1fr; gap: 14px; }
          .ep-form-body { padding: 16px 20px 22px; }
          .ep-section { padding: 18px 20px 0; }
          .ep-section-label { font-size: 0.66rem; padding: 4px 11px; margin-bottom: 14px; }
          .ep-divider { margin: 6px 20px 0; }
          .ep-label { font-size: 0.66rem; gap: 5px; }
          .ep-input { font-size: 0.8rem; padding: 9px 12px; }
          .ep-actions { padding: 16px 20px; gap: 10px; }
          .btn-cancel { font-size: 0.78rem; padding: 10px; }
          .btn-save { font-size: 0.78rem; padding: 10px; }
          .ep-alert { margin: 0 20px 16px; padding: 10px 14px; font-size: 0.76rem; }
          .ep-back { font-size: 0.74rem; margin-bottom: 12px; }
        }
        
        @media (max-width: 640px) {
          .ep-wrap { padding: 0 16px; margin: -30px auto 40px; }
          .ep-hero { min-height: 170px; padding-top: 32px; }
          .ep-hero-inner { padding: 24px 12px 44px; }
          .ep-hero-avatar { width: 56px; height: 56px; font-size: 1.2rem; }
          .ep-hero-title { font-size: 1rem; }
          .ep-hero-sub { font-size: 0.72rem; }
          .ep-photo-btn { padding: 5px 9px; font-size: 0.65rem; }
          .ep-card { border-radius: 14px; }
          .ep-form-body { padding: 14px 16px 20px; }
          .ep-section { padding: 14px 16px 0; }
          .ep-divider { margin: 5px 16px 0; }
          .ep-input { font-size: 0.78rem; padding: 8px 11px; }
          .ep-label { font-size: 0.64rem; }
          .ep-actions { padding: 12px 16px; }
          .btn-cancel, .btn-save { font-size: 0.75rem; padding: 9px; }
          .ep-alert { margin: 0 16px 14px; padding: 9px 12px; font-size: 0.72rem; }
          .ep-back { font-size: 0.72rem; }
        }
        
        @media (max-width: 480px) {
          .ep-wrap { padding: 0 12px; margin: -28px auto 32px; }
          .ep-hero { min-height: 160px; padding-top: 24px; }
          .ep-hero-inner { padding: 20px 8px 40px; }
          .ep-hero-avatar { width: 48px; height: 48px; font-size: 1.05rem; margin-bottom: 10px; }
          .ep-hero-title { font-size: 0.95rem; }
          .ep-hero-sub { font-size: 0.68rem; }
          .ep-photo-actions { gap: 6px; margin-top: 8px; }
          .ep-photo-btn { padding: 4px 8px; font-size: 0.62rem; }
          .ep-card { border-radius: 12px; }
          .ep-form-body { padding: 12px 14px 18px; }
          .ep-section { padding: 12px 14px 0; }
          .ep-section-label { font-size: 0.62rem; padding: 3px 9px; margin-bottom: 12px; }
          .ep-row { gap: 12px; }
          .ep-input { font-size: 0.75rem; padding: 7px 10px; }
          .ep-label { font-size: 0.6rem; gap: 4px; }
          .ep-actions { padding: 10px 14px; }
          .btn-cancel { font-size: 0.72rem; padding: 8px; }
          .btn-save { font-size: 0.72rem; padding: 8px; }
          .ep-alert { margin: 0 14px 12px; padding: 8px 10px; font-size: 0.7rem; }
          .ep-back { font-size: 0.68rem; margin-bottom: 10px; }
        }
        
        @media (max-width: 360px) {
          .ep-wrap { padding: 0 8px; margin: -26px auto 24px; }
          .ep-hero { min-height: 150px; padding-top: 16px; }
          .ep-hero-inner { padding: 16px 4px 36px; }
          .ep-hero-avatar { width: 42px; height: 42px; font-size: 0.9rem; }
          .ep-hero-title { font-size: 0.9rem; }
          .ep-hero-sub { font-size: 0.65rem; }
          .ep-photo-btn { padding: 3px 6px; font-size: 0.58rem; }
          .ep-card { border-radius: 10px; }
          .ep-form-body { padding: 10px 12px 14px; }
          .ep-section { padding: 10px 12px 0; }
          .ep-divider { margin: 4px 12px 0; }
          .ep-input { font-size: 0.72rem; padding: 6px 9px; }
          .ep-label { font-size: 0.58rem; }
          .ep-actions { padding: 8px 12px; }
          .btn-cancel { font-size: 0.68rem; padding: 6px; }
          .btn-save { font-size: 0.68rem; padding: 6px; }
          .ep-alert { margin: 0 12px 10px; padding: 7px 9px; font-size: 0.65rem; }
          .ep-back { font-size: 0.65rem; margin-bottom: 8px; }
        }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="ep-hero">
        <div className="ep-hero-bg" />
        <div className="ep-hero-overlay" />
        <div className="ep-hero-inner">
          <div className="ep-hero-avatar">
            {avatarSrc ? <img src={avatarSrc} alt="" /> : initials}
          </div>
          <div className="ep-hero-title">Edit Profile</div>
          <div className="ep-hero-sub">Update your academic information</div>
          <div className="ep-photo-actions">
            <label className="ep-photo-btn">
              Change photo
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfileFileChange} />
            </label>
            {profileFile && (
              <button
                type="button"
                className="ep-photo-btn"
                onClick={() => {
                  setProfileFile(null);
                  if (profilePreviewUrl) URL.revokeObjectURL(profilePreviewUrl);
                  setProfilePreviewUrl('');
                }}
              >
                Remove
              </button>
            )}
          </div>
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