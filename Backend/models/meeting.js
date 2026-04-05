const mongoose = require("mongoose");

const { Schema } = mongoose;

const meetingSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    meetingLink: { type: String, required: true },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerName: { type: String, trim: true, default: "Unknown Host" },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["scheduled", "live", "ended", "cancelled"],
      default: "scheduled",
    },
    year: { type: Number, required: true },
    semester: { type: Number, required: true },
    module: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;