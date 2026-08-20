import type { FormSchema } from './types';

const PUBLISH_FIELDS = [
  { key: 'order', type: 'number' as const, label: 'Sort order', min: 0 },
  { key: 'isActive', type: 'toggle' as const, label: 'Published on site' },
];

const FEATURED_TOGGLE = { key: 'isFeatured', type: 'toggle' as const, label: 'Featured' };

const LANDING_SECTIONS = [
  { key: 'engine', label: 'Engine section' },
  { key: 'visualization', label: 'Visualization' },
  { key: 'transformation', label: 'Transformation' },
  { key: 'experience', label: 'Experience' },
  { key: 'curriculum', label: 'Curriculum' },
  { key: 'speakers', label: 'Speakers' },
  { key: 'pricing', label: 'Pricing & bonuses' },
  { key: 'faq', label: 'FAQ & contact' },
];

const HIGHLIGHT_ITEM_FIELDS = [
  { key: 'label', type: 'text' as const, label: 'Label' },
  { key: 'value', type: 'text' as const, label: 'Value' },
  { key: 'icon', type: 'text' as const, label: 'Icon (optional)' },
  { key: 'isActive', type: 'toggle' as const, label: 'Active' },
];

const LINK_ITEM_FIELDS = [
  { key: 'label', type: 'text' as const, label: 'Label' },
  { key: 'href', type: 'text' as const, label: 'URL / anchor' },
  { key: 'isExternal', type: 'toggle' as const, label: 'External link' },
  { key: 'isActive', type: 'toggle' as const, label: 'Active' },
  { key: 'order', type: 'number' as const, label: 'Order', min: 0 },
];

