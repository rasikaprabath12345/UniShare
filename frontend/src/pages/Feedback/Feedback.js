import React, { useState } from "react";
import "./Feedback.css";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:8000/api/feedback/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const handleReset = () => {
    setStatus(null);
    setErrorMsg("");
  };

  return (
    <div className="fb-page">
      {/* Background decoration */}
      <div className="fb-bg-circle fb-bg-circle--1" />
      <div className="fb-bg-circle fb-bg-circle--2" />

      <div className="fb-card">
        {/* Header */}
        <div className="fb-header">
          <div className="fb-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" className="fb-icon">
              <path
                d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="fb-title">Share Your Feedback</h1>
            <p className="fb-subtitle">
              Your thoughts help us improve the experience for every student.
            </p>
          </div>
        </div>

        {/* Success State */}
        {status === "success" ? (
          <div className="fb-success">
            <div className="fb-success__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M8 12L11 15L16 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="fb-success__title">Feedback Received!</h2>
            <p className="fb-success__msg">
              Thank you for taking the time to share your thoughts. We truly value your input.
            </p>
            <button className="fb-btn fb-btn--ghost" onClick={handleReset}>
              Submit Another
            </button>
          </div>
        ) : (
          /* Form */
          <form className="fb-form" onSubmit={handleSubmit} noValidate>
            {status === "error" && (
              <div className="fb-alert fb-alert--error">
                <svg viewBox="0 0 24 24" fill="none" className="fb-alert__icon">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
                {errorMsg}
              </div>
            )}

            <div className="fb-row">
              {/* Name */}
              <div className="fb-field">
                <label className="fb-label" htmlFor="name">
                  Full Name
                </label>
                <div className="fb-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" className="fb-input-icon">
                    <path
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="fb-input"
                    placeholder="e.g. Amal Perera"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="fb-field">
                <label className="fb-label" htmlFor="email">
                  University Email
                </label>
                <div className="fb-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" className="fb-input-icon">
                    <path
                      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="fb-input"
                    placeholder="you@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="fb-field">
              <label className="fb-label" htmlFor="message">
                Your Message
              </label>
              <div className="fb-textarea-wrap">
                <textarea
                  id="message"
                  name="message"
                  className="fb-textarea"
                  placeholder="Share your experience, suggestions, or concerns…"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <span className="fb-char-count">{formData.message.length} chars</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`fb-btn fb-btn--primary ${status === "loading" ? "fb-btn--loading" : ""}`}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <span className="fb-spinner" />
                  Sending…
                </>
              ) : (
                <>
                  Send Feedback
                  <svg viewBox="0 0 24 24" fill="none" className="fb-btn__icon">
                    <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;