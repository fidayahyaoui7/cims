const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  bookAppointment,
  getPatientAppointments,
  cancelAppointment
} = require('../controllers/appointmentController');

// Book a new appointment
router.post('/', authenticateToken, bookAppointment);

// Get appointments for logged-in patient
router.get('/my-appointments', authenticateToken, (req, res) => {
  // The authenticateToken middleware adds the user to req.user
  getPatientAppointments({ ...req, params: { email: req.user.email } }, res);
});

// Cancel an appointment
router.delete('/:id/cancel', authenticateToken, cancelAppointment);

module.exports = router;