export const ADMIN_FORM_SCHEMAS: Record<string, FormSchema> = {
  hero: {
    sections: [
      {
        title: 'Headline',
        description: 'Main hero copy on the landing page.',
        fields: [
          { key: 'eyebrow', type: 'text', label: 'Eyebrow', placeholder: 'Live online workshop' },
          { key: 'headlineLines', type: 'string-list', label: 'Headline lines', hint: 'Usually 2 lines' },
          { key: 'emphasisWords', type: 'string-list', label: 'Emphasis words', hint: 'Words highlighted in the headline' },
          { key: 'subheadline', type: 'textarea', label: 'Subheadline', colSpan: 2, rows: 2 },
          { key: 'supportingText', type: 'textarea', label: 'Supporting text', colSpan: 2, rows: 2 },
        ],
      },
      {
        title: 'Call to action',
        fields: [
          { key: 'primaryCta', type: 'cta', label: 'Primary button' },
          { key: 'secondaryCta', type: 'cta', label: 'Secondary button' },
        ],
      },
      {
        title: 'Highlights & trust',
        fields: [
          {
            key: 'highlights',
            type: 'repeater',
            label: 'Stat highlights',
            itemLabel: 'label',
            addLabel: 'Add highlight',
            defaultItem: { label: '', value: '', isActive: true },
            fields: HIGHLIGHT_ITEM_FIELDS,
          },
          { key: 'trustSignals', type: 'string-list', label: 'Trust signals' },
          { key: 'marqueeItems', type: 'string-list', label: 'Marquee ticker items' },
        ],
      },
      {
        title: 'Background media',
        fields: [{ key: 'backgroundVideo', type: 'media', label: 'Background video', hint: 'Optional looping video behind the hero' }],
      },
      {
        title: 'Status',
        fields: [{ key: 'isActive', type: 'toggle', label: 'Hero section active' }],
      },
    ],
  },

  'site-settings': {
    sections: [
      {
        title: 'Brand',
        fields: [
          { key: 'brandName', type: 'text', label: 'Brand name' },
          { key: 'brandInitials', type: 'text', label: 'Initials (logo mark)' },
          { key: 'brandTagline', type: 'text', label: 'Tagline', colSpan: 2 },
        ],
      },
      {
        title: 'Announcement bar',
        fields: [
          {
            key: 'announcementBar',
            type: 'group',
            label: 'Top banner',
            fields: [
              { key: 'isEnabled', type: 'toggle', label: 'Show announcement bar' },
              { key: 'text', type: 'text', label: 'Message', colSpan: 2 },
              { key: 'highlight', type: 'text', label: 'Highlighted prefix' },
            ],
          },
        ],
      },
      {
        title: 'Navigation',
        fields: [
          {
            key: 'navLinks',
            type: 'repeater',
            label: 'Nav links',
            itemLabel: 'label',
            addLabel: 'Add link',
            defaultItem: { label: '', href: '#', isExternal: false, isActive: true, order: 0 },
            fields: LINK_ITEM_FIELDS,
          },
          { key: 'headerCta', type: 'cta', label: 'Header button' },
        ],
      },
      {
        title: 'Mobile sticky CTA',
        fields: [
          {
            key: 'stickyMobileCta',
            type: 'group',
            label: 'Sticky mobile bar',
            fields: [
              { key: 'isEnabled', type: 'toggle', label: 'Enabled on mobile' },
              { key: 'label', type: 'text', label: 'Button label' },
              { key: 'helperText', type: 'text', label: 'Helper text' },
            ],
          },
        ],
      },
      {
        title: 'Footer',
        fields: [
          {
            key: 'footer',
            type: 'group',
            label: 'Footer content',
            fields: [
              { key: 'description', type: 'textarea', label: 'Description', colSpan: 2, rows: 3 },
              { key: 'copyright', type: 'text', label: 'Copyright line', colSpan: 2 },
              { key: 'disclaimer', type: 'textarea', label: 'Disclaimer', colSpan: 2, rows: 2 },
            ],
          },
          {
            key: 'footer.linkGroups',
            type: 'repeater',
            label: 'Footer link groups',
            itemLabel: 'title',
            addLabel: 'Add group',
            defaultItem: { title: '', order: 0, links: [] },
            fields: [
              { key: 'title', type: 'text', label: 'Group title' },
              { key: 'order', type: 'number', label: 'Order', min: 0 },
              {
                key: 'links',
                type: 'repeater',
                label: 'Links in group',
                itemLabel: 'label',
                addLabel: 'Add link',
                defaultItem: { label: '', href: '#', isExternal: false, isActive: true, order: 0 },
                fields: LINK_ITEM_FIELDS,
              },
            ],
          },
        ],
      },
      {
        title: 'Social links',
        fields: [
          {
            key: 'socialLinks',
            type: 'repeater',
            label: 'Social profiles',
            itemLabel: 'platform',
            addLabel: 'Add social link',
            defaultItem: { platform: '', url: '', label: '', isActive: true, order: 0 },
            fields: [
              { key: 'platform', type: 'text', label: 'Platform' },
              { key: 'label', type: 'text', label: 'Label' },
              { key: 'url', type: 'url', label: 'URL', colSpan: 2 },
              { key: 'isActive', type: 'toggle', label: 'Active' },
              { key: 'order', type: 'number', label: 'Order', min: 0 },
            ],
          },
        ],
      },
      {
        title: 'Section visibility',
        description: 'Hide entire landing sections without deleting content.',
        fields: [
          {
            key: 'sectionVisibility',
            type: 'section-visibility',
            label: 'Visible sections',
            sections: LANDING_SECTIONS,
          },
        ],
      },
      {
        title: 'Maintenance mode',
        fields: [
          {
            key: 'maintenanceMode',
            type: 'group',
            label: 'Maintenance',
            fields: [
              { key: 'isEnabled', type: 'toggle', label: 'Enable maintenance page' },
              { key: 'message', type: 'textarea', label: 'Message shown to visitors', colSpan: 2, rows: 3 },
            ],
          },
        ],
      },
    ],
  },

  seo: {
    sections: [
      {
        title: 'Page defaults',
        fields: [
          { key: 'siteName', type: 'text', label: 'Site name' },
          { key: 'defaultTitle', type: 'text', label: 'Default title', colSpan: 2 },
          { key: 'titleTemplate', type: 'text', label: 'Title template', hint: 'Use %s for page title' },
          { key: 'defaultDescription', type: 'textarea', label: 'Meta description', colSpan: 2, rows: 3 },
          { key: 'keywords', type: 'string-list', label: 'Keywords' },
          { key: 'canonicalUrl', type: 'url', label: 'Canonical URL', colSpan: 2 },
        ],
      },
      {
        title: 'Social & theme',
        fields: [
          { key: 'ogImage', type: 'media', label: 'Open Graph image' },
          {
            key: 'twitterCardType',
            type: 'select',
            label: 'Twitter card',
            options: [
              { value: 'summary', label: 'Summary' },
              { value: 'summary_large_image', label: 'Large image' },
            ],
          },
          { key: 'robots', type: 'text', label: 'Robots meta' },
          { key: 'themeColor', type: 'text', label: 'Theme color' },
          { key: 'locale', type: 'text', label: 'Locale' },
        ],
      },
      {
        title: 'Organization',
        fields: [
          {
            key: 'organization',
            type: 'group',
            label: 'Organization details',
            fields: [
              { key: 'name', type: 'text', label: 'Name' },
              { key: 'url', type: 'url', label: 'Website URL' },
              { key: 'phone', type: 'text', label: 'Phone' },
              { key: 'addressRegion', type: 'text', label: 'Region' },
              { key: 'addressCountry', type: 'text', label: 'Country' },
            ],
          },
        ],
      },
      {
        title: 'Structured data',
        fields: [
          {
            key: 'structuredData',
            type: 'group',
            label: 'JSON-LD toggles',
            fields: [
              { key: 'enableOrganization', type: 'toggle', label: 'Organization schema' },
              { key: 'enableEvent', type: 'toggle', label: 'Event schema' },
              { key: 'enableFaq', type: 'toggle', label: 'FAQ schema' },
            ],
          },
        ],
      },
    ],
  },

  workshops: {
    newItemDefaults: {
      isActive: true,
      order: 0,
      name: '',
      tagline: '',
      description: '',
      batchName: 'Batch 01',
      batchNumber: 1,
      mode: 'Live Online',
      platform: 'Zoom',
      durationLabel: '10 Days',
      totalDays: 10,
      sessionDurationLabel: '1.5–2 Hours',
      totalLearningHours: 20,
      language: 'Hindi + English',
      timezone: 'Asia/Kolkata',
      capacity: 30,
      seatsAvailable: 30,
      registrationStatus: 'open',
      enrollmentStatus: 'upcoming',
      pricing: { currency: 'INR', currencySymbol: '₹', currentPrice: 0, futurePrice: 0, bonusValue: 0 },
      urgency: {},
      highlights: [],
      inclusions: [],
    },
    sections: [
      {
        title: 'Workshop basics',
        fields: [
          { key: 'name', type: 'text', label: 'Workshop name', required: true, colSpan: 2 },
          { key: 'tagline', type: 'text', label: 'Tagline', colSpan: 2 },
          { key: 'description', type: 'textarea', label: 'Description', colSpan: 2, rows: 4 },
          { key: 'batchName', type: 'text', label: 'Batch name' },
          { key: 'batchNumber', type: 'number', label: 'Batch number', min: 1 },
        ],
      },
      {
        title: 'Schedule',
        fields: [
          { key: 'startDate', type: 'datetime-local', label: 'Start date' },
          { key: 'endDate', type: 'datetime-local', label: 'End date' },
          { key: 'durationLabel', type: 'text', label: 'Duration label' },
          { key: 'totalDays', type: 'number', label: 'Total days', min: 1 },
          { key: 'sessionDurationLabel', type: 'text', label: 'Session duration' },
          { key: 'totalLearningHours', type: 'number', label: 'Learning hours', min: 0 },
          { key: 'sessionTimeLabel', type: 'text', label: 'Session time label' },
          { key: 'timezone', type: 'text', label: 'Timezone' },
          { key: 'language', type: 'text', label: 'Language' },
          { key: 'mode', type: 'text', label: 'Mode' },
          { key: 'platform', type: 'text', label: 'Platform' },
        ],
      },
      {
        title: 'Capacity & status',
        fields: [
          { key: 'capacity', type: 'number', label: 'Total capacity', min: 1 },
          { key: 'seatsAvailable', type: 'number', label: 'Seats available', min: 0 },
          {
            key: 'registrationStatus',
            type: 'select',
            label: 'Registration status',
            options: [
              { value: 'open', label: 'Open' },
              { value: 'closing-soon', label: 'Closing soon' },
              { value: 'closed', label: 'Closed' },
              { value: 'waitlist', label: 'Waitlist' },
              { value: 'sold-out', label: 'Sold out' },
            ],
          },
          {
            key: 'enrollmentStatus',
            type: 'select',
            label: 'Enrollment status',
            options: [
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'live', label: 'Live' },
              { value: 'completed', label: 'Completed' },
            ],
          },
        ],
      },
      {
        title: 'Pricing',
        fields: [
          {
            key: 'pricing',
            type: 'group',
            label: 'Price details',
            fields: [
              { key: 'currency', type: 'text', label: 'Currency code' },
              { key: 'currencySymbol', type: 'text', label: 'Symbol' },
              { key: 'currentPrice', type: 'number', label: 'Current price', min: 0 },
              { key: 'futurePrice', type: 'number', label: 'Future price', min: 0 },
              { key: 'priceNote', type: 'text', label: 'Price note', colSpan: 2 },
              { key: 'bonusValue', type: 'number', label: 'Bonus value', min: 0 },
              { key: 'bonusValueLabel', type: 'text', label: 'Bonus value label' },
            ],
          },
        ],
      },
      {
        title: 'Urgency messaging',
        fields: [
          {
            key: 'urgency',
            type: 'group',
            label: 'Urgency blocks',
            fields: [
              { key: 'countdownEnabled', type: 'toggle', label: 'Show countdown' },
              { key: 'countdownLabel', type: 'text', label: 'Countdown label' },
              { key: 'countdownTarget', type: 'datetime-local', label: 'Countdown target' },
              { key: 'countdownExpiredMessage', type: 'text', label: 'Expired message', colSpan: 2 },
              { key: 'seatsCounterEnabled', type: 'toggle', label: 'Show seats counter' },
              { key: 'seatsMessageTemplate', type: 'text', label: 'Seats message template', colSpan: 2 },
              { key: 'priceIncreaseNoticeEnabled', type: 'toggle', label: 'Price increase notice' },
              { key: 'priceIncreaseMessage', type: 'textarea', label: 'Price increase message', colSpan: 2, rows: 2 },
              { key: 'limitedOfferEnabled', type: 'toggle', label: 'Limited offer banner' },
              { key: 'limitedOfferMessage', type: 'text', label: 'Limited offer message', colSpan: 2 },
            ],
          },
        ],
      },
      {
        title: 'Content',
        fields: [
          {
            key: 'highlights',
            type: 'repeater',
            label: 'Highlights',
            itemLabel: 'label',
            addLabel: 'Add highlight',
            defaultItem: { label: '', value: '', isActive: true },
            fields: HIGHLIGHT_ITEM_FIELDS,
          },
          { key: 'inclusions', type: 'string-list', label: 'What is included' },
          { key: 'coverMedia', type: 'media', label: 'Cover image / video' },
        ],
      },
      {
        title: 'Publishing',
        fields: [{ key: 'isActive', type: 'toggle', label: 'Active workshop' }],
      },
    ],
  },

  features: {
    newItemDefaults: { isActive: true, order: 0, group: 'benefit', title: '', description: '', isFeatured: false },
    sections: [
      {
        title: 'Feature',
        fields: [
          {
            key: 'group',
            type: 'select',
            label: 'Group',
            options: [
              { value: 'benefit', label: 'Benefit' },
              { value: 'outcome', label: 'Outcome' },
              { value: 'support', label: 'Support' },
              { value: 'audience', label: 'Audience' },
              { value: 'usecase', label: 'Use case' },
              { value: 'workflow', label: 'Workflow' },
            ],
          },
          { key: 'title', type: 'text', label: 'Title', colSpan: 2, required: true },
          { key: 'description', type: 'textarea', label: 'Description', colSpan: 2, rows: 3, required: true },
          { key: 'icon', type: 'text', label: 'Icon' },
          { key: 'tag', type: 'text', label: 'Tag' },
          { key: 'beforeLabel', type: 'text', label: 'Before label' },
          { key: 'afterLabel', type: 'text', label: 'After label' },
          { key: 'metricValue', type: 'number', label: 'Metric value' },
          { key: 'metricSuffix', type: 'text', label: 'Metric suffix' },
          { key: 'metricLabel', type: 'text', label: 'Metric label' },
          FEATURED_TOGGLE,
          ...PUBLISH_FIELDS,
        ],
      },
    ],
  },

  curriculum: {
    newItemDefaults: { isActive: true, order: 0, dayNumber: 1, title: '', description: '', learningObjectives: [], tools: [], isHighlighted: false },
    sections: [
      {
        title: 'Module',
        fields: [
          { key: 'dayNumber', type: 'number', label: 'Day number', min: 1, required: true },
          { key: 'title', type: 'text', label: 'Title', colSpan: 2, required: true },
          { key: 'subtitle', type: 'text', label: 'Subtitle', colSpan: 2 },
          { key: 'phase', type: 'text', label: 'Phase' },
          { key: 'icon', type: 'text', label: 'Icon' },
          { key: 'description', type: 'textarea', label: 'Description', colSpan: 2, rows: 4, required: true },
          { key: 'learningObjectives', type: 'string-list', label: 'Learning objectives' },
          { key: 'tools', type: 'string-list', label: 'Tools covered' },
          { key: 'outcome', type: 'text', label: 'Outcome', colSpan: 2 },
          { key: 'durationLabel', type: 'text', label: 'Duration label' },
          { key: 'isHighlighted', type: 'toggle', label: 'Highlighted module' },
          ...PUBLISH_FIELDS,
        ],
      },
    ],
  },

  sections: {
    newItemDefaults: { isActive: true, order: 0, sectionKey: '', name: '', items: [] },
    sections: [
      {
        title: 'Section header',
        fields: [
          { key: 'sectionKey', type: 'text', label: 'Section key', hint: 'Unique ID used on the site', required: true },
          { key: 'name', type: 'text', label: 'Internal name', required: true },
          { key: 'eyebrow', type: 'text', label: 'Eyebrow' },
          { key: 'title', type: 'text', label: 'Title', colSpan: 2 },
          { key: 'titleEmphasis', type: 'text', label: 'Title emphasis' },
          { key: 'subtitle', type: 'textarea', label: 'Subtitle', colSpan: 2, rows: 2 },
          { key: 'body', type: 'textarea', label: 'Body copy', colSpan: 2, rows: 3 },
          { key: 'footnote', type: 'text', label: 'Footnote', colSpan: 2 },
          { key: 'layoutVariant', type: 'text', label: 'Layout variant' },
        ],
      },
      {
        title: 'Section items',
        fields: [
          {
            key: 'items',
            type: 'repeater',
            label: 'Content items',
            itemLabel: 'title',
            addLabel: 'Add item',
            defaultItem: { title: '', description: '', isActive: true, order: 0 },
            fields: [
              { key: 'title', type: 'text', label: 'Title' },
              { key: 'label', type: 'text', label: 'Label' },
              { key: 'value', type: 'text', label: 'Value' },
              { key: 'description', type: 'textarea', label: 'Description', colSpan: 2, rows: 2 },
              { key: 'icon', type: 'text', label: 'Icon' },
              { key: 'accent', type: 'text', label: 'Accent' },
              { key: 'media', type: 'media', label: 'Media' },
              { key: 'isActive', type: 'toggle', label: 'Active' },
              { key: 'order', type: 'number', label: 'Order', min: 0 },
            ],
          },
          ...PUBLISH_FIELDS,
        ],
      },
    ],
  },

  bonuses: {
    newItemDefaults: { isActive: true, order: 0, title: '', description: '', actualValue: 0, displayValue: '', isFeatured: false },
    sections: [
      {
        title: 'Bonus',
        fields: [
          { key: 'title', type: 'text', label: 'Title', colSpan: 2, required: true },
          { key: 'subtitle', type: 'text', label: 'Subtitle', colSpan: 2 },
          { key: 'description', type: 'textarea', label: 'Description', colSpan: 2, rows: 3, required: true },
          { key: 'actualValue', type: 'number', label: 'Actual value (INR)', min: 0 },
          { key: 'displayValue', type: 'text', label: 'Display value', placeholder: '₹5,000 value' },
          { key: 'icon', type: 'text', label: 'Icon' },
          { key: 'accent', type: 'text', label: 'Accent color token' },
          { key: 'badge', type: 'text', label: 'Badge text' },
          FEATURED_TOGGLE,
          ...PUBLISH_FIELDS,
        ],
      },
    ],
  },

  testimonials: {
    newItemDefaults: { isActive: true, order: 0, name: '', quote: '', rating: 5, isFeatured: false },
    sections: [
      {
        title: 'Testimonial',
        fields: [
          { key: 'name', type: 'text', label: 'Name', required: true },
          { key: 'role', type: 'text', label: 'Role' },
          { key: 'company', type: 'text', label: 'Company' },
          { key: 'rating', type: 'number', label: 'Rating (1–5)', min: 1, max: 5 },
          { key: 'quote', type: 'textarea', label: 'Quote', colSpan: 2, rows: 4, required: true },
          { key: 'highlight', type: 'text', label: 'Highlight phrase', colSpan: 2 },
          { key: 'resultMetric', type: 'text', label: 'Result metric' },
          { key: 'avatar', type: 'media', label: 'Avatar photo' },
          { key: 'video', type: 'media', label: 'Video testimonial' },
          FEATURED_TOGGLE,
          ...PUBLISH_FIELDS,
        ],
      },
    ],
  },

  faqs: {
    newItemDefaults: { isActive: true, order: 0, question: '', answer: '', isFeatured: false },
    sections: [
      {
        title: 'FAQ entry',
        fields: [
          { key: 'question', type: 'text', label: 'Question', colSpan: 2, required: true },
          { key: 'answer', type: 'textarea', label: 'Answer', colSpan: 2, rows: 5, required: true },
          { key: 'category', type: 'text', label: 'Category' },
          FEATURED_TOGGLE,
          ...PUBLISH_FIELDS,
        ],
      },
    ],
  },

  speakers: {
    newItemDefaults: { isActive: true, order: 0, name: '', role: '' },
    sections: [
      {
        title: 'Speaker',
        fields: [
          { key: 'name', type: 'text', label: 'Name', required: true },
          { key: 'role', type: 'text', label: 'Role / title', required: true },
          { key: 'bio', type: 'textarea', label: 'Bio', colSpan: 2, rows: 4 },
          { key: 'photo', type: 'media', label: 'Photo' },
          { key: 'video', type: 'media', label: 'Intro video' },
          ...PUBLISH_FIELDS,
        ],
      },
    ],
  },

  gallery: {
    newItemDefaults: {
      isActive: true,
      order: 0,
      title: '',
      category: 'workshop',
      media: { url: '', kind: 'video', provider: 'external' },
    },
    sections: [
      {
        title: 'Gallery item',
        fields: [
          { key: 'title', type: 'text', label: 'Title', colSpan: 2, required: true },
          { key: 'description', type: 'textarea', label: 'Description', colSpan: 2, rows: 2 },
          {
            key: 'category',
            type: 'select',
            label: 'Category',
            options: [
              { value: 'workshop', label: 'Workshop' },
              { value: 'workflow', label: 'Workflow' },
              { value: 'testimonial', label: 'Testimonial' },
              { value: 'speaker', label: 'Speaker' },
              { value: 'demo', label: 'Demo' },
              { value: 'ai-action', label: 'AI in action' },
              { value: 'other', label: 'Other' },
            ],
          },
          { key: 'media', type: 'media', label: 'Media', colSpan: 2 },
          ...PUBLISH_FIELDS,
        ],
      },
    ],
  },

  contacts: {
    newItemDefaults: {
      isActive: true,
      order: 0,
      name: '',
      showCallButton: true,
      showWhatsappButton: true,
    },
    sections: [
      {
        title: 'Contact person',
        fields: [
          { key: 'name', type: 'text', label: 'Name', required: true },
          { key: 'role', type: 'text', label: 'Role' },
          { key: 'phone', type: 'text', label: 'Phone' },
          { key: 'email', type: 'email', label: 'Email' },
          { key: 'whatsappNumber', type: 'text', label: 'WhatsApp number' },
          { key: 'whatsappMessage', type: 'text', label: 'WhatsApp prefilled message', colSpan: 2 },
          { key: 'availabilityNote', type: 'text', label: 'Availability note', colSpan: 2 },
          { key: 'avatar', type: 'media', label: 'Avatar' },
          { key: 'showCallButton', type: 'toggle', label: 'Show call button' },
          { key: 'showWhatsappButton', type: 'toggle', label: 'Show WhatsApp button' },
          ...PUBLISH_FIELDS,
        ],
      },
    ],
  },
};

export function getAdminFormSchema(path: string): FormSchema | null {
  return ADMIN_FORM_SCHEMAS[path] ?? null;
}
