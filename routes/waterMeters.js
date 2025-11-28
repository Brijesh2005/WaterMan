const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all water meters optionally filtered by user_id
router.get('/', async (req, res) => {
  let connection;
  try {
    const userId = req.query.userId;
    connection = await db.getConnection();
    let query = 'SELECT user_id, meter_number, location, installation_date, status FROM WaterMeters';
    const binds = {};
    if (userId) {
      query += ' WHERE user_id = :userId';
      binds.userId = userId;
    }
    query += ' ORDER BY meter_number';
    const result = await connection.execute(query, binds);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching water meters:', err);
    res.status(500).json({ error: 'Failed to fetch water meters' });
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

// POST new water meter
router.post('/', async (req, res) => {
  let connection;
  try {
    const { userId, location, installationDate } = req.body;
    console.log('POST /api/water-meters body:', req.body);
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: 'Invalid userId: must be a number' });
    }
    connection = await db.getConnection();

    // Check if user exists
    const userCheck = await connection.execute(
      'SELECT user_id FROM Users WHERE user_id = :userId',
      { userId: userIdNum }
    );
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const meterNumber = 'WM' + Date.now();
    await connection.execute(
      `INSERT INTO WaterMeters (user_id, meter_number, location, installation_date) VALUES (:userId, :meterNumber, :location, TO_DATE(:installationDate, 'YYYY-MM-DD'))`,
      { userId: userIdNum, meterNumber, location, installationDate },
      { autoCommit: true }
    );

    // Return the newly created meter row so the client can update without refetching
    const selectRes = await connection.execute(
      `SELECT user_id, meter_number, location, installation_date, status FROM WaterMeters WHERE meter_number = :meterNumber`,
      { meterNumber }
    );
    const created = selectRes.rows && selectRes.rows.length ? selectRes.rows[0] : null;
    res.status(201).json({ message: 'Water meter added successfully', meter: created });
  } catch (err) {
    console.error('Error adding water meter:', err);
    res.status(500).json({ error: 'Failed to add water meter' });
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
