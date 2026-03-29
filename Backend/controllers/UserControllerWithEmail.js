/**
 * ============================================
 * COMPLETE EMAIL INTEGRATION IN USERCONTROLLER
 * ============================================
 * Copy and adapt these functions into your UserController.js
 */

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendForgotPasswordEmail, sendOTPEmail, sendWarningEmail } = require("../services/mailService");

// Assuming User model is imported
const User = require("../models/Usermanagement");

/**
 * ┌─────────────────────────────────┐
 * │ 1. REGISTER USER (with email)   │
 * └─────────────────────────────────┘
 */
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use"
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: "student"
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * ┌──────────────────────────────────────────────┐
 * │ 2. FORGOT PASSWORD (Send reset email)        │
 * └──────────────────────────────────────────────┘
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save token and expiry (1 hour validity)
    user.passwordResetToken = hashedToken;
    user.passwordResetExpiry = Date.now() + 60 * 60 * 1000;
    await user.save();

    // Create reset link
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Send email
    const emailResult = await sendForgotPasswordEmail(email, resetToken, resetLink);

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "Password reset link sent to your email",
        resetTokenSent: true
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
 * ┌──────────────────────────────────────────────┐
 * │ 3. RESET PASSWORD (Verify token & update)    │
 * └──────────────────────────────────────────────┘
 */
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // Hash the token to compare with database
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    // Update password
    user.password = await bcryptjs.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * ┌────────────────────────────────────┐
 * │ 4. SEND OTP (2FA or verification)  │
 * └────────────────────────────────────┘
 */
const sendOTPCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash and save OTP (10 minutes validity)
    user.otp = await bcryptjs.hash(otp, 10);
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send OTP email
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
 * ┌──────────────────────────────────┐
 * │ 5. VERIFY OTP (Check OTP code)   │
 * └──────────────────────────────────┘
 */
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    // Find user with valid OTP
    const user = await User.findOne({
      email,
      otpExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found or OTP expired"
      });
    }

    // Compare OTP
    const isOTPValid = await bcryptjs.compare(otp, user.otp);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Clear OTP after verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * ┌──────────────────────────────────────────────────┐
 * │ 6. SEND ATTENDANCE WARNING (to single student)   │
 * └──────────────────────────────────────────────────┘
 */
const notifyLowAttendance = async (req, res) => {
  try {
    const { studentId, attendancePercentage } = req.body;

    if (!studentId || attendancePercentage === undefined) {
      return res.status(400).json({
        success: false,
        message: "Student ID and attendance percentage required"
      });
    }

    // Find student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Create warning message
    const warningMessage = `
      Your current attendance is ${attendancePercentage}%.
      The minimum required attendance is 75%.
      Please attend your classes regularly to maintain good standing.
      If you have any issues, contact your course instructor.
    `;

    // Send email
    const emailResult = await sendWarningEmail(
      student.email,
      "Low Attendance Warning",
      warningMessage
    );

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "Attendance warning sent to student"
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
 * ┌────────────────────────────────────────────────────┐
 * │ 7. SEND BULK WARNING (to all students at risk)     │
 * └────────────────────────────────────────────────────┘
 */
const notifyAllLowAttendance = async (req, res) => {
  try {
    const { minAttendanceThreshold = 75 } = req.body;

    // Get all students with low attendance
    // Assuming you store attendance in your student documents
    const atRiskStudents = await User.find({
      role: "student",
      // Add your attendance filter here
      // Example: attendance: { $lt: minAttendanceThreshold }
    });

    if (atRiskStudents.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No students with low attendance found"
      });
    }

    let successCount = 0;
    let failureCount = 0;

    // Send email to each student
    for (const student of atRiskStudents) {
      const warningMessage = `
        Your attendance is below the minimum required (${minAttendanceThreshold}%).
        Please take action immediately.
      `;

      const emailResult = await sendWarningEmail(
        student.email,
        "Attendance Alert",
        warningMessage
      );

      if (emailResult.success) {
        successCount++;
      } else {
        failureCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: "Bulk warnings sent",
      stats: {
        total: atRiskStudents.length,
        sent: successCount,
        failed: failureCount
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
  registerUser,
  forgotPassword,
  resetPassword,
  sendOTPCode,
  verifyOTP,
  notifyLowAttendance,
  notifyAllLowAttendance,
};
