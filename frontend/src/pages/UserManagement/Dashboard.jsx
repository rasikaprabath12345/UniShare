import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page-container">
      <div className="dashboard-card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
          <h2 className="page-title" style={{margin: 0}}>Hello, {user.fullName} 👋</h2>
          <button onClick={handleLogout} className="btn-danger">Logout</button>
        </div>
        
        <p style={{color: '#666', marginBottom: '30px'}}>Welcome to your UniShare Dashboard. What would you like to do today?</p>

        <div className="form-row">
          <Link to="/profile" className="btn-primary btn-secondary" style={{textDecoration: 'none'}}>My Profile</Link>
          <Link to="/library" className="btn-primary" style={{textDecoration: 'none'}}>Browse Library</Link>
          {user.role === 'admin' && (
            <Link to="/admin/users" className="btn-primary" style={{background: '#0d2257', textDecoration: 'none'}}>Manage Users</Link>
          )}
        </div>
      </div>
    </div>
  );
}