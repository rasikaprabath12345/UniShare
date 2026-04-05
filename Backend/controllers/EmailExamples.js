/**
 * ============================================
 * EMAIL EXAMPLES - HOW TO USE IN CONTROLLERS
 * ============================================
 * Add these functions to your existing controllers
 */

const { sendForgotPasswordEmail, sendOTPEmail, sendWarningEmail } = require("../services/mailService");
const crypto = require("crypto");

// Assuming you have User model imported
const User = require("../models/Usermanagement");

/**
 * =============== FORGOT PASSWORD ===============
 * Example: User requests password reset
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // 2. Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    // 3. Save token and expiry to database
    user.passwordResetToken = hashedToken;
    user.passwordResetExpiry = tokenExpiry;
    await user.save();

    // 4. Create reset link (frontend URL)
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // 5. Send email
    const emailResult = await sendForgotPasswordEmail(email, resetToken, resetLink);

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "Password reset link sent to your email"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send email: " + emailResult.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * =============== SEND OTP ===============
 * Example: Send OTP for two-factor authentication or login verification
 */
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 3. Save OTP to database (hashed for security)
    const hashedOTP = require("bcryptjs").hashSync(otp, 10);
    user.otp = hashedOTP;
    user.otpExpiry = otpExpiry;
    await user.save();

    // 4. Send OTP email
    const emailResult = await sendOTPEmail(email, otp);

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "OTP sent to your email",
        expiresIn: "10 minutes"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send OTP: " + emailResult.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * =============== SEND WARNING EMAIL ===============
 * Example 1: Low Attendance Warning
 */
const sendLowAttendanceWarning = async (req, res) => {
  try {
    const { studentId } = req.body;

    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const warningMessage = `
      Your attendance is below 75%. 
      Current Attendance: ${65}%
      
      Please attend more classes to meet the minimum attendance requirement.
      Contact your instructor if you have any issues.
    `;

    const emailResult = await sendWarningEmail(
      user.email,
      "Low Attendance",
      warningMessage
    );

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "Warning email sent to student"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send warning: " + emailResult.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * =============== SEND WARNING EMAIL ===============
 * Example 2: Missed Quiz Warning
 */
const sendMissedQuizWarning = async (req, res) => {
  try {
    const { studentId, quizName } = req.body;

    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const warningMessage = `
      You have missed the quiz: "${quizName}"
      
      Log in to your dashboard to attempt it now.
      Deadline: Tomorrow at 11:59 PM
    `;

    const emailResult = await sendWarningEmail(
      user.email,
      "Missed Quiz",
      warningMessage
    );

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "Missed quiz reminder sent to student"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send reminder: " + emailResult.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * =============== SEND TO MULTIPLE STUDENTS ===============
 * Example: Broadcast warning to all students in a course
 */
const sendBulkWarning = async (req, res) => {
  try {
    const { warningType, message } = req.body;

    // Get all students (filter by role if needed)
    const students = await User.find({ role: "student" });

    let sentCount = 0;
    let failedCount = 0;

    // Send email to each student
    for (const student of students) {
      const emailResult = await sendWarningEmail(
        student.email,
        warningType,
        message
      );

      if (emailResult.success) {
        sentCount++;
      } else {
        failedCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Emails sent: ${sentCount}, Failed: ${failedCount}`,
      stats: {
        total: students.length,
        sent: sentCount,
        failed: failedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  forgotPassword,
  sendOTP,
  sendLowAttendanceWarning,
  sendMissedQuizWarning,
  sendBulkWarning,
};
