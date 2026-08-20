import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  nextPassword: z.string().min(8),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().trim().max(120).optional(),
  isActive: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .transform((value) => (typeof value === 'boolean' ? value : value === 'true'))
    .optional(),
});

export const bookingDetailsSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(10).max(20),
  company: z.string().trim().min(2).max(160).optional(),
  city: z.string().trim().min(2).max(80).optional(),
  notes: z.string().trim().max(500).optional(),
  workshopId: z.string().optional(),
});

export const createOrderSchema = z.object({
  registrationCode: z.string().min(4),
});

export const verifyPaymentSchema = z.object({
  registrationCode: z.string().min(4),
  razorpayOrderId: z.string().min(4),
  razorpayPaymentId: z.string().min(4),
  razorpaySignature: z.string().min(8),
});

const ctaSchema = z
  .object({
    label: z.string().min(1),
    url: z.string().min(1),
    variant: z.enum(['primary', 'secondary', 'ghost', 'link']).optional(),
    isExternal: z.boolean().optional(),
    isActive: z.boolean().optional(),
    ariaLabel: z.string().optional(),
  })
  .passthrough();

export const looseObject = z.record(z.unknown());

export const heroUpdateSchema = z
  .object({
    eyebrow: z.string().optional(),
    headlineLines: z.array(z.string()).optional(),
    emphasisWords: z.array(z.string()).optional(),
    subheadline: z.string().optional(),
    supportingText: z.string().optional(),
    primaryCta: ctaSchema.optional(),
    secondaryCta: ctaSchema.optional(),
    highlights: z.array(z.record(z.unknown())).optional(),
    trustSignals: z.array(z.string()).optional(),
    marqueeItems: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  })
  .passthrough();

export const siteSettingsUpdateSchema = z.record(z.unknown());
export const seoSettingsUpdateSchema = z.record(z.unknown());
export const collectionCreateSchema = z.record(z.unknown());
export const collectionUpdateSchema = z.record(z.unknown());
export const reorderSchema = z.object({
  entries: z.array(z.object({ id: z.string(), order: z.number() })),
});
export const toggleSchema = z.object({ isActive: z.boolean() });
