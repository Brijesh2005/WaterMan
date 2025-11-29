import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WaterSavings = ({ user }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWaterSavings();
  }, [user]);

  const fetchWaterSavings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/water-savings?userId=${user.user_id}`);
      setData(response.data || []);
    } catch (error) {
      console.error('Error fetching water savings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>My Water Savings</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Meter Number</th>
                <th>Method</th>
                <th>Water Saved (L)</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((saving, index) => (
                  <tr key={index}>
                    <td>{saving.WATER_METER_NUMBER}</td>
                    <td>{saving.METHOD_NAME}</td>
                    <td>{saving.SAVINGS}</td>
                    <td>{saving.END_DATE ? saving.END_DATE.slice(0, 10) : ''}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No water savings data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WaterSavings;
