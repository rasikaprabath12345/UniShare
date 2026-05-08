const nodemailer = require("nodemailer");
const emailUser = process.env.SENDER_EMAIL || process.env.EMAIL_USER;
const emailPass = process.env.SENDER_PASSWORD || process.env.EMAIL_PASSWORD;

/**
 * ============================================
 * MAIL SERVICE - NODEMAILER CONFIGURATION
 * ============================================
 * Email sending utility for OTP, password reset, and notifications
 * 
 * IMPORTANT: Use Gmail App Password, NOT your regular Gmail password!
 * 1. Go to: https://myaccount.google.com/apppasswords
 * 2. Select "Mail" and "Windows Computer"
 * 3. Copy the 16-character password
 * 4. Set SENDER_PASSWORD in .env file
 * 
 * Do NOT use this for less secure apps setting.
 */

// Create transporter with proper Gmail configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: emailUser,
    pass: emailPass, // Must be App Password, not regular password
  },
});

// Verify transporter connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error.message);
    console.log("⚠️  Check SENDER_EMAIL/SENDER_PASSWORD or EMAIL_USER/EMAIL_PASSWORD");
    console.log("⚠️  Use Gmail App Password, not your regular password");
  } else {
    console.log("✅ Email transporter is ready to send messages");
  }
});

/**
 * Send Email - Generic Function
 * @param {string} recipientEmail - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - Email body (HTML format)
 * @returns {Promise<Object>} - Returns { success: boolean, message: string, info?: object }
 * @throws {Error} - Throws error if email sending fails
 */
