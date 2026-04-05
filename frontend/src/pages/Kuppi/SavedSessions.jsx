import { useEffect, useState } from "react";
import axios from "axios";
import { Link2, Calendar, Clock, BookmarkX } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const BOOKMARK_API = "http://localhost:8000/api/bookmarks";

function getLoggedUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function formatDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function SavedSessions() {
  const user = getLoggedUser();
  const userId = user?._id || user?.id || "";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [removing, setRemoving] = useState("");

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!userId) {
        setError("Please login to view saved sessions");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await axios.get(BOOKMARK_API, {
          headers: { "x-user-id": userId },
        });
        setItems(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch (err) {
        setItems([]);
        setError(err.response?.data?.message || "Failed to load saved sessions");
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [userId]);

  const removeBookmark = async (sessionId) => {
    try {
      setRemoving(sessionId);
      await axios.delete(`${BOOKMARK_API}/${sessionId}`, {
        headers: { "x-user-id": userId },
      });
      setItems((prev) => prev.filter((item) => String(item.sessionId) !== String(sessionId)));
      setNotice("Bookmark removed");
      setTimeout(() => setNotice(""), 2500);
    } catch (err) {
      setNotice(err.response?.data?.message || "Failed to remove bookmark");
      setTimeout(() => setNotice(""), 3000);
    } finally {
      setRemoving("");
    }
  };

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; }

        .ss-wrap { max-width: 980px; margin: 0 auto; padding: 34px 18px 60px; }
        .ss-title { font-size: 1.35rem; font-weight: 800; color: #0d2257; margin-bottom: 8px; }
        .ss-sub { color: #667085; font-size: 0.88rem; margin-bottom: 22px; }
        .ss-notice {
          margin-bottom: 14px; padding: 10px 13px; border-radius: 10px;
          background: #e8f0fe; border: 1px solid #c5d8f8; color: #0d47a1;
          font-size: 0.82rem; font-weight: 600;
        }
        .ss-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 14px;
        }
        .ss-card {
          background: #fff; border: 1px solid #e8f0fe; border-radius: 14px;
          box-shadow: 0 4px 16px rgba(21,101,192,0.08);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ss-module {
          display: inline-flex;
          width: fit-content;
          font-size: 0.68rem;
          font-weight: 700;
          color: #1565C0;
          background: #e8f0fe;
          border-radius: 999px;
          padding: 4px 10px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .ss-heading { color: #0d2257; font-size: 0.9rem; font-weight: 700; line-height: 1.35; }
        .ss-meta {
          display: grid;
          gap: 6px;
          font-size: 0.75rem;
          color: #4f5d7a;
          font-weight: 600;
        }
        .ss-meta span { display: inline-flex; align-items: center; gap: 6px; }
        .ss-link {
          font-size: 0.76rem;
          color: #1565C0;
          text-decoration: none;
          word-break: break-all;
        }
        .ss-link:hover { text-decoration: underline; }
        .ss-remove {
          margin-top: auto;
          padding: 9px;
          border: 1.5px solid #f5c0cf;
          background: #fce8ef;
          color: #993556;
          border-radius: 9px;
          font-size: 0.78rem;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: all 0.18s;
        }
        .ss-remove:hover { background: #993556; color: #fff; border-color: #993556; }
        .ss-remove:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>

      <Navbar />

      <div className="ss-wrap">
        <h2 className="ss-title">Saved Sessions</h2>
        <p className="ss-sub">Your bookmarked Kuppi sessions are listed below.</p>

        {!!notice && <div className="ss-notice">{notice}</div>}

        {loading && <p>Loading saved sessions...</p>}
        {!loading && !!error && <p>{error}</p>}
        {!loading && !error && items.length === 0 && <p>No saved sessions found.</p>}

        <div className="ss-grid">
          {items.map((item) => (
            <div key={item.bookmarkId || item.sessionId} className="ss-card">
              <span className="ss-module">{item.moduleName || "Module"}</span>
              <h3 className="ss-heading">{item.title || "Untitled Session"}</h3>

              <div className="ss-meta">
                <span><Calendar size={13} /> {formatDate(item.scheduledAt || item.date)}</span>
                <span><Clock size={13} /> {formatTime(item.scheduledAt || item.time)}</span>
                <span>
                  <Link2 size={13} />
                  <a className="ss-link" href={item.link} target="_blank" rel="noreferrer">
                    Join Session
                  </a>
                </span>
              </div>

              <button
                type="button"
                className="ss-remove"
                disabled={removing === String(item.sessionId)}
                onClick={() => removeBookmark(String(item.sessionId))}
              >
                <BookmarkX size={14} />
                {removing === String(item.sessionId) ? "Removing..." : "Remove Bookmark"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
