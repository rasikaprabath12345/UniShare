import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', studentId: '', faculty: '', academicYear: '', semester: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    // Load existing user data from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || {};
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      studentId: user.studentId || '',
      faculty: user.faculty || 'IT',
      academicYear: user.academicYear || 'Year 1',
      semester: user.semester || '1'
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:8000/api/users/profile', 
        { 
          fullName: formData.fullName, 
          faculty: formData.faculty, 
          academicYear: formData.academicYear, 
          semester: formData.semester 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local storage with new data
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Update failed', type: 'error' });
    }
  };

  return (
    <div className="page-container">
      <div className="auth-card">
        <h2 className="page-title">Edit Profile</h2>
        <p className="page-subtitle">Update your academic details</p>

        {message.text && (
          <div className="error-msg" style={{ color: message.type === 'success' ? 'green' : '#d32f2f', marginBottom: '15px' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} className="form-control" required onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Student ID (Cannot be changed)</label>
              <input type="text" value={formData.studentId} className="form-control" disabled style={{ background: '#f4f7ff', color: '#888' }} />
            </div>
            <div className="form-group">
              <label>SLIIT Email (Cannot be changed)</label>
              <input type="email" value={formData.email} className="form-control" disabled style={{ background: '#f4f7ff', color: '#888' }} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Faculty</label>
              <select name="faculty" value={formData.faculty} className="form-control" onChange={handleChange}>
                <option value="IT">IT</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Computing">Computing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Academic Year</label>
              <select name="academicYear" value={formData.academicYear} className="form-control" onChange={handleChange}>
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Semester</label>
            <select name="semester" value={formData.semester} className="form-control" onChange={handleChange}>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>

          <div className="form-row">
            <button type="button" onClick={() => navigate('/profile')} className="btn-primary btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}