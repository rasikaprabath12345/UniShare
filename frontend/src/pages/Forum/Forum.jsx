import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Search, Plus, Bell, ArrowLeft, ThumbsUp,
  Bookmark, MessageSquare, Star, ChevronUp,
  Send, Flag
} from "lucide-react";

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────

const THREADS = [
  {
    id: 1,
    title: "Data Structures assignment 3 - Linked List eka hadanne kohomad?",
    cat: "assignment",
    tags: ["#assignment", "#java"],
    author: "Kavindu R.",
    time: "2h ago",
    replies: 8,
    votes: 12,
    body: "Machan mata linked list assignment eka gana help oné. Circular linked list eka implement karanne kohomada honestly idea naha. Kauruwatahri implementation ekak thiyenawada?",
    av: "KR",
    avatarColor: "#1565C0",
  },
  {
    id: 2,
    title: "LMS Project - Forum module ekata best database schema eka mokakd?",
    cat: "project",
    tags: ["#project", "#database"],
    author: "Nimali P.",
    time: "4h ago",
    replies: 5,
    votes: 19,
    body: "Our LMS project ekata forum module ekak hadanawa. Threads, replies, upvotes, tags support karanna ona. MySQL paavicchi karanne. Kauruwatahri good schema design ekak suggest karanneko.",
    av: "NP",
    avatarColor: "#0f6e56",
  },
  {
    id: 3,
    title: "Java OOP exam revision - important topics tika share karanneko",
    cat: "java",
    tags: ["#java", "#exam"],
    author: "Sachith M.",
    time: "Yesterday",
    replies: 14,
    votes: 31,
    body: "Next week exam thiyanawa OOP ekata. Inheritance, Polymorphism, Encapsulation gana revision karanna ona. Kavuruhri important past paper questions tiyenawada?",
    av: "SM",
    avatarColor: "#854F0B",
  },
  {
    id: 4,
    title: "Group project members needed - Web App development",
    cat: "project",
    tags: ["#project", "#team"],
    author: "Dilini A.",
    time: "Yesterday",
    replies: 3,
    votes: 7,
    body: "4 member group ekak hadanawa web app project ekata. Frontend, Backend, DB design karanna people ona. React + Node.js use karanawa. Interested nam comment karanna.",
    av: "DA",
    avatarColor: "#993556",
  },
  {
    id: 5,
    title: "Assignment 4 deadline extend unada?",
    cat: "assignment",
    tags: ["#assignment"],
    author: "Tharindu K.",
    time: "2 days ago",
    replies: 6,
    votes: 4,
    body: "Assignment 4 deadline extend una kiyla kelwwa. Confirmation ekak thiyanawada? E-learn ekata notice una wage natuwe.",
    av: "TK",
    avatarColor: "#534AB7",
  },
  {
    id: 6,
    title: "Anyone free this weekend for study session?",
    cat: "general",
    tags: ["#general"],
    author: "Hasini W.",
    time: "3 days ago",
    replies: 9,
    votes: 8,
    body: "This Saturday library ekat enna interest thiyena kauruwathari? DSA and Java revision karanna plan karanawa. 10am to 2pm approximately.",
    av: "HW",
    avatarColor: "#0d47a1",
  },
];

const SAMPLE_REPLIES = {
  1: [
    {
      name: "Nimali P.", av: "NP", avatarColor: "#0f6e56", time: "1h ago",
      text: "Machan circular linked list ekata last node.next = head kiyala point karanna ona. Append, delete karanna special case handle karanna ona head node ekata.",
      votes: 8, best: true,
    },
    {
      name: "Sachith M.", av: "SM", avatarColor: "#854F0B", time: "45m ago",
      text: "YouTube ekat check karanna - 'Circular Linked List Java implementation' danna. Visual ekak thiyanawa purethama.",
      votes: 5, best: false,
    },
  ],
  2: [
    {
      name: "Kavindu R.", av: "KR", avatarColor: "#1565C0", time: "3h ago",
      text: "threads(id, title, body, category_id, user_id, created_at), replies(id, thread_id, user_id, body, created_at), upvotes(user_id, thread_id) — minimum schema eka meken.",
      votes: 15, best: true,
    },
  ],
};

