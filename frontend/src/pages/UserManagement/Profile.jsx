import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  User, Mail, Hash, BookOpen, GraduationCap, Edit3, Lock,
  Upload, Download, ThumbsUp, Star, Award, TrendingUp, FileText,
  ChevronRight, Shield
} from "lucide-react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Kavisha Perera",
    studentId: "IT21234567",
    email: "kavisha.p@students.nsbm.ac.lk",
    faculty: "Faculty of Computing",
    academicYear: "2nd Year",
  };

  const [activeTab, setActiveTab] = useState(0);

  // Determine user role dynamically: "Admin" for admin users, "Student Contributor" for students
  const userRole = user.role && user.role.toLowerCase() === "admin" ? "Admin" : "Student Contributor";

  const STATS = [
    { icon: <Upload size={18} />, label: "Uploads",   value: "12",   color: "#1565C0", bg: "#e8f0fe" },
    { icon: <Download size={18} />, label: "Downloads", value: "1.4k", color: "#0f6e56", bg: "#e6f4f1" },
    { icon: <ThumbsUp size={18} />, label: "Likes",    value: "342",  color: "#993556", bg: "#fce8ef" },
    { icon: <Star size={18} />,     label: "Saved",    value: "27",   color: "#b7830a", bg: "#fef9e7" },
  ];

  const TABS = ["Overview", "My Uploads", "Saved Notes"];

  const MY_UPLOADS = [
    { title: "Operating Systems — Memory Management",          subject: "IT2204", downloads: 2310, likes: 187, level: "Intermediate" },
    { title: "Computer Architecture — CPU Design Basics",      subject: "IT1104", downloads: 1870, likes: 144, level: "Beginner" },
    { title: "Machine Learning — Regression & Classification", subject: "IT3402", downloads: 3120, likes: 264, level: "Advanced" },
  ];

  const LEVEL_COLORS = {
    Beginner:     { bg: "#e6f4f1", color: "#0f6e56" },
    Intermediate: { bg: "#e8f0fe", color: "#1565C0" },
    Advanced:     { bg: "#fce8ef", color: "#993556" },
  };

  return (
    <div style={{ background: "#f4f7ff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; background: #f4f7ff; }

        /* ══════════════════════════════════════
           HERO  — tall enough so the card never clips
        ══════════════════════════════════════ */
        .prof-hero {
          position: relative;
          /* hero height + half the card height so card sits half-in, half-out */
          padding-bottom: 80px;        /* ← guarantees room for the card overlap */
          min-height: 320px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow: visible;           /* ← must be visible so card isn't clipped */
        }
        .prof-hero-bg {
          position: absolute; inset: 0;
          background-image: url("../images/background2.jpg");
          background-size: cover;
          background-position: center top;
          z-index: 0;
        }
        /* subtle grain overlay for premium feel */
        .prof-hero-bg::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          z-index: 1;
        }
        .prof-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            160deg,
            rgba(13,34,87,0.82) 0%,
            rgba(21,101,192,0.55) 55%,
            rgba(255,255,255,0.0) 100%
          );
          z-index: 2;
        }
        /* decorative arc at bottom of hero */
        .prof-hero-arc {
          position: absolute; bottom: -1px; left: 0; right: 0; z-index: 3;
          line-height: 0;
        }

        /* ══════════════════════════════════════
           PROFILE CARD — sits on top of the arc
        ══════════════════════════════════════ */
        .prof-card-wrap {
          position: relative; z-index: 10;
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          padding: 0 40px;
          /* shift card UP so it overlaps the hero arc */
          margin-top: -72px;
        }
        .prof-card {
          background: #ffffff;
          border-radius: 22px;
          border: 1px solid rgba(21,101,192,0.12);
          box-shadow:
            0 4px 6px rgba(13,34,87,0.04),
            0 12px 40px rgba(21,101,192,0.14),
            0 0 0 1px rgba(255,255,255,0.9) inset;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          gap: 28px;
        }

        /* ── Avatar ── */
        .prof-avatar-wrap {
          flex-shrink: 0;
          position: relative;
        }
        .prof-avatar-ring {
          width: 88px; height: 88px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 20px rgba(21,101,192,0.38);
          position: relative;
        }
        .prof-avatar-ring::before {
          content: '';
          position: absolute; inset: -4px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(21,101,192,0.4), rgba(255,255,255,0.6));
          z-index: -1;
        }
        .prof-avatar-initials {
          font-size: 1.65rem; font-weight: 900;
          color: white; letter-spacing: -1.5px;
        }
        /* online dot */
        .prof-avatar-dot {
          position: absolute; bottom: 3px; right: 3px;
          width: 14px; height: 14px;
          background: #1d9e75; border-radius: 50%;
          border: 2.5px solid white;
          box-shadow: 0 2px 6px rgba(29,158,117,0.4);
        }

        /* ── Info ── */
        .prof-info { flex: 1; min-width: 0; }
        .prof-name {
          font-size: 1.35rem; font-weight: 800;
          color: #0d2257; margin-bottom: 2px;
          letter-spacing: -0.4px;
        }
        .prof-sub {
          font-size: 0.78rem; color: #1565C0;
          font-weight: 600; margin-bottom: 12px;
          letter-spacing: 0.2px;
        }
        .prof-tags { display: flex; flex-wrap: wrap; gap: 7px; }
        .prof-tag {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.71rem; color: #555; font-weight: 600;
          background: #f4f7ff;
          border: 1px solid #dde8fd;
          border-radius: 20px;
          padding: 4px 12px;
          transition: background 0.18s;
        }
        .prof-tag:hover { background: #e8f0fe; }
        .prof-tag svg { color: #1565C0; flex-shrink: 0; }

        /* ── Action buttons ── */
        .prof-card-actions {
          display: flex; flex-direction: column; gap: 10px;
          flex-shrink: 0;
        }
        .btn-edit {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 22px;
          background: linear-gradient(135deg, #1565C0 0%, #0d47a1 100%);
          color: white; border: none; border-radius: 11px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem; font-weight: 700;
          cursor: pointer; text-decoration: none;
          box-shadow: 0 4px 14px rgba(21,101,192,0.36);
          transition: all 0.22s; white-space: nowrap;
          letter-spacing: 0.2px;
        }
        .btn-edit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(21,101,192,0.44);
        }
        .btn-pwd {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 22px;
          background: transparent; color: #1565C0;
          border: 1.5px solid #c5d8f8; border-radius: 11px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem; font-weight: 700;
          cursor: pointer; text-decoration: none;
          transition: all 0.22s; white-space: nowrap;
          letter-spacing: 0.2px;
        }
        .btn-pwd:hover { background: #e8f0fe; border-color: #1565C0; }

        /* ══════════════════════════════════════
           BODY
        ══════════════════════════════════════ */
        .prof-body {
          max-width: 960px;
          margin: 0 auto;
          padding: 36px 40px 72px;
        }

        /* ── Stats row ── */
        .prof-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 32px;
        }
        .stat-card {
          background: white;
          border: 1px solid rgba(21,101,192,0.10);
          border-radius: 16px;
          padding: 20px 16px 18px;
          display: flex; flex-direction: column; align-items: center;
          box-shadow: 0 2px 16px rgba(21,101,192,0.06);
          transition: transform 0.22s, box-shadow 0.22s;
          position: relative; overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--stat-color, #1565C0);
          opacity: 0;
          transition: opacity 0.22s;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(21,101,192,0.13);
        }
        .stat-card:hover::before { opacity: 1; }
        .stat-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px;
        }
        .stat-value {
          font-size: 1.55rem; font-weight: 900;
          color: #0d2257; line-height: 1; letter-spacing: -1px;
        }
        .stat-label {
          font-size: 0.65rem; color: #aaa;
          font-weight: 700; text-transform: uppercase;
          letter-spacing: 1px; margin-top: 5px;
        }

        /* ── Tabs ── */
        .prof-tabs {
          display: flex; gap: 4px;
          border-bottom: 2px solid #e8f0fe;
          margin-bottom: 26px;
        }
        .prof-tab {
          padding: 10px 22px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem; font-weight: 700;
          color: #aaa; border: none; background: transparent;
          cursor: pointer;
          border-bottom: 2.5px solid transparent;
          margin-bottom: -2px;
          transition: all 0.2s; border-radius: 8px 8px 0 0;
          letter-spacing: 0.2px;
        }
        .prof-tab:hover { color: #1565C0; background: #f4f7ff; }
        .prof-tab.active { color: #1565C0; border-bottom-color: #1565C0; background: #f0f5ff; }

        /* ── Overview grid ── */
        .overview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* detail card */
        .detail-card {
          background: white;
          border: 1px solid rgba(21,101,192,0.10);
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 2px 16px rgba(21,101,192,0.06);
        }
        .detail-card-title {
          font-size: 0.66rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 1.4px;
          color: #1565C0; margin-bottom: 18px;
          display: flex; align-items: center; gap: 8px;
        }
        .detail-row {
          display: flex; align-items: center; gap: 13px;
          padding: 11px 0;
          border-bottom: 1px solid #f0f4ff;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-icon {
          width: 34px; height: 34px;
          background: #f4f7ff; color: #1565C0;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .detail-label {
          font-size: 0.62rem; color: #bbb;
          font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px;
          margin-bottom: 2px;
        }
        .detail-value {
          font-size: 0.84rem; color: #0d2257; font-weight: 600;
        }

        /* badge/achievements card */
        .badge-card {
          background: white;
          border: 1px solid rgba(21,101,192,0.10);
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 2px 16px rgba(21,101,192,0.06);
        }
        .badge-list { display: flex; flex-direction: column; gap: 10px; }
        .badge-item {
          display: flex; align-items: center; gap: 14px;
          background: linear-gradient(135deg, #f8faff 0%, #f4f7ff 100%);
          border: 1px solid #edf1fb;
          border-radius: 12px;
          padding: 12px 16px;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .badge-item:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 14px rgba(21,101,192,0.09);
        }
        .badge-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .badge-name { font-size: 0.82rem; font-weight: 800; color: #0d2257; margin-bottom: 1px; }
        .badge-desc { font-size: 0.68rem; color: #999; font-weight: 500; }

        /* ── Upload list ── */
        .upload-list { display: flex; flex-direction: column; gap: 12px; }
        .upload-item {
          background: white;
          border: 1px solid rgba(21,101,192,0.10);
          border-radius: 14px;
          padding: 16px 20px;
          display: flex; align-items: center; gap: 16px;
          box-shadow: 0 2px 12px rgba(21,101,192,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .upload-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(21,101,192,0.13);
        }
        .upload-thumb {
          width: 50px; height: 50px;
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(21,101,192,0.28);
        }
        .upload-title {
          font-size: 0.86rem; font-weight: 700;
          color: #0d2257; margin-bottom: 5px;
        }
        .upload-meta {
          display: flex; align-items: center; gap: 12px;
          font-size: 0.7rem; color: #999; font-weight: 500;
        }
        .upload-meta span { display: flex; align-items: center; gap: 4px; }
        .level-badge {
          font-size: 0.62rem; font-weight: 800;
          padding: 3px 10px; border-radius: 20px;
          letter-spacing: 0.3px;
        }
        .upload-action { color: #c8d8f5; transition: color 0.2s; }
        .upload-item:hover .upload-action { color: #1565C0; }

        /* ── Saved empty ── */
        .saved-empty {
          text-align: center; padding: 70px 20px;
        }
        .saved-empty-icon {
          width: 68px; height: 68px;
          background: linear-gradient(135deg, #f4f7ff, #e8f0fe);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
          color: #c8d8f5;
          box-shadow: 0 4px 16px rgba(21,101,192,0.08);
        }

        /* ══════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════ */
        @media (max-width: 768px) {
          .prof-card-wrap { padding: 0 20px; }
          .prof-card { flex-direction: column; text-align: center; gap: 20px; padding: 24px 20px; }
          .prof-tags { justify-content: center; }
          .prof-card-actions { flex-direction: row; justify-content: center; }
          .prof-body { padding: 28px 20px 56px; }
          .prof-stats { grid-template-columns: repeat(2, 1fr); }
          .overview-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .prof-stats { grid-template-columns: repeat(2, 1fr); }
          .btn-edit, .btn-pwd { padding: 9px 16px; font-size: 0.74rem; }
        }
      `}</style>

      <Navbar />

      {/* ══ HERO ══ */}
      <section className="prof-hero">
        <div className="prof-hero-bg" />
        <div className="prof-hero-overlay" />

        {/* SVG arc at bottom of hero */}
        <div className="prof-hero-arc">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%", height: 60 }}>
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#f4f7ff" />
          </svg>
        </div>
      </section>

      {/* ══ PROFILE CARD (outside hero, no translateY clipping) ══ */}
      <div style={{ background: "#f4f7ff" }}>
        <div className="prof-card-wrap">
          <div className="prof-card">

            {/* Avatar */}
            <div className="prof-avatar-wrap">
              <div className="prof-avatar-ring">
                <span className="prof-avatar-initials">
                  {(user.fullName || "U").split(" ").map(n => n[0]).slice(0, 2).join("")}
                </span>
              </div>
              <div className="prof-avatar-dot" />
            </div>

            {/* Info */}
            <div className="prof-info">
              <div className="prof-name">{user.fullName || "Student Name"}</div>
              <div className="prof-sub">{user.faculty || "Faculty of Computing"}</div>
              <div className="prof-tags">
                <span className="prof-tag"><Hash size={11} /> {user.studentId || "IT21XXXXXX"}</span>
                <span className="prof-tag"><Mail size={11} /> {user.email || "student@nsbm.ac.lk"}</span>
                <span className="prof-tag"><GraduationCap size={11} /> {user.academicYear || "1st Year"}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="prof-card-actions">
              <Link to="/EditProfile" className="btn-edit">
                <Edit3 size={13} /> Edit Profile
              </Link>
              <Link to="/ChangePassword" className="btn-pwd">
                <Lock size={13} /> Change Password
              </Link>
            </div>
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div className="prof-body">

          {/* Stats */}
          <div className="prof-stats">
            {STATS.map((s) => (
              <div className="stat-card" key={s.label} style={{ "--stat-color": s.color }}>
                <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="prof-tabs">
            {TABS.map((t, i) => (
              <button
                key={t}
                className={`prof-tab${activeTab === i ? " active" : ""}`}
                onClick={() => setActiveTab(i)}
              >{t}</button>
            ))}
          </div>

          {/* ── Tab: Overview ── */}
          {activeTab === 0 && (
            <div className="overview-grid">
              {/* Personal */}
              <div className="detail-card">
                <div className="detail-card-title"><User size={13} /> Personal Details</div>
                {[
                  { icon: <User size={13} />,        label: "Full Name",  value: user.fullName },
                  { icon: <Hash size={13} />,        label: "Student ID", value: user.studentId },
                  { icon: <Mail size={13} />,        label: "Email",      value: user.email },
                ].map(r => (
                  <div className="detail-row" key={r.label}>
                    <div className="detail-icon">{r.icon}</div>
                    <div>
                      <div className="detail-label">{r.label}</div>
                      <div className="detail-value">{r.value || "—"}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Academic */}
              <div className="detail-card">
                <div className="detail-card-title"><GraduationCap size={13} /> Academic Details</div>
                {[
                  { icon: <BookOpen size={13} />,      label: "Faculty",       value: user.faculty },
                  { icon: <GraduationCap size={13} />, label: "Academic Year",  value: user.academicYear },
                  { icon: <Shield size={13} />,        label: "Role",           value: userRole },
                ].map(r => (
                  <div className="detail-row" key={r.label}>
                    <div className="detail-icon">{r.icon}</div>
                    <div>
                      <div className="detail-label">{r.label}</div>
                      <div className="detail-value">{r.value || "—"}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Achievements — full width */}
              <div className="badge-card" style={{ gridColumn: "1 / -1" }}>
                <div className="detail-card-title"><Award size={13} /> Achievements</div>
                <div className="badge-list">
                  {[
                    { icon: <Upload size={16} />,     bg: "#e8f0fe", color: "#1565C0", name: "First Upload",        desc: "Shared your first set of notes" },
                    { icon: <TrendingUp size={16} />, bg: "#e6f4f1", color: "#0f6e56", name: "Rising Contributor",  desc: "Reached 1,000 total downloads" },
                    { icon: <Star size={16} />,       bg: "#fef9e7", color: "#b7830a", name: "Community Star",      desc: "Received 300+ likes across all uploads" },
                  ].map(b => (
                    <div className="badge-item" key={b.name}>
                      <div className="badge-icon" style={{ background: b.bg, color: b.color }}>{b.icon}</div>
                      <div>
                        <div className="badge-name">{b.name}</div>
                        <div className="badge-desc">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: My Uploads ── */}
          {activeTab === 1 && (
            <div className="upload-list">
              {MY_UPLOADS.map(u => {
                const lv = LEVEL_COLORS[u.level];
                return (
                  <div className="upload-item" key={u.title}>
                    <div className="upload-thumb">
                      <FileText size={20} color="rgba(255,255,255,0.85)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="upload-title">{u.title}</div>
                      <div className="upload-meta">
                        <span className="level-badge" style={{ background: lv.bg, color: lv.color }}>{u.level}</span>
                        <span><ThumbsUp size={11} /> {u.likes}</span>
                        <span><Download size={11} /> {u.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="upload-action"><ChevronRight size={18} /></div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Tab: Saved ── */}
          {activeTab === 2 && (
            <div className="saved-empty">
              <div className="saved-empty-icon"><Star size={28} /></div>
              <p style={{ fontWeight: 800, color: "#0d2257", marginBottom: 6, fontSize: "0.95rem" }}>No saved notes yet</p>
              <p style={{ fontSize: "0.78rem", color: "#aaa" }}>Star notes from the library to save them here for quick access.</p>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}