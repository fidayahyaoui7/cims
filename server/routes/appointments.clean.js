const express = require('express');
const router = express.Router();
const {
  getAppointments,
  bookAppointment,
  updateAppointmentStatus,
  getPatientAppointments
} = require('../controllers/appointmentController.clean');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get all appointments (protected route)
router.get('/', authenticateToken, getAppointments);

// Book a new appointment (protected route)
router.post('/', authenticateToken, bookAppointment);

// Update appointment status (protected route)
router.put('/:id/status', authenticateToken, updateAppointmentStatus);

// Get appointments by patient email (protected route)
router.get('/patient/:email', authenticateToken, getPatientAppointments);

module.exports = router;
