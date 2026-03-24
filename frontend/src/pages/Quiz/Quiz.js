import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { BookOpen, FolderOpen, Clock, CheckCircle, XCircle, RotateCcw, Send, Zap, AlertCircle } from "lucide-react";
import "./Quiz.css";

const API          = "http://localhost:8000";
const QUIZ_DURATION = 30 * 60; // 30 min

// PDF is read on the backend — no browser PDF library needed

// ── Helpers ───────────────────────────────────────────────────────────────────
const GRADE_META = {
  "A+": { label: "Distinction", color: "#1db97a" },
  "A" : { label: "Excellent",   color: "#1db97a" },
  "B" : { label: "Good",        color: "#1565C0" },
  "C" : { label: "Average",     color: "#f0b429" },
  "D" : { label: "Pass",        color: "#f0b429" },
  "F" : { label: "Fail",        color: "#e84545" },
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
  return (
    <div className="qz-score-ring">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="10" />
        <circle cx="65" cy="65" r={R} fill="none" stroke="#f0b429" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C - (pct / 100) * C}
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
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
// PHASE: SELECT
// ══════════════════════════════════════════════════════════════════════════════
function PhaseSelect({ onStart }) {
  const [materials, setMaterials] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState(null);

  useEffect(() => {
    fetch(`${API}/Materials?limit=50`)
      .then(r => r.json())
      .then(d => setMaterials(d.success ? d.data : []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="qz-page">
      <div className="qz-select-hero">
        <h1>📝 Generate Your Quiz</h1>
        <p>Pick a PDF from your library — AI reads it and builds 20 questions instantly.</p>
      </div>

      <div className="qz-select-body">
        <div className="qz-select-label">Select a Study Material</div>

        {loading ? (
          <div className="qz-empty"><div className="qz-empty-icon">⏳</div><div className="qz-empty-text">Loading…</div></div>
        ) : materials.length === 0 ? (
          <div className="qz-empty">
            <div className="qz-empty-icon">📂</div>
            <div className="qz-empty-text">No materials found</div>
            <div className="qz-empty-sub">Upload a PDF first from the Library page.</div>
          </div>
        ) : (
          <div className="qz-mat-grid">
            {materials.map(m => (
              <div
                key={m._id}
                className={`qz-mat-card${selected?._id === m._id ? " selected" : ""}`}
                onClick={() => setSelected(m)}
              >
                <div className="qz-mat-check">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="qz-mat-module">{m.module}</div>
                <div className="qz-mat-title">{m.title}</div>
                <div className="qz-mat-year">{m.year}</div>
                {m.fileSize && (
                  <div className="qz-mat-size">{(m.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`qz-start-bar${selected ? " visible" : ""}`}>
        <div className="qz-start-bar-info">Selected: <span>{selected?.title ?? "—"}</span></div>
        <button className="qz-start-btn" onClick={() => selected && onStart(selected)}>
          <Zap size={15} /> Generate Quiz
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE: GENERATING  (reads PDF in browser → sends text to backend)
// ══════════════════════════════════════════════════════════════════════════════
function PhaseGenerating({ material, onDone, onError }) {
  const [status, setStatus] = useState("Reading PDF…");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        setStatus("Generating questions with AI…");
        const res = await fetch(`${API}/quiz/generate`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ materialId: material._id }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Generation failed");
        onDone(data.data);
      } catch (err) {
        onError(err.message);
      }
    })();
  }, []);

  return (
    <div className="qz-generating">
      <div className="qz-gen-icon"><BookOpen size={32} color="#f0b429" /></div>
      <div className="qz-gen-title">{status}</div>
      <div className="qz-gen-sub">
        Processing <strong style={{ color: "white" }}>{material.title}</strong>.<br />
        This takes 15–30 seconds.
      </div>
      <div className="qz-gen-dots"><span /><span /><span /></div>
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
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); doSubmit(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [submitted]);

  const doSubmit = useCallback((auto = false) => {
    if (submitted) return;
    setSubmitted(true);
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
    fetch(`${API}/quiz/submit`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId:    quiz._id,
        answers:   answers.map(a => (a === null ? -1 : a)),
        timeTaken,
      }),
    })
      .then(r => r.json())
      .then(d => { if (d.success) onSubmit(d.data); })
      .catch(console.error);
  }, [submitted, answers, quiz._id, onSubmit]);

  const answered   = answers.filter(a => a !== null).length;
  const total      = quiz.questions.length;
  const timerClass = timeLeft <= 60 ? "danger" : timeLeft <= 300 ? "warning" : "";

  return (
    <div className="qz-page">
      <div className="qz-header">
        <div className="qz-header-title">{quiz.materialTitle}</div>
        <div className="qz-progress-wrap">
          <div className="qz-progress-bar">
            <div className="qz-progress-fill" style={{ width: `${(answered / total) * 100}%` }} />
          </div>
          <div className="qz-progress-text">{answered}/{total}</div>
        </div>
        <div className={`qz-timer ${timerClass}`}>
          <Clock size={14} />{formatTime(timeLeft)}
        </div>
        <button className="qz-submit-early" onClick={() => doSubmit(false)}>Submit</button>
      </div>

      <div className="qz-questions-wrap">
        {quiz.questions.map((q, qi) => (
          <div key={qi} className="qz-q-card" style={{ animationDelay: `${qi * 0.04}s` }}>
            <div className="qz-q-header">
              <span className="qz-q-num">Q{qi + 1}</span>
              <div className="qz-q-text">{q.question}</div>
            </div>
            <div className="qz-options">
              {q.options.map((opt, oi) => (
                <div
                  key={oi}
                  className={`qz-option${answers[qi] === oi ? " chosen" : ""}`}
                  onClick={() => {
                    if (submitted) return;
                    setAnswers(prev => { const n = [...prev]; n[qi] = oi; return n; });
                  }}
                >
                  <div className="qz-opt-letter">{LETTERS[oi]}</div>
                  <div className="qz-opt-text">{opt}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="qz-footer-bar">
        <div className="qz-footer-answered">
          Answered <strong>{answered}</strong> of <strong>{total}</strong>
        </div>
        <button className="qz-submit-btn" disabled={submitted} onClick={() => doSubmit(false)}>
          <Send size={15} style={{ marginRight: 7 }} /> Submit Quiz
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
          <ScoreRing pct={result.percentage} />
          <div className="qz-score-info">
            <div className="qz-grade-badge">
              <div className="qz-grade-letter">{result.grade}</div>
              <div className="qz-grade-label">
                <strong>{meta.label}</strong>Grade
              </div>
            </div>
            <div className="qz-score-stats">
              <div className="qz-stat">
                <div className="qz-stat-val correct">{correct}</div>
                <div className="qz-stat-label">Correct</div>
              </div>
              <div className="qz-stat">
                <div className="qz-stat-val wrong">{wrong}</div>
                <div className="qz-stat-label">Wrong</div>
              </div>
              <div className="qz-stat">
                <div className="qz-stat-val">{result.total}</div>
                <div className="qz-stat-label">Total</div>
              </div>
              {result.timeTaken && (
                <div className="qz-stat">
                  <div className="qz-stat-val">{formatTime(result.timeTaken)}</div>
                  <div className="qz-stat-label">Time</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="qz-results-actions">
          <button className="qz-btn-outline" onClick={onRetry}>
            <RotateCcw size={14} style={{ marginRight: 6 }} /> Try Another
          </button>
          <button className="qz-btn-solid" onClick={onMyQuiz}>
            <FolderOpen size={14} style={{ marginRight: 6 }} /> My Quiz History
          </button>
        </div>

        <div className="qz-review-label">Answer Review</div>

        {result.questions.map((q, i) => {
          const studentAns = result.answers[i];
          const isCorrect  = studentAns === q.correct;
          return (
            <div key={i} className={`qz-review-card ${isCorrect ? "correct-card" : "wrong-card"}`}>
              <div className="qz-review-q-header">
                <div className="qz-review-icon">
                  {isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
                </div>
                <div className="qz-review-q-text">Q{i + 1}. {q.question}</div>
              </div>
              <div className="qz-review-opts">
                {q.options.map((opt, oi) => {
                  const isCor = oi === q.correct;
                  const isWrong = oi === studentAns && !isCor;
                  return (
                    <div key={oi} className={`qz-review-opt ${isCor ? "is-correct" : isWrong ? "is-wrong" : ""}`}>
                      <div className="qz-review-opt-dot" />
                      <span>{LETTERS[oi]}. {opt}</span>
                    </div>
                  );
                })}
              </div>
              {q.explanation && (
                <div className="qz-review-explanation">💡 {q.explanation}</div>
              )}
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
    fetch(`${API}/quiz/my`)
      .then(r => r.json())
      .then(d => setHistory(d.success ? d.data : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="qz-page">
      <div className="qz-select-hero">
        <h1>📋 My Quiz History</h1>
        <p>All your completed quizzes and scores.</p>
      </div>
      <div className="qz-select-body">
        {loading ? (
          <div className="qz-empty"><div className="qz-empty-icon">⏳</div><div className="qz-empty-text">Loading…</div></div>
        ) : history.length === 0 ? (
          <div className="qz-empty">
            <div className="qz-empty-icon">🎯</div>
            <div className="qz-empty-text">No quizzes yet</div>
            <div className="qz-empty-sub">Complete your first quiz to see it here.</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <button className="qz-btn-outline" onClick={onBack}>← Back</button>
            </div>
            <div className="qz-history-list">
              {history.map(h => (
                <div key={h._id} className="qz-hist-card">
                  <div className={`qz-hist-grade ${gradeClass(h.grade)}`}>{h.grade}</div>
                  <div className="qz-hist-info">
                    <div className="qz-hist-title">{h.materialTitle}</div>
                    <div className="qz-hist-meta">
                      {h.score}/{h.total} correct
                      {h.timeTaken ? ` · ${formatTime(h.timeTaken)}` : ""}
                      {" · "}{new Date(h.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="qz-hist-pct">{h.percentage}%</div>
                </div>
              ))}
            </div>
          </>
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

  const handleStart = (mat) => {
    setMaterial(mat);
    setGenError(null);
    setPhase(PHASE.GENERATING);
  };

  const handleGenDone  = useCallback((q)   => { setQuiz(q);    setPhase(PHASE.QUIZ);     }, []);
  const handleGenError = useCallback((msg) => { setGenError(msg);                          }, []);
  const handleSubmit   = useCallback((res) => { setResult(res); setPhase(PHASE.RESULTS);  }, []);

  const handleRetry = () => {
    setQuiz(null); setResult(null); setMaterial(null);
    setGenError(null); setPhase(PHASE.SELECT);
  };

  return (
    <>
      <Navbar />

      {phase === PHASE.SELECT && <PhaseSelect onStart={handleStart} />}

      {phase === PHASE.GENERATING && material && (
        genError ? (
          <div className="qz-generating">
            <div className="qz-gen-icon"><AlertCircle size={32} color="#e84545" /></div>
            <div className="qz-gen-error">⚠️ {genError}</div>
            <button className="qz-gen-retry" onClick={handleRetry}>← Choose another PDF</button>
          </div>
        ) : (
          <PhaseGenerating material={material} onDone={handleGenDone} onError={handleGenError} />
        )
      )}

      {phase === PHASE.QUIZ    && quiz   && <PhaseQuiz quiz={quiz} onSubmit={handleSubmit} />}
      {phase === PHASE.RESULTS && result && <PhaseResults result={result} onRetry={handleRetry} onMyQuiz={() => setPhase(PHASE.MY_QUIZ)} />}
      {phase === PHASE.MY_QUIZ           && <PhaseMyQuiz onBack={() => setPhase(PHASE.SELECT)} />}

      <Footer />
    </>
  );
}