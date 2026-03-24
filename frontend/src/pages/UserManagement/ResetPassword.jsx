import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams(); // URL eken token eka gannawa
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setMessage({ text: 'Passwords do not match', type: 'error' });
    }

    try {
      await axios.post(`http://localhost:8000/api/users/reset-password/${token}`, { password: formData.newPassword });
      setMessage({ text: 'Password has been reset successfully!', type: 'success' });
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Invalid or expired token', type: 'error' });
    }
  };

  return (
    <div className="page-container">
      <div className="auth-card" style={{ maxWidth: '400px' }}>
        <h2 className="page-title">Create New Password</h2>

        {message.text && (
          <div className="error-msg" style={{ color: message.type === 'success' ? 'green' : '#d32f2f', marginBottom: '15px' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" name="newPassword" value={formData.newPassword} className="form-control" required minLength="8" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} className="form-control" required minLength="8" onChange={handleChange} />
          </div>

          <button type="submit" className="btn-primary">Save New Password</button>
        </form>
      </div>
    </div>
  );
}