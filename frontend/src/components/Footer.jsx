import React, { useState } from "react";
import { Twitter, Linkedin, Instagram, Facebook, ArrowUp, X, Star, MessageSquare, Send } from "lucide-react";
import axios from "axios";

// ── Inline Feedback Modal ─────────────────────────────────────────────────────
function FeedbackModal({ onClose }) {
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  let user = null;
  try { user = JSON.parse(localStorage.getItem("user")); } catch {}

  const initials = (user?.fullName || user?.name || "U")
    .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || rating === 0) return;
    try {
      setLoading(true);
      await axios.post("http://localhost:8000/feedback/add", {
        name:    user?.fullName || user?.name,
        email:   user?.email,
        message,
        rating,
      });
      setDone(true);
    } catch {
      alert("Error submitting feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .fb-overlay {
          position: fixed; inset: 0; z-index: 3000;
          background: rgba(10,24,55,0.65);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fbOverlayIn 0.25s ease both;
        }
        @keyframes fbOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .fb-modal {
          background: white;
          border-radius: 24px;
          width: 100%; max-width: 820px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,0.28);
          animation: fbModalIn 0.4s cubic-bezier(.22,.68,0,1.15) both;
          display: flex;
          min-height: 480px;
        }
        @keyframes fbModalIn {
          from { opacity: 0; transform: translateY(36px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Left panel */
        .fb-panel-left {
          width: 300px; flex-shrink: 0;
          background: linear-gradient(160deg, #0d2257 0%, #1565C0 100%);
          padding: 48px 36px;
          display: flex; flex-direction: column;
          justify-content: space-between;
          position: relative; overflow: hidden;
        }
        .fb-panel-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("./images/background.png");
          background-size: cover; background-position: center;
          opacity: 0.08;
        }
        .fb-panel-left-geo {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.10;
        }
        .fb-left-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
        }
        .fb-left-heading {
          font-family: 'Poppins', sans-serif;
          font-size: 1.55rem; font-weight: 800;
          color: white; line-height: 1.2; margin-bottom: 12px;
        }
        .fb-left-sub {
          font-family: 'Poppins', sans-serif;
          font-size: 0.82rem; color: rgba(255,255,255,0.65);
          line-height: 1.7;
        }
        .fb-left-badges {
          display: flex; flex-direction: column; gap: 10px; margin-top: 32px;
        }
        .fb-left-badge {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 10px; padding: 10px 14px;
        }
        .fb-left-badge-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .fb-left-badge-text {
          font-family: 'Poppins', sans-serif;
          font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.85);
        }
        .fb-left-badge-text span {
          display: block; font-size: 0.68rem;
          color: rgba(255,255,255,0.50); font-weight: 400;
        }

        /* Right panel */
        .fb-panel-right {
          flex: 1; padding: 40px 40px 36px;
          display: flex; flex-direction: column;
          position: relative;
        }
        .fb-close-btn {
          position: absolute; top: 16px; right: 16px;
          width: 32px; height: 32px; border-radius: 50%;
          background: #f4f7ff; border: none;
          color: #8898bb; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s;
        }
        .fb-close-btn:hover { background: #e8eef7; color: #0d2257; }

        /* User box */
        .fb-user-row {
          display: flex; align-items: center; gap: 12px;
          background: #f4f7ff; border: 1px solid #dde8f8;
          border-radius: 12px; padding: 12px 16px; margin-bottom: 24px;
        }
        .fb-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: linear-gradient(135deg, #0d2257, #1565C0);
          color: white;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem; font-weight: 700; flex-shrink: 0;
        }
        .fb-user-name {
          font-family: 'Poppins', sans-serif;
          font-size: 0.88rem; font-weight: 700; color: #0d2257;
        }
        .fb-user-email {
          font-family: 'Poppins', sans-serif;
          font-size: 0.75rem; color: #8898bb;
        }

        /* Stars */
        .fb-stars-label {
          font-family: 'Poppins', sans-serif;
          font-size: 0.80rem; font-weight: 600; color: #0d2257;
          margin-bottom: 8px;
        }
        .fb-stars {
          display: flex; gap: 6px; margin-bottom: 22px;
        }
        .fb-star {
          cursor: pointer; transition: transform 0.18s, color 0.18s;
          color: #d1d5db;
        }
        .fb-star.lit { color: #fbbf24; }
        .fb-star:hover { transform: scale(1.2); }

        /* Textarea */
        .fb-textarea-label {
          font-family: 'Poppins', sans-serif;
          font-size: 0.80rem; font-weight: 600; color: #0d2257; margin-bottom: 8px;
        }
        .fb-textarea {
          width: 100%; flex: 1;
          min-height: 120px;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid #dde8f8;
          resize: none;
          font-family: 'Poppins', sans-serif; font-size: 0.85rem;
          color: #333; background: #fafcff;
          transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 20px;
        }
        .fb-textarea:focus {
          outline: none; border-color: #1565C0;
          box-shadow: 0 0 0 3px rgba(21,101,192,0.10);
          background: white;
        }
        .fb-textarea::placeholder { color: #bbb; }

        /* Submit button */
        .fb-submit-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%);
          color: white; border: none; border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.88rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(21,101,192,0.30);
        }
        .fb-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(21,101,192,0.40);
        }
        .fb-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Success state */
        .fb-success {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 16px;
          text-align: center; padding: 20px;
          animation: fbModalIn 0.4s ease both;
        }
        .fb-success-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: #e8f0fe;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.2rem;
        }
        .fb-success-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.3rem; font-weight: 800; color: #0d2257;
        }
        .fb-success-sub {
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem; color: #8898bb; line-height: 1.6; max-width: 260px;
        }
        .fb-success-close {
          margin-top: 8px; padding: 10px 28px;
          background: #1565C0; color: white; border: none;
          border-radius: 24px; font-family: 'Poppins', sans-serif;
          font-size: 0.83rem; font-weight: 700; cursor: pointer;
          transition: background 0.2s;
        }
        .fb-success-close:hover { background: #0d47a1; }

        @media (max-width: 640px) {
          .fb-modal { flex-direction: column; }
          .fb-panel-left { width: 100%; min-height: 160px; padding: 28px 24px; }
          .fb-left-badges { display: none; }
          .fb-panel-right { padding: 28px 24px 24px; }
        }
      `}</style>

      <div className="fb-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="fb-modal">

          {/* ── Left decorative panel ── */}
          <div className="fb-panel-left">
            <svg className="fb-panel-left-geo" viewBox="0 0 300 480" xmlns="http://www.w3.org/2000/svg">
              <polygon points="300,0 300,200 100,0" fill="#40E0D0"/>
              <polygon points="0,480 200,480 0,280" fill="#40E0D0"/>
              <circle cx="260" cy="380" r="80" fill="#ffffff" opacity="0.04"/>
            </svg>

            <div>
              <div className="fb-left-icon">
                <MessageSquare size={24} color="white" />
              </div>
              <div className="fb-left-heading">Share Your<br />Feedback</div>
              <div className="fb-left-sub">
                Help us build a better UniShare. Your thoughts shape the platform for thousands of students.
              </div>
            </div>

            <div className="fb-left-badges">
              <div className="fb-left-badge">
                <div className="fb-left-badge-icon">
                  <Star size={14} color="white" />
                </div>
                <div className="fb-left-badge-text">
                  Rate your experience
                  <span>1 to 5 stars</span>
                </div>
              </div>
              <div className="fb-left-badge">
                <div className="fb-left-badge-icon">
                  <Send size={14} color="white" />
                </div>
                <div className="fb-left-badge-text">
                  Anonymous & secure
                  <span>We take privacy seriously</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right form panel ── */}
          <div className="fb-panel-right">
            <button className="fb-close-btn" onClick={onClose}><X size={14} /></button>

            {done ? (
              <div className="fb-success">
                <div className="fb-success-icon">✓</div>
                <div className="fb-success-title">Thank you!</div>
                <div className="fb-success-sub">
                  Your feedback has been submitted. We read every response and use it to improve UniShare.
                </div>
                <button className="fb-success-close" onClick={onClose}>Close</button>
              </div>
            ) : (
              <>
                {/* User info */}
                {user && (
                  <div className="fb-user-row">
                    <div className="fb-avatar">{initials}</div>
                    <div>
                      <div className="fb-user-name">{user.fullName || user.name}</div>
                      <div className="fb-user-email">{user.email}</div>
                    </div>
                  </div>
                )}

                {/* Stars */}
                <div className="fb-stars-label">Rate your experience</div>
                <div className="fb-stars">
                  {[1,2,3,4,5].map((v) => (
                    <Star
                      key={v}
                      size={28}
                      className={`fb-star${v <= (hover || rating) ? " lit" : ""}`}
                      fill={v <= (hover || rating) ? "#fbbf24" : "none"}
                      strokeWidth={1.5}
                      onClick={() => setRating(v)}
                      onMouseEnter={() => setHover(v)}
                      onMouseLeave={() => setHover(null)}
                    />
                  ))}
                </div>

                {/* Message */}
                <div className="fb-textarea-label">Your message</div>
                <textarea
                  className="fb-textarea"
                  placeholder="Tell us what you love, what could be better, or any feature ideas..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <button
                  className="fb-submit-btn"
                  onClick={handleSubmit}
                  disabled={loading || !message || rating === 0}
                >
                  <Send size={15} />
                  {loading ? "Sending…" : "Submit Feedback"}
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}


// ── Footer ────────────────────────────────────────────────────────────────────
export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');

        .us-footer {
          font-family: 'DM Sans', sans-serif;
          background: #001F3F;
          position: relative;
          overflow: hidden;
          color: #F0F8FF;
        }

        .us-footer-geo {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.06;
        }
        .us-footer-geo svg {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
        }

        .us-footer-topbar {
          height: 4px;
          background: linear-gradient(90deg, #40E0D0, #00B4D8, #40E0D0);
        }

        .us-footer-inner {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 40px 32px;
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr;
          gap: 40px;
        }

        @media (max-width: 900px) {
          .us-footer-inner { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .us-footer-inner { grid-template-columns: 1fr; padding: 40px 24px 24px; }
        }

        .us-brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .us-brand-logo .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .us-brand-logo .logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .us-brand-logo span {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          color: #F0F8FF;
          letter-spacing: 0.02em;
        }

        .us-brand-desc {
          font-size: 0.84rem;
          line-height: 1.75;
          color: rgba(240,248,255,0.55);
          max-width: 260px;
          margin-bottom: 28px;
        }

        .us-socials {
          display: flex;
          gap: 10px;
        }
        .us-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(64,224,208,0.25);
          background: rgba(64,224,208,0.07);
          color: #40E0D0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          text-decoration: none;
        }
        .us-social-btn:hover {
          background: rgba(64,224,208,0.2);
          transform: translateY(-2px);
        }

        .us-col h4 {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #40E0D0;
          margin-bottom: 20px;
        }
        .us-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .us-col ul li a {
          font-size: 0.855rem;
          color: rgba(240,248,255,0.55);
          text-decoration: none;
          transition: color 0.2s;
          display: inline-block;
        }
        .us-col ul li a:hover {
          color: #00B4D8;
        }

        .us-feedback-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          padding: 9px 22px;
          background: linear-gradient(135deg, #40E0D0, #00B4D8);
          color: #001F3F;
          border: none;
          border-radius: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(64,224,208,0.25);
          text-transform: uppercase;
        }
        .us-feedback-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(64,224,208,0.35);
        }

        .us-footer-divider {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .us-footer-divider hr {
          border: none;
          border-top: 1px solid rgba(64,224,208,0.12);
        }

        .us-footer-bottom {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 40px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .us-footer-bottom p {
          font-size: 0.8rem;
          color: rgba(240,248,255,0.3);
        }
        .us-back-top {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(240,248,255,0.55);
          background: rgba(64,224,208,0.07);
          border: 1px solid rgba(64,224,208,0.2);
          border-radius: 6px;
          padding: 8px 14px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .us-back-top:hover {
          background: rgba(64,224,208,0.15);
          color: #40E0D0;
        }
      `}</style>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}

      <footer className="us-footer">
        <div className="us-footer-geo">
          <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <polygon points="900,0 1200,0 1200,400" fill="#40E0D0" />
            <polygon points="700,0 1100,400 400,400" fill="#00B4D8" opacity="0.5"/>
            <polygon points="500,0 900,400 100,400" fill="#003366" opacity="0.6"/>
          </svg>
        </div>

        <div className="us-footer-topbar" />

        <div className="us-footer-inner">
          <div>
            <div className="us-brand-logo">
              <div className="logo-icon">
                <img src="./images/Logo.png" alt="UniShare Logo" />
              </div>
              <span>UniShare</span>
            </div>
            <p className="us-brand-desc">
              Empowering Sri Lankan university students with free study resources, peer learning sessions, and AI-powered quizzes.
            </p>
            <div className="us-socials">
              <a className="us-social-btn" href="#"><Twitter size={15} /></a>
              <a className="us-social-btn" href="#"><Linkedin size={15} /></a>
              <a className="us-social-btn" href="#"><Instagram size={15} /></a>
              <a className="us-social-btn" href="#"><Facebook size={15} /></a>
            </div>
          </div>

          <div className="us-col">
            <h4>Site Map</h4>
            <ul>
              <li><a href="#">Homepage</a></li>
              <li><a href="#">Library</a></li>
              <li><a href="#">Quiz</a></li>
              <li><a href="#">KUPPI Sessions</a></li>
              <li><a href="#">Forum</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Portal</a></li>
            </ul>
          </div>

          <div className="us-col">
            <h4>Resources &amp; News</h4>
            <ul>
              <li><a href="#">Study Guides</a></li>
              <li><a href="#">Past Papers</a></li>
              <li><a href="#">Lecture Notes</a></li>
              <li><a href="#">Student Blog</a></li>
              <li><a href="#">Announcements</a></li>
            </ul>
          </div>

          <div className="us-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
            <button
              className="us-feedback-btn"
              onClick={() => setShowFeedback(true)}
            >
              <MessageSquare size={13} />
              Feedback
            </button>
          </div>
        </div>

        <div className="us-footer-divider"><hr /></div>

        <div className="us-footer-bottom">
          <p>©️ 2026 UniShare · All Rights Reserved</p>
          <button className="us-back-top" onClick={scrollToTop}>
            <ArrowUp size={13} /> Back to Top
          </button>
        </div>
      </footer>
    </>
  );
}