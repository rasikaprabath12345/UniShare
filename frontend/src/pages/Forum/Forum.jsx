import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";



const COLORS = {
  c1: "#40E0D0",
  c2: "#00B4D8",
  c3: "#003366",
  c4: "#001F3F",
  c5: "#F0F8FF",
};

const AV_BG = ["#40E0D0", "#00B4D8", "#003366", "#001F3F", "#40E0D0", "#00B4D8"];
const AV_FG = ["#001F3F", "#001F3F", "#40E0D0", "#40E0D0", "#001F3F", "#001F3F"];

const FLAIR_STYLES = {
  Notes:      { background: "#40E0D0", color: "#001F3F" },
  Exam:       { background: "#001F3F", color: "#40E0D0", border: "1px solid #40E0D0" },
  Discussion: { background: "#00B4D8", color: "#001F3F" },
  Resource:   { background: "#003366", color: "#40E0D0", border: "1px solid #00B4D8" },
};

const SUBS = [
  { id: "cs",   name: "r/ComputerScience", members: "1.2k" },
  { id: "math", name: "r/Mathematics",     members: "890"  },
  { id: "eng",  name: "r/Engineering",     members: "743"  },
  { id: "biz",  name: "r/Business",        members: "612"  },
];

const SUB_NAMES = {
  cs:   "r/ComputerScience",
  math: "r/Mathematics",
  eng:  "r/Engineering",
  biz:  "r/Business",
};

const INITIAL_POSTS = [
  {
    id: 1, sub: "cs", sn: "r/ComputerScience", user: "ashan_k", ui: 0,
    title: "Complete CS3012 Algorithm notes — Week 1 to 8",
    body: "Sharing all my algorithm notes from this semester. Covers sorting, DP, greedy algorithms, and graph traversal. Great for exam revision!",
    flair: "Notes", votes: 247, voted: 0, time: "5h ago",
    comments: [
      { user: "sithmi_j",  ui: 1, text: "These are amazing! Saved me for the midterm.", votes: 34, voted: 0 },
      { user: "ravindu_m", ui: 2, text: "Do you have Week 9 slides as well?",           votes: 12, voted: 0 },
    ],
  },
  {
    id: 2, sub: "math", sn: "r/Mathematics", user: "nethmi_p", ui: 1,
    title: "MAT2201 past papers 2019–2023 — all solved",
    body: "Compiled 5 years of MAT2201 past papers with worked solutions. Good luck for the finals everyone.",
    flair: "Exam", votes: 189, voted: 0, time: "8h ago",
    comments: [
      { user: "dilshan_w", ui: 3, text: "Legend! This is exactly what I needed.", votes: 41, voted: 0 },
    ],
  },
  {
    id: 3, sub: "eng", sn: "r/Engineering", user: "kavishka_f", ui: 2,
    title: "Discussion: Best free tools for circuit simulation?",
    body: "Looking for recommendations beyond LTSpice. What are you using for EE301 labs?",
    flair: "Discussion", votes: 134, voted: 0, time: "1d ago",
    comments: [
      { user: "isuri_t", ui: 4, text: "Multisim is great if you get the student license.", votes: 28, voted: 0 },
      { user: "ashan_k", ui: 0, text: "I use Falstad for quick checks and PSPICE for lab reports.", votes: 19, voted: 0 },
    ],
  },
  {
    id: 4, sub: "biz", sn: "r/Business", user: "chamodi_h", ui: 5,
    title: "MGT3301 lecture slides — full semester pack",
    body: "All 12 weeks of MGT3301 slides organized by topic. Includes guest lecturer slides not on the portal.",
    flair: "Resource", votes: 98, voted: 0, time: "2d ago",
    comments: [],
  },
  {
    id: 5, sub: "cs", sn: "r/ComputerScience", user: "ravindu_m", ui: 2,
    title: "Anyone struggling with OS3 memory management assignment?",
    body: "The paging question is really unclear. What approach are you taking?",
    flair: "Discussion", votes: 67, voted: 0, time: "3d ago",
    comments: [
      { user: "nethmi_p", ui: 1, text: "Yes! Lecturer said we can use either LRU or FIFO.", votes: 22, voted: 0 },
    ],
  },
];


