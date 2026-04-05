const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    // ─── USER REFERENCE ───────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usermanagement", // 👈 your user model name
      required: true,
    },

    // ─── MATERIAL INFO ────────────────────────
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },

    module: {
      type: String,
      required: [true, "Module is required"],
    },

    year: {
      type: String,
      required: [true, "Academic year is required"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 500,
    },

    tags: [{ type: String }],

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
    },

    fileSize: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);