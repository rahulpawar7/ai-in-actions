import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal, Stagger, StaggerChild } from '@/components/motion/Reveal';
import { useCountdown } from '@/hooks/useCountdown';
import { formatCurrency } from '@/lib/utils';
import { list } from './utils';
import type { PublicContent } from '@/types/content';

export function OfferSection({ content }: { content: PublicContent }) {
  const w = content.workshop;
  const u = content.urgency;
  const countdown = useCountdown(u?.countdown?.target);
  if (!w) return null;

  const remaining = u?.seatsAvailable ?? w.seatsAvailable;
  const capacity = u?.capacity ?? w.capacity;
  const fillPercent = Math.min(100, ((capacity - remaining) / Math.max(capacity, 1)) * 100);
  const bonuses = list(content.bonuses);
  const inclusions = list(w.inclusions);

  return (
    <>
      {bonuses.length > 0 ? (
        <Section id="bonuses" tone="paper">
          <SectionHeader
            invert
            eyebrow={content.sections.bonuses?.eyebrow}
            title={content.sections.bonuses?.title}
            emphasis={content.sections.bonuses?.titleEmphasis}
          />
          <Stagger className="space-y-3">
            {bonuses.map((bonus) => (
              <StaggerChild key={bonus.id}>
                <InteractiveCard glow="ember" className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink">{bonus.title}</h3>
                    <p className="mt-1 text-sm text-ink/70">{bonus.description}</p>
                  </div>
                  <p className="font-display text-2xl font-extrabold text-gradient-ember">{bonus.displayValue}</p>
                </InteractiveCard>
              </StaggerChild>
            ))}
          </Stagger>
        </Section>
      ) : null}

      <Section id="pricing" fullBleed>
        <SectionHeader
          align="center"
          eyebrow={content.sections.pricing?.eyebrow}
          title={content.sections.pricing?.title}
          emphasis={content.sections.pricing?.titleEmphasis}
          subtitle={content.sections.pricing?.subtitle}
        />
        <Reveal className="mx-auto max-w-lg">
          <div className="panel gradient-border relative overflow-hidden rounded-3xl p-8 text-center sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-royal-500/20 blur-3xl" />
            <p className="label-mono text-ember-300">{w.batchName}</p>
            <p className="mt-4 font-display text-5xl font-extrabold tabular sm:text-6xl">
              {formatCurrency(w.pricing?.currentPrice ?? 0, w.pricing?.currencySymbol ?? '₹')}
            </p>
            {u?.priceIncreaseMessage ? <p className="mt-3 text-sm text-mist">{u.priceIncreaseMessage}</p> : null}
            <ul className="mt-8 space-y-2.5 text-left text-sm text-mist">
              {inclusions.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-ember-400">→</span> {item}
                </li>
              ))}
            </ul>
            <ButtonLink to="/book" className="mt-8 w-full">
              Secure Your Seat
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      <Section id="scarcity">
        <SectionHeader eyebrow={content.sections.scarcity?.eyebrow} title={content.sections.scarcity?.title} emphasis={content.sections.scarcity?.titleEmphasis} />
        <Reveal>
          <div className="panel rounded-2xl p-6 sm:p-8">
            <div className="flex justify-between font-mono text-xs uppercase tracking-[0.18em] text-mist-muted">
              <span>
                <CountUp value={remaining} /> remaining
              </span>
              <span>
                <CountUp value={capacity} /> total
              </span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-ink-600">
              <motion.div
                className="h-full bg-ember-sweep"
                initial={{ width: 0 }}
                whileInView={{ width: `${fillPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            {u?.seatsMessage ? <p className="mt-4 text-sm text-mist">{u.seatsMessage}</p> : null}
            {u?.countdown?.isEnabled && !countdown.expired ? (
              <p className="mt-3 font-mono text-sm text-ember-300">
                {u.countdown.label}{' '}
                <span className="tabular">
                  {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </span>
              </p>
            ) : null}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
