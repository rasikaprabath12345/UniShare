import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Search, Upload, Download, ThumbsUp, Clock, GraduationCap, BookOpen, Star, FolderOpen } from "lucide-react";
import UploadNotes from "./UploadPdf";
import "./Library.css";

// ── Auto-select thumbnail image per module code ──────────────────────────────
const MODULE_IMAGE = {
  "IT1102 — Database":        "../images/image3.png",
  "IT1201 — Networking":      "../images/image1.jpg",
  "IT2105 — Programming":     "../images/image2.png",
  "IT3301 — Security":        "../images/image4.png",
  "IT2204 — Data Structures": "../images/image2.png",
  "IT3402 — Machine Learning":"../images/image5.png",
};

// Fallback gradient colours when no image match found
const MODULE_FALLBACK_COLOR = {
  "IT1102 — Database":        "#1a3a6e",
  "IT1201 — Networking":      "#0d4f3c",
  "IT2105 — Programming":     "#4a1f6e",
  "IT3301 — Security":        "#6e1f1f",
  "IT2204 — Data Structures": "#1f4a6e",
  "IT3402 — Machine Learning":"#1f6e5a",
};

// Derive difficulty level from academic year string
const yearToLevel = (year = "") => {
  if (year.startsWith("Year 1")) return "Beginner";
  if (year.startsWith("Year 2")) return "Intermediate";
  return "Advanced";
};

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

// ── Skeleton placeholder card ─────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-thumb" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line full" />
        <div className="skeleton skeleton-line medium" />
        <div className="skeleton skeleton-line short" />
      </div>
    </div>
  );
}

// ── Single note card ──────────────────────────────────────────────────────────
function NoteCard({ note }) {
  const level   = yearToLevel(note.year);
  const lv      = LEVEL_COLORS[level];
  const image   = MODULE_IMAGE[note.module];
  const bgColor = MODULE_FALLBACK_COLOR[note.module] || "#0d2257";

  return (
    <div className="note-card">
      <div
        className="note-thumb"
        style={{
          backgroundImage: image ? `url("${image}")` : "none",
          backgroundColor: bgColor,
        }}
      >
        <div className="note-thumb-overlay" />
        <div className="note-thumb-subject">{note.module}</div>
      </div>

      <div className="note-top">
        <span className="level-badge" style={{ background: lv.bg, color: lv.color }}>
          <span className="level-dot" style={{ background: lv.dot }} />
          {level}
        </span>
        <span className="pdf-badge">PDF</span>
      </div>

      <div className="note-body">
        <div className="note-title">{note.title}</div>
        <div className="note-desc">{note.description}</div>

        <div className="note-meta">
          <span>
            <ThumbsUp size={12} style={{ marginRight: 4 }} />
            {note.likes ?? 0}
          </span>
          <span>
            <Download size={12} style={{ marginRight: 4 }} />
            {note.downloads ?? 0}
          </span>
        </div>

        <div className="note-info">
          <span>
            <Clock size={12} style={{ marginRight: 4 }} />
            {note.fileSize ? `${(note.fileSize / 1024 / 1024).toFixed(1)} MB` : "—"}
          </span>
          <span>
            <GraduationCap size={12} style={{ marginRight: 4 }} />
            {note.year}
          </span>
        </div>

        <div className="note-actions">
          <button
            className="btn-view"
            onClick={() => window.open(note.fileUrl, "_blank")}
          >
            View
          </button>
          <a
            className="btn-download"
            href={note.fileUrl}
            download={note.fileName || "notes.pdf"}
            target="_blank"
            rel="noreferrer"
          >
            <Download size={13} /> Download
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main Library page ─────────────────────────────────────────────────────────
export default function Library() {
  const [activeTab,  setActiveTab]  = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [notes,      setNotes]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [query,      setQuery]      = useState("");   // debounced search term

  // Fetch notes from backend
  const fetchNotes = async (searchTerm = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 20 });
      if (searchTerm) params.append("search", searchTerm);

      const res  = await fetch(`http://localhost:8000/Materials?${params}`);
      const data = await res.json();
      setNotes(data.success ? data.data : []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNotes();
  }, []);

  // Debounce search input (400 ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Re-fetch whenever debounced query changes
  useEffect(() => {
    fetchNotes(query);
  }, [query]);

  // Re-fetch after a successful upload so new card appears immediately
  const handleUploadClose = () => {
    setShowUpload(false);
    fetchNotes(query);
  };

  return (
    <div>
      <Navbar />

      {/* ── UPLOAD MODAL ── */}
      {showUpload && (
        <div
          className="upload-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleUploadClose();
          }}
        >
          <div className="upload-modal-inner">
            <UploadNotes onClose={handleUploadClose} />
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="lib-hero">
        <div className="lib-hero-bg" />
        <div className="lib-hero-overlay" />

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

        <div className="lib-hero-bio">
          <h2 className="lib-hero-bio-heading">Share your Knowledge</h2>
          <p className="lib-hero-bio-text">
            Got notes that helped you ace your exams? Upload them and help hundreds of juniors
            across Sri Lanka. Every resource you share builds a stronger university community —
            and earns you recognition among your peers.
          </p>
        </div>

        <div className="lib-search-wrap">
          <div className="lib-search">
            <Search size={17} style={{ marginRight: 10, color: "#888" }} />
            <input
              type="text"
              placeholder="Search notes, subjects, topics…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── UPLOAD BUTTON ── */}
      <div className="lib-upload-wrap">
        <button className="lib-upload-btn" onClick={() => setShowUpload(true)}>
          <Upload size={15} />
          Upload Notes PDF
        </button>
      </div>

      {/* ── SECTION LABEL ── */}
      <div className="lib-section-header">
        <span className="lib-section-label">Featured Notes</span>
        <div className="lib-section-line" />
      </div>

      {/* ── NOTES GRID ── */}
      <div className="notes-grid">
        {loading ? (
          // Show 8 skeleton cards while loading
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : notes.length === 0 ? (
          <div className="lib-empty">
            <div className="lib-empty-icon">📂</div>
            <div className="lib-empty-text">No notes found</div>
            <div className="lib-empty-sub">
              {query ? `No results for "${query}" — try a different search.` : "Be the first to upload notes!"}
            </div>
          </div>
        ) : (
          notes.map((note) => <NoteCard key={note._id} note={note} />)
        )}
      </div>

      <Footer />
    </div>
  );
}