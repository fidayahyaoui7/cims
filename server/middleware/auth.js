const jwt = require('jsonwebtoken');
const { pool } = require('../config/postgres');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Access token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ status: 'error', message: 'Invalid or expired token' });
    }

    try {
      // Verify user exists in database
      const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [user.userId]);
      
      if (rows.length === 0) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }

      req.user = rows[0];
      next();
    } catch (error) {
      console.error('Database error during authentication:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  });
};

const authorizeRole = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'You do not have permission to perform this action' 
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
};
