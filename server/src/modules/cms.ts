import type { Request, Response } from 'express';
import { z } from 'zod';
import {
  Bonus,
  ContactPerson,
  ContentSection,
  CurriculumModule,
  Faq,
  Feature,
  GalleryItem,
  HeroContent,
  SeoSettings,
  SiteSettings,
  Speaker,
  Testimonial,
  Workshop,
  Registration,
  Payment,
} from '../models';
import { FEATURE_GROUPS } from '../models/cms';
import { createCrudService, createSingletonService } from '../services/crud.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ok } from '../utils/apiResponse';
import { validate } from '../middleware/validate';
import { listQuerySchema, collectionCreateSchema, collectionUpdateSchema, reorderSchema, toggleSchema } from '../validators/schemas';

function mountCrud(path: string, service: ReturnType<typeof createCrudService>, extraQuery?: z.ZodTypeAny) {
  return {
    path,
    list: [
      validate(extraQuery ?? listQuerySchema, 'query'),
      asyncHandler(async (req: Request, res: Response) => {
        const result = await service.list(req.query as never);
        ok(res, result);
      }),
    ],
    create: [
      validate(collectionCreateSchema),
      asyncHandler(async (req: Request, res: Response) => {
        ok(res, await service.create(req.body), 'Created', 201);
      }),
    ],
    read: asyncHandler(async (req: Request, res: Response) => {
      ok(res, await service.findById(String(req.params.id)));
    }),
    update: [
      validate(collectionUpdateSchema),
      asyncHandler(async (req: Request, res: Response) => {
        ok(res, await service.update(String(req.params.id), req.body), 'Updated');
      }),
    ],
    remove: asyncHandler(async (req: Request, res: Response) => {
      ok(res, await service.softDelete(String(req.params.id)), 'Removed');
    }),
    reorder: [
      validate(reorderSchema),
      asyncHandler(async (req: Request, res: Response) => {
        ok(res, { updated: await service.reorder(req.body.entries) });
      }),
    ],
    toggle: [
      validate(toggleSchema),
      asyncHandler(async (req: Request, res: Response) => {
        ok(res, await service.toggleActive(String(req.params.id), req.body.isActive));
      }),
    ],
  };
}

function mountSingleton(path: string, service: ReturnType<typeof createSingletonService>) {
  return {
    path,
    get: asyncHandler(async (_req: Request, res: Response) => ok(res, await service.get())),
    update: asyncHandler(async (req: Request, res: Response) => ok(res, await service.update(req.body), 'Saved')),
  };
}

export const collections = [
  mountCrud('workshops', createCrudService({ model: Workshop, resource: 'Workshop', searchableFields: ['name', 'tagline', 'batchName'] })),
  mountCrud(
    'features',
    createCrudService({ model: Feature, resource: 'Feature', searchableFields: ['title', 'description'] }),
    listQuerySchema.extend({ group: z.enum(FEATURE_GROUPS).optional() }),
  ),
  mountCrud('curriculum', createCrudService({ model: CurriculumModule, resource: 'Curriculum', searchableFields: ['title', 'description'], defaultSort: { order: 1, dayNumber: 1 } })),
  mountCrud('bonuses', createCrudService({ model: Bonus, resource: 'Bonus', searchableFields: ['title'] })),
  mountCrud('testimonials', createCrudService({ model: Testimonial, resource: 'Testimonial', searchableFields: ['name', 'quote'] })),
  mountCrud('faqs', createCrudService({ model: Faq, resource: 'Faq', searchableFields: ['question', 'answer'] })),
  mountCrud('sections', createCrudService({ model: ContentSection, resource: 'Section', searchableFields: ['name', 'title', 'sectionKey'] })),
  mountCrud('gallery', createCrudService({ model: GalleryItem, resource: 'Gallery', searchableFields: ['title'] })),
  mountCrud('speakers', createCrudService({ model: Speaker, resource: 'Speaker', searchableFields: ['name', 'role'] })),
  mountCrud('contacts', createCrudService({ model: ContactPerson, resource: 'Contact', searchableFields: ['name', 'role'] })),
  mountCrud('registrations', createCrudService({ model: Registration, resource: 'Registration', searchableFields: ['fullName', 'email', 'registrationCode'], defaultSort: { createdAt: -1 } })),
  mountCrud('payments', createCrudService({ model: Payment, resource: 'Payment', searchableFields: ['registrationCode', 'razorpayOrderId'], defaultSort: { createdAt: -1 } })),
];

export const singletons = [
  mountSingleton('site-settings', createSingletonService(SiteSettings, 'SiteSettings')),
  mountSingleton('seo', createSingletonService(SeoSettings, 'SeoSettings')),
  mountSingleton('hero', createSingletonService(HeroContent, 'HeroContent')),
];
