const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookmarkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Usermanagement",
      required: [true, "userId is required"],
      index: true,
    },
    // In this project, Kuppi sessions are stored in the Meeting model.
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Meeting",
      required: [true, "sessionId is required"],
      index: true,
    },
  },
  { timestamps: true }
);

bookmarkSchema.index({ userId: 1, sessionId: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
