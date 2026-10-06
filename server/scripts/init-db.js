const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Read the database configuration from environment variables
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default postgres database first
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
};

const dbName = process.env.DB_NAME || 'medical_appointments';
const pool = new Pool(dbConfig);

// Read the schema SQL file
const schemaPath = path.join(__dirname, '../database/schema.sql');
const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Creating database...');
    
    // Create the database if it doesn't exist
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Database ${dbName} created successfully`);
    
    // Close the connection to the default database
    await client.release();
    
    // Create a new connection to the newly created database
    const newConfig = { ...dbConfig, database: dbName };
    const newPool = new Pool(newConfig);
    const newClient = await newPool.connect();
    
    try {
      // Execute the schema SQL
      console.log('Creating tables...');
      await newClient.query(schemaSQL);
      console.log('Database schema created successfully');
      
      console.log('Database initialization completed successfully!');
    } finally {
      await newClient.release();
      await newPool.end();
    }
  } catch (error) {
    if (error.code === '42P04') {
      console.log(`Database ${dbName} already exists`);
    } else {
      console.error('Error initializing database:', error);
      process.exit(1);
    }
  } finally {
    await pool.end();
    process.exit(0);
  }
}

initializeDatabase();
