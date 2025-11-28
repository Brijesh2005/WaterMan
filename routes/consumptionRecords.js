const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all consumption records
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT user_id, water_meter_number, consumption_date, consumption FROM ConsumptionRecords ORDER BY consumption_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching consumption records:', err);
    res.status(500).json({ error: 'Failed to fetch consumption records' });
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

// POST new consumption record
router.post('/', async (req, res) => {
  let connection;
  try {
    const { meterId, timestamp, volumeUsed } = req.body;
    const volumeUsedNum = parseFloat(volumeUsed);
    if (!meterId || isNaN(volumeUsedNum)) {
      return res.status(400).json({ error: 'Invalid input: meterId must be a string and volumeUsed must be a number' });
    }
    connection = await db.getConnection();

    // Get user_id from WaterMeters
    const userResult = await connection.execute(
      `SELECT user_id FROM WaterMeters WHERE meter_number = :meterId`,
      { meterId }
    );
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid meter ID' });
    }
    const userId = userResult.rows[0][0];

    await connection.execute(
      `INSERT INTO ConsumptionRecords (user_id, water_meter_number, consumption, consumption_date) VALUES (:userId, :meterId, :volumeUsed, SYSDATE)`,
      { userId, meterId, volumeUsed: volumeUsedNum },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Consumption record added successfully' });
  } catch (err) {
    console.error('Error adding consumption record:', err);
    res.status(500).json({ error: 'Failed to add consumption record' });
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
