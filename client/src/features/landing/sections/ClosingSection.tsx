import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { Reveal } from '@/components/motion/Reveal';
import { EASE_EXPO } from '@/lib/motion';
import { list } from './utils';
import type { PublicContent } from '@/types/content';

export function ClosingSection({ content }: { content: PublicContent }) {
  const faqs = list(content.faqs);
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <>
      {faqs.length > 0 ? (
        <Section id="faq" tone="paper">
          <SectionHeader invert eyebrow={content.sections.faq?.eyebrow} title={content.sections.faq?.title} emphasis={content.sections.faq?.titleEmphasis} />
          <div className="mx-auto max-w-3xl space-y-2">
            {faqs.map((faq) => {
              const isOpen = open === faq.id;
              return (
                <InteractiveCard key={faq.id} glow="volt" className="overflow-hidden">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    onClick={() => setOpen(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-base font-bold text-ink sm:text-lg">{faq.question}</span>
                    <motion.span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-paper font-mono text-sm text-ink"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: EASE_EXPO }}
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE_EXPO }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-ink/75 sm:px-6 sm:text-base">{faq.answer}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </InteractiveCard>
              );
            })}
          </div>
        </Section>
      ) : null}

      <Section id="contact">
        <SectionHeader eyebrow={content.sections.contact?.eyebrow} title={content.sections.contact?.title} emphasis={content.sections.contact?.titleEmphasis} />
        <div className="grid gap-4 md:grid-cols-2">
          {list(content.contacts).map((person) => (
            <Reveal key={person.id}>
              <InteractiveCard glow="royal" className="p-6">
                <h3 className="font-display text-2xl font-bold">{person.name}</h3>
                <p className="mt-1 text-sm text-mist">{person.role}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {person.showCallButton && person.phone ? (
                    <a className="rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-wider text-ember-300 transition hover:border-ember-400" href={`tel:${person.phone}`}>
                      Call
                    </a>
                  ) : null}
                  {person.showWhatsappButton && person.whatsappNumber ? (
                    <a
                      className="rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-wider text-ember-300 transition hover:border-ember-400"
                      href={`https://wa.me/${person.whatsappNumber}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </a>
                  ) : null}
                </div>
              </InteractiveCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="final" noShell className="pb-section">
        <Reveal className="shell">
          <div className="panel gradient-border relative overflow-hidden rounded-3xl px-6 py-16 text-center md:px-12 md:py-20">
            <div className="pointer-events-none absolute inset-0 bg-engine-glow opacity-50" />
            <p className="relative label-mono text-ember-300">{content.sections['final-cta']?.eyebrow}</p>
            <h2 className="relative mt-4 font-display text-display-md font-bold">
              {content.sections['final-cta']?.title}{' '}
              <span className="text-gradient-animated">{content.sections['final-cta']?.titleEmphasis}</span>
            </h2>
            <ButtonLink to="/book" className="relative mt-8">
              Secure Your Seat
            </ButtonLink>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
