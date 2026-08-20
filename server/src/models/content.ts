import { Schema, model } from 'mongoose';
import { baseSchemaOptions, mediaRefSchema, orderableFields, type MediaRef } from './shared';

export interface TestimonialAttributes {
  name: string;
  role?: string;
  company?: string;
  quote: string;
  highlight?: string;
  resultMetric?: string;
  rating: number;
  avatar?: MediaRef;
  video?: MediaRef;
  isFeatured: boolean;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<TestimonialAttributes>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: String,
    company: String,
    quote: { type: String, required: true, maxlength: 800 },
    highlight: String,
    resultMetric: String,
    rating: { type: Number, default: 5, min: 1, max: 5 },
    avatar: mediaRefSchema,
    video: mediaRefSchema,
    isFeatured: { type: Boolean, default: false },
    ...orderableFields,
  },
  baseSchemaOptions,
);

export const Testimonial = model<TestimonialAttributes>('Testimonial', testimonialSchema);

export interface FaqAttributes {
  question: string;
  answer: string;
  category?: string;
  isFeatured: boolean;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<FaqAttributes>(
  {
    question: { type: String, required: true, trim: true, maxlength: 240 },
    answer: { type: String, required: true, maxlength: 2000 },
    category: String,
    isFeatured: { type: Boolean, default: false },
    ...orderableFields,
  },
  baseSchemaOptions,
);

export const Faq = model<FaqAttributes>('Faq', faqSchema);

export interface GalleryItemAttributes {
  title: string;
  description?: string;
  category: 'workshop' | 'workflow' | 'testimonial' | 'speaker' | 'other';
  media: MediaRef;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<GalleryItemAttributes>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: String,
    category: {
      type: String,
      enum: ['workshop', 'workflow', 'testimonial', 'speaker', 'demo', 'ai-action', 'other'],
      default: 'workshop',
    },
    media: { type: mediaRefSchema, required: true },
    ...orderableFields,
  },
  baseSchemaOptions,
);

export const GalleryItem = model<GalleryItemAttributes>('GalleryItem', gallerySchema);

export interface SpeakerAttributes {
  name: string;
  role: string;
  bio?: string;
  photo?: MediaRef;
  video?: MediaRef;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const speakerSchema = new Schema<SpeakerAttributes>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 160 },
    bio: { type: String, maxlength: 1200 },
    photo: mediaRefSchema,
    video: mediaRefSchema,
    ...orderableFields,
  },
  baseSchemaOptions,
);

export const Speaker = model<SpeakerAttributes>('Speaker', speakerSchema);

export interface ContactPersonAttributes {
  name: string;
  role?: string;
  phone?: string;
  email?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  availabilityNote?: string;
  avatar?: MediaRef;
  showCallButton: boolean;
  showWhatsappButton: boolean;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<ContactPersonAttributes>(
  {
    name: { type: String, required: true, trim: true },
    role: String,
    phone: String,
    email: String,
    whatsappNumber: String,
    whatsappMessage: String,
    availabilityNote: String,
    avatar: mediaRefSchema,
    showCallButton: { type: Boolean, default: true },
    showWhatsappButton: { type: Boolean, default: true },
    ...orderableFields,
  },
  baseSchemaOptions,
);

export const ContactPerson = model<ContactPersonAttributes>('ContactPerson', contactSchema);

export interface MediaAttributes {
  url: string;
  publicId?: string;
  provider: 'cloudinary' | 'local' | 'external';
  kind: 'image' | 'video' | 'gif' | 'audio' | 'document';
  alt?: string;
  originalName?: string;
  bytes?: number;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<MediaAttributes>(
  {
    url: { type: String, required: true },
    publicId: String,
    provider: { type: String, enum: ['cloudinary', 'local', 'external'], default: 'local' },
    kind: { type: String, enum: ['image', 'video', 'gif', 'audio', 'document'], default: 'image' },
    alt: String,
    originalName: String,
    bytes: Number,
    width: Number,
    height: Number,
  },
  baseSchemaOptions,
);

export const Media = model<MediaAttributes>('Media', mediaSchema);

export interface ActivityLogAttributes {
  actor?: string;
  action: string;
  resource: string;
  resourceId?: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

const activitySchema = new Schema<ActivityLogAttributes>(
  {
    actor: String,
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: String,
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);

activitySchema.index({ createdAt: -1 });

export const ActivityLog = model<ActivityLogAttributes>('ActivityLog', activitySchema);
