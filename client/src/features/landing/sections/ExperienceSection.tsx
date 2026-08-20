import { Section, SectionHeader, EditorialBreak } from '@/components/ui/Section';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal, Stagger, StaggerChild } from '@/components/motion/Reveal';
import { list } from './utils';
import type { PublicContent } from '@/types/content';

export function ExperienceSection({ content }: { content: PublicContent }) {
  const section = content.sections.experience;
  const w = content.workshop;
  const outputs = content.sections.outputs;
  const usecases = list(content.features?.usecase);

  return (
    <>
      <Section id="experience">
        <SectionHeader eyebrow={section?.eyebrow} title={section?.title} emphasis={section?.titleEmphasis} subtitle={section?.subtitle} />
        {w ? (
          <Stagger className="grid divide-y divide-line overflow-hidden rounded-2xl border border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { label: 'Mode', value: w.mode },
              { label: 'Language', value: w.language },
              { label: 'Session', value: w.sessionTimeLabel ?? w.sessionDurationLabel },
            ].map((row) => (
              <StaggerChild key={row.label}>
                <div className="bg-ink-800/50 px-6 py-8 text-center backdrop-blur">
                  <p className="label-mono">{row.label}</p>
                  <p className="mt-2 font-display text-xl font-bold sm:text-2xl">{row.value}</p>
                </div>
              </StaggerChild>
            ))}
          </Stagger>
        ) : null}

        {w ? (
          <Reveal className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Days', n: w.totalDays },
              { label: 'Learning hours', n: w.totalLearningHours },
              { label: 'Capacity', n: w.capacity },
              { label: 'Seats left', n: w.seatsAvailable },
            ].map((stat) => (
              <div key={stat.label} className="panel rounded-xl px-4 py-5 text-center">
                <p className="label-mono">{stat.label}</p>
                <p className="mt-2 text-stat text-gradient-animated">
                  <CountUp value={stat.n} />
                </p>
              </div>
            ))}
          </Reveal>
        ) : null}
      </Section>

      <EditorialBreak>
        You leave with systems — not slides. <span className="text-gradient-animated">Shippable outputs.</span>
      </EditorialBreak>

      <Section id="outputs">
        <SectionHeader eyebrow={outputs?.eyebrow} title={outputs?.title} emphasis={outputs?.titleEmphasis} align="center" />
        <div className="scrollbar-thin flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible">
          {list(outputs?.items).map((item, index) => (
            <InteractiveCard key={`${item.title}-${index}`} glow="ember" className="min-w-[85vw] shrink-0 snap-center p-6 sm:min-w-[20rem] lg:min-w-0">
              <span className="font-display text-4xl font-bold text-royal-400/30">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 font-display text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{item.description}</p>
            </InteractiveCard>
          ))}
        </div>
      </Section>

      {usecases.length > 0 ? (
        <Section id="usecases" tone="paper">
          <SectionHeader invert eyebrow="Use cases" title="One engine," emphasis="every business." align="center" />
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {usecases.map((item) => (
              <StaggerChild key={item.id}>
                <article className="paper-panel rounded-2xl p-5 transition duration-500 hover:-translate-y-1 hover:shadow-lift">
                  <h3 className="font-display text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.description}</p>
                </article>
              </StaggerChild>
            ))}
          </Stagger>
        </Section>
      ) : null}
    </>
  );
}
