import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const WaterSources = () => {
  const [sources, setSources] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [formData, setFormData] = useState({
    userId: '',
    type: 'Groundwater',
    capacity: '',
    location: '',
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

  const fetchSources = useCallback(async () => {
    try {
      let url = 'http://localhost:5000/api/water-sources';
      if (selectedUserId) {
        url += `?userId=${selectedUserId}`;
      }
      const response = await axios.get(url);
      setSources(response.data);
    } catch (error) {
      console.error('Error fetching water sources:', error);
    }
  }, [selectedUserId]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    setFormData((prev) => ({
      ...prev,
      userId: userId,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      if (!formData.userId || !formData.type || !formData.capacity || !formData.location) {
        setLoading(false);
        return;
      }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/water-sources', formData);
      setFormData({
        userId: '',
        name: '',
        type: 'Groundwater',
        capacity: '',
        location: '',
      });
      setSelectedUserId('');
      fetchSources();
    } catch (error) {
      console.error('Error adding water source:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Water Sources Management</h2>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Add New Water Source</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Select User</label>
                  <select
                    className="form-control"
                    name="userId"
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
                {/* Name field removed */}
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select
                    className="form-control"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="Groundwater">Groundwater</option>
                    <option value="Municipal">Municipal</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  />
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

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Source'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Water Sources List</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      {/* ID and Name columns removed */}
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source, index) => (
                  <tr key={index}>
                    {/* <td>{source[0]}</td> Name removed */}
                    <td>{source.TYPE}</td>
                    <td>{source.CAPACITY}</td>
                    <td>{source.LOCATION}</td>
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

export default WaterSources;
