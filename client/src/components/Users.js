import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers(true); // Initial fetch with cache busting
    // Temporarily disable auto refresh polling for debugging
    // const intervalId = setInterval(() => {
    //   fetchUsers(true); // Poll every 5 seconds with cache busting
    // }, 5000); 

    // return () => clearInterval(intervalId);
  }, []);

  const fetchUsers = async (cacheBuster) => {
    try {
      let url = 'http://localhost:5000/api/users';
      if (cacheBuster) {
        url += `?cb=${new Date().getTime()}`;
      }
      const response = await axios.get(url, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      console.log('Fetched users:', response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users', formData);
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: ''
      });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Users Management</h2>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Add New User</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add User'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Users List</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user[0]}</td>
                    <td>{user[1]}</td>
                    <td>{user[2]}</td>
                    <td>{user[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
