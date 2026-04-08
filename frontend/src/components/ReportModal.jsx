import { useState } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle, CheckCircle, Flag } from "lucide-react";
import { reportService } from "../services/reportService";
import "./ReportModal.css";

export default function ReportModal({ contentId, contentType, contentTitle, contentOwnerId, contentOwnerName, onClose, onSuccess }) {
  // v2.1 - No validation blocking
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const reasons = [
    "Offensive Language",
    "Harassment",
    "Spam",
    "Plagiarism",
    "Cheating/Academic Misconduct",
    "Inappropriate Content",
    "Copyright Violation",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      setError("Please select a reason");
      return;
    }
    if (!description.trim()) {
      setError("Please provide a description");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || user?.id;
      
      // Get content owner ID - handle both object and string formats
      let contentOwnerIdValue = contentOwnerId;
      if (typeof contentOwnerId === 'object' && contentOwnerId !== null) {
        contentOwnerIdValue = contentOwnerId._id || contentOwnerId.id;
      }
      
      console.log("✅ REPORT SUBMIT - No validation blocking");
      
      const reportData = {
        reportedBy: user?.name || user?.email || user?.fullName || "Anonymous",
        reportedByUserId: userId,
        reportedUserId: contentOwnerIdValue,
        contentId: contentId,
        contentTitle: contentTitle,
        contentType: "File",
        contentOwnerId: contentOwnerIdValue,
        contentOwnerName: contentOwnerName,
        reason,
        description,
        status: "pending",
      };

      console.log("📤 Sending report:", reportData);
      
      const response = await reportService.submitReport(reportData);
      console.log("✅ Report submitted successfully:", response);
      
      setSuccess(true);
      if (onSuccess) onSuccess();
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("❌ Report error:", err);
      setError(err.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return createPortal(
      <div className="report-modal-overlay" onClick={onClose}>
        <div className="report-modal" onClick={(e) => e.stopPropagation()}>
          <div className="report-success">
            <CheckCircle size={40} className="success-icon" />
            <h2>Report Submitted</h2>
            <p>Thank you for helping keep our community safe. Our team will review your report shortly.</p>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="report-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#e8f0fe", color: "#1565C0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flag size={16} />
            </div>
            <div>
              <h2>Report Content</h2>
              <p className="report-modal-subtitle">{contentTitle || contentType}</p>
            </div>
          </div>
          <button className="report-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="report-modal-form">
          {/* Error message */}
          {error && (
            <div className="report-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Reason selection */}
          <div className="report-form-group">
            <label className="report-form-label">Why are you reporting this?</label>
            <div className="report-reasons-grid">
              {reasons.map((r) => (
                <label key={r} className="report-reason-option">
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setError("");
                    }}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="report-form-group">
            <label className="report-form-label">
              Additional Details
              <span className="report-char-count">
                {description.length}/500
              </span>
            </label>
            <textarea
              className="report-textarea"
              placeholder="Please provide more details about why you're reporting this content..."
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setDescription(e.target.value);
                  setError("");
                }
              }}
              rows="3"
            />
          </div>

          {/* Buttons */}
          <div className="report-modal-actions">
            <button
              type="button"
              className="report-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="report-btn-submit"
              disabled={loading || !reason || !description.trim()}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
