import type { CookieOptions, Response } from 'express';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import type { AdminDocument, AdminRole } from '../models/Admin';
import { ApiError } from '../utils/ApiError';

const ISSUER = 'ai-in-action-api';
const AUDIENCE = 'ai-in-action-admin';

export interface TokenPayload extends JwtPayload {
  sub: string;
  role: AdminRole;
  name: string;
  email: string;
  tokenVersion: number;
  type: 'access' | 'refresh';
}

function sign(payload: Omit<TokenPayload, 'iat' | 'exp' | 'iss' | 'aud'>, secret: string, expiresIn: string) {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'], issuer: ISSUER, audience: AUDIENCE };
  return jwt.sign(payload, secret, options);
}

function buildPayload(admin: AdminDocument, type: 'access' | 'refresh'): Omit<TokenPayload, 'iat' | 'exp' | 'iss' | 'aud'> {
  return {
    sub: String(admin._id),
    role: admin.role,
    name: admin.name,
    email: admin.email,
    tokenVersion: admin.tokenVersion,
    type,
  };
}

export function issueAccessToken(admin: AdminDocument) {
  return sign(buildPayload(admin, 'access'), env.JWT_ACCESS_SECRET, env.JWT_ACCESS_EXPIRES_IN);
}

export function issueRefreshToken(admin: AdminDocument) {
  return sign(buildPayload(admin, 'refresh'), env.JWT_REFRESH_SECRET, env.JWT_REFRESH_EXPIRES_IN);
}

function verify(token: string, secret: string, expectedType: 'access' | 'refresh'): TokenPayload {
  const decoded = jwt.verify(token, secret, { issuer: ISSUER, audience: AUDIENCE }) as TokenPayload;
  if (decoded.type !== expectedType) throw ApiError.unauthorized('Invalid token type');
  return decoded;
}

export const verifyAccessToken = (token: string) => verify(token, env.JWT_ACCESS_SECRET, 'access');
export const verifyRefreshToken = (token: string) => verify(token, env.JWT_REFRESH_SECRET, 'refresh');

function parseDurationToMs(duration: string): number {
  const match = /^(\d+)\s*(ms|s|m|h|d)?$/.exec(duration.trim());
  if (!match) return 15 * 60 * 1000;
  const amount = Number(match[1]);
  const unit = match[2] ?? 'ms';
  const multipliers: Record<string, number> = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return amount * (multipliers[unit] ?? 1);
}

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SECURE ? 'none' : 'lax',
    path: '/',
    maxAge: parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN),
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  };
}

export function setRefreshCookie(res: Response, token: string) {
  res.cookie(env.REFRESH_COOKIE_NAME, token, cookieOptions());
}

export function clearRefreshCookie(res: Response) {
  const options = cookieOptions();
  delete options.maxAge;
  res.clearCookie(env.REFRESH_COOKIE_NAME, options);
}

export function accessTokenExpiresInSeconds() {
  return Math.floor(parseDurationToMs(env.JWT_ACCESS_EXPIRES_IN) / 1000);
}
