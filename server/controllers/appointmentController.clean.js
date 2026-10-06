const { db } = require('../database/db');

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await db('appointments').select('*');
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// Book a new appointment
const bookAppointment = async (req, res) => {
  try {
    const { 
      exam_type, 
      center_id, 
      center_name, 
      appointment_date, 
      patient_name, 
      patient_email, 
      patient_phone 
    } = req.body;

    if (!exam_type || !center_id || !center_name || !appointment_date || 
        !patient_name || !patient_email || !patient_phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [appointment] = await db('appointments').insert({
      exam_type,
      center_id,
      center_name,
      appointment_date: new Date(appointment_date),
      patient_name,
      patient_email,
      patient_phone,
      status: 'scheduled',
      created_at: new Date(),
      updated_at: new Date()
    }).returning('*');

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [appointment] = await db('appointments')
      .where({ id })
      .update({
        status,
        updated_at: new Date()
      })
      .returning('*');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
};

// Get appointments by patient email
const getPatientAppointments = async (req, res) => {
  try {
    const { email } = req.params;
    const appointments = await db('appointments')
      .where('patient_email', email)
      .orderBy('appointment_date', 'asc');
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ error: 'Failed to fetch patient appointments' });
  }
};

module.exports = {
  getAppointments,
  bookAppointment,
  updateAppointmentStatus,
  getPatientAppointments
};
