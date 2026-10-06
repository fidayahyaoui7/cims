const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🔍 Starting database check...');

// Path to the database file
const dbPath = path.join(__dirname, '../../appointments.db');
console.log(`📂 Database path: ${dbPath}`);

// Check if the file exists
const fs = require('fs');
if (!fs.existsSync(dbPath)) {
  console.log('❌ Database file does not exist');
  process.exit(1);
}

console.log('✅ Database file exists');

// Create a new database connection
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Error connecting to the database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to the SQLite database');
});

// Simple query to check tables
db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", [], (err, tables) => {
  if (err) {
    console.error('❌ Error querying tables:', err.message);
    db.close();
    return;
  }

  console.log('\n📋 Tables in the database:');
  if (tables.length === 0) {
    console.log('   No tables found!');
  } else {
    tables.forEach(table => {
      console.log(`   - ${table.name}`);
    });
  }

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('\n🔌 Database connection closed');
    }
  });
});