const sendEmail = async (recipientEmail, subject, htmlContent) => {
  try {
    if (!emailUser || !emailPass) {
      throw new Error(
        "Email configuration missing: set SENDER_EMAIL/SENDER_PASSWORD or EMAIL_USER/EMAIL_PASSWORD"
      );
    }

    const mailOptions = {
      from: `"UniShare" <${emailUser}>`,
      to: recipientEmail,
      subject: subject,
      html: htmlContent,
      // Add reply-to for better email handling
      replyTo: emailUser,
    };

    console.log(`📧 Sending email to: ${recipientEmail}`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email sent successfully");
    console.log(`   MessageID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    
    return { 
      success: true, 
      message: "Email sent successfully",
      info: info 
    };
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    
    // Log specific Gmail errors for debugging
    if (error.code === 'EAUTH') {
      console.error("   ⚠️  Authentication failed - check your Google App Password");
    }
    
    // Throw the error so it propagates to the calling function
    throw error;
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
 * @param {string} otp - One-time password (6 digits)
 * @param {string} fullName - User's full name (optional)
 * @returns {Promise<Object>} - Returns { success: true, message, info }
 * @throws {Error} - Throws error if email sending fails
 */
const sendOTPEmail = async (recipientEmail, otp, fullName = 'UniShare Student') => {
  const htmlContent = `
    <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      
      <!-- Header with brand -->
      <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; margin-bottom: 30px;">
        <h1 style="color: #0d2257; margin: 0; font-size: 28px;">🎓 UniShare</h1>
        <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">Secure Password Reset</p>
      </div>

      <!-- Main content -->
      <div style="padding: 0 20px;">
        <h2 style="color: #0d2257; font-size: 22px; margin: 0 0 10px 0;">Password Reset OTP</h2>
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
          Hi <strong>${fullName}</strong>,
        </p>

        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
          We received a request to reset your UniShare account password. Use the One-Time Password (OTP) below to proceed with your password reset:
        </p>

        <!-- OTP Display Box -->
        <div style="background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 25px 0; box-shadow: 0 4px 15px rgba(21, 101, 192, 0.25);">
          <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
          <h1 style="color: white; font-size: 48px; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace; font-weight: 700;">${otp}</h1>
        </div>

        <!-- Important info -->
        <div style="background-color: #f4f7ff; border-left: 4px solid #1565C0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="color: #0d2257; font-size: 13px; font-weight: 600; margin: 0 0 8px 0;">⏱️ Important Information</p>
          <ul style="color: #666; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>This OTP will expire in <strong>5 minutes</strong></li>
            <li>Never share this code with anyone</li>
            <li>This code is valid only for password reset</li>
          </ul>
        </div>

        <!-- Security notice -->
        <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
          If you didn't request a password reset, please ignore this email. Your account remains secure.
        </p>

        <!-- Footer -->
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 12px; color: #999;">
          <p style="margin: 0;">UniShare Platform - SLIIT Student Community</p>
          <p style="margin: 5px 0 0 0;">For support, contact your administrator</p>
        </div>
      </div>

    </div>
  `;

  // This will throw an error if email sending fails
  return sendEmail(recipientEmail, "🔐 Your OTP Code - UniShare Password Reset", htmlContent);
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

/**
 * Send Email Verification OTP
 * @param {string} recipientEmail - Student email
 * @param {string} otp - One-time password (6 digits)
 * @param {string} fullName - User's full name (optional)
 * @returns {Promise<Object>} - Returns { success: true, message, info }
 * @throws {Error} - Throws error if email sending fails
 */
const sendVerificationEmail = async (recipientEmail, otp, fullName = 'UniShare Student') => {
  const htmlContent = `
    <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      
      <!-- Header with brand -->
      <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; margin-bottom: 30px;">
        <h1 style="color: #0d2257; margin: 0; font-size: 28px;">🎓 UniShare</h1>
        <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">Email Verification</p>
      </div>

      <!-- Main content -->
      <div style="padding: 0 20px;">
        <h2 style="color: #0d2257; font-size: 22px; margin: 0 0 10px 0;">Welcome to UniShare!</h2>
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
          Hi <strong>${fullName}</strong>,
        </p>

        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
          Thank you for registering with UniShare! To complete your registration and verify your email address, use the One-Time Password (OTP) below:
        </p>

        <!-- OTP Display Box -->
        <div style="background: linear-gradient(135deg, #0d2257 0%, #1565C0 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 25px 0; box-shadow: 0 4px 15px rgba(21, 101, 192, 0.25);">
          <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
          <h1 style="color: white; font-size: 48px; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace; font-weight: 700;">${otp}</h1>
        </div>

        <!-- Important info -->
        <div style="background-color: #f4f7ff; border-left: 4px solid #1565C0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="color: #0d2257; font-size: 13px; font-weight: 600; margin: 0 0 8px 0;">⏱️ Important Information</p>
          <ul style="color: #666; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>This OTP will expire in <strong>5 minutes</strong></li>
            <li>Never share this code with anyone</li>
            <li>You will need this code to verify your email during registration</li>
          </ul>
        </div>

        <!-- Benefits section -->
        <div style="background-color: #f0f7ff; border: 1px solid #d4e8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #0d2257; font-size: 14px; font-weight: 600; margin: 0 0 10px 0;">Get Started with UniShare:</h3>
          <ul style="color: #666; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>📚 Access learning materials and resources</li>
            <li>🎯 Join quizzes and track your progress</li>
            <li>💬 Collaborate with peers in the forum</li>
            <li>📊 View detailed performance reports</li>
          </ul>
        </div>

        <!-- Action note -->
        <p style="color: #666; font-size: 13px; line-height: 1.6; margin: 25px 0;">
          Please return to the registration page and enter this OTP to complete your account setup.
        </p>

        <!-- Footer -->
        <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 12px; color: #999;">
          <p style="margin: 0;">UniShare Platform - SLIIT Student Community</p>
          <p style="margin: 5px 0 0 0;">For support, contact your administrator</p>
        </div>
      </div>

    </div>
  `;

  // This will throw an error if email sending fails
  return sendEmail(recipientEmail, "✉️ Email Verification - UniShare Registration", htmlContent);
};

/**
 * Send session registration confirmation email.
 * @param {string} to - Recipient email.
 * @param {Object} sessionDetails - Session metadata used in the template.
 */
const sendSessionRegistrationEmail = async (to, sessionDetails) => {
  try {
    console.log(`\n📧 Preparing registration email for: ${to}`);
    console.log(`   Module: ${sessionDetails.moduleName}`);
    console.log(`   Date: ${sessionDetails.date}`);
    console.log(`   Time: ${sessionDetails.time}`);
    console.log(`   Link: ${sessionDetails.meetingLink}`);

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #0d2257; margin-bottom: 12px;">Kuppi Session Registration Confirmation</h2>
      <p>Hello ${sessionDetails.studentName || "Student"},</p>
      <p>You have successfully registered for a Kuppi session.</p>

      <div style="background-color: #f4f7ff; border-left: 4px solid #1565C0; padding: 14px; border-radius: 5px; margin: 18px 0;">
        <p style="margin: 6px 0;"><strong>Module:</strong> ${sessionDetails.moduleName}</p>
        <p style="margin: 6px 0;"><strong>Date:</strong> ${sessionDetails.date}</p>
        <p style="margin: 6px 0;"><strong>Time:</strong> ${sessionDetails.time}</p>
      </div>

      <p>Join using the link below:</p>
      <p style="word-break: break-all; margin-top: 8px;">
        <a href="${sessionDetails.meetingLink}">${sessionDetails.meetingLink}</a>
      </p>

      <p style="margin-top: 20px;">Thank you.</p>
      <p style="color: #888; font-size: 12px; margin-top: 24px;">UniShare Platform</p>
    </div>
  `;

    const result = await sendEmail(to, "Kuppi Session Registration Confirmation", htmlContent);
    console.log(`✅ Registration email sent successfully to ${to}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send registration email to ${to}:`);
    console.error(`   Error: ${error.message}`);
    throw error; // Re-throw to let controller handle it
  }
};

/**
 * Send registration notification email to meeting owner
 * @param {string} ownerEmail - Meeting owner email
 * @param {Object} registrationData - Registration and meeting details
 */
const sendRegistrationNotificationToOwner = async (ownerEmail, registrationData) => {
  try {
    console.log(`\n📧 Preparing registration notification for owner: ${ownerEmail}`);
    
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #0d2257; margin-bottom: 12px;">New Registration for Your Kuppi Session</h2>
      <p>Hello ${registrationData.ownerName},</p>
      <p>Someone has registered for your Kuppi session.</p>

      <div style="background-color: #f4f7ff; border-left: 4px solid #1565C0; padding: 14px; border-radius: 5px; margin: 18px 0;">
        <p style="margin: 8px 0; font-weight: 600;">📋 Meeting Details:</p>
        <p style="margin: 6px 0;"><strong>Title:</strong> ${registrationData.meetingTitle}</p>
        <p style="margin: 6px 0;"><strong>Module:</strong> ${registrationData.moduleName}</p>
        <p style="margin: 6px 0;"><strong>Date:</strong> ${registrationData.date}</p>
        <p style="margin: 6px 0;"><strong>Time:</strong> ${registrationData.time}</p>
      </div>

      <div style="background-color: #fff5f1; border-left: 4px solid #ff6b35; padding: 14px; border-radius: 5px; margin: 18px 0;">
        <p style="margin: 8px 0; font-weight: 600;">👤 Registrant Details:</p>
        <p style="margin: 6px 0;"><strong>Name:</strong> ${registrationData.registrantName}</p>
        <p style="margin: 6px 0;"><strong>Email:</strong> ${registrationData.registrantEmail}</p>
        ${registrationData.registrantDescription ? `<p style="margin: 6px 0;"><strong>About:</strong> ${registrationData.registrantDescription}</p>` : ''}
      </div>

      <p style="margin-top: 20px; color: #666;">Thank you for hosting this session on UniShare!</p>
      <p style="color: #888; font-size: 12px; margin-top: 24px;">UniShare Platform</p>
    </div>
  `;

    const result = await sendEmail(ownerEmail, `New Registration: ${registrationData.meetingTitle}`, htmlContent);
    console.log(`✅ Registration notification sent to owner: ${ownerEmail}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send registration notification to owner ${ownerEmail}:`);
    console.error(`   Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendForgotPasswordEmail,
  sendOTPEmail,
  sendVerificationEmail,
  sendWarningEmail,
  sendSessionRegistrationEmail,
  sendRegistrationNotificationToOwner,
};
