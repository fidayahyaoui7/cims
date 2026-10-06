const knex = require('knex');
const config = require('../../knexfile');

// Use the appropriate environment (development, production, etc.)
const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

// Create the database connection
const db = knex(dbConfig);

// Test the database connection
async function testConnection() {
  try {
    if (environment === 'development') {
      await db.raw('SELECT 1');
    } else {
      await db.raw('SELECT 1');
    }
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

module.exports = {
  db,
  testConnection,
  // Export the knex instance for raw queries if needed
  raw: db.raw.bind(db)
};
