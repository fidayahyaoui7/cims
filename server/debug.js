console.log('Starting server with debug logging...');

// Load environment variables first
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_PATH:', process.env.DB_PATH);

// Load database configuration
const db = require('./config/database');
console.log('Database configuration loaded');

// Test database connection
console.log('Testing database connection...');
db.testConnection()
  .then(isConnected => {
    console.log('Database connection test result:', isConnected);
    
    if (!isConnected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }
    
    // Start the server
    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 5002;
    
    // Basic middleware
    app.use(require('cors')());
    app.use(express.json());
    
    // Test route
    app.get('/api/test', (req, res) => {
      res.json({ message: 'API is working!' });
    });
    
    // Start listening
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
      process.exit(1);
    });
    
  })
  .catch(error => {
    console.error('Error during database connection test:', error);
    process.exit(1);
  });
