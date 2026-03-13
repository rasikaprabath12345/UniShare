import React from "react";
import "./Home.css";

function Home() {
  return (
    <div>

      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">UniShare.lk</h2>
        <ul>
          <li>Home</li>
          <li>Courses</li>
          <li>Events</li>
          <li>About</li>
        </ul>
        <div>
          <button className="btn-outline">Login</button>
          <button className="btn-primary">Register</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Upgrade Your Skills Today</h1>
          <p>Special Discounts | Free Seminars</p>
          <input type="text" placeholder="Search courses..." />
        </div>
      </section>

      {/* Course Section */}
      <section className="courses">
        <h2>Latest Courses</h2>

        <div className="course-grid">
          <div className="course-card">
            <h3>Financial Planning</h3>
            <p>Learn investment & finance basics</p>
            <button>View Now</button>
          </div>

          <div className="course-card">
            <h3>Stock Market Starter</h3>
            <p>Master stock trading fundamentals</p>
            <button>View Now</button>
          </div>

          <div className="course-card">
            <h3>AI Journey</h3>
            <p>Introduction to Artificial Intelligence</p>
            <button>View Now</button>
          </div>

          <div className="course-card">
            <h3>Python Programming</h3>
            <p>Beginner to advanced coding</p>
            <button>View Now</button>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="banner">
        <div>
          <h2>Data Science for Beginners</h2>
          <button>Explore Now</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <h3>eLearning.lk</h3>
        <p>© 2026 All Rights Reserved</p>
      </footer>

    </div>
  );
}

export default Home;