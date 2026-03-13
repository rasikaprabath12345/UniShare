import React from "react";
import "./Resource_Dashboard.css";

function Resource_Dashboard() {
  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile">
          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="profile-img"
          />
          <h3>Alex Johnson</h3>
          <p>alex.johnson@university.edu</p>
          <button className="premium-btn">Premium</button>
        </div>

        <ul className="menu">
          <li className="active">All Materials</li>
          <li>Downloaded</li>
          <li>My Comments</li>
          <li>My Tutors</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main">

        <div className="header">
          <h1>Knowledge Hub</h1>
          <input
            type="text"
            placeholder="Search materials, subjects, tutors..."
          />
        </div>

        <h2 className="section-title">Latest Uploads</h2>

        <div className="card-container">

          <div className="card blue">
            <h3>Introduction to Data Structures</h3>
            <p>Comprehensive guide covering arrays, stacks and lists.</p>
            <div className="card-footer">
              <span>⭐ 4.8</span>
              <span>456 Downloads</span>
            </div>
          </div>

          <div className="card purple">
            <h3>Calculus I - Derivatives</h3>
            <p>Step-by-step tutorial on understanding derivatives.</p>
            <div className="card-footer">
              <span>⭐ 4.9</span>
              <span>678 Downloads</span>
            </div>
          </div>

          <div className="card green">
            <h3>Python Programming Basics</h3>
            <p>Learn Python from scratch with examples.</p>
            <div className="card-footer">
              <span>⭐ 4.9</span>
              <span>892 Downloads</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Resource_Dashboard;