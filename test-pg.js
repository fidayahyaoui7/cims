const { Pool } = require('pg');
require('dotenv').config();

console.log('Testing PostgreSQL connection...');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mon-app',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function testConnection() {
  const client = await pool.connect();
  try {
    console.log('\n🔍 Testing connection...');
    const res = await client.query('SELECT NOW() as time');
    console.log('✅ Connection successful. Current time:', res.rows[0].time);
    
    console.log('\n📋 Listing tables...');
    const tables = await client.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public'`
    );
    
    if (tables.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log('Found tables:');
      tables.rows.forEach((row, i) => {
        console.log(`${i + 1}. ${row.table_name}`);
      });
    }
    
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection();
