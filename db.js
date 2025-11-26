const oracledb = require('oracledb');

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING, // e.g., 'localhost:1521/XE'
};

console.log('Database config:', {
  user: dbConfig.user,
  password: dbConfig.password ? '***' : undefined,
  connectString: dbConfig.connectString
});

// Get connection
async function getConnection() {
  try {
    return await oracledb.getConnection(dbConfig);
  } catch (err) {
    console.error('Error getting database connection:', err);
    throw err;
  }
}

// Callback-based query function for compatibility
function query(sql, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  (async () => {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(sql, params || {}, { autoCommit: true });
      callback(null, result);
    } catch (err) {
      callback(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  })();
}

module.exports = {
  getConnection,
  query,
};
