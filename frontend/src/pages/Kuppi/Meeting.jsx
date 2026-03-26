import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Video, Calendar, Clock, BookOpen, Users,
  Plus, Search, ChevronRight, Wifi, WifiOff, CalendarClock,
  Pencil, Trash2, X, Check
} from "lucide-react";

const API_BASE = "http://localhost:8000/api/meetings";

const MODULES = [
  "IT1201 — Networking", "IT2105 — Programming", "IT1102 — Database",
  "IT3301 — Security", "IT2203 — Software Eng.", "IT1303 — Web Dev",
];

const STATUS_CONFIG = {
  scheduled: { bg: "#e8f0fe", color: "#1565C0", dot: "#378add", label: "Scheduled", icon: <CalendarClock size={11} /> },
  live:      { bg: "#e6f9f0", color: "#0f6e56", dot: "#1d9e75", label: "Live Now",   icon: <Wifi size={11} /> },
  ended:     { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af", label: "Ended",      icon: <WifiOff size={11} /> },
  cancelled: { bg: "#fce8ef", color: "#993556", dot: "#d4537e", label: "Cancelled",  icon: <WifiOff size={11} /> },
};

const TABS = [
  { label: "All Meetings", icon: <Video size={15} /> },
  { label: "Upcoming",     icon: <CalendarClock size={15} /> },
  { label: "My Meetings",  icon: <BookOpen size={15} /> },
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function getLoggedUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function mapMeeting(meeting, userId) {
  const ownerRaw =
    typeof meeting.ownerId === "object" && meeting.ownerId !== null
      ? meeting.ownerId._id
      : meeting.ownerId;

  return {
    ...meeting,
    id: meeting._id || meeting.id,
    ownerDisplay: meeting.ownerName || ownerRaw || "Unknown Host",
    isOwner: userId ? String(ownerRaw) === String(userId) : false,
  };
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ meeting, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="del-modal" onClick={(e) => e.stopPropagation()}>
        <div className="del-icon">🗑️</div>
        <h3>Delete Meeting?</h3>
        <p>Are you sure you want to delete <strong>"{meeting.title}"</strong>? This cannot be undone.</p>
        <div className="del-actions">
          <button className="btn-del-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-del-confirm" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ meeting, onSave, onCancel }) {
  const [form, setForm] = useState({
    title:         meeting.title,
    description:   meeting.description,
    meetingLink:   meeting.meetingLink,
    scheduledAt:   meeting.scheduledAt.slice(0, 10),
    scheduledTime: meeting.scheduledAt.slice(11, 16),
    year:          meeting.year,
    semester:      meeting.semester,
    module:        meeting.module,
    status:        meeting.status,
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = (e) => {
    e.preventDefault();
    const scheduledAt = new Date(`${form.scheduledAt}T${form.scheduledTime}`).toISOString();
    onSave({ ...meeting, ...form, scheduledAt });
    // PUT /api/meetings/:id  — body: updated
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <span>Edit Meeting</span>
          <button className="edit-close" onClick={onCancel}><X size={16} /></button>
        </div>
        <form onSubmit={save} className="edit-form">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handle} required />

          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handle} rows={3} />

          <label>Meeting Link</label>
          <input name="meetingLink" value={form.meetingLink} onChange={handle} required />

          <div className="edit-row">
            <div>
              <label>Date</label>
              <input type="date" name="scheduledAt" value={form.scheduledAt} onChange={handle} required />
            </div>
            <div>
              <label>Time</label>
              <input type="time" name="scheduledTime" value={form.scheduledTime} onChange={handle} required />
            </div>
          </div>

          <div className="edit-row">
            <div>
              <label>Year</label>
              <input type="number" name="year" value={form.year} onChange={handle} min="2020" max="2099" />
            </div>
            <div>
              <label>Semester</label>
              <select name="semester" value={form.semester} onChange={handle}>
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
              </select>
            </div>
          </div>

          <label>Module</label>
          <select name="module" value={form.module} onChange={handle}>
            {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <label>Status</label>
          <select name="status" value={form.status} onChange={handle}>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="ended">Ended</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="edit-actions">
            <button type="button" className="btn-edit-cancel" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-edit-save"><Check size={14} /> Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Register Modal (unchanged) ────────────────────────────────────────────────
function RegisterModal({ meeting, onClose, onRegistered }) {
  const user = getLoggedUser();
  const [form, setForm] = useState({
    fullName: user?.fullName || user?.name || "",
    email: user?.email || "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [registeredMeetingLink, setRegisteredMeetingLink] = useState("");
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    try {
      const response = await axios.post(`${API_BASE}/register`, {
        meetingId: meeting._id || meeting.id,
        userId: user?._id || user?.id || null,
        fullName: form.fullName,
        email: form.email,
        description: form.description,
      });

      const linkFromApi = response.data?.data?.meetingLink || meeting.meetingLink || "";
      setRegisteredMeetingLink(linkFromApi);
      if (onRegistered) {
        onRegistered(meeting._id || meeting.id);
      }
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.response?.data?.message || "Failed to register for this meeting.");
    }
  };
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {submitted ? (
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <h3>You're Registered!</h3>
            <p>Your registration is confirmed for <strong>{meeting.title}</strong>.</p>
            {registeredMeetingLink && (
              <>
                <p style={{ wordBreak: "break-all" }}>
                  Meeting Link: <a href={registeredMeetingLink} target="_blank" rel="noreferrer">{registeredMeetingLink}</a>
                </p>
                <button
                  className="btn-register"
                  type="button"
                  onClick={() => window.open(registeredMeetingLink, "_blank", "noopener,noreferrer")}
                >
                  Open Meeting Link
                </button>
              </>
            )}
            <button className="btn-close-modal" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <span className="modal-module">{meeting.module}</span>
              <h3 className="modal-title">{meeting.title}</h3>
              <div className="modal-meta">
                <span><Calendar size={12} style={{ marginRight: 5 }} />{formatDate(meeting.scheduledAt)}</span>
                <span><Clock size={12} style={{ marginRight: 5 }} />{formatTime(meeting.scheduledAt)}</span>
              </div>
            </div>
            <form onSubmit={submit} className="modal-form">
              {submitError && (
                <p style={{ color: "#b71c1c", fontSize: "0.76rem", fontWeight: 600 }}>
                  {submitError}
                </p>
              )}
              <label>Full Name <span>*</span></label>
              <input name="fullName" value={form.fullName} onChange={handle} placeholder="e.g. Perera U K P" required />
              <label>Email Address <span>*</span></label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="e.g. it23232323@my.sliit.lk" required />
              <label>About You <span style={{ color: "#aaa", fontWeight: 400 }}>(optional)</span></label>
              <textarea name="description" value={form.description} onChange={handle} placeholder="Briefly describe your background or what you hope to learn…" rows={3} />
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-register">Register for Meeting</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function RegistrationsModal({ meeting, registrations, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="registrations-modal" onClick={(e) => e.stopPropagation()}>
        <div className="registrations-header">
          <h3>Registered Users</h3>
          <button className="edit-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="registrations-meta">
          <p className="registrations-meeting-title">{meeting.title}</p>
          <span>{registrations.length} registration{registrations.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="registrations-list">
          {registrations.length === 0 ? (
            <p className="registrations-empty">No users have registered for this meeting yet.</p>
          ) : (
            registrations.map((user) => (
              <div className="registration-item" key={user.id}>
                <div className="registration-item-top">
                  <strong>{user.fullName}</strong>
                  <span>{user.email}</span>
                </div>
                {user.description && <p>{user.description}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Meeting Card ──────────────────────────────────────────────────────────────
function MeetingCard({ meeting, onRegister, onEdit, onDelete, onViewRegistrations, isMyMeetings }) {
  const st = STATUS_CONFIG[meeting.status] || STATUS_CONFIG.scheduled;
  const isEnded = meeting.status === "ended";

  return (
    <div className="meeting-card">

      <div className="meeting-card-top">
        <span className="meeting-module">{meeting.module}</span>
        <span className="status-badge" style={{ background: st.bg, color: st.color }}>
          <span className="status-dot" style={{ background: st.dot }} />
          {st.icon} {st.label}
        </span>
      </div>

      <div className="meeting-card-body">
        <h3 className="meeting-title">{meeting.title}</h3>
        <p className="meeting-desc">{meeting.description}</p>
        <div className="meeting-info-row">
          <span><Calendar size={12} style={{ marginRight: 5 }} />{formatDate(meeting.scheduledAt)}</span>
          <span><Clock size={12} style={{ marginRight: 5 }} />{formatTime(meeting.scheduledAt)}</span>
        </div>
        <div className="meeting-info-row" style={{ marginTop: 6 }}>
          <span><BookOpen size={12} style={{ marginRight: 5 }} />Sem {meeting.semester} · {meeting.year}</span>
          <span><Users size={12} style={{ marginRight: 5 }} />{meeting.ownerDisplay}</span>
        </div>
      </div>

      <div className="meeting-card-actions">
        {/* My Meetings tab — Edit + Delete */}
        {isMyMeetings ? (
          <>
            <button className="btn-edit" onClick={() => onEdit(meeting)}>
              <Pencil size={13} /> Edit
            </button>
            <button className="btn-delete" onClick={() => onDelete(meeting)}>
              <Trash2 size={13} /> Delete
            </button>
            <button className="btn-view-registrations" onClick={() => onViewRegistrations(meeting)}>
              <Users size={13} /> Registrations
            </button>
          </>
        ) : (
          <>
            {meeting.isRegistered ? (
              <button
                className="btn-register-seat"
                onClick={() => window.open(meeting.meetingLink, "_blank", "noopener,noreferrer")}
              >
                Open Meeting Link <ChevronRight size={13} />
              </button>
            ) : !isEnded && (
              <button className="btn-register-seat" onClick={() => onRegister(meeting)}>
                Register <ChevronRight size={13} />
              </button>
            )}
            {!meeting.isRegistered && isEnded && (
              <button className="btn-ended" disabled>Session Ended</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Meetings() {
  const navigate = useNavigate();
  const user = getLoggedUser();
  const userId = user?._id || user?.id || null;

  const [meetings, setMeetings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadError, setLoadError]     = useState("");
  const [activeTab, setActiveTab]     = useState(0);
  const [search, setSearch]           = useState("");
  const [selected, setSelected]       = useState(null); // register modal
  const [editTarget, setEditTarget]   = useState(null); // edit modal
  const [deleteTarget, setDeleteTarget] = useState(null); // delete modal
  const [registrationsTarget, setRegistrationsTarget] = useState(null); // owner-only registrations modal
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const meetingsResponse = await axios.get(API_BASE);
        const items = Array.isArray(meetingsResponse.data?.data) ? meetingsResponse.data.data : [];

        let registeredMeetingIds = new Set();
        if (userId || user?.email) {
          const regsResponse = await axios.get(`${API_BASE}/registrations/user/${userId || "none"}`, {
            params: { email: user?.email || "" },
          });
          const regs = Array.isArray(regsResponse.data?.data) ? regsResponse.data.data : [];
          registeredMeetingIds = new Set(regs.map((r) => String(r.meetingId)));
        }

        setMeetings(
          items.map((m) => {
            const mm = mapMeeting(m, userId);
            return {
              ...mm,
              isRegistered: registeredMeetingIds.has(String(mm._id || mm.id)),
            };
          })
        );
      } catch (error) {
        setLoadError(error.response?.data?.message || "Failed to load meetings");
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };

    loadMeetings();
  }, [userId]);

  const filtered = meetings.filter((m) => {
    const matchTab =
      activeTab === 0 ? true :
      activeTab === 1 ? m.status === "scheduled" || m.status === "live" :
      m.isOwner === true; // My Meetings
    const matchSearch =
      (m.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.module || "").toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleSave = async (updated) => {
    try {
      const meetingId = updated._id || updated.id;
      const response = await axios.put(`${API_BASE}/${meetingId}`, {
        title: updated.title,
        description: updated.description,
        meetingLink: updated.meetingLink,
        scheduledAt: updated.scheduledAt,
        year: updated.year,
        semester: updated.semester,
        module: updated.module,
        status: updated.status,
      });

      const saved = mapMeeting(response.data?.data || updated, userId);
      setMeetings(meetings.map((m) => ((m._id || m.id) === meetingId ? saved : m)));
      setEditTarget(null);
    } catch (error) {
      console.error("Failed to update meeting:", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const meetingId = deleteTarget._id || deleteTarget.id;
      await axios.delete(`${API_BASE}/${meetingId}`);
      setMeetings(meetings.filter((m) => (m._id || m.id) !== meetingId));
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete meeting:", error.message);
    }
  };

  const handleViewRegistrations = async (meeting) => {
    setRegistrationsTarget(meeting);
    try {
      const meetingId = meeting._id || meeting.id;
      const response = await axios.get(`${API_BASE}/${meetingId}/registrations`);
      setRegistrations(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      setRegistrations([]);
      console.error("Failed to load registrations:", error.message);
    }
  };

  const handleRegistered = (meetingId) => {
    setMeetings((prev) =>
      prev.map((m) =>
        String(m._id || m.id) === String(meetingId)
          ? { ...m, isRegistered: true }
          : m
      )
    );
  };

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; }

        .meet-hero {
          position: relative; padding: 60px 50px 70px; text-align: center;
          overflow: hidden; min-height: 340px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .meet-hero-bg {
          position: absolute; inset: 0;
          background-image: url("../images/background2.jpg");
          background-size: cover; background-position: center; z-index: 0;
        }
        .meet-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.30) 50%, rgba(255,255,255,0.55) 100%);
          z-index: 1;
        }
        .meet-tabs {
          display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;
          position: relative; z-index: 2; margin-bottom: 28px;
        }
        .meet-tab {
          display: flex; align-items: center; gap: 7px; padding: 8px 20px; border-radius: 30px;
          border: 1.5px solid rgba(21,101,192,0.25); cursor: pointer;
          font-family: 'Poppins', sans-serif; font-size: 0.83rem; font-weight: 600;
          background: rgba(255,255,255,0.70); color: #1565C0; backdrop-filter: blur(6px); transition: all 0.2s;
        }
        .meet-tab:hover { background: rgba(255,255,255,0.90); border-color: #1565C0; box-shadow: 0 2px 12px rgba(21,101,192,0.15); }
        .meet-tab.active { background: #1565C0; color: white; border-color: #1565C0; box-shadow: 0 4px 16px rgba(21,101,192,0.35); }
        .meet-hero-bio {
          position: relative; z-index: 2; max-width: 540px;
          background: rgba(255,255,255,0.75); border: 1px solid rgba(21,101,192,0.15);
          border-radius: 16px; padding: 26px 30px; text-align: left;
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          margin-bottom: 24px; box-shadow: 0 4px 24px rgba(21,101,192,0.10);
        }
        .meet-hero-bio-heading { font-size: 1.5rem; font-weight: 800; color: #0d2257; margin-bottom: 10px; line-height: 1.2; }
        .meet-hero-bio-text { font-size: 0.88rem; color: #555; line-height: 1.7; margin: 0; }
        .meet-search-wrap { position: relative; z-index: 2; display: flex; justify-content: center; width: 100%; }
        .meet-search {
          display: flex; align-items: center; background: white; border-radius: 30px; padding: 10px 18px;
          box-shadow: 0 4px 20px rgba(21,101,192,0.18); width: 100%; max-width: 480px; border: 1.5px solid rgba(21,101,192,0.12);
        }
        .meet-search input { border: none; outline: none; flex: 1; font-family: 'Poppins', sans-serif; font-size: 0.88rem; color: #333; background: transparent; }
        .meet-create-wrap { width: 100%; padding: 18px 40px 0; display: flex; justify-content: flex-end; }
        .meet-create-btn {
          padding: 9px 20px; background: #1565C0; color: white; border: none; border-radius: 10px;
          font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 7px;
          box-shadow: 0 3px 14px rgba(21,101,192,0.30); transition: all 0.2s;
        }
        .meet-create-btn:hover { background: #0d47a1; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(21,101,192,0.38); }
        .meet-section-header { width: 100%; margin: 20px auto 20px; padding: 0 40px; display: flex; align-items: center; gap: 12px; }
        .meet-section-label {
          display: inline-block; background: #e8f0fe; color: #1565C0;
          font-size: 0.78rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          padding: 6px 14px; border-radius: 20px; white-space: nowrap;
        }
        .meet-section-line { flex: 1; height: 1px; background: #dde8f8; }
        .meetings-grid { width: 100%; padding: 0 40px 60px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 1100px) { .meetings-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) {
          .meet-hero { padding: 50px 24px 60px; }
          .meet-create-wrap { padding: 16px 20px 0; }
          .meet-section-header { padding: 0 20px; }
          .meetings-grid { grid-template-columns: 1fr; padding: 0 20px 40px; }
        }

        /* ── CARD ── */
        .meeting-card {
          background: white; border-radius: 14px; border: 1px solid #e8f0fe; overflow: hidden;
          box-shadow: 0 4px 18px rgba(21,101,192,0.07); transition: transform 0.2s, box-shadow 0.2s;
          position: relative; display: flex; flex-direction: column;
        }
        .meeting-card:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(21,101,192,0.15); }
        .meeting-card-top { padding: 14px 16px 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; }
        .meeting-module { font-size: 0.68rem; font-weight: 700; color: #1565C0; background: #e8f0fe; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-badge { font-size: 0.68rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; display: flex; align-items: center; gap: 5px; text-transform: uppercase; letter-spacing: 0.04em; }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .meeting-card-body { padding: 6px 16px 14px; flex: 1; }
        .meeting-title { font-weight: 700; font-size: 0.92rem; color: #0d2257; line-height: 1.35; margin-bottom: 7px; }
        .meeting-desc { font-size: 0.78rem; color: #666; line-height: 1.55; margin-bottom: 12px; }
        .meeting-info-row { display: flex; align-items: center; gap: 14px; font-size: 0.72rem; color: #555; font-weight: 600; }
        .meeting-info-row span { display: flex; align-items: center; }
        .meeting-card-actions { padding: 12px 16px 16px; display: flex; gap: 8px; border-top: 1px solid #f0f4ff; }
        .btn-register-seat {
          flex: 1; padding: 8px; background: #0d2257; color: white; border: none; border-radius: 8px;
          font-family: 'Poppins', sans-serif; font-size: 0.78rem; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 4px; transition: background 0.18s;
        }
        .btn-register-seat:hover { background: #1565C0; }
        .btn-ended { flex: 1; padding: 8px; background: #f3f4f6; color: #9ca3af; border: none; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 0.78rem; font-weight: 600; cursor: not-allowed; }

        /* ── OWNER BUTTONS ── */
        .btn-edit {
          flex: 1; padding: 8px; background: #e8f0fe; color: #1565C0;
          border: 1.5px solid #c5d8f8; border-radius: 8px;
          font-family: 'Poppins', sans-serif; font-size: 0.78rem; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.18s;
        }
        .btn-edit:hover { background: #1565C0; color: white; border-color: #1565C0; }
        .btn-delete {
          flex: 1; padding: 8px; background: #fce8ef; color: #993556;
          border: 1.5px solid #f5c0cf; border-radius: 8px;
          font-family: 'Poppins', sans-serif; font-size: 0.78rem; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.18s;
        }
        .btn-delete:hover { background: #993556; color: white; border-color: #993556; }
        .btn-view-registrations {
          flex: 1; padding: 8px; background: #e6f9f0; color: #0f6e56;
          border: 1.5px solid #bcebdc; border-radius: 8px;
          font-family: 'Poppins', sans-serif; font-size: 0.78rem; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.18s;
        }
        .btn-view-registrations:hover { background: #0f6e56; color: white; border-color: #0f6e56; }

        /* ── MODAL SHARED ── */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(13,34,87,0.45); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }

        /* ── REGISTER MODAL ── */
        .modal-box { background: white; border-radius: 18px; width: 100%; max-width: 440px; box-shadow: 0 20px 60px rgba(13,34,87,0.25); overflow: hidden; }
        .modal-header { background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%); padding: 24px 26px 20px; }
        .modal-module { font-size: 0.68rem; font-weight: 700; background: rgba(255,255,255,0.2); color: white; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; margin-bottom: 10px; }
        .modal-title { font-size: 1.05rem; font-weight: 700; color: white; line-height: 1.3; margin-bottom: 10px; }
        .modal-meta { display: flex; gap: 16px; font-size: 0.75rem; color: rgba(255,255,255,0.80); font-weight: 600; }
        .modal-meta span { display: flex; align-items: center; }
        .modal-form { padding: 22px 26px 24px; display: flex; flex-direction: column; gap: 6px; }
        .modal-form label { font-size: 0.78rem; font-weight: 700; color: #0d2257; margin-top: 8px; }
        .modal-form label span { color: #e53e3e; margin-left: 2px; }
        .modal-form input, .modal-form textarea { width: 100%; padding: 9px 13px; border: 1.5px solid #dde8f8; border-radius: 9px; font-family: 'Poppins', sans-serif; font-size: 0.83rem; color: #333; outline: none; transition: border-color 0.18s; resize: none; }
        .modal-form input:focus, .modal-form textarea:focus { border-color: #1565C0; }
        .modal-actions { display: flex; gap: 10px; margin-top: 14px; }
        .btn-cancel { flex: 1; padding: 10px; border: 1.5px solid #dde8f8; background: white; color: #555; border-radius: 9px; font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.18s; }
        .btn-cancel:hover { border-color: #1565C0; color: #1565C0; }
        .btn-register { flex: 2; padding: 10px; background: #1565C0; color: white; border: none; border-radius: 9px; font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: background 0.18s; }
        .btn-register:hover { background: #0d47a1; }
        .modal-success { padding: 40px 30px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .success-icon { width: 56px; height: 56px; border-radius: 50%; background: #e6f9f0; color: #0f6e56; font-size: 1.6rem; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
        .modal-success h3 { font-size: 1.1rem; font-weight: 800; color: #0d2257; }
        .modal-success p { font-size: 0.84rem; color: #666; line-height: 1.6; }
        .btn-close-modal { margin-top: 8px; padding: 10px 30px; background: #0d2257; color: white; border: none; border-radius: 9px; font-family: 'Poppins', sans-serif; font-size: 0.84rem; font-weight: 700; cursor: pointer; transition: background 0.18s; }
        .btn-close-modal:hover { background: #1565C0; }

        /* ── DELETE MODAL ── */
        .del-modal {
          background: white; border-radius: 18px; width: 100%; max-width: 380px;
          box-shadow: 0 20px 60px rgba(13,34,87,0.25); padding: 36px 30px; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .del-icon { font-size: 2rem; }
        .del-modal h3 { font-size: 1.1rem; font-weight: 800; color: #0d2257; }
        .del-modal p  { font-size: 0.83rem; color: #666; line-height: 1.6; }
        .del-actions  { display: flex; gap: 10px; margin-top: 6px; width: 100%; }
        .btn-del-cancel { flex: 1; padding: 10px; border: 1.5px solid #dde8f8; background: white; color: #555; border-radius: 9px; font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.18s; }
        .btn-del-cancel:hover { border-color: #1565C0; color: #1565C0; }
        .btn-del-confirm { flex: 1; padding: 10px; background: #993556; color: white; border: none; border-radius: 9px; font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: background 0.18s; }
        .btn-del-confirm:hover { background: #7a2944; }

        /* ── EDIT MODAL ── */
        .edit-modal {
          background: white; border-radius: 18px; width: 100%; max-width: 500px;
          box-shadow: 0 20px 60px rgba(13,34,87,0.25); overflow: hidden;
          max-height: 90vh; overflow-y: auto;
        }
        .edit-modal-header {
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          padding: 18px 22px; display: flex; align-items: center; justify-content: space-between;
          font-size: 1rem; font-weight: 700; color: white; position: sticky; top: 0; z-index: 1;
        }
        .edit-close { background: rgba(255,255,255,0.15); border: none; color: white; border-radius: 6px; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.18s; }
        .edit-close:hover { background: rgba(255,255,255,0.30); }
        .edit-form { padding: 22px 22px 18px; display: flex; flex-direction: column; gap: 10px; }
        .edit-form label { font-size: 0.77rem; font-weight: 700; color: #0d2257; margin-top: 4px; }
        .edit-form input, .edit-form textarea, .edit-form select {
          width: 100%; padding: 9px 13px; border: 1.5px solid #dde8f8; border-radius: 9px;
          font-family: 'Poppins', sans-serif; font-size: 0.83rem; color: #333;
          outline: none; background: #fafcff; transition: border-color 0.18s;
        }
        .edit-form input:focus, .edit-form textarea:focus, .edit-form select:focus { border-color: #1565C0; }
        .edit-form textarea { resize: vertical; min-height: 70px; }
        .edit-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .edit-actions { display: flex; gap: 10px; margin-top: 8px; justify-content: flex-end; }
        .btn-edit-cancel { padding: 9px 20px; border: 1.5px solid #dde8f8; background: white; color: #555; border-radius: 9px; font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.18s; }
        .btn-edit-cancel:hover { border-color: #1565C0; color: #1565C0; }
        .btn-edit-save { padding: 9px 22px; background: #1565C0; color: white; border: none; border-radius: 9px; font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.18s; }
        .btn-edit-save:hover { background: #0d47a1; }

        /* ── REGISTRATIONS MODAL ── */
        .registrations-modal {
          background: white; border-radius: 18px; width: 100%; max-width: 560px;
          box-shadow: 0 20px 60px rgba(13,34,87,0.25); overflow: hidden;
          max-height: 90vh; display: flex; flex-direction: column;
        }
        .registrations-header {
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          padding: 16px 20px; display: flex; align-items: center; justify-content: space-between;
        }
        .registrations-header h3 { color: white; font-size: 1rem; font-weight: 700; }
        .registrations-meta {
          padding: 14px 20px; border-bottom: 1px solid #eef4ff;
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
        }
        .registrations-meeting-title { font-size: 0.86rem; font-weight: 700; color: #0d2257; }
        .registrations-meta span {
          font-size: 0.74rem; font-weight: 700; color: #1565C0;
          background: #e8f0fe; border-radius: 20px; padding: 4px 10px;
        }
        .registrations-list { padding: 14px 20px 20px; overflow-y: auto; display: grid; gap: 10px; }
        .registration-item {
          border: 1px solid #e8f0fe; border-radius: 12px; padding: 12px 13px;
          background: #fbfdff;
        }
        .registration-item-top { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
        .registration-item-top strong { color: #0d2257; font-size: 0.83rem; }
        .registration-item-top span { color: #1565C0; font-size: 0.77rem; font-weight: 600; }
        .registration-item p { margin-top: 6px; color: #666; font-size: 0.78rem; line-height: 1.5; }
        .registrations-empty { color: #667085; font-size: 0.82rem; }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="meet-hero">
        <div className="meet-hero-bg" />
        <div className="meet-hero-overlay" />
        <div className="meet-tabs">
          {TABS.map((tab, i) => (
            <button key={tab.label} className={`meet-tab${activeTab === i ? " active" : ""}`} onClick={() => setActiveTab(i)}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <div className="meet-hero-bio">
          <h2 className="meet-hero-bio-heading">Register for Meetings</h2>
          <p className="meet-hero-bio-text">
            Register for upcoming lectures and study sessions. Once you sign up, we'll notify you by email when your session is available.
          </p>
        </div>
        <div className="meet-search-wrap">
          <div className="meet-search">
            <Search size={17} style={{ marginRight: 10, color: "#888" }} />
            <input type="text" placeholder="Search meetings, modules, topics…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </section>

      {/* CREATE BUTTON */}
      <div className="meet-create-wrap">
        <button className="meet-create-btn" onClick={() => navigate("/Createmeeting")}>
          <Plus size={15} /> Create Meeting
        </button>
      </div>

      {/* SECTION LABEL */}
      <div className="meet-section-header">
        <span className="meet-section-label">
          {activeTab === 0 ? "All Meetings" : activeTab === 1 ? "Upcoming Sessions" : "My Meetings"}
        </span>
        <div className="meet-section-line" />
      </div>

      {/* GRID */}
      <div className="meetings-grid">
        {loading && <p>Loading meetings...</p>}
        {!loading && loadError && <p>{loadError}</p>}
        {!loading && !loadError && filtered.length === 0 && <p>No meetings found.</p>}
        {filtered.map((m) => (
          <MeetingCard
            key={m._id || m.id}
            meeting={m}
            onRegister={setSelected}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
            onViewRegistrations={handleViewRegistrations}
            isMyMeetings={activeTab === 2 && m.isOwner}
          />
        ))}
      </div>

      {/* REGISTER MODAL */}
      {selected && <RegisterModal meeting={selected} onClose={() => setSelected(null)} onRegistered={handleRegistered} />}

      {/* EDIT MODAL */}
      {editTarget && <EditModal meeting={editTarget} onSave={handleSave} onCancel={() => setEditTarget(null)} />}

      {/* DELETE MODAL */}
      {deleteTarget && <DeleteModal meeting={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}

      {/* OWNER-ONLY REGISTRATIONS MODAL */}
      {registrationsTarget?.isOwner && (
        <RegistrationsModal
          meeting={registrationsTarget}
          registrations={registrations}
          onClose={() => setRegistrationsTarget(null)}
        />
      )}

      <Footer />
    </div>
  );
}