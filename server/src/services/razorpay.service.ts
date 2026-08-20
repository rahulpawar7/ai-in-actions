import crypto from 'node:crypto';
import Razorpay from 'razorpay';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

let client: Razorpay | null = null;

export function isRazorpayConfigured() {
  return Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);
}

export function getRazorpayClient() {
  if (!isRazorpayConfigured()) throw ApiError.serviceUnavailable('Payment is not available right now.');
  if (!client) {
    client = new Razorpay({ key_id: env.RAZORPAY_KEY_ID!, key_secret: env.RAZORPAY_KEY_SECRET! });
  }
  return client;
}

export async function createRazorpayOrder(input: {
  amountPaise: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}) {
  return getRazorpayClient().orders.create({
    amount: input.amountPaise,
    currency: input.currency,
    receipt: input.receipt,
    notes: input.notes,
  });
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  if (!env.RAZORPAY_KEY_SECRET) return false;
  const expected = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}

export function verifyWebhookSignature(body: string, signature: string) {
  if (!env.RAZORPAY_WEBHOOK_SECRET) return false;
  const expected = crypto.createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET).update(body).digest('hex');
  return expected === signature;
}
