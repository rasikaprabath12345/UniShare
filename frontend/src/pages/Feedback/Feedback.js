import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Feedback.css";

function Feedback() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load logged user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message || rating === 0) {
      alert("Please add message and rating");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:8000/feedback/add", {
        name: user.fullName || user.name,
        email: user.email,
        message,
        rating
      });

      setMessage("");
      setRating(0);
      alert("Feedback submitted successfully 🎉");

    } catch (error) {
      console.error(error);
      alert("Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fb-container">
      <div className="fb-card">

        <h2 className="fb-title">💬 Share Your Feedback</h2>
        <p className="fb-sub">
          Help us improve UniShare experience 🚀
        </p>

        {/* User Info */}
        {user && (
          <div className="fb-user-box">
            <div className="fb-avatar">
              {(user.fullName || user.name)
                ?.split(" ")
                .map(w => w[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <div className="fb-name">
                {user.fullName || user.name}
              </div>
              <div className="fb-email">{user.email}</div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Rating */}
          <div className="fb-rating">
            <p>Rate your experience:</p>
            <div className="stars">
              {[...Array(5)].map((_, index) => {
                const value = index + 1;
                return (
                  <span
                    key={value}
                    className={
                      value <= (hover || rating)
                        ? "star active"
                        : "star"
                    }
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(null)}
                  >
                    ★
                  </span>
                );
              })}
            </div>
          </div>

          {/* Message */}
          <textarea
            placeholder="Write your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="fb-textarea"
          />

          <button className="fb-btn" disabled={loading}>
            {loading ? "Sending..." : "Submit Feedback"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Feedback;