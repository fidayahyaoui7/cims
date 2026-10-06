const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the SQLite database file
const dbPath = path.join(__dirname, 'server', 'database', 'medical_centers.db');

// Open the database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
  
  // List all tables
  db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'knex_migrations' AND name != 'knex_migrations_lock'", [], (err, tables) => {
    if (err) {
      console.error('Error getting tables:', err.message);
    } else {
      console.log('\n=== Tables in the database ===');
      if (tables.length === 0) {
        console.log('No tables found!');
      } else {
        tables.forEach((table, index) => {
          console.log(`${index + 1}. ${table.name}`);
          
          // Get table info
          db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
            if (err) {
              console.error(`  Error getting columns for ${table.name}:`, err.message);
              return;
            }
            console.log(`  Columns in ${table.name}:`);
            columns.forEach(col => {
              console.log(`    - ${col.name} (${col.type}${col.pk ? ' PRIMARY KEY' : ''}${col.notnull ? ' NOT NULL' : ''})`);
            });
            
            // Get row count
            db.get(`SELECT COUNT(*) as count FROM ${table.name}`, [], (err, row) => {
              if (!err && row) {
                console.log(`  Rows: ${row.count}`);
              }
              
              // If this is the last table, close the database
              if (index === tables.length - 1) {
                db.close();
              }
            });
          });
        });
      }
    }
  });
});
