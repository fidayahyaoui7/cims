import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function attachRealtime(httpServer) {
  const origin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  const io = new Server(httpServer, { cors: { origin: [origin] } });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('No token'));
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
      socket.user = payload;
      next();
    } catch {
      next(new Error('Bad token'));
    }
  });

  io.on('connection', (socket) => {
    prisma.conversationMember
      .findMany({ where: { userId: socket.user.sub } })
      .then((ms) => ms.forEach((m) => socket.join(`conv:${m.conversationId}`)));

    socket.on('message:send', async ({ conversationId, content, contentType }) => {
      const member = await prisma.conversationMember.findFirst({
        where: { conversationId, userId: socket.user.sub },
      });
      if (!member) return;

      const msg = await prisma.message.create({
        data: {
          conversationId,
          senderId: socket.user.sub,
          content,
          contentType: contentType || 'text/plain',
        },
      });
      io.to(`conv:${conversationId}`).emit('message:new', msg);
    });
  });

  return io;
}
