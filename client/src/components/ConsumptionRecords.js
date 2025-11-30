import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ConsumptionRecords = () => {
  const [records, setRecords] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    meterId: '',
    timestamp: '',
    volumeUsed: ''
  });
  const [meters, setMeters] = useState([]);
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

  const fetchRecords = useCallback(async () => {
    if (!user) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/consumption-records?userId=${user.user_id}`);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching consumption records:', error);
    }
  }, [user]);

  const fetchMeters = useCallback(async () => {
    if (!user) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/water-meters?userId=${user.user_id}`);
      setMeters(response.data);
    } catch (error) {
      console.error('Error fetching water meters:', error);
      setMeters([]);
    }
  }, [user]);

  useEffect(() => {
    fetchRecords();
    fetchMeters();
  }, [fetchRecords, fetchMeters]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Accept any non-empty meter ID string (numeric or alphanumeric)
  const isValidMeterId = (meterId) => {
    return typeof meterId === 'string' && meterId.trim() !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setLoading(false);
      return;
    }
    if (!formData.meterId) {
      setLoading(false);
      return;
    }

    // Validate meter ID format or existence
    if (!isValidMeterId(formData.meterId)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/consumption-records', {
        userId: user.user_id,
        meterId: formData.meterId,
        timestamp: formData.timestamp,
        volumeUsed: formData.volumeUsed
      });
      setFormData({
        meterId: '',
        timestamp: '',
        volumeUsed: ''
      });
      fetchRecords();
    } catch (error) {
      if (error.response) {
        console.error('Error adding consumption record:', error.response.data);
      } else {
        console.error('Error adding consumption record:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Consumption Records Management</h2>

      <div className="row">
        {!isAdmin && (
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5>Add New Record</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Select Meter Number</label>
                    <select
                      className="form-control"
                      name="meterId"
                      value={formData.meterId}
                      onChange={handleInputChange}
                      required
                      disabled={!meters.length}
                    >
                      <option value="">-- Select Meter --</option>
                      {meters.map((meter) => (
                        <option key={meter[1]} value={meter[1]}>
                          {meter[1]}
                        </option>
                      ))}
                    </select>
                    <div className="form-text">Only meters registered to you are shown.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Timestamp</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="timestamp"
                      value={formData.timestamp}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Volume Used</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="volumeUsed"
                      value={formData.volumeUsed}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Record'}
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
              <p>Admins cannot add consumption records. Use the Admin Dashboard to view user entries.</p>
            </div>
          </div>
        )}

        <div className={`col-md-${isAdmin ? '12' : '8'}`}>
          <div className="card">
            <div className="card-header">
              <h5>Consumption Records List</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      {/* ID column removed */}
                      <th>Meter ID</th>
                      <th>Date</th>
                      <th>Consumption</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <tr key={index}>
                        {/* <td>{record[0]}</td> ID removed */}
                        <td>{record[0]}</td>
                        <td>{record[1]}</td>
                        <td>{record[2]}</td>
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

export default ConsumptionRecords;
