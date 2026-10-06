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

async function updateSchema() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Updating database schema...');
    
    // 1. Create missing tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        region VARCHAR(100),
        country VARCHAR(100) DEFAULT 'Tunisia',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS hospitals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        type VARCHAR(50),
        address TEXT,
        city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
        phone VARCHAR(20),
        emergency_phone VARCHAR(20),
        email VARCHAR(100),
        website VARCHAR(200),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS hospital_services (
        hospital_id INTEGER REFERENCES hospitals(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (hospital_id, service_id)
      );
    `);
    
    // 2. Update existing tables if needed
    // (Add any necessary ALTER TABLE statements here)
    
    await client.query('COMMIT');
    console.log('✅ Database schema updated successfully');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error updating database schema:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

updateSchema().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
