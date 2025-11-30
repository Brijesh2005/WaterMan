const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all water savings, optionally filtered by userId
router.get('/', async (req, res) => {
  let connection;
  try {
    const { userId } = req.query;
    console.log('Fetching water savings for userId:', userId);
    connection = await db.getConnection();

    let query = `
      SELECT ws.savings_id, ws.user_id, u.name, ws.water_meter_number, ws.implementation_id, ir.method_id, cm.method_name,
             ws.savings,
             ws.end_date
      FROM WaterSavings ws
      JOIN Users u ON ws.user_id = u.user_id
      JOIN ImplementationRecord ir ON ws.implementation_id = ir.record_id
      JOIN ConservationMethod cm ON ir.method_id = cm.method_id
    `;
    let binds = {};

    if (userId) {
      query += ' WHERE ws.user_id = :userId';
      binds.userId = userId;
    }

    query += ' ORDER BY ws.savings_id DESC';

    const result = await connection.execute(query, binds, { outFormat: require('oracledb').OUT_FORMAT_OBJECT });
    console.log('Water savings query result rows:', result.rows);
    console.log('Query executed:', query);
    console.log('Binds:', binds);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching water savings:', err);
    res.status(500).json({ error: 'Failed to fetch water savings' });
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

// POST new water savings record
router.post('/', async (req, res) => {
  let connection;
  try {
    const { userId, waterMeterNumber, implementationId, endDate } = req.body;
    if (!userId || !waterMeterNumber || !implementationId || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    connection = await db.getConnection();

    // Get the date_implemented from ImplementationRecord
    const dateResult = await connection.execute(
      'SELECT date_implemented FROM ImplementationRecord WHERE record_id = :implementationId',
      { implementationId: Number(implementationId) },
      { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );

    if (dateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Implementation record not found' });
    }

    const dateImplemented = dateResult.rows[0].DATE_IMPLEMENTED;
    const endDateObj = new Date(endDate);
    const dateImplementedObj = new Date(dateImplemented);
    if (isNaN(dateImplementedObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid date values' });
    }
    const diffTime = endDateObj - dateImplementedObj;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const waterSaved = Math.round((diffDays * 24 * 0.03) * 100) / 100; // ROUND to 2 decimal places

    await connection.execute(
      `INSERT INTO WaterSavings (user_id, water_meter_number, implementation_id, savings, end_date) VALUES (:userId, :waterMeterNumber, :implementationId, :savings, TO_DATE(:endDate, 'YYYY-MM-DD'))`,
      {
        userId: Number(userId),
        waterMeterNumber,
        implementationId: Number(implementationId),
        savings: waterSaved,
        endDate
      },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Water savings record added successfully' });
  } catch (err) {
    console.error('Error adding water savings record:', err);
    res.status(500).json({ error: 'Failed to add water savings record' });
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
