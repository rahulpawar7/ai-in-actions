import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const booleanish = z
  .union([z.boolean(), z.string()])
  .transform((value) =>
    typeof value === 'boolean' ? value : ['1', 'true', 'yes', 'on'].includes(value.toLowerCase()),
  );

const csvList = z
  .string()
  .transform((value) =>
    value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean),
  )
  .default('');

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(5000),
    API_PREFIX: z.string().startsWith('/').default('/api/v1'),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    SITE_URL: z.string().url().default('http://localhost:5173'),
    SERVER_URL: z.string().url().default('http://localhost:5000'),
    CORS_ORIGINS: csvList,
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    REFRESH_COOKIE_NAME: z.string().default('aia_rt'),
    COOKIE_SECURE: booleanish.default(false),
    COOKIE_DOMAIN: z.string().optional(),
    RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().int().positive().default(15),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
    MEDIA_STORAGE_DRIVER: z.enum(['cloudinary', 'local']).default('local'),
    MEDIA_MAX_FILE_SIZE_MB: z.coerce.number().positive().default(25),
    LOCAL_UPLOAD_DIR: z.string().default('uploads'),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
    CLOUDINARY_FOLDER: z.string().default('ai-in-action'),
    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),
    RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
    SEED_ADMIN_NAME: z.string().default('AI IN ACTION Admin'),
    SEED_ADMIN_EMAIL: z.string().email().default('admin@aiinaction.local'),
    SEED_ADMIN_PASSWORD: z.string().min(8).default('ChangeMe@12345'),
  })
  .superRefine((value, ctx) => {
    if (value.MEDIA_STORAGE_DRIVER === 'cloudinary') {
      const missing = (['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'] as const).filter(
        (key) => !value[key],
      );
      if (missing.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Cloudinary selected but missing: ${missing.join(', ')}`,
          path: ['MEDIA_STORAGE_DRIVER'],
        });
      }
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  • ${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment configuration:\n${details}`);
}

const raw = parsed.data;

export const env = {
  ...raw,
  CORS_ORIGINS: raw.CORS_ORIGINS.length > 0 ? raw.CORS_ORIGINS : [raw.SITE_URL],
  isProduction: raw.NODE_ENV === 'production',
  isDevelopment: raw.NODE_ENV === 'development',
  uploadPath: path.resolve(process.cwd(), raw.LOCAL_UPLOAD_DIR),
  maxFileSizeBytes: Math.round(raw.MEDIA_MAX_FILE_SIZE_MB * 1024 * 1024),
} as const;
