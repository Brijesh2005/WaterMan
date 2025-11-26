const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper function to map Oracle result to array of objects with lowercase keys
function mapResultSet(result) {
  if (!result || !result.rows || !result.metaData) return [];
  const columns = result.metaData.map(col => col.name.toLowerCase());
  return result.rows.map(row => {
    let obj = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj;
  });
}

// GET all conservation methods
router.get('/', async (req, res) => {
  try {
    const query = `SELECT * FROM ConservationMethod ORDER BY METHOD_ID`;
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching conservation methods:', err);
        return res.status(500).json({ error: 'Failed to fetch conservation methods' });
      }
      const mappedResults = mapResultSet(result);
        // Potential empty object issue: mapResultSet returns array of objects with lowercase keys
        // but they might be empty if the query metaData or rows are empty or mismatched 
        // Let's log mappedResults to verify structure
        console.log('Mapped conservation methods:', mappedResults);
        res.json(mappedResults);
    });
  } catch (error) {
    console.error('Error in GET /conservation-methods:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET conservation methods by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM ConservationMethod WHERE METHOD_ID = :id`;
    db.query(query, { id }, (err, result) => {
      if (err) {
        console.error('Error fetching conservation method:', err);
        return res.status(500).json({ error: 'Failed to fetch conservation method' });
      }
      const mappedResults = mapResultSet(result);
      if (mappedResults.length === 0) {
        return res.status(404).json({ error: 'Conservation method not found' });
      }
      res.json(mappedResults[0]);
    });
  } catch (error) {
    console.error('Error in GET /conservation-methods/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new conservation method
router.post('/', async (req, res) => {
  try {
    const { methodName, description, cost, efficiencyRating } = req.body;
    
    console.log('Incoming conservation method data:', { methodName, description, cost, efficiencyRating });

    // Validate required fields
    if (!methodName || !description || cost === undefined || !efficiencyRating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate efficiency rating is 1-5
    const rating = parseInt(efficiencyRating);
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Efficiency rating must be between 1 and 5' });
    }

    const costNum = parseFloat(cost);
    if (isNaN(costNum)) {
      return res.status(400).json({ error: 'Cost must be a valid number' });
    }

    const insertQuery = `
      INSERT INTO ConservationMethod (METHOD_NAME, DESCRIPTION, COST, EFFICIENCY_RATING)
      VALUES (:methodName, :description, :cost, :efficiencyRating)
    `;

    db.query(insertQuery, 
      { 
        methodName, 
        description, 
        cost: costNum, 
        efficiencyRating: rating 
      }, 
      (err, result) => {
        if (err) {
          console.error('Error inserting conservation method:', err);
          return res.status(500).json({ error: 'Failed to create conservation method', detail: err.message });
        }

        // Fetch and return the created method
        const selectQuery = `SELECT * FROM ConservationMethod WHERE METHOD_ID = (SELECT MAX(METHOD_ID) FROM ConservationMethod)`;
        db.query(selectQuery, (err, results) => {
          if (err) {
            console.error('Error fetching created method:', err);
            return res.status(500).json({ error: 'Method created but failed to retrieve' });
          }
          res.status(201).json(results[0]);
        });
      }
    );
  } catch (error) {
    console.error('Error in POST /conservation-methods:', error);
    res.status(500).json({ error: 'Internal server error', detail: error.message });
  }
});

module.exports = router;
