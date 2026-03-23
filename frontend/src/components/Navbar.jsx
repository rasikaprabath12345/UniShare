import React from "react";
import { Bell, MessageCircle, User } from "lucide-react";

function Navbar() {
  return (
    <>
      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 60px;
          background: white;
          color: #1a1a2e;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }

        .logo {
          color: #1565C0;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .navbar ul {
          display: flex;
          list-style: none;
          gap: 35px;
        }

        .navbar li {
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #333;
          transition: color 0.2s;
        }

        .navbar li:hover {
          color: #1565C0;
        }

        .nav-icons {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f0f4ff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: #1565C0;
          transition: background 0.2s;
        }

        .nav-icon:hover {
          background: #dce8ff;
        }

        .btn-logout {
          padding: 8px 18px;
          background: transparent;
          border: 1.5px solid #1565C0;
          color: #1565C0;
          border-radius: 20px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-logout:hover {
          background: #1565C0;
          color: white;
        }
      `}</style>

      <nav className="navbar">
        <h2 className="logo">UniShare</h2>
        <ul>
          <li>Home</li>
          <li>Library</li>
          <li>Kuppi</li>
          <li>Quiz</li>
          <li>About</li>
          <li>Forum</li>
        </ul>
        <div className="nav-icons">
          <button className="nav-icon">
            <Bell size={18} color="#1a1a1a" strokeWidth={2} />
          </button>
          <button className="nav-icon">
            <MessageCircle size={18} color="#1a1a1a" strokeWidth={2} />
          </button>
          <button className="nav-icon">
            <User size={18} color="#1a1a1a" strokeWidth={2} />
          </button>
          <button className="btn-logout">Log out</button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;