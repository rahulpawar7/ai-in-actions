import { Schema, model } from 'mongoose';
import { baseSchemaOptions, mediaRefSchema, type MediaRef } from './shared';

export interface SeoSettingsAttributes {
  key: string;
  siteName: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage?: MediaRef;
  twitterCardType: string;
  robots: string;
  themeColor: string;
  locale: string;
  organization: {
    name: string;
    url: string;
    phone?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  structuredData: {
    enableOrganization: boolean;
    enableEvent: boolean;
    enableFaq: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const seoSchema = new Schema<SeoSettingsAttributes>(
  {
    key: { type: String, default: 'default', unique: true },
    siteName: { type: String, default: 'AI IN ACTION' },
    defaultTitle: { type: String, default: '' },
    titleTemplate: { type: String, default: '%s | AI IN ACTION' },
    defaultDescription: { type: String, default: '' },
    keywords: { type: [String], default: [] },
    canonicalUrl: { type: String, default: '' },
    ogImage: { type: mediaRefSchema },
    twitterCardType: { type: String, default: 'summary_large_image' },
    robots: { type: String, default: 'index, follow' },
    themeColor: { type: String, default: '#06040E' },
    locale: { type: String, default: 'en_IN' },
    organization: {
      name: { type: String, default: 'AI IN ACTION' },
      url: { type: String, default: '' },
      phone: String,
      addressRegion: String,
      addressCountry: String,
    },
    structuredData: {
      enableOrganization: { type: Boolean, default: true },
      enableEvent: { type: Boolean, default: true },
      enableFaq: { type: Boolean, default: true },
    },
  },
  baseSchemaOptions,
);

export const SeoSettings = model<SeoSettingsAttributes>('SeoSettings', seoSchema);
