import { Section, SectionHeader } from '@/components/ui/Section';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { Stagger, StaggerChild } from '@/components/motion/Reveal';
import { list } from './utils';
import type { PublicContent } from '@/types/content';

export function EngineSection({ content }: { content: PublicContent }) {
  const section = content.sections.engine;
  const items = list(section?.items);

  return (
    <Section id="engine">
      <SectionHeader eyebrow={section?.eyebrow} title={section?.title} emphasis={section?.titleEmphasis} subtitle={section?.subtitle} />
      <Stagger className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <StaggerChild key={`${item.title ?? 'item'}-${index}`} className={index === 0 ? 'sm:col-span-2 lg:row-span-2' : ''}>
            <InteractiveCard glow={index % 2 === 0 ? 'royal' : 'volt'} featured={index === 0} className="h-full p-6">
              <p className="label-mono text-ember-300">{item.label}</p>
              <h3 className="mt-3 font-display text-xl font-bold sm:text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">{item.description}</p>
            </InteractiveCard>
          </StaggerChild>
        ))}
      </Stagger>
    </Section>
  );
}
