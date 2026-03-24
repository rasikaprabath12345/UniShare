import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Video, Calendar, Clock, BookOpen, Users,
  Plus, Search, ChevronRight, Wifi, WifiOff, CalendarClock
} from "lucide-react";

// ── Sample data matching your Meeting model ──────────────────────────────────
const MEETINGS = [
  {
    id: 1,
    title: "Introduction to Computer Networks",
    description: "We will cover OSI model, TCP/IP stack and basic network topologies with live Q&A session.",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    ownerId: "Dr. Kamal Perera",
    scheduledAt: "2025-07-15T10:00:00",
    status: "scheduled",
    year: 2025,
    semester: 1,
    module: "IT1201 — Networking",
  },
  {
    id: 2,
    title: "Data Structures: Trees & Graphs",
    description: "Deep dive into binary trees, AVL trees, graph traversal algorithms with coding examples.",
    meetingLink: "https://zoom.us/j/123456789",
    ownerId: "Dr. Nimal Silva",
    scheduledAt: "2025-07-18T14:00:00",
    status: "live",
    year: 2025,
    semester: 1,
    module: "IT2105 — Programming",
  },
  {
    id: 3,
    title: "SQL Advanced Queries & Optimization",
    description: "Joins, subqueries, indexing strategies and query performance tuning explained with real examples.",
    meetingLink: "https://meet.google.com/xyz-uvwx-yz",
    ownerId: "Ms. Dilani Fernando",
    scheduledAt: "2025-07-10T09:00:00",
    status: "ended",
    year: 2025,
    semester: 1,
    module: "IT1102 — Database",
  },
  {
    id: 4,
    title: "Ethical Hacking & Penetration Testing",
    description: "Hands-on session covering vulnerability scanning, exploitation basics and responsible disclosure.",
    meetingLink: "https://zoom.us/j/987654321",
    ownerId: "Mr. Asanka Bandara",
    scheduledAt: "2025-07-20T16:00:00",
    status: "scheduled",
    year: 2025,
    semester: 2,
    module: "IT3301 — Security",
  },
  {
    id: 5,
    title: "Agile & Scrum in Real Projects",
    description: "Sprint planning, retrospectives, kanban boards — how real teams work in the industry.",
    meetingLink: "https://meet.google.com/scrum-demo",
    ownerId: "Dr. Chaminda Rathnayake",
    scheduledAt: "2025-07-22T11:00:00",
    status: "scheduled",
    year: 2025,
    semester: 2,
    module: "IT2203 — Software Eng.",
  },
  {
    id: 6,
    title: "JavaScript & DOM Manipulation",
    description: "Event handling, async JS, fetch API and building interactive UI components from scratch.",
    meetingLink: "https://zoom.us/j/555666777",
    ownerId: "Ms. Thilini Jayawardena",
    scheduledAt: "2025-07-12T13:00:00",
    status: "ended",
    year: 2025,
    semester: 1,
    module: "IT1303 — Web Dev",
  },
];

