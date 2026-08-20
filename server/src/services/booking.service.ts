import crypto from 'node:crypto';
import { Registration, type RegistrationDocument } from '../models/Registration';
import { Workshop, type WorkshopDocument } from '../models/Workshop';
import { Payment } from '../models/Payment';
import { User } from '../models/User';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { invalidatePublicCache } from '../utils/cache';
import { createRazorpayOrder, isRazorpayConfigured, verifyPaymentSignature } from './razorpay.service';

const HOLD_MINUTES = 20;

function generateRegistrationCode() {
  return `AIA-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

export async function getActiveWorkshopForBooking(): Promise<WorkshopDocument> {
  const workshop = await Workshop.findOne({
    isActive: true,
    isDeleted: false,
    registrationStatus: { $nin: ['closed', 'sold-out'] },
  })
    .sort({ startDate: 1 })
    .exec();

  if (!workshop) throw ApiError.notFound('No workshop is currently open for registration.');
  if (workshop.seatsAvailable <= 0) throw ApiError.conflict('This batch is full.');
  if (workshop.registrationDeadline && workshop.registrationDeadline.getTime() < Date.now()) {
    throw ApiError.conflict('Registration for this batch has closed.');
  }
  return workshop;
}

export async function createRegistration(input: {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  city?: string;
  notes?: string;
  workshopId?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const workshop = input.workshopId
    ? await Workshop.findOne({ _id: input.workshopId, isActive: true, isDeleted: false })
    : await getActiveWorkshopForBooking();

  if (!workshop) throw ApiError.notFound('Workshop not found.');
  if (workshop.seatsAvailable <= 0) throw ApiError.conflict('This batch is full.');

  const email = input.email.toLowerCase();
  const existingPaid = await Registration.findOne({
    email,
    workshop: workshop._id,
    status: 'paid',
    isDeleted: false,
  });
  if (existingPaid) throw ApiError.conflict('This email is already registered for this batch.');

  const user = await User.findOneAndUpdate(
    { email },
    { fullName: input.fullName, phone: input.phone, company: input.company, city: input.city, notes: input.notes },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const amount = workshop.pricing.currentPrice;
  const expiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);

  let registration = await Registration.findOne({
    email,
    workshop: workshop._id,
    status: { $in: ['pending', 'payment_initiated'] },
    isDeleted: false,
  });

  if (registration) {
    registration.fullName = input.fullName;
    registration.phone = input.phone;
    registration.company = input.company;
    registration.city = input.city;
    registration.notes = input.notes;
    registration.amount = amount;
    registration.expiresAt = expiresAt;
    registration.user = user._id;
    registration.ipAddress = input.ipAddress;
    registration.userAgent = input.userAgent;
    await registration.save();
  } else {
    registration = await Registration.create({
      registrationCode: generateRegistrationCode(),
      user: user._id,
      workshop: workshop._id,
      workshopName: workshop.name,
      batchName: workshop.batchName,
      fullName: input.fullName,
      email,
      phone: input.phone,
      company: input.company,
      city: input.city,
      notes: input.notes,
      amount,
      currency: workshop.pricing.currency,
      currencySymbol: workshop.pricing.currencySymbol,
      status: 'pending',
      expiresAt,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
  }

  return { registration, workshop };
}

export async function createPaymentOrder(registrationCode: string) {
  if (!isRazorpayConfigured()) {
    throw ApiError.serviceUnavailable('Payment is not available right now. Please try again shortly.');
  }

  const registration = await Registration.findOne({ registrationCode, isDeleted: false });
  if (!registration) throw ApiError.notFound('Registration not found.');
  if (registration.status === 'paid') throw ApiError.conflict('This registration is already paid.');
  if (registration.expiresAt && registration.expiresAt.getTime() < Date.now()) {
    registration.status = 'expired';
    await registration.save();
    throw ApiError.conflict('This booking session expired. Please start again.');
  }

  const workshop = await Workshop.findById(registration.workshop);
  if (!workshop || workshop.seatsAvailable <= 0) throw ApiError.conflict('No seats available for this batch.');

  const amountPaise = Math.round(registration.amount * 100);
  const order = await createRazorpayOrder({
    amountPaise,
    currency: registration.currency,
    receipt: registration.registrationCode,
    notes: {
      registrationCode: registration.registrationCode,
      email: registration.email,
      workshop: registration.workshopName,
    },
  });

  registration.razorpayOrderId = order.id;
  registration.status = 'payment_initiated';
  registration.expiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);
  await registration.save();

  await Payment.findOneAndUpdate(
    { razorpayOrderId: order.id },
    {
      registration: registration._id,
      workshop: workshop._id,
      registrationCode: registration.registrationCode,
      razorpayOrderId: order.id,
      amount: registration.amount,
      currency: registration.currency,
      status: 'created',
    },
    { upsert: true, new: true },
  );

  return {
    registration,
    order: { id: order.id, amount: order.amount, currency: order.currency },
    keyId: env.RAZORPAY_KEY_ID!,
    prefill: { name: registration.fullName, email: registration.email, contact: registration.phone },
    branding: {
      name: 'AI IN ACTION',
      description: `${registration.workshopName} · ${registration.batchName}`,
      image: `${env.SITE_URL}/brand/logo.png`,
    },
  };
}

async function markRegistrationPaid(registration: RegistrationDocument, paymentId: string, method?: string) {
  if (registration.status === 'paid') return registration;

  const workshop = await Workshop.findById(registration.workshop);
  if (!workshop) throw ApiError.notFound('Workshop not found.');

  if (workshop.seatsAvailable <= 0) {
    registration.status = 'failed';
    registration.failureReason = 'Batch became full before payment completed';
    await registration.save();
    throw ApiError.conflict('This batch is now full. Your payment will be reviewed for a refund.');
  }

  workshop.seatsAvailable = Math.max(0, workshop.seatsAvailable - 1);
  if (workshop.seatsAvailable === 0) workshop.registrationStatus = 'sold-out';
  await workshop.save();
  invalidatePublicCache();

  registration.status = 'paid';
  registration.razorpayPaymentId = paymentId;
  registration.paymentMethod = method;
  registration.paidAt = new Date();
  registration.expiresAt = null;
  await registration.save();

  if (registration.razorpayOrderId) {
    await Payment.findOneAndUpdate(
      { razorpayOrderId: registration.razorpayOrderId },
      {
        razorpayPaymentId: paymentId,
        status: 'captured',
        method,
        verifiedAt: new Date(),
      },
    );
  }

  return registration;
}

export async function verifyAndCompletePayment(input: {
  registrationCode: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const registration = await Registration.findOne({
    registrationCode: input.registrationCode,
    isDeleted: false,
  });
  if (!registration) throw ApiError.notFound('Registration not found.');
  if (registration.razorpayOrderId !== input.razorpayOrderId) throw ApiError.badRequest('Order mismatch.');
  if (!registration.razorpayOrderId) throw ApiError.badRequest('No payment order for this registration.');

  const valid = verifyPaymentSignature(registration.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature);
  if (!valid) {
    registration.status = 'failed';
    registration.failureReason = 'Payment signature verification failed';
    await registration.save();
    throw ApiError.badRequest('Payment could not be verified.');
  }

  registration.razorpaySignature = input.razorpaySignature;
  await Payment.findOneAndUpdate(
    { razorpayOrderId: input.razorpayOrderId },
    { razorpaySignature: input.razorpaySignature },
  );
  return markRegistrationPaid(registration, input.razorpayPaymentId);
}

export async function getRegistrationByCode(registrationCode: string) {
  const registration = await Registration.findOne({ registrationCode, isDeleted: false }).lean();
  if (!registration) throw ApiError.notFound('Registration not found.');
  return registration;
}

export async function handleWebhookPaymentCaptured(payload: { orderId: string; paymentId: string; method?: string }) {
  const registration = await Registration.findOne({ razorpayOrderId: payload.orderId, isDeleted: false });
  if (!registration || registration.status === 'paid') return registration;
  return markRegistrationPaid(registration, payload.paymentId, payload.method);
}

export function getBookingConfig() {
  return {
    enabled: isRazorpayConfigured(),
    keyId: env.RAZORPAY_KEY_ID ?? null,
    currency: 'INR',
    holdMinutes: HOLD_MINUTES,
  };
}
