
const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();
const db = require('../db');

// GET all users
router.get('/', async (req, res) => {
  let connection;
  try {
    console.log('Fetching users');
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT user_id, name, address, phone, email FROM Users ORDER BY name`,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log('Fetched users:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
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
    const { name, address, phone, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing required fields: name and email' });
    }

    console.log('Received POST /api/users with data:', req.body);
    connection = await db.getConnection();

    // Insert new user without specifying ID (auto-generated)
    const result = await connection.execute(
      `INSERT INTO Users (name, address, phone, email) VALUES (:name, :address, :phone, :email) RETURNING user_id INTO :id`,
      { name, address, phone, email, id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
      { autoCommit: true }
    );

    const insertedId = result.outBinds.id[0];
    console.log('Inserted user with id:', insertedId);

    res.status(201).json({ message: 'User added successfully', userId: insertedId });
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ error: 'Failed to add user' });
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
// POST login
router.post('/login', async (req, res) => {
  let connection;
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }

    console.log('Received POST /api/users/login with data:', req.body);
    connection = await db.getConnection();

    // Check if user exists with the specified email and role
    const result = await connection.execute(
      `SELECT user_id, name, email, role FROM Users WHERE email = :email AND role = :role`,
      { email, role }
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    console.log('User logged in:', user);

    // For now, no password check since there's no password field
    // In a real app, you'd hash and compare passwords here

    res.status(200).json({
      message: 'Login successful',
      user: {
        user_id: user[0],
        name: user[1],
        email: user[2],
        role: user[3]
      }
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Failed to login' });
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


/*
// DELETE user by id
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'User ID is required for delete' });
    }
    connection = await db.getConnection();
    const result = await connection.execute(
      'DELETE FROM Users WHERE id = :id',
      { id },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
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
*/

router.post('/register', async (req, res) => {
  let connection;
  try {
    const { name, email, password, address, phone, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields: name, email, and password' });
    }

    console.log('Received POST /api/users/register with data:', req.body);
    connection = await db.getConnection();

    // Insert new user with role
    const result = await connection.execute(
      `INSERT INTO Users (name, email, address, phone, role) VALUES (:name, :email, :address, :phone, :role) RETURNING user_id INTO :id`,
      { name, email, address, phone, role: role || 'user', id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
      { autoCommit: true }
    );

    const insertedId = result.outBinds.id[0];
    console.log('Inserted user with id:', insertedId);

    res.status(201).json({ message: 'User registered successfully', userId: insertedId });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Failed to register user' });
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
