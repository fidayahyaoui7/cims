import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    sub: string;
    roles?: string[];
    [key: string]: any;
  };
}

// In-memory blacklist for tokens (use Redis in production)
const tokenBlacklist = new Set<string>();

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Check if token is blacklisted
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'Token has been revoked' });
  }

  // In development, we'll just decode the token without verification
  // In production, verify with the JWT secret
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = process.env.NODE_ENV === 'production' 
      ? jwt.verify(token, secret) 
      : jwt.decode(token);

    if (!payload || typeof payload === 'string') {
      return res.status(403).json({ error: 'Invalid token' });
    }

    // Type assertion to ensure the payload has the required sub property
    const user = payload as { sub: string; roles?: string[]; [key: string]: any };
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function hasRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.roles?.includes(role)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
}

export function revokeToken(token: string) {
  tokenBlacklist.add(token);
  
  // Optional: Set a timeout to remove the token from the blacklist after it expires
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    if (decoded?.exp) {
      const expiresInMs = decoded.exp * 1000 - Date.now();
      if (expiresInMs > 0) {
        setTimeout(() => tokenBlacklist.delete(token), expiresInMs);
      }
    }
  } catch (err) {
    console.error('Error decoding token for blacklist cleanup:', err);
  }
}

export default {
  authenticateToken,
  hasRole,
  revokeToken
};
