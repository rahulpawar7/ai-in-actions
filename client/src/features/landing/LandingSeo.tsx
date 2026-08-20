import { useEffect } from 'react';
import type { PublicContent } from '@/types/content';

export function HelmetSeo({ content }: { content: PublicContent }) {
  const seo = content.seo;
  const workshop = content.workshop;

  useEffect(() => {
    if (!seo) return;
    document.title = seo.defaultTitle;
    const ensure = (name: string, contentValue: string, attr: 'name' | 'property' = 'name') => {
      let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentValue);
    };
    ensure('description', seo.defaultDescription);
    ensure('og:title', seo.defaultTitle, 'property');
    ensure('og:description', seo.defaultDescription, 'property');
    if (seo.canonicalUrl) {
      let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = seo.canonicalUrl;
    }

    const scripts: object[] = [];
    if (seo.structuredData?.enableOrganization && seo.organization) {
      scripts.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: seo.organization.name,
        url: seo.organization.url,
        telephone: seo.organization.phone,
      });
    }
    if (seo.structuredData?.enableEvent && workshop) {
      scripts.push({
        '@context': 'https://schema.org',
        '@type': 'EducationEvent',
        name: workshop.name,
        startDate: workshop.startDate,
        endDate: workshop.endDate,
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        location: { '@type': 'VirtualLocation', url: seo.canonicalUrl },
        offers: {
          '@type': 'Offer',
          price: workshop.pricing.currentPrice,
          priceCurrency: workshop.pricing.currency,
          availability: 'https://schema.org/LimitedAvailability',
          url: `${seo.canonicalUrl}/book`,
        },
      });
    }
    if (seo.structuredData?.enableFaq && content.faqs.length) {
      scripts.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: content.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      });
    }
    const node = document.createElement('script');
    node.type = 'application/ld+json';
    node.id = 'aia-jsonld';
    node.text = JSON.stringify(scripts);
    document.getElementById('aia-jsonld')?.remove();
    document.head.appendChild(node);
  }, [seo, workshop, content.faqs]);

  return null;
}
