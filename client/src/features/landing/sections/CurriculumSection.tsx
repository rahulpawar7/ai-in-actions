import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { EASE_EXPO } from '@/lib/motion';
import { list } from './utils';
import type { PublicContent } from '@/types/content';

export function CurriculumSection({ content }: { content: PublicContent }) {
  const curriculum = list(content.curriculum);
  const [active, setActive] = useState(curriculum[0]?.dayNumber ?? 1);
  const section = content.sections.curriculum;
  const current = curriculum.find((d) => d.dayNumber === active) ?? curriculum[0];
  const activeIndex = curriculum.findIndex((d) => d.dayNumber === active);

  if (!current) return null;

  return (
    <Section id="curriculum" fullBleed>
      <SectionHeader eyebrow={section?.eyebrow} title={section?.title} emphasis={section?.titleEmphasis} subtitle={section?.footnote} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)] lg:gap-12">
        <div className="relative">
          <div className="sticky top-28 space-y-1">
            {curriculum.map((day) => {
              const isActive = active === day.dayNumber;
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setActive(day.dayNumber)}
                  className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition duration-300 ${
                    isActive ? 'border-ember-400/50 bg-ink-800/80 shadow-ember' : 'border-transparent hover:border-line hover:bg-ink-800/40'
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-xs font-medium ${
                      isActive ? 'bg-ember-sweep text-ink' : 'border border-line text-mist-muted'
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-sm font-semibold">{day.title}</span>
                    <span className="block truncate font-mono text-[0.58rem] uppercase tracking-wider text-mist-muted">{day.phase}</span>
                  </span>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition ${isActive ? 'text-ember-400' : 'text-mist-faint opacity-0 group-hover:opacity-100'}`} />
                </button>
              );
            })}
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-ink-700 lg:mt-6">
            <motion.div
              className="h-full bg-royal-sweep"
              animate={{ width: `${((activeIndex + 1) / curriculum.length) * 100}%` }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
            />
          </div>
        </div>

        <Reveal key={current.id}>
          <AnimatePresence mode="wait">
            <motion.article
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.45, ease: EASE_EXPO }}
              className="panel gradient-border rounded-3xl p-6 md:p-10"
            >
              <p className="label-mono text-ember-300">
                Day {current.dayNumber} · {current.phase} · {current.durationLabel}
              </p>
              <h3 className="mt-3 font-display text-display-sm font-bold">{current.title}</h3>
              {current.subtitle ? <p className="mt-2 text-lg text-mist">{current.subtitle}</p> : null}
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-mist">{current.description}</p>
              <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                {list(current.learningObjectives).map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-paper">
                    <span className="text-ember-400">→</span> {item}
                  </li>
                ))}
              </ul>
              {current.outcome ? (
                <p className="mt-8 border-t border-line pt-5 font-display text-base font-bold text-gradient-ember">
                  You leave with: {current.outcome}
                </p>
              ) : null}
            </motion.article>
          </AnimatePresence>
        </Reveal>
      </div>
    </Section>
  );
}
