const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mon-app',
  password: process.env.DB_PASSWORD || '12345678',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  const client = await pool.connect();
  try {
    console.log('Testing database connection...');
    const res = await client.query('SELECT NOW() as time');
    console.log('✅ Database connection successful!');
    console.log('Current time from database:', res.rows[0].time);
    
    // List all tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nTables in the database:');
    console.log(tables.rows.map(r => r.table_name).join('\n'));
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
