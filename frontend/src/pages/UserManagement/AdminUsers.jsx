import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(u => u._id !== id));
      } catch(err) { console.error(err); }
    }
  };

  return (
    <div className="page-container">
      <div className="dashboard-card" style={{maxWidth: '1000px'}}>
        <h2 className="page-title" style={{textAlign: 'left'}}>User Management</h2>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Faculty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td><b>{user.studentId}</b></td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.faculty}</td>
                  <td>
                    <span style={{color: user.isActive ? 'green' : 'red', fontWeight: 'bold'}}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}