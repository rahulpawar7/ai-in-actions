import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BrandMark, Gear } from '@/components/ui/BrandMark';
import { ButtonLink } from '@/components/ui/Button';
import { KineticHeadline } from '@/components/motion/KineticHeadline';
import { Reveal, Stagger, StaggerChild } from '@/components/motion/Reveal';
import { CountUp } from '@/components/motion/CountUp';
import { ParallaxLayer, DataFlowLines } from '@/components/motion/Parallax';
import { Marquee } from '@/components/motion/Marquee';
import { useCountdown } from '@/hooks/useCountdown';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { formatCurrency } from '@/lib/utils';
import type { PublicContent } from '@/types/content';

function SignalPipeline({ active }: { active: boolean }) {
  const nodes = [
    { label: 'Problem', tone: 'text-mist-muted' },
    { label: 'Engine', tone: 'text-volt-300' },
    { label: 'System', tone: 'text-royal-300' },
    { label: 'Result', tone: 'text-ember-300' },
  ];

  return (
    <div className="panel gradient-border relative overflow-hidden rounded-2xl p-5 sm:p-6">
      <div className="absolute inset-0 bg-engine-glow opacity-60" />
      <div className="relative flex items-center justify-between">
        <p className="label-mono text-ember-300">Live signal path</p>
        <Gear className={`h-5 w-5 ${active ? 'animate-gear' : 'opacity-60'}`} />
      </div>
      <div className="relative mt-6 grid grid-cols-4 gap-2">
        {nodes.map((node, index) => (
          <div key={node.label} className="text-center">
            <div className="mx-auto flex h-16 items-end justify-center gap-1">
              {[10, 18, 26].slice(0, index + 1).map((h, barIndex) => (
                <motion.span
                  key={h}
                  className="w-1.5 origin-bottom rounded-sm bg-volt-400"
                  initial={{ scaleY: 0.2, opacity: 0.4 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: index * 0.15 + barIndex * 0.05, duration: 0.6 }}
                  style={{ height: h, display: 'block' }}
                />
              ))}
            </div>
            <p className={`mt-3 font-display text-[0.65rem] font-bold uppercase tracking-[0.14em] sm:text-xs ${node.tone}`}>
              {node.label}
            </p>
          </div>
        ))}
      </div>
      <svg className="relative mt-4 h-10 w-full" viewBox="0 0 400 40" fill="none" aria-hidden>
        <path
          d="M10 30 C 80 30, 120 10, 200 10 S 320 30, 390 8"
          stroke="url(#hero-flow)"
          strokeWidth="3"
          className="animate-flow"
          strokeDasharray="8 8"
        />
        <defs>
          <linearGradient id="hero-flow" x1="0" x2="1">
            <stop stopColor="#8B5CF6" />
            <stop offset="0.5" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#EA580C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function HeroSection({ content }: { content: PublicContent }) {
  const hero = content.hero;
  const reduced = usePrefersReducedMotion();
  const countdown = useCountdown(content.urgency?.countdown?.target);
  const w = content.workshop;
  const price = w ? formatCurrency(w.pricing.currentPrice, w.pricing.currencySymbol) : '';

  const line1 = hero?.headlineLines?.[0] ?? 'AI is not the future.';
  const line2 = hero?.headlineLines?.[1] ?? 'AI is in action.';

  return (
    <header className="relative min-h-[88vh] overflow-hidden pb-12 pt-24 sm:min-h-[90vh] sm:pb-16 sm:pt-28 lg:min-h-screen lg:pb-16 lg:pt-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-engine-glow" />
        <div className="absolute left-1/2 top-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-royal-500/15 blur-[120px] animate-aurora" />
      </div>

      <div className="shell relative grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
        <div>
          {hero?.eyebrow ? (
            <Reveal delay={0.05} priority>
              <p className="eyebrow">{hero.eyebrow}</p>
            </Reveal>
          ) : null}

          <KineticHeadline
            as="h1"
            className="mt-5 text-display-lg font-bold sm:text-hero-xl"
            lines={[
              [{ text: line1 }],
              [{ text: line2, accent: true }],
            ]}
          />

          {hero?.subheadline ? (
            <Reveal delay={0.2} priority className="lead body-muted mt-6 max-w-xl">
              {hero.subheadline}
            </Reveal>
          ) : null}

          {hero?.supportingText ? (
            <Reveal delay={0.28} priority className="mt-3 max-w-xl text-sm leading-relaxed text-mist-muted">
              {hero.supportingText}
            </Reveal>
          ) : null}

          <Reveal delay={0.35} priority className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={hero?.primaryCta?.url ?? '/book'}>
              {hero?.primaryCta?.label ?? 'Secure Your Seat'} <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            {hero?.secondaryCta ? (
              <ButtonLink to={hero.secondaryCta.url} variant="ghost">
                {hero.secondaryCta.label}
              </ButtonLink>
            ) : null}
          </Reveal>

          {w ? (
            <Stagger priority className="mt-10 grid grid-cols-3 gap-3 border-t border-line pt-8 sm:max-w-lg">
              {[
                { label: 'Days', value: w.totalDays, suffix: '' },
                { label: 'Hours', value: w.totalLearningHours, suffix: '+' },
                { label: 'Seats', value: w.seatsAvailable, suffix: '' },
              ].map((stat) => (
                <StaggerChild key={stat.label}>
                  <div>
                    <p className="label-mono">{stat.label}</p>
                    <p className="stat-display mt-1 text-gradient-animated">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </p>
                  </div>
                </StaggerChild>
              ))}
            </Stagger>
          ) : null}

          {hero?.trustSignals?.length ? (
            <Reveal delay={0.4} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mist">
              {hero.trustSignals.map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-node-pulse rounded-full bg-ember-400" />
                  {item}
                </span>
              ))}
            </Reveal>
          ) : null}
        </div>

        <ParallaxLayer offset={50} className="space-y-4 lg:space-y-5">
          <Reveal delay={0.15} y={40}>
            <BrandMark linkToHome className="justify-center opacity-95 lg:justify-end" />
          </Reveal>
          <Reveal delay={0.25}>
            <SignalPipeline active={!reduced} />
          </Reveal>
          <DataFlowLines className="mx-auto h-8 w-full max-w-md opacity-60" />
          <Stagger className="grid grid-cols-2 gap-3">
            {(hero?.highlights ?? [])
              .filter((h) => h.isActive !== false)
              .map((item) => (
                <StaggerChild key={item.label}>
                  <div className="panel-interactive rounded-xl px-4 py-3">
                    <p className="label-mono">{item.label}</p>
                    <p className="mt-1 font-display text-sm font-bold sm:text-base">{item.value}</p>
                  </div>
                </StaggerChild>
              ))}
          </Stagger>
          {content.urgency?.countdown?.isEnabled && !countdown.expired ? (
            <Reveal className="rounded-xl border border-line bg-ink-800/60 px-4 py-3 backdrop-blur">
              <p className="label-mono">
                {content.urgency.countdown.label}{' '}
                <span className="tabular text-ember-300">
                  {countdown.days}d {countdown.hours}h {countdown.minutes}m
                </span>
                {price ? ` · ${price}` : ''}
              </p>
            </Reveal>
          ) : null}
        </ParallaxLayer>
      </div>

      {hero?.marqueeItems?.length ? (
        <div className="mt-14 border-y border-line py-4">
          <Marquee duration={36} pauseOnHover>
            {hero.marqueeItems.map((item) => (
              <span key={item} className="shrink-0 px-6 font-mono text-xs uppercase tracking-[0.22em] text-mist-muted">
                {item}
              </span>
            ))}
          </Marquee>
        </div>
      ) : null}
    </header>
  );
}
