import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Users, Flag, Trash2, AlertTriangle, Eye, X, CheckCircle,
  XCircle, Download, Search, Shield, ChevronDown, Bell,
  FileText, Clock, User, Mail, Hash, BookOpen, GraduationCap,
  MessageSquare, BarChart2, RefreshCw, LogOut,
} from "lucide-react";

/* ─────────────────────────── MOCK DATA ─────────────────────────── */
const MOCK_USERS = [
  { _id: "u1", fullName: "Kavisha Perera",   studentId: "IT21234567", email: "kavisha.p@students.nsbm.ac.lk",   faculty: "Faculty of Computing",  academicYear: "2nd Year", semester: "Sem 3", warningCount: 0, isActive: true },
  { _id: "u2", fullName: "Dineth Silva",     studentId: "IT21345678", email: "dineth.s@students.nsbm.ac.lk",   faculty: "Faculty of Computing",  academicYear: "3rd Year", semester: "Sem 5", warningCount: 1, isActive: true },
  { _id: "u3", fullName: "Amaya Fernando",  studentId: "BM21456789", email: "amaya.f@students.nsbm.ac.lk",    faculty: "Faculty of Business",   academicYear: "1st Year", semester: "Sem 1", warningCount: 2, isActive: false },
  { _id: "u4", fullName: "Rasith Jayaweera",studentId: "EN21567890", email: "rasith.j@students.nsbm.ac.lk",   faculty: "Faculty of Engineering",academicYear: "2nd Year", semester: "Sem 4", warningCount: 0, isActive: true },
  { _id: "u5", fullName: "Nimali Bandara",  studentId: "SC21678901", email: "nimali.b@students.nsbm.ac.lk",   faculty: "Faculty of Science",    academicYear: "3rd Year", semester: "Sem 6", warningCount: 1, isActive: true },
];

const MOCK_REPORTS = [
  { _id: "r1", contentTitle: "Data Structures — Exam Cheats",  contentType: "File",    reason: "Inappropriate Content", description: "This file appears to contain exam answer leaks which violate academic integrity policies.", reportedBy: "Nimali Bandara", reportedUserId: "u2", date: "2025-07-18", status: "pending" },
  { _id: "r2", contentTitle: "Comment on ML Notes thread",    contentType: "Comment", reason: "Harassment",            description: "User left abusive language targeting another student in the comments section.", reportedBy: "Kavisha Perera", reportedUserId: "u3", date: "2025-07-17", status: "pending" },
  { _id: "r3", contentTitle: "OS Lab Manual 2024",            contentType: "File",    reason: "Copyright Violation",   description: "This lab manual appears to be scanned directly from the official university textbook without permission.", reportedBy: "Rasith Jayaweera", reportedUserId: "u5", date: "2025-07-15", status: "reviewed" },
  { _id: "r4", contentTitle: "Business Law Summary Notes",    contentType: "File",    reason: "Spam / Low Quality",    description: "The uploaded document is just a blank file with no real content, just filler text to inflate upload count.", reportedBy: "Dineth Silva", reportedUserId: "u3", date: "2025-07-12", status: "rejected" },
];

/* ─────────────────────────── HELPERS ─────────────────────────── */
const API = "http://localhost:8000/api";
const getToken = () => localStorage.getItem("token");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

