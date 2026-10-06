require('dotenv').config();
const knex = require('knex');
const path = require('path');

// Database configuration
const dbConfig = {
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
    afterCreate: (conn, done) => {
      // Enable foreign key constraints
      conn.run('PRAGMA foreign_keys = ON', done);
    }
  }
};

// Create a Knex instance
const db = knex(dbConfig);

// Test the database connection
async function testConnection() {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (process.env.NODE_ENV === 'production') {
      console.error('FATAL: Could not connect to the database');
      process.exit(1);
    }
    
    return false;
  }
}

// Transaction helper
const transaction = (callback) => {
  return db.transaction(callback);
};

// Export the database instance and transaction helper
module.exports = {
  db,
  transaction,
  testConnection
};

// Test the connection on startup if not in test environment
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}
