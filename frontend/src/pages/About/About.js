import React from "react";
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
  return (
    <div className="about-page">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero">
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
      <section className="about-features">
        <h2>Our Features</h2>

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
      <section className="about-stats">
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

      <Footer />
    </div>
  );
}

export default About;