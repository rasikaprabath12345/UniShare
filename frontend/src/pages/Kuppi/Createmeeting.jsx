import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Video, Calendar, Clock, BookOpen,
  Link, AlignLeft, ChevronRight, Hash, Layers
} from "lucide-react";

const MODULES = [
  "IT1201 — Networking",
  "IT2105 — Programming",
  "IT1102 — Database",
  "IT3301 — Security",
  "IT2203 — Software Eng.",
  "IT1303 — Web Dev",
];

const SEMESTERS = [1, 2];

export default function CreateMeeting() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    meetingLink: "",
    scheduledAt: "",
    scheduledTime: "",
    year: new Date().getFullYear(),
    semester: "",
    module: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = "Title is required.";
    if (!form.meetingLink.trim()) e.meetingLink  = "Meeting link is required.";
    if (!form.scheduledAt)        e.scheduledAt  = "Date is required.";
    if (!form.scheduledTime)      e.scheduledTime= "Time is required.";
    if (!form.semester)           e.semester     = "Semester is required.";
    if (!form.module)             e.module       = "Module is required.";
    return e;
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    // Combine date + time into one ISO string for scheduledAt
    const scheduledAt = new Date(`${form.scheduledAt}T${form.scheduledTime}`).toISOString();

    const payload = {
      title:       form.title,
      description: form.description,
      meetingLink: form.meetingLink,
      scheduledAt,
      year:        Number(form.year),
      semester:    Number(form.semester),
      module:      form.module,
      // ownerId will come from auth context / JWT on backend
    };

    // POST /api/meetings  — body: payload
    console.log("Meeting payload:", payload);
    setSubmitted(true);
  };

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; }

        /* ── HERO ── */
        .cm-hero {
          position: relative;
          padding: 60px 50px 70px;
          text-align: center;
          overflow: hidden;
          min-height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .cm-hero-bg {
          position: absolute; inset: 0;
          background-image: url("../images/background2.jpg");
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        .cm-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0.10) 0%,
            rgba(255,255,255,0.30) 50%,
            rgba(255,255,255,0.55) 100%
          );
          z-index: 1;
        }
        .cm-hero-bio {
          position: relative; z-index: 2;
          max-width: 520px;
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(21,101,192,0.15);
          border-radius: 16px;
          padding: 26px 30px;
          text-align: left;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 24px rgba(21,101,192,0.10);
        }
        .cm-hero-heading {
          font-size: 1.5rem; font-weight: 800; color: #0d2257;
          margin-bottom: 8px; line-height: 1.2;
        }
        .cm-hero-text {
          font-size: 0.88rem; color: #555; line-height: 1.7; margin: 0;
        }

        /* ── PAGE BODY ── */
        .cm-body {
          max-width: 680px;
          margin: 0 auto;
          padding: 40px 20px 70px;
        }

        /* ── SECTION HEADER ── */
        .cm-section-header {
          display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
        }
        .cm-section-label {
          display: inline-block;
          background: #e8f0fe; color: #1565C0;
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          padding: 6px 14px; border-radius: 20px;
          white-space: nowrap;
        }
        .cm-section-line { flex: 1; height: 1px; background: #dde8f8; }

        /* ── FORM CARD ── */
        .cm-card {
          background: white;
          border: 1px solid #e8f0fe;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(21,101,192,0.08);
          overflow: hidden;
        }
        .cm-card-header {
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          padding: 20px 26px;
          display: flex; align-items: center; gap: 12px;
        }
        .cm-card-header-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          color: white;
        }
        .cm-card-header-title {
          font-size: 1rem; font-weight: 700; color: white;
        }
        .cm-card-header-sub {
          font-size: 0.78rem; color: rgba(255,255,255,0.70); margin-top: 2px;
        }

        /* ── FORM ── */
        .cm-form {
          padding: 28px 26px 26px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .cm-field { display: flex; flex-direction: column; gap: 6px; }
        .cm-label {
          font-size: 0.79rem; font-weight: 700; color: #0d2257;
          display: flex; align-items: center; gap: 7px;
        }
        .cm-label svg { color: #1565C0; }
        .cm-required { color: #e53e3e; margin-left: 2px; }
        .cm-optional {
          color: #aaa; font-weight: 400; font-size: 0.73rem; margin-left: 4px;
        }

        .cm-input, .cm-textarea, .cm-select {
          width: 100%; padding: 10px 14px;
          border: 1.5px solid #dde8f8; border-radius: 10px;
          font-family: 'Poppins', sans-serif; font-size: 0.84rem;
          color: #333; outline: none; background: #fafcff;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .cm-input:focus, .cm-textarea:focus, .cm-select:focus {
          border-color: #1565C0;
          box-shadow: 0 0 0 3px rgba(21,101,192,0.10);
          background: white;
        }
        .cm-textarea { resize: vertical; min-height: 90px; }
        .cm-select { cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231565C0' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
        .cm-error {
          font-size: 0.73rem; color: #e53e3e; font-weight: 600;
          margin-top: 2px;
        }
        .cm-input.err, .cm-select.err { border-color: #e53e3e; }

        /* ── ROW ── */
        .cm-row {
          display: grid; gap: 16px;
        }
        .cm-row-2 { grid-template-columns: 1fr 1fr; }
        .cm-row-3 { grid-template-columns: 1fr 1fr 1fr; }
        @media (max-width: 560px) {
          .cm-row-2, .cm-row-3 { grid-template-columns: 1fr; }
        }

        /* ── DIVIDER ── */
        .cm-divider {
          height: 1px; background: #f0f4ff; margin: 4px 0;
        }

        /* ── SUBMIT ── */
        .cm-actions {
          display: flex; gap: 12px; justify-content: flex-end;
          padding: 0 26px 26px;
        }
        .cm-btn-cancel {
          padding: 10px 22px;
          border: 1.5px solid #dde8f8; background: white;
          color: #555; border-radius: 10px;
          font-family: 'Poppins', sans-serif; font-size: 0.84rem;
          font-weight: 600; cursor: pointer; transition: all 0.18s;
        }
        .cm-btn-cancel:hover { border-color: #1565C0; color: #1565C0; }
        .cm-btn-submit {
          padding: 10px 28px;
          background: #1565C0; color: white; border: none;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif; font-size: 0.84rem;
          font-weight: 700; cursor: pointer;
          display: flex; align-items: center; gap: 7px;
          box-shadow: 0 3px 14px rgba(21,101,192,0.30);
          transition: all 0.2s;
        }
        .cm-btn-submit:hover {
          background: #0d47a1; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(21,101,192,0.38);
        }

        /* ── SUCCESS ── */
        .cm-success {
          text-align: center;
          padding: 60px 30px;
          display: flex; flex-direction: column; align-items: center; gap: 14px;
        }
        .cm-success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: #e8f0fe; color: #1565C0;
          font-size: 1.8rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .cm-success h2 { font-size: 1.2rem; font-weight: 800; color: #0d2257; }
        .cm-success p  { font-size: 0.86rem; color: #666; line-height: 1.6; max-width: 380px; }
        .cm-btn-back {
          margin-top: 6px; padding: 11px 32px;
          background: #0d2257; color: white; border: none;
          border-radius: 10px; font-family: 'Poppins', sans-serif;
          font-size: 0.84rem; font-weight: 700; cursor: pointer;
          transition: background 0.18s;
        }
        .cm-btn-back:hover { background: #1565C0; }

        @media (max-width: 768px) {
          .cm-hero { padding: 50px 24px 60px; }
          .cm-body  { padding: 30px 16px 60px; }
          .cm-form  { padding: 22px 18px 20px; }
          .cm-actions { padding: 0 18px 22px; }
        }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="cm-hero">
        <div className="cm-hero-bg" />
        <div className="cm-hero-overlay" />
        <div className="cm-hero-bio">
          <h2 className="cm-hero-heading">Create a Meeting</h2>
          <p className="cm-hero-text">
            Schedule a new online session for your students. Once created, students can register and they'll receive an email notification when the session goes live.
          </p>
        </div>
      </section>

      {/* BODY */}
      <div className="cm-body">

        <div className="cm-section-header">
          <span className="cm-section-label">Meeting Details</span>
          <div className="cm-section-line" />
        </div>

        {submitted ? (
          <div className="cm-card">
            <div className="cm-success">
              <div className="cm-success-icon">✓</div>
              <h2>Meeting Created!</h2>
              <p>Your session has been scheduled. Students can now register and will be notified when it goes live.</p>
              <button className="cm-btn-back" onClick={() => setSubmitted(false)}>
                Create Another
              </button>
            </div>
          </div>
        ) : (
          <div className="cm-card">

            {/* Card Header */}
            <div className="cm-card-header">
              <div className="cm-card-header-icon">
                <Video size={20} />
              </div>
              <div>
                <div className="cm-card-header-title">New Meeting</div>
                <div className="cm-card-header-sub">Fill in the details below to schedule your session</div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={submit}>
              <div className="cm-form">

                {/* Title */}
                <div className="cm-field">
                  <label className="cm-label">
                    <AlignLeft size={14} /> Meeting Title <span className="cm-required">*</span>
                  </label>
                  <input
                    className={`cm-input${errors.title ? " err" : ""}`}
                    name="title"
                    value={form.title}
                    onChange={handle}
                    placeholder="e.g. Introduction to Computer Networks"
                  />
                  {errors.title && <span className="cm-error">{errors.title}</span>}
                </div>

                {/* Description */}
                <div className="cm-field">
                  <label className="cm-label">
                    <AlignLeft size={14} /> Description <span className="cm-optional">(optional)</span>
                  </label>
                  <textarea
                    className="cm-textarea"
                    name="description"
                    value={form.description}
                    onChange={handle}
                    placeholder="Briefly describe what this session will cover…"
                  />
                </div>

                {/* Meeting Link */}
                <div className="cm-field">
                  <label className="cm-label">
                    <Link size={14} /> Meeting Link <span className="cm-required">*</span>
                  </label>
                  <input
                    className={`cm-input${errors.meetingLink ? " err" : ""}`}
                    name="meetingLink"
                    value={form.meetingLink}
                    onChange={handle}
                    placeholder="e.g. https://meet.google.com/abc-defg-hij"
                  />
                  {errors.meetingLink && <span className="cm-error">{errors.meetingLink}</span>}
                </div>

                <div className="cm-divider" />

                {/* Date + Time */}
                <div className={`cm-row cm-row-2`}>
                  <div className="cm-field">
                    <label className="cm-label">
                      <Calendar size={14} /> Date <span className="cm-required">*</span>
                    </label>
                    <input
                      type="date"
                      className={`cm-input${errors.scheduledAt ? " err" : ""}`}
                      name="scheduledAt"
                      value={form.scheduledAt}
                      onChange={handle}
                    />
                    {errors.scheduledAt && <span className="cm-error">{errors.scheduledAt}</span>}
                  </div>
                  <div className="cm-field">
                    <label className="cm-label">
                      <Clock size={14} /> Time <span className="cm-required">*</span>
                    </label>
                    <input
                      type="time"
                      className={`cm-input${errors.scheduledTime ? " err" : ""}`}
                      name="scheduledTime"
                      value={form.scheduledTime}
                      onChange={handle}
                    />
                    {errors.scheduledTime && <span className="cm-error">{errors.scheduledTime}</span>}
                  </div>
                </div>

                <div className="cm-divider" />

                {/* Year + Semester + Module */}
                <div className={`cm-row cm-row-3`}>
                  <div className="cm-field">
                    <label className="cm-label">
                      <Hash size={14} /> Year <span className="cm-required">*</span>
                    </label>
                    <input
                      type="number"
                      className="cm-input"
                      name="year"
                      value={form.year}
                      onChange={handle}
                      min="2020"
                      max="2099"
                    />
                  </div>
                  <div className="cm-field">
                    <label className="cm-label">
                      <Layers size={14} /> Semester <span className="cm-required">*</span>
                    </label>
                    <select
                      className={`cm-select${errors.semester ? " err" : ""}`}
                      name="semester"
                      value={form.semester}
                      onChange={handle}
                    >
                      <option value="">Select</option>
                      {SEMESTERS.map(s => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                    {errors.semester && <span className="cm-error">{errors.semester}</span>}
                  </div>
                  <div className="cm-field">
                    <label className="cm-label">
                      <BookOpen size={14} /> Module <span className="cm-required">*</span>
                    </label>
                    <select
                      className={`cm-select${errors.module ? " err" : ""}`}
                      name="module"
                      value={form.module}
                      onChange={handle}
                    >
                      <option value="">Select</option>
                      {MODULES.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    {errors.module && <span className="cm-error">{errors.module}</span>}
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="cm-actions">
                <button type="button" className="cm-btn-cancel" onClick={() => setForm({
                  title: "", description: "", meetingLink: "",
                  scheduledAt: "", scheduledTime: "",
                  year: new Date().getFullYear(), semester: "", module: "",
                })}>
                  Clear
                </button>
                <button type="submit" className="cm-btn-submit">
                  Create Meeting <ChevronRight size={15} />
                </button>
              </div>
            </form>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}