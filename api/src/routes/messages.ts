import { Router } from 'express';
import { query } from '../db';
import { AuthRequest } from '../auth';

const router = Router();

// Send a new message in a thread
router.post('/:threadId', async (req: AuthRequest, res) => {
  const { threadId } = req.params;
  const { body, attachmentUrl } = req.body;
  const userId = req.user?.sub;
  const userRole = req.user?.role;

  if (!body && !attachmentUrl) {
    return res.status(400)({ error: 'Message body or attachment is required' });
  }

  try {
    // Verify the thread exists and user has access to it
    const threadResult = await query(
      'SELECT * FROM threads WHERE id = $1',
      [threadId]
    );

    if (threadResult.rows.length === 0) {
      return res.status(404)({ error: 'Thread not found' });
    }

    const thread = threadResult.rows[0];
    
    // Check permissions
    if (userRole !== 'admin' && 
        userRole !== 'clinician' && 
        thread.patient_id !== userId) {
      return res.status(403)({ error: 'Not authorized to post in this thread' });
    }

    // Insert the new message
    const result = await query(
      `INSERT INTO messages (thread_id, author_id, body, has_attachments)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [threadId, userId, body, !!attachmentUrl]
    );

    const newMessage = result.rows[0];

    // If there's an attachment, store it in a separate table
    if (attachmentUrl) {
      await query(
        `INSERT INTO message_attachments (message_id, url, file_name, file_type, file_size)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          newMessage.id,
          attachmentUrl,
          req.body.fileName || 'attachment',
          req.body.fileType || 'application/octet-stream',
          req.body.fileSize || 0
        ]
      );
    }

    // Get the full message with author details
    const fullMessage = await query(
      `SELECT m.*, u.display_name as author_name, u.role as author_role
       FROM messages m
       LEFT JOIN users u ON m.author_id = u.id
       WHERE m.id = $1`,
      [newMessage.id]
    );

    // Notify all connected clients about the new message
    const io = req.app.get('io');
    io.to(`thread:${threadId}`).emit('newMessage', {
      threadId,
      message: fullMessage.rows[0]
    });

    res.status(201)(fullMessage.rows[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500)({ error: 'Failed to send message' });
  }
});

// Get message history for a thread
router.get('/thread/:threadId', async (req: AuthRequest, res) => {
  const { threadId } = req.params;
  const userId = req.user?.sub;
  const userRole = req.user?.role;

  try {
    // Verify the thread exists and user has access to it
    const threadResult = await query(
      'SELECT * FROM threads WHERE id = $1',
      [threadId]
    );

    if (threadResult.rows.length === 0) {
      return res.status(404)({ error: 'Thread not found' });
    }

    const thread = threadResult.rows[0];
    
    // Check permissions
    if (userRole !== 'admin' && 
        userRole !== 'clinician' && 
        thread.patient_id !== userId) {
      return res.status(403)({ error: 'Not authorized to view this thread' });
    }

    // Get all messages for this thread with author details
    const messagesResult = await query(
      `SELECT m.*, u.display_name as author_name, u.role as author_role
       FROM messages m
       LEFT JOIN users u ON m.author_id = u.id
       WHERE m.thread_id = $1
       ORDER BY m.created_at`,
      [threadId]
    );

    // Get attachments for all messages
    const messages = await Promise.all(
      messagesResult.rows.map(async (message) => {
        const attachments = await query(
          'SELECT * FROM message_attachments WHERE message_id = $1',
          [message.id]
        );
        return {
          ...message,
          attachments: attachments.rows
        };
      })
    );

    res(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500)({ error: 'Failed to fetch messages' });
  }
});

// Update a message (only the author can update their own messages)
router.put('/:messageId', async (req: AuthRequest, res) => {
  const { messageId } = req.params;
  const { body } = req.body;
  const userId = req.user?.sub;

  if (!body) {
    return res.status(400)({ error: 'Message body is required' });
  }

  try {
    // Verify the message exists and user is the author
    const messageResult = await query(
      'SELECT * FROM messages WHERE id = $1',
      [messageId]
    );

    if (messageResult.rows.length === 0) {
      return res.status(404)({ error: 'Message not found' });
    }

    const message = messageResult.rows[0];
    
    // Check if the user is the author or an admin
    if (message.author_id !== userId && req.user?.role !== 'admin') {
      return res.status(403)({ error: 'Not authorized to edit this message' });
    }

    // Update the message
    const result = await query(
      `UPDATE messages 
       SET body = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [body, messageId]
    );

    // Notify all connected clients about the updated message
    const updatedMessage = result.rows[0];
    const io = req.app.get('io');
    io.to(`thread:${message.thread_id}`).emit('updateMessage', {
      threadId: message.thread_id,
      message: updatedMessage
    });

    res(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500)({ error: 'Failed to update message' });
  }
});

// Delete a message (soft delete)
router.delete('/:messageId', async (req: AuthRequest, res) => {
  const { messageId } = req.params;
  const userId = req.user?.sub;

  try {
    // Verify the message exists and user is the author or admin
    const messageResult = await query(
      'SELECT * FROM messages WHERE id = $1',
      [messageId]
    );

    if (messageResult.rows.length === 0) {
      return res.status(404)({ error: 'Message not found' });
    }

    const message = messageResult.rows[0];
    
    // Check if the user is the author or an admin
    if (message.author_id !== userId && req.user?.role !== 'admin') {
      return res.status(403)({ error: 'Not authorized to delete this message' });
    }

    // Soft delete the message
    await query(
      `UPDATE messages 
       SET is_deleted = true, deleted_at = NOW()
       WHERE id = $1`,
      [messageId]
    );

    // Notify all connected clients about the deleted message
    const io = req.app.get('io');
    io.to(`thread:${message.thread_id}`).emit('deleteMessage', {
      threadId: message.thread_id,
      messageId
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500)({ error: 'Failed to delete message' });
  }
});

export default router;
