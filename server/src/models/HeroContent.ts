import { Schema, model } from 'mongoose';
import { baseSchemaOptions, ctaSchema, mediaRefSchema, type Cta, type MediaRef } from './shared';

export interface HeroContentAttributes {
  key: string;
  eyebrow: string;
  headlineLines: string[];
  emphasisWords: string[];
  subheadline: string;
  supportingText: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  highlights: { label: string; value: string; icon?: string; order: number; isActive: boolean }[];
  trustSignals: string[];
  marqueeItems: string[];
  backgroundVideo?: MediaRef;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const heroSchema = new Schema<HeroContentAttributes>(
  {
    key: { type: String, default: 'default', unique: true },
    eyebrow: { type: String, default: '' },
    headlineLines: { type: [String], default: [] },
    emphasisWords: { type: [String], default: [] },
    subheadline: { type: String, default: '' },
    supportingText: { type: String, default: '' },
    primaryCta: { type: ctaSchema, required: true },
    secondaryCta: { type: ctaSchema },
    highlights: {
      type: [
        {
          label: String,
          value: String,
          icon: String,
          order: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
        },
      ],
      default: [],
    },
    trustSignals: { type: [String], default: [] },
    marqueeItems: { type: [String], default: [] },
    backgroundVideo: { type: mediaRefSchema },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
);

export const HeroContent = model<HeroContentAttributes>('HeroContent', heroSchema);
