import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerChild } from '@/components/motion/Reveal';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { list } from './utils';
import type { PublicContent } from '@/types/content';

export function TransformationSection({ content }: { content: PublicContent }) {
  const section = content.sections.transformation;
  const workflows = list(content.features?.workflow);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const railScale = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  return (
    <Section id="transformation" tone="paper" fullBleed>
      <SectionHeader invert eyebrow={section?.eyebrow} title={section?.title} emphasis={section?.titleEmphasis} />

      <div ref={ref} className="relative">
        {!reduced ? (
          <div className="absolute left-6 top-0 hidden h-full w-px bg-line-paper lg:block">
            <motion.div className="w-full origin-top bg-ember-sweep" style={{ scaleY: railScale, height: '100%' }} />
          </div>
        ) : null}

        <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:pl-12">
          {list(section?.items).map((item, index) => (
            <StaggerChild key={`${item.title ?? 'stage'}-${index}`}>
              <article className="paper-panel group relative overflow-hidden rounded-2xl p-6 transition duration-500 hover:-translate-y-1 hover:shadow-lift">
                <span className="absolute -right-4 -top-4 font-display text-6xl font-bold text-ink/5">{String(index + 1).padStart(2, '0')}</span>
                <p className="eyebrow-invert">{item.label}</p>
                <h3 className="mt-2 font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.description}</p>
              </article>
            </StaggerChild>
          ))}
        </Stagger>
      </div>

      {workflows.length > 0 ? (
        <Reveal className="mt-16">
          <h3 className="text-center font-display text-display-xs font-bold text-ink">
            Before & after <span className="text-gradient-ember">in your business</span>
          </h3>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {workflows.map((item, index) => (
              <motion.article
                key={item.id}
                className="group grid overflow-hidden rounded-2xl border border-line-paper sm:grid-cols-2"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <div className="relative bg-ink p-5 text-paper">
                  <p className="label-mono text-mist-muted">Before</p>
                  <p className="mt-2 text-sm leading-relaxed">{item.beforeLabel ?? item.title}</p>
                  <div className="absolute bottom-3 right-3 font-display text-3xl font-bold text-ink-600">{index + 1}</div>
                </div>
                <div className="relative bg-paper-100 p-5">
                  <p className="eyebrow-invert">After AI</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/80">{item.afterLabel ?? item.description}</p>
                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-line-paper">
                    <motion.div
                      className="h-full bg-ember-sweep"
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </Reveal>
      ) : null}
    </Section>
  );
}
