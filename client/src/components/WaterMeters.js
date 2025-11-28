import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const WaterMeters = () => {
  const [meters, setMeters] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    location: '',
    installationDate: ''
  });
  const [loading, setLoading] = useState(false);

  // Check if user is admin
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    // Get logged-in user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchMeters = useCallback(async () => {
    if (!user) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/water-meters?userId=${user.user_id}`);
      setMeters(response.data);
    } catch (error) {
      console.error('Error fetching water meters:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchMeters();
  }, [fetchMeters]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/water-meters', {
        userId: user.user_id,
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
        {!isAdmin && (
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5>Add New Water Meter</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
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
        )}

        {isAdmin && (
          <div className="col-md-12">
            <div className="alert alert-info">
              <h5>Admin Access Restricted</h5>
              <p>Admins cannot add water meters. Use the Admin Dashboard to view user entries.</p>
            </div>
          </div>
        )}

        <div className={`col-md-${isAdmin ? '12' : '8'}`}>
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
