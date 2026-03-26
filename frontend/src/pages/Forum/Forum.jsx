import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Search,
  Plus,
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  Pin,
  Tag,
  ChevronRight,
  Flame,
  BookOpen,
  Star,
  TrendingUp,
  Filter,
} from "lucide-react";
import "./Forum.css";

// ── Category config (mirrors Module colour approach) ──────────────────────────
const CATEGORY_CONFIG = {
  "Database":        { color: "#1a3a6e", bg: "#e6eaf6", accent: "#378add" },
  "Networking":      { color: "#0d4f3c", bg: "#e6f4f1", accent: "#1d9e75" },
  "Programming":     { color: "#4a1f6e", bg: "#efe8f6", accent: "#7f77dd" },
  "Security":        { color: "#6e1f1f", bg: "#f6e8e8", accent: "#d4537e" },
  "Data Structures": { color: "#1f4a6e", bg: "#e8f0f6", accent: "#378add" },
  "Machine Learning":{ color: "#1f6e5a", bg: "#e8f6f2", accent: "#1d9e75" },
  "General":         { color: "#4a3f1a", bg: "#f6f2e8", accent: "#ba7517" },
};

const CATEGORY_ICONS = {
  "Database":         "🗄️",
  "Networking":       "🌐",
  "Programming":      "💻",
  "Security":         "🔐",
  "Data Structures":  "🌳",
  "Machine Learning": "🤖",
  "General":          "💬",
};

const TABS = [
  { label: "Discussions", icon: <MessageSquare size={15} /> },
  { label: "My Posts",    icon: <BookOpen size={15} /> },
  { label: "Saved",       icon: <Star size={15} /> },
];

const SORT_OPTIONS = [
  { label: "Latest",   value: "latest",   icon: <Clock size={13} /> },
  { label: "Popular",  value: "popular",  icon: <Flame size={13} /> },
  { label: "Trending", value: "trending", icon: <TrendingUp size={13} /> },
];

// ── Skeleton placeholder ──────────────────────────────────────────────────────
function SkeletonThread() {
  return (
    <div className="skeleton-thread">
      <div className="skeleton-thread-left">
        <div className="skeleton sk-avatar" />
      </div>
      <div className="skeleton-thread-body">
        <div className="skeleton sk-line short" />
        <div className="skeleton sk-line full" />
        <div className="skeleton sk-line medium" />
        <div className="skeleton sk-line tiny" />
      </div>
    </div>
  );
}

// ── Thread card ───────────────────────────────────────────────────────────────
function ThreadCard({ thread }) {
  const cfg = CATEGORY_CONFIG[thread.category] || CATEGORY_CONFIG["General"];
  const icon = CATEGORY_ICONS[thread.category] || "💬";

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className={`thread-card${thread.pinned ? " thread-pinned" : ""}`}>
      {thread.pinned && (
        <div className="pin-stripe">
          <Pin size={11} /> Pinned
        </div>
      )}

      <div className="thread-inner">
        {/* Avatar */}
        <div
          className="thread-avatar"
          style={{ background: cfg.color }}
        >
          {(thread.authorName || "U")[0].toUpperCase()}
        </div>

        {/* Content */}
        <div className="thread-content">
          <div className="thread-top-row">
            <span
              className="thread-category"
              style={{
                background: cfg.bg,
                color: cfg.color,
                borderColor: cfg.accent + "44",
              }}
            >
              <span style={{ marginRight: 4 }}>{icon}</span>
              {thread.category}
            </span>

            {thread.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="thread-tag">
                <Tag size={10} style={{ marginRight: 3 }} />{tag}
              </span>
            ))}

            <span className="thread-time">
              <Clock size={11} style={{ marginRight: 3 }} />
              {timeAgo(thread.createdAt)}
            </span>
          </div>

          <div className="thread-title">{thread.title}</div>
          <div className="thread-excerpt">{thread.body}</div>

          <div className="thread-footer">
            <div className="thread-author">
              <span className="author-name">{thread.authorName || "Anonymous"}</span>
              {thread.authorYear && (
                <span className="author-year">{thread.authorYear}</span>
              )}
            </div>

            <div className="thread-stats">
              <span className="stat">
                <ThumbsUp size={12} />
                {thread.likes ?? 0}
              </span>
              <span className="stat">
                <MessageSquare size={12} />
                {thread.replies ?? 0}
              </span>
              <span className="stat">
                <Eye size={12} />
                {thread.views ?? 0}
              </span>
            </div>

            <button
              className="btn-thread-view"
              onClick={() => window.location.href = `/forum/${thread._id}`}
            >
              Read more <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Category sidebar pill ─────────────────────────────────────────────────────
function CategoryPill({ label, count, active, onClick }) {
  const cfg = CATEGORY_CONFIG[label] || CATEGORY_CONFIG["General"];
  const icon = CATEGORY_ICONS[label] || "💬";
  return (
    <button
      className={`cat-pill${active ? " active" : ""}`}
      style={active ? { background: cfg.bg, borderColor: cfg.accent, color: cfg.color } : {}}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span className="cat-pill-label">{label}</span>
      {count != null && <span className="cat-pill-count">{count}</span>}
    </button>
  );
}

