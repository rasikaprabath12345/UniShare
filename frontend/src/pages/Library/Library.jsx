import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Search, Upload, Download, ThumbsUp, Clock, GraduationCap, BookOpen, Star, FolderOpen } from "lucide-react";

const NOTES = [
  {
    id: 1,
    subject: "IT1201 — Networking",
    title: "Computer Networks — OSI Model & TCP/IP",
    desc: "OSI layers, protocols, IP addressing, subnetting basics with diagrams.",
    level: "Beginner",
    year: "1st Year",
    time: "3–4 hrs",
    likes: 2341,
    downloads: 45210,
  },
  {
    id: 2,
    subject: "IT2105 — Programming",
    title: "Data Structures & Algorithms — Complete Notes",
    desc: "Arrays, linked lists, trees, sorting algorithms with Python code examples.",
    level: "Intermediate",
    year: "2nd Year",
    time: "5–6 hrs",
    likes: 4891,
    downloads: 78330,
  },
  {
    id: 3,
    subject: "IT1102 — Database",
    title: "Database Management Systems — SQL Basics",
    desc: "ER diagrams, normalization, SQL queries, joins and transactions explained simply.",
    level: "Beginner",
    year: "1st Year",
    time: "2–3 hrs",
    likes: 3102,
    downloads: 52810,
  },
  {
    id: 4,
    subject: "IT3301 — Security",
    title: "Cybersecurity Fundamentals & Ethical Hacking",
    desc: "Cryptography, network security, common vulnerabilities, CIA triad & penetration testing intro.",
    level: "Advanced",
    year: "3rd Year",
    time: "6–8 hrs",
    likes: 5677,
    downloads: 91450,
  },
  {
    id: 5,
    subject: "IT2203 — Software Eng.",
    title: "Software Engineering — SDLC & Agile Methods",
    desc: "Waterfall, Agile, Scrum, UML diagrams, design patterns & testing methodologies.",
    level: "Intermediate",
    year: "2nd Year",
    time: "4–5 hrs",
    likes: 3856,
    downloads: 63720,
  },
  {
    id: 6,
    subject: "IT1303 — Web Dev",
    title: "Web Development — HTML, CSS & JavaScript Intro",
    desc: "Semantic HTML, CSS box model, flexbox, DOM manipulation & event handling basics.",
    level: "Beginner",
    year: "1st Year",
    time: "3–4 hrs",
    likes: 6120,
    downloads: 103500,
  },
];

const LEVEL_COLORS = {
  Beginner:     { bg: "#e6f4f1", color: "#0f6e56", dot: "#1d9e75" },
  Intermediate: { bg: "#e8f0fe", color: "#1565C0", dot: "#378add" },
  Advanced:     { bg: "#fce8ef", color: "#993556", dot: "#d4537e" },
};

const TABS = [
  { label: "Notes Share", icon: <BookOpen size={15} /> },
  { label: "My Uploads",  icon: <FolderOpen size={15} /> },
  { label: "Saved",       icon: <Star size={15} /> },
];

function NoteCard({ note }) {
  const lv = LEVEL_COLORS[note.level];
  return (
    <div className="note-card">
      <div className="note-thumb">
        <div className="note-thumb-subject">{note.subject}</div>
      </div>
      <div className="note-top">
        <span className="level-badge" style={{ background: lv.bg, color: lv.color }}>
          <span className="level-dot" style={{ background: lv.dot }} />
          {note.level}
        </span>
        <span className="pdf-badge">PDF</span>
      </div>
      <div className="note-body">
        <div className="note-title">{note.title}</div>
        <div className="note-desc">{note.desc}</div>
        <div className="note-meta">
          <span><ThumbsUp size={12} style={{ marginRight: 4 }} />{note.likes.toLocaleString()}</span>
          <span><Download size={12} style={{ marginRight: 4 }} />{note.downloads.toLocaleString()}</span>
        </div>
        <div className="note-info">
          <span><Clock size={12} style={{ marginRight: 4 }} />{note.time}</span>
          <span><GraduationCap size={12} style={{ marginRight: 4 }} />{note.year}</span>
        </div>
        <div className="note-actions">
          <button className="btn-view">View</button>
          <button className="btn-download"><Download size={13} /> Download</button>
        </div>
      </div>
    </div>
  );
}

