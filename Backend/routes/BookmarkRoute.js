const express = require("express");
const {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
} = require("../controllers/BookmarkController");
const bookmarkAuth = require("../middleware/bookmarkAuth");

const router = express.Router();

router.post("/:sessionId", bookmarkAuth, addBookmark);
router.delete("/:sessionId", bookmarkAuth, removeBookmark);
router.get("/", bookmarkAuth, getUserBookmarks);

module.exports = router;
