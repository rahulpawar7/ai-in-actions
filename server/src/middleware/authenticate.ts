import type { NextFunction, Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { verifyAccessToken } from '../services/token.service';
import { Admin } from '../models/Admin';
import { ApiError } from '../utils/ApiError';
import type { AdminRole } from '../models/Admin';

declare global {
  namespace Express {
    interface Request {
      admin?: { id: string; role: AdminRole; name: string; email: string };
      rawBody?: string;
    }
  }
}

export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please wait a moment.' },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});

export const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
});

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  if (!req.originalUrl.includes('/health')) {
    logger.debug({ method: req.method, url: req.originalUrl }, 'request');
  }
  next();
}

export function sanitizeRequest(req: Request, _res: Response, next: NextFunction) {
  const strip = (value: unknown): unknown => {
    if (typeof value === 'string') return value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '').trim();
    if (Array.isArray(value)) return value.map(strip);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, strip(v)]));
    }
    return value;
  };
  if (req.body) req.body = strip(req.body);
  next();
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) throw ApiError.unauthorized();

    const payload = verifyAccessToken(token);
    const admin = await Admin.findById(payload.sub);
    if (!admin || !admin.isActive || admin.tokenVersion !== payload.tokenVersion) {
      throw ApiError.unauthorized('Session is no longer valid');
    }

    req.admin = { id: String(admin._id), role: admin.role, name: admin.name, email: admin.email };
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(...roles: AdminRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin) return next(ApiError.unauthorized());
    if (req.admin.role === 'owner') return next();
    if (!roles.includes(req.admin.role)) return next(ApiError.forbidden());
    next();
  };
}
