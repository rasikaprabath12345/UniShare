const mongoose = require("mongoose");

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
  pinned: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Forum", forumSchema);