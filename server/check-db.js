const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path
const dbPath = path.join(__dirname, 'database', 'appointments.db');
console.log('Database path:', dbPath);

// Check if database file exists
if (!fs.existsSync(dbPath)) {
  console.error('❌ Database file does not exist');
  process.exit(1);
}

console.log('✅ Database file exists');

// Try to open the database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    return;
  }
  
  console.log('✅ Successfully connected to database');
  
  // List tables
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      console.error('❌ Error listing tables:', err.message);
      return;
    }
    
    console.log('\n📋 Tables in database:');
    if (tables.length === 0) {
      console.log('No tables found');
    } else {
      tables.forEach(table => {
        console.log(`- ${table.name}`);
        
        // Show table structure
        db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
          if (err) {
            console.error(`  ❌ Error getting structure of ${table.name}:`, err.message);
            return;
          }
          
          console.log(`\n  Structure of ${table.name}:`);
          console.table(columns.map(c => ({
            name: c.name,
            type: c.type,
            notnull: c.notnull ? 'YES' : 'NO',
            default_value: c.dflt_value,
            primary_key: c.pk ? 'YES' : 'NO'
          })));
          
          // Show sample data
          db.all(`SELECT * FROM ${table.name} LIMIT 5`, [], (err, rows) => {
            if (err) {
              console.error(`  ❌ Error getting data from ${table.name}:`, err.message);
              return;
            }
            
            console.log(`\n  Sample data from ${table.name}:`);
            if (rows.length === 0) {
              console.log('  No data found');
            } else {
              console.table(rows);
            }
            
            // Close the database connection after the last table
            if (table === tables[tables.length - 1]) {
              db.close();
              console.log('\n✅ Database check complete');
            }
          });
        });
      });
    }
  });
});
