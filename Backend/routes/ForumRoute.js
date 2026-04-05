const express = require("express");

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  addReaction,
  addComment,
  getComments,
  deleteComment
} = require("../controllers/ForumController");

const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.post("/:id/reaction", addReaction);
router.post("/:id/comment", addComment);
router.get("/:id/comments", getComments);
router.delete("/:id/comment/:commentId", deleteComment);

module.exports = router;