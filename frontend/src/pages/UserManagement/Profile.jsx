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

  const STATS = [
    { icon: <Upload size={18} />, label: "Uploads", value: "12" },
    { icon: <Download size={18} />, label: "Downloads", value: "1.4k" },
    { icon: <ThumbsUp size={18} />, label: "Likes", value: "342" },
    { icon: <Star size={18} />, label: "Saved", value: "27" },
  ];

  const TABS = ["Overview", "My Uploads", "Saved Notes"];

  const MY_UPLOADS = [
    { title: "Operating Systems — Memory Management", subject: "IT2204", downloads: 2310, likes: 187, level: "Intermediate" },
    { title: "Computer Architecture — CPU Design Basics", subject: "IT1104", downloads: 1870, likes: 144, level: "Beginner" },
    { title: "Machine Learning — Regression & Classification", subject: "IT3402", downloads: 3120, likes: 264, level: "Advanced" },
  ];

  const LEVEL_COLORS = {
    Beginner:     { bg: "#e6f4f1", color: "#0f6e56", dot: "#1d9e75" },
    Intermediate: { bg: "#e8f0fe", color: "#1565C0", dot: "#378add" },
    Advanced:     { bg: "#fce8ef", color: "#993556", dot: "#d4537e" },
  };

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; }

        /* ── HERO ── */
        .prof-hero {
          position: relative;
          min-height: 320px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow: hidden;
          padding-bottom: 0;
        }
        .prof-hero-bg {
          position: absolute; inset: 0;
          background-image: url("../images/background2.jpg");
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        .prof-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(13,34,87,0.55) 0%,
            rgba(21,101,192,0.40) 50%,
            rgba(255,255,255,0.70) 100%
          );
          z-index: 1;
        }

        /* ── PROFILE CARD (overlapping hero) ── */
        .prof-card-wrap {
          position: relative; z-index: 2;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 40px;
          transform: translateY(48px);
        }
        .prof-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e8f0fe;
          box-shadow: 0 8px 40px rgba(21,101,192,0.13);
          padding: 28px 32px;
          display: flex;
          align-items: center;
          gap: 28px;
        }

        /* Avatar */
        .prof-avatar-ring {
          flex-shrink: 0;
          width: 90px; height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 18px rgba(21,101,192,0.30);
          position: relative;
        }
        .prof-avatar-ring::after {
          content: '';
          position: absolute; inset: -3px;
          border-radius: 50%;
          border: 2.5px solid #1565C0;
          opacity: 0.3;
        }
        .prof-avatar-initials {
          font-size: 1.7rem; font-weight: 800;
          color: white; letter-spacing: -1px;
        }

        .prof-info { flex: 1; min-width: 0; }
        .prof-name {
          font-size: 1.35rem; font-weight: 800;
          color: #0d2257; margin-bottom: 4px;
        }
        .prof-sub {
          font-size: 0.8rem; color: #1565C0;
          font-weight: 600; margin-bottom: 10px;
        }
        .prof-tags {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .prof-tag {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.73rem; color: #555; font-weight: 500;
          background: #f4f7ff;
          border: 1px solid #e8f0fe;
          border-radius: 20px;
          padding: 4px 12px;
        }
        .prof-tag svg { color: #1565C0; flex-shrink: 0; }

        .prof-card-actions {
          display: flex; flex-direction: column; gap: 10px;
          flex-shrink: 0;
        }
        .btn-edit {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 20px;
          background: #1565C0; color: white;
          border: none; border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          cursor: pointer; text-decoration: none;
          box-shadow: 0 3px 14px rgba(21,101,192,0.30);
          transition: all 0.2s;
          white-space: nowrap;
        }
        .btn-edit:hover {
          background: #0d47a1;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(21,101,192,0.38);
        }
        .btn-pwd {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 20px;
          background: transparent; color: #1565C0;
          border: 1.5px solid #1565C0; border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          cursor: pointer; text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .btn-pwd:hover {
          background: #e8f0fe;
        }

        /* ── BODY SECTION ── */
        .prof-body {
          max-width: 900px;
          margin: 0 auto;
          padding: 80px 40px 60px;
        }

        /* ── STATS ROW ── */
        .prof-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 32px;
        }
        .stat-card {
          background: white;
          border: 1px solid #e8f0fe;
          border-radius: 14px;
          padding: 18px 16px;
          text-align: center;
          box-shadow: 0 2px 12px rgba(21,101,192,0.06);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 22px rgba(21,101,192,0.13);
        }
        .stat-icon {
          width: 40px; height: 40px;
          background: #e8f0fe;
          color: #1565C0;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 10px;
        }
        .stat-value {
          font-size: 1.45rem; font-weight: 800;
          color: #0d2257; line-height: 1;
        }
        .stat-label {
          font-size: 0.72rem; color: #888;
          font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.8px; margin-top: 4px;
        }

        /* ── TABS ── */
        .prof-tabs {
          display: flex; gap: 6px;
          border-bottom: 2px solid #e8f0fe;
          margin-bottom: 24px;
        }
        .prof-tab {
          padding: 10px 20px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.82rem; font-weight: 600;
          color: #888; border: none; background: transparent;
          cursor: pointer; border-bottom: 2.5px solid transparent;
          margin-bottom: -2px; transition: all 0.2s;
        }
        .prof-tab:hover { color: #1565C0; }
        .prof-tab.active {
          color: #1565C0;
          border-bottom-color: #1565C0;
        }

        /* ── OVERVIEW GRID ── */
        .overview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* Detail card */
        .detail-card {
          background: white;
          border: 1px solid #e8f0fe;
          border-radius: 14px;
          padding: 22px 24px;
          box-shadow: 0 2px 12px rgba(21,101,192,0.06);
        }
        .detail-card-title {
          font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1.2px;
          color: #1565C0; margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .detail-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #f4f7ff;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-icon {
          width: 32px; height: 32px;
          background: #f4f7ff;
          color: #1565C0;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .detail-info {}
        .detail-label {
          font-size: 0.68rem; color: #aaa;
          font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px;
        }
        .detail-value {
          font-size: 0.85rem; color: #0d2257;
          font-weight: 600;
        }

        /* Badge card */
        .badge-card {
          background: white;
          border: 1px solid #e8f0fe;
          border-radius: 14px;
          padding: 22px 24px;
          box-shadow: 0 2px 12px rgba(21,101,192,0.06);
        }
        .badge-list {
          display: flex; flex-direction: column; gap: 10px;
        }
        .badge-item {
          display: flex; align-items: center; gap: 12px;
          background: #f4f7ff;
          border-radius: 10px;
          padding: 10px 14px;
        }
        .badge-icon {
          width: 34px; height: 34px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .badge-text { flex: 1; }
        .badge-name {
          font-size: 0.82rem; font-weight: 700;
          color: #0d2257;
        }
        .badge-desc {
          font-size: 0.7rem; color: #888;
        }

        /* ── UPLOADS TAB ── */
        .upload-list { display: flex; flex-direction: column; gap: 12px; }
        .upload-item {
          background: white;
          border: 1px solid #e8f0fe;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex; align-items: center; gap: 16px;
          box-shadow: 0 2px 10px rgba(21,101,192,0.06);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .upload-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(21,101,192,0.12);
        }
        .upload-thumb {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: rgba(255,255,255,0.75);
          font-size: 0.6rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px;
          text-align: center;
          padding: 4px;
        }
        .upload-info { flex: 1; min-width: 0; }
        .upload-title {
          font-size: 0.88rem; font-weight: 700;
          color: #0d2257; margin-bottom: 4px;
        }
        .upload-meta {
          display: flex; align-items: center; gap: 14px;
          font-size: 0.72rem; color: #888;
        }
        .upload-meta span { display: flex; align-items: center; gap: 4px; }
        .level-badge-sm {
          font-size: 0.65rem; font-weight: 700;
          padding: 2px 10px; border-radius: 20px;
        }
        .upload-action {
          color: #1565C0; cursor: pointer;
          opacity: 0.5; transition: opacity 0.2s;
        }
        .upload-action:hover { opacity: 1; }

        /* ── SAVED TAB ── */
        .saved-empty {
          text-align: center; padding: 60px 20px;
          color: #aaa;
        }
        .saved-empty-icon {
          width: 64px; height: 64px;
          background: #f4f7ff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          color: #c8d8f5;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .prof-card-wrap { padding: 0 20px; }
          .prof-card { flex-direction: column; text-align: center; gap: 18px; }
          .prof-card-actions { flex-direction: row; justify-content: center; }
          .prof-body { padding: 80px 20px 50px; }
          .prof-stats { grid-template-columns: repeat(2, 1fr); }
          .overview-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .prof-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section className="prof-hero">
        <div className="prof-hero-bg" />
        <div className="prof-hero-overlay" />

        <div className="prof-card-wrap">
          <div className="prof-card">
            {/* Avatar */}
            <div className="prof-avatar-ring">
              <span className="prof-avatar-initials">
                {(user.fullName || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>

            {/* Info */}
            <div className="prof-info">
              <div className="prof-name">{user.fullName || "Student Name"}</div>
              <div className="prof-sub">{user.faculty || "Faculty of Computing"}</div>
              <div className="prof-tags">
                <span className="prof-tag">
                  <Hash size={12} /> {user.studentId || "IT21XXXXXX"}
                </span>
                <span className="prof-tag">
                  <Mail size={12} /> {user.email || "student@nsbm.ac.lk"}
                </span>
                <span className="prof-tag">
                  <GraduationCap size={12} /> {user.academicYear || "1st Year"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="prof-card-actions">
              <Link to="/edit-profile" className="btn-edit">
                <Edit3 size={14} /> Edit Profile
              </Link>
              <Link to="/change-password" className="btn-pwd">
                <Lock size={14} /> Change Password
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="prof-body">

        {/* STATS */}
        <div className="prof-stats">
          {STATS.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="prof-tabs">
          {TABS.map((t, i) => (
            <button
              key={t}
              className={`prof-tab${activeTab === i ? " active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === 0 && (
          <div className="overview-grid">
            {/* Personal Details */}
            <div className="detail-card">
              <div className="detail-card-title">
                <User size={14} /> Personal Details
              </div>
              {[
                { icon: <User size={14} />, label: "Full Name", value: user.fullName },
                { icon: <Hash size={14} />, label: "Student ID", value: user.studentId },
                { icon: <Mail size={14} />, label: "Email", value: user.email },
              ].map((r) => (
                <div className="detail-row" key={r.label}>
                  <div className="detail-icon">{r.icon}</div>
                  <div className="detail-info">
                    <div className="detail-label">{r.label}</div>
                    <div className="detail-value">{r.value || "—"}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Details */}
            <div className="detail-card">
              <div className="detail-card-title">
                <GraduationCap size={14} /> Academic Details
              </div>
              {[
                { icon: <BookOpen size={14} />, label: "Faculty", value: user.faculty },
                { icon: <GraduationCap size={14} />, label: "Academic Year", value: user.academicYear },
                { icon: <Shield size={14} />, label: "Role", value: "Student Contributor" },
              ].map((r) => (
                <div className="detail-row" key={r.label}>
                  <div className="detail-icon">{r.icon}</div>
                  <div className="detail-info">
                    <div className="detail-label">{r.label}</div>
                    <div className="detail-value">{r.value || "—"}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="badge-card" style={{ gridColumn: "1 / -1" }}>
              <div className="detail-card-title">
                <Award size={14} /> Achievements
              </div>
              <div className="badge-list">
                {[
                  {
                    icon: <Upload size={15} />,
                    bg: "#e8f0fe", color: "#1565C0",
                    name: "First Upload",
                    desc: "Shared your first set of notes",
                  },
                  {
                    icon: <TrendingUp size={15} />,
                    bg: "#e6f4f1", color: "#0f6e56",
                    name: "Rising Contributor",
                    desc: "Reached 1,000 total downloads",
                  },
                  {
                    icon: <Star size={15} />,
                    bg: "#fef9e7", color: "#b7830a",
                    name: "Community Star",
                    desc: "Received 300+ likes across all uploads",
                  },
                ].map((b) => (
                  <div className="badge-item" key={b.name}>
                    <div
                      className="badge-icon"
                      style={{ background: b.bg, color: b.color }}
                    >
                      {b.icon}
                    </div>
                    <div className="badge-text">
                      <div className="badge-name">{b.name}</div>
                      <div className="badge-desc">{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: MY UPLOADS */}
        {activeTab === 1 && (
          <div className="upload-list">
            {MY_UPLOADS.map((u) => {
              const lv = LEVEL_COLORS[u.level];
              return (
                <div className="upload-item" key={u.title}>
                  <div className="upload-thumb">
                    <FileText size={22} color="rgba(255,255,255,0.8)" />
                  </div>
                  <div className="upload-info">
                    <div className="upload-title">{u.title}</div>
                    <div className="upload-meta">
                      <span
                        className="level-badge-sm"
                        style={{ background: lv.bg, color: lv.color }}
                      >
                        {u.level}
                      </span>
                      <span><ThumbsUp size={12} /> {u.likes}</span>
                      <span><Download size={12} /> {u.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="upload-action">
                    <ChevronRight size={18} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: SAVED */}
        {activeTab === 2 && (
          <div className="saved-empty">
            <div className="saved-empty-icon">
              <Star size={28} />
            </div>
            <p style={{ fontWeight: 700, color: "#0d2257", marginBottom: 6 }}>
              No saved notes yet
            </p>
            <p style={{ fontSize: "0.82rem" }}>
              Star notes from the library to save them here for quick access.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}