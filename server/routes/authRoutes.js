const express = require('express');
const { 
  register, 
  login, 
  verifyEmail,
  getProfile, 
  authenticateToken, 
  authorizeRole 
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);

// Protected routes (require authentication)
router.get('/me', authenticateToken, getProfile);

// Admin only routes
router.get('/admin/users', 
  authenticateToken, 
  authorizeRole(['admin']), 
  (req, res) => {
    // List all users (admin only)
    res.json({ message: 'Admin access granted' });
  }
);

module.exports = router;
