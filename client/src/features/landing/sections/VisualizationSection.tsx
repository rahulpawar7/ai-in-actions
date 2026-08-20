import { useState } from 'react';
import { Section, SectionHeader } from '@/components/ui/Section';
import { AnimatedIntakeForm } from '@/components/forms/AnimatedIntakeForm';
import { LiveEngine } from '../components/LiveEngine';
import { Reveal } from '@/components/motion/Reveal';
import type { PublicContent } from '@/types/content';

export function VisualizationSection({ content }: { content: PublicContent }) {
  const section = content.sections.visualization;
  const [engineInput, setEngineInput] = useState('');
  const [runToken, setRunToken] = useState(0);

  function handleRunEngine(text: string) {
    setEngineInput(text);
    setRunToken((t) => t + 1);
    window.setTimeout(() => {
      document.getElementById('live-engine')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }

  return (
    <Section id="visualization" fullBleed className="relative">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-royal-500/5 to-transparent" />
      <SectionHeader
        align="center"
        eyebrow={section?.eyebrow}
        title={section?.title}
        emphasis={section?.titleEmphasis}
        subtitle="Type a real business problem. Watch the engine route it through intake, processing, workflow design, and output."
      />

      <div className="shell mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <Reveal y={32}>
          <AnimatedIntakeForm onRunEngine={handleRunEngine} />
        </Reveal>
        <div id="live-engine">
          <Reveal y={40} delay={0.08}>
            <LiveEngine seedInput={engineInput} runToken={runToken} />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
