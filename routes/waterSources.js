const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();
const db = require('../db');

// GET all water sources, optionally filtered by userId
router.get('/', async (req, res) => {
  let connection;
  try {
    const { userId } = req.query;
    connection = await db.getConnection();

    let query = 'SELECT user_id, type, capacity, location FROM WaterSources';
    let binds = {};

    if (userId) {
      query += ' WHERE user_id = :userId';
      binds.userId = userId;
    }

    query += ' ORDER BY user_id, type, location';

    const result = await connection.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log('WaterSources query result rows:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching water sources:', err);
    res.status(500).json({ error: 'Failed to fetch water sources' });
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

router.post('/', async (req, res) => {
  let connection;
  try {
    let { userId, type, capacity, location } = req.body;
    console.log('POST /api/water-sources payload:', req.body);
    if (!userId || !type || !capacity || !location) {
      console.error('Validation failed: Missing required fields:', {userId, type, capacity, location});
      return res.status(400).json({ error: 'Missing required fields: userId, type, capacity, location' });
    }
    connection = await db.getConnection();

    userId = Number(userId);
    capacity = Number(capacity);

    console.log('Attempting insert with:', { userId, type, capacity, location });

    await connection.execute(
      `INSERT INTO WaterSources (user_id, type, capacity, location) VALUES (:userid, :type, :capacity, :location)`,
      {
        userid: { val: userId, type: oracledb.NUMBER },
        type: { val: type, type: oracledb.STRING },
        capacity: { val: capacity, type: oracledb.NUMBER },
        location: { val: location, type: oracledb.STRING }
      },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Water source added successfully' });
  } catch (err) {
    console.error('Error adding water source:', err);
    console.log('POST payload was:', req.body);
    res.status(500).json({ error: 'Failed to add water source' });
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
