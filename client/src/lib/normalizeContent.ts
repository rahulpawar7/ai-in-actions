import type {
  Bonus,
  ContactPerson,
  CurriculumModule,
  Faq,
  GalleryItem,
  HeroContent,
  PublicContent,
  SiteSettings,
  Speaker,
  Testimonial,
} from '@/types/content';

type WithMongoId = { id?: string; _id?: unknown };

function withId<T extends WithMongoId>(item: T, fallback: string): T & { id: string } {
  return { ...item, id: String(item.id ?? item._id ?? fallback) };
}

function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

const FEATURE_GROUPS = ['benefit', 'outcome', 'support', 'audience', 'usecase', 'workflow'] as const;

function normalizeFeatures(raw?: Partial<PublicContent>['features']): PublicContent['features'] {
  const result = {} as PublicContent['features'];
  for (const group of FEATURE_GROUPS) {
    result[group] = asArray(raw?.[group])
      .filter(isRecord)
      .map((item, index) => withId(item as WithMongoId, `${group}-${index}`)) as PublicContent['features'][typeof group];
  }
  return result;
}

function normalizeSections(raw?: Partial<PublicContent>['sections']): PublicContent['sections'] {
  const sections: PublicContent['sections'] = {};
  for (const [key, section] of Object.entries(raw ?? {})) {
    if (!isRecord(section)) continue;
    sections[key] = {
      ...(section as PublicContent['sections'][string]),
      id: String(section.id ?? (section as WithMongoId)._id ?? key),
      sectionKey: String(section.sectionKey ?? key),
      items: asArray(section.items as unknown[]).filter(isRecord),
    };
  }
  return sections;
}

function normalizeSite(raw: Partial<PublicContent>['site']): SiteSettings | null {
  if (!isRecord(raw)) return null;
  const site = raw as SiteSettings;
  const footer = isRecord(site.footer)
    ? {
        ...site.footer,
        linkGroups: asArray(site.footer.linkGroups)
          .filter(isRecord)
          .map((group) => ({
            ...group,
            links: asArray(group.links).filter(isRecord),
          })),
      }
    : site.footer;
  return {
    ...site,
    navLinks: asArray(site.navLinks).filter(isRecord),
    footer,
    sectionVisibility: site.sectionVisibility ?? {},
  };
}

function normalizeHero(raw: Partial<PublicContent>['hero']): HeroContent | null {
  if (!isRecord(raw)) return null;
  return {
    ...(raw as HeroContent),
    headlineLines: asArray(raw.headlineLines).filter((line): line is string => typeof line === 'string' && line.length > 0),
    emphasisWords: asArray(raw.emphasisWords).filter((word): word is string => typeof word === 'string'),
    highlights: asArray(raw.highlights).filter(isRecord),
    trustSignals: asArray(raw.trustSignals).filter((item): item is string => typeof item === 'string'),
    marqueeItems: asArray(raw.marqueeItems).filter((item): item is string => typeof item === 'string'),
  };
}

function normalizeList<T extends WithMongoId>(items: T[] | null | undefined, prefix: string): (T & { id: string })[] {
  return asArray(items)
    .filter(isRecord)
    .map((item, index) => withId(item as T, `${prefix}-${index}`));
}

/** Ensures every list and feature group exists — safe for partial API payloads and stale cache. */
export function normalizePublicContent(raw: Partial<PublicContent>): PublicContent {
  return {
    site: normalizeSite(raw.site),
    seo: isRecord(raw.seo) ? raw.seo : null,
    hero: normalizeHero(raw.hero),
    workshop: isRecord(raw.workshop) ? (raw.workshop as PublicContent['workshop']) : null,
    urgency: isRecord(raw.urgency) ? raw.urgency : null,
    features: normalizeFeatures(raw.features),
    sections: normalizeSections(raw.sections),
    curriculum: normalizeList(raw.curriculum as CurriculumModule[] | undefined, 'curriculum') as CurriculumModule[],
    bonuses: normalizeList(raw.bonuses as Bonus[] | undefined, 'bonus') as Bonus[],
    bonusTotalValue: raw.bonusTotalValue ?? 0,
    testimonials: normalizeList(raw.testimonials as Testimonial[] | undefined, 'testimonial') as Testimonial[],
    faqs: normalizeList(raw.faqs as Faq[] | undefined, 'faq') as Faq[],
    gallery: normalizeList(raw.gallery as GalleryItem[] | undefined, 'gallery') as GalleryItem[],
    contacts: normalizeList(raw.contacts as ContactPerson[] | undefined, 'contact') as ContactPerson[],
    speakers: normalizeList(raw.speakers as Speaker[] | undefined, 'speaker') as Speaker[],
    generatedAt: raw.generatedAt ?? new Date().toISOString(),
  };
}
