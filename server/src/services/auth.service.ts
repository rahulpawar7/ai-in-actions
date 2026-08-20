import bcrypt from 'bcryptjs';
import type { Response } from 'express';
import { Admin } from '../models/Admin';
import { ApiError } from '../utils/ApiError';
import {
  accessTokenExpiresInSeconds,
  clearRefreshCookie,
  issueAccessToken,
  issueRefreshToken,
  setRefreshCookie,
  verifyRefreshToken,
} from './token.service';

function sessionPayload(admin: { id?: string; _id?: unknown; name: string; email: string; role: string }) {
  return {
    admin: {
      id: admin.id ?? String(admin._id),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
    accessToken: '',
    expiresIn: accessTokenExpiresInSeconds(),
  };
}

export async function login(email: string, password: string, res: Response) {
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!admin || !admin.isActive) throw ApiError.unauthorized('Invalid email or password');

  const matches = await bcrypt.compare(password, admin.passwordHash);
  if (!matches) throw ApiError.unauthorized('Invalid email or password');

  admin.lastLoginAt = new Date();
  await admin.save();

  const accessToken = issueAccessToken(admin);
  setRefreshCookie(res, issueRefreshToken(admin));

  return { ...sessionPayload(admin), accessToken };
}

export async function refresh(token: string | undefined, res: Response) {
  if (!token) throw ApiError.unauthorized();
  const payload = verifyRefreshToken(token);
  const admin = await Admin.findById(payload.sub);
  if (!admin || !admin.isActive || admin.tokenVersion !== payload.tokenVersion) {
    clearRefreshCookie(res);
    throw ApiError.unauthorized();
  }
  const accessToken = issueAccessToken(admin);
  setRefreshCookie(res, issueRefreshToken(admin));
  return { ...sessionPayload(admin), accessToken };
}

export async function logout(res: Response) {
  clearRefreshCookie(res);
}

export async function changePassword(adminId: string, currentPassword: string, nextPassword: string) {
  const admin = await Admin.findById(adminId).select('+passwordHash');
  if (!admin) throw ApiError.notFound('Admin not found');
  const matches = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!matches) throw ApiError.unauthorized('Current password is incorrect');
  admin.passwordHash = await bcrypt.hash(nextPassword, 12);
  admin.tokenVersion += 1;
  await admin.save();
}
