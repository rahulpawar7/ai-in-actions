import { Schema, model, type HydratedDocument } from 'mongoose';
import { baseSchemaOptions } from './shared';

export interface UserAttributes {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  city?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<UserAttributes>;

const userSchema = new Schema<UserAttributes>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160, index: true },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    company: { type: String, trim: true, maxlength: 160 },
    city: { type: String, trim: true, maxlength: 80 },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  baseSchemaOptions,
);

export const User = model<UserAttributes>('User', userSchema);