function exportCSV(users) {
  const header = ["Student ID","Full Name","Email","Faculty","Academic Year","Semester","Warning Count","Status"];
  const rows = users.map(u => [u.studentId, u.fullName, u.email, u.faculty, u.academicYear, u.semester, u.warningCount, u.isActive ? "Active" : "Inactive"]);
  const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "unishare_users.csv"; a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────── STYLES ─────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Poppins', sans-serif; background: #f4f7ff; color: #1a1a2e; }

/* ── LAYOUT ── */
.admin-shell { display: flex; min-height: 100vh; }

/* ── SIDEBAR ── */
.sidebar {
  width: 240px; flex-shrink: 0;
  background: linear-gradient(180deg, #0d2257 0%, #0a1840 100%);
  display: flex; flex-direction: column;
  position: fixed; top: 0; left: 0; bottom: 0;
  z-index: 50;
  box-shadow: 4px 0 24px rgba(13,34,87,0.18);
}
.sidebar-logo {
  padding: 28px 24px 22px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.sidebar-logo-title {
  font-size: 1.25rem; font-weight: 800; color: white; letter-spacing: -0.5px;
}
.sidebar-logo-sub {
  font-size: 0.62rem; color: rgba(255,255,255,0.35);
  text-transform: uppercase; letter-spacing: 2px; margin-top: 2px;
}
.sidebar-nav { flex: 1; padding: 18px 12px; display: flex; flex-direction: column; gap: 4px; }
.nav-section-label {
  font-size: 0.58rem; font-weight: 700; color: rgba(255,255,255,0.28);
  text-transform: uppercase; letter-spacing: 1.8px;
  padding: 12px 12px 6px;
}
.nav-item {
  display: flex; align-items: center; gap: 11px;
  padding: 10px 14px; border-radius: 10px;
  font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.55);
  cursor: pointer; transition: all 0.18s; border: none; background: transparent;
  width: 100%; text-align: left;
}
.nav-item:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
.nav-item.active { background: rgba(21,101,192,0.55); color: white; box-shadow: 0 2px 12px rgba(21,101,192,0.25); }
.nav-item .badge {
  margin-left: auto; background: #d4537e; color: white;
  font-size: 0.58rem; font-weight: 700; border-radius: 20px;
  padding: 2px 7px; min-width: 20px; text-align: center;
}
.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.sidebar-admin-chip {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; background: rgba(255,255,255,0.05);
  border-radius: 10px; margin-bottom: 10px;
}
.sidebar-admin-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #1565C0, #0d47a1);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem; font-weight: 800; color: white; flex-shrink: 0;
}
.sidebar-admin-name { font-size: 0.72rem; font-weight: 700; color: white; }
.sidebar-admin-role { font-size: 0.6rem; color: rgba(255,255,255,0.35); }
.btn-logout-side {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 9px 14px; border-radius: 10px;
  background: transparent; border: none;
  font-family: 'Poppins',sans-serif; font-size: 0.75rem; font-weight: 600;
  color: rgba(255,255,255,0.35); cursor: pointer; transition: all 0.18s;
}
.btn-logout-side:hover { background: rgba(212,83,126,0.18); color: #d4537e; }

/* ── MAIN ── */
.admin-main { margin-left: 240px; flex: 1; display: flex; flex-direction: column; }

/* ── TOPBAR ── */
.topbar {
  background: white; border-bottom: 1px solid #e8f0fe;
  padding: 16px 36px; display: flex; align-items: center; gap: 16px;
  position: sticky; top: 0; z-index: 40;
  box-shadow: 0 2px 12px rgba(21,101,192,0.06);
}
.topbar-title { font-size: 1.1rem; font-weight: 800; color: #0d2257; flex: 1; }
.topbar-sub { font-size: 0.72rem; color: #aaa; font-weight: 500; }
.topbar-actions { display: flex; align-items: center; gap: 10px; }
.search-wrap {
  position: relative; display: flex; align-items: center;
}
.search-input {
  padding: 8px 14px 8px 36px;
  border: 1.5px solid #e8f0fe; border-radius: 10px;
  font-family: 'Poppins',sans-serif; font-size: 0.78rem;
  color: #0d2257; background: #f8faff; width: 220px;
  transition: border-color 0.2s; outline: none;
}
.search-input:focus { border-color: #1565C0; background: white; }
.search-icon { position: absolute; left: 10px; color: #aaa; pointer-events: none; }

/* ── CONTENT ── */
.admin-content { padding: 32px 36px; flex: 1; }

/* ── STAT CARDS ── */
.stat-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 28px; }
.stat-card {
  background: white; border: 1px solid #e8f0fe; border-radius: 14px;
  padding: 20px 18px; box-shadow: 0 2px 12px rgba(21,101,192,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(21,101,192,0.12); }
.stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.stat-value { font-size: 1.6rem; font-weight: 800; color: #0d2257; line-height: 1; }
.stat-label { font-size: 0.68rem; color: #aaa; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 4px; }

/* ── PANEL ── */
.panel {
  background: white; border: 1px solid #e8f0fe; border-radius: 16px;
  box-shadow: 0 2px 12px rgba(21,101,192,0.06); overflow: hidden;
  margin-bottom: 24px;
}
.panel-header {
  padding: 18px 24px; border-bottom: 1px solid #f0f4ff;
  display: flex; align-items: center; gap: 12px;
}
.panel-title { font-size: 0.8rem; font-weight: 700; color: #0d2257; flex: 1; display: flex; align-items: center; gap: 8px; }
.panel-title-icon { color: #1565C0; }
.panel-actions { display: flex; align-items: center; gap: 8px; }

/* ── BUTTONS ── */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 16px; border-radius: 9px; border: none;
  font-family: 'Poppins',sans-serif; font-size: 0.72rem; font-weight: 600;
  cursor: pointer; transition: all 0.18s; text-decoration: none; white-space: nowrap;
}
.btn-primary { background: #1565C0; color: white; box-shadow: 0 2px 10px rgba(21,101,192,0.25); }
.btn-primary:hover { background: #0d47a1; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(21,101,192,0.35); }
.btn-danger { background: #fce8ef; color: #993556; border: 1px solid #f5c2cf; }
.btn-danger:hover { background: #f5c2cf; }
.btn-warning { background: #fef9e7; color: #b7830a; border: 1px solid #f5dfa0; }
.btn-warning:hover { background: #f5dfa0; }
.btn-success { background: #e6f4f1; color: #0f6e56; border: 1px solid #a8dfd4; }
.btn-success:hover { background: #a8dfd4; }
.btn-ghost { background: #f4f7ff; color: #1565C0; border: 1px solid #e8f0fe; }
.btn-ghost:hover { background: #e8f0fe; }
.btn-outline { background: transparent; color: #1565C0; border: 1.5px solid #1565C0; }
.btn-outline:hover { background: #e8f0fe; }
.btn-sm { padding: 5px 12px; font-size: 0.68rem; }
.btn-icon { padding: 7px; }

/* ── TABLE ── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
thead tr { background: #f8faff; }
th {
  padding: 11px 16px; text-align: left;
  font-size: 0.63rem; font-weight: 700; color: #1565C0;
  text-transform: uppercase; letter-spacing: 1px;
  border-bottom: 1px solid #e8f0fe; white-space: nowrap;
}
td {
  padding: 13px 16px; font-size: 0.78rem; color: #333;
  border-bottom: 1px solid #f4f7ff; vertical-align: middle;
}
tr:last-child td { border-bottom: none; }
tbody tr { transition: background 0.15s; }
tbody tr:hover { background: #f8faff; }
.td-id { font-weight: 700; color: #0d2257; font-size: 0.72rem; }
.td-name { font-weight: 600; color: #0d2257; }
.td-email { color: #888; font-size: 0.73rem; }

/* ── STATUS BADGE ── */
.badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 0.63rem; font-weight: 700; border-radius: 20px; padding: 3px 10px;
}
.badge-active   { background: #e6f4f1; color: #0f6e56; }
.badge-inactive { background: #fce8ef; color: #993556; }
.badge-pending  { background: #fef9e7; color: #b7830a; }
.badge-reviewed { background: #e8f0fe; color: #1565C0; }
.badge-rejected { background: #f4f7ff; color: #888; }
.badge-warn { background: #fef9e7; color: #b7830a; }

.warn-count {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 6px;
  font-size: 0.72rem; font-weight: 800;
}
.warn-0 { background: #f4f7ff; color: #aaa; }
.warn-1 { background: #fef9e7; color: #b7830a; }
.warn-2plus { background: #fce8ef; color: #993556; }

/* ── ACTIONS CELL ── */
.actions-cell { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

/* ── EMPTY STATE ── */
.empty-state {
  text-align: center; padding: 60px 20px;
}
.empty-icon {
  width: 60px; height: 60px; background: #f4f7ff; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 14px; color: #c8d8f5;
}
.empty-title { font-size: 0.9rem; font-weight: 700; color: #0d2257; margin-bottom: 6px; }
.empty-sub { font-size: 0.75rem; color: #aaa; }

/* ── MODAL OVERLAY ── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(13,34,87,0.45); backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal {
  background: white; border-radius: 20px; width: 100%; max-width: 560px;
  box-shadow: 0 20px 60px rgba(13,34,87,0.25); overflow: hidden;
  animation: slideUp 0.25s ease;
}
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-header {
  padding: 22px 28px 18px; border-bottom: 1px solid #f0f4ff;
  display: flex; align-items: center; gap: 12px;
}
.modal-title { font-size: 0.95rem; font-weight: 800; color: #0d2257; flex: 1; }
.modal-close {
  width: 32px; height: 32px; border-radius: 8px; border: none;
  background: #f4f7ff; color: #888; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.18s;
}
.modal-close:hover { background: #e8f0fe; color: #1565C0; }
.modal-body { padding: 22px 28px; }
.modal-footer { padding: 16px 28px 22px; border-top: 1px solid #f0f4ff; display: flex; gap: 10px; justify-content: flex-end; }

.info-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 14px; }
.info-icon { width: 30px; height: 30px; background: #f4f7ff; color: #1565C0; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.info-label { font-size: 0.62rem; color: #aaa; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.info-value { font-size: 0.82rem; color: #0d2257; font-weight: 600; }

.report-desc-box {
  background: #f8faff; border: 1px solid #e8f0fe; border-radius: 10px;
  padding: 14px; font-size: 0.78rem; color: #444; line-height: 1.6;
  margin: 14px 0;
}

.divider { border: none; border-top: 1px solid #f0f4ff; margin: 18px 0; }

.action-section-title {
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.2px; color: #1565C0; margin-bottom: 12px;
  display: flex; align-items: center; gap: 6px;
}

textarea.warn-msg {
  width: 100%; padding: 10px 14px;
  border: 1.5px solid #e8f0fe; border-radius: 10px;
  font-family: 'Poppins',sans-serif; font-size: 0.78rem;
  resize: vertical; min-height: 80px; outline: none;
  transition: border-color 0.2s; color: #0d2257;
}
textarea.warn-msg:focus { border-color: #1565C0; }

.toast {
  position: fixed; bottom: 28px; right: 28px; z-index: 999;
  background: #0d2257; color: white; border-radius: 12px;
  padding: 14px 20px; font-size: 0.78rem; font-weight: 600;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 8px 30px rgba(13,34,87,0.25);
  animation: toastIn 0.3s ease;
}
@keyframes toastIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.toast-success { background: #0f6e56; }
.toast-danger  { background: #993556; }
.toast-warn    { background: #b7830a; }

.filter-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.filter-select {
  padding: 7px 12px; border: 1.5px solid #e8f0fe; border-radius: 9px;
  font-family: 'Poppins',sans-serif; font-size: 0.72rem; color: #0d2257;
  background: #f8faff; outline: none; cursor: pointer;
}
.filter-select:focus { border-color: #1565C0; }

.report-badge-type {
  font-size: 0.62rem; font-weight: 700; border-radius: 6px; padding: 2px 8px;
}
.type-file    { background: #e8f0fe; color: #1565C0; }
.type-comment { background: #fef9e7; color: #b7830a; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .sidebar { width: 200px; }
  .admin-main { margin-left: 200px; }
  .stat-row { grid-template-columns: repeat(2,1fr); }
}
@media (max-width: 640px) {
  .sidebar { display: none; }
  .admin-main { margin-left: 0; }
  .admin-content { padding: 20px 16px; }
  .topbar { padding: 14px 16px; }
  .stat-row { grid-template-columns: repeat(2,1fr); }
}
`;

/* ─────────────────────────── TOAST ─────────────────────────── */
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`toast toast-${type}`}>
      {type === "success" && <CheckCircle size={15} />}
      {type === "danger"  && <XCircle size={15} />}
      {type === "warn"    && <AlertTriangle size={15} />}
      {msg}
    </div>
  );
}

/* ─────────────────────────── WARN MODAL ─────────────────────────── */
function WarnModal({ user, onClose, onSend }) {
  const [msg, setMsg] = useState("");
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#fef9e7", color: "#b7830a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={16} />
          </div>
          <div className="modal-title">Send Warning</div>
          <button className="modal-close" onClick={onClose}><X size={15} /></button>
        </div>
        <div className="modal-body">
          <div className="info-row">
            <div className="info-icon"><User size={14} /></div>
            <div><div className="info-label">Student</div><div className="info-value">{user.fullName}</div></div>
          </div>
          <div className="info-row">
            <div className="info-icon"><Hash size={14} /></div>
            <div><div className="info-label">Student ID</div><div className="info-value">{user.studentId}</div></div>
          </div>
          <div className="info-row" style={{ marginBottom: 0 }}>
            <div className="info-icon"><AlertTriangle size={14} /></div>
            <div><div className="info-label">Current Warnings</div><div className="info-value">{user.warningCount}</div></div>
          </div>
          <hr className="divider" />
          <div className="action-section-title"><MessageSquare size={12} /> Warning Message</div>
          <textarea
            className="warn-msg"
            placeholder="Explain the reason for this warning…"
            value={msg}
            onChange={e => setMsg(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-warning" disabled={!msg.trim()} onClick={() => onSend(user._id, msg)}>
            <AlertTriangle size={13} /> Send Warning
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── DELETE CONFIRM MODAL ─────────────────────────── */
function DeleteModal({ target, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#fce8ef", color: "#993556", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trash2 size={16} />
          </div>
          <div className="modal-title">Remove User Account</div>
          <button className="modal-close" onClick={onClose}><X size={15} /></button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: "0.82rem", color: "#444", lineHeight: 1.6 }}>
            Are you sure you want to permanently remove <strong style={{ color: "#0d2257" }}>{target?.fullName}</strong>'s account?
            This action <strong style={{ color: "#993556" }}>cannot be undone</strong> and will remove all their uploads and activity.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={() => onConfirm(target._id)}>
            <Trash2 size={13} /> Remove Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── REVIEW MODAL ─────────────────────────── */
function ReviewModal({ report, users, adminId, onClose, onApproveWarn, onApproveDelete, onReject }) {
  const reportedUser = users.find(u => u._id === report.reportedUserId);
  const [warnMsg, setWarnMsg] = useState("");
  const [action, setAction] = useState(null); // null | 'approve' | 'reject'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#e8f0fe", color: "#1565C0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Eye size={16} />
          </div>
          <div className="modal-title">Review Report</div>
          <button className="modal-close" onClick={onClose}><X size={15} /></button>
        </div>
        <div className="modal-body">
          {/* Report details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div className="info-row" style={{ marginBottom: 0 }}>
              <div className="info-icon"><FileText size={13} /></div>
              <div><div className="info-label">Content</div><div className="info-value" style={{ fontSize: "0.78rem" }}>{report.contentTitle}</div></div>
            </div>
            <div className="info-row" style={{ marginBottom: 0 }}>
              <div className="info-icon"><Flag size={13} /></div>
              <div><div className="info-label">Reason</div><div className="info-value" style={{ fontSize: "0.78rem" }}>{report.reason}</div></div>
            </div>
            <div className="info-row" style={{ marginBottom: 0 }}>
              <div className="info-icon"><User size={13} /></div>
              <div><div className="info-label">Reported By</div><div className="info-value" style={{ fontSize: "0.78rem" }}>{report.reportedBy}</div></div>
            </div>
            <div className="info-row" style={{ marginBottom: 0 }}>
              <div className="info-icon"><Clock size={13} /></div>
              <div><div className="info-label">Date</div><div className="info-value" style={{ fontSize: "0.78rem" }}>{report.date}</div></div>
            </div>
          </div>
          <div className="action-section-title"><MessageSquare size={12} /> Description</div>
          <div className="report-desc-box">{report.description}</div>

          {reportedUser && (
            <>
              <hr className="divider" />
              <div className="action-section-title"><User size={12} /> Reported User</div>
              <div style={{ background: "#f8faff", border: "1px solid #e8f0fe", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#0d2257,#1565C0)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "white" }}>
                    {reportedUser.fullName.split(" ").map(n => n[0]).slice(0,2).join("")}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0d2257" }}>{reportedUser.fullName}</div>
                  <div style={{ fontSize: "0.68rem", color: "#aaa" }}>{reportedUser.studentId} &nbsp;·&nbsp; {reportedUser.faculty}</div>
                </div>
                <span className={`warn-count ${reportedUser.warningCount === 0 ? "warn-0" : reportedUser.warningCount === 1 ? "warn-1" : "warn-2plus"}`}>
                  ⚠ {reportedUser.warningCount}
                </span>
              </div>
            </>
          )}

          <hr className="divider" />
          <div className="action-section-title"><Shield size={12} /> Admin Action</div>

          {action === null && (
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-success" onClick={() => setAction("approve")} style={{ flex: 1 }}>
                <CheckCircle size={13} /> Approve Report
              </button>
              <button className="btn btn-ghost" onClick={() => onReject(report._id)} style={{ flex: 1 }}>
                <XCircle size={13} /> Reject Report
              </button>
            </div>
          )}

          {action === "approve" && (
            <div>
              <p style={{ fontSize: "0.75rem", color: "#444", marginBottom: 12, lineHeight: 1.6 }}>
                Report approved. Choose an action against <strong>{reportedUser?.fullName}</strong>:
              </p>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <button className="btn btn-warning" style={{ flex: 1 }} onClick={() => setAction("approve-warn")}>
                  <AlertTriangle size={13} /> Send Warning
                </button>
                <button 
                  className="btn btn-danger" 
                  style={{ flex: 1, opacity: adminId === reportedUser?._id ? 0.5 : 1, cursor: adminId === reportedUser?._id ? "not-allowed" : "pointer" }}
                  disabled={adminId === reportedUser?._id}
                  title={adminId === reportedUser?._id ? "Cannot delete your own account" : ""}
                  onClick={() => onApproveDelete(report._id, reportedUser?._id)}
                >
                  <Trash2 size={13} /> Remove User
                </button>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setAction(null)}>← Back</button>
            </div>
          )}

          {action === "approve-warn" && (
            <div>
              <textarea
                className="warn-msg"
                placeholder="Enter warning message for the student…"
                value={warnMsg}
                onChange={e => setWarnMsg(e.target.value)}
                style={{ marginBottom: 12 }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setAction("approve")}>← Back</button>
                <button
                  className="btn btn-warning"
                  disabled={!warnMsg.trim()}
                  onClick={() => onApproveWarn(report._id, reportedUser?._id, warnMsg)}
                >
                  <AlertTriangle size={13} /> Confirm Warning
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── STUDENT REPORTS MODAL ─────────────────────────── */
function StudentReportsModal({ student, reports, onClose }) {
  const studentReports = reports.filter(r => r.reportedUserId === student._id);
  const pendingCount = studentReports.filter(r => r.status === "pending").length;
  const reviewedCount = studentReports.filter(r => r.status === "reviewed").length;
  const rejectedCount = studentReports.filter(r => r.status === "rejected").length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 700, maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#e8f0fe", color: "#1565C0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flag size={16} />
          </div>
          <div>
            <div className="modal-title">Report History</div>
            <div style={{ fontSize: "0.68rem", color: "#aaa", marginTop: 2 }}>{student.fullName} ({student.studentId})</div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={15} /></button>
        </div>

        {studentReports.length === 0 ? (
          <div className="modal-body" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="empty-icon" style={{ width: 50, height: 50, marginBottom: 12 }}><Flag size={20} /></div>
            <div className="empty-title" style={{ marginBottom: 4 }}>No Reports Found</div>
            <div className="empty-sub">This student has not been reported.</div>
          </div>
        ) : (
          <>
            <div style={{ padding: "14px 28px", background: "#f8faff", borderBottom: "1px solid #e8f0fe", display: "flex", gap: 12 }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0d2257" }}>{studentReports.length}</div>
                <div style={{ fontSize: "0.62rem", color: "#aaa" }}>Total</div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#b7830a" }}>{pendingCount}</div>
                <div style={{ fontSize: "0.62rem", color: "#aaa" }}>Pending</div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1565C0" }}>{reviewedCount}</div>
                <div style={{ fontSize: "0.62rem", color: "#aaa" }}>Reviewed</div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#888" }}>{rejectedCount}</div>
                <div style={{ fontSize: "0.62rem", color: "#aaa" }}>Rejected</div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 0" }}>
              {studentReports.map((report, idx) => (
                <div key={report._id} style={{ padding: "14px 28px", borderBottom: "1px solid #f0f4ff", display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0d2257" }}>{report.contentTitle}</div>
                      <span className={`report-badge-type ${report.contentType === "File" ? "type-file" : "type-comment"}`}>{report.contentType}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: "0.62rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" }}>Reason</div>
                        <div style={{ fontSize: "0.72rem", color: "#444", fontWeight: 600 }}>{report.reason}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.62rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" }}>Reported By</div>
                        <div style={{ fontSize: "0.72rem", color: "#444", fontWeight: 600 }}>{report.reportedBy}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#666", lineHeight: 1.5, background: "#f8faff", padding: "8px 10px", borderRadius: 6, marginBottom: 8 }}>
                      {report.description}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "#aaa" }}>
                      {new Date(report.date).toLocaleDateString()} at {new Date(report.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <span className={`badge ${
                    report.status === "pending" ? "badge-pending" :
                    report.status === "reviewed" ? "badge-reviewed" : "badge-rejected"
                  }`} style={{ whiteSpace: "nowrap" }}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */
export default function AdminPanel() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState(MOCK_USERS);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [search, setSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reportStatusFilter, setReportStatusFilter] = useState("all");
  const [warnTarget, setWarnTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [studentReportsTarget, setStudentReportsTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = useCallback((msg, type = "success") => setToast({ msg, type }), []);

  /* ── API calls (fall back to mock on error) ── */
  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/users`, { headers: authHeader() })
      .then(r => setUsers(r.data))
      .catch(() => setUsers(MOCK_USERS))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios.get(`${API}/reports`, { headers: authHeader() })
      .then(r => setReports(r.data))
      .catch(() => setReports(MOCK_REPORTS));
  }, []);

  /* ── Handlers ── */
  const handleDelete = async (id) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (currentUser._id === id) {
      showToast("Cannot delete your own admin account.", "danger");
      setDeleteTarget(null);
      return;
    }
    try {
      await axios.delete(`${API}/users/${id}`, { headers: authHeader() });
    } catch {}
    setUsers(prev => prev.filter(u => u._id !== id));
    setDeleteTarget(null);
    showToast("User account deleted.", "danger");
  };

  const handleWarn = async (id, msg) => {
    try {
      await axios.post(`${API}/users/${id}/warn`, { message: msg }, { headers: authHeader() });
    } catch {}
    setUsers(prev => prev.map(u => u._id === id ? { ...u, warningCount: u.warningCount + 1 } : u));
    setWarnTarget(null);
    showToast("Warning sent to student.", "warn");
  };

  const handleReject = async (reportId) => {
    try {
      await axios.patch(`${API}/reports/${reportId}`, { status: "rejected" }, { headers: authHeader() });
    } catch {}
    setReports(prev => prev.map(r => r._id === reportId ? { ...r, status: "rejected" } : r));
    setReviewTarget(null);
    showToast("Report rejected — no action taken.");
  };

  const handleApproveWarn = async (reportId, userId, msg) => {
    try {
      await axios.patch(`${API}/reports/${reportId}`, { status: "reviewed" }, { headers: authHeader() });
    } catch {}
    setReports(prev => prev.map(r => r._id === reportId ? { ...r, status: "reviewed" } : r));
    if (userId) {
      try {
        await axios.post(`${API}/users/${userId}/warn`, { message: msg }, { headers: authHeader() });
      } catch {}
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, warningCount: u.warningCount + 1 } : u));
    }
    setReviewTarget(null);
    showToast("Report approved — warning sent.", "warn");
  };

  const handleApproveDelete = async (reportId, userId) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (currentUser._id === userId) {
      showToast("Cannot delete your own admin account.", "danger");
      setReviewTarget(null);
      return;
    }
    try {
      await axios.patch(`${API}/reports/${reportId}`, { status: "reviewed" }, { headers: authHeader() });
    } catch {}
    setReports(prev => prev.map(r => r._id === reportId ? { ...r, status: "reviewed" } : r));
    if (userId) {
      try {
        await axios.delete(`${API}/users/${userId}`, { headers: authHeader() });
      } catch {}
      setUsers(prev => prev.filter(u => u._id !== userId));
    }
    setReviewTarget(null);
    showToast("Report approved — user deleted.", "danger");
  };

  /* ── Derived ── */
  const faculties = [...new Set(users.map(u => u.faculty))];

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = !q || u.fullName.toLowerCase().includes(q) || u.studentId.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchF = facultyFilter === "all" || u.faculty === facultyFilter;
    const matchS = statusFilter === "all" || (statusFilter === "active" ? u.isActive : !u.isActive);
    return matchQ && matchF && matchS;
  });

  const filteredReports = reports.filter(r =>
    reportStatusFilter === "all" || r.status === reportStatusFilter
  );

  const pendingCount = reports.filter(r => r.status === "pending").length;

  /* ── Stats ── */
  const stats = [
    { icon: <Users size={18} />, label: "Total Users",    value: users.length,                         bg: "#e8f0fe", color: "#1565C0" },
    { icon: <CheckCircle size={18} />, label: "Active",  value: users.filter(u => u.isActive).length,  bg: "#e6f4f1", color: "#0f6e56" },
    { icon: <Flag size={18} />, label: "Pending Reports", value: pendingCount,                          bg: "#fce8ef", color: "#993556" },
    { icon: <AlertTriangle size={18} />, label: "Warned Users", value: users.filter(u => u.warningCount > 0).length, bg: "#fef9e7", color: "#b7830a" },
  ];

  const adminName = (JSON.parse(localStorage.getItem("user") || "{}")).fullName || "Admin";
  const adminId = (JSON.parse(localStorage.getItem("user") || "{}"))._id || null;
  const adminInitials = adminName.split(" ").map(n => n[0]).slice(0,2).join("");

  return (
    <div>
      <style>{CSS}</style>

      <div className="admin-shell">
        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-title">UniShare</div>
            <div className="sidebar-logo-sub">Admin Panel</div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section-label">Management</div>
            <button className={`nav-item${tab === "users" ? " active" : ""}`} onClick={() => setTab("users")}>
              <Users size={16} /> User Management
            </button>
            <button className={`nav-item${tab === "reports" ? " active" : ""}`} onClick={() => setTab("reports")}>
              <Flag size={16} /> Reports
              {pendingCount > 0 && <span className="badge">{pendingCount}</span>}
            </button>

            <div className="nav-section-label" style={{ marginTop: 8 }}>Analytics</div>
            <button className={`nav-item${tab === "stats" ? " active" : ""}`} onClick={() => setTab("stats")}>
              <BarChart2 size={16} /> Overview Stats
            </button>

            <div className="nav-section-label" style={{ marginTop: 8 }}>System</div>
            <button className="nav-item">
              <Bell size={16} /> Notifications
              <span className="badge">{pendingCount}</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-admin-chip">
              <div className="sidebar-admin-avatar">{adminInitials}</div>
              <div>
                <div className="sidebar-admin-name">{adminName.split(" ")[0]}</div>
                <div className="sidebar-admin-role">Administrator</div>
              </div>
            </div>
            <button className="btn-logout-side" onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/login"; }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="admin-main">
          {/* TOPBAR */}
          <div className="topbar">
            <div>
              <div className="topbar-title">
                {tab === "users" ? "User Management" : tab === "reports" ? "Report Management" : "Overview Stats"}
              </div>
              <div className="topbar-sub">
                {tab === "users" ? `${filteredUsers.length} users found` : tab === "reports" ? `${filteredReports.length} reports` : "Platform overview"}
              </div>
            </div>
            <div className="topbar-actions">
              {tab === "users" && (
                <div className="search-wrap">
                  <Search size={14} className="search-icon" />
                  <input className="search-input" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              )}
              <button className="btn btn-ghost btn-icon" title="Refresh" onClick={() => window.location.reload()}>
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="admin-content">

            {/* ── STATS ROW (always visible) ── */}
            <div className="stat-row">
              {stats.map(s => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── USER MANAGEMENT TAB ── */}
            {tab === "users" && (
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <Users size={15} className="panel-title-icon" /> Registered Students
                  </div>
                  <div className="panel-actions">
                    <div className="filter-bar">
                      <select className="filter-select" value={facultyFilter} onChange={e => setFacultyFilter(e.target.value)}>
                        <option value="all">All Faculties</option>
                        {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                      <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <button className="btn btn-ghost" onClick={() => exportCSV(filteredUsers)}>
                      <Download size={13} /> Export CSV
                    </button>
                  </div>
                </div>
                <div className="table-wrap">
                  {loading ? (
                    <div className="empty-state"><div className="empty-title">Loading users…</div></div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon"><Users size={26} /></div>
                      <div className="empty-title">No users found</div>
                      <div className="empty-sub">Try adjusting your search or filters.</div>
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Student ID</th>
                          <th>Full Name</th>
                          <th>Email</th>
                          <th>Faculty</th>
                          <th>Year / Sem</th>
                          <th>Warnings</th>
                          <th>Reports</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(u => {
                          const userReportCount = reports.filter(r => r.reportedUserId === u._id).length;
                          return (
                            <tr key={u._id}>
                              <td className="td-id">{u.studentId}</td>
                              <td className="td-name">{u.fullName}</td>
                              <td className="td-email">{u.email}</td>
                              <td style={{ fontSize: "0.73rem" }}>{u.faculty.replace("Faculty of ", "")}</td>
                              <td style={{ fontSize: "0.73rem" }}>{u.academicYear} · {u.semester}</td>
                              <td>
                                <span className={`warn-count ${u.warningCount === 0 ? "warn-0" : u.warningCount === 1 ? "warn-1" : "warn-2plus"}`}>
                                  {u.warningCount}
                                </span>
                              </td>
                              <td>
                                {userReportCount > 0 ? (
                                  <button 
                                    className="btn btn-primary btn-sm" 
                                    onClick={() => setStudentReportsTarget(u)}
                                    title={`View ${userReportCount} report${userReportCount !== 1 ? 's' : ''}`}
                                  >
                                    <Flag size={11} /> {userReportCount}
                                  </button>
                                ) : (
                                  <span style={{ fontSize: "0.7rem", color: "#aaa", fontWeight: 600 }}>—</span>
                                )}
                              </td>
                              <td>
                                <span className={`badge ${u.isActive ? "badge-active" : "badge-inactive"}`}>
                                  {u.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ── REPORTS TAB ── */}
            {tab === "reports" && (
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <Flag size={15} className="panel-title-icon" /> Content Reports
                  </div>
                  <div className="panel-actions">
                    <select className="filter-select" value={reportStatusFilter} onChange={e => setReportStatusFilter(e.target.value)}>
                      <option value="all">All Reports</option>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="table-wrap">
                  {filteredReports.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon"><Flag size={26} /></div>
                      <div className="empty-title">No reports here</div>
                      <div className="empty-sub">All reports matching the filter will appear here.</div>
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Content Title</th>
                          <th>Type</th>
                          <th>Reason</th>
                          <th>Reported By</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.map(r => (
                          <tr key={r._id}>
                            <td className="td-name" style={{ maxWidth: 200 }}>{r.contentTitle}</td>
                            <td>
                              <span className={`report-badge-type ${r.contentType === "File" ? "type-file" : "type-comment"}`}>
                                {r.contentType}
                              </span>
                            </td>
                            <td style={{ fontSize: "0.73rem" }}>{r.reason}</td>
                            <td style={{ fontSize: "0.73rem" }}>{r.reportedBy}</td>
                            <td style={{ fontSize: "0.7rem", color: "#aaa" }}>{r.date}</td>
                            <td>
                              <span className={`badge ${
                                r.status === "pending" ? "badge-pending" :
                                r.status === "reviewed" ? "badge-reviewed" : "badge-rejected"
                              }`}>
                                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                              </span>
                            </td>
                            <td>
                              {r.status === "pending" ? (
                                <button className="btn btn-primary btn-sm" onClick={() => setReviewTarget(r)}>
                                  <Eye size={11} /> Review
                                </button>
                              ) : (
                                <span style={{ fontSize: "0.68rem", color: "#bbb", fontWeight: 600 }}>
                                  {r.status === "reviewed" ? "✓ Actioned" : "✗ Ignored"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ── STATS TAB ── */}
            {tab === "stats" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title"><BookOpen size={15} className="panel-title-icon" /> Users by Faculty</div>
                  </div>
                  <div style={{ padding: "16px 24px" }}>
                    {faculties.map(f => {
                      const count = users.filter(u => u.faculty === f).length;
                      const pct = Math.round((count / users.length) * 100);
                      return (
                        <div key={f} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 5 }}>
                            <span style={{ fontWeight: 600, color: "#0d2257" }}>{f.replace("Faculty of ", "")}</span>
                            <span style={{ color: "#aaa" }}>{count} students</span>
                          </div>
                          <div style={{ height: 8, background: "#f0f4ff", borderRadius: 20, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#0d2257,#1565C0)", borderRadius: 20 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title"><Flag size={15} className="panel-title-icon" /> Report Summary</div>
                  </div>
                  <div style={{ padding: "16px 24px" }}>
                    {[
                      { label: "Pending Review", count: reports.filter(r => r.status === "pending").length, color: "#b7830a", bg: "#fef9e7" },
                      { label: "Reviewed",       count: reports.filter(r => r.status === "reviewed").length, color: "#1565C0", bg: "#e8f0fe" },
                      { label: "Rejected",       count: reports.filter(r => r.status === "rejected").length, color: "#888", bg: "#f4f7ff" },
                    ].map(s => (
                      <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: "0.78rem", fontWeight: 600, color: "#0d2257" }}>{s.label}</span>
                        <span className="badge" style={{ background: s.bg, color: s.color }}>{s.count}</span>
                      </div>
                    ))}
                    <hr className="divider" />
                    {[
                      { label: "Users with Warnings", count: users.filter(u => u.warningCount > 0).length, color: "#b7830a", bg: "#fef9e7" },
                      { label: "Inactive Accounts",   count: users.filter(u => !u.isActive).length,         color: "#993556", bg: "#fce8ef" },
                    ].map(s => (
                      <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: "0.78rem", fontWeight: 600, color: "#0d2257" }}>{s.label}</span>
                        <span className="badge" style={{ background: s.bg, color: s.color }}>{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ── MODALS ── */}
      {warnTarget   && <WarnModal   user={warnTarget}   onClose={() => setWarnTarget(null)}   onSend={handleWarn} />}
      {deleteTarget && <DeleteModal target={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />}
      {reviewTarget && (
        <ReviewModal
          report={reviewTarget} users={users} adminId={adminId}
          onClose={() => setReviewTarget(null)}
          onApproveWarn={handleApproveWarn}
          onApproveDelete={handleApproveDelete}
          onReject={handleReject}
        />
      )}
      {studentReportsTarget && (
        <StudentReportsModal
          student={studentReportsTarget}
          reports={reports}
          onClose={() => setStudentReportsTarget(null)}
        />
      )}

      {/* ── TOAST ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}