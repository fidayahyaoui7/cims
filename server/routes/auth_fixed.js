const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
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

// Register new user (SQLite)
router.post('/register', async (req, res) => {
  console.log('Registration request received:', JSON.stringify(req.body, null, 2));
  
  try {
    const { name, email, password, phone, type, speciality, license, hospitalId } = req.body;

    // Input validation
    if (!name || !email || !password || !type) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Name, email, password, and type are required fields'
      });
    }

    // Check if user already exists
    console.log('Checking if user exists:', email);
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      console.log('Registration failed: User already exists');
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Start transaction
    console.log('Starting database transaction...');
    await db.run('BEGIN TRANSACTION');

    try {
      // Insert user
      console.log('Inserting new user into database...');
      const result = await db.run(
        'INSERT INTO users (name, email, password_hash, phone, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
        [name, email, hashedPassword, phone || null, type]
      );

      const userId = result.lastID;
      console.log('User created with ID:', userId);

      // If doctor, add to doctors table
      if (type === 'doctor' && (speciality || license)) {
        console.log('Adding doctor details...');
        await db.run(
          'INSERT INTO doctors (user_id, speciality, license_number, hospital_id, created_at, updated_at) VALUES (?, ?, ?, ?, datetime("now"), datetime("now"))',
          [userId, speciality || null, license || null, hospitalId || null]
        );
      }

      // Commit transaction
      await db.run('COMMIT');
      console.log('Transaction committed successfully');

      // Generate tokens
      const access = jwt.sign(
        { id: userId, email, type },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const refresh = jwt.sign(
        { id: userId, email, type },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      // Prepare user data
      const userData = {
        id: userId,
        name,
        email,
        phone: phone || null,
        type,
        role: type, // For backward compatibility
        userType: type, // For backward compatibility
        created_at: new Date().toISOString()
      };

      console.log('Registration successful for user:', email);
      
      // Send response
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: userData,
        access,
        refresh,
        token: access // For backward compatibility
      });

    } catch (error) {
      // Rollback transaction on error
      await db.run('ROLLBACK');
      console.error('Database error during registration:', error);
      throw error; // Re-throw to be caught by outer catch
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
  const { email, password } = req.body;
  
  // Input validation
  if (!email || !password) {
    console.log('Validation failed: Email and password are required');
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }
  
  try {
    // Get user from database
    console.log('Fetching user from database:', email);
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Verify password
    console.log('Verifying password...');
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate tokens
    console.log('Generating JWT tokens...');
    const access = jwt.sign(
      { id: user.id, email: user.email, type: user.type },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    const refresh = jwt.sign(
      { id: user.id, email: user.email, type: user.type },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Prepare user data
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      role: user.type, // For backward compatibility
      userType: user.type, // For backward compatibility
      phone: user.phone || null,
      created_at: user.created_at
    };

    console.log('Login successful for user:', user.email);
    
    // Send response
    res.json({
      success: true,
      message: 'Login successful',
      user: userData,
      access,
      refresh,
      token: access // For backward compatibility
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
    const user = await db.get(
      'SELECT id, name, email, phone, type, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        ...user,
        role: user.type, // For backward compatibility
        userType: user.type // For backward compatibility
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        error: 'Current and new password are required' 
      });
    }

    // Get user from database
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await db.run(
      'UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
