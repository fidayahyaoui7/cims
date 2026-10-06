const knex = require('knex');
const knexConfig = require('../config/knexfile');

// Use development configuration for testing
const db = knex(knexConfig.development);

// Test the database connection
db.raw('SELECT 1+1 AS result')
  .then((result) => {
    console.log('✅ PostgreSQL connection successful');
    console.log('Query result:', result.rows[0]);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ PostgreSQL connection failed');
    console.error('Error details:', error);
    process.exit(1);
  })
  .finally(() => {
    // Close the database connection
    return db.destroy();
  });
