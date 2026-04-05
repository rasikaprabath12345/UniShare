import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  BookOpen, FolderOpen, Clock, CheckCircle, XCircle,
  RotateCcw, Send, Zap, AlertCircle, History,
  ChevronRight, Brain, Lock, Globe
} from "lucide-react";
import "./Quiz.css";

const API           = "http://localhost:8000";
const QUIZ_DURATION = 30 * 60;

// ── Auth helper ───────────────────────────────────────────────────────────────
const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) return user._id;
    if (user?.id)  return user.id;
  } catch { /* continue */ }
  return null;
};

// ── Module images — IDENTICAL paths & keys to Library.js ─────────────────────
const MODULE_IMAGE = {
  "IT1102 — Database":         "../images/image3.png",
  "IT1201 — Networking":       "../images/image1.jpg",
  "IT2105 — Programming":      "../images/image2.png",
  "IT3301 — Security":         "../images/image4.png",
  "IT2204 — Data Structures":  "../images/image2.png",
  "IT3402 — Machine Learning": "../images/image5.png",
};
const MODULE_FALLBACK = {
  "IT1102 — Database":         "#1a3a6e",
  "IT1201 — Networking":       "#0d4f3c",
  "IT2105 — Programming":      "#4a1f6e",
  "IT3301 — Security":         "#6e1f1f",
  "IT2204 — Data Structures":  "#1f4a6e",
  "IT3402 — Machine Learning": "#1f6e5a",
};

// Direct lookup by full module name — same pattern as Library.js (note.module)
const getModuleImage    = (module = "") => MODULE_IMAGE[module]    || null;
const getModuleFallback = (module = "") => MODULE_FALLBACK[module] || "#0d2257";

