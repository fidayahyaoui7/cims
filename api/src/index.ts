import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './auth';
import { query } from './db';

// Import routes
import threadsRouter from './routes/threads';
import messagesRouter from './routes/messages';
import uploadRouter from './routes/uploads';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/threads', authenticateToken, threadsRouter);
app.use('/api/messages', authenticateToken, messagesRouter);
app.use('/api/uploads', authenticateToken, uploadRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// WebSocket setup
const io = new Server(server, { 
  path: '/ws',
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

io.use((socket: any, next) => {
  const token = socket.handshake.auth?.token || 
               socket.handshake.headers['authorization']?.split(' ')[1];
  
  if (!token) return next(new Error('Authentication error'));
  
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = process.env.NODE_ENV === 'production'
      ? jwt.verify(token, secret)
      : jwt.decode(token);
    
    if (!payload || typeof payload === 'string') {
      return next(new Error('Invalid token'));
    }
    
    const user = payload as { sub: string; roles?: string[]; [key: string]: any };
    socket.user = user;
    next();
  } catch (err) {
    return next(new Error('Invalid token'));
  }
});

io.on('connection', (socket: any) => {
  console.log('New client connected:', socket.user?.sub);
  
  socket.on('joinThread', ({ threadId }: { threadId: string }) => {
    socket.join(`thread:${threadId}`);
    console.log(`User ${socket.user?.sub} joined thread ${threadId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.user?.sub);
  });
});

app.set('io', io);

// Database initialization
async function initializeDatabase() {
  try {
    // Check if the threads table exists
    const result = await query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'threads')",
      []
    );
    
    if (!result.rows[0].exists) {
      console.log('Initializing database schema...');
      // Run the schema.sql file
      const fs = require('fs');
      const path = require('path');
      const schema = fs.readFileSync(path.join(__dirname, '../sql/schema.sql'), 'utf8');
      await query(schema);
      console.log('Database schema initialized');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Start the server
const PORT = process.env.PORT || 4000;
async function startServer() {
  try {
    await initializeDatabase();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
