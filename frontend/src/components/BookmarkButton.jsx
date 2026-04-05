import { useEffect, useState } from "react";
import axios from "axios";
import { Bookmark } from "lucide-react";

const BOOKMARK_API = "http://localhost:8000/api/bookmarks";

export default function BookmarkButton({
  sessionId,
  userId,
  initialBookmarked = false,
  onToggle,
}) {
  const [isBookmarked, setIsBookmarked] = useState(Boolean(initialBookmarked));
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setIsBookmarked(Boolean(initialBookmarked));
  }, [initialBookmarked]);

  const showNotice = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 2200);
  };

  const toggleBookmark = async () => {
    if (!userId || !sessionId || loading) return;

    try {
      setLoading(true);

      if (isBookmarked) {
        await axios.delete(`${BOOKMARK_API}/${sessionId}`, {
          headers: { "x-user-id": userId },
        });
        setIsBookmarked(false);
        showNotice("Removed from saved sessions");
        if (onToggle) onToggle(sessionId, false);
      } else {
        await axios.post(
          `${BOOKMARK_API}/${sessionId}`,
          {},
          { headers: { "x-user-id": userId } }
        );
        setIsBookmarked(true);
        showNotice("Session saved");
        if (onToggle) onToggle(sessionId, true);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Bookmark action failed";
      showNotice(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bookmark-wrap">
      <button
        type="button"
        className={`bookmark-btn ${isBookmarked ? "saved" : ""}`}
        onClick={toggleBookmark}
        disabled={loading || !userId}
      >
        <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
        {loading ? "Please wait" : isBookmarked ? "Saved" : "Save"}
      </button>
      {!!notice && <span className="bookmark-msg">{notice}</span>}
    </div>
  );
}
