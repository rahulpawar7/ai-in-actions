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
} from '../models';
import { CACHE_KEYS, cache } from '../utils/cache';
import { leanListWithId, leanWithId } from '../utils/leanWithId';

const TTL = 60;
const HIDE = '-isDeleted -deletedAt -__v';
const active = { isActive: true, isDeleted: false };

function formatCurrency(amount: number, symbol: string) {
  return `${symbol}${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;
}

function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

function findActiveWorkshop() {
  return Workshop.findOne({ isActive: true, isDeleted: false }).sort({ startDate: 1, createdAt: -1 }).select(HIDE).exec();
}

export async function getPublicContent() {
  return cache.wrap(CACHE_KEYS.publicContent, TTL, async () => {
    const [
      site,
      seo,
      hero,
      workshopDocument,
      features,
      sections,
      curriculum,
      bonuses,
      testimonials,
      faqs,
      gallery,
      contacts,
      speakers,
    ] = await Promise.all([
      SiteSettings.findOne({ key: 'default' }).select(HIDE).lean(),
      SeoSettings.findOne({ key: 'default' }).select(HIDE).lean(),
      HeroContent.findOne({ key: 'default' }).select(HIDE).lean(),
      findActiveWorkshop(),
      Feature.find(active).sort({ order: 1 }).select(HIDE).lean(),
      ContentSection.find(active).sort({ order: 1 }).select(HIDE).lean(),
      CurriculumModule.find(active).sort({ order: 1, dayNumber: 1 }).select(HIDE).lean(),
      Bonus.find(active).sort({ order: 1 }).select(HIDE).lean(),
      Testimonial.find(active).sort({ isFeatured: -1, order: 1 }).select(HIDE).lean(),
      Faq.find(active).sort({ order: 1 }).select(HIDE).lean(),
      GalleryItem.find(active).sort({ order: 1 }).select(HIDE).lean(),
      ContactPerson.find(active).sort({ order: 1 }).select(HIDE).lean(),
      Speaker.find(active).sort({ order: 1 }).select(HIDE).lean(),
    ]);

    const workshop = workshopDocument ? workshopDocument.toJSON() : null;
    const seatsAvailable = workshopDocument
      ? Math.max(0, Math.min(workshopDocument.seatsAvailable, workshopDocument.capacity))
      : 0;
    const seatsFilled = workshopDocument ? Math.max(0, workshopDocument.capacity - seatsAvailable) : 0;
    const deadlinePassed = Boolean(
      workshopDocument?.registrationDeadline && workshopDocument.registrationDeadline.getTime() < Date.now(),
    );

    const urgency = workshopDocument
      ? {
          registrationStatus: workshopDocument.registrationStatus,
          isRegistrationOpen:
            !deadlinePassed &&
            workshopDocument.registrationStatus !== 'closed' &&
            workshopDocument.registrationStatus !== 'sold-out',
          capacity: workshopDocument.capacity,
          seatsAvailable,
          seatsFilled,
          seatsFilledPercentage:
            workshopDocument.capacity > 0 ? Math.round((seatsFilled / workshopDocument.capacity) * 100) : 0,
          countdown: {
            isEnabled: workshopDocument.urgency.countdownEnabled,
            label: workshopDocument.urgency.countdownLabel,
            target: (workshopDocument.urgency.countdownTarget ?? workshopDocument.registrationDeadline)?.toISOString() ?? null,
            expiredMessage: workshopDocument.urgency.countdownExpiredMessage,
          },
          seatsMessage: workshopDocument.urgency.seatsCounterEnabled
            ? interpolate(workshopDocument.urgency.seatsMessageTemplate, {
                seats: seatsAvailable,
                capacity: workshopDocument.capacity,
                filled: seatsFilled,
                price: formatCurrency(workshopDocument.pricing.currentPrice, workshopDocument.pricing.currencySymbol),
                futurePrice: formatCurrency(workshopDocument.pricing.futurePrice, workshopDocument.pricing.currencySymbol),
              })
            : null,
          priceIncreaseMessage:
            workshopDocument.urgency.priceIncreaseNoticeEnabled &&
            workshopDocument.pricing.futurePrice > workshopDocument.pricing.currentPrice
              ? interpolate(workshopDocument.urgency.priceIncreaseMessage, {
                  price: formatCurrency(workshopDocument.pricing.currentPrice, workshopDocument.pricing.currencySymbol),
                  futurePrice: formatCurrency(
                    workshopDocument.pricing.futurePrice,
                    workshopDocument.pricing.currencySymbol,
                  ),
                })
              : null,
          limitedOfferMessage: workshopDocument.urgency.limitedOfferEnabled
            ? workshopDocument.urgency.limitedOfferMessage
            : null,
        }
      : null;

    const sectionMap = Object.fromEntries(
      leanListWithId(sections as Record<string, unknown>[]).map((section) => {
        const items = Array.isArray(section.items) ? section.items : [];
        return [
          section.sectionKey as string,
          {
            ...section,
            items: items
              .filter((item: { isActive?: boolean }) => item.isActive !== false)
              .sort((a: { order?: number }, b: { order?: number }) => (a.order ?? 0) - (b.order ?? 0)),
          },
        ];
      }),
    );

    const featureList = leanListWithId(features as Record<string, unknown>[]);

    return {
      site: leanWithId(site as Record<string, unknown>),
      seo: leanWithId(seo as Record<string, unknown>),
      hero: leanWithId(hero as Record<string, unknown>),
      workshop,
      urgency,
      features: {
        benefit: featureList.filter((f) => f.group === 'benefit'),
        outcome: featureList.filter((f) => f.group === 'outcome'),
        support: featureList.filter((f) => f.group === 'support'),
        audience: featureList.filter((f) => f.group === 'audience'),
        usecase: featureList.filter((f) => f.group === 'usecase'),
        workflow: featureList.filter((f) => f.group === 'workflow'),
      },
      sections: sectionMap,
      curriculum: leanListWithId(curriculum as Record<string, unknown>[]),
      bonuses: leanListWithId(bonuses as Record<string, unknown>[]),
      bonusTotalValue: bonuses.reduce((total, bonus) => total + (bonus.actualValue ?? 0), 0),
      testimonials: leanListWithId(testimonials as Record<string, unknown>[]),
      faqs: leanListWithId(faqs as Record<string, unknown>[]),
      gallery: leanListWithId(gallery as Record<string, unknown>[]),
      contacts: leanListWithId(contacts as Record<string, unknown>[]),
      speakers: leanListWithId(speakers as Record<string, unknown>[]),
      generatedAt: new Date().toISOString(),
    };
  });
}

export async function getPublicSeo() {
  return cache.wrap(CACHE_KEYS.publicSeo, TTL, async () => {
    const [seo, workshop, faqs] = await Promise.all([
      SeoSettings.findOne({ key: 'default' }).select(HIDE).lean(),
      findActiveWorkshop(),
      Faq.find(active).sort({ order: 1 }).select('question answer').lean(),
    ]);
    return { seo, workshop: workshop ? workshop.toJSON() : null, faqs };
  });
}
