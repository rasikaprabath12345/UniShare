import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Search, Upload, Download, ThumbsUp, Clock, GraduationCap,
  Globe, Lock, Heart, Eye, Trash2, BookOpen, User,
  CheckCircle, X
} from "lucide-react";
import UploadNotes from "./UploadPdf";
import "./Library.css";

const API = "http://localhost:8000";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};


// ── Liked-set helpers (per-user localStorage cache) ──────────────────────────
const getLikedSet = (userId) => {
  if (!userId) return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(`liked_${userId}`) || "[]")); }
  catch { return new Set(); }
};
const saveLikedSet = (userId, set) => {
  if (!userId) return;
  localStorage.setItem(`liked_${userId}`, JSON.stringify([...set]));
};

// ── Module colours / icons ────────────────────────────────────────────────────
const MODULE_IMAGE = {
  "IT1102 — Database":         "../images/image3.png",
  "IT1201 — Networking":       "../images/image1.jpg",
  "IT2105 — Programming":      "../images/image2.png",
  "IT3301 — Security":         "../images/image4.png",
  "IT2204 — Data Structures":  "../images/image2.png",
  "IT3402 — Machine Learning": "../images/image5.png",
};
const MODULE_FALLBACK_COLOR = {
  "IT1102 — Database":         "#1a3a6e",
  "IT1201 — Networking":       "#0d4f3c",
  "IT2105 — Programming":      "#4a1f6e",
  "IT3301 — Security":         "#6e1f1f",
  "IT2204 — Data Structures":  "#1f4a6e",
  "IT3402 — Machine Learning": "#1f6e5a",
};

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

