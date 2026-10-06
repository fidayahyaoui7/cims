const knex = require('knex');
const knexConfig = require('../config/knexfile');

// Use the appropriate environment configuration
const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

// Create a Knex instance with the configuration
const db = knex(config);

// Test the database connection
const testConnection = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('✅ PostgreSQL connection successful');
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed');
    console.error('Error details:', error);
    return false;
  }
};

// Handle database connection errors
db.on('query-error', (error) => {
  console.error('Database query error:', error);
});

// Handle process termination
process.on('SIGTERM', async () => {
  await db.destroy();
  process.exit(0);
});

module.exports = {
  db,
  testConnection,
};
