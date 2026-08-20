import { Schema, model, type HydratedDocument } from 'mongoose';
import { baseSchemaOptions } from './shared';

export const ADMIN_ROLES = ['owner', 'editor', 'viewer'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export interface AdminAttributes {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  tokenVersion: number;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type AdminDocument = HydratedDocument<AdminAttributes>;

const adminSchema = new Schema<AdminAttributes>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ADMIN_ROLES, default: 'editor' },
    isActive: { type: Boolean, default: true },
    tokenVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date, default: null },
  },
  baseSchemaOptions,
);

export const Admin = model<AdminAttributes>('Admin', adminSchema);
