import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./About.css";

import {
  BookOpen,
  Users,
  Brain,
  MessageSquare,
  CheckCircle2,
  Upload,
  Video,
  Zap,
  Globe,
  HeartHandshake
} from "lucide-react";

function About() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) {
        setUser(stored);
        setForm((p) => ({
          ...p,
          name: stored.fullName || stored.name || p.name,
          email: stored.email || p.email,
        }));
      }
    } catch {}
  }, []);

  const heroStyle = {
    backgroundImage: `linear-gradient(135deg, rgba(21, 101, 192, 0.5), rgba(30, 136, 229, 0.5)), url(${process.env.PUBLIC_URL}/images/background2.jpg)`
  };

  const featuresStyle = {
    backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.7), rgba(244,247,255,0.7)), url(${process.env.PUBLIC_URL}/images/background.png)`
  };

  const statsStyle = {
    backgroundImage: `linear-gradient(135deg, rgba(21, 101, 192, 0.55), rgba(30, 136, 229, 0.55)), url(${process.env.PUBLIC_URL}/images/image1.jpg)`
  };

  const handleFormChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSending(true);
      await axios.post("http://localhost:8000/Feedback/add", {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setSent(true);
      setForm((p) => ({ ...p, message: "" }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="about-page">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero" style={heroStyle}>
        <div className="about-hero-content">
          <h1>About UniShare</h1>
          <p>
            UniShare.lk is a student learning platform designed specifically for
            Sri Lankan university students. We combine AI-powered tools,
            collaborative learning, and verified resources to help students
            succeed together.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to make learning easier, smarter, and more accessible
          for every Sri Lankan student.
        </p>
      </section>

      {/* Features */}
      <section className="about-features" style={featuresStyle}>
        <h2>Our  Features</h2>
        

        <div className="feature-grid">
          <div className="feature-card">
            <BookOpen size={28} />
            <h3>Library</h3>
            <p>Access study materials and notes</p>
          </div>

          <div className="feature-card">
            <Users size={28} />
            <h3>KUPPI</h3>
            <p>Peer learning sessions</p>
          </div>

          <div className="feature-card">
            <Brain size={28} />
            <h3>AI Quiz</h3>
            <p>Generate quizzes from slides</p>
          </div>

          <div className="feature-card">
            <MessageSquare size={28} />
            <h3>Forum</h3>
            <p>Ask questions & collaborate</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="about-how">
        <h2>How It Works</h2>

        <div className="how-grid">
          <div className="how-card">
            <Upload size={24} />
            <h3>Upload Slides</h3>
          </div>

          <div className="how-card">
            <Zap size={24} />
            <h3>AI Generate</h3>
          </div>

          <div className="how-card">
            <Brain size={24} />
            <h3>Practice</h3>
          </div>

          <div className="how-card">
            <Video size={24} />
            <h3>Join Kuppi</h3>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="about-why">
        <h2>Why Choose Us</h2>

        <div className="why-grid">
          <div className="why-card">
            <CheckCircle2 size={20} />
            <p>Easy to Use</p>
          </div>

          <div className="why-card">
            <Zap size={20} />
            <p>Interactive Learning</p>
          </div>

          <div className="why-card">
            <BookOpen size={20} />
            <p>Free Resources</p>
          </div>

          <div className="why-card">
            <HeartHandshake size={20} />
            <p>Community Support</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats" style={statsStyle}>
        <div className="stat">
          <h3>10K+</h3>
          <p>Students</p>
        </div>

        <div className="stat">
          <h3>500+</h3>
          <p>Resources</p>
        </div>

        <div className="stat">
          <h3>200+</h3>
          <p>Kuppi Sessions</p>
        </div>

        <div className="stat">
          <h3>15+</h3>
          <p>Universities</p>
        </div>
      </section>

      {/* Contact / About Form */}
      <section className="about-contact">
        <div className="about-contact-inner">
          <div className="about-contact-info">
            <div className="about-contact-chip">
              <Globe size={14} />
              <span>Contact UniShare</span>
            </div>
            <h2 className="about-contact-title">Send us a message</h2>
            <p className="about-contact-sub">
              Have an idea, question, or partnership request? Drop a message and we’ll get back soon.
            </p>

            <div className="about-contact-points">
              <div className="about-contact-point">
                <CheckCircle2 size={16} />
                <span>We read every message</span>
              </div>
              <div className="about-contact-point">
                <CheckCircle2 size={16} />
                <span>Student-first improvements</span>
              </div>
              <div className="about-contact-point">
                <CheckCircle2 size={16} />
                <span>Safe & respectful community</span>
              </div>
            </div>
          </div>

          <div className="about-contact-card">
            <div className="about-contact-card-head">
              <div className="about-contact-card-title">About Form</div>
              <div className="about-contact-card-mini">
                {user ? `Signed in as ${user.fullName || user.name}` : "You can send as a guest"}
              </div>
            </div>

            {error && <div className="about-contact-alert error">{error}</div>}
            {sent && <div className="about-contact-alert success">Message sent successfully!</div>}

            <form className="about-contact-form" onSubmit={handleSubmit}>
              <div className="about-contact-row">
                <div className="about-contact-group">
                  <label className="about-contact-label">Name</label>
                  <input
                    className="about-contact-input"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Your name"
                  />
                </div>
                <div className="about-contact-group">
                  <label className="about-contact-label">Email</label>
                  <input
                    className="about-contact-input"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="about-contact-group">
                <label className="about-contact-label">Message</label>
                <textarea
                  className="about-contact-textarea"
                  name="message"
                  value={form.message}
                  onChange={handleFormChange}
                  placeholder="Write your message here…"
                  rows={5}
                />
              </div>

              <button className="about-contact-btn" type="submit" disabled={sending}>
                {sending ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}




export default About;