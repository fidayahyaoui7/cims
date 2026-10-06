const express = require('express');
const { getDb } = require('../database/database');

const router = express.Router();

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
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get all doctors
router.get('/doctors', (req, res) => {
  const { specialty, centerId } = req.query;
  
  let query = `
    SELECT 
      d.*,
      u.name,
      u.email,
      u.phone,
      mc.name as center_name,
      mc.address as center_address
    FROM doctors d
    JOIN users u ON d.user_id = u.id
    JOIN medical_centers mc ON d.center_id = mc.id
  `;
  
  let whereConditions = [];
  let params = [];
  
  if (specialty) {
    whereConditions.push("d.specialty = ?");
    params.push(specialty);
  }
  
  if (centerId) {
    whereConditions.push("d.center_id = ?");
    params.push(centerId);
  }
  
  if (whereConditions.length > 0) {
    query += " WHERE " + whereConditions.join(" AND ");
  }
  
  query += " ORDER BY u.name";
  
  try {
    const doctors = getDb().prepare(query).all(...params);
    res.json({ doctors });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Get doctor by ID
router.get('/doctors/:id', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      d.*,
      u.name,
      u.email,
      u.phone,
      mc.name as center_name,
      mc.address as center_address,
      mc.phone as center_phone
    FROM doctors d
    JOIN users u ON d.user_id = u.id
    JOIN medical_centers mc ON d.center_id = mc.id
    WHERE d.id = ?
  `;
  
  try {
    const doctor = getDb().prepare(query).get(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ doctor });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Get doctors by center
router.get('/doctors/center/:centerId', (req, res) => {
  const { centerId } = req.params;
  
  const query = `
    SELECT 
      d.*,
      u.name,
      u.email,
      u.phone
    FROM doctors d
    JOIN users u ON d.user_id = u.id
    WHERE d.center_id = ?
    ORDER BY u.name
  `;
  
  try {
    const doctors = getDb().prepare(query).all(centerId);
    res.json({ doctors });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Get doctors by specialty
router.get('/doctors/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  
  const query = `
    SELECT 
      d.*,
      u.name,
      u.email,
      u.phone,
      mc.name as center_name,
      mc.address as center_address
    FROM doctors d
    JOIN users u ON d.user_id = u.id
    JOIN medical_centers mc ON d.center_id = mc.id
    WHERE d.specialty = ?
    ORDER BY u.name
  `;
  
  try {
    const doctors = getDb().prepare(query).all(specialty);
    res.json({ doctors });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Get all specialties
router.get('/specialties', (req, res) => {
  try {
    const specialties = getDb().prepare("SELECT DISTINCT specialty FROM doctors ORDER BY specialty").all();
    res.json({ specialties: specialties.map(s => s.specialty) });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Get current user's profile
router.get('/profile', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      u.id,
      u.email,
      u.name,
      u.phone,
      u.user_type,
      u.created_at
    FROM users u
    WHERE u.id = ?
  `;
  
  try {
    const user = getDb().prepare(query).get(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.user_type === 'doctor') {
      const doctorQuery = `
        SELECT 
          d.*,
          mc.name as center_name,
          mc.address as center_address
        FROM doctors d
        JOIN medical_centers mc ON d.center_id = mc.id
        WHERE d.user_id = ?
      `;
      const doctorInfo = getDb().prepare(doctorQuery).get(req.user.id);
      return res.json({ user: { ...user, doctorInfo } });
    }
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  const { name, phone } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }
  
  try {
    const result = getDb().prepare("UPDATE users SET name = ?, phone = ? WHERE id = ?").run(name, phone, req.user.id);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Error updating profile' });
    }
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating profile' });
  }
});

// Get user's appointments
router.get('/appointments', authenticateToken, (req, res) => {
  const { status, date } = req.query;
  
  let query = `
    SELECT 
      a.*,
      d.license_number,
      mc.name as center_name,
      mc.address as center_address
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    JOIN medical_centers mc ON a.center_id = mc.id
    WHERE a.patient_id = ?
  `;
  
  let params = [req.user.id];
  
  if (status) {
    query += " AND a.status = ?";
    params.push(status);
  }
  
  if (date) {
    query += " AND a.appointment_date = ?";
    params.push(date);
  }
  
  query += " ORDER BY a.appointment_date DESC, a.appointment_time DESC";
  
  try {
    const appointments = getDb().prepare(query).all(...params);
    res.json({ appointments });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Get doctor's appointments (if user is a doctor)
router.get('/doctor/appointments', authenticateToken, (req, res) => {
  if (req.user.userType !== 'doctor') {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  const { status, date } = req.query;
  
  // First get the doctor record
  try {
    const doctor = getDb().prepare("SELECT id FROM doctors WHERE user_id = ?").get(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    let query = `
      SELECT 
        a.*,
        p.name as patient_name,
        p.email as patient_email,
        p.phone as patient_phone,
        mc.name as center_name
      FROM appointments a
      JOIN users p ON a.patient_id = p.id
      JOIN medical_centers mc ON a.center_id = mc.id
      WHERE a.doctor_id = ?
    `;
    let params = [doctor.id];
    if (status) {
      query += " AND a.status = ?";
      params.push(status);
    }
    if (date) {
      query += " AND a.appointment_date = ?";
      params.push(date);
    }
    query += " ORDER BY a.appointment_date, a.appointment_time";
    const appointments = getDb().prepare(query).all(...params);
    res.json({ appointments });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

module.exports = router; 