import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ConsumptionRecords = () => {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [formData, setFormData] = useState({
    meterId: '',
    timestamp: '',
    volumeUsed: ''
  });
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = useCallback(async () => {
    try {
      let url = 'http://localhost:5000/api/consumption-records';
      if (selectedUserId) {
        url += `?userId=${selectedUserId}`;
      }
      const response = await axios.get(url);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching consumption records:', error);
    }
  }, [selectedUserId]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleUserChange = async (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    setFormData(prev => ({ ...prev, meterId: '' }));
    if (userId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/water-meters?userId=${userId}`);
        setMeters(response.data);
      } catch (error) {
        setMeters([]);
      }
    } else {
      setMeters([]);
    }
  };

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
    if (!selectedUserId) {
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
        userId: selectedUserId,
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
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Add New Record</h5>
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
                  <div className="form-text">Only meters registered to the selected user are shown.</div>
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

        <div className="col-md-8">
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
