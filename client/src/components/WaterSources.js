import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const WaterSources = ({ user }) => {
  const [sources, setSources] = useState([]);
  const [formData, setFormData] = useState({
    userId: user ? user.user_id : '',
    type: 'Groundwater',
    capacity: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check if user is admin
  const isAdmin = user && user.role === 'admin';

  const fetchSources = useCallback(async () => {
    try {
      let url = 'http://localhost:5000/api/water-sources';
      if (user && user.user_id) {
        url += `?userId=${user.user_id}`;
      }
      const response = await axios.get(url);
      setSources(response.data);
    } catch (error) {
      console.error('Error fetching water sources:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        userId: user.user_id,
      }));
      fetchSources();
    }
  }, [user, fetchSources]);

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
      setMessage('All fields are required');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/water-sources', formData);
      setMessage('Water source added successfully');
      setFormData({
        userId: user ? user.user_id : '',
        type: 'Groundwater',
        capacity: '',
        location: '',
      });
      fetchSources();
    } catch (error) {
      console.error('Error adding water source:', error);
      setMessage('Failed to add water source. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Water Sources Management</h2>

      <div className="row">
        {!isAdmin && (
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5>Add New Water Source</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
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
                {message && (
                  <div className={`alert mt-3 ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="col-md-12">
            <div className="alert alert-info">
              <h5>Admin Access Restricted</h5>
              <p>Admins cannot add water sources. Use the Admin Dashboard to view user entries.</p>
            </div>
          </div>
        )}

        <div className={`col-md-${isAdmin ? '12' : '8'}`}>
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
