const express = require('express');
const router = express.Router();
const { getDb } = require('../database/database');
const { isAuthenticated } = require('../middleware/authMiddleware'); // Assuming you have this middleware
const { sendEmail } = require('../services/notificationService');

// GET /api/messages/inbox - Get all messages for the logged-in user
router.get('/inbox', isAuthenticated, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT m.*, s.name as sender_name, r.name as receiver_name
    FROM messages m
    JOIN users s ON m.sender_id = s.id
    JOIN users r ON m.receiver_id = r.id
    WHERE m.receiver_id = ? OR m.sender_id = ?
    ORDER BY m.created_at DESC
  `;

  try {
    const rows = getDb().prepare(query).all(userId, userId);
    res.json({ messages: rows });
  } catch (err) {
    return res.status(500).json({ error: 'Database error while fetching messages.' });
  }
});

// POST /api/messages - Send a new message
router.post('/', isAuthenticated, async (req, res) => {
  const { receiver_id, subject, body, appointment_id } = req.body;
  const sender_id = req.user.id;

  try {
    if (!receiver_id || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields: receiver_id, subject, body.' });
    }

    const result = getDb().prepare(
      "INSERT INTO messages (sender_id, receiver_id, subject, body, appointment_id) VALUES (?, ?, ?, ?, ?)"
    ).run(sender_id, receiver_id, subject, body, appointment_id);
    const messageId = result.lastInsertRowid;

    // Send email notification
    try {
      const sender = getDb().prepare("SELECT name FROM users WHERE id = ?").get(sender_id);
      const receiver = getDb().prepare("SELECT name, email FROM users WHERE id = ?").get(receiver_id);

      if (sender && receiver) {
        const emailSubject = `New Message from ${sender.name}`;
        const text = `Hi ${receiver.name},\n\nYou have received a new message from ${sender.name} regarding: ${subject}.\n\nPlease log in to your account to view the message.`;
        const html = `<p>Hi ${receiver.name},</p><p>You have received a new message from <strong>${sender.name}</strong> regarding: <strong>${subject}</strong>.</p><p>Please log in to your account to view the message.</p>`;
        await sendEmail(receiver.email, emailSubject, text, html);
      }
    } catch (emailError) {
      console.error('Failed to send message notification email:', emailError);
    }

    res.status(201).json({ message: 'Message sent successfully.', messageId });
  } catch (error) {
    console.error('Failed to send message:', error);
    res.status(500).json({ error: 'Server error while sending message.' });
  }
});

// PUT /api/messages/:id/read - Mark a message as read
router.put('/:id/read', isAuthenticated, (req, res) => {
  const messageId = req.params.id;
  const userId = req.user.id;

  // Ensure the user is the receiver of the message before marking as read
  const checkQuery = 'SELECT receiver_id FROM messages WHERE id = ?';
  try {
    const row = getDb().prepare(checkQuery).get(messageId);
    if (!row) {
      return res.status(404).json({ error: 'Message not found.' });
    }
    if (row.receiver_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to mark this message as read.' });
    }
    const updateQuery = 'UPDATE messages SET is_read = 1 WHERE id = ?';
    getDb().prepare(updateQuery).run(messageId);
    res.json({ message: 'Message marked as read.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to mark message as read.' });
  }
});

module.exports = router;
