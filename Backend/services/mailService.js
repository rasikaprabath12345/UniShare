const nodemailer = require("nodemailer");

/**
 * ============================================
 * MAIL SERVICE - NODEMAILER CONFIGURATION
 * ============================================
 * Simple email sending utility for forgot password, OTP, and warnings
 */

// Create transporter (reusable connection)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

/**
 * Send Email - Generic Function
 * @param {string} recipientEmail - Student email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - Email body (HTML format)
 * @returns {Promise} - Returns success or error
 */
const sendEmail = async (recipientEmail, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: recipientEmail,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Send Forgot Password Email
 * @param {string} recipientEmail - Student email
 * @param {string} resetToken - Password reset token
 * @param {string} resetLink - Frontend reset link
 */
const sendForgotPasswordEmail = async (recipientEmail, resetToken, resetLink) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset your Unishare platform password. Click the link below to reset it:</p>
      
      <a href="${resetLink}" style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Reset Password
      </a>
      
      <p style="margin-top: 20px; color: #666;">Or copy this link: ${resetLink}</p>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        This link expires in 1 hour. If you didn't request this, ignore this email.
      </p>
    </div>
  `;

  return sendEmail(recipientEmail, "🔐 Password Reset - Unishare Platform", htmlContent);
};

/**
 * Send OTP Email
 * @param {string} recipientEmail - Student email
 * @param {string} otp - One-time password
 */
const sendOTPEmail = async (recipientEmail, otp) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Your OTP Code</h2>
      <p>Hello,</p>
      <p>Your One-Time Password (OTP) for verification is:</p>
      
      <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${otp}</h1>
      </div>
      
      <p style="color: #666; font-size: 14px;">This OTP expires in 10 minutes.</p>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        If you didn't request this OTP, please ignore this email.
      </p>
    </div>
  `;

  return sendEmail(recipientEmail, "🔐 Your OTP Code - Unishare Platform", htmlContent);
};

/**
 * Send Warning/Alert Email
 * @param {string} recipientEmail - Student email
 * @param {string} warningType - Type of warning (e.g., "low-attendance", "missed-quiz")
 * @param {string} message - Warning message
 */
const sendWarningEmail = async (recipientEmail, warningType, message) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #d32f2f;">⚠️ Important Alert</h2>
      <p>Hello,</p>
      <p>${message}</p>
      
      <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 3px;">
        <p><strong>Alert Type:</strong> ${warningType}</p>
        <p>Please take immediate action to resolve this issue.</p>
      </div>
      
      <p style="color: #666; margin-top: 20px;">Log in to your dashboard to view more details: <a href="http://localhost:3000/dashboard">Unishare Dashboard</a></p>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        If you believe this is a mistake, contact support.
      </p>
    </div>
  `;

  return sendEmail(recipientEmail, `⚠️ Alert: ${warningType} - Unishare Platform`, htmlContent);
};

module.exports = {
  sendEmail,
  sendForgotPasswordEmail,
  sendOTPEmail,
  sendWarningEmail,
};
