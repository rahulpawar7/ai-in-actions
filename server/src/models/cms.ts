import { Schema, model } from 'mongoose';
import { baseSchemaOptions, mediaRefSchema, orderableFields, type MediaRef } from './shared';

export const FEATURE_GROUPS = ['benefit', 'outcome', 'support', 'audience', 'usecase', 'workflow'] as const;
export type FeatureGroup = (typeof FEATURE_GROUPS)[number];

export interface FeatureAttributes {
  group: FeatureGroup;
  title: string;
  description: string;
  icon?: string;
  accent?: string;
  tag?: string;
  beforeLabel?: string;
  afterLabel?: string;
  isFeatured: boolean;
  metricValue?: number;
  metricSuffix?: string;
  metricLabel?: string;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const featureSchema = new Schema<FeatureAttributes>(
  {
    group: { type: String, enum: FEATURE_GROUPS, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true, maxlength: 800 },
    icon: String,
    accent: String,
    tag: String,
    beforeLabel: String,
    afterLabel: String,
    isFeatured: { type: Boolean, default: false },
    metricValue: Number,
    metricSuffix: String,
    metricLabel: String,
    ...orderableFields,
  },
  baseSchemaOptions,
);

export const Feature = model<FeatureAttributes>('Feature', featureSchema);

export interface ContentSectionAttributes {
  sectionKey: string;
  name: string;
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  subtitle?: string;
  body?: string;
  footnote?: string;
  layoutVariant?: string;
  items: {
    title?: string;
    description?: string;
    icon?: string;
    accent?: string;
    value?: string;
    label?: string;
    media?: MediaRef;
    order: number;
    isActive: boolean;
  }[];
  order: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const sectionSchema = new Schema<ContentSectionAttributes>(
  {
    sectionKey: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    name: { type: String, required: true, trim: true },
    eyebrow: String,
    title: String,
    titleEmphasis: String,
    subtitle: String,
    body: String,
    footnote: String,
    layoutVariant: String,
    items: {
      type: [
        {
          title: String,
          description: String,
          icon: String,
          accent: String,
          value: String,
          label: String,
          media: mediaRefSchema,
          order: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
        },
      ],
      default: [],
    },
    ...orderableFields,
  },
  baseSchemaOptions,
);

export const ContentSection = model<ContentSectionAttributes>('ContentSection', sectionSchema);

export interface CurriculumModuleAttributes {
  dayNumber: number;
  title: string;
  subtitle?: string;
  phase?: string;
  icon?: string;
  description: string;
  learningObjectives: string[];
  tools: string[];
  outcome?: string;
  durationLabel?: string;
  isHighlighted: boolean;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const curriculumSchema = new Schema<CurriculumModuleAttributes>(
  {
    dayNumber: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    subtitle: String,
    phase: String,
    icon: String,
    description: { type: String, required: true, maxlength: 2000 },
    learningObjectives: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    outcome: String,
    durationLabel: String,
    isHighlighted: { type: Boolean, default: false },
    ...orderableFields,
  },
  baseSchemaOptions,
);

export const CurriculumModule = model<CurriculumModuleAttributes>('CurriculumModule', curriculumSchema);

export interface BonusAttributes {
  title: string;
  subtitle?: string;
  description: string;
  actualValue: number;
  displayValue: string;
  icon?: string;
  accent?: string;
  badge?: string;
  isFeatured: boolean;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const bonusSchema = new Schema<BonusAttributes>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    subtitle: String,
    description: { type: String, required: true, maxlength: 800 },
    actualValue: { type: Number, default: 0 },
    displayValue: { type: String, default: '' },
    icon: String,
    accent: String,
    badge: String,
    isFeatured: { type: Boolean, default: false },
    ...orderableFields,
  },
  baseSchemaOptions,
);

export const Bonus = model<BonusAttributes>('Bonus', bonusSchema);
