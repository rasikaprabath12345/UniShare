const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  authorYear: String,
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const reactionSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  type: { type: String, enum: ['like', 'helpful', 'insightful', 'thanks'], default: 'like' }
});

const forumSchema = new mongoose.Schema({
  title: String,
  body: String,
  category: String,
  tags: [String],
  authorName: String,
  authorYear: String,
  likes: { type: Number, default: 0 },
  replies: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  reactions: [reactionSchema],
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model("Forum", forumSchema);