const { query, getClient } = require('../database/pg-connection');

// Helper function to handle database queries
const executeQuery = async (text, params = []) => {
  try {
    const result = await query(text, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Helper function to handle transactions
const executeTransaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Book a new appointment
const bookAppointment = async (req, res) => {
  const client = await getClient();
  try {
    const {
      exam_type,
      center_id,
      patient_id,
      appointment_date,
      notes,
      status = 'scheduled'
    } = req.body;

    // Validate required fields
    if (!exam_type || !center_id || !patient_id || !appointment_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await client.query('BEGIN');

    // Insert new appointment
    const result = await client.query(
      `INSERT INTO appointments 
       (exam_type, center_id, patient_id, appointment_date, status, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [exam_type, center_id, patient_id, appointment_date, status, notes]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error booking appointment:', error);
    res.status(500).json({ 
      error: 'Failed to book appointment',
      details: error.message 
    });
  } finally {
    client.release();
  }
};

// Get appointments for a user
const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 10, offset = 0 } = req.query;

    let query = `
      SELECT a.*, h.name as hospital_name, h.address as hospital_address
      FROM appointments a
      JOIN hospitals h ON a.center_id = h.id
      WHERE a.patient_id = $1
    `;
    
    const queryParams = [userId];
    
    if (status) {
      query += ' AND a.status = $2';
      queryParams.push(status);
    }
    
    query += ' ORDER BY a.appointment_date DESC LIMIT $' + (queryParams.length + 1);
    queryParams.push(parseInt(limit));
    
    if (offset) {
      query += ' OFFSET $' + (queryParams.length + 1);
      queryParams.push(parseInt(offset));
    }

    const result = await query(query, queryParams);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM appointments WHERE patient_id = $1';
    const countParams = [userId];
    
    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    }
    
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      appointments: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + result.rows.length) < total
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ 
      error: 'Failed to fetch appointments',
      details: error.message 
    });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  const client = await getClient();
  
  try {
    const { appointmentId } = req.params;
    const { cancelReason } = req.body;
    const userId = req.user?.id;

    await client.query('BEGIN');

    // First, verify the appointment exists and belongs to the user
    const appointmentResult = await client.query(
      'SELECT * FROM appointments WHERE id = $1 AND (patient_id = $2 OR $2 IS NULL)',
      [appointmentId, userId]
    );

    if (appointmentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or access denied'
      });
    }

    const appointment = appointmentResult.rows[0];
    
    // Update appointment status to cancelled
    await client.query(
      'UPDATE appointments SET status = $1, cancel_reason = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      ['cancelled', cancelReason, appointmentId]
    );

    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: {
        id: appointmentId,
        status: 'cancelled',
        cancelReason
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message 
    });
  } finally {
    client.release();
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  const client = await getClient();
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!['scheduled', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE appointments 
       SET status = $1, 
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, appointmentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await client.query('COMMIT');

    res.json({
      message: 'Appointment status updated successfully',
      appointment: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating appointment status:', error);
    res.status(500).json({ 
      error: 'Failed to update appointment status',
      details: error.message 
    });
  } finally {
    client.release();
  }
};

module.exports = {
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
  updateAppointmentStatus
};