<Navbar />
/* ─── Small reusable components ─── */

function Avatar({ initials, ui, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: AV_BG[ui % 6], color: AV_FG[ui % 6],
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size < 30 ? 11 : 12, fontWeight: 500, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function Flair({ label }) {
  const style = FLAIR_STYLES[label] || FLAIR_STYLES.Notes;
  return (
    <span style={{
      display: "inline-block", fontSize: 11, padding: "2px 9px",
      borderRadius: 20, marginBottom: 6, fontWeight: 500, ...style,
    }}>
      {label}
    </span>
  );
}

/* ─── Navbar ─── */

function Navbars({ onCreatePost }) {
  const [search, setSearch] = useState("");

  return (
    <div style={{
      background: COLORS.c4, borderBottom: `2px solid ${COLORS.c2}`,
      padding: "0 16px", display: "flex", alignItems: "center",
      gap: 16, height: 46, marginBottom: 12,
    }}>
      {/* Logo */}
      <div style={{ fontSize: 15, fontWeight: 500, color: COLORS.c1, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%", background: COLORS.c1,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill={COLORS.c4}>
            <circle cx="10" cy="8" r="3" />
            <ellipse cx="10" cy="15" rx="6" ry="3" />
            <circle cx="16" cy="6" r="2" />
          </svg>
        </div>
        CampusHub
      </div>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 340 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search CampusHub..."
          style={{
            width: "100%", padding: "6px 14px", border: `1.5px solid ${COLORS.c2}`,
            borderRadius: 20, background: COLORS.c3, color: COLORS.c5,
            fontSize: 13, outline: "none",
          }}
        />
      </div>

      {/* Buttons */}
      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        <button onClick={onCreatePost} style={{
          padding: "5px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
          border: `1.5px solid ${COLORS.c1}`, background: "none", color: COLORS.c1, fontWeight: 500,
        }}>
          + Create Post
        </button>
        <button style={{
          padding: "5px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
          border: `1.5px solid ${COLORS.c1}`, background: COLORS.c1, color: COLORS.c4, fontWeight: 500,
        }}>
          Log In
        </button>
      </div>
    </div>
  );
}

/* ─── Compose Modal ─── */

function ComposeModal({ onClose, onSubmit }) {
  const [title, setTitle]   = useState("");
  const [body, setBody]     = useState("");
  const [sub, setSub]       = useState("cs");
  const [flair, setFlair]   = useState("Notes");

  const flairs = ["Notes", "Exam", "Discussion", "Resource"];

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), body: body.trim(), sub, flair });
    setTitle(""); setBody("");
  };

  return (
    <div style={{
      background: "rgba(0,20,50,0.85)", padding: "20px 16px",
      borderRadius: 12, marginBottom: 10,
    }}>
      <div style={{
        background: COLORS.c3, borderRadius: 12, padding: "1.25rem",
        border: `1.5px solid ${COLORS.c1}`,
      }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: COLORS.c1, marginBottom: 14 }}>
          Create a post
        </div>

        <select
          value={sub} onChange={e => setSub(e.target.value)}
          style={inputStyle}
        >
          {Object.entries(SUB_NAMES).map(([k, v]) => (
            <option key={k} value={k} style={{ background: COLORS.c4 }}>{v}</option>
          ))}
        </select>

        <input
          value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Title" style={inputStyle}
        />

        {/* Flair picker */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {flairs.map(f => (
            <button key={f} onClick={() => setFlair(f)} style={{
              fontSize: 11, padding: "3px 10px", borderRadius: 20,
              fontWeight: 500, cursor: "pointer",
              border: flair === f ? `1.5px solid ${COLORS.c1}` : "1.5px solid transparent",
              ...FLAIR_STYLES[f],
            }}>
              {f}
            </button>
          ))}
        </div>

        <textarea
          value={body} onChange={e => setBody(e.target.value)}
          placeholder="Text (optional)"
          style={{ ...inputStyle, height: 80, resize: "vertical", fontFamily: "inherit" }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{
            padding: "7px 14px", borderRadius: 20, background: "none",
            border: `1.5px solid ${COLORS.c2}`, color: COLORS.c1, fontSize: 13, cursor: "pointer",
          }}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={{
            padding: "7px 16px", borderRadius: 20, background: COLORS.c1,
            color: COLORS.c4, border: "none", fontSize: 13, cursor: "pointer", fontWeight: 500,
          }}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block", width: "100%", padding: "8px 12px", marginBottom: 10,
  border: `1.5px solid ${COLORS.c2}`, borderRadius: 8,
  background: COLORS.c4, color: COLORS.c5, fontSize: 13, outline: "none",
  boxSizing: "border-box",
};

/* ─── Comment ─── */

function Comment({ comment, onVote }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      <Avatar initials={comment.user.slice(0, 2).toUpperCase()} ui={comment.ui} size={28} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.c1, marginBottom: 3 }}>
          u/{comment.user}
          <span style={{ fontSize: 11, color: COLORS.c2, marginLeft: 6, fontWeight: 400 }}>
            {comment.votes} pts
          </span>
        </div>
        <div style={{ fontSize: 13, color: "#B0D8E8", lineHeight: 1.6 }}>{comment.text}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button onClick={() => onVote(1)} style={cActStyle}>▲ {comment.votes}</button>
          <button onClick={() => onVote(-1)} style={cActStyle}>▼</button>
          <button style={cActStyle}>Reply</button>
        </div>
      </div>
    </div>
  );
}

