const Meeting = require("../models/meeting");
const MeetingRegistration = require("../models/meetingRegistration");

const createMeeting = async (req, res) => {
  try {
    const {
      title,
      description,
      meetingLink,
      ownerId,
      ownerName,
      scheduledAt,
      status,
      year,
      semester,
      module,
    } = req.body;

    if (!title || !meetingLink || !scheduledAt || !year || !semester || !module) {
      return res.status(400).json({
        success: false,
        message: "title, meetingLink, scheduledAt, year, semester and module are required",
      });
    }

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: "ownerId is required to create a meeting",
      });
    }

    const meeting = await Meeting.create({
      title,
      description,
      meetingLink,
      ownerId,
      ownerName,
      scheduledAt,
      status: status || "scheduled",
      year: Number(year),
      semester: Number(semester),
      module,
    });

    return res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data: meeting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ scheduledAt: 1 });

    return res.status(200).json({
      success: true,
      data: meetings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      data: meeting,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    await MeetingRegistration.deleteMany({ meetingId: req.params.id });

    return res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const registerForMeeting = async (req, res) => {
  try {
    const { meetingId, userId, fullName, email, description } = req.body;

    if (!meetingId || !fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "meetingId, fullName and email are required",
      });
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    const registration = await MeetingRegistration.create({
      meetingId,
      userId: userId || null,
      fullName,
      email,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: {
        registration,
        meetingLink: meeting.meetingLink,
      },
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered for this meeting",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMeetingRegistrations = async (req, res) => {
  try {
    const { id } = req.params;

    const registrations = await MeetingRegistration.find({ meetingId: id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;
    const email = req.query.email ? String(req.query.email).toLowerCase().trim() : "";

    if (!userId && !email) {
      return res.status(400).json({
        success: false,
        message: "userId or email is required",
      });
    }

    const filter = {};
    if (userId) filter.userId = userId;
    if (email) filter.email = email;

    const registrations = await MeetingRegistration.find(filter).select("meetingId userId email");

    return res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  registerForMeeting,
  getMeetingRegistrations,
  getUserRegistrations,
};
