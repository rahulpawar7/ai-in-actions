import type { Request, Response } from 'express';
import { env } from '../config/env';
import { asyncHandler } from '../utils/asyncHandler';
import { ok } from '../utils/apiResponse';
import { getPublicContent, getPublicSeo } from '../services/publicContent.service';
import { Registration } from '../models/Registration';
import { Workshop } from '../models/Workshop';
import { Payment } from '../models/Payment';

export const rootHandler = asyncHandler(async (_req, res) => {
  ok(res, {
    name: 'AI IN ACTION API',
    version: '2.0.0',
    docs: `${env.API_PREFIX}/health`,
    content: `${env.API_PREFIX}/content`,
    site: env.SITE_URL,
  });
});

export const healthHandler = asyncHandler(async (_req, res) => {
  ok(res, { status: 'ok', time: new Date().toISOString() });
});

export const publicContentHandler = asyncHandler(async (_req, res) => {
  ok(res, await getPublicContent());
});

export const sitemapHandler = asyncHandler(async (_req, res) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${env.SITE_URL}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${env.SITE_URL}/book</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
</urlset>`;
  res.type('application/xml').send(xml);
});

export const robotsHandler = asyncHandler(async (_req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${env.SITE_URL}/sitemap.xml\n`);
});

export const seoHandler = asyncHandler(async (_req, res) => {
  ok(res, await getPublicSeo());
});

export const dashboardHandler = asyncHandler(async (_req: Request, res: Response) => {
  const [registrations, paid, workshops, payments] = await Promise.all([
    Registration.countDocuments({ isDeleted: false }),
    Registration.countDocuments({ status: 'paid', isDeleted: false }),
    Workshop.countDocuments({ isDeleted: false }),
    Payment.countDocuments({ status: 'captured' }),
  ]);
  const recent = await Registration.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(8).lean();
  ok(res, { registrations, paid, workshops, payments, recent });
});
