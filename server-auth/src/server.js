import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import { attachRealtime } from './realtime.js';
import multer from 'multer';
import { putObject, getSignedUrlForKey } from './storage.js';

const app = express();
const prisma = new PrismaClient();

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(helmet());
app.use(cors({ origin: [CORS_ORIGIN], credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

const JWT_ACCESS_TTL = '15m';
const JWT_REFRESH_TTL = '30d';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'dev-refresh';

const signAccess = (user) =>
  jwt.sign({ sub: user.id, role: user.role, locale: user.locale }, JWT_SECRET, { expiresIn: JWT_ACCESS_TTL });
const signRefresh = (user) =>
  jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: JWT_REFRESH_TTL });

const auth = (req, res, next) => {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ===== Auth Routes =====
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(72).required(),
  displayName: Joi.string().allow('', null),
  locale: Joi.string().valid('fr','ar','en').default('fr')
});

app.post('/auth/register', async (req, res) => {
  const { value, error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  try {
    const exists = await prisma.user.findUnique({ where: { email: value.email } });
    if (exists) return res.status(409).json({ message: 'Email already used' });

    const passwordHash = await bcrypt.hash(value.password, 12);
    const user = await prisma.user.create({
      data: { email: value.email, passwordHash, displayName: value.displayName ?? null, locale: value.locale }
    });

    const access = signAccess(user);
    const refresh = signRefresh(user);
    await prisma.refreshToken.create({
      data: { userId: user.id, token: refresh, expiresAt: new Date(Date.now() + 30*24*3600*1000) }
    });

    res.json({ user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role }, access, refresh });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ message: 'Internal server error (register)', code: 'DB_ERROR' });
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

app.post('/auth/login', async (req, res) => {
  const { value, error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  try {
    const user = await prisma.user.findUnique({ where: { email: value.email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(value.password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const access = signAccess(user);
    const refresh = signRefresh(user);
    await prisma.refreshToken.create({
      data: { userId: user.id, token: refresh, expiresAt: new Date(Date.now() + 30*24*3600*1000) }
    });
    res.json({ user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role }, access, refresh });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Internal server error (login)', code: 'DB_ERROR' });
  }
});

app.post('/auth/refresh', async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ message: 'Missing refresh token' });
  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.revoked) return res.status(401).json({ message: 'Invalid refresh token' });
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    const access = signAccess(user);
    res.json({ access });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

app.post('/auth/logout', async (req, res) => {
  const { token } = req.body || {};
  if (token) {
    await prisma.refreshToken.update({ where: { token }, data: { revoked: true } }).catch(() => {});
  }
  res.json({ ok: true });
});

// ===== Messaging (REST) minimal =====
app.get('/conversations', auth, async (req, res) => {
  const me = req.user.sub;
  const convs = await prisma.conversation.findMany({
    where: { members: { some: { userId: me } } },
    include: { members: { include: { user: true } }, messages: { take: 1, orderBy: { createdAt: 'desc' } } }
  });
  res.json(convs);
});

app.get('/conversations/:id/messages', auth, async (req, res) => {
  const { id } = req.params;
  const msgs = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: 'asc' }
  });
  res.json(msgs);
});

app.post('/conversations', auth, async (req, res) => {
  const { userIds, title, isDirect } = req.body;
  const me = req.user.sub;
  const conv = await prisma.conversation.create({
    data: {
      title: title ?? null,
      isDirect: !!isDirect,
      members: { createMany: { data: [...new Set([me, ...(userIds||[])])].map(uid => ({ userId: uid })) } }
    }
  });
  res.json(conv);
});

app.post('/conversations/:id/messages', auth, async (req, res) => {
  const { id } = req.params;
  const { content, contentType } = req.body;
  const member = await prisma.conversationMember.findFirst({ where: { conversationId: id, userId: req.user.sub } });
  if (!member) return res.status(403).json({ message: 'Forbidden' });
  const msg = await prisma.message.create({
    data: { conversationId: id, senderId: req.user.sub, content, contentType: contentType || 'text/plain' }
  });
  try {
    const io = req.app.get('io');
    io.to(`conv:${id}`).emit('message:new', msg);
  } catch {}
  res.json(msg);
});

