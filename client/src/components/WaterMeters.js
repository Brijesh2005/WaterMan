import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const WaterMeters = () => {
  const [meters, setMeters] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [formData, setFormData] = useState({
    location: '',
    installationDate: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMeters = useCallback(async () => {
    try {
      let url = 'http://localhost:5000/api/water-meters';
      if (selectedUserId) {
        url += `?userId=${selectedUserId}`;
      }
      const response = await axios.get(url);
      setMeters(response.data);
    } catch (error) {
      console.error('Error fetching water meters:', error);
    }
  }, [selectedUserId]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMeters();
  }, [fetchMeters]);

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/water-meters', {
        userId: selectedUserId,
        location: formData.location,
        installationDate: formData.installationDate
      });
      setFormData({
        location: '',
        installationDate: ''
      });
      fetchMeters();
    } catch (error) {
      console.error('Error adding water meter:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Water Meters Management</h2>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Add New Water Meter</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Select User</label>
                  <select
                    className="form-control"
                    value={selectedUserId}
                    onChange={handleUserChange}
                    required
                  >
                    <option value="">-- Select User --</option>
                    {users.map((user) => (
                      <option key={user[0]} value={user[0]}>
                        {user[1]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Installation Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="installationDate"
                    value={formData.installationDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Water Meter'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Water Meters List</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      {/* ID column removed */}
                      <th>User ID</th>
                      <th>Meter Number</th>
                      <th>Location</th>
                      <th>Installation Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meters.map((meter, index) => (
                      <tr key={index}>
                        {/* <td>{meter[0]}</td> ID removed */}
                        <td>{meter[0]}</td>
                        <td>{meter[1]}</td>
                        <td>{meter[2]}</td>
                        <td>{meter[3]}</td>
                        <td>{meter[4]}</td>
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

export default WaterMeters;
