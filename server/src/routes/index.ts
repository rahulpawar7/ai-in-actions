import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs';
import { env } from '../config/env';
import { authenticate, authLimiter, bookingLimiter, requireRole } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import {
  bookingDetailsSchema,
  changePasswordSchema,
  createOrderSchema,
  loginSchema,
  verifyPaymentSchema,
} from '../validators/schemas';
import {
  bookingConfigHandler,
  bookingWorkshopHandler,
  changePasswordHandler,
  createOrderHandler,
  createRegistrationHandler,
  loginHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
  registrationLookupHandler,
  verifyPaymentHandler,
  webhookHandler,
} from '../controllers/handlers';
import { dashboardHandler, healthHandler, publicContentHandler, seoHandler } from '../controllers/public.controller';
import { collections, singletons } from '../modules/cms';
import { Media } from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import { ok } from '../utils/apiResponse';
import { invalidatePublicCache } from '../utils/cache';

fs.mkdirSync(env.uploadPath, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, env.uploadPath),
    filename: (_req, file, cb) => {
      const safe = `${Date.now()}-${file.originalname.replace(/[^\w.\-]+/g, '_')}`;
      cb(null, safe);
    },
  }),
  limits: { fileSize: env.maxFileSizeBytes },
});

export const apiRouter = Router();

apiRouter.get('/health', healthHandler);
apiRouter.get('/content', publicContentHandler);
apiRouter.get('/seo', seoHandler);

apiRouter.post('/auth/login', authLimiter, validate(loginSchema), loginHandler);
apiRouter.post('/auth/refresh', refreshHandler);
apiRouter.post('/auth/logout', logoutHandler);
apiRouter.get('/auth/me', authenticate, meHandler);
apiRouter.post('/auth/password', authenticate, validate(changePasswordSchema), changePasswordHandler);

apiRouter.get('/booking/config', bookingConfigHandler);
apiRouter.get('/booking/workshop', bookingWorkshopHandler);
apiRouter.post('/booking/register', bookingLimiter, validate(bookingDetailsSchema), createRegistrationHandler);
apiRouter.post('/booking/order', bookingLimiter, validate(createOrderSchema), createOrderHandler);
apiRouter.post('/booking/verify', bookingLimiter, validate(verifyPaymentSchema), verifyPaymentHandler);
apiRouter.get('/booking/:code', registrationLookupHandler);
apiRouter.post('/booking/webhook', webhookHandler);

apiRouter.get('/admin/dashboard', authenticate, dashboardHandler);

apiRouter.get(
  '/admin/media',
  authenticate,
  asyncHandler(async (_req, res) => {
    const items = await Media.find().sort({ createdAt: -1 }).limit(100).lean();
    ok(res, { items });
  }),
);

apiRouter.post(
  '/admin/media',
  authenticate,
  requireRole('owner', 'editor'),
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      ok(res, null, 'No file', 400);
      return;
    }
    const kind = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    const url = `${env.SERVER_URL}/${env.LOCAL_UPLOAD_DIR}/${req.file.filename}`;
    const media = await Media.create({
      url,
      provider: 'local',
      kind,
      originalName: req.file.originalname,
      bytes: req.file.size,
      alt: req.body.alt,
    });
    invalidatePublicCache();
    ok(res, media.toJSON(), 'Uploaded', 201);
  }),
);

for (const collection of collections) {
  const base = `/admin/${collection.path}`;
  apiRouter.get(base, authenticate, ...collection.list);
  apiRouter.post(base, authenticate, requireRole('owner', 'editor'), ...collection.create);
  apiRouter.post(`${base}/reorder`, authenticate, requireRole('owner', 'editor'), ...collection.reorder);
  apiRouter.get(`${base}/:id`, authenticate, collection.read);
  apiRouter.patch(`${base}/:id`, authenticate, requireRole('owner', 'editor'), ...collection.update);
  apiRouter.patch(`${base}/:id/active`, authenticate, requireRole('owner', 'editor'), ...collection.toggle);
  apiRouter.delete(`${base}/:id`, authenticate, requireRole('owner', 'editor'), collection.remove);
}

for (const singleton of singletons) {
  apiRouter.get(`/admin/${singleton.path}`, authenticate, singleton.get);
  apiRouter.patch(`/admin/${singleton.path}`, authenticate, requireRole('owner', 'editor'), singleton.update);
}

