const Meeting = require("../models/meeting");
const MeetingRegistration = require("../models/meetingRegistration");
const User = require("../models/Usermanagement");
const { sendSessionRegistrationEmail, sendRegistrationNotificationToOwner } = require("../services/mailService");

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const isMicrosoftTeamsMeetingLink = (link) => {
  try {
    const parsed = new URL(String(link || "").trim());
    const host = parsed.hostname.toLowerCase();
    return host === "teams.microsoft.com" || host.endsWith(".teams.microsoft.com");
  } catch {
    return false;
  }
};

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

    if (!isMicrosoftTeamsMeetingLink(meetingLink)) {
      return res.status(400).json({
        success: false,
        message: "meetingLink must be a valid Microsoft Teams link",
      });
    }

    const meeting = await Meeting.create({
      title,
      description,
      meetingLink: String(meetingLink).trim(),
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
    if (
      typeof req.body.meetingLink !== "undefined" &&
      !isMicrosoftTeamsMeetingLink(req.body.meetingLink)
    ) {
      return res.status(400).json({
        success: false,
        message: "meetingLink must be a valid Microsoft Teams link",
      });
    }

    if (typeof req.body.meetingLink === "string") {
      req.body.meetingLink = req.body.meetingLink.trim();
    }

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
    const { userId, fullName, email, description } = req.body;
    const meetingId = req.params.sessionId || req.body.meetingId;

    if (!meetingId || !fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "meetingId, fullName and email are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const alreadyRegistered = await MeetingRegistration.findOne({
      meetingId,
      email: normalizedEmail,
    });
    if (alreadyRegistered) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered for this meeting",
      });
    }

    const registration = await MeetingRegistration.create({
      meetingId,
      userId: userId || null,
      fullName,
      email: normalizedEmail,
      description,
    });

    const sessionDetails = {
      moduleName: meeting.module,
      date: new Date(meeting.scheduledAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: new Date(meeting.scheduledAt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      meetingLink: meeting.meetingLink,
      studentName: fullName,
    };

    console.log("\n🔄 Starting email send process...");
    let emailSent = false;
    let emailError = null;
    let ownerNotificationSent = false;

    try {
      await sendSessionRegistrationEmail(normalizedEmail, sessionDetails);
      emailSent = true;
      console.log(`✅ Email successfully sent to ${normalizedEmail}`);
    } catch (mailError) {
      emailError = mailError.message;
      console.error(`❌ Email failed for ${normalizedEmail}:`, mailError.message);
      console.error(`   Full error:`, mailError);
    }

    // Send notification email to meeting owner
    try {
      const owner = await User.findById(meeting.ownerId).select("email fullName");
      
      if (owner && owner.email) {
        const ownerNotificationData = {
          ownerName: owner.fullName || meeting.ownerName || "Host",
          meetingTitle: meeting.title,
          moduleName: meeting.module,
          date: new Date(meeting.scheduledAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          time: new Date(meeting.scheduledAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          registrantName: fullName,
          registrantEmail: normalizedEmail,
          registrantDescription: description || "No description provided",
        };

        await sendRegistrationNotificationToOwner(owner.email, ownerNotificationData);
        ownerNotificationSent = true;
        console.log(`✅ Registration notification sent to owner: ${owner.email}`);
      } else {
        console.warn("⚠️ Owner email not found for notification");
      }
    } catch (ownerMailError) {
      console.error(`❌ Failed to send owner notification:`, ownerMailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: {
        registration,
        meetingLink: meeting.meetingLink,
      },
      emailStatus: {
        sent: emailSent,
        ownerNotified: ownerNotificationSent,
        error: emailError || null,
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
