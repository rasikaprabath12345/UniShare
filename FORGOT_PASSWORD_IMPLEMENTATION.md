# UniShare Forgot Password Feature - Implementation Guide

## 📋 Overview
This document provides a complete guide to the Forgot Password feature implemented in the UniShare MERN project using OTP (One-Time Password) verification.

---

## ✅ What Has Been Implemented

### 1. **Backend - User Model Updates**
**File:** `Backend/models/Usermanagement`

**Changes:**
- Added `otpCode` field (String, default: null, select: false)
- Added `otpExpires` field (Date, default: null)

These fields store the 6-digit OTP and its expiration time (5 minutes).

### 2. **Backend - Controller Functions**
**File:** `Backend/controllers/UserController`

**Three New Functions Added:**

#### a) `forgotPassword(req, res)`
- **Endpoint:** POST `/api/users/forgot-password`
- **Input:** `{ email }`
- **Process:**
  1. Validates email format
  2. Ensures email ends with `@my.sliit.lk` (SLIIT only)
  3. Finds user in database
  4. Generates random 6-digit OTP
  5. Sets OTP expiry to 5 minutes
  6. Saves OTP to user document in database
  7. Sends OTP via email using Nodemailer
- **Output:** Success/error message
- **Error Cases:**
  - Email not in correct format
  - Email doesn't end with @my.sliit.lk
  - Email not found in database
  - Email sending fails

#### b) `verifyOTP(req, res)`
- **Endpoint:** POST `/api/users/verify-otp`
- **Input:** `{ email, otp }`
- **Process:**
  1. Validates email and OTP provided
  2. Finds user by email
  3. Checks if OTP exists
  4. Verifies OTP is not expired
  5. Compares provided OTP with stored OTP
- **Output:** Success/error message
- **Error Cases:**
  - OTP not found
  - OTP has expired (cleared from DB)
  - OTP is incorrect

#### c) `resetPassword(req, res)`
- **Endpoint:** POST `/api/users/reset-password`
- **Input:** `{ email, otp, newPassword, confirmPassword }`
- **Process:**
  1. Validates all fields are provided
  2. Ensures new password matches confirm password
  3. Ensures password is at least 8 characters
  4. Finds user by email
  5. Verifies OTP is valid and not expired
  6. Updates password (hashed by pre-save hook)
  7. Clears OTP and expiry from database
- **Output:** Success/error message
- **Error Cases:**
  - Passwords don't match
  - Password too short
  - OTP invalid or expired
  - Email not found

### 3. **Backend - Routes**
**File:** `Backend/routes/UserRoutes`

**New Routes Added:**
```javascript
router.post('/forgot-password', userController.forgotPassword);
router.post('/verify-otp', userController.verifyOTP);
router.post('/reset-password', userController.resetPassword);
```

### 4. **Backend - Mail Service**
**File:** `Backend/services/mailService.js`

**Updated Function:**
- `sendOTPEmail(recipientEmail, otp, fullName)`
  - Now accepts user's full name for personalization
  - Updated HTML template with UniShare branding
  - Shows OTP prominently with 5-minute expiry info
  - Professional email design matching UniShare theme

### 5. **Frontend - Updated ForgotPassword Page**
**File:** `frontend/src/pages/UserManagement/ForgotPassword.jsx`

**Changes:**
- Simplified to focus on email input only
- Sends OTP request (not token/link)
- Navigates to ResetPassword page on success
- Validates SLIIT email format
- Responsive design with UniShare theme
- Error/success messaging

### 6. **Frontend - New ResetPassword Page**
**File:** `frontend/src/pages/UserManagement/ResetPassword.jsx`

**Features:**
- Accepts email from previous page via React Router state
- Three input fields:
  - 6-digit OTP input (numeric only)
  - New password input (with show/hide toggle)
  - Confirm password input (with show/hide toggle)
- Form validation:
  - OTP must be 6 digits
  - Password must be at least 8 characters
  - Passwords must match
- Success state showing after successful reset
- Redirects to login page after successful reset
- Responsive design matching UniShare theme

### 7. **Frontend - Router Updates**
**File:** `frontend/src/App.js`

**Changes:**
- Imported `ResetPassword` component
- Added public routes for `/reset-password` and `/ResetPassword` (alias)

---

## 🏗️ Architecture Flow

### Complete User Flow:

```
1. User clicks "Forgot Password" link
   ↓
2. User lands on ForgotPassword page (/forgot-password)
   - Enters email (must be @my.sliit.lk)
   ↓
3. Frontend sends POST request to /api/users/forgot-password
   - Backend validates email
   - Generates 6-digit OTP
   - OTP expires in 5 minutes
   - Sends OTP to user's email via Nodemailer
   ↓
4. On success, user is redirected to ResetPassword page (/reset-password)
   - Email is passed via React Router state
   ↓
5. User enters:
   - 6-digit OTP from email
   - New password (8+ characters)
   - Confirm password
   ↓
6. Frontend sends POST request to /api/users/reset-password
   - Backend verifies OTP (not expired, correct code)
   - Updates password (hashed)
   - Clears OTP from database
   ↓
7. On success, user sees success message
   - Redirected to login page after 2 seconds
   ↓
8. User can now login with new password
```

---

## 🔗 API Endpoints Reference

### 1. Forgot Password (Send OTP)
```
POST /api/users/forgot-password
Content-Type: application/json

Request Body:
{
  "email": "it21843132@my.sliit.lk"
}

Response (200):
{
  "message": "OTP has been sent to your registered email address"
}

Response (400/404):
{
  "message": "Error message here"
}
```

