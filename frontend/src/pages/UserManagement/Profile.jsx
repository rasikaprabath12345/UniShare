import { Link } from 'react-router-dom';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="page-container">
      <div className="auth-card">
        <h2 className="page-title">My Profile</h2>
        <div style={{margin: '30px 0', lineHeight: '2'}}>
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Student ID:</strong> {user.studentId}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Faculty:</strong> {user.faculty}</p>
          <p><strong>Academic Year:</strong> {user.academicYear}</p>
        </div>
        
        <div className="form-row">
          <Link to="/edit-profile" className="btn-primary" style={{textDecoration: 'none'}}>Edit Profile</Link>
          <Link to="/change-password" className="btn-primary btn-secondary" style={{textDecoration: 'none'}}>Change Password</Link>
        </div>
      </div>
    </div>
  );
}