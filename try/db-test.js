console.log('Starting database initialization script...');

const { initializeDatabase } = require('../server/database/database');

try {
  console.log('Attempting to initialize database...');
  initializeDatabase();
  console.log('Database initialization script completed successfully.');
  console.log('The medical_centers.db file should now be created and seeded in the server/database/ directory.');
} catch (error) {
  console.error('Database initialization script failed:');
  console.error(error);
  process.exit(1);
}
