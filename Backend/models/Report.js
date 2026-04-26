const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  contentTitle: {
    type: String,
    required: true
  },

  contentType: {
    type: String,
    enum: ["File", "Comment", "Forum", "Quiz"],
    required: true
  },

  reason: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  reportedBy: {
    type: String,
    required: true
  },

  reportedByName: {
    type: String,
    required: true
  },

  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  contentOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  contentOwnerName: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "reviewed", "rejected"],
    default: "pending"
  },

  date: {
    type: Date,
    default: Date.now
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Report", ReportSchema);
