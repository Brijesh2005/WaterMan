import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [formData, setFormData] = useState({
    periodStart: '',
    periodEnd: '',
    totalUsage: '',
    amountDue: '',
    paymentStatus: 'Pending'
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

  const fetchBills = useCallback(async () => {
    try {
      let url = 'http://localhost:5000/api/billing';
      if (selectedUserId) {
        url += `?userId=${selectedUserId}`;
      }
      const response = await axios.get(url);
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching billing records:', error);
    }
  }, [selectedUserId]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

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
      await axios.post('http://localhost:5000/api/billing', {
        userId: selectedUserId,
        periodStart: formData.periodStart,
        periodEnd: formData.periodEnd,
        totalUsage: formData.totalUsage,
        amountDue: formData.amountDue,
        paymentStatus: formData.paymentStatus
      });
      setFormData({
        periodStart: '',
        periodEnd: '',
        totalUsage: '',
        amountDue: '',
        paymentStatus: 'Pending'
      });
      fetchBills();
    } catch (error) {
      console.error('Error adding billing record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Billing Management</h2>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Add New Bill</h5>
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
                  <label className="form-label">Period Start</label>
                  <input
                    type="date"
                    className="form-control"
                    name="periodStart"
                    value={formData.periodStart}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Period End</label>
                  <input
                    type="date"
                    className="form-control"
                    name="periodEnd"
                    value={formData.periodEnd}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Usage</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="totalUsage"
                    value={formData.totalUsage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Amount Due</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="amountDue"
                    value={formData.amountDue}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Payment Status</label>
                  <select
                    className="form-control"
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleInputChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Bill'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Billing Records List</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      {/* ID column removed */}
                      <th>User ID</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Date Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((bill, index) => (
                      <tr key={index}>
                        {/* <td>{bill[0]}</td> ID removed */}
                        <td>{bill[0]}</td>
                        <td>{bill[1]}</td>
                        <td>{bill[2]}</td>
                        <td>{bill[3]}</td>
                        <td>{bill[4]}</td>
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

export default Billing;
