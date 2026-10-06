const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path
const dbPath = path.join(__dirname, 'test-db.sqlite');

// Remove existing test database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Removed existing test database');
}

console.log('Creating test database...');
const db = new sqlite3.Database(dbPath);

// Create a simple table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      value INTEGER
    )
  `, (err) => {
    if (err) {
      console.error('Error creating test table:', err.message);
      return;
    }
    console.log('✅ Created test table');
    
    // Insert test data
    db.run("INSERT INTO test (name, value) VALUES ('test1', 100)", (err) => {
      if (err) {
        console.error('Error inserting test data:', err.message);
        return;
      }
      console.log('✅ Inserted test data');
      
      // Query the data
      db.all('SELECT * FROM test', [], (err, rows) => {
        if (err) {
          console.error('Error querying test data:', err.message);
          return;
        }
        
        console.log('\n📋 Test data from database:');
        console.table(rows);
        
        console.log('\n✅ Test database created successfully!');
        console.log(`Database file: ${dbPath}`);
        
        // Close the database connection
        db.close();
      });
    });
  });
});