const STATUS_CONFIG = {
  scheduled: { bg: "#e8f0fe", color: "#1565C0", dot: "#378add", label: "Scheduled", icon: <CalendarClock size={11} /> },
  live:      { bg: "#e6f9f0", color: "#0f6e56", dot: "#1d9e75", label: "Live Now",   icon: <Wifi size={11} /> },
  ended:     { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af", label: "Ended",      icon: <WifiOff size={11} /> },
  cancelled: { bg: "#fce8ef", color: "#993556", dot: "#d4537e", label: "Cancelled",  icon: <WifiOff size={11} /> },
};

const TABS = [
  { label: "All Meetings",  icon: <Video size={15} /> },
  { label: "Upcoming",      icon: <CalendarClock size={15} /> },
  { label: "My Meetings",   icon: <BookOpen size={15} /> },
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// ── Register Modal ────────────────────────────────────────────────────────────
function RegisterModal({ meeting, onClose }) {
  const [form, setForm] = useState({ fullName: "", email: "", description: "" });
  const [submitted, setSubmitted] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    // Here you would POST to your API:
    // POST /api/meeting-registrations
    // body: { meetingId: meeting.id, fullName, email, description, userId }
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {submitted ? (
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <h3>You're Registered!</h3>
            <p>We'll send the meeting link to <strong>{form.email}</strong> when the session starts.</p>
            <button className="btn-close-modal" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <span className="modal-module">{meeting.module}</span>
              <h3 className="modal-title">{meeting.title}</h3>
              <div className="modal-meta">
                <span><Calendar size={12} style={{ marginRight: 5 }} />{formatDate(meeting.scheduledAt)}</span>
                <span><Clock size={12} style={{ marginRight: 5 }} />{formatTime(meeting.scheduledAt)}</span>
              </div>
            </div>
            <form onSubmit={submit} className="modal-form">
              <label>Full Name <span>*</span></label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handle}
                placeholder="e.g. Kasun Perera"
                required
              />
              <label>Email Address <span>*</span></label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handle}
                placeholder="e.g. kasun@university.lk"
                required
              />
              <label>About You <span style={{ color: "#aaa", fontWeight: 400 }}>(optional)</span></label>
              <textarea
                name="description"
                value={form.description}
                onChange={handle}
                placeholder="Briefly describe your background or what you hope to learn…"
                rows={3}
              />
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-register">Register for Meeting</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ── Meeting Card ──────────────────────────────────────────────────────────────
function MeetingCard({ meeting, onRegister }) {
  const st = STATUS_CONFIG[meeting.status];
  const isLive = meeting.status === "live";
  const isEnded = meeting.status === "ended";

  return (
    <div className={`meeting-card${isLive ? " meeting-card--live" : ""}`}>
      {isLive && <div className="live-pulse-bar" />}

      <div className="meeting-card-top">
        <span className="meeting-module">{meeting.module}</span>
        <span className="status-badge" style={{ background: st.bg, color: st.color }}>
          <span className="status-dot" style={{ background: st.dot }} />
          {st.icon}
          {st.label}
        </span>
      </div>

      <div className="meeting-card-body">
        <h3 className="meeting-title">{meeting.title}</h3>
        <p className="meeting-desc">{meeting.description}</p>

        <div className="meeting-info-row">
          <span><Calendar size={12} style={{ marginRight: 5 }} />{formatDate(meeting.scheduledAt)}</span>
          <span><Clock size={12} style={{ marginRight: 5 }} />{formatTime(meeting.scheduledAt)}</span>
        </div>
        <div className="meeting-info-row" style={{ marginTop: 6 }}>
          <span><BookOpen size={12} style={{ marginRight: 5 }} />Sem {meeting.semester} · {meeting.year}</span>
          <span><Users size={12} style={{ marginRight: 5 }} />{meeting.ownerId}</span>
        </div>
      </div>

      <div className="meeting-card-actions">
        {isLive && (
          <a href={meeting.meetingLink} target="_blank" rel="noreferrer" className="btn-join-live">
            <Wifi size={13} /> Join Live
          </a>
        )}
        {!isEnded && (
          <button className="btn-register-seat" onClick={() => onRegister(meeting)}>
            Register <ChevronRight size={13} />
          </button>
        )}
        {isEnded && (
          <button className="btn-ended" disabled>Session Ended</button>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Meetings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = MEETINGS.filter((m) => {
    const matchTab =
      activeTab === 0 ? true :
      activeTab === 1 ? m.status === "scheduled" || m.status === "live" :
      true; // "My Meetings" — filter by userId later
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.module.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; }

        /* ── HERO ── */
        .meet-hero {
          position: relative;
          padding: 60px 50px 70px;
          text-align: center;
          overflow: hidden;
          min-height: 340px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .meet-hero-bg {
          position: absolute; inset: 0;
          background-image: url("../images/background2.jpg");
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        .meet-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0.10) 0%,
            rgba(255,255,255,0.30) 50%,
            rgba(255,255,255,0.55) 100%
          );
          z-index: 1;
        }

        /* ── TABS ── */
        .meet-tabs {
          display: flex; justify-content: center;
          gap: 10px; flex-wrap: wrap;
          position: relative; z-index: 2;
          margin-bottom: 28px;
        }
        .meet-tab {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 20px; border-radius: 30px;
          border: 1.5px solid rgba(21,101,192,0.25);
          cursor: pointer; font-family: 'Poppins', sans-serif;
          font-size: 0.83rem; font-weight: 600;
          background: rgba(255,255,255,0.70);
          color: #1565C0;
          backdrop-filter: blur(6px);
          transition: all 0.2s;
        }
        .meet-tab:hover {
          background: rgba(255,255,255,0.90);
          border-color: #1565C0;
          box-shadow: 0 2px 12px rgba(21,101,192,0.15);
        }
        .meet-tab.active {
          background: #1565C0; color: white;
          border-color: #1565C0;
          box-shadow: 0 4px 16px rgba(21,101,192,0.35);
        }

        /* ── HERO BIO CARD ── */
        .meet-hero-bio {
          position: relative; z-index: 2;
          max-width: 540px;
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(21,101,192,0.15);
          border-radius: 16px;
          padding: 26px 30px;
          text-align: left;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          margin-bottom: 24px;
          box-shadow: 0 4px 24px rgba(21,101,192,0.10);
        }
        .meet-hero-bio-heading {
          font-size: 1.5rem; font-weight: 800; color: #0d2257;
          margin-bottom: 10px; line-height: 1.2;
        }
        .meet-hero-bio-text {
          font-size: 0.88rem; color: #555;
          line-height: 1.7; margin: 0;
        }

        /* ── SEARCH ── */
        .meet-search-wrap {
          position: relative; z-index: 2;
          display: flex; justify-content: center;
          width: 100%;
        }
        .meet-search {
          display: flex; align-items: center; background: white;
          border-radius: 30px; padding: 10px 18px;
          box-shadow: 0 4px 20px rgba(21,101,192,0.18);
          width: 100%; max-width: 480px;
          border: 1.5px solid rgba(21,101,192,0.12);
        }
        .meet-search input {
          border: none; outline: none; flex: 1;
          font-family: 'Poppins', sans-serif; font-size: 0.88rem;
          color: #333; background: transparent;
        }

        /* ── CREATE BUTTON ── */
        .meet-create-wrap {
          width: 100%; padding: 18px 40px 0;
          display: flex; justify-content: flex-end;
        }
        .meet-create-btn {
          padding: 9px 20px;
          background: #1565C0; color: white; border: none;
          border-radius: 10px; font-family: 'Poppins', sans-serif;
          font-size: 0.82rem; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 7px;
          box-shadow: 0 3px 14px rgba(21,101,192,0.30);
          transition: all 0.2s;
        }
        .meet-create-btn:hover {
          background: #0d47a1;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(21,101,192,0.38);
        }

        /* ── SECTION HEADER ── */
        .meet-section-header {
          width: 100%; margin: 20px auto 20px;
          padding: 0 40px; display: flex; align-items: center; gap: 12px;
        }
        .meet-section-label {
          display: inline-block;
          background: #e8f0fe; color: #1565C0;
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          padding: 6px 14px; border-radius: 20px;
          white-space: nowrap;
        }
        .meet-section-line { flex: 1; height: 1px; background: #dde8f8; }

        /* ── GRID ── */
        .meetings-grid {
          width: 100%;
          padding: 0 40px 60px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 1100px) {
          .meetings-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .meet-hero { padding: 50px 24px 60px; }
          .meet-create-wrap { padding: 16px 20px 0; }
          .meet-section-header { padding: 0 20px; }
          .meetings-grid { grid-template-columns: 1fr; padding: 0 20px 40px; }
        }

        /* ── MEETING CARD ── */
        .meeting-card {
          background: white; border-radius: 14px;
          border: 1px solid #e8f0fe; overflow: hidden;
          box-shadow: 0 4px 18px rgba(21,101,192,0.07);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          display: flex; flex-direction: column;
        }
        .meeting-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(21,101,192,0.15);
        }
        .meeting-card--live {
          border-color: #1d9e75;
          box-shadow: 0 4px 20px rgba(29,158,117,0.18);
        }
        .live-pulse-bar {
          height: 3px;
          background: linear-gradient(90deg, #1d9e75, #0f6e56, #1d9e75);
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .meeting-card-top {
          padding: 14px 16px 8px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 6px;
        }
        .meeting-module {
          font-size: 0.68rem; font-weight: 700;
          color: #1565C0; background: #e8f0fe;
          padding: 3px 10px; border-radius: 20px;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .status-badge {
          font-size: 0.68rem; font-weight: 700;
          padding: 3px 10px; border-radius: 20px;
          display: flex; align-items: center; gap: 5px;
          text-transform: uppercase; letter-spacing: 0.04em;
        }
        .status-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }

        .meeting-card-body {
          padding: 6px 16px 14px;
          flex: 1;
        }
        .meeting-title {
          font-weight: 700; font-size: 0.92rem; color: #0d2257;
          line-height: 1.35; margin-bottom: 7px;
        }
        .meeting-desc {
          font-size: 0.78rem; color: #666;
          line-height: 1.55; margin-bottom: 12px;
        }
        .meeting-info-row {
          display: flex; align-items: center; gap: 14px;
          font-size: 0.72rem; color: #555; font-weight: 600;
        }
        .meeting-info-row span { display: flex; align-items: center; }

        .meeting-card-actions {
          padding: 12px 16px 16px;
          display: flex; gap: 8px; border-top: 1px solid #f0f4ff;
        }
        .btn-join-live {
          flex: 1; padding: 8px;
          background: #0f6e56; color: white;
          border: none; border-radius: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem; font-weight: 600;
          cursor: pointer; text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: background 0.18s;
        }
        .btn-join-live:hover { background: #0a5240; }
        .btn-register-seat {
          flex: 1; padding: 8px;
          background: #0d2257; color: white;
          border: none; border-radius: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 4px;
          transition: background 0.18s;
        }
        .btn-register-seat:hover { background: #1565C0; }
        .btn-ended {
          flex: 1; padding: 8px;
          background: #f3f4f6; color: #9ca3af;
          border: none; border-radius: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem; font-weight: 600;
          cursor: not-allowed;
        }

        /* ── MODAL ── */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(13,34,87,0.45);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .modal-box {
          background: white; border-radius: 18px;
          width: 100%; max-width: 440px;
          box-shadow: 0 20px 60px rgba(13,34,87,0.25);
          overflow: hidden;
        }
        .modal-header {
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          padding: 24px 26px 20px;
        }
        .modal-module {
          font-size: 0.68rem; font-weight: 700;
          background: rgba(255,255,255,0.2); color: white;
          padding: 3px 10px; border-radius: 20px;
          text-transform: uppercase; letter-spacing: 0.05em;
          display: inline-block; margin-bottom: 10px;
        }
        .modal-title {
          font-size: 1.05rem; font-weight: 700; color: white;
          line-height: 1.3; margin-bottom: 10px;
        }
        .modal-meta {
          display: flex; gap: 16px;
          font-size: 0.75rem; color: rgba(255,255,255,0.80); font-weight: 600;
        }
        .modal-meta span { display: flex; align-items: center; }

        .modal-form {
          padding: 22px 26px 24px;
          display: flex; flex-direction: column; gap: 6px;
        }
        .modal-form label {
          font-size: 0.78rem; font-weight: 700; color: #0d2257;
          margin-top: 8px;
        }
        .modal-form label span { color: #e53e3e; margin-left: 2px; }
        .modal-form input,
        .modal-form textarea {
          width: 100%; padding: 9px 13px;
          border: 1.5px solid #dde8f8; border-radius: 9px;
          font-family: 'Poppins', sans-serif; font-size: 0.83rem;
          color: #333; outline: none;
          transition: border-color 0.18s;
          resize: none;
        }
        .modal-form input:focus,
        .modal-form textarea:focus { border-color: #1565C0; }

        .modal-actions {
          display: flex; gap: 10px; margin-top: 14px;
        }
        .btn-cancel {
          flex: 1; padding: 10px;
          border: 1.5px solid #dde8f8; background: white;
          color: #555; border-radius: 9px;
          font-family: 'Poppins', sans-serif; font-size: 0.82rem;
          font-weight: 600; cursor: pointer;
          transition: all 0.18s;
        }
        .btn-cancel:hover { border-color: #1565C0; color: #1565C0; }
        .btn-register {
          flex: 2; padding: 10px;
          background: #1565C0; color: white;
          border: none; border-radius: 9px;
          font-family: 'Poppins', sans-serif; font-size: 0.82rem;
          font-weight: 700; cursor: pointer;
          transition: background 0.18s;
        }
        .btn-register:hover { background: #0d47a1; }

        /* ── SUCCESS ── */
        .modal-success {
          padding: 40px 30px;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .success-icon {
          width: 56px; height: 56px; border-radius: 50%;
          background: #e6f9f0; color: #0f6e56;
          font-size: 1.6rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 4px;
        }
        .modal-success h3 { font-size: 1.1rem; font-weight: 800; color: #0d2257; }
        .modal-success p { font-size: 0.84rem; color: #666; line-height: 1.6; }
        .btn-close-modal {
          margin-top: 8px; padding: 10px 30px;
          background: #0d2257; color: white; border: none;
          border-radius: 9px; font-family: 'Poppins', sans-serif;
          font-size: 0.84rem; font-weight: 700; cursor: pointer;
          transition: background 0.18s;
        }
        .btn-close-modal:hover { background: #1565C0; }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="meet-hero">
        <div className="meet-hero-bg" />
        <div className="meet-hero-overlay" />

        <div className="meet-tabs">
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              className={`meet-tab${activeTab === i ? " active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="meet-hero-bio">
          <h2 className="meet-hero-bio-heading">Join Live Sessions</h2>
          <p className="meet-hero-bio-text">
            Register for upcoming lectures and study sessions. Once you sign up, we'll notify you by email the moment the session goes live — so you never miss a class.
          </p>
        </div>

        <div className="meet-search-wrap">
          <div className="meet-search">
            <Search size={17} style={{ marginRight: 10, color: "#888" }} />
            <input
              type="text"
              placeholder="Search meetings, modules, topics…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* CREATE BUTTON */}
      <div className="meet-create-wrap">
    <button className="meet-create-btn" onClick={() => navigate("/Createmeeting")}>
          <Plus size={15} />
          Create Meeting
        </button>
      </div>

      {/* SECTION LABEL */}
      <div className="meet-section-header">
        <span className="meet-section-label">
          {activeTab === 0 ? "All Meetings" : activeTab === 1 ? "Upcoming Sessions" : "My Meetings"}
        </span>
        <div className="meet-section-line" />
      </div>

      {/* GRID */}
      <div className="meetings-grid">
        {filtered.map((m) => (
          <MeetingCard key={m.id} meeting={m} onRegister={setSelected} />
        ))}
      </div>

      {/* REGISTER MODAL */}
      {selected && (
        <RegisterModal meeting={selected} onClose={() => setSelected(null)} />
      )}

      <Footer />
    </div>
  );
}