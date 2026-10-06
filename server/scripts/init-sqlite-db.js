const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../../appointments.db');

// Remove existing database file if it exists
if (fs.existsSync(dbPath)) {
  console.log('Removing existing database file...');
  fs.unlinkSync(dbPath);
}

// Create a new database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Read the SQLite schema file
const schemaPath = path.join(__dirname, '../database/sqlite-schema.sql');
const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

// Enable foreign keys
console.log('Enabling foreign key constraints...');
db.get("PRAGMA foreign_keys = ON");

// Execute the schema SQL
console.log('Creating tables...');
db.serialize(() => {
  // Split the SQL by semicolon to execute statements one by one
  const statements = schemaSQL.split(';').filter(statement => statement.trim() !== '');
  
  let completed = 0;
  const total = statements.length;
  
  statements.forEach((statement, index) => {
    db.run(statement, (err) => {
      if (err) {
        console.error(`Error executing statement ${index + 1}:`, err.message);
        console.error('Statement:', statement);
        process.exit(1);
      }
      
      completed++;
      console.log(`[${completed}/${total}] Executed statement`);
      
      if (completed === total) {
        console.log('\n✅ Database schema created successfully!');
        db.close();
      }
    });
  });
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nClosing database connection...');
  db.close();
  process.exit(0);
});
