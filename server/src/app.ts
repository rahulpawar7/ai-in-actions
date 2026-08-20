import path from 'node:path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors, { type CorsOptions } from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { healthHandler, rootHandler, robotsHandler, sitemapHandler } from './controllers/public.controller';
import { errorHandler, notFound } from './middleware/errorHandler';
import { apiLimiter, requestLogger, sanitizeRequest } from './middleware/authenticate';
import { apiRouter } from './routes';

/** Allow any local dev port when Vite picks 5174, 5175, etc. */
const LOCAL_DEV_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }
    if (env.isDevelopment && LOCAL_DEV_ORIGIN.test(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

export function createApp(): Express {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:'],
          'script-src': ["'self'", 'https://checkout.razorpay.com'],
          'style-src': ["'self'", "'unsafe-inline'", 'https://checkout.razorpay.com', 'https://fonts.googleapis.com'],
          'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
          'connect-src': ["'self'", 'https://api.razorpay.com', 'https://lumberjack.razorpay.com', ...env.CORS_ORIGINS],
          'frame-src': ["'self'", 'https://api.razorpay.com', 'https://checkout.razorpay.com'],
          'frame-ancestors': ["'none'"],
          'object-src': ["'none'"],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(cors(corsOptions));
  app.use(compression());

  app.use(
    `${env.API_PREFIX}/booking/webhook`,
    express.raw({ type: 'application/json' }),
    (req, _res, next) => {
      if (Buffer.isBuffer(req.body)) {
        req.rawBody = req.body.toString('utf8');
        try {
          req.body = JSON.parse(req.rawBody);
        } catch {
          req.body = {};
        }
      }
      next();
    },
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());
  app.use(requestLogger);
  app.use(sanitizeRequest);

  app.use(
    `/${env.LOCAL_UPLOAD_DIR}`,
    express.static(path.resolve(env.uploadPath), {
      maxAge: '30d',
      index: false,
      dotfiles: 'deny',
    }),
  );

  app.get('/', rootHandler);
  app.get('/health', healthHandler);
  app.get('/sitemap.xml', sitemapHandler);
  app.get('/robots.txt', robotsHandler);
  app.use(env.API_PREFIX, apiLimiter, apiRouter);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
