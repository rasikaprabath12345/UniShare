const express = require("express");

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} = require("../controllers/ForumController");

const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;