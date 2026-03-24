// meetingRegistration.model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const meetingRegistrationSchema = new Schema(
  {
    meetingId: {
      type: Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

// Prevent the same email from registering twice for the same meeting
meetingRegistrationSchema.index({ meetingId: 1, email: 1 }, { unique: true });

const MeetingRegistration = mongoose.model("MeetingRegistration", meetingRegistrationSchema);

export default MeetingRegistration;