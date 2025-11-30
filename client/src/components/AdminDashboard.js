import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('water-sources');
  const [data, setData] = useState({
    waterSources: [],
    consumptionRecords: [],
    waterMeters: [],
    billing: [],
    implementationRecords: [],
    users: [],
    conservationMethods: [],
    waterSavings: []
  });
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMethod, setNewMethod] = useState({
    methodName: '',
    description: '',
    cost: '',
    efficiencyRating: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const adminHeaders = { headers: { 'x-user-role': 'admin' } };
      const [waterSourcesRes, consumptionRecordsRes, waterMetersRes, billingRes, implementationRecordsRes, usersRes, conservationMethodsRes, waterSavingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/water-sources', adminHeaders),
        axios.get('http://localhost:5000/api/consumption-records', adminHeaders),
        axios.get('http://localhost:5000/api/water-meters', adminHeaders),
        axios.get('http://localhost:5000/api/billing', adminHeaders),
        axios.get('http://localhost:5000/api/implementation-records', adminHeaders),
        axios.get('http://localhost:5000/api/users', adminHeaders),
        axios.get('http://localhost:5000/api/conservation-methods', adminHeaders),
        axios.get('http://localhost:5000/api/water-savings', adminHeaders)
      ]);

      setData({
        waterSources: (waterSourcesRes.data || []).map(source => ({
          USER_ID: source.USER_ID,
          TYPE: source.TYPE,
          CAPACITY: source.CAPACITY,
          LOCATION: source.LOCATION
        })),
        consumptionRecords: (consumptionRecordsRes.data || []).map(record => ({
          USER_ID: record[0],
          WATER_METER_NUMBER: record[1],
          CONSUMPTION_DATE: record[2],
          CONSUMPTION: record[3]
        })),
        waterMeters: (waterMetersRes.data || []).map(meter => ({
          USER_ID: meter[0],
          METER_NUMBER: meter[1],
          LOCATION: meter[2],
          INSTALLATION_DATE: meter[3],
          STATUS: meter[4]
        })),
        billing: (billingRes.data || []).map(bill => ({
          USER_ID: bill[0],
          PERIOD_START: bill[1],
          PERIOD_END: bill[2],
          TOTAL_USAGE: bill[3],
          AMOUNT_DUE: bill[4],
          PAYMENT_STATUS: bill[5]
        })),
        implementationRecords: (implementationRecordsRes.data || []).map(record => ({
          USER_ID: record.user_id,
          METHOD_ID: record.method_id,
          DATE_IMPLEMENTED: record.date_implemented,
          STATUS: record.status,
          SAVINGS_ACHIEVED: record.savings_achieved
        })),
        users: (usersRes.data || []).map(user => ({
          USER_ID: user.USER_ID,
          NAME: user.NAME,
          ADDRESS: user.ADDRESS,
          PHONE: user.PHONE,
          EMAIL: user.EMAIL
        })),
        conservationMethods: conservationMethodsRes.data || [],
        waterSavings: waterSavingsRes.data || []
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddConservationMethod = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/conservation-methods', {
        methodName: newMethod.methodName,
        description: newMethod.description,
        cost: newMethod.cost,
        efficiencyRating: newMethod.efficiencyRating
      }, {
        headers: { 'x-user-role': 'admin' }
      });

      alert('Conservation method added successfully!');
      setNewMethod({
        methodName: '',
        description: '',
        cost: '',
        efficiencyRating: ''
      });
      setShowAddForm(false);
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error adding conservation method:', error);
      alert('Error adding conservation method: ' + (error.response?.data?.error || error.message));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'water-sources':
        return (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {data.waterSources.map((source, index) => (
                  <tr key={index}>
                    <td>{source.USER_ID}</td>
                    <td>{source.TYPE}</td>
                    <td>{source.CAPACITY}</td>
                    <td>{source.LOCATION}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'consumption-records':
        return (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Meter Number</th>
                  <th>Consumption</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.consumptionRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{record.USER_ID}</td>
                    <td>{record.WATER_METER_NUMBER}</td>
                    <td>{record.CONSUMPTION}</td>
                    <td>{record.CONSUMPTION_DATE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'water-meters':
        return (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Meter Number</th>
                  <th>Location</th>
                  <th>Installation Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.waterMeters.map((meter, index) => (
                  <tr key={index}>
                    <td>{meter.USER_ID}</td>
                    <td>{meter.METER_NUMBER}</td>
                    <td>{meter.LOCATION}</td>
                    <td>{meter.INSTALLATION_DATE}</td>
                    <td>{meter.STATUS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'billing':
        return (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Period Start</th>
                  <th>Period End</th>
                  <th>Total Usage</th>
                  <th>Amount Due</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {data.billing.map((bill, index) => (
                  <tr key={index}>
                    <td>{bill.USER_ID}</td>
                    <td>{bill.PERIOD_START}</td>
                    <td>{bill.PERIOD_END}</td>
                    <td>{bill.TOTAL_USAGE}</td>
                    <td>{bill.AMOUNT_DUE}</td>
                    <td>{bill.PAYMENT_STATUS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'implementation-records':
        return (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Method ID</th>
                  <th>Date Implemented</th>
                  <th>Status</th>
                  <th>Savings Achieved</th>
                </tr>
              </thead>
              <tbody>
                {data.implementationRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{record.USER_ID}</td>
                    <td>{record.METHOD_ID}</td>
                    <td>{record.DATE_IMPLEMENTED}</td>
                    <td>{record.STATUS}</td>
                    <td>{record.SAVINGS_ACHIEVED}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'users':
        return (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.USER_ID}</td>
                    <td>{user.NAME}</td>
                    <td>{user.ADDRESS}</td>
                    <td>{user.PHONE}</td>
                    <td>{user.EMAIL}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'conservation-methods':
        return (
          <div>
            <div className="mb-3">
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? 'Cancel' : 'Add New Conservation Method'}
              </button>
            </div>

            {showAddForm && (
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Add New Conservation Method</h5>
                  <form onSubmit={handleAddConservationMethod}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="methodName" className="form-label">Method Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="methodName"
                          value={newMethod.methodName}
                          onChange={(e) => setNewMethod({...newMethod, methodName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="cost" className="form-label">Cost ($)</label>
                        <input
                          type="number"
                          className="form-control"
                          id="cost"
                          step="0.01"
                          value={newMethod.cost}
                          onChange={(e) => setNewMethod({...newMethod, cost: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows="3"
                        value={newMethod.description}
                        onChange={(e) => setNewMethod({...newMethod, description: e.target.value})}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="efficiencyRating" className="form-label">Efficiency Rating (1-5)</label>
                      <select
                        className="form-control"
                        id="efficiencyRating"
                        value={newMethod.efficiencyRating}
                        onChange={(e) => setNewMethod({...newMethod, efficiencyRating: e.target.value})}
                        required
                      >
                        <option value="">Select Rating</option>
                        <option value="1">1 - Low</option>
                        <option value="2">2</option>
                        <option value="3">3 - Medium</option>
                        <option value="4">4</option>
                        <option value="5">5 - High</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-success">Add Method</button>
                  </form>
                </div>
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Method ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Cost</th>
                    <th>Efficiency Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {data.conservationMethods.map((method, index) => (
                    <tr key={index}>
                      <td>{method.method_id}</td>
                      <td>{method.method_name}</td>
                      <td>{method.description}</td>
                      <td>${method.cost}</td>
                      <td>{method.efficiency_rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'water-savings':
        return (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Meter Number</th>
                  <th>Method</th>
                  <th>Water Saved (L)</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {data.waterSavings.map((saving, index) => (
                  <tr key={index}>
                    <td>{saving.NAME}</td>
                    <td>{saving.WATER_METER_NUMBER}</td>
                    <td>{saving.METHOD_NAME}</td>
                    <td>{saving.SAVINGS}</td>
                    <td>{saving.END_DATE ? saving.END_DATE.slice(0, 10) : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard - User Entries</h2>

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'water-sources' ? 'active' : ''}`}
                    onClick={() => setActiveTab('water-sources')}
                  >
                    Water Sources
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'consumption-records' ? 'active' : ''}`}
                    onClick={() => setActiveTab('consumption-records')}
                  >
                    Consumption Records
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'water-meters' ? 'active' : ''}`}
                    onClick={() => setActiveTab('water-meters')}
                  >
                    Water Meters
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'billing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('billing')}
                  >
                    Billing
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'implementation-records' ? 'active' : ''}`}
                    onClick={() => setActiveTab('implementation-records')}
                  >
                    Implementation Records
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                  >
                    Users
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'conservation-methods' ? 'active' : ''}`}
                    onClick={() => setActiveTab('conservation-methods')}
                  >
                    Conservation Methods
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'water-savings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('water-savings')}
                  >
                    Water Savings
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
