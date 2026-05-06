import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, MessageCircle, ChevronDown, LogOut, User, Settings, Shield } from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

/* ─── Role badge colours ─────────────────────────────────────── */
const ROLE_META = {
  student: { label: "Student",  color: "#1565C0", bg: "#e8f0fe" },
  tutor:   { label: "Tutor",    color: "#2e7d32", bg: "#e8f5e9" },
  admin:   { label: "Admin",    color: "#b71c1c", bg: "#fce8ef" },
};

/* ─── Nav links (only visible when logged in) ────────────────── */
const NAV_LINKS = [
  { label: "Home",     path: "/" },
  { label: "Library",  path: "/library" },
  { label: "Kuppi",    path: "/Kuppi" },
  { label: "Quiz",     path: "/quizzes" },
  { label: "Forum",    path: "/forum" },
  { label: "About",    path: "/about" },
];

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function Navbar() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const dropRef    = useRef(null);
  const notifRef   = useRef(null);

  const [dropOpen, setDropOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  /* ── Read user from localStorage ── */
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  const isLoggedIn = !!user;
  const userId = user?._id || user?.id;
  const role       = user?.role ?? "student";
  const roleMeta   = ROLE_META[role] ?? ROLE_META.student;
  const displayName = user?.fullName ?? user?.name ?? "User";
  const initials   = getInitials(displayName);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Fetch notifications on component mount ── */
  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, userId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setDropOpen(false);
    navigate("/login");
  };

  const fetchNotifications = async () => {
    try {
      if (!userId) return;
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/notifications`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleNotificationRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        .us-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 60px;
          height: 66px;
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 200;
          box-shadow: 0 1px 0 rgba(21,101,192,0.08), 0 4px 16px rgba(0,0,0,0.04);
          font-family: 'Poppins', sans-serif;
        }

        /* ── Logo ── */
        .us-nav__logo {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1565C0;
          text-decoration: none;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 0px;
          flex-shrink: 0;
        }
        .us-nav__logo-icon {
          width: 50px; height: 50px;
          border-radius: 8px;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .us-nav__logo-icon img {
          width: 90%;
          height: 90%;
          object-fit: contain;
        }

        /* ── Nav links (authenticated) ── */
        .us-nav__links {
          display: flex;
          list-style: none;
          gap: 4px;
          margin: 0; padding: 0;
        }
        .us-nav__links a {
          display: block;
          padding: 6px 14px;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: #5a6a8a;
          border-radius: 8px;
          transition: color 0.18s, background 0.18s;
        }
        .us-nav__links a:hover { color: #1565C0; background: #f0f4ff; }
        .us-nav__links a.active { color: #1565C0; background: #e8f0fe; }

        /* ── Guest: empty middle ── */
        .us-nav__guest-center {
          font-size: 0.82rem;
          color: #9eadc8;
          font-weight: 500;
          font-style: italic;
        }

        /* ── Right section ── */
        .us-nav__right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        /* ── Icon button ── */
        .us-nav__icon-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #f0f4ff;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #1565C0;
          transition: background 0.18s, transform 0.14s;
          position: relative;
        }
        .us-nav__icon-btn:hover { background: #dce8ff; transform: scale(1.06); }

        /* ── Login button ── */
        .us-nav__login-btn {
          padding: 8px 22px;
          background: linear-gradient(135deg, #0d2257, #1565C0);
          color: white;
          border: none;
          border-radius: 22px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.03em;
          box-shadow: 0 3px 12px rgba(21,101,192,0.28);
          transition: transform 0.16s, box-shadow 0.16s, opacity 0.16s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .us-nav__login-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 18px rgba(21,101,192,0.38);
        }

        /* ── User dropdown ── */
        .us-nav__user-wrap { position: relative; }
        .us-nav__user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px 5px 5px;
          background: #f0f4ff;
          border: 1.5px solid #dce8ff;
          border-radius: 30px;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s, box-shadow 0.18s;
          font-family: 'Poppins', sans-serif;
        }
        .us-nav__user-btn:hover {
          background: #e4ecff;
          border-color: #1565C0;
          box-shadow: 0 2px 10px rgba(21,101,192,0.12);
        }
        .us-nav__user-btn.open {
          background: #e4ecff;
          border-color: #1565C0;
          box-shadow: 0 0 0 3px rgba(21,101,192,0.12);
        }

        /* Avatar circle */
        .us-nav__avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0d2257, #1565C0);
          color: white;
          font-size: 0.68rem;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }

        .us-nav__user-info { display: flex; flex-direction: column; align-items: flex-start; }
        .us-nav__user-name {
          font-size: 0.78rem;
          font-weight: 700;
          color: #0d2257;
          line-height: 1;
          max-width: 110px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .us-nav__user-role {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 1px 7px;
          border-radius: 10px;
          margin-top: 3px;
          line-height: 1.4;
        }
        .us-nav__chevron {
          color: #9eadc8;
          transition: transform 0.22s;
          flex-shrink: 0;
        }
        .us-nav__chevron.open { transform: rotate(180deg); color: #1565C0; }

        /* Dropdown panel */
        .us-nav__dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: white;
          border: 1px solid #dde8f8;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(13,34,87,0.14), 0 2px 8px rgba(0,0,0,0.06);
          min-width: 220px;
          overflow: hidden;
          animation: navDropIn 0.18s cubic-bezier(0.34,1.4,0.64,1);
          z-index: 300;
        }
        @keyframes navDropIn {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)    scale(1); }
        }

        /* Dropdown header */
        .us-nav__drop-header {
          padding: 16px 18px 12px;
          border-bottom: 1px solid #f0f4ff;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .us-nav__drop-avatar {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0d2257, #1565C0);
          color: white;
          font-size: 0.95rem;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .us-nav__drop-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0d2257;
          margin-bottom: 3px;
        }
        .us-nav__drop-email {
          font-size: 0.72rem;
          color: #9eadc8;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 140px;
        }

        /* Dropdown items */
        .us-nav__drop-items { padding: 6px 0; }
        .us-nav__drop-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          font-size: 0.83rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          font-family: 'Poppins', sans-serif;
          text-decoration: none;
          transition: background 0.14s, color 0.14s;
        }
        .us-nav__drop-item:hover { background: #f0f4ff; color: #1565C0; }
        .us-nav__drop-item svg  { flex-shrink: 0; }
        .us-nav__drop-divider { height: 1px; background: #f0f4ff; margin: 4px 0; }
        .us-nav__drop-item--danger { color: #b91c1c; }
        .us-nav__drop-item--danger:hover { background: #fef2f2; color: #b91c1c; }

        /* Admin badge in dropdown */
        .us-nav__drop-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
          margin-top: 4px;
        }

        /* ── Guest info banner ── */
        .us-nav__guest-banner {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .us-nav__guest-text {
          font-size: 0.8rem;
          color: #9eadc8;
          font-weight: 500;
        }

        /* Notification dot */
        .us-nav__notif-dot {
          position: absolute;
          top: 6px; right: 6px;
          width: 8px; height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
        }

        /* ── Notification Wrapper ── */
        .us-nav__notif-wrap {
          position: relative;
        }

        /* ── Notification Dropdown ── */
        .us-nav__notif-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: white;
          border: 1px solid #dde8f8;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(13,34,87,0.14), 0 2px 8px rgba(0,0,0,0.06);
          width: 380px;
          max-height: 500px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: navDropIn 0.18s cubic-bezier(0.34,1.4,0.64,1);
          z-index: 300;
        }

        .us-nav__notif-header {
          padding: 14px 18px;
          border-bottom: 1px solid #f0f4ff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        .us-nav__notif-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #0d2257;
        }
        .us-nav__notif-mark-all {
          font-size: 0.72rem;
          color: #1565C0;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          font-weight: 600;
        }
        .us-nav__notif-mark-all:hover {
          color: #0d2257;
        }

        .us-nav__notif-list {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }

        .us-nav__notif-item {
          display: flex;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid #f8faff;
          cursor: pointer;
          transition: background 0.18s;
          background: #fafbff;
          position: relative;
        }
        .us-nav__notif-item.unread {
          background: #f0f4ff;
        }
        .us-nav__notif-item:hover {
          background: #e8f0fe;
        }

        .us-nav__notif-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
          width: 32px;
          text-align: center;
        }

        .us-nav__notif-content {
          flex: 1;
          min-width: 0;
        }
        .us-nav__notif-msg {
          font-size: 0.75rem;
          font-weight: 600;
          color: #0d2257;
          line-height: 1.4;
          margin-bottom: 4px;
          word-break: break-word;
        }
        .us-nav__notif-meta {
          font-size: 0.68rem;
          color: #6b7280;
          margin-bottom: 2px;
        }
        .us-nav__notif-time {
          font-size: 0.65rem;
          color: #9eadc8;
        }

        .us-nav__notif-unread-dot {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          background: #1565C0;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .us-nav__notif-empty {
          padding: 40px 20px;
          text-align: center;
          color: #9eadc8;
          font-size: 0.76rem;
        }

        @media (max-width: 900px) {
          .us-nav__notif-dropdown {
            width: 320px;
          }
        }

        @media (max-width: 900px) {
          .us-nav { padding: 0 20px; }
          .us-nav__links { display: none; }
          .us-nav__guest-center { display: none; }
        }
      `}</style>

      <nav className="us-nav">
        {/* ── Logo ── */}
        <Link to={isLoggedIn ? "/" : "/login"} className="us-nav__logo">
          <div className="us-nav__logo-icon">
            <img src="./images/Logo.png" alt="" />
          </div>
          UniShare
        </Link>

        {/* ── Middle: Nav links (logged in) OR guest message (guest) ── */}
        {isLoggedIn ? (
          <ul className="us-nav__links">
            {NAV_LINKS.map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={location.pathname === path ? "active" : ""}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <span className="us-nav__guest-center">
            Sign in to access all features
          </span>
        )}

        {/* ── Right ── */}
        <div className="us-nav__right">
          {isLoggedIn ? (
            <>
              {/* Notification bell */}
              <div className="us-nav__notif-wrap" ref={notifRef}>
                <button 
                  className="us-nav__icon-btn" 
                  aria-label="Notifications"
                  onClick={() => setNotifOpen(p => !p)}
                >
                  {unreadCount > 0 && <div className="us-nav__notif-dot" />}
                  <Bell size={17} strokeWidth={2} />
                </button>

                {notifOpen && (
                  <div className="us-nav__notif-dropdown">
                    <div className="us-nav__notif-header">
                      <div className="us-nav__notif-title">Notifications {unreadCount > 0 && `(${unreadCount})`}</div>
                      {unreadCount > 0 && (
                        <button 
                          className="us-nav__notif-mark-all"
                          onClick={handleMarkAllRead}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="us-nav__notif-list">
                      {notifications.length === 0 ? (
                        <div className="us-nav__notif-empty">No notifications</div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif._id}
                            className={`us-nav__notif-item${notif.isRead ? ' read' : ' unread'}`}
                            onClick={() => !notif.isRead && handleNotificationRead(notif._id)}
                          >
                            <div className="us-nav__notif-icon">
                              {notif.type === 'warning' && '⚠️'}
                              {notif.type === 'report' && '🚩'}
                              {notif.type === 'message' && '💬'}
                            </div>
                            <div className="us-nav__notif-content">
                              <div className="us-nav__notif-msg">{notif.message}</div>
                              {notif.data?.sentByName && (
                                <div className="us-nav__notif-meta">From: {notif.data.sentByName}</div>
                              )}
                              <div className="us-nav__notif-time">
                                {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            {!notif.isRead && <div className="us-nav__notif-unread-dot" />}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <button className="us-nav__icon-btn" aria-label="Messages">
                <MessageCircle size={17} strokeWidth={2} />
              </button>

              {/* User dropdown */}
              <div className="us-nav__user-wrap" ref={dropRef}>
                <button
                  className={`us-nav__user-btn${dropOpen ? " open" : ""}`}
                  onClick={() => setDropOpen(p => !p)}
                  aria-expanded={dropOpen}
                >
                  <div className="us-nav__avatar">{initials}</div>
                  <div className="us-nav__user-info">
                    <span className="us-nav__user-name">{displayName}</span>
                    <span
                      className="us-nav__user-role"
                      style={{ background: roleMeta.bg, color: roleMeta.color }}
                    >
                      {roleMeta.label}
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`us-nav__chevron${dropOpen ? " open" : ""}`}
                    strokeWidth={2.5}
                  />
                </button>

                {dropOpen && (
                  <div className="us-nav__dropdown">
                    {/* Header */}
                    <div className="us-nav__drop-header">
                      <div className="us-nav__drop-avatar">{initials}</div>
                      <div style={{ minWidth: 0 }}>
                        <div className="us-nav__drop-name">{displayName}</div>
                        <div className="us-nav__drop-email">{user?.email}</div>
                        <div
                          className="us-nav__drop-role-badge"
                          style={{ background: roleMeta.bg, color: roleMeta.color }}
                        >
                          {role === "admin" && <Shield size={10} />}
                          {roleMeta.label}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="us-nav__drop-items">
                      <Link
                        to="/profile"
                        className="us-nav__drop-item"
                        onClick={() => setDropOpen(false)}
                      >
                        <User size={15} /> My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="us-nav__drop-item"
                        onClick={() => setDropOpen(false)}
                      >
                        <Settings size={15} /> Settings
                      </Link>
                      {role === "admin" && (
                        <Link
                          to="/admin"
                          className="us-nav__drop-item"
                          onClick={() => setDropOpen(false)}
                        >
                          <Shield size={15} /> Admin Panel
                        </Link>
                      )}
                      <div className="us-nav__drop-divider" />
                      <button
                        className="us-nav__drop-item us-nav__drop-item--danger"
                        onClick={handleLogout}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Guest: just the Login button */
            <Link to="/login" className="us-nav__login-btn">
              Sign In →
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;