import { Router } from 'express';
import { query } from '../db';
import { AuthRequest } from '../auth';

const router = Router();

// Create a new thread
router.post('/', async (req: AuthRequest, res) => {
  const { title, patientId } = req.body;
  const userId = req.user?.sub;

  if (!title || !patientId) {
    return res.status(400).json({ error: 'Title and patient ID are required' });
  }

  try {
    const result = await query(
      'INSERT INTO threads (title, patient_id, created_by) VALUES ($1, $2, $3) RETURNING *',
      [title, patientId, userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ error: 'Failed to create thread' });
  }
});

// Get all threads for the current user
router.get('/', async (req: AuthRequest, res) => {
  const userId = req.user?.sub;
  const userRole = req.user?.role;

  try {
    let result;
    
    if (userRole === 'clinician' || userRole === 'admin') {
      // Clinicians and admins can see all threads
      result = await query(
        `SELECT t.*, u.display_name as patient_name 
         FROM threads t
         LEFT JOIN users u ON t.patient_id = u.id
         ORDER BY t.created_at DESC`
      );
    } else {
      // Patients can only see their own threads
      result = await query(
        `SELECT t.*, u.display_name as patient_name 
         FROM threads t
         LEFT JOIN users u ON t.patient_id = u.id
         WHERE t.patient_id = $1
         ORDER BY t.created_at DESC`,
        [userId]
      );
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching threads:', error);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// Get a single thread with its messages
router.get('/:id', async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.sub;
  const userRole = req.user?.role;

  try {
    // First verify the user has access to this thread
    const threadResult = await query(
      `SELECT t.*, u.display_name as patient_name 
       FROM threads t
       LEFT JOIN users u ON t.patient_id = u.id
       WHERE t.id = $1`,
      [id]
    );

    if (threadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const thread = threadResult.rows[0];
    
    // Check permissions
    if (userRole !== 'admin' && userRole !== 'clinician' && thread.patient_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to view this thread' });
    }

    // Get messages for this thread
    const messagesResult = await query(
      `SELECT m.*, u.display_name as author_name 
       FROM messages m
       LEFT JOIN users u ON m.author_id = u.id
       WHERE m.thread_id = $1
       ORDER BY m.created_at`,
      [id]
    );

    res.json({
      ...thread,
      messages: messagesResult.rows
    });
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
});

// Update a thread (e.g., archive it)
router.patch('/:id', async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { is_archived } = req.body;
  const userId = req.user?.sub;

  if (typeof is_archived !== 'boolean') {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const result = await query(
      `UPDATE threads 
       SET is_archived = $1, updated_at = NOW()
       WHERE id = $2 AND (created_by = $3 OR $3 IN (SELECT id FROM users WHERE role = 'admin'))
       RETURNING *`,
      [is_archived, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Thread not found or not authorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating thread:', error);
    res.status(500).json({ error: 'Failed to update thread' });
  }
});

export default router;
