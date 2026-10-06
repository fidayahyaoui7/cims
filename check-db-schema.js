const knex = require('knex');
const config = require('./knexfile');

async function checkSchema() {
  const db = knex(config.development);
  
  try {
    // Get list of all tables
    const tables = await db.raw("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'knex_migrations' AND name != 'knex_migrations_lock'");
    
    console.log('\n=== Database Tables ===');
    for (const row of tables) {
      const tableName = row.name;
      console.log(`\nTable: ${tableName}`);
      
      try {
        // Get table structure
        const columns = await db.raw(`PRAGMA table_info(${tableName})`);
        console.table(columns);
        
        // Show row count
        const count = await db(tableName).count('* as count').first();
        console.log(`  Rows: ${count.count}`);
        
      } catch (err) {
        console.error(`  Error getting schema for table ${tableName}:`, err.message);
      }
    }
    
    // Check knex migrations
    console.log('\n=== Knex Migrations ===');
    try {
      const migrations = await db('knex_migrations').select('*');
      console.table(migrations);
    } catch (err) {
      console.error('Error checking migrations:', err.message);
    }
    
  } catch (err) {
    console.error('Error checking database schema:', err);
  } finally {
    await db.destroy();
  }
}

checkSchema().catch(console.error);
