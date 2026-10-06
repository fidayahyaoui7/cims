const express = require('express');
const router = express.Router();
const { 
  bookAppointment, 
  getUserAppointments, 
  cancelAppointment, 
  updateAppointmentStatus 
} = require('../controllers/appointmentController');

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
  
  let query = `
  SELECT 
    a.*,
    p.name as patient_name,
    p.email as patient_email,
    du.name as doctor_name,
    d.license_number,
    mc.name as center_name,
    mc.address as center_address
  FROM appointments a
  JOIN users p ON a.patient_id = p.id
  JOIN doctors d ON a.doctor_id = d.id
  JOIN users du ON d.user_id = du.id
  JOIN medical_centers mc ON a.center_id = mc.id
`;
  let whereConditions = [];
  let params = [];
  
  // If not admin, only show user's appointments
  if (req.user.userType !== 'admin') {
    whereConditions.push("a.patient_id = ?");
    params.push(req.user.id);
  }
  
  if (status) {
    whereConditions.push("a.status = ?");
    params.push(status);
  }
  
  if (date) {
    whereConditions.push("a.appointment_date = ?");
    params.push(date);
  }
  
  if (whereConditions.length > 0) {
    query += " WHERE " + whereConditions.join(" AND ");
  }
  
  query += " ORDER BY a.appointment_date DESC, a.appointment_time DESC";
  
  try {
    const appointments = getDb().prepare(query).all(...params);
    res.json({ appointments });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Get available time slots for a doctor on a specific date
router.get('/slots/:doctorId/:date', (req, res) => {
  const { doctorId, date } = req.params;
  
  // Generate time slots (8 AM to 6 PM, 1-hour intervals)
  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  
  // Get booked slots for this doctor on this date
  try {
    const bookedSlots = getDb().prepare(
      "SELECT appointment_time FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND status != 'cancelled'"
    ).all(doctorId, date);
    const bookedTimes = bookedSlots.map(slot => slot.appointment_time);
    const availableSlots = timeSlots.filter(slot => !bookedTimes.includes(slot));
    res.json({ availableSlots });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Get appointments for a specific doctor
router.get('/doctor/:doctorId', authenticateToken, (req, res) => {
  const { doctorId } = req.params;
  const { date, status } = req.query;
  let query = `
  SELECT 
    a.*,
    p.name as patient_name,
    p.email as patient_email,
    du.name as doctor_name,
    mc.name as center_name
  FROM appointments a
  JOIN users p ON a.patient_id = p.id
  JOIN doctors d ON a.doctor_id = d.id
  JOIN users du ON d.user_id = du.id
  JOIN medical_centers mc ON a.center_id = mc.id
  WHERE a.doctor_id = ?
`;
  
  let params = [doctorId];
  
  if (date) {
    query += " AND a.appointment_date = ?";
    params.push(date);
  }
  
  if (status) {
    query += " AND a.status = ?";
    params.push(status);
  }
  
  query += " ORDER BY a.appointment_date, a.appointment_time";
  try {
    const appointments = getDb().prepare(query).all(...params);
    res.json({ appointments });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Get appointment by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  const query = `
  SELECT 
    a.*,
    p.name as patient_name,
    p.email as patient_email,
    p.phone as patient_phone,
    du.name as doctor_name,
    d.license_number,
    mc.name as center_name,
    mc.address as center_address,
    mc.phone as center_phone
  FROM appointments a
  JOIN users p ON a.patient_id = p.id
  JOIN doctors d ON a.doctor_id = d.id
  JOIN users du ON d.user_id = du.id
  JOIN medical_centers mc ON a.center_id = mc.id
  WHERE a.id = ?
`;
  
  try {
    const appointment = getDb().prepare(query).get(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (req.user.userType !== 'admin' && appointment.patient_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ appointment });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Create new appointment
// Book a new appointment
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Add patient_id from the authenticated user
    req.body.patient_id = req.user.id;
    await bookAppointment(req, res);
    // Validate input
    if (!doctorId || !centerId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if doctor exists
    const doctor = getDb().prepare("SELECT * FROM doctors WHERE id = ?").get(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if time slot is available
    const slotCheck = getDb().prepare(
      "SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'cancelled'"
    ).get(doctorId, appointmentDate, appointmentTime);

    if (slotCheck.count > 0) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    // Create appointment
    const result = getDb().prepare(
      "INSERT INTO appointments (patient_id, doctor_id, center_id, appointment_date, appointment_time, notes) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(patientId, doctorId, centerId, appointmentDate, appointmentTime, notes);
    const appointmentId = result.lastInsertRowid;

    // Send confirmation email
    try {
      const patient = getDb().prepare("SELECT name, email FROM users WHERE id = ?").get(patientId);
      const doctorUser = getDb().prepare("SELECT u.name FROM users u JOIN doctors d ON u.id = d.user_id WHERE d.id = ?").get(doctorId);
      const center = getDb().prepare("SELECT name FROM medical_centers WHERE id = ?").get(centerId);

      if (patient && doctorUser && center) {
        const subject = 'Appointment Confirmation';
        const text = `Hi ${patient.name},\n\nYour appointment with Dr. ${doctorUser.name} at ${center.name} on ${appointmentDate} at ${appointmentTime} has been successfully booked.`;
        const html = `<p>Hi ${patient.name},</p><p>Your appointment with <strong>Dr. ${doctorUser.name}</strong> at <strong>${center.name}</strong> on <strong>${appointmentDate}</strong> at <strong>${appointmentTime}</strong> has been successfully booked.</p>`;
        await sendEmail(patient.email, subject, text, html);
      }
    } catch (emailError) {
      console.error('Failed to send appointment confirmation email:', emailError);
    }

    res.status(201).json({
      message: 'Appointment created successfully',
      appointmentId,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error during appointment creation' });
  }
});

// Helper function to perform the status update
const performStatusUpdate = (res, status, id) => {
  try {
    getDb().prepare("UPDATE appointments SET status = ? WHERE id = ?").run(status, id);
    res.json({ message: 'Appointment status updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating appointment' });
  }
};

// Update appointment status
router.put('/:id/status', authenticateToken, updateAppointmentStatus);

// Cancel an appointment
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    req.params.appointmentId = req.params.id;
    await cancelAppointment(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel appointment' });
    const appointment = getDb().prepare("SELECT * FROM appointments WHERE id = ?").get(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (req.user.userType === 'admin') {
      return performStatusUpdate(res, status, id);
    }
    if (req.user.userType === 'patient' && appointment.patient_id === req.user.id) {
      return performStatusUpdate(res, status, id);
    }
    if (req.user.userType === 'doctor') {
      const doctor = getDb().prepare("SELECT id FROM doctors WHERE user_id = ?").get(req.user.id);
      if (doctor && doctor.id === appointment.doctor_id) {
        return performStatusUpdate(res, status, id);
      } else {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.userType !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Cancel appointment
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  // Check if appointment exists and user has access
  try {
    const appointment = getDb().prepare("SELECT * FROM appointments WHERE id = ?").get(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (req.user.userType !== 'admin' && appointment.patient_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    getDb().prepare("UPDATE appointments SET status = 'cancelled' WHERE id = ?").run(id);
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error cancelling appointment' });
  }
});

module.exports = router;