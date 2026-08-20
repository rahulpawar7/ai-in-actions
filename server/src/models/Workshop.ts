import slugify from 'slugify';
import { Schema, model, type HydratedDocument } from 'mongoose';
import { baseSchemaOptions, mediaRefSchema, type MediaRef } from './shared';

export const REGISTRATION_STATUSES = ['open', 'closing-soon', 'closed', 'waitlist', 'sold-out'] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];
export const ENROLLMENT_STATUSES = ['upcoming', 'live', 'completed'] as const;
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number];

export interface WorkshopAttributes {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  startDate: Date;
  endDate?: Date | null;
  batchName: string;
  batchNumber: number;
  mode: string;
  platform: string;
  durationLabel: string;
  totalDays: number;
  sessionDurationLabel: string;
  totalLearningHours: number;
  language: string;
  timezone: string;
  sessionTimeLabel?: string;
  capacity: number;
  seatsAvailable: number;
  pricing: {
    currency: string;
    currencySymbol: string;
    currentPrice: number;
    futurePrice: number;
    priceNote?: string;
    bonusValue: number;
    bonusValueLabel?: string;
  };
  registrationStatus: RegistrationStatus;
  enrollmentStatus: EnrollmentStatus;
  registrationDeadline?: Date | null;
  priceIncreaseDate?: Date | null;
  urgency: {
    countdownEnabled: boolean;
    countdownLabel: string;
    countdownTarget?: Date | null;
    countdownExpiredMessage: string;
    seatsCounterEnabled: boolean;
    seatsMessageTemplate: string;
    priceIncreaseNoticeEnabled: boolean;
    priceIncreaseMessage: string;
    limitedOfferEnabled: boolean;
    limitedOfferMessage: string;
  };
  highlights: { icon?: string; label: string; value: string; order: number; isActive: boolean }[];
  inclusions: string[];
  coverMedia?: MediaRef;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkshopDocument = HydratedDocument<WorkshopAttributes>;

const workshopSchema = new Schema<WorkshopAttributes>(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, trim: true, lowercase: true, maxlength: 200, index: true },
    tagline: { type: String, trim: true, maxlength: 300, default: '' },
    description: { type: String, trim: true, maxlength: 4000, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    batchName: { type: String, trim: true, maxlength: 120, default: 'Batch 01' },
    batchNumber: { type: Number, default: 1, min: 1 },
    mode: { type: String, trim: true, maxlength: 80, default: 'Live Online' },
    platform: { type: String, trim: true, maxlength: 80, default: 'Zoom' },
    durationLabel: { type: String, trim: true, maxlength: 80, default: '10 Days' },
    totalDays: { type: Number, default: 10 },
    sessionDurationLabel: { type: String, trim: true, maxlength: 80, default: '1.5–2 Hours' },
    totalLearningHours: { type: Number, default: 20 },
    language: { type: String, trim: true, maxlength: 80, default: 'Hindi + English' },
    timezone: { type: String, trim: true, maxlength: 60, default: 'Asia/Kolkata' },
    sessionTimeLabel: { type: String, trim: true, maxlength: 80 },
    capacity: { type: Number, default: 30, min: 1 },
    seatsAvailable: { type: Number, default: 30, min: 0 },
    pricing: {
      currency: { type: String, default: 'INR' },
      currencySymbol: { type: String, default: '₹' },
      currentPrice: { type: Number, required: true, min: 0 },
      futurePrice: { type: Number, default: 0, min: 0 },
      priceNote: { type: String, trim: true, maxlength: 200 },
      bonusValue: { type: Number, default: 0 },
      bonusValueLabel: { type: String, trim: true, maxlength: 120 },
    },
    registrationStatus: { type: String, enum: REGISTRATION_STATUSES, default: 'open', index: true },
    enrollmentStatus: { type: String, enum: ENROLLMENT_STATUSES, default: 'upcoming' },
    registrationDeadline: { type: Date, default: null },
    priceIncreaseDate: { type: Date, default: null },
    urgency: {
      countdownEnabled: { type: Boolean, default: true },
      countdownLabel: { type: String, default: 'Registration closes in' },
      countdownTarget: { type: Date, default: null },
      countdownExpiredMessage: { type: String, default: 'Registration for this batch has closed.' },
      seatsCounterEnabled: { type: Boolean, default: true },
      seatsMessageTemplate: {
        type: String,
        default: '{{seats}} of {{capacity}} seats remaining',
      },
      priceIncreaseNoticeEnabled: { type: Boolean, default: true },
      priceIncreaseMessage: {
        type: String,
        default: 'Next batch is {{futurePrice}}. This batch is {{price}}.',
      },
      limitedOfferEnabled: { type: Boolean, default: true },
      limitedOfferMessage: { type: String, default: 'Founding-batch pricing — Batch 01 only' },
    },
    highlights: {
      type: [
        {
          icon: String,
          label: { type: String, required: true },
          value: { type: String, required: true },
          order: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
        },
      ],
      default: [],
    },
    inclusions: { type: [String], default: [] },
    coverMedia: { type: mediaRefSchema, default: undefined },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  baseSchemaOptions,
);

workshopSchema.index({ isActive: 1, isDeleted: 1, startDate: -1 });

workshopSchema.virtual('seatsFilled').get(function seatsFilled(this: WorkshopAttributes) {
  return Math.max(0, this.capacity - this.seatsAvailable);
});

workshopSchema.pre('validate', function normalise(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
  }
  if (this.seatsAvailable > this.capacity) this.seatsAvailable = this.capacity;
  next();
});

export const Workshop = model<WorkshopAttributes>('Workshop', workshopSchema);
