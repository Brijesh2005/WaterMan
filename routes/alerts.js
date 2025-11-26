const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all alerts
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT user_id, type, message, date_issued, status FROM Alerts ORDER BY date_issued DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// POST new alert
router.post('/', async (req, res) => {
  let connection;
  try {
    const { userId, type, description, dateIssued, status } = req.body;
    connection = await db.getConnection();

    await connection.execute(
      `INSERT INTO Alerts (user_id, type, message, date_issued, status) VALUES (:userId, :type, :message, TO_TIMESTAMP(:dateIssued, 'YYYY-MM-DD HH24:MI:SS'), :status)`,
      { userId, type, message: description, dateIssued, status },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Alert added successfully', alertId });
  } catch (err) {
    console.error('Error adding alert:', err);
    res.status(500).json({ error: 'Failed to add alert' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

module.exports = router;
