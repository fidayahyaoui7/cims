const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

async function testConnection() {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'mon-app',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Attempting to connect to PostgreSQL database...');
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as time');
    console.log('✅ Database connection successful!');
    console.log('Current time from database:', res.rows[0].time);
    
    // List all tables in the database
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nTables in the database:');
    console.log(tables.rows.map(r => r.table_name).join('\n'));
    
    await client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Connection details:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      ssl: process.env.DB_SSL
    });
    return false;
  } finally {
    await pool.end();
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