### 2. Verify OTP (Optional - if needed for frontend)
```
POST /api/users/verify-otp
Content-Type: application/json

Request Body:
{
  "email": "it21843132@my.sliit.lk",
  "otp": "123456"
}

Response (200):
{
  "message": "OTP verified successfully. You can now reset your password."
}

Response (400/404):
{
  "message": "Error message here"
}
```

### 3. Reset Password
```
POST /api/users/reset-password
Content-Type: application/json

Request Body:
{
  "email": "it21843132@my.sliit.lk",
  "otp": "123456",
  "newPassword": "NewSecurePassword123",
  "confirmPassword": "NewSecurePassword123"
}

Response (200):
{
  "message": "Password has been reset successfully. You can now login with your new password."
}

Response (400/404):
{
  "message": "Error message here"
}
```

---

## 🧪 Testing Guide

### Prerequisites:
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`
- MongoDB running with UniShare database
- Environment variables set (`SENDER_EMAIL`, `SENDER_PASSWORD`)

### Test Scenario 1: Happy Path
1. Go to http://localhost:3000/forgot-password
2. Enter valid SLIIT email (e.g., it21843132@my.sliit.lk)
3. Click "Send OTP Code"
4. Check email inbox for OTP
5. Copy OTP code
6. Should be automatically redirected to /reset-password
7. Enter OTP, new password, confirm password
8. Click "Reset Password"
9. Should see success message
10. Should be redirected to /login within 2 seconds

### Test Scenario 2: Invalid Email Format
1. Go to http://localhost:3000/forgot-password
2. Enter email without @my.sliit.lk (e.g., test@gmail.com)
3. Try to submit
4. Should see error: "Please use your @my.sliit.lk SLIIT email address"

### Test Scenario 3: Non-existent Email
1. Go to http://localhost:3000/forgot-password
2. Enter valid format but non-existent email (e.g., it99999999@my.sliit.lk)
3. Click "Send OTP Code"
4. Should see error: "Email address not found. Please check and try again."

### Test Scenario 4: Incorrect OTP
1. Complete steps 1-4 from Test Scenario 1
2. Enter wrong OTP
3. Click "Reset Password"
4. Should see error: "Incorrect OTP. Please check and try again."

### Test Scenario 5: Expired OTP
1. Complete steps 1-3 from Test Scenario 1
2. Wait 5+ minutes
3. Enter correct OTP
4. Click "Reset Password"
5. Should see error: "OTP has expired. Please request a new one."

### Test Scenario 6: Password Validation
1. Complete steps 1-6 from Test Scenario 1
2. Enter OTP and new password (less than 8 characters)
3. Should see error: "New password must be at least 8 characters long"
4. Try with passwords that don't match
5. Should see error: "Passwords do not match"

---

## 🔐 Security Features Implemented

1. **OTP Generation:** Random 6-digit code (000000 - 999999)
2. **OTP Expiry:** 5 minutes from generation
3. **SLIIT Email Only:** Only @my.sliit.lk emails allowed
4. **Password Hashing:** Passwords hashed with bcrypt (12 salt rounds)
5. **OTP Storage:** OTP stored in database with expiry
6. **OTP Clearing:** OTP automatically cleared after successful reset
7. **Email Validation:** Format validation before processing
8. **Error Messages:** User-friendly but secure (doesn't reveal user existence)

---

## 📧 Email Configuration

**File:** `.env`

Required environment variables:
```
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
```

**Note:** For Gmail:
1. Enable "Less secure app access" OR
2. Generate App Password from Google Account Security settings
3. Use App Password as SENDER_PASSWORD

---

## 📝 Database Schema

**User Model Fields Added:**

```javascript
otpCode: {
  type: String,
  default: null,
  select: false  // Not selected by default (security)
}

otpExpires: {
  type: Date,
  default: null
}
```

---

## 🎨 UI/UX Features

1. **Responsive Design:** Works on desktop, tablet, and mobile
2. **UniShare Theme:** Navy (#0d2257) and Blue (#1565C0) colors
3. **User Guidance:** Step-by-step instructions on both pages
4. **Loading States:** Button shows loading text during API calls
5. **Error Alerts:** Clear, actionable error messages
6. **Success States:** Visual feedback on successful operations
7. **Field Validation:** Real-time validation of inputs
8. **Show/Hide Passwords:** Toggle for password visibility
9. **Auto-redirect:** Automatic navigation after success

---

## 🛠️ Troubleshooting

### OTP Not Being Sent
- Check `.env` for correct email credentials
- Verify Gmail "Less secure app access" is enabled
- Check MongoDB connection
- Check browser console for error details

### OTP Not Working
- Ensure 5-minute expiry hasn't passed
- Check MongoDB to verify OTP was saved
- Verify email in request matches stored email

### Password Reset Not Working
- Ensure OTP is correct and not expired
- Check password meets minimum 8 character requirement
- Verify confirm password matches new password
- Check MongoDB to verify password was updated

### Frontend Not Showing Error Messages
- Check browser console for API errors
- Verify backend is running on port 8000
- Check network tab in browser dev tools

---

## 📌 Future Enhancements (Optional)

1. **Resend OTP Button:** Allow users to request new OTP
2. **Email Verification During Reset:** Verify email before allowing reset
3. **Rate Limiting:** Limit password reset attempts (prevent brute force)
4. **Forgot Password History:** Track password reset attempts
5. **Two-Factor Authentication:** Add TOTP/2FA for added security
6. **Security Questions:** Alternative verification method
7. **Backup Codes:** Generate backup codes for account recovery
8. **Account Lockout:** Temporary lockout after failed attempts

---

## 📞 Support & Maintenance

If you encounter any issues or need modifications:

1. Check error logs in backend terminal
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Ensure MongoDB is running
5. Clear browser cache and try again
6. Review validation error messages

---

**Implementation Date:** April 2026
**Status:** ✅ Complete and Ready for Testing
**Version:** 1.0
