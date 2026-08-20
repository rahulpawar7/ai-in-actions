export interface MediaRef {
  url: string;
  kind?: string;
  alt?: string;
  posterUrl?: string;
  caption?: string;
}

export interface Cta {
  label: string;
  url: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  isExternal?: boolean;
  isActive?: boolean;
  ariaLabel?: string;
}

export interface Workshop {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  batchName: string;
  batchNumber: number;
  mode: string;
  platform: string;
  durationLabel: string;
  totalDays: number;
  sessionDurationLabel: string;
  totalLearningHours: number;
  language: string;
  timezone: string;
  sessionTimeLabel?: string;
  capacity: number;
  seatsAvailable: number;
  seatsFilled?: number;
  pricing: {
    currency: string;
    currencySymbol: string;
    currentPrice: number;
    futurePrice: number;
    priceNote?: string;
    bonusValue: number;
    bonusValueLabel?: string;
  };
  registrationStatus: string;
  enrollmentStatus: string;
  highlights: { icon?: string; label: string; value: string; isActive?: boolean }[];
  inclusions: string[];
}

export interface Urgency {
  registrationStatus: string;
  isRegistrationOpen: boolean;
  capacity: number;
  seatsAvailable: number;
  seatsFilled: number;
  seatsFilledPercentage: number;
  countdown: { isEnabled: boolean; label: string; target: string | null; expiredMessage: string };
  seatsMessage: string | null;
  priceIncreaseMessage: string | null;
  limitedOfferMessage: string | null;
}

export interface HeroContent {
  eyebrow: string;
  headlineLines: string[];
  emphasisWords: string[];
  subheadline: string;
  supportingText: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  highlights: { label: string; value: string; icon?: string; isActive?: boolean }[];
  trustSignals: string[];
  marqueeItems: string[];
  backgroundVideo?: MediaRef;
}

export interface Feature {
  id: string;
  group: string;
  title: string;
  description: string;
  icon?: string;
  tag?: string;
  beforeLabel?: string;
  afterLabel?: string;
  isFeatured?: boolean;
}

export interface ContentSection {
  id: string;
  sectionKey: string;
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  subtitle?: string;
  body?: string;
  footnote?: string;
  items: { title?: string; description?: string; icon?: string; value?: string; label?: string; isActive?: boolean }[];
}

export interface CurriculumModule {
  id: string;
  dayNumber: number;
  title: string;
  subtitle?: string;
  phase?: string;
  description: string;
  learningObjectives: string[];
  tools: string[];
  outcome?: string;
  durationLabel?: string;
  isHighlighted?: boolean;
}

export interface Bonus {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  actualValue: number;
  displayValue: string;
  badge?: string;
  isFeatured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  highlight?: string;
  resultMetric?: string;
  rating: number;
  isFeatured?: boolean;
  video?: MediaRef;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: MediaRef;
}

export interface ContactPerson {
  id: string;
  name: string;
  role?: string;
  phone?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  availabilityNote?: string;
  showCallButton?: boolean;
  showWhatsappButton?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  media: MediaRef;
}

export interface SiteSettings {
  brandName: string;
  brandTagline: string;
  announcementBar: { isEnabled: boolean; text: string; highlight?: string; cta?: Cta };
  navLinks: { label: string; href: string; isExternal?: boolean; isActive?: boolean }[];
  headerCta: Cta;
  stickyMobileCta: { isEnabled: boolean; label: string; helperText?: string };
  footer: {
    description: string;
    linkGroups: { title: string; links: { label: string; href: string; isExternal?: boolean }[] }[];
    copyright: string;
    disclaimer?: string;
  };
  socialLinks: { platform: string; url: string; label: string; isActive?: boolean }[];
  sectionVisibility: Record<string, boolean>;
  maintenanceMode: { isEnabled: boolean; message: string };
}

export interface SeoSettings {
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  keywords: string[];
  canonicalUrl: string;
  themeColor?: string;
  organization: { name: string; url: string; phone?: string; addressRegion?: string; addressCountry?: string };
  structuredData: { enableOrganization: boolean; enableEvent: boolean; enableFaq: boolean };
}

export interface PublicContent {
  site: SiteSettings | null;
  seo: SeoSettings | null;
  hero: HeroContent | null;
  workshop: Workshop | null;
  urgency: Urgency | null;
  features: {
    benefit: Feature[];
    outcome: Feature[];
    support: Feature[];
    audience: Feature[];
    usecase: Feature[];
    workflow: Feature[];
  };
  sections: Record<string, ContentSection>;
  curriculum: CurriculumModule[];
  bonuses: Bonus[];
  bonusTotalValue: number;
  testimonials: Testimonial[];
  faqs: Faq[];
  gallery: GalleryItem[];
  contacts: ContactPerson[];
  speakers: Speaker[];
  generatedAt: string;
}
