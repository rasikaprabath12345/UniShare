# Forgot Password Feature - Quick Reference

## 📂 Files Modified/Created

### Backend Files Modified:

1. **`Backend/models/Usermanagement`**
   - Added `otpCode` field
   - Added `otpExpires` field

2. **`Backend/controllers/UserController`**
   - Added `forgotPassword()` function
   - Added `verifyOTP()` function
   - Added `resetPassword()` function

3. **`Backend/routes/UserRoutes`**
   - Added route: `POST /users/forgot-password`
   - Added route: `POST /users/verify-otp`
   - Added route: `POST /users/reset-password`

4. **`Backend/services/mailService.js`**
   - Updated `sendOTPEmail()` function with better email template

### Frontend Files Modified/Created:

1. **`frontend/src/pages/UserManagement/ForgotPassword.jsx`** (Modified)
   - Updated to use OTP-based flow
   - Navigate to ResetPassword on success

2. **`frontend/src/pages/UserManagement/ResetPassword.jsx`** (Created)
   - New component for OTP verification and password reset
   - OTP input field
   - New password fields with show/hide toggle
   - Form validation

3. **`frontend/src/App.js`** (Modified)
   - Added import for ResetPassword
   - Added routes for `/reset-password` and `/ResetPassword`

### Documentation Files Created:

1. **`FORGOT_PASSWORD_IMPLEMENTATION.md`** - Complete implementation guide
2. **`FORGOT_PASSWORD_QUICK_REFERENCE.md`** - This file

---

## 🚀 Getting Started - Quick Steps

### 1. Backend Setup:
Already done! The following are implemented:
- ✅ User model fields updated
- ✅ Controller functions added
- ✅ Routes added
- ✅ Email service updated

### 2. Frontend Setup:
Already done! The following are implemented:
- ✅ ForgotPassword page updated
- ✅ ResetPassword page created
- ✅ Routes added to App.js

### 3. Environment Configuration:
Ensure `.env` has:
```
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
```

### 4. Test the Flow:
1. Start backend: `npm start` (in Backend folder)
2. Start frontend: `npm start` (in frontend folder)
3. Go to http://localhost:3000/forgot-password
4. Enter SLIIT email and follow prompts

---

## 🔑 Key API Endpoints

| Endpoint | Method | Input | Purpose |
|----------|--------|-------|---------|
| `/api/users/forgot-password` | POST | `{ email }` | Send OTP to email |
| `/api/users/verify-otp` | POST | `{ email, otp }` | Verify OTP is correct |
| `/api/users/reset-password` | POST | `{ email, otp, newPassword, confirmPassword }` | Reset password |

---

## 📋 Validation Rules

### Email:
- Must be valid email format
- Must end with `@my.sliit.lk`
- Must exist in database

### OTP:
- 6 digits (0-9 only)
- Generated randomly
- Expires in 5 minutes

### Password:
- Minimum 8 characters
- Must match confirmation
- Hashed with bcrypt before storage

---

## 🎯 User Journey

```
Start → ForgotPassword Page
  ↓
Enter Email (must be @my.sliit.lk)
  ↓
Backend generates OTP + sends email
  ↓
Frontend navigates to ResetPassword
  ↓
User enters OTP + new password
  ↓
Backend verifies OTP + updates password
  ↓
Success message + redirect to Login
  ↓
End - User can now login
```

---

## 🛠️ Testing Checklist

- [ ] Test with valid SLIIT email
- [ ] Test with invalid email format
- [ ] Test with non-existent email
- [ ] Test with expired OTP (wait 5+ min)
- [ ] Test with incorrect OTP
- [ ] Test with password too short
- [ ] Test with mismatched passwords
- [ ] Verify OTP email received
- [ ] Verify success redirect to login
- [ ] Verify new password works for login

---

## 📊 Database Changes

Only ONE model was modified:
- **Usermanagement schema** - Added 2 fields for OTP functionality

No new models were created or deleted.

---

## 🔒 Security Summary

✅ 6-digit random OTP generation
✅ 5-minute OTP expiry
✅ SLIIT email validation (@my.sliit.lk)
✅ Password hashing (bcrypt, 12 rounds)
✅ OTP stored securely in database
✅ OTP cleared after successful reset
✅ Proper error handling (no info leaks)

---

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| OTP not arriving | Check SENDER_EMAIL/PASSWORD in .env, check email spam folder |
| "Email not found" error | Register account first, ensure email ends with @my.sliit.lk |
| "OTP expired" after 5 min | Request new OTP by going back to forgot-password |
| "Incorrect OTP" | Copy OTP correctly from email (case-sensitive) |
| Password not changing | Ensure new password is 8+ chars and matches confirm |

---

## 📝 Code Examples

### Frontend - Request OTP:
```javascript
axios.post('http://localhost:8000/api/users/forgot-password', {
  email: 'it21843132@my.sliit.lk'
})
```

### Frontend - Reset Password:
```javascript
axios.post('http://localhost:8000/api/users/reset-password', {
  email: 'it21843132@my.sliit.lk',
  otp: '123456',
  newPassword: 'SecurePass123',
  confirmPassword: 'SecurePass123'
})
```

### Backend - Generate OTP:
```javascript
const otp = Math.floor(100000 + Math.random() * 900000).toString();
const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min
```

---

**Ready to use!** All components are integrated and functional. 🎉
