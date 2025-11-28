const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all billing records
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT user_id, period_start, period_end, total_usage, amount_due, payment_status FROM Billing ORDER BY period_end DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching billing records:', err);
    res.status(500).json({ error: 'Failed to fetch billing records' });
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

// POST new billing record
router.post('/', async (req, res) => {
  let connection;
  try {
    const { userId, periodStart, periodEnd, totalUsage, amountDue, paymentStatus } = req.body;
    console.log('POST /api/billing body:', req.body);

    // Basic validation / coercion
    const userIdNum = parseInt(userId);
    const totalUsageNum = parseFloat(totalUsage);
    const amountDueNum = parseFloat(amountDue);
    if (isNaN(userIdNum) || !periodStart || !periodEnd || isNaN(totalUsageNum) || isNaN(amountDueNum)) {
      return res.status(400).json({ error: 'Invalid input: userId (number), periodStart, periodEnd, totalUsage (number) and amountDue (number) are required' });
    }
    connection = await db.getConnection();
    await connection.execute(
      `INSERT INTO Billing (user_id, period_start, period_end, total_usage, amount_due, payment_status) VALUES (:userId, TO_DATE(:periodStart, 'YYYY-MM-DD'), TO_DATE(:periodEnd, 'YYYY-MM-DD'), :totalUsage, :amountDue, :paymentStatus)`,
      { userId: userIdNum, periodStart, periodEnd, totalUsage: totalUsageNum, amountDue: amountDueNum, paymentStatus },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Billing record added successfully' });
  } catch (err) {
    console.error('Error adding billing record:', err);
    // If it's a constraint violation (e.g., duplicate primary key), return 400 with detail
    if (err && err.errorNum === 1) {
      return res.status(400).json({ error: 'Billing record already exists for this user and period' });
    }
    // Return error message for easier debugging in dev (avoid exposing in production)
    return res.status(500).json({ error: 'Failed to add billing record', detail: err.message || String(err) });
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
