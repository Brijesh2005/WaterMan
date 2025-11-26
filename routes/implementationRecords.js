const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all implementation records
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = `
      SELECT 
        ir.RECORD_ID,
        ir.USER_ID,
        u.NAME,
        cm.METHOD_ID,
        cm.METHOD_NAME,
        ir.DATE_IMPLEMENTED,
        ir.STATUS,
        ir.SAVINGS_ACHIEVED
      FROM ImplementationRecord ir
      JOIN Users u ON ir.USER_ID = u.USER_ID
      JOIN ConservationMethod cm ON ir.METHOD_ID = cm.METHOD_ID
    `;

    // The selectedUserId might be a string; ensure all ids are numbers in queries

    if (userId) {
      query += ` WHERE ir.USER_ID = :userId`;
    }

    query += ` ORDER BY ir.DATE_IMPLEMENTED DESC`;

    const params = userId ? { userId: parseInt(userId) } : {};

    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Error fetching implementation records:', err);
        return res.status(500).json({ error: 'Failed to fetch implementation records' });
      }
      // OracleDB rows are arrays, map with metaData to keys
      if (!results || !results.rows || !results.metaData) {
        console.error('Invalid query result structure:', results);
        return res.status(500).json({ error: 'Invalid query result structure' });
      }
      const columns = results.metaData.map(col => col.name.toLowerCase());
      const mappedResults = results.rows.map(row => {
        let obj = {};
        columns.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        return obj;
      });
      res.json(mappedResults);
    });
  } catch (error) {
    console.error('Error in GET /implementation-records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET implementation record by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        ir.RECORD_ID,
        ir.USER_ID,
        u.NAME,
        cm.METHOD_NAME,
        ir.DATE_IMPLEMENTED,
        ir.STATUS,
        ir.SAVINGS_ACHIEVED
      FROM ImplementationRecord ir
      JOIN Users u ON ir.USER_ID = u.USER_ID
      JOIN ConservationMethod cm ON ir.METHOD_ID = cm.METHOD_ID
      WHERE ir.RECORD_ID = :id
    `;

    db.query(query, { id: parseInt(id) }, (err, results) => {
      if (err) {
        console.error('Error fetching implementation record:', err);
        return res.status(500).json({ error: 'Failed to fetch implementation record' });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({ error: 'Implementation record not found' });
      }
      // Map row to expected keys
      const row = results.rows[0];
      const mappedRecord = {
        record_id: row.RECORD_ID,
        user_id: row.USER_ID,
        user_name: row.NAME,
        method_id: row.METHOD_ID,
        method_name: row.METHOD_NAME,
        date_implemented: row.DATE_IMPLEMENTED,
        status: row.STATUS,
        savings_achieved: row.SAVINGS_ACHIEVED
      };
      res.json(mappedRecord);
    });
  } catch (error) {
    console.error('Error in GET /implementation-records/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new implementation record
  router.post('/', async (req, res) => {
    try {
      const { userId, methodId, dateImplemented, status, savingsAchieved } = req.body;

      console.log('Incoming implementation record data:', { userId, methodId, dateImplemented, status, savingsAchieved });

      // Validate required fields
      if (!userId || !methodId || !dateImplemented || !status || savingsAchieved === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate status
      const validStatus = ['active', 'inactive'];
      if (!validStatus.includes(status)) {
        return res.status(400).json({ error: 'Status must be either "active" or "inactive"' });
      }

      const savings = parseFloat(savingsAchieved);
      if (isNaN(savings) || savings < 0) {
        return res.status(400).json({ error: 'Savings achieved must be a valid positive number' });
      }

      const userIdNum = parseInt(userId);
      const methodIdNum = parseInt(methodId);

      // Verify user exists
      const userQuery = `SELECT USER_ID FROM Users WHERE USER_ID = :userId`;
      db.query(userQuery, { userId: userIdNum }, (err, userResults) => {
        if (err || !userResults.rows || userResults.rows.length === 0) {
          console.error('Invalid user ID or query error:', err || 'No rows found');
          return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Verify method exists
        const methodQuery = `SELECT METHOD_ID FROM ConservationMethod WHERE METHOD_ID = :methodId`;
        db.query(methodQuery, { methodId: methodIdNum }, (err, methodResults) => {
          if (err || !methodResults.rows || methodResults.rows.length === 0) {
            console.error('Invalid method ID or query error:', err || 'No rows found');
            return res.status(400).json({ error: 'Invalid method ID' });
          }

          // Insert implementation record
          const insertQuery = `
            INSERT INTO ImplementationRecord (USER_ID, METHOD_ID, DATE_IMPLEMENTED, STATUS, SAVINGS_ACHIEVED, DATE_CREATED)
            VALUES (:userId, :methodId, :dateImplemented, :status, :savingsAchieved, CURRENT_TIMESTAMP)
          `;

          db.query(insertQuery,
            {
              userId: userIdNum,
              methodId: methodIdNum,
              dateImplemented: new Date(Date.parse(dateImplemented)),
              status,
              savingsAchieved: savings
            },
            (err, result) => {
              if (err) {
                console.error('Detailed error inserting implementation record:', err);
                console.error('Insert query params:', { userId: userIdNum, methodId: methodIdNum, dateImplemented, status, savingsAchieved: savings });
                console.error('Stack trace:', err.stack);
                return res.status(500).json({ error: 'Failed to create implementation record', detail: err.message });
              }

              // Fetch and return the created record
              const selectQuery = `
                SELECT 
                  ir.RECORD_ID,
                  ir.USER_ID,
                  u.NAME,
                  cm.METHOD_NAME,
                  ir.DATE_IMPLEMENTED,
                  ir.STATUS,
                  ir.SAVINGS_ACHIEVED
                FROM ImplementationRecord ir
                JOIN Users u ON ir.USER_ID = u.USER_ID
                JOIN ConservationMethod cm ON ir.METHOD_ID = cm.METHOD_ID
                WHERE ir.RECORD_ID = (SELECT MAX(RECORD_ID) FROM ImplementationRecord)
              `;

              db.query(selectQuery, (err, results) => {
                if (err) {
                  console.error('Error fetching created record:', err);
                  return res.status(500).json({ error: 'Record created but failed to retrieve' });
                }
                res.status(201).json(results.rows[0]);
              });
            }
          );
        });
      });
    } catch (error) {
      console.error('Error in POST /implementation-records:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ error: 'Internal server error', detail: error.message });
    }
  });

module.exports = router;
