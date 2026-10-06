const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkDatabase() {
  const client = await pool.connect();
  try {
    // Check if the database exists and is accessible
    console.log('🔍 Checking database connection and structure...');
    
    // List all tables in the current database
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Database tables:');
    if (result.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
    }
    
    // Check if knex_migrations table exists
    const migrationsCheck = await client.query(`
      SELECT to_regclass('public.knex_migrations') as exists;
    `);
    
    if (migrationsCheck.rows[0].exists) {
      console.log('\n✅ knex_migrations table exists.');
      
      // Show applied migrations
      const migrations = await client.query('SELECT name, batch, migration_time FROM knex_migrations ORDER BY id');
      console.log('\n📝 Applied migrations:');
      if (migrations.rows.length === 0) {
        console.log('No migrations have been applied yet.');
      } else {
        migrations.rows.forEach(mig => {
          console.log(`- ${mig.name} (Batch: ${mig.batch}, Applied: ${mig.migration_time})`);
        });
      }
    } else {
      console.log('\n❌ knex_migrations table does not exist. Have you run your migrations?');
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkDatabase();
