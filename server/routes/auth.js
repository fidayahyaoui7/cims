const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, transaction } = require('../database/db');
const router = express.Router();

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Register new user (PostgreSQL)
router.post('/register', async (req, res) => {
  console.log('Registration request received:', JSON.stringify(req.body, null, 2));
  
  try {
    const { name, email, password, phone, type, speciality, license, hospitalId } = req.body;

    // Validate input
    if (!name || !email || !password || !type) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, password, and type are required' 
      });
    }

    if (!['patient', 'doctor', 'admin'].includes(type)) {
      console.log('Validation failed: Invalid user type');
      return res.status(400).json({ 
        success: false,
        error: 'Invalid user type. Must be one of: patient, doctor, admin' 
      });
    }
    
    // Check if user already exists
    const userExists = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    if (type === 'doctor' && (!speciality || !license)) {
      console.log('Validation failed: Missing doctor details');
      return res.status(400).json({ 
        success: false,
        error: 'Speciality and license are required for doctors' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      // Check if user exists
      console.log('Checking if user exists:', email);
      const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);

      // Use transaction to ensure data consistency
      const result = await transaction(async (client) => {
        // Insert user
        const userResult = await client.query(
          'INSERT INTO users (name, email, password, type, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [name, email, hashedPassword, type, phone]
        );
        
        const userId = userResult.rows[0].id;
        
        // If doctor, insert into doctors table
        if (type === 'doctor') {
          await client.query(
            'INSERT INTO medecin (user_id, speciality, license_number, hospital_id) VALUES ($1, $2, $3, $4)',
            [userId, speciality, license, hospitalId]
          );
        }
        
        return { userId };
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: result.userId, email, type },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: result.userId,
            name,
            email,
            type,
            phone
          }
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Unexpected error during registration:', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  console.log('Login request received:', JSON.stringify(req.body, null, 2));
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    // Find user by email with doctor details if available
    const result = await query(
      `SELECT u.*, m.speciality, m.license_number, m.hospital_id 
       FROM users u 
       LEFT JOIN medecin m ON u.id = m.user_id 
       WHERE u.email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        type: user.type,
        speciality: user.speciality,
        hospitalId: user.hospital_id
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
          phone: user.phone,
          speciality: user.speciality,
          hospitalId: user.hospital_id
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'An error occurred during login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await query(
      `SELECT u.*, m.speciality, m.license_number, m.hospital_id 
       FROM users u 
       LEFT JOIN medecin m ON u.id = m.user_id 
       WHERE u.id = $1`,
      [userId]
    );

    const userProfile = user.rows[0];

    if (!userProfile) return res.status(404).json({ error: 'User not found' });

    res.json(userProfile);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    const result = await query(
      'UPDATE users SET name = $1, phone = $2 WHERE id = $3',
      [name, phone, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found or data is the same' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    // Get user from database
    const userResult = await query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await query('UPDATE users SET password = $1 WHERE id = $2', 
      [hashedPassword, req.user.id]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
});

module.exports = router;