import { Schema, model, type HydratedDocument, type Types } from 'mongoose';
import { baseSchemaOptions } from './shared';

export const PAYMENT_STATUSES = ['created', 'authorized', 'captured', 'failed', 'refunded'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface PaymentAttributes {
  registration: Types.ObjectId;
  workshop: Types.ObjectId;
  registrationCode: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: string;
  verifiedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentDocument = HydratedDocument<PaymentAttributes>;

const paymentSchema = new Schema<PaymentAttributes>(
  {
    registration: { type: Schema.Types.ObjectId, ref: 'Registration', required: true, index: true },
    workshop: { type: Schema.Types.ObjectId, ref: 'Workshop', required: true, index: true },
    registrationCode: { type: String, required: true, index: true },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String, index: true, sparse: true },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: PAYMENT_STATUSES, default: 'created', index: true },
    method: { type: String, trim: true, maxlength: 60 },
    verifiedAt: { type: Date, default: null },
  },
  baseSchemaOptions,
);

export const Payment = model<PaymentAttributes>('Payment', paymentSchema);
