const express = require('express');
const router = express.Router();
const { 
  bookAppointment, 
  getUserAppointments, 
  cancelAppointment, 
  updateAppointmentStatus 
} = require('../controllers/appointmentController');
const { query } = require('../database/pg-connection');

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

// Get user's appointments
router.get('/user/:userId', authenticateToken, getUserAppointments);

// Book a new appointment
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Add patient_id from the authenticated user
    req.body.patient_id = req.user.id;
    await bookAppointment(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment status
router.put('/:id/status', authenticateToken, updateAppointmentStatus);

// Cancel an appointment
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    req.params.appointmentId = req.params.id;
    await cancelAppointment(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

// Get appointment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT a.*, h.name as hospital_name, h.address as hospital_address ' +
      'FROM appointments a ' +
      'JOIN hospitals h ON a.center_id = h.id ' +
      'WHERE a.id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Ensure the user has permission to view this appointment
    const appointment = result.rows[0];
    if (req.user.id !== appointment.patient_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this appointment' });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

module.exports = router;
 