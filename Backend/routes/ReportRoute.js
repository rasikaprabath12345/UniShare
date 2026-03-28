const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");

// Create Report
router.post("/add", ReportController.createReport);

// Get All Reports
router.get("/", ReportController.getAllReports);

// Get Reports by Student ID
router.get("/student/:studentId", ReportController.getReportsByStudent);

// Get Report Count for a Student
router.get("/student/:studentId/count", ReportController.getReportCount);

// Get Report by ID
router.get("/:id", ReportController.getReportById);

// Update Report Status
router.patch("/:reportId", ReportController.updateReportStatus);

// Delete Report
router.delete("/:id", ReportController.deleteReport);

module.exports = router;
