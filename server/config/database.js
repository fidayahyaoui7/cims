require('dotenv').config();
const knex = require('knex');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbPath = path.join(__dirname, '../database');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

// Database configuration
const dbConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mon-app',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  },
  migrations: {
    directory: path.join(__dirname, '../database/migrations'),
    tableName: 'knex_migrations'
  },
  pool: {
    min: 2,
    max: 10,
    createTimeoutMillis: 3000,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100
  }
};

// Create a Knex instance
const db = knex(dbConfig);

// Test the database connection
const testConnection = async () => {
  const client = new (require('pg').Client)(dbConfig.connection);
  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  } finally {
    await client.end();
  }
};

// Handle database connection errors
db.on('query-error', (err) => {
  console.error('Database query error:', err);
});

process.on('SIGINT', async () => {
  try {
    await db.destroy();
    console.log('Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing database connection:', err);
    process.exit(1);
  }
});

module.exports = {
  db,
  testConnection
};