// ===== Attachments & Uploads =====
const upload = multer({ limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB

// Upload to S3/MinIO, returns objectKey
app.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const keyPrefix = process.env.STORAGE_PREFIX || 'uploads';
    const nameSafe = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `${keyPrefix}/${Date.now()}_${Math.random().toString(36).slice(2)}_${nameSafe}`;
    await putObject(key, req.file.buffer, req.file.mimetype || 'application/octet-stream');
    res.json({ objectKey: key, mimeType: req.file.mimetype, size: req.file.size });
  } catch (e) {
    console.error('Upload error:', e);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Link attachments to a message
app.post('/messages/:id/attachments', auth, async (req, res) => {
  const { id } = req.params;
  const { objects } = req.body || {};// [{objectKey, mimeType, size}]
  if (!Array.isArray(objects) || !objects.length) return res.status(400).json({ message: 'No objects' });
  const msg = await prisma.message.findUnique({ where: { id } });
  if (!msg) return res.status(404).json({ message: 'Message not found' });
  const member = await prisma.conversationMember.findFirst({ where: { conversationId: msg.conversationId, userId: req.user.sub } });
  if (!member) return res.status(403).json({ message: 'Forbidden' });
  const created = await prisma.$transaction([
    prisma.attachment.createMany({ data: objects.map(o => ({ messageId: id, objectKey: o.objectKey, mimeType: o.mimeType || null, size: o.size || null })) }),
    prisma.message.update({ where: { id }, data: { hasAttachments: true } })
  ]);
  res.json({ ok: true });
});

// Get signed URL for attachment
app.get('/attachments/:id', auth, async (req, res) => {
  const { id } = req.params;
  const att = await prisma.attachment.findUnique({ where: { id }, include: { message: true } });
  if (!att) return res.status(404).json({ message: 'Not found' });
  const member = await prisma.conversationMember.findFirst({ where: { conversationId: att.message.conversationId, userId: req.user.sub } });
  if (!member) return res.status(403).json({ message: 'Forbidden' });
  try {
    const url = await getSignedUrlForKey(att.objectKey, 60 * 10); // 10 minutes
    res.redirect(url);
  } catch (e) {
    console.error('Presign error:', e);
    res.status(500).json({ message: 'Failed to generate URL' });
  }
});

// Study links
app.post('/conversations/:id/studies', auth, async (req, res) => {
  const { id } = req.params;
  const { studyInstanceUID } = req.body || {};
  if (!studyInstanceUID) return res.status(400).json({ message: 'Missing StudyInstanceUID' });
  const member = await prisma.conversationMember.findFirst({ where: { conversationId: id, userId: req.user.sub } });
  if (!member) return res.status(403).json({ message: 'Forbidden' });
  const link = await prisma.studyLink.create({ data: { conversationId: id, studyInstanceUID } });
  res.json(link);
});

app.get('/conversations/:id/studies', auth, async (req, res) => {
  const { id } = req.params;
  const member = await prisma.conversationMember.findFirst({ where: { conversationId: id, userId: req.user.sub } });
  if (!member) return res.status(403).json({ message: 'Forbidden' });
  const links = await prisma.studyLink.findMany({ where: { conversationId: id } });
  res.json(links);
});

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = attachRealtime(server);
app.set('io', io);
server.listen(PORT, () => console.log(`API+WS on :${PORT}`));

// Simple DB health check
app.get('/health/db', async (req, res) => {
  try {
    // a lightweight query
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (e) {
    console.error('DB health check failed:', e);
    res.status(500).json({ ok: false, message: 'DB not reachable' });
  }
});
