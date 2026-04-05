const mongoose = require("mongoose");
const Bookmark = require("../models/Bookmark");
const Meeting = require("../models/meeting");

const addBookmark = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sessionId",
      });
    }

    const session = await Meeting.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const existing = await Bookmark.findOne({ userId, sessionId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Session is already saved",
      });
    }

    await Bookmark.create({ userId, sessionId });

    return res.status(201).json({
      success: true,
      message: "Session saved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save bookmark",
    });
  }
};

const removeBookmark = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sessionId",
      });
    }

    const deleted = await Bookmark.findOneAndDelete({ userId, sessionId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to remove bookmark",
    });
  }
};

const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.userId;

    const bookmarks = await Bookmark.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "sessionId",
        select: "title module scheduledAt meetingLink",
      });

    const items = bookmarks
      .filter((bookmark) => bookmark.sessionId)
      .map((bookmark) => {
        const session = bookmark.sessionId;
        const when = new Date(session.scheduledAt);

        return {
          bookmarkId: bookmark._id,
          sessionId: session._id,
          moduleName: session.module,
          date: Number.isNaN(when.getTime())
            ? null
            : when.toISOString().slice(0, 10),
          time: Number.isNaN(when.getTime())
            ? null
            : when.toISOString().slice(11, 16),
          link: session.meetingLink,
          title: session.title,
          scheduledAt: session.scheduledAt,
        };
      });

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load bookmarks",
    });
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
};
