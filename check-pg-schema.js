const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mon-app',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function checkSchema() {
  const client = await pool.connect();
  
  try {
    // Get list of all tables
    console.log('\n=== Database Tables ===');
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    const tables = await client.query(tablesQuery);
    
    for (const row of tables.rows) {
      const tableName = row.table_name;
      console.log(`\nTable: ${tableName}`);
      
      // Get table columns
      const columnsQuery = `
        SELECT 
          column_name, 
          data_type, 
          is_nullable, 
          column_default
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `;
      
      const columns = await client.query(columnsQuery, [tableName]);
      console.table(columns.rows);
      
      // Get row count
      const count = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
      console.log(`  Rows: ${count.rows[0].count}`);
    }
    
    // Check knex migrations
    console.log('\n=== Knex Migrations ===');
    try {
      const migrations = await client.query('SELECT * FROM knex_migrations ORDER BY id');
      console.table(migrations.rows);
    } catch (err) {
      console.error('Error checking migrations:', err.message);
    }
    
  } catch (err) {
    console.error('Error checking database schema:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchema().catch(console.error);
