const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the database file
const dbPath = path.join(__dirname, '../../appointments.db');

// Create a new database connection
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Error connecting to the database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to the SQLite database');
});

// Function to run a query and return a promise
function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('❌ Query error:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Main function to check the database schema
async function checkSchema() {
  try {
    // List all tables
    const tables = await runQuery("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    console.log('\n📋 Database Tables:');
    console.table(tables.map(t => ({ 'Table Name': t.name })));

    // Check each table's structure
    for (const table of tables) {
      const tableName = table.name;
      console.log(`\n🔍 Table: ${tableName}`);
      
      // Get table info
      const columns = await runQuery(`PRAGMA table_info(${tableName})`);
      console.table(columns.map(col => ({
        'Column Name': col.name,
        'Type': col.type,
        'Not Null': col.notnull ? 'YES' : 'NO',
        'Default': col.dflt_value || 'NULL',
        'Primary Key': col.pk ? 'YES' : 'NO'
      })));

      // Get foreign key info
      const foreignKeys = await runQuery(`PRAGMA foreign_key_list(${tableName})`);
      if (foreignKeys.length > 0) {
        console.log('🔗 Foreign Keys:');
        console.table(foreignKeys.map(fk => ({
          'From': fk.from,
          'To Table': fk.table,
          'To Column': fk.to,
          'On Update': fk.on_update,
          'On Delete': fk.on_delete
        })));
      }
    }

    // Check if the users table exists and has data
    if (tables.some(t => t.name === 'users')) {
      const userCount = await runQuery('SELECT COUNT(*) as count FROM users');
      console.log(`\n👥 Users in database: ${userCount[0].count}`);
    }

  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('\n🔌 Database connection closed');
      }
    });
  }
}

// Run the schema check
checkSchema();
