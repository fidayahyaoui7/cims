const knex = require('knex');
const path = require('path');

// Database configuration
const config = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'appointments.db')
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'seeds')
  },
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    }
  }
};

// Create the database connection
const db = knex(config);

// Test the connection
const testConnection = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Export the database instance and test function
module.exports = {
  db,
  testConnection
};