const cActStyle = {
  fontSize: 11, color: COLORS.c1, cursor: "pointer",
  background: "none", border: "none", padding: "2px 4px",
};

/* ─── Post Card ─── */

function PostCard({ post, isOpen, onToggle, onVote, onVoteComment, onAddComment }) {
  const [replyText, setReplyText] = useState("");

  const handleAddComment = () => {
    if (!replyText.trim()) return;
    onAddComment(replyText.trim());
    setReplyText("");
  };

  return (
    <div style={{
      background: COLORS.c3, border: `1.5px solid ${isOpen ? COLORS.c1 : COLORS.c2}`,
      borderRadius: 12, marginBottom: 8, display: "flex", cursor: "pointer",
      transition: "border-color .15s",
    }}>
      {/* Vote column */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "8px 6px", gap: 2, background: COLORS.c4,
          borderRadius: "10px 0 0 10px", minWidth: 38,
        }}
      >
        <button onClick={() => onVote(1)} style={{
          ...vBtnStyle, color: post.voted === 1 ? COLORS.c1 : COLORS.c1,
          background: post.voted === 1 ? COLORS.c3 : "none",
        }}>▲</button>
        <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.c5, minWidth: 20, textAlign: "center" }}>
          {post.votes}
        </span>
        <button onClick={() => onVote(-1)} style={{
          ...vBtnStyle, color: post.voted === -1 ? COLORS.c2 : COLORS.c1,
        }}>▼</button>
      </div>

      {/* Post body */}
      <div style={{ padding: "10px 14px", flex: 1, minWidth: 0 }} onClick={onToggle}>
        <div style={{ fontSize: 11, color: COLORS.c1, marginBottom: 4 }}>
          <strong>{post.sn}</strong>
          <span style={{ color: COLORS.c2 }}> · u/{post.user} · {post.time}</span>
        </div>

        <Flair label={post.flair} />

        <div style={{ fontSize: 15, fontWeight: 500, color: COLORS.c5, marginBottom: 6, lineHeight: 1.4 }}>
          {post.title}
        </div>

        {isOpen && (
          <div style={{ fontSize: 13, color: "#B0D8E8", lineHeight: 1.6, marginBottom: 8 }}>
            {post.body}
          </div>
        )}

        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[`💬 ${post.comments.length} Comments`, "🔗 Share", "★ Save"].map(label => (
            <button key={label} onClick={e => e.stopPropagation()} style={{
              fontSize: 12, color: COLORS.c1, background: "none", border: "none",
              padding: "4px 8px", borderRadius: 8, cursor: "pointer",
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Comments */}
        {isOpen && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.c2}` }}>
            {post.comments.map((c, ci) => (
              <Comment
                key={ci}
                comment={c}
                onVote={dir => onVoteComment(ci, dir)}
              />
            ))}

            {/* Reply input */}
            <div
              style={{ marginTop: 10, display: "flex", gap: 8 }}
              onClick={e => e.stopPropagation()}
            >
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="What are your thoughts?"
                style={{
                  flex: 1, padding: "8px 10px", border: `1.5px solid ${COLORS.c2}`,
                  borderRadius: 8, background: COLORS.c4, color: COLORS.c5,
                  fontSize: 13, resize: "none", height: 56,
                  fontFamily: "inherit", outline: "none",
                }}
              />
              <button onClick={handleAddComment} style={{
                alignSelf: "flex-end", padding: "7px 16px", borderRadius: 20,
                background: COLORS.c1, color: COLORS.c4, border: "none",
                fontSize: 13, cursor: "pointer", fontWeight: 500,
              }}>
                Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const vBtnStyle = {
  width: 22, height: 22, display: "flex", alignItems: "center",
  justifyContent: "center", borderRadius: 4, cursor: "pointer",
  border: "none", fontSize: 14,
};

/* ─── Sidebar ─── */

function Sidebar({ joined, onToggleJoin, onCreatePost }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Communities */}
      <div style={{
        background: COLORS.c3, border: `1.5px solid ${COLORS.c2}`,
        borderRadius: 12, overflow: "hidden",
      }}>
        <div style={{
          background: COLORS.c4, color: COLORS.c1, padding: "10px 14px",
          fontSize: 13, fontWeight: 500, borderBottom: `1.5px solid ${COLORS.c2}`,
        }}>
          Top Communities
        </div>
        <div style={{ padding: "12px 14px" }}>
          {SUBS.map((s, i) => (
            <div key={s.id} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "6px 0",
              borderBottom: i < SUBS.length - 1 ? `1px solid #00346655` : "none",
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: COLORS.c4,
                color: COLORS.c1, border: `1.5px solid ${COLORS.c1}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 500,
              }}>
                {s.name.slice(2, 4).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.c5 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: COLORS.c1 }}>{s.members} members</div>
              </div>
              <button
                onClick={() => onToggleJoin(s.id)}
                style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 20,
                  border: `1.5px solid ${COLORS.c1}`, cursor: "pointer", fontWeight: 500,
                  background: joined[s.id] ? COLORS.c1 : "none",
                  color: joined[s.id] ? COLORS.c4 : COLORS.c1,
                }}
              >
                {joined[s.id] ? "Joined" : "Join"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* About card */}
      <div style={{
        background: COLORS.c3, border: `1.5px solid ${COLORS.c2}`, borderRadius: 12, padding: 14,
      }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.c1, marginBottom: 6 }}>
          Campus Resources
        </div>
        <div style={{ fontSize: 12, color: "#B0D8E8", lineHeight: 1.7 }}>
          Share lecture notes, past papers, slides and study materials with your campus community.
        </div>
        <button onClick={onCreatePost} style={{
          marginTop: 12, width: "100%", padding: 8, borderRadius: 20,
          background: COLORS.c1, color: COLORS.c4, border: "none",
          fontSize: 13, cursor: "pointer", fontWeight: 500,
        }}>
          Create Post
        </button>
      </div>

      {/* Flairs */}
      <div style={{
        background: COLORS.c3, border: `1.5px solid ${COLORS.c2}`, borderRadius: 12, overflow: "hidden",
      }}>
        <div style={{
          background: COLORS.c4, color: COLORS.c1, padding: "10px 14px",
          fontSize: 13, fontWeight: 500, borderBottom: `1.5px solid ${COLORS.c2}`,
        }}>
          Popular Flairs
        </div>
        <div style={{ padding: "10px 14px", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["Notes", "Exam", "Discussion", "Resource"].map(f => (
            <Flair key={f} label={f} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ─── */

export default function CampusForum() {
  const [posts, setPosts]         = useState(INITIAL_POSTS);
  const [openId, setOpenId]       = useState(null);
  const [sortMode, setSortMode]   = useState("hot");
  const [search, setSearch]       = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [joined, setJoined]       = useState({ cs: true, math: false, eng: false, biz: false });

  /* Sort & filter */
  const sorted = [...posts]
    .filter(p =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.body.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sortMode === "new" ? b.id - a.id : b.votes - a.votes);

  /* Handlers */
  const togglePost  = id  => setOpenId(prev => prev === id ? null : id);
  const toggleJoin  = id  => setJoined(prev => ({ ...prev, [id]: !prev[id] }));

  const votePost = (id, dir) => setPosts(prev => prev.map(p => {
    if (p.id !== id) return p;
    const delta = p.voted === dir ? -dir : dir - p.voted;
    return { ...p, votes: p.votes + delta, voted: p.voted === dir ? 0 : dir };
  }));

  const voteComment = (postId, ci, dir) => setPosts(prev => prev.map(p => {
    if (p.id !== postId) return p;
    const comments = p.comments.map((c, i) => {
      if (i !== ci) return c;
      const delta = c.voted === dir ? -dir : dir - (c.voted || 0);
      return { ...c, votes: c.votes + delta, voted: c.voted === dir ? 0 : dir };
    });
    return { ...p, comments };
  }));

  const addComment = (postId, text) => setPosts(prev => prev.map(p => {
    if (p.id !== postId) return p;
    return { ...p, comments: [...p.comments, { user: "you", ui: 0, text, votes: 1, voted: 1 }] };
  }));

  const submitPost = ({ title, body, sub, flair }) => {
    setPosts(prev => [{
      id: Date.now(), sub, sn: SUB_NAMES[sub], user: "you", ui: 0,
      title, body: body || "No description.", flair,
      votes: 1, voted: 1, time: "just now", comments: [],
    }, ...prev]);
    setShowCompose(false);
  };

  return (
    <div style={{ background: COLORS.c5, minHeight: "100vh", fontFamily: "sans-serif" }}>
      <Navbar onCreatePost={() => setShowCompose(true)} />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 12px 20px" }}>

        {/* Compose modal */}
        {showCompose && (
          <ComposeModal onClose={() => setShowCompose(false)} onSubmit={submitPost} />
        )}

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 260px", gap: 16 }}>
          {/* Feed column */}
          <div>
            {/* New post bar */}
            <div style={{
              background: COLORS.c3, border: `1.5px solid ${COLORS.c2}`,
              borderRadius: 12, padding: "8px 12px", display: "flex",
              gap: 8, alignItems: "center", marginBottom: 10,
            }}>
              <Avatar initials="You" ui={0} size={32} />
              <input
                readOnly onClick={() => setShowCompose(true)}
                placeholder="Create post..."
                style={{
                  flex: 1, padding: "7px 12px", border: `1.5px solid ${COLORS.c2}`,
                  borderRadius: 8, background: COLORS.c4, color: COLORS.c5,
                  fontSize: 13, cursor: "pointer", outline: "none",
                }}
              />
              <button onClick={() => setShowCompose(true)} style={{
                padding: "6px 12px", borderRadius: 8, background: "none",
                border: `1.5px solid ${COLORS.c1}`, fontSize: 13,
                color: COLORS.c1, cursor: "pointer",
              }}>
                Post
              </button>
            </div>

            {/* Sort bar */}
            <div style={{
              display: "flex", gap: 6, marginBottom: 10, background: COLORS.c3,
              border: `1.5px solid ${COLORS.c2}`, borderRadius: 12, padding: "8px 12px",
            }}>
              {["hot", "new", "top"].map(s => (
                <button key={s} onClick={() => setSortMode(s)} style={{
                  fontSize: 13, padding: "5px 14px", borderRadius: 20, border: "none",
                  background: sortMode === s ? COLORS.c1 : "none",
                  color: sortMode === s ? COLORS.c4 : COLORS.c1,
                  cursor: "pointer", fontWeight: 500, textTransform: "capitalize",
                }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Posts */}
            {sorted.map(post => (
              <PostCard
                key={post.id}
                post={post}
                isOpen={openId === post.id}
                onToggle={() => togglePost(post.id)}
                onVote={dir => votePost(post.id, dir)}
                onVoteComment={(ci, dir) => voteComment(post.id, ci, dir)}
                onAddComment={text => addComment(post.id, text)}
              />
            ))}
          </div>

          {/* Sidebar */}
          <Sidebar
            joined={joined}
            onToggleJoin={toggleJoin}
            onCreatePost={() => setShowCompose(true)}
          />
        </div>
      </div>
      <Footer />
    </div>
  );  
}


