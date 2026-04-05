import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Star, Send, MessageSquare, CheckCircle } from "lucide-react";
import "./Feedback.css";

function Feedback() {
  const [user, setUser]       = useState(null);
  const [message, setMessage] = useState("");
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}
  }, []);

  const initials = (user?.fullName || user?.name || "U")
    .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || rating === 0) return;
    try {
      setLoading(true);
      await axios.post("http://localhost:8000/feedback/add", {
        name:  user?.fullName || user?.name,
        email: user?.email,
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
    <div>
      <Navbar />

      {/* HERO */}
      <section className="fb-hero">
        <div className="fb-hero-bg" />
        <div className="fb-hero-overlay" />
        <div className="fb-hero-content">
          <div className="fb-hero-chip">
            <MessageSquare size={13} />
            <span>Student Feedback</span>
          </div>
          <h1 className="fb-hero-heading">Share Your Knowledge</h1>
          <p className="fb-hero-sub">
            Help us improve UniShare for thousands of Sri Lankan students.
            Your feedback directly shapes new features and improvements.
          </p>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div className="fb-page">

        {/* Left: info panel */}
        <div className="fb-info-panel">
          <div className="fb-info-img-wrap">
            <img src="/images/background.png" alt="Feedback" className="fb-info-img" />
            <div className="fb-info-img-overlay" />
          </div>

          <div className="fb-info-body">
            <div className="fb-section-label">Why your voice matters</div>
            <div className="fb-info-items">
              <div className="fb-info-item">
                <div className="fb-info-item-icon">
                  <Star size={16} />
                </div>
                <div>
                  <strong>Shape the Platform</strong>
                  <span>Every rating helps us prioritise what matters most to students.</span>
                </div>
              </div>
              <div className="fb-info-item">
                <div className="fb-info-item-icon">
                  <Send size={16} />
                </div>
                <div>
                  <strong>Secure & Private</strong>
                  <span>Your feedback is handled with care. We take privacy seriously.</span>
                </div>
              </div>
              <div className="fb-info-item">
                <div className="fb-info-item-icon">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <strong>Read by the Team</strong>
                  <span>Our team personally reads every submission and acts on trends.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form card */}
        <div className="fb-form-card">
          {done ? (
            <div className="fb-done">
              <div className="fb-done-icon">
                <CheckCircle size={36} strokeWidth={1.5} />
              </div>
              <div className="fb-done-title">Thank you!</div>
              <div className="fb-done-sub">
                Your feedback has been submitted. We read every response and use it to improve UniShare for everyone.
              </div>
              <button className="fb-done-btn" onClick={() => { setDone(false); setRating(0); setMessage(""); }}>
                Submit Another
              </button>
            </div>
          ) : (
            <>
              <div className="fb-form-heading">Leave a Review</div>
              <div className="fb-form-sub">Takes less than a minute</div>

              {/* User box */}
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
              <div className="fb-field-label">Rate your experience</div>
              <div className="fb-stars">
                {[1,2,3,4,5].map((v) => (
                  <Star
                    key={v}
                    size={30}
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
              <div className="fb-field-label">Your message</div>
              <textarea
                className="fb-textarea"
                placeholder="Tell us what you love, what could be better, or any feature ideas…"
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

      <Footer />
    </div>
  );
}

export default Feedback;