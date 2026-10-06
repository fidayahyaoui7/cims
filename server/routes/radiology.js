const express = require('express');
const router = express.Router();
const { getDb } = require('../database/database');
const { isAuthenticated } = require('../middleware/authMiddleware');

// GET /api/radiology/patient - Get all radiology results for the logged-in patient
router.get('/patient', isAuthenticated, (req, res) => {
  const patientId = req.user.id;

  const query = `
    SELECT r.*, d.name as doctor_name
    FROM radiology_results r
    JOIN users d ON r.doctor_id = d.id
    WHERE r.patient_id = ?
    ORDER BY r.created_at DESC
  `;

  try {
    const rows = getDb().prepare(query).all(patientId);
    res.json({ results: rows });
  } catch (err) {
    return res.status(500).json({ error: 'Database error while fetching radiology results.' });
  }
});

// GET /api/radiology/doctor - Get all radiology results for the logged-in doctor's patients
router.get('/doctor', isAuthenticated, (req, res) => {
  const doctorId = req.user.id;

  if (req.user.user_type !== 'doctor') {
    return res.status(403).json({ error: 'Access denied. You must be a doctor to view these results.' });
  }

  const query = `
    SELECT r.*, p.name as patient_name
    FROM radiology_results r
    JOIN users p ON r.patient_id = p.id
    WHERE r.doctor_id = ?
    ORDER BY r.created_at DESC
  `;

  try {
    const rows = getDb().prepare(query).all(doctorId);
    res.json({ results: rows });
  } catch (err) {
    return res.status(500).json({ error: 'Database error while fetching radiology results.' });
  }
});

// POST /api/radiology - Add a new radiology result (for doctors)
router.post('/', isAuthenticated, (req, res) => {
  if (req.user.user_type !== 'doctor') {
    return res.status(403).json({ error: 'Only doctors can add radiology results.' });
  }

  const { patient_id, appointment_id, result_type, report_text, image_url } = req.body;
  const doctor_id = req.user.id;

  if (!patient_id || !result_type || !report_text) {
    return res.status(400).json({ error: 'Missing required fields: patient_id, result_type, report_text.' });
  }

  const query = `
    INSERT INTO radiology_results (patient_id, doctor_id, appointment_id, result_type, report_text, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const result = getDb().prepare(query).run(patient_id, doctor_id, appointment_id, result_type, report_text, image_url);
    res.status(201).json({ message: 'Radiology result added successfully.', resultId: result.lastInsertRowid });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add radiology result.' });
  }
});

module.exports = router;
