const express = require("express");
const {
	createMeeting,
	getMeetings,
	getMeetingById,
	updateMeeting,
	deleteMeeting,
	registerForMeeting,
	getMeetingRegistrations,
	getUserRegistrations,
} = require("../controllers/MeetingController");

const router = express.Router();

router.get("/", getMeetings);
router.post("/", createMeeting);
router.post("/:sessionId/register", registerForMeeting);
router.post("/register", registerForMeeting);
router.get("/registrations/user/:userId", getUserRegistrations);
router.get("/:id", getMeetingById);
router.put("/:id", updateMeeting);
router.delete("/:id", deleteMeeting);
router.get("/:id/registrations", getMeetingRegistrations);

module.exports = router;
