/* eslint-disable no-console */
import bcrypt from 'bcryptjs';
import type { Model } from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { env } from '../config/env';
import {
  Admin,
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
} from '../models';
import {
  heroSeed,
  seoSettingsSeed,
  siteSettingsSeed,
  workshopSeed,
} from './seedContent';
import {
  bonusesSeed,
  contactsSeed,
  contentSectionsSeed,
  curriculumSeed,
  faqsSeed,
  featuresSeed,
  gallerySeed,
  speakersSeed,
  testimonialsSeed,
} from './seedLists';

const FORCE = process.argv.includes('--force');

function report(label: string, created: number, skipped: number) {
  console.log(`  ${label.padEnd(18)} created ${String(created).padStart(3)}   skipped ${String(skipped).padStart(3)}`);
}

async function seedSingleton(model: Model<any>, label: string, data: Record<string, unknown>) {
  const existing = await model.findOne({ key: 'default' });
  if (existing && !FORCE) {
    report(label, 0, 1);
    return;
  }
  if (existing) {
    existing.set(data);
    await existing.save();
    report(label, 1, 0);
    return;
  }
  await model.create(data);
  report(label, 1, 0);
}

async function seedCollection(model: Model<any>, label: string, documents: Record<string, unknown>[], matchKey: string) {
  let created = 0;
  let skipped = 0;
  for (const document of documents) {
    const existing = await model.findOne({ [matchKey]: document[matchKey] });
    if (existing && !FORCE) {
      skipped += 1;
      continue;
    }
    if (existing) {
      existing.set(document);
      await existing.save();
    } else {
      await model.create(document);
    }
    created += 1;
  }
  report(label, created, skipped);
}

async function main() {
  await connectDatabase();
  console.log(`Seeding ${FORCE ? '(force)' : ''}…`);

  await seedSingleton(SiteSettings, 'site', siteSettingsSeed);
  await seedSingleton(SeoSettings, 'seo', seoSettingsSeed);
  await seedSingleton(HeroContent, 'hero', heroSeed);

  const workshopExists = await Workshop.findOne({ name: workshopSeed.name, isDeleted: false });
  if (!workshopExists || FORCE) {
    if (workshopExists && FORCE) {
      workshopExists.set(workshopSeed);
      await workshopExists.save();
    } else if (!workshopExists) {
      await Workshop.create(workshopSeed);
    }
    report('workshop', 1, 0);
  } else {
    report('workshop', 0, 1);
  }

  await seedCollection(Feature, 'features', featuresSeed, 'title');
  await seedCollection(ContentSection, 'sections', contentSectionsSeed, 'sectionKey');
  await seedCollection(CurriculumModule, 'curriculum', curriculumSeed, 'dayNumber');
  await seedCollection(Bonus, 'bonuses', bonusesSeed, 'title');
  await seedCollection(Testimonial, 'testimonials', testimonialsSeed, 'name');
  await seedCollection(Faq, 'faqs', faqsSeed, 'question');
  await seedCollection(ContactPerson, 'contacts', contactsSeed, 'name');
  await seedCollection(Speaker, 'speakers', speakersSeed, 'name');
  await seedCollection(GalleryItem, 'gallery', gallerySeed, 'title');

  const adminExists = await Admin.findOne({ email: env.SEED_ADMIN_EMAIL });
  if (!adminExists) {
    await Admin.create({
      name: env.SEED_ADMIN_NAME,
      email: env.SEED_ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12),
      role: 'owner',
      isActive: true,
    });
    report('admin', 1, 0);
  } else {
    report('admin', 0, 1);
  }

  console.log(`\nAdmin: ${env.SEED_ADMIN_EMAIL}`);
  await disconnectDatabase();
}

main().catch(async (error) => {
  console.error(error);
  await disconnectDatabase();
  process.exit(1);
});
