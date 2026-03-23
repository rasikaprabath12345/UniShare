import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Search, BookOpen, Users, Brain, MessageSquare,
  CheckCircle2, Upload, Video, Zap, Globe, HeartHandshake
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; }

        /* ── HERO ── */
        .hero {
          position: relative; height: 520px;
          display: flex; align-items: center; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background-image: url("../images/background.png");
          background-size: cover; background-position: center;
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(90deg,
            rgba(240,246,255,0.97) 0%, rgba(220,235,255,0.88) 0%,
            rgba(200,220,255,0.40) 30%, rgba(180,210,255,0.00) 70%);
        }
        .hero-content {
          position: relative; z-index: 2;
          padding: 0 60px; max-width: 560px;
        }
        .hero-content h1 {
          font-size: 3rem; font-weight: 800; color: #0d2257;
          line-height: 1.15; margin-bottom: 12px;
        }
        .hero-content p {
          font-size: 0.95rem; color: #555;
          line-height: 1.6; margin-bottom: 24px;
        }
        .hero-search {
          display: flex; align-items: center; background: white;
          border-radius: 30px; padding: 10px 18px;
          box-shadow: 0 4px 20px rgba(21,101,192,0.15); max-width: 420px;
        }
        .hero-search span { color: #888; margin-right: 10px; }
        .hero-search input {
          border: none; outline: none; flex: 1;
          background: transparent; font-family: 'Poppins', sans-serif;
        }
        .hero-search button {
          background: transparent; border: none; outline: none;
          cursor: pointer; display: flex; align-items: center; padding: 0;
        }
        .hero-search button:hover { transform: scale(1.1); }

        /* ── COURSES ── */
        .courses {
          padding: 60px 50px; background: #f4f7ff; text-align: center;
        }
        .courses h2 { font-size: 1.8rem; font-weight: 700; color: #0d2257; margin-bottom: 8px; }
        .courses > p { color: #666; margin-bottom: 48px; }

        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }
        .course-card {
          background: white; padding: 24px 20px; border-radius: 14px;
          box-shadow: 0 4px 18px rgba(21,101,192,0.08); text-align: left;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(21,101,192,0.15);
        }
        .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .card-icon {
          display: flex; align-items: center; justify-content: center;
          width: 48px; height: 48px; border-radius: 12px;
          background: #e8f0fe; color: #1565C0; flex-shrink: 0;
        }
        .card-header h3 { font-size: 1rem; font-weight: 700; color: #0d2257; margin: 0; }
        .course-card p { font-size: 0.85rem; color: #666; }
        .course-card button {
          margin-top: 16px; padding: 8px 18px; background: #1565C0;
          color: white; border: none; border-radius: 20px;
          font-family: 'Poppins', sans-serif; font-size: 0.85rem;
          cursor: pointer; transition: background 0.2s;
        }
        .course-card button:hover { background: #0d47a1; }

        /* ── FEATURE HIGHLIGHT ── */
        .feature-highlight {
          padding: 70px 50px;
          background: white;
        }
        .feature-highlight .section-label {
          display: inline-block;
          background: #e8f0fe;
          color: #1565C0;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 16px;
        }
        .feature-highlight h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #0d2257;
          margin-bottom: 12px;
          line-height: 1.2;
        }
        .feature-highlight .section-sub {
          color: #666;
          font-size: 0.92rem;
          max-width: 520px;
          line-height: 1.7;
          margin-bottom: 50px;
        }

        .highlight-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }

        @media (max-width: 768px) {
          .highlight-grid { grid-template-columns: 1fr; }
        }

        .highlight-card {
          border: 1.5px solid #e8f0fe;
          border-radius: 18px;
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
          background: #fff;
        }
        .highlight-card:hover {
          box-shadow: 0 10px 32px rgba(21,101,192,0.12);
          transform: translateY(-3px);
        }
        .highlight-card.featured {
          background: linear-gradient(135deg, #1565C0 0%, #1e88e5 100%);
          border-color: transparent;
          color: white;
        }
        .highlight-card .hc-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #e8f0fe;
          color: #1565C0;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 18px;
        }
        .highlight-card.featured .hc-badge {
          background: rgba(255,255,255,0.2);
          color: white;
        }
        .highlight-card h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0d2257;
          margin-bottom: 10px;
        }
        .highlight-card.featured h3 { color: white; }
        .highlight-card p {
          font-size: 0.88rem;
          color: #555;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .highlight-card.featured p { color: rgba(255,255,255,0.85); }

        .hc-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 4px;
        }
        .hc-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .hc-step-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #e8f0fe;
          color: #1565C0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .highlight-card.featured .hc-step-icon {
          background: rgba(255,255,255,0.2);
          color: white;
        }
        .hc-step-text strong {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #0d2257;
          margin-bottom: 2px;
        }
        .highlight-card.featured .hc-step-text strong { color: white; }
        .hc-step-text span {
          font-size: 0.8rem;
          color: #777;
        }
        .highlight-card.featured .hc-step-text span { color: rgba(255,255,255,0.75); }

        /* ── WHY CHOOSE US ── */
        .why-section {
          padding: 70px 50px;
          background: #f4f7ff;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .why-section { grid-template-columns: 1fr; gap: 40px; }
        }

        .why-left .tag {
          display: inline-block;
          background: #e8f0fe;
          color: #1565C0;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 16px;
        }
        .why-left h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #0d2257;
          line-height: 1.25;
          margin-bottom: 14px;
        }
        .why-left p {
          color: #666;
          font-size: 0.92rem;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .why-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .why-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: white;
          border-radius: 14px;
          padding: 16px 18px;
          box-shadow: 0 2px 12px rgba(21,101,192,0.07);
          transition: transform 0.2s;
        }
        .why-item:hover { transform: translateX(4px); }
        .why-item-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #e8f0fe;
          color: #1565C0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .why-item-text strong {
          display: block;
          font-size: 0.9rem;
          font-weight: 700;
          color: #0d2257;
          margin-bottom: 3px;
        }
        .why-item-text span {
          font-size: 0.82rem;
          color: #777;
          line-height: 1.5;
        }

        .why-right {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 28px 20px;
          text-align: center;
          box-shadow: 0 4px 18px rgba(21,101,192,0.08);
        }
        .stat-card.accent {
          background: linear-gradient(135deg, #1565C0, #1e88e5);
          color: white;
        }
        .stat-card .stat-num {
          font-size: 2rem;
          font-weight: 800;
          color: #0d2257;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-card.accent .stat-num { color: white; }
        .stat-card .stat-label {
          font-size: 0.8rem;
          color: #888;
          font-weight: 600;
        }
        .stat-card.accent .stat-label { color: rgba(255,255,255,0.8); }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Upgrade Your Skills Today</h1>
          <p>The Student learning platform that pairs verified resources with campus community chats.</p>
          <div className="hero-search">
            <span>☰</span>
            <input type="text" placeholder="Which uni are you at?" />
            <button><Search size={18} color="#666" strokeWidth={2} /></button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="courses">
        <h2>Explore Our Features</h2>
        <p>Explore powerful tools designed to enhance your learning experience</p>

        <div className="course-grid">
          <div className="course-card">
            <div className="card-header">
              <div className="card-icon"><BookOpen size={24} /></div>
              <h3>Library</h3>
            </div>
            <p>Access study materials, notes & resources</p>
            <button onClick={() => navigate("/library")}>View Now</button>
          </div>
          <div className="course-card">
            <div className="card-header">
              <div className="card-icon"><Users size={24} /></div>
              <h3>KUPPI</h3>
            </div>
            <p>Join peer learning sessions & discussions</p>
            <button onClick={() => navigate("/kuppi")}>View Now</button>
          </div>
          <div className="course-card">
            <div className="card-header">
              <div className="card-icon"><Brain size={24} /></div>
              <h3>Quiz</h3>
            </div>
            <p>Test your knowledge with interactive quizzes</p>
            <button onClick={() => navigate("/quizzes")}>View Now</button>
          </div>
          <div className="course-card">
            <div className="card-header">
              <div className="card-icon"><MessageSquare size={24} /></div>
              <h3>Forum</h3>
            </div>
            <p>Ask questions & connect with learners</p>
            <button onClick={() => navigate("/forum")}>View Now</button>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHT — Quizzes & Kuppi */}
      <section className="feature-highlight">
        <span className="section-label">How It Works</span>
        <h2>Smart Tools Built for<br />Sri Lankan Students</h2>
        <p className="section-sub">
          Two flagship features that transform the way you study — powered by AI and peer collaboration.
        </p>

        <div className="highlight-grid">

          {/* Quizzes Card */}
          <div className="highlight-card featured">
            <div className="hc-badge">
              <Brain size={14} /> AI-Powered Quizzes
            </div>
            <h3>Turn Any Slide into a Quiz</h3>
            <p>
              Upload your lecturer's slides and our AI instantly generates smart, exam-ready quizzes tailored to your content.
            </p>
            <div className="hc-steps">
              <div className="hc-step">
                <div className="hc-step-icon"><Upload size={16} /></div>
                <div className="hc-step-text">
                  <strong>Upload Slides</strong>
                  <span>PDF or PPT from your lecturer</span>
                </div>
              </div>
              <div className="hc-step">
                <div className="hc-step-icon"><Zap size={16} /></div>
                <div className="hc-step-text">
                  <strong>AI Generates Questions</strong>
                  <span>MCQs, True/False & short answers</span>
                </div>
              </div>
              <div className="hc-step">
                <div className="hc-step-icon"><Brain size={16} /></div>
                <div className="hc-step-text">
                  <strong>Practice & Track Progress</strong>
                  <span>Score tracking with instant feedback</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kuppi Card */}
          <div className="highlight-card">
            <div className="hc-badge">
              <Video size={14} /> Live Online Sessions
            </div>
            <h3>KUPPI — Peer Learning, Reimagined</h3>
            <p>
              Join or host live virtual study sessions with batchmates. Real-time collaboration, screen sharing & group chats — all in one place.
            </p>
            <div className="hc-steps">
              <div className="hc-step">
                <div className="hc-step-icon"><Globe size={16} /></div>
                <div className="hc-step-text">
                  <strong>Find Sessions by Subject</strong>
                  <span>Browse upcoming kuppis near you</span>
                </div>
              </div>
              <div className="hc-step">
                <div className="hc-step-icon"><Video size={16} /></div>
                <div className="hc-step-text">
                  <strong>Join Live Video Rooms</strong>
                  <span>Screen share, whiteboard & chat</span>
                </div>
              </div>
              <div className="hc-step">
                <div className="hc-step-icon"><Users size={16} /></div>
                <div className="hc-step-text">
                  <strong>Host Your Own Kuppi</strong>
                  <span>Invite your batch & teach together</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-section">
        <div className="why-left">
          <span className="tag">Why Choose Us</span>
          <h2>Everything a Sri Lankan Student Needs</h2>
          <p>
            UniShare.lk is built by students, for students. We understand the local university experience — and we've built the tools to match it.
          </p>
          <div className="why-list">
            <div className="why-item">
              <div className="why-item-icon"><CheckCircle2 size={20} /></div>
              <div className="why-item-text">
                <strong>Easy-to-use Platform</strong>
                <span>Clean interface, zero learning curve — get started in minutes.</span>
              </div>
            </div>
            <div className="why-item">
              <div className="why-item-icon"><Zap size={20} /></div>
              <div className="why-item-text">
                <strong>Interactive Learning Experience</strong>
                <span>AI quizzes, live kuppis & gamified progress tracking.</span>
              </div>
            </div>
            <div className="why-item">
              <div className="why-item-icon"><BookOpen size={20} /></div>
              <div className="why-item-text">
                <strong>Free & Accessible Resources</strong>
                <span>Notes, past papers & slides — all free, all verified.</span>
              </div>
            </div>
            <div className="why-item">
              <div className="why-item-icon"><HeartHandshake size={20} /></div>
              <div className="why-item-text">
                <strong>Community Support</strong>
                <span>A growing network of students helping each other succeed.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="why-right">
          <div className="stat-card accent">
            <div className="stat-num">10K+</div>
            <div className="stat-label">Active Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">500+</div>
            <div className="stat-label">Study Resources</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">200+</div>
            <div className="stat-label">Kuppi Sessions</div>
          </div>
          <div className="stat-card accent">
            <div className="stat-num">15+</div>
            <div className="stat-label">Universities</div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
