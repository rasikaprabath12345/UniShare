import { useState, useRef, useCallback } from "react";
import "./UploadPdf.css";

const MODULES = [
  "IT1102 — Database", "IT1201 — Networking", "IT2105 — Programming",
  "IT3301 — Security", "IT2204 — Data Structures", "IT3402 — Machine Learning",
];
const YEARS = [
  "Year 1 — Semester 1", "Year 1 — Semester 2", "Year 2 — Semester 1",
  "Year 2 — Semester 2", "Year 3 — Semester 1", "Year 3 — Semester 2",
];
const PROGRESS_LABELS = ["Encrypting file…", "Uploading to servers…", "Processing PDF…", "Almost done…"];

// ── Read current user from localStorage ──────────────────────────────────────
const getUser = () => {
  try { return JSON.parse(localStorage.getItem("user")); }
  catch { return null; }
};

function UploadIcon({ color = "white", size = 22 }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0120 9.414V19a2 2 0 01-2 2z" />
    </svg>
  );
}

export default function UploadPdf({ onClose }) {
  // ── Resolve user once on mount ──────────────────────────────────────────────
  const [user]      = useState(() => getUser());
  const userId      = user?._id || user?.id || null;

  const [file, setFile]             = useState(null);
  const [dragging, setDragging]     = useState(false);
  const [title, setTitle]           = useState("");
  const [module, setModule]         = useState("");
  const [year, setYear]             = useState("");
  const [desc, setDesc]             = useState("");
  const [tags, setTags]             = useState([]);
  const [tagInput, setTagInput]     = useState("");
  const [visibility, setVisibility] = useState("public");
  const [progress, setProgress]     = useState(0);
  const [uploading, setUploading]   = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState("");

  const fileRef     = useRef();
  const tagInputRef = useRef();
  const intervalRef = useRef();

  const step     = success ? 3 : file && title && module && year && desc ? 3 : file ? 2 : 1;
  const canSubmit = !!(file && title.trim().length > 2 && module && year && desc.trim().length > 10);

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setError("");
    } else if (f) {
      setError("Only PDF files are accepted.");
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const addTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const v = tagInput.trim().replace(/,/g, "");
      if (v && !tags.includes(v) && tags.length < 8) {
        setTags((prev) => [...prev, v]);
        setTagInput("");
      }
    }
    if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  // ── Submit with userId attached ─────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!userId) {
      setError("You must be logged in to upload notes.");
      return;
    }

    setUploading(true);
    setError("");
    setProgress(10);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => Math.min(prev + 7, 85));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file",        file);
      formData.append("title",       title);
      formData.append("module",      module);
      formData.append("year",        year);
      formData.append("description", desc);
      formData.append("tags",        JSON.stringify(tags));
      formData.append("visibility",  visibility);
      formData.append("userId",      userId);          // ← current user's ID
      formData.append("isPublic",    visibility === "public" ? "true" : "false");

      const res = await fetch("http://localhost:8000/Materials", {
        method: "POST",
        body: formData,
        // Do NOT set Content-Type — browser sets multipart/form-data boundary automatically
      });

      clearInterval(intervalRef.current);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Upload failed. Please try again.");
      }

      setProgress(100);
      setTimeout(() => setSuccess(true), 400);
    } catch (err) {
      clearInterval(intervalRef.current);
      setUploading(false);
      setProgress(0);
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setModule("");
    setYear("");
    setDesc("");
    setTags([]);
    setTagInput("");
    setVisibility("public");
    setProgress(0);
    setUploading(false);
    setSuccess(false);
    setError("");
  };

  const progressLabel = PROGRESS_LABELS[Math.min(Math.floor(progress / 26), 3)];
  const stepState = (n) => (step > n ? "done" : step === n ? "active" : "");

  return (
    <div className="un-root">
      <div className="un-card">

        {/* ── Header ── */}
        <div className="un-header">
          <div className="un-header-left">
            <div className="un-header-icon"><UploadIcon /></div>
            <div>
              <div className="un-title">Upload Notes PDF</div>
              <div className="un-subtitle">
                {user?.name ? `Uploading as ${user.name}` : "Share your knowledge with the community"}
              </div>
            </div>
          </div>
          <button className="un-close-btn" onClick={onClose ?? (() => window.history.back())}>
            <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Steps ── */}
        <div className="un-steps">
          {["Upload File", "Add Details", "Publish"].map((label, i) => {
            const n  = i + 1;
            const st = stepState(n);
            return (
              <>
                <div className={`un-step ${st}`} key={label}>
                  <div className="un-step-num">{st === "done" ? "✓" : n}</div>
                  {label}
                </div>
                {i < 2 && (
                  <div
                    className={`un-step-line ${step > n ? "done" : ""}`}
                    key={`line-${i}`}
                  />
                )}
              </>
            );
          })}
        </div>

        {/* ── Body ── */}
        <div className="un-body">

          {/* Dropzone */}
          <div
            className={`un-dropzone${dragging ? " drag-over" : ""}${file ? " has-file" : ""}`}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <div className={`un-dz-icon${file ? " success" : ""}`}>
              {file ? (
                <svg width={26} height={26} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg width={26} height={26} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>
            {file ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div className="un-dz-fname">{file.name}</div>
                <div className="un-dz-fsize">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                <span className="un-dz-change">Change file</span>
              </div>
            ) : (
              <>
                <div className="un-dz-title">Drag &amp; drop your PDF here</div>
                <div className="un-dz-sub">or click to browse from your device</div>
                <div className="un-dz-badge">PDF only · Max 50 MB</div>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* Title */}
          <div className="un-field">
            <label className="un-label">
              Note Title <span className="un-req">*</span>
              <span className="un-hint">Keep it clear and specific</span>
            </label>
            <input
              className="un-input"
              type="text"
              maxLength={100}
              placeholder="e.g. IT1201 Networking — Chapter 4 Subnetting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="un-char-count">{title.length} / 100</div>
          </div>

          {/* Module + Year */}
          <div className="un-row">
            <div className="un-field" style={{ marginTop: 0 }}>
              <label className="un-label">Module Code <span className="un-req">*</span></label>
              <div className="un-select-wrap">
                <select className="un-select" value={module} onChange={(e) => setModule(e.target.value)}>
                  <option value="">Select module…</option>
                  {MODULES.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="un-field" style={{ marginTop: 0 }}>
              <label className="un-label">Academic Year <span className="un-req">*</span></label>
              <div className="un-select-wrap">
                <select className="un-select" value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">Select year…</option>
                  {YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="un-field">
            <label className="un-label">
              Description <span className="un-req">*</span>
              <span className="un-hint">What's covered?</span>
            </label>
            <textarea
              className="un-textarea"
              maxLength={500}
              placeholder="Describe the topics covered, exam relevance, and what makes these notes useful…"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <div className="un-char-count">{desc.length} / 500</div>
          </div>

          {/* Tags */}
          <div className="un-field">
            <label className="un-label">
              Tags <span style={{ fontWeight: 400, color: "#64748b" }}>(optional)</span>
            </label>
            <div className="un-tags-wrap" onClick={() => tagInputRef.current.focus()}>
              {tags.map((t, i) => (
                <div className="un-tag" key={t}>
                  {t}
                  <button
                    className="un-tag-remove"
                    onClick={(e) => { e.stopPropagation(); setTags(tags.filter((_, j) => j !== i)); }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                ref={tagInputRef}
                className="un-tag-input"
                placeholder={tags.length ? "" : "Type a tag and press Enter…"}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
              />
            </div>
          </div>

          {/* Visibility */}
          <div className="un-field">
            <label className="un-label">Visibility</label>
            <div className="un-vis-row">
              {[
                { val: "public",  icon: "🌐", label: "Public",  desc: "All students" },
                { val: "private", icon: "🔒", label: "Private", desc: "Only you" },
              ].map((v) => (
                <button
                  key={v.val}
                  className={`un-vis-btn${visibility === v.val ? " selected" : ""}`}
                  onClick={() => setVisibility(v.val)}
                >
                  <span className="un-vis-icon">{v.icon}</span>
                  <span className="un-vis-label">{v.label}</span>
                  <span className="un-vis-desc">{v.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Not logged in warning */}
          {!userId && (
            <div style={{
              background: "#fffbeb", border: "1px solid #fde68a",
              color: "#92400e", borderRadius: 8,
              padding: "10px 14px", fontSize: 13, marginTop: 16,
            }}>
              ⚠️ You are not logged in. Please log in before uploading.
            </div>
          )}

          {/* Error message */}
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              color: "#dc2626", borderRadius: 8,
              padding: "10px 14px", fontSize: 13, marginTop: 4,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Progress bar */}
          {uploading && (
            <div className="un-progress">
              <div className="un-progress-header">
                <span className="un-progress-label">{progress >= 100 ? "Complete!" : progressLabel}</span>
                <span className="un-progress-pct">{Math.round(progress)}%</span>
              </div>
              <div className="un-progress-bar">
                <div className="un-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="un-footer">
          <button className="un-btn-cancel" onClick={onClose ?? (() => window.history.back())}>
            Cancel
          </button>
          <button
            className="un-btn-submit"
            disabled={!canSubmit || uploading || !userId}
            onClick={handleSubmit}
          >
            <UploadIcon size={16} />
            {uploading ? "Uploading…" : "Publish Notes"}
          </button>
        </div>

        {/* ── Success overlay ── */}
        {success && (
          <div className="un-success">
            <div className="un-success-ring">
              <svg width={34} height={34} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="un-success-title">Notes Published! 🎉</div>
            <div className="un-success-sub">
              Your notes are now live and helping students across Sri Lanka. You've earned recognition points!
            </div>
            <button className="un-btn-done" onClick={resetForm}>Upload Another</button>
          </div>
        )}

      </div>
    </div>
  );
}