const CATEGORIES = [
  { key: "all",        label: "All Topics",  dot: "#1565C0", count: 12 },
  { key: "assignment", label: "Assignments", dot: "#e53935", count: 4  },
  { key: "project",    label: "Projects",    dot: "#1d9e75", count: 3  },
  { key: "java",       label: "Java",        dot: "#f59f0b", count: 3  },
  { key: "general",    label: "General",     dot: "#7f77dd", count: 2  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function tagColor(tag) {
  if (tag.includes("assignment")) return styles.tagCoral;
  if (tag.includes("project") || tag.includes("team")) return styles.tagGreen;
  if (tag.includes("java") || tag.includes("exam")) return styles.tagAmber;
  return styles.tagBlue;
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function ThreadCard({ thread, onClick }) {
  const [votes, setVotes] = useState(thread.votes);
  const [voted, setVoted] = useState(false);

  const handleVote = (e) => {
    e.stopPropagation();
    setVoted(!voted);
    setVotes(v => voted ? v - 1 : v + 1);
  };

  return (
    <div style={styles.threadCard} onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(21,101,192,0.15)"; e.currentTarget.style.borderColor = "#b8cfee"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(21,101,192,0.05)"; e.currentTarget.style.borderColor = "#e8f0fe"; }}
    >
      <div style={styles.threadCardTop}>
        <div style={{ ...styles.avatar, background: thread.avatarColor }}>{thread.av}</div>
        <div style={{ flex: 1 }}>
          <div style={styles.threadTitle}>{thread.title}</div>
          <div style={styles.threadAuthor}>{thread.author} · {thread.time}</div>
        </div>
      </div>

      <div style={styles.tagRow}>
        {thread.tags.map(tag => (
          <span key={tag} style={{ ...styles.tag, ...tagColor(tag) }}>{tag}</span>
        ))}
      </div>

      <div style={styles.threadFooter}>
        <span style={styles.tStat}>
          <MessageSquare size={11} style={{ marginRight: 4 }} />{thread.replies} replies
        </span>
        <span style={styles.tStat}>
          <ChevronUp size={11} style={{ marginRight: 4 }} />{votes}
        </span>
        <button
          style={{ ...styles.votePill, ...(voted ? styles.votePillActive : {}) }}
          onClick={handleVote}
        >
          <ChevronUp size={11} /> {votes}
        </button>
      </div>
    </div>
  );
}

function ReplyItem({ reply }) {
  const [votes, setVotes] = useState(reply.votes);
  const [voted, setVoted] = useState(false);

  return (
    <div style={styles.replyItem}>
      <div style={styles.replyTop}>
        <div style={{ ...styles.replyAvatar, background: reply.avatarColor }}>{reply.av}</div>
        <span style={styles.replyName}>{reply.name}</span>
        {reply.best && <span style={styles.bestBadge}>Best Answer</span>}
        <span style={styles.replyTime}>{reply.time}</span>
      </div>
      <div style={styles.replyText}>{reply.text}</div>
      <div style={styles.replyActions}>
        <button
          style={{ ...styles.replyVote, ...(voted ? styles.replyVoteActive : {}) }}
          onClick={() => { setVoted(!voted); setVotes(v => voted ? v - 1 : v + 1); }}
        >
          <ThumbsUp size={10} style={{ marginRight: 3 }} />{votes}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Forum() {
  const [activeCat, setActiveCat]     = useState("all");
  const [search, setSearch]           = useState("");
  const [sortPopular, setSortPopular] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyText, setReplyText]     = useState("");
  const [localReplies, setLocalReplies] = useState(SAMPLE_REPLIES);
  const [upvoted, setUpvoted]         = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);

  // Filter + sort threads
  const filtered = THREADS
    .filter(t => {
      const matchesCat = activeCat === "all" || t.cat === activeCat || t.tags.some(tg => tg.includes(activeCat));
      const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tg => tg.includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => sortPopular ? b.votes - a.votes : 0);

  const openThread = (thread) => {
    setSelectedThread(thread);
    setUpvoted(false);
    setUpvoteCount(thread.votes);
  };

  const postReply = () => {
    if (!replyText.trim() || !selectedThread) return;
    setLocalReplies(prev => ({
      ...prev,
      [selectedThread.id]: [
        ...(prev[selectedThread.id] || []),
        { name: "Ashan S.", av: "AS", avatarColor: "#1565C0", time: "Just now", text: replyText.trim(), votes: 0, best: false },
      ],
    }));
    setReplyText("");
  };

  const currentReplies = selectedThread ? (localReplies[selectedThread.id] || []) : [];

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; }

        .forum-page { font-family: 'Poppins', sans-serif; background: #f4f7ff; min-height: 100vh; }

        /* HERO */
        .forum-hero {
          position: relative; padding: 48px 40px 52px;
          text-align: center; overflow: hidden;
          display: flex; flex-direction: column; align-items: center; gap: 18px;
        }
        .forum-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          z-index: 0;
        }
        .forum-hero-content { position: relative; z-index: 2; max-width: 540px; }
        .forum-hero-badge {
          display: inline-block; background: rgba(255,255,255,0.15);
          color: white; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          padding: 5px 14px; border-radius: 20px; margin-bottom: 10px;
        }
        .forum-hero-content h1 {
          font-size: 1.8rem; font-weight: 800; color: white;
          line-height: 1.2; margin-bottom: 8px;
        }
        .forum-hero-content p {
          font-size: 0.88rem; color: rgba(255,255,255,0.75); line-height: 1.6;
        }
        .forum-hero-search {
          display: flex; align-items: center; background: white;
          border-radius: 30px; padding: 10px 18px;
          box-shadow: 0 4px 20px rgba(21,101,192,0.3);
          width: 100%; max-width: 460px; position: relative; z-index: 2;
        }
        .forum-hero-search input {
          border: none; outline: none; flex: 1; background: transparent;
          font-family: 'Poppins', sans-serif; font-size: 0.88rem; color: #333;
        }
        .forum-hero-search input::placeholder { color: #aaa; }
        .forum-hero-stats {
          display: flex; gap: 28px; justify-content: center;
          position: relative; z-index: 2;
        }
        .forum-stat-num { font-size: 1.3rem; font-weight: 800; color: white; }
        .forum-stat-lbl { font-size: 0.72rem; color: rgba(255,255,255,0.6); font-weight: 600; }

        /* LAYOUT */
        .forum-layout { display: flex; min-height: 560px; }

        /* SIDEBAR */
        .forum-sidebar {
          width: 210px; background: white; border-right: 1px solid #e8f0fe;
          display: flex; flex-direction: column; flex-shrink: 0;
        }
        .forum-new-btn {
          margin: 12px 10px 6px; padding: 10px 14px;
          background: #1565C0; color: white; border: none; border-radius: 10px;
          font-family: 'Poppins', sans-serif; font-size: 0.80rem; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
          box-shadow: 0 3px 14px rgba(21,101,192,0.3); transition: all 0.2s;
        }
        .forum-new-btn:hover { background: #0d47a1; transform: translateY(-1px); box-shadow: 0 5px 18px rgba(21,101,192,0.38); }
        .sidebar-label {
          font-size: 0.65rem; font-weight: 700; color: #aaa;
          letter-spacing: 1.5px; text-transform: uppercase;
          padding: 14px 14px 6px;
        }
        .cat-item {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 12px; cursor: pointer; border-radius: 10px;
          margin: 1px 6px; font-size: 0.78rem; color: #555; font-weight: 600;
          transition: all 0.15s; border: none; background: transparent;
          font-family: 'Poppins', sans-serif; width: calc(100% - 12px); text-align: left;
        }
        .cat-item:hover { background: #f4f7ff; color: #1565C0; }
        .cat-item.active { background: #e8f0fe; color: #1565C0; }
        .cat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .cat-count {
          margin-left: auto; font-size: 0.65rem; color: #1565C0;
          background: #e8f0fe; padding: 1px 7px; border-radius: 20px; font-weight: 700;
        }
        .sidebar-profile {
          margin-top: auto; border-top: 1px solid #e8f0fe;
          padding: 10px 12px; display: flex; align-items: center; gap: 8px;
        }
        .sidebar-av {
          width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg, #1565C0, #1e88e5);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem; font-weight: 700; color: white; flex-shrink: 0;
        }

        /* CONTENT */
        .forum-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .forum-topbar {
          padding: 12px 16px; background: white; border-bottom: 1px solid #e8f0fe;
          display: flex; align-items: center; gap: 10px;
        }
        .search-mini {
          display: flex; align-items: center; gap: 6px;
          background: #f4f7ff; border: 1.5px solid #e8f0fe;
          border-radius: 30px; padding: 6px 12px; flex: 1;
        }
        .search-mini input {
          border: none; background: transparent; font-size: 0.78rem;
          font-family: 'Poppins', sans-serif; color: #333; outline: none; flex: 1;
        }
        .search-mini input::placeholder { color: #aaa; }
        .notif-btn {
          width: 34px; height: 34px; border-radius: 10px;
          border: 1.5px solid #e8f0fe; background: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative; flex-shrink: 0; transition: all 0.15s;
        }
        .notif-btn:hover { background: #f4f7ff; border-color: #1565C0; }
        .notif-dot {
          width: 6px; height: 6px; background: #e53935; border-radius: 50%;
          position: absolute; top: 5px; right: 5px; border: 1.5px solid white;
        }
        .sort-btn {
          padding: 6px 14px; border: 1.5px solid #e8f0fe; background: white;
          color: #1565C0; border-radius: 30px; font-family: 'Poppins', sans-serif;
          font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.15s;
        }
        .sort-btn:hover, .sort-btn.active { background: #1565C0; color: white; border-color: #1565C0; }

        /* SECTION HEADER */
        .section-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px 8px; }
        .section-label {
          display: inline-block; background: #e8f0fe; color: #1565C0;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; padding: 4px 12px; border-radius: 20px; white-space: nowrap;
        }
        .section-line { flex: 1; height: 1px; background: #e8f0fe; }

        /* THREAD LIST */
        .thread-list { flex: 1; overflow-y: auto; padding: 0 12px 16px; }
        .thread-card {
          background: white; border-radius: 12px; border: 1px solid #e8f0fe;
          padding: 14px 16px; margin-bottom: 10px; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          box-shadow: 0 2px 10px rgba(21,101,192,0.05);
        }
        .thread-card:hover {
          transform: translateY(-3px); box-shadow: 0 8px 28px rgba(21,101,192,0.15);
          border-color: #b8cfee;
        }

        /* DETAIL VIEW */
        .detail-header { padding: 14px 16px; background: white; border-bottom: 1px solid #e8f0fe; }
        .back-link {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.75rem; color: #1565C0; cursor: pointer;
          font-weight: 700; margin-bottom: 10px; border: none;
          background: none; font-family: 'Poppins', sans-serif; padding: 0;
        }
        .back-link:hover { color: #0d47a1; }
        .action-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 14px; border: 1.5px solid #e8f0fe;
          background: white; color: #1565C0; border-radius: 20px;
          font-family: 'Poppins', sans-serif; font-size: 0.75rem;
          font-weight: 700; cursor: pointer; transition: all 0.15s;
        }
        .action-btn:hover, .action-btn.active {
          background: #1565C0; color: white; border-color: #1565C0;
        }
        .reply-textarea {
          flex: 1; border: 1.5px solid #e8f0fe; border-radius: 10px;
          padding: 8px 12px; font-size: 0.80rem; font-family: 'Poppins', sans-serif;
          color: #333; resize: none; outline: none; background: #f4f7ff; transition: border 0.15s;
        }
        .reply-textarea:focus { border-color: #1565C0; background: white; }
        .send-btn {
          background: #1565C0; color: white; border: none; border-radius: 10px;
          padding: 9px 18px; font-size: 0.80rem; font-weight: 700;
          cursor: pointer; font-family: 'Poppins', sans-serif;
          box-shadow: 0 3px 12px rgba(21,101,192,0.3); transition: all 0.2s;
        }
        .send-btn:hover { background: #0d47a1; transform: translateY(-1px); }
        .empty-state { padding: 48px 16px; text-align: center; color: #aaa; font-size: 0.82rem; font-weight: 600; }
      `}</style>

      <Navbar />

      <div className="forum-page">
        {/* ── HERO ── */}
        <section className="forum-hero">
          <div className="forum-hero-overlay" />
          <div className="forum-hero-content">
            <span className="forum-hero-badge">Student Discussion Forum</span>
            <h1>Ask. Answer. Learn Together.</h1>
            <p>Connect with batchmates, share knowledge and get help on assignments, projects & more.</p>
          </div>
          <div className="forum-hero-search">
            <Search size={16} style={{ marginRight: 10, color: "#aaa", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search threads, topics, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="forum-hero-stats">
            {[["247","Threads"],["1.2K","Replies"],["89","Active Today"]].map(([n,l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div className="forum-stat-num">{n}</div>
                <div className="forum-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MAIN LAYOUT ── */}
        <div className="forum-layout">

          {/* SIDEBAR */}
          <aside className="forum-sidebar">
            <button className="forum-new-btn">
              <Plus size={14} /> New Thread
            </button>

            <div className="sidebar-label">Categories</div>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className={`cat-item${activeCat === cat.key ? " active" : ""}`}
                onClick={() => { setActiveCat(cat.key); setSelectedThread(null); }}
              >
                <span className="cat-dot" style={{ background: cat.dot }} />
                {cat.label}
                <span className="cat-count">{cat.count}</span>
              </button>
            ))}

            <div className="sidebar-profile">
              <div className="sidebar-av">AS</div>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0d2257" }}>Ashan S.</div>
                <div style={{ fontSize: "0.65rem", color: "#aaa" }}>23 posts</div>
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <main className="forum-content">
            <div className="forum-topbar">
              <div className="search-mini">
                <Search size={13} style={{ color: "#aaa", flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Filter threads..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button className="notif-btn">
                <Bell size={14} color="#555" />
                <span className="notif-dot" />
              </button>
              <button className={`sort-btn${!sortPopular ? " active" : ""}`} onClick={() => setSortPopular(false)}>Latest</button>
              <button className={`sort-btn${sortPopular ? " active" : ""}`} onClick={() => setSortPopular(true)}>Popular</button>
            </div>

            {/* ── THREAD LIST ── */}
            {!selectedThread && (
              <>
                <div className="section-header">
                  <span className="section-label">Recent Threads</span>
                  <div className="section-line" />
                </div>
                <div className="thread-list">
                  {filtered.length === 0
                    ? <div className="empty-state">No threads found</div>
                    : filtered.map(t => (
                      <ThreadCard key={t.id} thread={t} onClick={() => openThread(t)} />
                    ))
                  }
                </div>
              </>
            )}

            {/* ── THREAD DETAIL ── */}
            {selectedThread && (
              <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                <div className="detail-header">
                  <button className="back-link" onClick={() => setSelectedThread(null)}>
                    <ArrowLeft size={13} /> Back to threads
                  </button>
                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0d2257", lineHeight: 1.35, marginBottom: 8 }}>
                    {selectedThread.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {selectedThread.tags.map(tg => (
                      <span key={tg} style={{ ...styles.tag, ...tagColor(tg) }}>{tg}</span>
                    ))}
                    <span style={{ fontSize: "0.72rem", color: "#aaa", fontWeight: 600 }}>
                      {selectedThread.author} · {selectedThread.time}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "14px 16px", fontSize: "0.82rem", color: "#555", lineHeight: 1.7, borderBottom: "1px solid #e8f0fe", background: "white" }}>
                  {selectedThread.body}
                </div>

                <div style={{ display: "flex", gap: 8, padding: "10px 16px", background: "white", borderBottom: "1px solid #e8f0fe" }}>
                  <button
                    className={`action-btn${upvoted ? " active" : ""}`}
                    onClick={() => { setUpvoted(!upvoted); setUpvoteCount(c => upvoted ? c - 1 : c + 1); }}
                  >
                    <ThumbsUp size={12} /> {upvoteCount} Upvote
                  </button>
                  <button className="action-btn"><Bookmark size={12} /> Save</button>
                  <button className="action-btn" style={{ marginLeft: "auto" }}><Flag size={12} /> Report</button>
                </div>

                <div style={{ flex: 1, overflowY: "auto" }}>
                  <div className="section-header">
                    <span className="section-label">{currentReplies.length} Replies</span>
                    <div className="section-line" />
                  </div>
                  {currentReplies.map((r, i) => <ReplyItem key={i} reply={r} />)}
                </div>

                <div style={{ padding: "10px 14px", background: "white", borderTop: "1px solid #e8f0fe", display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <textarea
                    className="reply-textarea"
                    rows={2}
                    placeholder="Write your reply..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                  <button className="send-btn" onClick={postReply}>
                    <Send size={13} style={{ marginRight: 5 }} /> Reply
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ─── INLINE STYLES (for dynamic / conditional styling) ────────────────────────

const styles = {
  avatar: {
    width: 32, height: 32, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.65rem", fontWeight: 700, color: "white", flexShrink: 0,
  },
  threadCardTop: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  threadTitle: { fontSize: "0.85rem", fontWeight: 700, color: "#0d2257", lineHeight: 1.4, marginBottom: 4 },
  threadAuthor: { fontSize: "0.72rem", color: "#aaa", fontWeight: 600 },
  tagRow: { display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 },
  tag: { fontSize: "0.65rem", fontWeight: 700, padding: "2px 9px", borderRadius: 20 },
  tagBlue:  { background: "#e8f0fe", color: "#1565C0" },
  tagGreen: { background: "#e6f4f1", color: "#0f6e56" },
  tagAmber: { background: "#fef3e2", color: "#854F0B" },
  tagCoral: { background: "#fce8ef", color: "#993556" },
  threadFooter: { display: "flex", alignItems: "center", gap: 14 },
  tStat: { display: "flex", alignItems: "center", fontSize: "0.70rem", color: "#aaa", fontWeight: 600 },
  votePill: {
    marginLeft: "auto", display: "flex", alignItems: "center", gap: 4,
    background: "#e8f0fe", color: "#1565C0", borderRadius: 20, padding: "3px 10px",
    fontSize: "0.70rem", fontWeight: 700, cursor: "pointer", border: "none",
    fontFamily: "'Poppins', sans-serif", transition: "all 0.15s",
  },
  votePillActive: { background: "#1565C0", color: "white" },
  replyItem: { padding: "12px 16px", borderBottom: "1px solid #f4f7ff" },
  replyTop: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  replyAvatar: {
    width: 26, height: 26, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.60rem", fontWeight: 700, color: "white", flexShrink: 0,
  },
  replyName: { fontSize: "0.75rem", fontWeight: 700, color: "#0d2257" },
  replyTime: { fontSize: "0.68rem", color: "#aaa", marginLeft: "auto" },
  bestBadge: {
    fontSize: "0.60rem", padding: "2px 8px", borderRadius: 20,
    background: "#e6f4f1", color: "#0f6e56", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: 0.5,
  },
  replyText: { fontSize: "0.80rem", color: "#555", lineHeight: 1.6, paddingLeft: 34 },
  replyActions: { display: "flex", alignItems: "center", gap: 10, paddingLeft: 34, marginTop: 6 },
  replyVote: {
    display: "flex", alignItems: "center", gap: 3,
    fontSize: "0.70rem", color: "#aaa", cursor: "pointer",
    fontFamily: "'Poppins', sans-serif", fontWeight: 700,
    background: "none", border: "none",
  },
  replyVoteActive: { color: "#1565C0" },
};