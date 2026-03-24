import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setMessage({ text: 'New passwords do not match', type: 'error' });
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8000/api/users/change-password', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ text: 'Password changed successfully!', type: 'success' });
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to change password', type: 'error' });
    }
  };

  return (
    <div className="page-container">
      <div className="auth-card" style={{ maxWidth: '400px' }}>
        <h2 className="page-title">Change Password</h2>
        
        {message.text && (
          <div className="error-msg" style={{ color: message.type === 'success' ? 'green' : '#d32f2f', marginBottom: '15px' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" name="currentPassword" value={formData.currentPassword} className="form-control" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" name="newPassword" value={formData.newPassword} className="form-control" required minLength="8" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} className="form-control" required minLength="8" onChange={handleChange} />
          </div>

          <div className="form-row">
            <button type="button" onClick={() => navigate('/profile')} className="btn-primary btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}