// ── Grade helpers ─────────────────────────────────────────────────────────────
const GRADE_META = {
  "A+": { label: "Distinction", icon: "🏆" },
  "A" : { label: "Excellent",   icon: "⭐" },
  "B" : { label: "Good",        icon: "👍" },
  "C" : { label: "Average",     icon: "📘" },
  "D" : { label: "Pass",        icon: "✅" },
  "F" : { label: "Fail",        icon: "❌" },
};
const LETTERS = ["A", "B", "C", "D"];

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}
function gradeClass(g = "") {
  if (g === "A+" || g === "A") return "grade-a";
  if (g === "B")               return "grade-b";
  if (g === "C" || g === "D")  return "grade-c";
  return "grade-f";
}

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ pct }) {
  const R = 54, C = 2 * Math.PI * R;
  const color = pct >= 80 ? "#1db97a" : pct >= 60 ? "#f0b429" : "#e84545";
  return (
    <div className="qz-score-ring">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <circle cx="70" cy="70" r={R} fill="none" stroke={color} strokeWidth="12"
          strokeLinecap="round" strokeDasharray={C}
          strokeDashoffset={C - (pct / 100) * C}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div className="qz-score-ring-center">
        <div className="qz-score-pct">{pct}%</div>
        <div className="qz-score-pct-label">Score</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MATERIAL CARD
// ══════════════════════════════════════════════════════════════════════════════
function MatCard({ m, isSelected, onSelect }) {
  // Use m.module directly — same as Library.js uses note.module
  const image     = getModuleImage(m.module);
  const fallback  = getModuleFallback(m.module);
  const isPrivate = m.visibility === "private";

  return (
    <div
      className={`qz-mat-card${isSelected ? " selected" : ""}${isPrivate ? " private-card" : ""}`}
      onClick={() => onSelect(m)}
    >
      {/* ── Image thumbnail — same structure as NoteCard in Library.js ── */}
      <div
        className="qz-mat-thumb"
        style={{
          backgroundImage: image ? `url("${image}")` : "none",
          backgroundColor: fallback,
        }}
      >
        <div className="qz-mat-thumb-overlay" />
        <div className="qz-mat-thumb-module">{m.module}</div>

        {/* Visibility badge — top-left */}
        <div className={`qz-mat-vis-badge ${isPrivate ? "private" : "public"}`}>
          {isPrivate ? <Lock size={9} /> : <Globe size={9} />}
          <span>{isPrivate ? "Private" : "Public"}</span>
        </div>

        {/* Selected check — top-right */}
        {isSelected && (
          <div className="qz-mat-selected-check">
            <CheckCircle size={14} /> Selected
          </div>
        )}
      </div>

      {/* ── Card body ── */}
      <div className="qz-mat-body">
        <div className="qz-mat-module-pill">
          {m.module?.split("—")[0]?.trim() || m.module}
        </div>
        <div className="qz-mat-title">{m.title}</div>
        {m.description && (
          <div className="qz-mat-desc">
            {m.description.slice(0, 80)}{m.description.length > 80 ? "…" : ""}
          </div>
        )}
        <div className="qz-mat-footer">
          <span className="qz-mat-year">{m.year}</span>
          {m.fileSize && (
            <span className="qz-mat-size">
              {(m.fileSize / 1024 / 1024).toFixed(1)} MB
            </span>
          )}
        </div>
      </div>

      {/* ── Hover CTA ── */}
      <div className="qz-mat-hover-cta">
        <Zap size={13} /> Generate Quiz <ChevronRight size={13} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE: SELECT
// ══════════════════════════════════════════════════════════════════════════════
function PhaseSelect({ onStart, onMyQuiz }) {
  const [materials, setMaterials] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const userId = getUserId();

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 100 });
    if (userId) params.append("userId", userId);
    fetch(`${API}/Materials?${params}`)
      .then(r => r.json())
      .then(d => setMaterials(d.success ? d.data : []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  }, [userId]);

  const isOwn = (m) => !!userId && String(m.user?._id ?? m.user ?? "") === String(userId);

  const displayed = materials.filter((m) => {
    if (activeTab === "mine") return isOwn(m);
    // All tab: public + current user's own private
    return m.visibility === "public" || isOwn(m);
  });

  return (
    <div className="qz-page">
      {/* ── Hero ── */}
      <div className="qz-select-hero">
        <div className="qz-hero-bg-img" />
        <div className="qz-hero-overlay" />
        <div className="qz-hero-bg">
          <div className="qz-hero-orb qz-hero-orb-1" />
          <div className="qz-hero-orb qz-hero-orb-2" />
          <div className="qz-hero-orb qz-hero-orb-3" />
          <div className="qz-hero-grid" />
        </div>
        <div className="qz-hero-content">
          {/* Badge chip */}
          <div className="qz-hero-badge">
            <Brain size={14} />
            <span>AI-Powered Quiz Engine</span>
          </div>

          {/* Glass bio card — same pattern as Library hero */}
          <div className="qz-hero-bio-card">
            <h1>Generate Your Quiz</h1>
            <p>Pick a PDF from your library — AI reads it and builds 20 questions instantly.</p>
          </div>

          {/* Stats row */}
          <div className="qz-hero-stats">
            <div className="qz-hero-stat"><span>20</span><small>Questions</small></div>
            <div className="qz-hero-stat-divider" />
            <div className="qz-hero-stat"><span>30</span><small>Minutes</small></div>
            <div className="qz-hero-stat-divider" />
            <div className="qz-hero-stat"><span>AI</span><small>Graded</small></div>
          </div>
        </div>
      </div>

      <div className="qz-select-body">
        {/* ── Controls row ── */}
        <div className="qz-select-top-row">
          <div className="qz-mat-tabs">
            <button
              className={`qz-mat-tab${activeTab === "all" ? " active" : ""}`}
              onClick={() => { setActiveTab("all"); setSelected(null); }}
            >
              <Globe size={13} /> All Materials
            </button>
            {userId && (
              <button
                className={`qz-mat-tab${activeTab === "mine" ? " active" : ""}`}
                onClick={() => { setActiveTab("mine"); setSelected(null); }}
              >
                <Lock size={13} /> My Materials
              </button>
            )}
          </div>

          <button className="qz-history-top-btn" onClick={onMyQuiz}>
            <History size={14} /> My Quiz History
          </button>
        </div>

        {/* ── Section label ── */}
        <div className="qz-section-header">
          <span className="qz-section-label">
            {activeTab === "mine" ? "My Uploads" : "Select a Study Material"}
          </span>
          {!loading && displayed.length > 0 && (
            <span className="qz-section-count">{displayed.length} materials</span>
          )}
          <div className="qz-section-line" />
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="qz-mat-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="qz-mat-skeleton">
                <div className="sk-thumb" />
                <div className="sk-body">
                  <div className="sk-line sk-short" />
                  <div className="sk-line sk-full" />
                  <div className="sk-line sk-med" />
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="qz-empty">
            <div className="qz-empty-icon">📂</div>
            <div className="qz-empty-text">
              {activeTab === "mine" ? "No uploads yet" : "No materials found"}
            </div>
            <div className="qz-empty-sub">
              {activeTab === "mine"
                ? "Upload a PDF from the Library page first."
                : "Upload a PDF first from the Library page."}
            </div>
          </div>
        ) : (
          <div className="qz-mat-grid">
            {displayed.map((m) => (
              <MatCard
                key={m._id}
                m={m}
                isSelected={selected?._id === m._id}
                onSelect={setSelected}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Sticky start bar ── */}
      <div className={`qz-start-bar${selected ? " visible" : ""}`}>
        <div className="qz-start-bar-info">
          <BookOpen size={15} style={{ marginRight: 8 }} />
          <span>{selected?.title ?? "—"}</span>
          {selected?.visibility === "private" && (
            <span className="qz-start-bar-private"><Lock size={11} /> Private</span>
          )}
        </div>
        <button className="qz-start-btn" onClick={() => selected && onStart(selected)}>
          <Zap size={15} /> Generate Quiz
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE: GENERATING
// ══════════════════════════════════════════════════════════════════════════════
function PhaseGenerating({ material, onDone, onError }) {
  const [step, setStep] = useState(0);
  const ran = useRef(false);
  const steps = [
    "Reading PDF content…",
    "Analysing key concepts…",
    "Generating 20 questions with AI…",
    "Validating question quality…",
  ];

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const interval = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 6000);
    (async () => {
      try {
        const userId = getUserId();
        const body = { materialId: material._id };
        if (userId) body.userId = userId;
        const res = await fetch(`${API}/quiz/generate`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) { const t = await res.text(); throw new Error(`Server error ${res.status}: ${t}`); }
        const data = await res.json();
        clearInterval(interval);
        if (!data.success) throw new Error(data.message || "Generation failed");
        onDone(data.data);
      } catch (err) {
        clearInterval(interval);
        onError(err.message || "Unknown error — check your connection and try again.");
      }
    })();
    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  const image    = getModuleImage(material.module);
  const fallback = getModuleFallback(material.module);

  return (
    <div className="qz-generating">
      <div className="qz-gen-bg">
        <div className="qz-gen-orb qz-gen-orb-1" />
        <div className="qz-gen-orb qz-gen-orb-2" />
      </div>
      <div className="qz-gen-card">
        {/* Mini thumbnail of selected material */}
        <div
          className="qz-gen-material-preview"
          style={{
            backgroundImage: image ? `url("${image}")` : "none",
            backgroundColor: fallback,
          }}
        >
          <div className="qz-gen-preview-overlay" />
          <div className="qz-gen-preview-label">{material.module}</div>
        </div>

        <div className="qz-gen-icon-wrap">
          <div className="qz-gen-icon-ring" />
          <div className="qz-gen-icon-ring qz-gen-icon-ring-2" />
          <BookOpen size={34} color="#f0b429" />
        </div>
        <div className="qz-gen-title">Building Your Quiz</div>
        <div className="qz-gen-sub">Processing <strong>{material.title}</strong></div>
        <div className="qz-gen-steps">
          {steps.map((s, i) => (
            <div key={i} className={`qz-gen-step ${i < step ? "done" : i === step ? "active" : "pending"}`}>
              <div className="qz-gen-step-dot" />
              <span>{s}</span>
            </div>
          ))}
        </div>
        <div className="qz-gen-dots"><span /><span /><span /></div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE: QUIZ
// ══════════════════════════════════════════════════════════════════════════════
function PhaseQuiz({ quiz, onSubmit }) {
  const [answers,   setAnswers]   = useState(Array(quiz.questions.length).fill(null));
  const [timeLeft,  setTimeLeft]  = useState(QUIZ_DURATION);
  const [submitted, setSubmitted] = useState(false);
  const [activeQ,   setActiveQ]   = useState(0);
  const startTime    = useRef(Date.now());
  const questionRefs = useRef([]);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(t); doSubmit(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [submitted]);

  const doSubmit = useCallback((auto = false) => {
    if (submitted) return;
    setSubmitted(true);
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
    const userId = getUserId();
    fetch(`${API}/quiz/submit`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId: quiz._id, answers: answers.map(a => (a === null ? -1 : a)),
        timeTaken, ...(userId ? { userId } : {}),
      }),
    }).then(r => r.json()).then(d => { if (d.success) onSubmit(d.data); }).catch(console.error);
  }, [submitted, answers, quiz._id, onSubmit]);

  const handleAnswer = (qi, oi) => {
    if (submitted) return;
    setAnswers(prev => { const n = [...prev]; n[qi] = oi; return n; });
    if (qi < quiz.questions.length - 1) {
      setTimeout(() => {
        questionRefs.current[qi + 1]?.scrollIntoView({ behavior: "smooth", block: "center" });
        setActiveQ(qi + 1);
      }, 300);
    }
  };

  const answered   = answers.filter(a => a !== null).length;
  const total      = quiz.questions.length;
  const pct        = Math.round((answered / total) * 100);
  const timerClass = timeLeft <= 60 ? "danger" : timeLeft <= 300 ? "warning" : "";

  return (
    <div className="qz-page qz-quiz-page">
      <div className="qz-header">
        <div className="qz-header-title">{quiz.materialTitle}</div>
        <div className="qz-progress-wrap">
          <div className="qz-progress-bar">
            <div className="qz-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="qz-progress-text">{answered}/{total}</div>
        </div>
        <div className={`qz-timer ${timerClass}`}>
          <Clock size={14} />{formatTime(timeLeft)}
        </div>
        <button className="qz-submit-early" onClick={() => doSubmit(false)}>
          Submit <ChevronRight size={12} />
        </button>
      </div>

      <div className="qz-dot-nav">
        {quiz.questions.map((_, i) => (
          <div key={i}
            className={`qz-dot ${answers[i] !== null ? "answered" : ""} ${activeQ === i ? "active" : ""}`}
            onClick={() => { questionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" }); setActiveQ(i); }}
            title={`Q${i + 1}`}
          />
        ))}
      </div>

      <div className="qz-questions-wrap">
        {quiz.questions.map((q, qi) => (
          <div key={qi}
            ref={el => (questionRefs.current[qi] = el)}
            className={`qz-q-card${activeQ === qi ? " active-q" : ""}`}
            style={{ animationDelay: `${qi * 0.04}s` }}
            onClick={() => setActiveQ(qi)}
          >
            <div className="qz-q-header">
              <span className="qz-q-num">Q{qi + 1}<span className="qz-q-total">/{total}</span></span>
              <div className="qz-q-text">{q.question}</div>
              {answers[qi] !== null && <div className="qz-q-answered-tick"><CheckCircle size={16} /></div>}
            </div>
            <div className="qz-options">
              {q.options.map((opt, oi) => (
                <div key={oi}
                  className={`qz-option${answers[qi] === oi ? " chosen" : ""}`}
                  onClick={(e) => { e.stopPropagation(); handleAnswer(qi, oi); }}
                >
                  <div className="qz-opt-letter">{LETTERS[oi]}</div>
                  <div className="qz-opt-text">{opt}</div>
                  {answers[qi] === oi && <div className="qz-opt-check"><CheckCircle size={14} /></div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="qz-footer-bar">
        <div className="qz-footer-progress">
          <div className="qz-footer-pct-ring">
            <svg viewBox="0 0 36 36" width="44" height="44">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#e8eef7" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="#1565C0" strokeWidth="3"
                strokeDasharray={`${pct * 0.94} 94`} strokeLinecap="round"
                style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
            </svg>
            <span>{pct}%</span>
          </div>
          <div className="qz-footer-answered">
            <strong>{answered}</strong> of <strong>{total}</strong> answered
          </div>
        </div>
        <button className="qz-submit-btn" disabled={submitted} onClick={() => doSubmit(false)}>
          <Send size={15} /> Submit Quiz
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE: RESULTS
// ══════════════════════════════════════════════════════════════════════════════
function PhaseResults({ result, onRetry, onMyQuiz }) {
  const meta    = GRADE_META[result.grade] || GRADE_META["F"];
  const correct = result.score;
  const wrong   = result.total - correct;

  return (
    <div className="qz-page">
      <div className="qz-results">
        <div className="qz-score-card">
          <div className="qz-score-card-bg" />
          <ScoreRing pct={result.percentage} />
          <div className="qz-score-info">
            <div className="qz-grade-badge">
              <span className="qz-grade-emoji">{meta.icon}</span>
              <div className="qz-grade-letter">{result.grade}</div>
              <div className="qz-grade-label">
                <strong>{meta.label}</strong><span>Grade</span>
              </div>
            </div>
            <div className="qz-score-stats">
              {[
                { val: correct,      label: "Correct", cls: "correct" },
                { val: wrong,        label: "Wrong",   cls: "wrong"   },
                { val: result.total, label: "Total"                   },
                ...(result.timeTaken ? [{ val: formatTime(result.timeTaken), label: "Time" }] : []),
              ].map((s, i) => (
                <div key={i} className="qz-stat">
                  <div className={`qz-stat-val ${s.cls || ""}`}>{s.val}</div>
                  <div className="qz-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="qz-results-actions">
          <button className="qz-btn-outline" onClick={onRetry}><RotateCcw size={14} /> Try Another</button>
          <button className="qz-btn-solid"   onClick={onMyQuiz}><FolderOpen size={14} /> My Quiz History</button>
        </div>

        <div className="qz-review-label">Answer Review</div>

        {result.questions.map((q, i) => {
          const studentAns = result.answers[i];
          const isCorrect  = studentAns === q.correct;
          return (
            <div key={i} className={`qz-review-card ${isCorrect ? "correct-card" : "wrong-card"}`}>
              <div className="qz-review-q-header">
                <div className="qz-review-icon">
                  {isCorrect ? <CheckCircle size={13} /> : <XCircle size={13} />}
                </div>
                <div className="qz-review-q-text">Q{i + 1}. {q.question}</div>
              </div>
              <div className="qz-review-opts">
                {q.options.map((opt, oi) => {
                  const isCor   = oi === q.correct;
                  const isWrong = oi === studentAns && !isCor;
                  return (
                    <div key={oi} className={`qz-review-opt ${isCor ? "is-correct" : isWrong ? "is-wrong" : ""}`}>
                      <div className="qz-review-opt-dot" />
                      <span>{LETTERS[oi]}. {opt}</span>
                    </div>
                  );
                })}
              </div>
              {q.explanation && <div className="qz-review-explanation">💡 {q.explanation}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE: MY QUIZ HISTORY
// ══════════════════════════════════════════════════════════════════════════════
function PhaseMyQuiz({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserId();
    fetch(userId ? `${API}/quiz/my?userId=${userId}` : `${API}/quiz/my`)
      .then(r => r.json())
      .then(d => setHistory(d.success ? d.data : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const avg  = history.length ? Math.round(history.reduce((s, h) => s + (h.percentage || 0), 0) / history.length) : 0;
  const best = history.length ? Math.max(...history.map(h => h.percentage || 0)) : 0;

  return (
    <div className="qz-page">
      <div className="qz-select-hero">
        <div className="qz-hero-bg-img" />
        <div className="qz-hero-overlay" />
        <div className="qz-hero-bg">
          <div className="qz-hero-orb qz-hero-orb-1" />
          <div className="qz-hero-orb qz-hero-orb-2" />
          <div className="qz-hero-grid" />
        </div>
        <div className="qz-hero-content">
          <div className="qz-hero-badge"><History size={14} /><span>Quiz Records</span></div>
          <div className="qz-hero-bio-card">
            <h1>My Quiz History</h1>
            <p>Track your progress and review past performances.</p>
          </div>
          {history.length > 0 && (
            <div className="qz-hero-stats">
              <div className="qz-hero-stat"><span>{history.length}</span><small>Quizzes</small></div>
              <div className="qz-hero-stat-divider" />
              <div className="qz-hero-stat"><span>{avg}%</span><small>Average</small></div>
              <div className="qz-hero-stat-divider" />
              <div className="qz-hero-stat"><span>{best}%</span><small>Best</small></div>
            </div>
          )}
        </div>
      </div>

      <div className="qz-select-body">
        <div className="qz-select-top-row">
          <button className="qz-btn-outline" onClick={onBack}>← Back to Quiz</button>
        </div>

        {loading ? (
          <div className="qz-empty"><div className="qz-empty-icon">⏳</div><div className="qz-empty-text">Loading…</div></div>
        ) : history.length === 0 ? (
          <div className="qz-empty">
            <div className="qz-empty-icon">🎯</div>
            <div className="qz-empty-text">No quizzes yet</div>
            <div className="qz-empty-sub">Complete your first quiz to see it here.</div>
          </div>
        ) : (
          <div className="qz-history-list">
            {history.map((h, i) => (
              <div key={h._id} className="qz-hist-card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`qz-hist-grade ${gradeClass(h.grade)}`}>{h.grade}</div>
                <div className="qz-hist-bar" style={{ width: `${h.percentage}%` }} />
                <div className="qz-hist-info">
                  <div className="qz-hist-title">{h.materialTitle}</div>
                  <div className="qz-hist-meta">
                    <span><CheckCircle size={11} /> {h.score}/{h.total} correct</span>
                    {h.timeTaken && <span><Clock size={11} /> {formatTime(h.timeTaken)}</span>}
                    <span>{new Date(h.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
                <div className="qz-hist-pct-wrap">
                  <div className="qz-hist-pct">{h.percentage}%</div>
                  <div className={`qz-hist-grade-dot ${gradeClass(h.grade)}`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
const PHASE = { SELECT: "select", GENERATING: "generating", QUIZ: "quiz", RESULTS: "results", MY_QUIZ: "my_quiz" };

export default function Quiz() {
  const [phase,    setPhase]    = useState(PHASE.SELECT);
  const [material, setMaterial] = useState(null);
  const [quiz,     setQuiz]     = useState(null);
  const [result,   setResult]   = useState(null);
  const [genError, setGenError] = useState(null);

  const handleStart    = (mat) => { setMaterial(mat); setGenError(null); setPhase(PHASE.GENERATING); };
  const handleGenDone  = useCallback((q)   => { setQuiz(q);    setPhase(PHASE.QUIZ);    }, []);
  const handleGenError = useCallback((msg) => { setGenError(msg);                        }, []);
  const handleSubmit   = useCallback((res) => { setResult(res); setPhase(PHASE.RESULTS); }, []);
  const handleRetry    = () => { setQuiz(null); setResult(null); setMaterial(null); setGenError(null); setPhase(PHASE.SELECT); };

  return (
    <>
      <Navbar />

      {phase === PHASE.SELECT && (
        <PhaseSelect onStart={handleStart} onMyQuiz={() => setPhase(PHASE.MY_QUIZ)} />
      )}

      {phase === PHASE.GENERATING && material && (
        genError ? (
          <div className="qz-generating">
            <div className="qz-gen-bg"><div className="qz-gen-orb qz-gen-orb-1" /></div>
            <div className="qz-gen-card">
              <div className="qz-gen-icon-wrap" style={{ background: "rgba(232,69,69,0.12)" }}>
                <AlertCircle size={32} color="#e84545" />
              </div>
              <div className="qz-gen-title" style={{ color: "#e84545" }}>Generation Failed</div>
              <div className="qz-gen-error">⚠️ {genError}</div>
              <button className="qz-gen-retry" onClick={handleRetry}>← Choose another PDF</button>
            </div>
          </div>
        ) : (
          <PhaseGenerating material={material} onDone={handleGenDone} onError={handleGenError} />
        )
      )}

      {phase === PHASE.QUIZ    && quiz   && <PhaseQuiz quiz={quiz} onSubmit={handleSubmit} />}
      {phase === PHASE.RESULTS && result && <PhaseResults result={result} onRetry={handleRetry} onMyQuiz={() => setPhase(PHASE.MY_QUIZ)} />}
      {phase === PHASE.MY_QUIZ            && <PhaseMyQuiz onBack={() => setPhase(PHASE.SELECT)} />}

      <Footer />
    </>
  );
}