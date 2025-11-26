const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function createTables() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    });

    // Drop tables if they exist
    const dropStatements = [
      'DROP TABLE ConsumptionRecords CASCADE CONSTRAINTS',
      'DROP TABLE Billing CASCADE CONSTRAINTS',
      'DROP TABLE Alerts CASCADE CONSTRAINTS',
      'DROP TABLE WaterMeters CASCADE CONSTRAINTS',
      'DROP TABLE WaterSources CASCADE CONSTRAINTS',
      'DROP TABLE Users CASCADE CONSTRAINTS'
    ];

    for (const statement of dropStatements) {
      try {
        console.log('Executing:', statement);
        await connection.execute(statement);
        await connection.commit();
      } catch (err) {
        if (err.errorNum === 942) {
          console.log('Table does not exist, skipping drop:', statement);
        } else {
          console.log('Error dropping table:', err.message);
        }
      }
    }

    const sqlFilePath = path.join(__dirname, 'create_tables.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Split the SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim());
        await connection.execute(statement);
        await connection.commit(); // Commit after each statement
      }
    }

    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

createTables();
