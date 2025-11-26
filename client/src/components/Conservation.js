import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Conservation = () => {
  // Conservation Methods Management
  const [methods, setMethods] = useState([]);
  const [methodFormData, setMethodFormData] = useState({
    methodName: '',
    description: '',
    cost: '',
    efficiencyRating: ''
  });
  const [methodLoading, setMethodLoading] = useState(false);

  // Implementation Records Management
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [recordFormData, setRecordFormData] = useState({
    methodId: '',
    dateImplemented: '',
    status: 'active',
    savingsAchieved: ''
  });
  const [recordLoading, setRecordLoading] = useState(false);

  // Fetch methods
  const fetchMethods = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/conservation-methods');
      console.log('Fetched conservation methods:', response.data); // Debug log
      if (Array.isArray(response.data)) {
        setMethods(response.data);
      } else {
        console.warn('Expected array for conservation methods but got:', response.data);
        setMethods([]);
      }
    } catch (error) {
      console.error('Error fetching conservation methods:', error);
      setMethods([]);
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    try {
      let url = 'http://localhost:5000/api/implementation-records';
      if (selectedUserId) {
        url += `?userId=${selectedUserId}`;
      }
      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        // Map values to match UI rendering keys if needed
        const mappedRecords = response.data.map(record => ({
          ...record,
          user_name: record.name, // fix: use record.name directly as it is a string not array
          method_name: record.method_name, // fix: use record.method_name directly
          date_implemented: record.date_implemented ? record.date_implemented.slice(0, 10) : '',
          savings_achieved: record.savings_achieved
        }));
        setRecords(mappedRecords);
      } else {
        console.warn('Received implementation records data is not an array:', response.data);
        setRecords([]);
      }
    } catch (error) {
      console.error('Error fetching implementation records:', error);
      setRecords([]);
    }
  }, [selectedUserId]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.warn('Received users data is not an array:', response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchMethods();
    fetchUsers();
  }, [fetchMethods]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Conservation Methods Handlers
  const handleMethodInputChange = (e) => {
    setMethodFormData({
      ...methodFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleMethodSubmit = async (e) => {
    e.preventDefault();
    if (!methodFormData.methodName || !methodFormData.description || !methodFormData.cost || !methodFormData.efficiencyRating) {
      return;
    }
    setMethodLoading(true);
    try {
      await axios.post('http://localhost:5000/api/conservation-methods', methodFormData);
      setMethodFormData({
        methodName: '',
        description: '',
        cost: '',
        efficiencyRating: ''
      });
      fetchMethods();
    } catch (error) {
      console.error('Error adding conservation method:', error);
    } finally {
      setMethodLoading(false);
    }
  };

  // Implementation Records Handlers
  const handleRecordInputChange = (e) => {
    setRecordFormData({
      ...recordFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !recordFormData.methodId || !recordFormData.dateImplemented || !recordFormData.savingsAchieved) {
      return;
    }
    setRecordLoading(true);
    try {
      // Format dateImplemented as YYYY-MM-DD string to match Oracle DATE format
      const formattedDateImplemented = new Date(recordFormData.dateImplemented).toISOString().slice(0, 10);
      await axios.post('http://localhost:5000/api/implementation-records', {
        userId: selectedUserId,
        methodId: recordFormData.methodId,
        dateImplemented: formattedDateImplemented,
        status: recordFormData.status,
        savingsAchieved: recordFormData.savingsAchieved
      });
      setRecordFormData({
        methodId: '',
        dateImplemented: '',
        status: 'active',
        savingsAchieved: ''
      });
      fetchRecords();
    } catch (error) {
      console.error('Error adding implementation record:', error);
    } finally {
      setRecordLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Conservation Management</h2>

      {/* Conservation Methods Section */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header conservation-header" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)', color: '#0284c7' }}>
              <h3 style={{ margin: 0 }}>Conservation Methods</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-40">
          <div className="card">
            <div className="card-header">
              <h5>Add New Method</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleMethodSubmit}>
                <div className="mb-3">
                  <label className="form-label">Method Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="methodName"
                    value={methodFormData.methodName}
                    onChange={handleMethodInputChange}
                    placeholder="Enter method name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={methodFormData.description}
                    onChange={handleMethodInputChange}
                    placeholder="Describe the conservation method"
                    rows="3"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="cost"
                    value={methodFormData.cost}
                    onChange={handleMethodInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Efficiency Rating (1-5)</label>
                  <select
                    className="form-control"
                    name="efficiencyRating"
                    value={methodFormData.efficiencyRating}
                    onChange={handleMethodInputChange}
                    required
                  >
                    <option value="">-- Select Rating --</option>
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Below Average</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Above Average</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={methodLoading}>
                  {methodLoading ? 'Adding...' : 'Add Method'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-60">
          <div className="card">
            <div className="card-header">
              <h5>Conservation Methods List</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Method Name</th>
                      <th>Description</th>
                      <th>Cost</th>
                      <th>Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(methods) && methods.map((method) => (
                      <tr key={method.method_id}>
                        <td>{method.method_name}</td>
                        <td>{method.description}</td>
                        <td>${method.cost}</td>
                        <td>{method.efficiency_rating}/5 ⭐</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Records Section */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header conservation-header" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', color: '#22c55e' }}>
              <h3 style={{ margin: 0 }}>Implementation Records</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-40">
          <div className="card">
            <div className="card-header">
              <h5>Record Implementation</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleRecordSubmit}>
                <div className="mb-3">
                  <label className="form-label">Select User</label>
                  <select
                    className="form-control"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
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
                  <label className="form-label">Conservation Method</label>
                  <select
                    className="form-control"
                    name="methodId"
                    value={recordFormData.methodId}
                    onChange={handleRecordInputChange}
                    required
                    disabled={methods.length === 0}
                  >
                    <option value="">-- Select Method --</option>
                  {methods.filter(m => m.method_name && m.method_name.trim() !== '').map((method) => (
                    <option key={method.method_id} value={method.method_id}>
                      {method.method_name}
                    </option>
                  ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Date Implemented</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateImplemented"
                    value={recordFormData.dateImplemented}
                    onChange={handleRecordInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    name="status"
                    value={recordFormData.status}
                    onChange={handleRecordInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Savings Achieved (liters/month)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="savingsAchieved"
                    value={recordFormData.savingsAchieved}
                    onChange={handleRecordInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={recordLoading}>
                  {recordLoading ? 'Recording...' : 'Record Implementation'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-60">
          <div className="card">
            <div className="card-header">
              <h5>Implementation Records List</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Method</th>
                      <th>Date Implemented</th>
                      <th>Status</th>
                      <th>Savings (L/month)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <tr key={index}>
                        <td>{record.user_name}</td>
                        <td>{record.method_name}</td>
                        <td>{record.date_implemented}</td>
                        <td>
                          <span className={`badge ${record.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                            {record.status}
                          </span>
                        </td>
                        <td>{record.savings_achieved}</td>
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

export default Conservation;
