import { Schema, model } from 'mongoose';
import { baseSchemaOptions, ctaSchema, type Cta } from './shared';

export interface SiteSettingsAttributes {
  key: string;
  brandName: string;
  brandInitials: string;
  brandTagline: string;
  announcementBar: {
    isEnabled: boolean;
    text: string;
    highlight?: string;
    cta?: Cta;
  };
  navLinks: { label: string; href: string; isExternal: boolean; isActive: boolean; order: number }[];
  headerCta: Cta;
  stickyMobileCta: { isEnabled: boolean; label: string; helperText?: string };
  footer: {
    description: string;
    linkGroups: {
      title: string;
      order: number;
      links: { label: string; href: string; isExternal: boolean; isActive: boolean; order: number }[];
    }[];
    copyright: string;
    disclaimer?: string;
  };
  socialLinks: { platform: string; url: string; label: string; isActive: boolean; order: number }[];
  sectionVisibility: Record<string, boolean>;
  maintenanceMode: { isEnabled: boolean; message: string };
  createdAt: Date;
  updatedAt: Date;
}

const siteSchema = new Schema<SiteSettingsAttributes>(
  {
    key: { type: String, default: 'default', unique: true },
    brandName: { type: String, default: 'AI IN ACTION' },
    brandInitials: { type: String, default: 'AIA' },
    brandTagline: { type: String, default: '' },
    announcementBar: {
      isEnabled: { type: Boolean, default: false },
      text: { type: String, default: '' },
      highlight: String,
      cta: ctaSchema,
    },
    navLinks: {
      type: [
        {
          label: String,
          href: String,
          isExternal: { type: Boolean, default: false },
          isActive: { type: Boolean, default: true },
          order: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    headerCta: { type: ctaSchema, required: true },
    stickyMobileCta: {
      isEnabled: { type: Boolean, default: true },
      label: { type: String, default: 'Secure Your Seat' },
      helperText: String,
    },
    footer: {
      description: { type: String, default: '' },
      linkGroups: { type: Array, default: [] },
      copyright: { type: String, default: '' },
      disclaimer: String,
    },
    socialLinks: {
      type: [
        {
          platform: String,
          url: String,
          label: String,
          isActive: { type: Boolean, default: true },
          order: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    sectionVisibility: { type: Schema.Types.Mixed, default: {} },
    maintenanceMode: {
      isEnabled: { type: Boolean, default: false },
      message: { type: String, default: 'We are updating the experience. Please check back shortly.' },
    },
  },
  baseSchemaOptions,
);

export const SiteSettings = model<SiteSettingsAttributes>('SiteSettings', siteSchema);
