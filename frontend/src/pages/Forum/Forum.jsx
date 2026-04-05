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
  Edit,
  Trash2,
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
function ThreadCard({ thread, onReaction, onDelete, onEdit }) {
  const cfg = CATEGORY_CONFIG[thread.category] || CATEGORY_CONFIG["General"];
  const icon = CATEGORY_ICONS[thread.category] || "💬";

  // Mock user data - replace with actual user context
  const currentUser = {
    id: "user123",
    name: "John Doe",
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const handleReaction = async (e) => {
    e.stopPropagation();
    console.log("Like button clicked for thread:", thread._id);
    await onReaction(thread._id, currentUser.id, currentUser.name);
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    window.location.href = `/forum/${thread._id}#comments`;
  };

  const userHasReacted = thread.reactions?.some(r => r.userId === currentUser.id) || false;
  const likesCount = thread.reactions?.length || thread.likes || 0;
  const repliesCount = thread.comments?.length || thread.replies || 0;

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
              <button
                className={`stat stat-btn${userHasReacted ? " active" : ""}`}
                onClick={handleReaction}
                title="Like this discussion"
              >
                <ThumbsUp size={12} />
                {likesCount}
              </button>
              <button
                className="stat stat-btn"
                onClick={handleCommentClick}
                title="View comments"
              >
                <MessageSquare size={12} />
                {repliesCount}
              </button>
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
            <div className="thread-actions-quick">
              <button 
                className="thread-quick-btn edit" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit && onEdit(thread._id);
                }} 
                title="Edit discussion"
              >
                <Edit size={13} />
              </button>
              <button 
                className="thread-quick-btn delete" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(thread._id);
                }}
                title="Delete discussion"
              >
                <Trash2 size={13} />
              </button>
            </div>
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
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const TITLE_MIN = 8;
  const TITLE_MAX = 120;
  const BODY_MIN = 20;
  const BODY_MAX = 1000;
  const MAX_TAGS = 6;

  const validate = () => {
    const nextErrors = {};
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    const parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const invalidTag = parsedTags.find((t) => t.length < 2 || t.length > 20 || /\d/.test(t));

    if (!category || !Object.prototype.hasOwnProperty.call(CATEGORY_CONFIG, category)) {
      nextErrors.category = "Please choose a valid category.";
    }

    if (!cleanTitle) {
      nextErrors.title = "Title is required.";
    } else if (cleanTitle.length < TITLE_MIN) {
      nextErrors.title = `Title must be at least ${TITLE_MIN} characters.`;
    } else if (cleanTitle.length > TITLE_MAX) {
      nextErrors.title = `Title must be less than ${TITLE_MAX + 1} characters.`;
    }

    if (!cleanBody) {
      nextErrors.body = "Description is required.";
    } else if (cleanBody.length < BODY_MIN) {
      nextErrors.body = `Description must be at least ${BODY_MIN} characters.`;
    } else if (cleanBody.length > BODY_MAX) {
      nextErrors.body = `Description must be less than ${BODY_MAX + 1} characters.`;
    }

    if (parsedTags.length > MAX_TAGS) {
      nextErrors.tags = `Add up to ${MAX_TAGS} tags only.`;
    } else if (invalidTag) {
      const invalidDetails = parsedTags
        .map((t) => {
          const issues = [];
          if (t.length < 2) issues.push("at least 2 characters");
          if (t.length > 20) issues.push("max 20 characters");
          if (/\d/.test(t)) issues.push("no numbers");
          return issues.length > 0 ? `'${t}' (${issues.join(", ")})` : null;
        })
        .filter(Boolean)
        .join(", ");
      nextErrors.tags = `Invalid tags: ${invalidDetails}`;
    }

    return { nextErrors, parsedTags, cleanTitle, cleanBody };
  };

  const handleSubmit = async () => {
    const { nextErrors, parsedTags, cleanTitle, cleanBody } = validate();
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: cleanTitle,
        body: cleanBody,
        category,
        tags: parsedTags,
      });
      onClose();
    } catch (err) {
      setSubmitError("Could not post discussion. Please try again.");
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
          <select
            className={`form-select${errors.category ? " form-field-error" : ""}`}
            value={category}
            onChange={e => {
              setCategory(e.target.value);
              if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
            }}
            aria-invalid={Boolean(errors.category)}
          >
            {Object.keys(CATEGORY_CONFIG).map(c => (
              <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
            ))}
          </select>
          {errors.category && <div className="form-error-text">{errors.category}</div>}

          <label className="form-label" style={{ marginTop: "1rem" }}>Title</label>
          <input
            className={`form-input${errors.title ? " form-field-error" : ""}`}
            type="text"
            placeholder="What's your question or topic?"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
            }}
            maxLength={TITLE_MAX}
            aria-invalid={Boolean(errors.title)}
          />
          <div className="form-meta-row">
            {errors.title ? <div className="form-error-text">{errors.title}</div> : <span />}
            <span className="form-counter">{title.trim().length}/{TITLE_MAX}</span>
          </div>

          <label className="form-label" style={{ marginTop: "1rem" }}>Description</label>
          <textarea
            className={`form-textarea${errors.body ? " form-field-error" : ""}`}
            placeholder="Describe your question in detail…"
            value={body}
            onChange={e => {
              setBody(e.target.value);
              if (errors.body) setErrors((prev) => ({ ...prev, body: "" }));
            }}
            rows={5}
            maxLength={BODY_MAX}
            aria-invalid={Boolean(errors.body)}
          />
          <div className="form-meta-row">
            {errors.body ? <div className="form-error-text">{errors.body}</div> : <span />}
            <span className="form-counter">{body.trim().length}/{BODY_MAX}</span>
          </div>

          <label className="form-label" style={{ marginTop: "1rem" }}>Tags <span className="form-hint">(comma separated)</span></label>
          <input
            className={`form-input${errors.tags ? " form-field-error" : ""}`}
            type="text"
            placeholder="e.g. SQL, joins, indexing"
            value={tags}
            onChange={e => {
              setTags(e.target.value);
              if (errors.tags) setErrors((prev) => ({ ...prev, tags: "" }));
            }}
            aria-invalid={Boolean(errors.tags)}
          />
          {errors.tags && <div className="form-error-text">{errors.tags}</div>}
          {submitError && <div className="form-submit-error">{submitError}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-post"
            onClick={handleSubmit}
            disabled={submitting}
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
    const res = await fetch("http://localhost:8000/forum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    if (!res.ok) {
      throw new Error("Failed to create discussion");
    }

    fetchThreads(query, activeCategory, activeSort);
  };

  const handleReaction = async (threadId, userId, userName) => {
    try {
      console.log("Sending reaction:", { threadId, userId, userName });

      const res = await fetch(`http://localhost:8000/forum/${threadId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          type: "like",
        }),
      });

      const data = await res.json();
      console.log("Reaction response:", data);

      if (data.success) {
        // Update the thread in the local state
        setThreads(prevThreads =>
          prevThreads.map(t => t._id === threadId ? data.data : t)
        );
        console.log("Thread updated successfully");
      } else {
        console.error("Reaction failed:", data.message);
      }
    } catch (err) {
      console.error("Failed to add reaction:", err);
    }
  };

  const handleDelete = async (threadId) => {
    if (!window.confirm("Are you sure you want to delete this discussion? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/forum/${threadId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setThreads(prevThreads => prevThreads.filter(t => t._id !== threadId));
      } else {
        alert("Failed to delete discussion: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Failed to delete discussion:", err);
      alert("Failed to delete discussion");
    }
  };

  const handleEdit = (threadId) => {
    window.location.href = `/forum/${threadId}`;
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
              <ThreadCard key={thread._id} thread={thread} onReaction={handleReaction} onDelete={handleDelete} onEdit={handleEdit} />
            ))
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}