const YEAR_FILTERS = [
  { label: "All",    value: null },
  { label: "Year 1", value: "Year 1" },
  { label: "Year 2", value: "Year 2" },
  { label: "Year 3", value: "Year 3" },
];

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`lib-toast lib-toast-${type}`}>
      {type === "success" ? <CheckCircle size={15} /> : <X size={15} />}
      <span>{message}</span>
      <button onClick={onClose} className="lib-toast-close">
        <X size={12} />
      </button>
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
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
function NoteCard({ note, userId, likedSet, onLikeToggle, onDownload, onDelete }) {
  const level    = yearToLevel(note.year);
  const lv       = LEVEL_COLORS[level];
  const image    = MODULE_IMAGE[note.module];
  const bgColor  = MODULE_FALLBACK_COLOR[note.module] || "#0d2257";
  const isLiked  = likedSet.has(note._id);

  const noteOwnerId = String(note.user?._id ?? note.user ?? "");
  const isOwner     = !!userId && noteOwnerId === String(userId);
  const isPrivate   = note.visibility === "private";

  return (
    <div className={`note-card${isPrivate ? " note-card-private" : ""}`}>
      {/* Thumbnail */}
      <div
        className="note-thumb"
        style={{
          backgroundImage: image ? `url("${image}")` : "none",
          backgroundColor: bgColor,
        }}
      >
        <div className="note-thumb-overlay" />
        <div className="note-thumb-subject">{note.module}</div>

        {/* Visibility badge */}
        <div className={`note-visibility-badge ${isPrivate ? "private" : "public"}`}>
          {isPrivate ? <Lock size={10} /> : <Globe size={10} />}
          <span>{isPrivate ? "Private" : "Public"}</span>
        </div>

        {/* Owner: delete button */}
        {isOwner && (
          <button
            className="note-delete-btn"
            title="Delete"
            onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Top row: level + pdf badge */}
      <div className="note-top">
        <span className="level-badge" style={{ background: lv.bg, color: lv.color }}>
          <span className="level-dot" style={{ background: lv.dot }} />
          {level}
        </span>
        <span className="pdf-badge">PDF</span>
      </div>

      {/* Body */}
      <div className="note-body">
        <div className="note-title">{note.title}</div>
        <div className="note-desc">{note.description}</div>

        {/* Stats row */}
        <div className="note-stats-row">
          <button
            className={`note-like-btn${isLiked ? " liked" : ""}`}
            onClick={() => onLikeToggle(note._id, isLiked)}
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart size={13} className="like-icon" />
            <span>{note.likes ?? 0}</span>
          </button>

          <span className="note-stat">
            <Download size={12} />
            {note.downloads ?? 0}
          </span>
        </div>

        {/* Info */}
        <div className="note-info">
          <span>
            <Clock size={12} />
            {note.fileSize
              ? `${(note.fileSize / 1024 / 1024).toFixed(1)} MB`
              : "—"}
          </span>
          <span>
            <GraduationCap size={12} />
            {note.year}
          </span>
        </div>

        {/* Actions */}
        <div className="note-actions">
          <button className="btn-view" onClick={() => window.open(note.fileUrl, "_blank")}>
            <Eye size={13} /> View
          </button>
          <a
            className="btn-download"
            href={note.fileUrl}
            download={note.fileName || "notes.pdf"}
            target="_blank"
            rel="noreferrer"
            onClick={() => onDownload(note._id)}
          >
            <Download size={13} /> Download
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirmation modal ─────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel, title }) {
  return (
    <div className="lib-delete-overlay" onClick={onCancel}>
      <div className="lib-delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lib-delete-icon"><Trash2 size={24} /></div>
        <div className="lib-delete-title">Delete Material?</div>
        <div className="lib-delete-sub">
          "<strong>{title}</strong>" will be permanently removed.
        </div>
        <div className="lib-delete-actions">
          <button className="lib-delete-cancel" onClick={onCancel}>Cancel</button>
          <button className="lib-delete-confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Library page ─────────────────────────────────────────────────────────
export default function Library() {
  const [user]   = useState(() => getUser());
  const userId   = user?._id || user?.id || null;

  const [yearFilter,       setYearFilter]       = useState(null);
  const [visibilityFilter, setVisibilityFilter] = useState(null); // null | "public" | "private"
  const [activeTab,        setActiveTab]        = useState("all"); // "all" | "mine"
  const [showUpload,       setShowUpload]       = useState(false);
  const [notes,            setNotes]            = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [search,           setSearch]           = useState("");
  const [query,            setQuery]            = useState("");
  const [likedSet,         setLikedSet]         = useState(() => getLikedSet(userId));
  const [toast,            setToast]            = useState(null);
  const [deleteTarget,     setDeleteTarget]     = useState(null); // { id, title }
  const [stats,            setStats]            = useState({ total: 0, public: 0, private: 0 });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  // ── Fetch helpers ────────────────────────────────────────────────────────
  const fetchAllNotes = useCallback(async (searchTerm = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 40 });
      if (searchTerm) params.append("search", searchTerm);
      if (userId) params.append("userId", userId);

      const res  = await fetch(`${API}/Materials?${params}`);
      const data = await res.json();
      const list = data.success ? data.data : [];

      setNotes(list);
      setStats({
        total:   list.length,
        public:  list.filter((n) => n.visibility === "public").length,
        private: list.filter((n) => n.visibility === "private").length,
      });
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchMyNotes = useCallback(async () => {
    if (!userId) {
      showToast("Please log in to see your notes.", "error");
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/Materials/my/${userId}`);
      const data = await res.json();
      setNotes(data.success ? data.data : []);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [userId, showToast]);

  // Initial load
  useEffect(() => { fetchAllNotes(); }, [fetchAllNotes]);

  // Debounce search input → query
  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Re-fetch whenever query or active tab changes
  useEffect(() => {
    if (activeTab === "all") fetchAllNotes(query);
    else                     fetchMyNotes();
  }, [query, activeTab, fetchAllNotes, fetchMyNotes]);

  // ── Like toggle ──────────────────────────────────────────────────────────
  const handleLikeToggle = useCallback(
    async (materialId, currentlyLiked) => {
      if (!userId) {
        showToast("Log in to like materials.", "error");
        return;
      }

      setNotes((prev) =>
        prev.map((n) =>
          n._id === materialId
            ? { ...n, likes: Math.max(0, (n.likes || 0) + (currentlyLiked ? -1 : 1)) }
            : n
        )
      );
      const newSet = new Set(likedSet);
      currentlyLiked ? newSet.delete(materialId) : newSet.add(materialId);
      setLikedSet(newSet);
      saveLikedSet(userId, newSet);

      try {
        const res = await fetch(`${API}/Materials/${materialId}/like`, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ userId }),
        });
        if (!res.ok) throw new Error("Like request failed");
      } catch {
        const revert = new Set(likedSet);
        setLikedSet(revert);
        saveLikedSet(userId, revert);
        setNotes((prev) =>
          prev.map((n) =>
            n._id === materialId
              ? { ...n, likes: Math.max(0, (n.likes || 0) + (currentlyLiked ? 1 : -1)) }
              : n
          )
        );
        showToast("Could not update like. Try again.", "error");
      }
    },
    [userId, likedSet, showToast]
  );

  // ── Download count ───────────────────────────────────────────────────────
  const handleDownload = useCallback(async (materialId) => {
    setNotes((prev) =>
      prev.map((n) =>
        n._id === materialId ? { ...n, downloads: (n.downloads || 0) + 1 } : n
      )
    );
    try {
      await fetch(`${API}/Materials/${materialId}/download`, { method: "PATCH" });
    } catch { /* non-critical */ }
  }, []);

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      const res  = await fetch(`${API}/Materials/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setNotes((prev) => prev.filter((n) => n._id !== deleteTarget.id));
      showToast("Material deleted successfully.");
    } catch (e) {
      showToast(e.message || "Delete failed.", "error");
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, showToast]);

  // ── Upload close (refreshes list) ───────────────────────────────────────
  const handleUploadClose = useCallback(() => {
    setShowUpload(false);
    if (activeTab === "all") fetchAllNotes(query);
    else                     fetchMyNotes();
  }, [activeTab, query, fetchAllNotes, fetchMyNotes]);

  // ── Client-side filters: year + visibility ──────────────────────────────
  const isOwn = (n) =>
    !!userId && String(n.user?._id ?? n.user ?? "") === String(userId);

  const filteredNotes = notes.filter((n) => {
    const yearOk = !yearFilter || n.year?.startsWith(yearFilter);

    let visOk;
    if (visibilityFilter === "public") {
      visOk = n.visibility === "public";
    } else if (visibilityFilter === "private") {
      visOk = n.visibility === "private" && isOwn(n);
    } else {
      visOk = n.visibility === "public" || isOwn(n);
    }

    return yearOk && visOk;
  });

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div>
      <Navbar />

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* UPLOAD MODAL */}
      {showUpload && (
        <div
          className="upload-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) handleUploadClose(); }}
        >
          <div className="upload-modal-inner">
            <UploadNotes
              onClose={handleUploadClose}
              userId={userId}
              isPublic={true}
            />
          </div>
        </div>
      )}

      {/* HERO — Home-page style, left-aligned */}
      <section className="lib-hero">
        <div className="lib-hero-bg" />
        <div className="lib-hero-overlay" />

        <div className="lib-hero-content">
          {/* Stats chips — click to filter */}
          <div className="lib-hero-chips">
            <div
              className={`lib-hero-chip lib-hero-chip-btn${!visibilityFilter ? " chip-active" : ""}`}
              onClick={() => setVisibilityFilter(null)}
            >
              <BookOpen size={14} />
              <span><strong>{stats.total}</strong> Materials</span>
            </div>
            <div
              className={`lib-hero-chip lib-hero-chip-btn${visibilityFilter === "public" ? " chip-active" : ""}`}
              onClick={() => setVisibilityFilter(v => v === "public" ? null : "public")}
            >
              <Globe size={14} />
              <span><strong>{stats.public}</strong> Public</span>
            </div>
            <div
              className={`lib-hero-chip lib-hero-chip-private lib-hero-chip-btn${visibilityFilter === "private" ? " chip-active" : ""}`}
              onClick={() => setVisibilityFilter(v => v === "private" ? null : "private")}
            >
              <Lock size={14} />
              <span><strong>{stats.private}</strong> Private</span>
            </div>
          </div>

          {/* Bio card */}
          <h1 className="lib-hero-heading">Share your Knowledge</h1>
          <p className="lib-hero-bio-text">
            Got notes that helped you ace your exams? Upload them and help hundreds of juniors
            across Sri Lanka. Every resource you share builds a stronger university community —
            and earns you recognition among your peers.
          </p>

          {/* Search bar */}
          <div className="lib-search">
            <Search size={17} className="lib-search-icon" />
            <input
              type="text"
              placeholder="Search notes, subjects, topics…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="lib-search-clear" onClick={() => setSearch("")}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CONTROLS BAR */}
      <div className="lib-controls-bar">
        <div className="lib-controls-left">
          {/* Tab switcher */}
          <div className="lib-tabs">
            <button
              className={`lib-tab${activeTab === "all" ? " active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <Globe size={13} /> All Notes
            </button>
            <button
              className={`lib-tab${activeTab === "mine" ? " active" : ""}`}
              onClick={() => setActiveTab("mine")}
            >
              <User size={13} /> My Notes
            </button>
          </div>

          {/* Year filters */}
          <div className="lib-year-filters">
            {YEAR_FILTERS.map((f) => (
              <button
                key={f.label}
                className={`lib-year-btn${yearFilter === f.value ? " active" : ""}`}
                onClick={() => setYearFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Visibility filter (styled like upload-as) + Upload button */}
        <div className="lib-controls-right">
          <div className="lib-visibility-picker">
            <span className="lib-visibility-label">Filter:</span>
            <button
              className={`lib-vis-btn${!visibilityFilter ? " active" : ""}`}
              onClick={() => setVisibilityFilter(null)}
            >
              All
            </button>
            <button
              className={`lib-vis-btn${visibilityFilter === "public" ? " active" : ""}`}
              onClick={() => setVisibilityFilter(v => v === "public" ? null : "public")}
            >
              <Globe size={13} /> Public
            </button>
            <button
              className={`lib-vis-btn${visibilityFilter === "private" ? " active" : ""}`}
              onClick={() => setVisibilityFilter(v => v === "private" ? null : "private")}
            >
              <Lock size={13} /> Private
            </button>
          </div>

          <button className="lib-upload-btn" onClick={() => setShowUpload(true)}>
            <Upload size={15} />
            Upload PDF
          </button>
        </div>
      </div>

      {/* SECTION LABEL */}
      <div className="lib-section-header">
        <span className="lib-section-label">
          {activeTab === "mine"
            ? "My Uploads"
            : visibilityFilter === "public"
            ? yearFilter ? `${yearFilter} · Public` : "Public Notes"
            : visibilityFilter === "private"
            ? yearFilter ? `${yearFilter} · Private` : "Private Notes"
            : yearFilter
            ? `${yearFilter} Notes`
            : "Featured Notes"}
        </span>
        {filteredNotes.length > 0 && (
          <span className="lib-section-count">{filteredNotes.length} results</span>
        )}
        <div className="lib-section-line" />
      </div>

      {/* NOTES GRID */}
      <div className="notes-grid">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filteredNotes.length === 0 ? (
          <div className="lib-empty">
            <div className="lib-empty-icon">
              {activeTab === "mine" ? "📁" : "📂"}
            </div>
            <div className="lib-empty-text">
              {activeTab === "mine" ? "No uploads yet" : "No notes found"}
            </div>
            <div className="lib-empty-sub">
              {activeTab === "mine"
                ? "Upload your first PDF to see it here."
                : query
                ? `No results for "${query}" — try a different search.`
                : visibilityFilter === "private"
                ? "No private notes found. Upload one or log in to see yours."
                : visibilityFilter === "public"
                ? "No public notes found yet."
                : yearFilter
                ? `No notes for ${yearFilter} yet.`
                : "Be the first to upload notes!"}
            </div>
          </div>
        ) : (
          filteredNotes.map((note, i) => (
            <NoteCard
              key={note._id}
              note={note}
              userId={userId}
              likedSet={likedSet}
              onLikeToggle={handleLikeToggle}
              onDownload={handleDownload}
              onDelete={(id) => setDeleteTarget({ id, title: note.title })}
              style={{ animationDelay: `${i * 0.04}s` }}
            />
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}