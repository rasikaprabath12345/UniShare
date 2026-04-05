import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

/* ── Scoped styles — matches UniShare theme (Navy #0d2257 · Blue #1565C0 · Poppins) ── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

  :root {
    --navy:       #0d2257;
    --blue:       #1565C0;
    --blue-pale:  #e8f0fe;
    --blue-ghost: #f4f7ff;
    --rose:       #d4537e;
    --rose-pale:  #fce8ef;
    --grey-50:    #f8faff;
    --grey-100:   #eef2f9;
    --grey-200:   #dde8f8;
    --grey-400:   #9eadc8;
    --text-sub:   #5a6a8a;
    --font:       'Poppins', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font); background: var(--grey-50); }

  .reg-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: var(--font);
  }

  /* ── Left panel ── */
  .reg-left {
    background: linear-gradient(145deg, var(--navy) 0%, #163a8a 55%, var(--blue) 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 60px 50px; position: relative; overflow: hidden;
  }
  .reg-left::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 20% 25%, rgba(55,138,221,0.22) 0%, transparent 50%),
      radial-gradient(circle at 80% 75%, rgba(29,158,117,0.14) 0%, transparent 50%);
  }
  .reg-left::after {
    content: ''; position: absolute;
    width: 380px; height: 380px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.06);
    top: -80px; right: -80px;
  }
  .reg-left-ring {
    position: absolute; width: 260px; height: 260px;
    border-radius: 50%; border: 1px solid rgba(255,255,255,0.05);
    bottom: -60px; left: -60px;
  }
  .reg-left-content { position: relative; z-index: 1; text-align: center; max-width: 340px; }
  .reg-brand { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 36px; }
  .reg-brand-icon {
    width: 40px; height: 40px; background: rgba(255,255,255,0.12);
    border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;
  }
  .reg-brand-name { font-size: 1.35rem; font-weight: 800; color: white; letter-spacing: -0.5px; }
  .reg-illustration {
    width: 170px; height: 170px; background: rgba(255,255,255,0.08);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 4.2rem; margin: 0 auto 28px;
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 0 60px rgba(55,138,221,0.25);
  }
  .reg-left-title { font-size: 1.5rem; font-weight: 800; color: white; line-height: 1.3; margin-bottom: 12px; }
  .reg-left-sub { font-size: 0.87rem; color: rgba(255,255,255,0.60); line-height: 1.7; }
  .reg-left-pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 28px; }
  .reg-left-pill {
    background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.80); font-size: 0.72rem; font-weight: 600;
    padding: 5px 12px; border-radius: 20px; letter-spacing: 0.02em;
  }

  /* ── Right panel ── */
  .reg-right {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 56px; background: white; overflow-y: auto;
  }
  .reg-form-wrap { width: 100%; max-width: 460px; }

  /* ── Form header ── */
  .reg-eyebrow {
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--blue); margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
  }
  .reg-eyebrow::before {
    content: ''; width: 20px; height: 2px;
    background: var(--blue); border-radius: 2px; flex-shrink: 0;
  }
  .reg-title { font-size: 1.65rem; font-weight: 800; color: var(--navy); margin-bottom: 4px; letter-spacing: -0.5px; }
  .reg-subtitle { font-size: 0.84rem; color: var(--text-sub); margin-bottom: 28px; line-height: 1.6; }

  /* ── Section labels ── */
  .reg-section-label {
    font-size: 0.70rem; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase; color: var(--grey-400);
    display: flex; align-items: center; gap: 10px;
    margin: 18px 0 14px;
  }
  .reg-section-label::after { content: ''; flex: 1; height: 1px; background: var(--grey-200); }

  /* ── Rows / Groups ── */
  .reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .reg-group { margin-bottom: 14px; }
  .reg-label { display: block; font-size: 0.77rem; font-weight: 600; color: var(--navy); margin-bottom: 5px; letter-spacing: 0.02em; }
  .reg-label .req { color: var(--rose); margin-left: 2px; }

  /* ── Inputs ── */
  .reg-input, .reg-select {
    width: 100%; padding: 10px 13px;
    border: 1.5px solid var(--grey-200); border-radius: 8px;
    font-family: var(--font); font-size: 0.87rem; color: var(--navy);
    background: var(--grey-50); outline: none; appearance: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .reg-input::placeholder { color: var(--grey-400); }
  .reg-input:focus, .reg-select:focus {
    border-color: var(--blue); background: white;
    box-shadow: 0 0 0 3px rgba(21,101,192,0.10);
  }

  /* ── Input validation states ── */
  .reg-input.valid {
    border-color: #22c55e; background: rgba(34, 197, 94, 0.03);
  }
  .reg-input.invalid {
    border-color: var(--rose); background: rgba(212, 83, 126, 0.03);
  }
  .reg-input.valid:focus {
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
  }
  .reg-input.invalid:focus {
    box-shadow: 0 0 0 3px rgba(212, 83, 126, 0.15);
  }

  /* ── Validation feedback ── */
  .reg-feedback {
    font-size: 0.75rem; margin-top: 4px; display: flex; align-items: center; gap: 4px;
    line-height: 1.4; min-height: 18px;
  }
  .reg-feedback.success {
    color: #22c55e; font-weight: 500;
  }
  .reg-feedback.error {
    color: var(--rose); font-weight: 500;
  }
  .reg-feedback.info {
    color: var(--blue); font-weight: 500;
  }

  /* ── Password Strength Indicator ── */
  .pwd-strength-meter {
    margin-top: 8px; padding: 10px; background: var(--grey-100);
    border-radius: 6px; border: 1px solid var(--grey-200);
  }
  .pwd-strength-bar {
    height: 4px; background: var(--grey-200); border-radius: 2px;
    overflow: hidden; margin-bottom: 8px;
  }
  .pwd-strength-fill {
    height: 100%; width: 0%; transition: width 0.3s ease, background 0.3s ease;
  }
  .pwd-strength-fill.weak { background: #ef4444; width: 33%; }
  .pwd-strength-fill.fair { background: #f59e0b; width: 66%; }
  .pwd-strength-fill.strong { background: #22c55e; width: 100%; }
  
  .pwd-strength-label {
    font-size: 0.72rem; font-weight: 600;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 6px; letter-spacing: 0.3px;
  }
  .pwd-strength-text {
    padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 0.72rem;
    display: inline-block;
  }
  .pwd-strength-text.weak { background: rgba(239, 68, 68, 0.15); color: #991b1b; }
  .pwd-strength-text.fair { background: rgba(245, 158, 11, 0.15); color: #92400e; }
  .pwd-strength-text.strong { background: rgba(34, 197, 94, 0.15); color: #166534; }

  .pwd-requirements {
    font-size: 0.72rem; line-height: 1.5; margin-top: 6px;
  }
  .pwd-req-item {
    display: flex; align-items: center; gap: 6px; padding: 3px 0;
    color: var(--text-sub); transition: color 0.2s;
  }
  .pwd-req-item.met { color: #22c55e; font-weight: 500; }
  .pwd-req-item::before {
    content: '○'; font-weight: bold; font-size: 0.8rem;
  }
  .pwd-req-item.met::before {
    content: '✓'; color: inherit; font-size: 0.8rem;
  }

  /* ── Name Requirements ── */
  .name-requirements {
    font-size: 0.72rem; line-height: 1.5; margin-top: 6px;
    padding: 8px; background: var(--grey-100); border-radius: 6px;
    border: 1px solid var(--grey-200);
  }
  .name-req-item {
    display: flex; align-items: center; gap: 6px; padding: 3px 0;
    color: var(--text-sub); transition: color 0.2s;
  }
  .name-req-item.met { color: #22c55e; font-weight: 500; }
  .name-req-item::before {
    content: '○'; font-weight: bold; font-size: 0.8rem;
  }
  .name-req-item.met::before {
    content: '✓'; color: inherit; font-size: 0.8rem;
  }

  /* ── Error alert ── */
  .reg-alert {
    background: var(--rose-pale); border: 1px solid rgba(212,83,126,0.22);
    color: #7a2847; border-radius: 8px; padding: 11px 14px;
    font-size: 0.82rem; font-weight: 500;
    display: flex; align-items: flex-start; gap: 8px;
    margin-bottom: 18px; line-height: 1.5;
  }

  /* ── Submit button ── */
  .reg-btn {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
    color: white; border: none; border-radius: 8px;
    font-family: var(--font); font-size: 0.9rem; font-weight: 700;
    cursor: pointer; letter-spacing: 0.02em; margin-top: 8px;
    box-shadow: 0 4px 14px rgba(21,101,192,0.30);
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
  }
  .reg-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(21,101,192,0.40);
  }
  .reg-btn:disabled { opacity: 0.60; cursor: not-allowed; }

  /* ── Footer ── */
  .reg-footer { text-align: center; margin-top: 20px; font-size: 0.83rem; color: var(--text-sub); }
  .reg-footer a { color: var(--blue); font-weight: 600; text-decoration: none; }
  .reg-footer a:hover { text-decoration: underline; }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .reg-page { grid-template-columns: 1fr; }
    .reg-left  { display: none; }
    .reg-right { padding: 40px 28px; }
  }
  @media (max-width: 480px) {
    .reg-row { grid-template-columns: 1fr; }
    .reg-right { padding: 32px 20px; }
  }

  /* ── Success animation ── */
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }
`;

export default function Register() {
  const navigate = useNavigate();

  // ─── STEP STATE: Track whether we're on registration form or OTP verification ───
  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [email, setEmail] = useState(''); // Store email for OTP verification

  // ─── REGISTRATION FORM STATE ───
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    studentId: '', faculty: 'IT', academicYear: 'Year 1', semester: '1',
  });

  // Track validation state for each field
  const [validation, setValidation] = useState({
    fullName: null,
    studentId: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  // ─── OTP VERIFICATION STATE ───
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [testOTP, setTestOTP] = useState(''); // For testing when email fails

  // ─── COMMON STATE ───
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  /* ── Validation functions ── */
  const validateFullName = (name) => {
    if (!name.trim()) return { valid: false, msg: 'Full name is required' };
    if (!/^[a-zA-Z\s]+$/.test(name)) return { valid: false, msg: 'Name can only contain letters and spaces' };
    const words = name.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length < 2) return { valid: false, msg: 'Please enter First Name and Last Name (2 words)' };
    if (words[0].length < 2 || words[1].length < 2) return { valid: false, msg: 'Each name must be at least 2 characters' };
    return { valid: true, msg: '✓ Name format is correct' };
  };

  /* ── Calculate name requirements status ── */
  const calculateNameRequirements = (name) => {
    if (!name) return { 
      isLettersOnly: false, 
      hasTwoWords: false, 
      validLength: false,
      allMet: false 
    };
    
    return {
      isLettersOnly: /^[a-zA-Z\s]*$/.test(name),
      hasTwoWords: name.trim().split(/\s+/).filter(w => w.length > 0).length >= 2,
      validLength: name.trim().split(/\s+/).every(word => word.length >= 2),
      allMet: validateFullName(name).valid
    };
  };

  const validateStudentId = (id) => {
    if (!id.trim()) return { valid: false, msg: 'Student ID is required' };
    const upperID = id.trim().toUpperCase();
    if (!/^IT\d{8}$/.test(upperID)) 
      return { valid: false, msg: 'Format must be IT + 8 digits (e.g. IT21000000)' };
    return { valid: true, msg: '✓ Valid IT number' };
  };

  const validateEmail = (mail) => {
    if (!mail.trim()) return { valid: false, msg: 'Email is required' };
    if (!mail.toLowerCase().endsWith('@my.sliit.lk'))
      return { valid: false, msg: 'Must use @my.sliit.lk email' };
    if (!/^[a-zA-Z0-9._]+@my\.sliit\.lk$/.test(mail.toLowerCase()))
      return { valid: false, msg: 'Invalid email format' };
    return { valid: true, msg: '✓ Valid SLIIT email' };
  };

  const validatePassword = (pass) => {
    if (!pass) return { valid: false, msg: 'Password is required' };
    if (pass.length < 8) return { valid: false, msg: 'Min. 8 characters required' };
    if (!/[A-Z]/.test(pass)) return { valid: false, msg: 'Add at least one uppercase letter' };
    if (!/[0-9]/.test(pass)) return { valid: false, msg: 'Add at least one number' };
    return { valid: true, msg: '✓ Strong password' };
  };

  /* ── Calculate password strength (weak/fair/strong) ── */
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { strength: null, score: 0 };
    
    let score = 0;
    const checks = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };

    // Score points
    if (checks.length) score += 2;
    if (checks.uppercase) score += 1;
    if (checks.lowercase) score += 1;
    if (checks.number) score += 1;
    if (checks.special) score += 1;
    if (pass.length >= 12) score += 1;

    let strength = 'weak';
    if (score >= 5) strength = 'strong';
    else if (score >= 3) strength = 'fair';

    return { strength, score, checks };
  };

  const validateConfirmPassword = (confirm) => {
    if (!confirm) return { valid: false, msg: 'Please confirm your password' };
    if (confirm !== formData.password) return { valid: false, msg: 'Passwords do not match' };
    return { valid: true, msg: '✓ Passwords match' };
  };

  const validateOtp = (otpValue) => {
    if (!otpValue.trim()) return { valid: false, msg: 'OTP is required' };
    if (!/^\d{6}$/.test(otpValue.trim())) return { valid: false, msg: 'OTP must be 6 digits' };
    return { valid: true, msg: '' };
  };

  /* ── Auto-generate email from Student ID ── */
  const generateEmailFromStudentId = (studentId) => {
    const upperID = studentId.trim().toUpperCase();
    if (/^IT\d{8}$/.test(upperID)) {
      return upperID.toLowerCase() + '@my.sliit.lk';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    // Auto-generate email from student ID
    if (name === 'studentId') {
      const newEmail = generateEmailFromStudentId(value);
      if (newEmail) {
        newFormData.email = newEmail;
      }
    }

    setFormData(newFormData);
    setError('');

    // Real-time validation
    let validationResult = null;
    if (name === 'fullName') validationResult = validateFullName(value);
    else if (name === 'studentId') validationResult = validateStudentId(value);
    else if (name === 'email') validationResult = validateEmail(value);
    else if (name === 'password') validationResult = validatePassword(value);
    else if (name === 'confirmPassword') validationResult = validateConfirmPassword(value);

    if (validationResult) {
      setValidation({ ...validation, [name]: validationResult });
    }
  };

  // ─── REGISTRATION FORM SUBMIT ───
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields before submit
    const fullNameVal = validateFullName(formData.fullName);
    const studentIdVal = validateStudentId(formData.studentId);
    const emailVal = validateEmail(formData.email);
    const passwordVal = validatePassword(formData.password);
    const confirmVal = validateConfirmPassword(formData.confirmPassword);

    setValidation({
      fullName: fullNameVal,
      studentId: studentIdVal,
      email: emailVal,
      password: passwordVal,
      confirmPassword: confirmVal,
    });

    if (!fullNameVal.valid || !studentIdVal.valid || !emailVal.valid || !passwordVal.valid || !confirmVal.valid) {
      return setError('Please fix the errors above before registering.');
    }

    setLoading(true);
    try {
      console.log('📝 Submitting registration form...');
      
      const response = await axios.post('http://localhost:8000/User/register', {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        studentId: formData.studentId.trim().toUpperCase(),
        faculty: formData.faculty,
        academicYear: formData.academicYear,
        semester: Number(formData.semester),
      });

      console.log('✅ Registration successful!', response.data);

      // On successful registration, show OTP verification screen
      if (response.data.requiresOTP) {
        console.log('🔐 OTP verification required, showing verification form...');
        setEmail(formData.email.toLowerCase().trim());
        if (response.data.testOTP) {
          console.log('⚠️  Test OTP provided:', response.data.testOTP);
          setTestOTP(response.data.testOTP);
          setError('⚠️  Email configuration issue. For testing, use OTP: ' + response.data.testOTP);
        }
        setStep('otp');
        setOtp('');
        setOtpError('');
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Registration failed:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  // ─── OTP VERIFICATION SUBMIT ───
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');

    const otpValidation = validateOtp(otp);
    if (!otpValidation.valid) {
      setOtpError(otpValidation.msg);
      return;
    }

    setLoading(true);
    try {
      console.log('📧 Verifying OTP...', { email, otp });
      
      const response = await axios.post('http://localhost:8000/User/verify-email-otp', {
        email: email,
        otp: otp.trim(),
      });

      console.log('✅ OTP verification successful!', response.data);
      setShowSuccess(true);

      // Show success message for 2 seconds, then redirect
      setTimeout(() => {
        console.log('🔄 Navigating to login page...');
        navigate('/login', { 
          state: { 
            registered: true, 
            emailVerified: true,
            message: 'Email verified! You can now log in.'
          } 
        });
      }, 1500);
      
    } catch (err) {
      console.error('❌ OTP verification failed:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || err.message || 'OTP verification failed. Please try again.';
      setOtpError(errorMsg);
      setLoading(false);
    }
  };

  // ─── RESEND VERIFICATION EMAIL ───
  const handleResendOtp = async () => {
    setOtpError('');
    setResendLoading(true);
    try {
      await axios.post('http://localhost:8000/User/resend-verification-email', {
        email: email,
      });
      setOtpError(''); // Clear any errors
      alert('✅ Verification email sent again! Check your email for the new OTP.');
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  // ─── HANDLE GO BACK FROM OTP SCREEN ───
  const handleBackToForm = () => {
    setStep('form');
    setEmail('');
    setOtp('');
    setOtpError('');
  };

  return (
    <>
      <style>{styles}</style>

      <div className="reg-page">

        {/* ══════════════ LEFT PANEL ══════════════ */}
        <div className="reg-left">
          <div className="reg-left-ring" />
          <div className="reg-left-content">

            <div className="reg-brand">
              <div className="reg-brand-icon">🎓</div>
              <span className="reg-brand-name">UniShare</span>
            </div>

            <div className="reg-illustration">📚</div>

            <h2 className="reg-left-title">Join the SLIIT community</h2>
            <p className="reg-left-sub">
              Share notes, download resources, and collaborate with thousands
              of SLIIT students — all in one place.
            </p>

            <div className="reg-left-pills">
              <span className="reg-left-pill">📄 Notes</span>
              <span className="reg-left-pill">📝 Past Papers</span>
              <span className="reg-left-pill">🎥 Tutorials</span>
              <span className="reg-left-pill">💬 Discussions</span>
            </div>

          </div>
        </div>

        {/* ══════════════ RIGHT PANEL ══════════════ */}
        <div className="reg-right">
          <div className="reg-form-wrap">

            {/* ─────────────────────────────────────────── */}
            {/* REGISTRATION FORM (Step 1) */}
            {/* ─────────────────────────────────────────── */}
            {step === 'form' && (
              <>
                <p className="reg-eyebrow">Get started</p>
                <h1 className="reg-title">Create Account</h1>
                <p className="reg-subtitle">
                  SLIIT students only — use your <strong>@my.sliit.lk</strong> email to register
                </p>

                {error && (
                  <div className="reg-alert">
                    <span>⚠</span><span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>

                  {/* ── Personal Info ── */}
                  <p className="reg-section-label">Personal Info</p>

                  <div className="reg-group">
                    <label className="reg-label">Full Name <span className="req">*</span></label>
                    <input 
                      className={`reg-input ${validation.fullName?.valid ? 'valid' : validation.fullName?.valid === false ? 'invalid' : ''}`}
                      type="text" name="fullName" value={formData.fullName}
                      placeholder="e.g. Kavindu Perera" required onChange={handleChange} />
                    
                    {/* Name Requirements Checklist */}
                    {formData.fullName && (
                      <div className="name-requirements">
                        <div className={`name-req-item ${calculateNameRequirements(formData.fullName).isLettersOnly ? 'met' : ''}`}>
                          Letters and spaces only
                        </div>
                        <div className={`name-req-item ${calculateNameRequirements(formData.fullName).hasTwoWords ? 'met' : ''}`}>
                          Two words required (First & Last Name)
                        </div>
                        <div className={`name-req-item ${calculateNameRequirements(formData.fullName).validLength ? 'met' : ''}`}>
                          Each word at least 2 characters
                        </div>
                      </div>
                    )}

                    {validation.fullName && (
                      <div className={`reg-feedback ${validation.fullName.valid ? 'success' : 'error'}`}>
                        {validation.fullName.valid ? '✓' : '✕'} {validation.fullName.msg}
                      </div>
                    )}
                  </div>

                  <div className="reg-row">
                    <div className="reg-group">
                      <label className="reg-label">Student ID (Student Number) <span className="req">*</span></label>
                      <input 
                        className={`reg-input ${validation.studentId?.valid ? 'valid' : validation.studentId?.valid === false ? 'invalid' : ''}`}
                        type="text" name="studentId" value={formData.studentId}
                        placeholder="IT21000000" required onChange={handleChange} />
                      {validation.studentId && (
                        <div className={`reg-feedback ${validation.studentId.valid ? 'success' : 'error'}`}>
                          {validation.studentId.valid ? '✓' : '✕'} {validation.studentId.msg}
                        </div>
                      )}
                    </div>
                    <div className="reg-group">
                      <label className="reg-label">SLIIT Email <span className="req">*</span></label>
                      <input 
                        className={`reg-input ${validation.email?.valid ? 'valid' : validation.email?.valid === false ? 'invalid' : ''}`}
                        type="email" name="email" value={formData.email}
                        placeholder="it21xxxxxx@my.sliit.lk" required onChange={handleChange}
                        onBlur={(e) => {
                          let inputValue = e.target.value.trim();
                          
                          // If input doesn't contain @ and matches IT number pattern, auto-append domain
                          if (inputValue && !inputValue.includes('@')) {
                            if (/^it\d+$/i.test(inputValue)) {
                              inputValue = inputValue + '@my.sliit.lk';
                              const updatedFormData = { ...formData, email: inputValue };
                              setFormData(updatedFormData);
                              const validationResult = validateEmail(inputValue);
                              if (validationResult) {
                                setValidation(prev => ({ ...prev, email: validationResult }));
                              }
                            }
                          }
                        }}
                      />
                      {validation.email && (
                        <div className={`reg-feedback ${validation.email.valid ? 'success' : 'error'}`}>
                          {validation.email.valid ? '✓' : '✕'} {validation.email.msg}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Academic Info ── */}
                  <p className="reg-section-label">Academic Info</p>

                  <div className="reg-row">
                    <div className="reg-group">
                      <label className="reg-label">Faculty <span className="req">*</span></label>
                      <select className="reg-select" name="faculty" onChange={handleChange}>
                        <option value="IT">IT</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Business">Business</option>
                        <option value="Computing">Computing</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="reg-group">
                      <label className="reg-label">Academic Year <span className="req">*</span></label>
                      <select className="reg-select" name="academicYear" onChange={handleChange}>
                        <option value="Year 1">Year 1</option>
                        <option value="Year 2">Year 2</option>
                        <option value="Year 3">Year 3</option>
                        <option value="Year 4">Year 4</option>
                      </select>
                    </div>
                  </div>

                  <div className="reg-group" style={{ maxWidth: '48%', paddingRight: 0 }}>
                    <label className="reg-label">Semester <span className="req">*</span></label>
                    <select className="reg-select" name="semester" onChange={handleChange}>
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                    </select>
                  </div>

                  {/* ── Security ── */}
                  <p className="reg-section-label">Security</p>

                  <div className="reg-row">
                    <div className="reg-group">
                      <label className="reg-label">Password <span className="req">*</span></label>
                      <input 
                        className={`reg-input ${validation.password?.valid ? 'valid' : validation.password?.valid === false ? 'invalid' : ''}`}
                        type="password" name="password" value={formData.password}
                        placeholder="Min. 8 characters" required onChange={handleChange} />
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="pwd-strength-meter">
                          <div className="pwd-strength-bar">
                            <div className={`pwd-strength-fill ${calculatePasswordStrength(formData.password).strength}`}></div>
                          </div>
                          <div className="pwd-strength-label">
                            <span>Password Strength</span>
                            <span className={`pwd-strength-text ${calculatePasswordStrength(formData.password).strength}`}>
                              {calculatePasswordStrength(formData.password).strength?.toUpperCase() || 'N/A'}
                            </span>
                          </div>
                          <div className="pwd-requirements">
                            <div className={`pwd-req-item ${calculatePasswordStrength(formData.password).checks.length ? 'met' : ''}`}>
                              At least 8 characters
                            </div>
                            <div className={`pwd-req-item ${calculatePasswordStrength(formData.password).checks.uppercase ? 'met' : ''}`}>
                              One uppercase letter (A-Z)
                            </div>
                            <div className={`pwd-req-item ${calculatePasswordStrength(formData.password).checks.number ? 'met' : ''}`}>
                              One number (0-9)
                            </div>
                            <div className={`pwd-req-item ${calculatePasswordStrength(formData.password).checks.lowercase ? 'met' : ''}`}>
                              One lowercase letter (a-z)
                            </div>
                            <div className={`pwd-req-item ${calculatePasswordStrength(formData.password).checks.special ? 'met' : ''}`}>
                              One special character (!@#$%^&*...)
                            </div>
                          </div>
                        </div>
                      )}

                      {validation.password && (
                        <div className={`reg-feedback ${validation.password.valid ? 'success' : 'error'}`}>
                          {validation.password.valid ? '✓' : '✕'} {validation.password.msg}
                        </div>
                      )}
                    </div>
                    <div className="reg-group">
                      <label className="reg-label">Confirm Password <span className="req">*</span></label>
                      <input 
                        className={`reg-input ${validation.confirmPassword?.valid ? 'valid' : validation.confirmPassword?.valid === false ? 'invalid' : ''}`}
                        type="password" name="confirmPassword" value={formData.confirmPassword}
                        placeholder="Re-enter password" required onChange={handleChange} />
                      {validation.confirmPassword && (
                        <div className={`reg-feedback ${validation.confirmPassword.valid ? 'success' : 'error'}`}>
                          {validation.confirmPassword.valid ? '✓' : '✕'} {validation.confirmPassword.msg}
                        </div>
                      )}
                    </div>
                  </div>

                  <button className="reg-btn" type="submit" disabled={loading}>
                    {loading ? 'Creating Account…' : 'Create My Account →'}
                  </button>

                </form>

                <p className="reg-footer">
                  Already have an account? <Link to="/login">Sign in</Link>
                </p>
              </>
            )}

            {/* ─────────────────────────────────────────── */}
            {/* EMAIL VERIFICATION (Step 2) */}
            {/* ─────────────────────────────────────────── */}
            {step === 'otp' && (
              <>
                <p className="reg-eyebrow">Final Step</p>
                <h1 className="reg-title">Verify Email</h1>
                <p className="reg-subtitle">
                  We've sent a 6-digit code to <strong>{email}</strong>
                </p>

                {showSuccess && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    color: '#166534',
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '18px',
                    animation: 'fadeInOut 1.5s ease-in-out'
                  }}>
                    <span>✅</span>
                    <span>Email verified successfully! Redirecting to login...</span>
                  </div>
                )}

                {otpError && !showSuccess && (
                  <div className="reg-alert">
                    <span>⚠</span><span>{otpError}</span>
                  </div>
                )}

                {testOTP && !showSuccess && (
                  <div style={{
                    background: '#fef3c7',
                    border: '1px solid #fcd34d',
                    color: '#92400e',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    justifyContent: 'space-between'
                  }}>
                    <span>🔧 Test OTP: <code style={{ fontWeight: '700', fontSize: '0.9rem', letterSpacing: '2px' }}>{testOTP}</code></span>
                    <button
                      onClick={() => setOtp(testOTP)}
                      style={{
                        background: '#fbbf24',
                        border: 'none',
                        color: '#78350f',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Use
                    </button>
                  </div>
                )}

                {!showSuccess && (
                  <>
                    <form onSubmit={handleOtpSubmit} noValidate>

                      <div className="reg-group">
                        <label className="reg-label">Enter OTP Code <span className="req">*</span></label>
                        <input 
                          className={`reg-input ${otp && /^\d{6}$/.test(otp) ? 'valid' : ''}`}
                          type="text" 
                          inputMode="numeric"
                          maxLength="6"
                          value={otp}
                          placeholder="000000"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setOtp(value);
                            setOtpError('');
                          }}
                          required
                          disabled={loading}
                        />
                        <div className="reg-feedback info" style={{ marginTop: '8px' }}>
                          ⏱️ OTP expires in 5 minutes
                        </div>
                      </div>

                      <button className="reg-btn" type="submit" disabled={loading}>
                        {loading ? 'Verifying…' : 'Verify Email & Complete Registration →'}
                      </button>

                    </form>

                    {/* Resend OTP section */}
                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--grey-200)', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.83rem', color: 'var(--text-sub)', marginBottom: '12px' }}>
                        Didn't receive the code?
                      </p>
                      <button
                        onClick={handleResendOtp}
                        disabled={resendLoading}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--blue)',
                          fontSize: '0.87rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          opacity: resendLoading ? 0.6 : 1,
                        }}
                      >
                        {resendLoading ? 'Sending...' : 'Resend OTP'}
                      </button>
                    </div>

                    {/* Back button */}
                    <p className="reg-footer" style={{ marginTop: '20px' }}>
                      <button
                        onClick={handleBackToForm}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--blue)',
                          fontSize: '0.83rem',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        ← Back to registration
                      </button>
                    </p>
                  </>
                )}
              </>
            )}

          </div>
        </div>

      </div>
    </>
  );
}