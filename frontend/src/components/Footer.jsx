import React from "react";
import { Twitter, Linkedin, Instagram, Facebook, ArrowUp, BookOpen } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

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
          background: linear-gradient(135deg, #40E0D0, #00B4D8);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #001F3F;
          flex-shrink: 0;
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
              <div className="logo-icon"><BookOpen size={18} /></div>
              <span>UniShare.lk</span>
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
          </div>
        </div>

        <div className="us-footer-divider"><hr /></div>

        <div className="us-footer-bottom">
          <p>© 2026 UniShare.lk · All Rights Reserved</p>
          <button className="us-back-top" onClick={scrollToTop}>
            <ArrowUp size={13} /> Back to Top
          </button>
        </div>
      </footer>
    </>
  );
}