// ── New Post Modal ────────────────────────────────────────────────────────────
function NewPostModal({ onClose, onSubmit }) {
  const [title, setTitle]       = useState("");
  const [body, setBody]         = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags]         = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ title, body, category, tags: tags.split(",").map(t => t.trim()).filter(Boolean) });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-inner">
        <div className="modal-header">
          <h2 className="modal-title">Start a discussion</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <label className="form-label">Category</label>
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
            {Object.keys(CATEGORY_CONFIG).map(c => (
              <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
            ))}
          </select>

          <label className="form-label" style={{ marginTop: "1rem" }}>Title</label>
          <input
            className="form-input"
            type="text"
            placeholder="What's your question or topic?"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <label className="form-label" style={{ marginTop: "1rem" }}>Description</label>
          <textarea
            className="form-textarea"
            placeholder="Describe your question in detail…"
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={5}
          />

          <label className="form-label" style={{ marginTop: "1rem" }}>Tags <span className="form-hint">(comma separated)</span></label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. SQL, joins, indexing"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-post"
            onClick={handleSubmit}
            disabled={!title.trim() || !body.trim() || submitting}
          >
            {submitting ? "Posting…" : "Post discussion"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Forum page ───────────────────────────────────────────────────────────
export default function Forum() {
  const [activeTab,    setActiveTab]    = useState(0);
  const [showModal,    setShowModal]    = useState(false);
  const [threads,      setThreads]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [query,        setQuery]        = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort,   setActiveSort]   = useState("latest");
  const [categoryCounts, setCategoryCounts] = useState({});

  const fetchThreads = async (searchTerm = "", category = "All", sort = "latest") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 20, sort });
      if (searchTerm) params.append("search", searchTerm);
      if (category !== "All") params.append("category", category);

      const res  = await fetch(`http://localhost:8000/forum?${params}`);
      const data = await res.json();
      setThreads(data.success ? data.data : []);
      if (data.categoryCounts) setCategoryCounts(data.categoryCounts);
    } catch (err) {
      console.error("Failed to fetch threads:", err);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchThreads(); }, []);

  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetchThreads(query, activeCategory, activeSort);
  }, [query, activeCategory, activeSort]);

  const handleNewPost = async (postData) => {
    await fetch("http://localhost:8000/forum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    fetchThreads(query, activeCategory, activeSort);
  };

  const allCategories = ["All", ...Object.keys(CATEGORY_CONFIG)];

  return (
    <div>
      <Navbar />

      {showModal && (
        <NewPostModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewPost}
        />
      )}

      {/* ── HERO (mirrors lib-hero) ── */}
      <section className="forum-hero">
        <div className="forum-hero-bg" />
        <div className="forum-hero-overlay" />

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
          <h2 className="lib-hero-bio-heading">Ask. Discuss. Grow.</h2>
          <p className="lib-hero-bio-text">
            Got a question that's been bugging you? Start a thread and tap into the
            collective knowledge of your peers. Every answer you give helps someone
            else clear their path — and builds yours.
          </p>
        </div>

        <div className="lib-search-wrap">
          <div className="lib-search">
            <Search size={17} style={{ marginRight: 10, color: "#888" }} />
            <input
              type="text"
              placeholder="Search discussions, topics, questions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── NEW THREAD BUTTON ── */}
      <div className="lib-upload-wrap">
        <button className="lib-upload-btn" onClick={() => setShowModal(true)}>
          <Plus size={15} />
          New Discussion
        </button>
      </div>

      {/* ── SECTION LABEL ── */}
      <div className="lib-section-header">
        <span className="lib-section-label">Community Discussions</span>
        <div className="lib-section-line" />
      </div>

      {/* ── LAYOUT: sidebar + feed ── */}
      <div className="forum-layout">

        {/* Sidebar */}
        <aside className="forum-sidebar">
          <div className="sidebar-block">
            <div className="sidebar-title">
              <Filter size={13} style={{ marginRight: 6 }} /> Categories
            </div>
            <div className="cat-pill-list">
              {allCategories.map(cat => (
                <CategoryPill
                  key={cat}
                  label={cat}
                  count={cat === "All" ? undefined : categoryCounts[cat]}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </div>
          </div>

          <div className="sidebar-block" style={{ marginTop: "1.25rem" }}>
            <div class="sidebar-title">Sort by</div>
            <div className="sort-list">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`sort-btn${activeSort === opt.value ? " active" : ""}`}
                  onClick={() => setActiveSort(opt.value)}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Thread feed */}
        <main className="forum-feed">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonThread key={i} />)
          ) : threads.length === 0 ? (
            <div className="lib-empty">
              <div className="lib-empty-icon">💬</div>
              <div className="lib-empty-text">No discussions found</div>
              <div className="lib-empty-sub">
                {query
                  ? `No results for "${query}" — try a different search.`
                  : "Be the first to start a discussion!"}
              </div>
            </div>
          ) : (
            threads.map((thread) => (
              <ThreadCard key={thread._id} thread={thread} />
            ))
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}