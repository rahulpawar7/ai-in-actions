import { Schema } from 'mongoose';

export const MEDIA_KINDS = ['image', 'video', 'gif', 'audio', 'document'] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

export const CTA_VARIANTS = ['primary', 'secondary', 'ghost', 'link'] as const;
export type CtaVariant = (typeof CTA_VARIANTS)[number];

export interface MediaRef {
  url: string;
  publicId?: string;
  provider?: 'cloudinary' | 'local' | 'external';
  kind: MediaKind;
  alt?: string;
  caption?: string;
  posterUrl?: string;
  width?: number;
  height?: number;
}

export interface Cta {
  label: string;
  url: string;
  variant: CtaVariant;
  isExternal: boolean;
  isActive: boolean;
  ariaLabel?: string;
}

export const mediaRefSchema = new Schema<MediaRef>(
  {
    url: { type: String, required: true, trim: true, maxlength: 2048 },
    publicId: { type: String, trim: true, maxlength: 512 },
    provider: { type: String, enum: ['cloudinary', 'local', 'external'], default: 'external' },
    kind: { type: String, enum: MEDIA_KINDS, default: 'image' },
    alt: { type: String, trim: true, maxlength: 300 },
    caption: { type: String, trim: true, maxlength: 500 },
    posterUrl: { type: String, trim: true, maxlength: 2048 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },
  { _id: false },
);

export const ctaSchema = new Schema<Cta>(
  {
    label: { type: String, required: true, trim: true, maxlength: 80 },
    url: { type: String, required: true, trim: true, maxlength: 2048 },
    variant: { type: String, enum: CTA_VARIANTS, default: 'primary' },
    isExternal: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ariaLabel: { type: String, trim: true, maxlength: 160 },
  },
  { _id: false },
);

export const baseSchemaOptions = {
  timestamps: true,
  versionKey: false as const,
  toJSON: {
    virtuals: true,
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      ret.id = String(ret._id);
      delete ret._id;
      delete ret.passwordHash;
      return ret;
    },
  },
  toObject: { virtuals: true },
};

export const orderableFields = {
  order: { type: Number, default: 0, index: true },
  isActive: { type: Boolean, default: true, index: true },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null },
} as const;
