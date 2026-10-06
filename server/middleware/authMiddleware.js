const jwt = require('jsonwebtoken');
const db = require('../database/database');

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user from DB to ensure they exist and are not disabled/deleted
    const query = 'SELECT id, email, user_type FROM users WHERE id = ?';
    db.get(query, [decoded.userId], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error during authentication.' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Authentication failed. User not found.' });
      }
      
      req.user = user; // Add user object to the request
      next();
    });
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = { isAuthenticated };
