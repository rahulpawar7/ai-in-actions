import { Schema, model, type HydratedDocument, type Types } from 'mongoose';
import { baseSchemaOptions } from './shared';

export const REGISTRATION_PAYMENT_STATUSES = [
  'pending',
  'payment_initiated',
  'paid',
  'failed',
  'cancelled',
  'expired',
  'refunded',
] as const;

export type RegistrationPaymentStatus = (typeof REGISTRATION_PAYMENT_STATUSES)[number];

export interface RegistrationAttributes {
  registrationCode: string;
  user?: Types.ObjectId;
  workshop: Types.ObjectId;
  workshopName: string;
  batchName: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  city?: string;
  notes?: string;
  amount: number;
  currency: string;
  currencySymbol: string;
  status: RegistrationPaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentMethod?: string;
  ipAddress?: string;
  userAgent?: string;
  paidAt?: Date | null;
  expiresAt?: Date | null;
  failureReason?: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type RegistrationDocument = HydratedDocument<RegistrationAttributes>;

const registrationSchema = new Schema<RegistrationAttributes>(
  {
    registrationCode: { type: String, required: true, unique: true, trim: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    workshop: { type: Schema.Types.ObjectId, ref: 'Workshop', required: true, index: true },
    workshopName: { type: String, required: true, trim: true, maxlength: 160 },
    batchName: { type: String, required: true, trim: true, maxlength: 120 },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160, index: true },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    company: { type: String, trim: true, maxlength: 160 },
    city: { type: String, trim: true, maxlength: 80 },
    notes: { type: String, trim: true, maxlength: 500 },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    currencySymbol: { type: String, default: '₹' },
    status: { type: String, enum: REGISTRATION_PAYMENT_STATUSES, default: 'pending', index: true },
    razorpayOrderId: { type: String, trim: true, index: true, sparse: true },
    razorpayPaymentId: { type: String, trim: true, index: true, sparse: true },
    razorpaySignature: { type: String, trim: true },
    paymentMethod: { type: String, trim: true, maxlength: 60 },
    ipAddress: { type: String, trim: true, maxlength: 64 },
    userAgent: { type: String, trim: true, maxlength: 512 },
    paidAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null, index: true },
    failureReason: { type: String, trim: true, maxlength: 300 },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  baseSchemaOptions,
);

registrationSchema.index({ email: 1, workshop: 1, status: 1 });

export const Registration = model<RegistrationAttributes>('Registration', registrationSchema);
