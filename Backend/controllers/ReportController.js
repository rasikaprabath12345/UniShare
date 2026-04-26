const Report = require("../models/Report");
const User = require("../models/Usermanagement");

// Create Report
exports.createReport = async (req, res) => {
  try {
    // Fetch the reporter's full name (from reportedByUserId, not reportedUserId)
    let reportedByName = req.body.reportedByName || "Unknown User";
    if (req.body.reportedByUserId) {
      try {
        const reporter = await User.findById(req.body.reportedByUserId).select("fullName");
        reportedByName = reporter ? reporter.fullName : reportedByName;
      } catch (err) {
        // Keep the provided reportedByName if user fetch fails
      }
    }
    
    const reportData = {
      ...req.body,
      reportedByName: reportedByName
    };
    
    const report = new Report(reportData);
    const savedReport = await report.save();
    res.status(201).json({
      success: true,
      data: savedReport,
      message: "Report created successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Reports
exports.getAllReports = async (req, res) => {
  try {
    // Fetch reports
    const reports = await Report.find().sort({ createdAt: -1 });
    
    console.log(`📋 Fetching ${reports.length} reports...`);
    
    // Enrich reports with user names
    const enrichedReports = await Promise.all(
      reports.map(async (report) => {
        const reportObj = report.toObject();
        
        // If reportedByName doesn't exist, fetch from user
        if (!reportObj.reportedByName) {
          try {
            if (reportObj.reportedUserId) {
              const user = await User.findById(reportObj.reportedUserId).select("fullName");
              reportObj.reportedByName = user?.fullName || reportObj.reportedBy || "Unknown User";
              console.log(`✅ Found name for user: ${reportObj.reportedByName}`);
            } else {
              reportObj.reportedByName = reportObj.reportedBy || "Unknown User";
            }
          } catch (err) {
            console.error(`❌ Error fetching user:`, err.message);
            reportObj.reportedByName = reportObj.reportedBy || "Unknown User";
          }
        }
        
        return reportObj;
      })
    );
    
    res.status(200).json({
      success: true,
      data: enrichedReports,
      message: "Reports retrieved successfully"
    });
  } catch (error) {
    console.error("Error in getAllReports:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Reports by Student ID
exports.getReportsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const reports = await Report.find({ reportedUserId: studentId }).sort({ createdAt: -1 });
    
    // Enrich reports with user names
    const enrichedReports = await Promise.all(
      reports.map(async (report) => {
        const reportObj = report.toObject();
        
        if (!reportObj.reportedByName) {
          try {
            if (reportObj.reportedUserId) {
              const user = await User.findById(reportObj.reportedUserId).select("fullName");
              reportObj.reportedByName = user?.fullName || reportObj.reportedBy || "Unknown User";
            } else {
              reportObj.reportedByName = reportObj.reportedBy || "Unknown User";
            }
          } catch (err) {
            reportObj.reportedByName = reportObj.reportedBy || "Unknown User";
          }
        }
        
        return reportObj;
      })
    );
    
    res.json({
      success: true,
      data: enrichedReports,
      message: "Student reports retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Report Count for a Student
exports.getReportCount = async (req, res) => {
  try {
    const { studentId } = req.params;
    const count = await Report.countDocuments({ reportedUserId: studentId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Report Status
exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    );

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Report
exports.deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Report Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }
    
    const reportObj = report.toObject();
    
    // If reportedByName doesn't exist, fetch from user
    if (!reportObj.reportedByName) {
      try {
        if (reportObj.reportedUserId) {
          const user = await User.findById(reportObj.reportedUserId).select("fullName");
          reportObj.reportedByName = user?.fullName || reportObj.reportedBy || "Unknown User";
        } else {
          reportObj.reportedByName = reportObj.reportedBy || "Unknown User";
        }
      } catch (err) {
        reportObj.reportedByName = reportObj.reportedBy || "Unknown User";
      }
    }
    
    res.json({
      success: true,
      data: reportObj,
      message: "Report retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
