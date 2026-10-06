const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default database first
  password: process.env.DB_PASSWORD || '12345678',
  port: process.env.DB_PORT || 5432,
});

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    // Create database if not exists
    await client.query(`
      SELECT 'CREATE DATABASE ${process.env.DB_NAME || 'mon-app'}'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${process.env.DB_NAME || 'mon-app'}')\gexec
    `);

    console.log('Database created or already exists');
    
    // Connect to the new database
    await client.end();
    pool.end();
    
    const appPool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'mon-app',
      password: process.env.DB_PASSWORD || '12345678',
      port: process.env.DB_PORT || 5432,
    });
    
    const appClient = await appPool.connect();
    
    // Create tables
    await appClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        is_verified BOOLEAN DEFAULT false,
        verification_token VARCHAR(255),
        reset_password_token VARCHAR(255),
        reset_password_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS hospitals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(100),
        website VARCHAR(255),
        description TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS hospital_services (
        hospital_id INTEGER REFERENCES hospitals(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        PRIMARY KEY (hospital_id, service_id)
      );
      
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        hospital_id INTEGER REFERENCES hospitals(id) ON DELETE SET NULL,
        service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
        appointment_date TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_hospital_id ON appointments(hospital_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    `);
    
    console.log('Tables created successfully');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    if (client) await client.release();
    if (appPool) await appPool.end();
    process.exit(0);
  }
}

initDatabase();
