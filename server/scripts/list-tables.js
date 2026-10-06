const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mon-app',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

async function listTables() {
  const client = await pool.connect();
  try {
    console.log('🔍 Listing all tables in the database...');
    
    // List all tables in the public schema
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
    
  } catch (error) {
    console.error('❌ Error listing tables:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

listTables();