export default function Library() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; }

        /* ── HERO ── */
        .lib-hero {
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
        .lib-hero-bg {
          position: absolute; inset: 0;
          background-image: url("../images/background2.jpg");
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        /* Light white fade overlay — image shows through clearly */
        .lib-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0.10) 0%,
            rgba(255,255,255,0.30) 50%,
            rgba(255,255,255,0.55) 100%
          );
          z-index: 1;
        }

        /* ── TABS — white/light style ── */
        .lib-tabs {
          display: flex; justify-content: center;
          gap: 10px; flex-wrap: wrap;
          position: relative; z-index: 2;
          margin-bottom: 28px;
        }
        .lib-tab {
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
        .lib-tab:hover {
          background: rgba(255,255,255,0.90);
          border-color: #1565C0;
          box-shadow: 0 2px 12px rgba(21,101,192,0.15);
        }
        .lib-tab.active {
          background: #1565C0;
          color: white;
          border-color: #1565C0;
          box-shadow: 0 4px 16px rgba(21,101,192,0.35);
        }

        /* ── HERO BIO CARD ── */
        .lib-hero-bio {
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
        .lib-hero-bio-heading {
          font-size: 1.5rem; font-weight: 800; color: #0d2257;
          margin-bottom: 10px; line-height: 1.2;
        }
        .lib-hero-bio-text {
          font-size: 0.88rem; color: #555;
          line-height: 1.7; margin: 0;
        }

        /* ── SEARCH ── */
        .lib-search-wrap {
          position: relative; z-index: 2;
          display: flex; justify-content: center;
          width: 100%;
        }
        .lib-search {
          display: flex; align-items: center; background: white;
          border-radius: 30px; padding: 10px 18px;
          box-shadow: 0 4px 20px rgba(21,101,192,0.18);
          width: 100%; max-width: 480px;
          border: 1.5px solid rgba(21,101,192,0.12);
        }
        .lib-search input {
          border: none; outline: none; flex: 1;
          font-family: 'Poppins', sans-serif; font-size: 0.88rem;
          color: #333; background: transparent;
        }
        .lib-search svg { color: #888; }

        /* ── UPLOAD BUTTON ── */
        .lib-upload-wrap {
          width: 100%;
          padding: 18px 40px 0;
          display: flex;
          justify-content: flex-end;
        }
        .lib-upload-btn {
          padding: 9px 20px;
          background: #1565C0; color: white; border: none;
          border-radius: 10px; font-family: 'Poppins', sans-serif;
          font-size: 0.82rem; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 7px;
          box-shadow: 0 3px 14px rgba(21,101,192,0.30);
          transition: all 0.2s;
        }
        .lib-upload-btn:hover {
          background: #0d47a1;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(21,101,192,0.38);
        }

        /* ── SECTION HEADER ── */
        .lib-section-header {
          width: 100%; margin: 20px auto 20px;
          padding: 0 40px; display: flex; align-items: center; gap: 12px;
        }
        .lib-section-label {
          display: inline-block;
          background: #e8f0fe; color: #1565C0;
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          padding: 6px 14px; border-radius: 20px;
          white-space: nowrap;
        }
        .lib-section-line { flex: 1; height: 1px; background: #dde8f8; }

        /* ── NOTES GRID ── */
        .notes-grid {
          width: 100%;
          padding: 0 40px 60px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1100px) {
          .notes-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .lib-hero { padding: 50px 24px 60px; }
          .lib-upload-wrap { padding: 16px 20px 0; }
          .lib-section-header { padding: 0 20px; }
          .notes-grid { grid-template-columns: repeat(2, 1fr); padding: 0 20px 40px; }
        }
        @media (max-width: 480px) {
          .notes-grid { grid-template-columns: 1fr; }
        }

        /* ── NOTE CARD ── */
        .note-card {
          background: white; border-radius: 14px;
          border: 1px solid #e8f0fe; overflow: hidden;
          box-shadow: 0 4px 18px rgba(21,101,192,0.07);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .note-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(21,101,192,0.15);
        }
        .note-thumb {
          width: 100%; height: 110px;
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .note-thumb::before {
          content: '';
          position: absolute; top: -30px; right: -30px;
          width: 120px; height: 120px; border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }
        .note-thumb::after {
          content: '';
          position: absolute; bottom: -20px; left: -20px;
          width: 90px; height: 90px; border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .note-thumb-subject {
          font-size: 0.72rem; font-weight: 700;
          color: rgba(255,255,255,0.75);
          text-transform: uppercase; letter-spacing: 1px;
          position: relative; z-index: 1;
        }
        .note-top {
          padding: 10px 14px 6px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .level-badge {
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.04em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 20px;
          display: flex; align-items: center; gap: 6px;
        }
        .level-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .pdf-badge {
          font-size: 0.65rem; font-weight: 600;
          background: #f4f7ff; color: #0d2257;
          border: 1px solid #e8f0fe; border-radius: 6px;
          padding: 3px 8px;
        }
        .note-body { padding: 10px 14px 14px; }
        .note-title {
          font-weight: 700; font-size: 0.9rem; color: #0d2257;
          line-height: 1.35; margin-bottom: 6px;
        }
        .note-desc {
          font-size: 0.78rem; color: #666;
          line-height: 1.5; margin-bottom: 10px;
        }
        .note-meta {
          display: flex; align-items: center; gap: 14px;
          font-size: 0.72rem; color: #888; margin-bottom: 8px;
        }
        .note-meta span { display: flex; align-items: center; }
        .note-info {
          display: flex; align-items: center; gap: 14px;
          font-size: 0.73rem; color: #0d2257; font-weight: 600;
          margin-bottom: 14px;
        }
        .note-info span { display: flex; align-items: center; }
        .note-actions { display: flex; gap: 8px; }
        .btn-view {
          flex: 1; padding: 8px;
          border: 1.5px solid #1565C0; background: transparent;
          color: #1565C0; border-radius: 8px;
          font-family: 'Poppins', sans-serif; font-size: 0.78rem;
          font-weight: 600; cursor: pointer; transition: all 0.18s;
          text-align: center;
        }
        .btn-view:hover { background: #1565C0; color: white; }
        .btn-download {
          flex: 1; padding: 8px;
          border: none; background: #0d2257; color: white;
          border-radius: 8px; font-family: 'Poppins', sans-serif;
          font-size: 0.78rem; font-weight: 600; cursor: pointer;
          transition: all 0.18s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .btn-download:hover { background: #1565C0; }
      `}</style>

      <Navbar />

      {/* HERO with background image */}
      <section className="lib-hero">
        <div className="lib-hero-bg" />
        <div className="lib-hero-overlay" />

        {/* Tabs */}
        <div className="lib-tabs">
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              className={`lib-tab${activeTab === i ? " active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Bio card */}
        <div className="lib-hero-bio">
          <h2 className="lib-hero-bio-heading">Share your Knowledge</h2>
          <p className="lib-hero-bio-text">
            Got notes that helped you ace your exams? Upload them and help hundreds of juniors across Sri Lanka. Every resource you share builds a stronger university community — and earns you recognition among your peers.
          </p>
        </div>

        {/* Search */}
        <div className="lib-search-wrap">
          <div className="lib-search">
            <Search size={17} style={{ marginRight: 10, color: "#888" }} />
            <input type="text" placeholder="Search notes, subjects, topics…" />
          </div>
        </div>
      </section>

      {/* UPLOAD BUTTON — below hero, small, right-aligned */}
      <div className="lib-upload-wrap">
        <button className="lib-upload-btn">
          <Upload size={15} />
          Upload Notes PDF
        </button>
      </div>

      {/* SECTION LABEL */}
      <div className="lib-section-header">
        <span className="lib-section-label">Featured Notes</span>
        <div className="lib-section-line" />
      </div>

      {/* NOTES GRID */}
      <div className="notes-grid">
        {NOTES.map(note => <NoteCard key={note.id} note={note} />)}
      </div>

      <Footer />
    </div>
  );
}