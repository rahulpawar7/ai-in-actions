import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Cog, CheckCircle2 } from 'lucide-react';
import { Gear } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { EASE_EXPO } from '@/lib/motion';

const EXAMPLES = [
  'I spend 3 hours a day writing quotations',
  'Follow-ups die in my WhatsApp unread pile',
  'Weekly numbers live in five different sheets',
];

const STAGES = [
  { key: 'intake', label: 'Intake', icon: Sparkles },
  { key: 'process', label: 'Processing', icon: Zap },
  { key: 'workflow', label: 'Workflow', icon: Cog },
  { key: 'result', label: 'Output', icon: CheckCircle2 },
] as const;

function runEngine(input: string) {
  const problem = input.trim() || EXAMPLES[0];
  return {
    problem,
    processing: `Parsing constraints, brand voice, and output format for your business context…`,
    workflow: 'Trigger → AI draft → human checkpoint → send / log / measure',
    result: `A repeatable system for “${problem.replace(/^I /, '').replace(/\.$/, '')}” — first draft in seconds, you only approve.`,
  };
}

export function LiveEngine({ seedInput, runToken }: { seedInput?: string; runToken?: number }) {
  const reduced = usePrefersReducedMotion();
  const [input, setInput] = useState(EXAMPLES[0]);
  const [stage, setStage] = useState(-1);
  const [running, setRunning] = useState(false);
  const output = useMemo(() => runEngine(input), [input]);

  useEffect(() => {
    if (seedInput?.trim()) setInput(seedInput.trim());
  }, [seedInput]);

  function start() {
    setRunning(true);
    setStage(0);
    const delays = reduced ? [0, 100, 200, 300] : [0, 800, 1700, 2600];
    delays.forEach((delay, index) => {
      window.setTimeout(() => {
        setStage(index);
        if (index === delays.length - 1) setRunning(false);
      }, delay);
    });
  }

  useEffect(() => {
    if (runToken && runToken > 0) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run only when user submits from intake form
  }, [runToken]);

  const lines = [output.problem, output.processing, output.workflow, output.result];
  const progress = stage < 0 ? 0 : ((stage + 1) / STAGES.length) * 100;

  return (
    <div className="panel gradient-border overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 animate-pulse-dot rounded-full bg-ember-400" />
          </span>
          <p className="label-mono text-ember-300">
            AI engine · {running ? 'processing' : stage >= 3 ? 'complete' : 'ready'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-ink-600 sm:block">
            <motion.div
              className="h-full bg-royal-sweep"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
            />
          </div>
          <Gear className={`h-5 w-5 text-volt-300 ${running ? 'animate-gear' : ''}`} />
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <label className="block">
          <span className="label-mono">Describe a business problem</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="mt-3 w-full resize-none rounded-xl border border-line bg-ink/80 px-4 py-3 font-sans text-sm leading-relaxed text-paper outline-none transition focus:border-royal-400 focus:ring-1 focus:ring-royal-400/30"
            placeholder="What repetitive work is eating your week?"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                className="rounded-full border border-line px-3 py-1.5 font-sans text-xs text-mist transition hover:border-ember-400 hover:text-paper"
                onClick={() => setInput(example)}
              >
                {example}
              </button>
            ))}
          </div>
          <Button className="mt-5 w-full sm:w-auto" onClick={start} disabled={running}>
            Run through the engine <ArrowRight className="h-4 w-4" />
          </Button>
        </label>

        <div className="relative">
          <div className="absolute left-4 top-8 bottom-8 w-px bg-line sm:left-5" aria-hidden />
          <ol className="space-y-5">
            {STAGES.map(({ key, label, icon: Icon }, index) => {
              const active = index <= stage;
              const current = index === stage && running;
              return (
                <li key={key} className="relative pl-10 sm:pl-12">
                  <motion.span
                    className={`absolute left-0 grid h-8 w-8 place-items-center rounded-full border sm:h-9 sm:w-9 ${
                      active ? 'border-ember-400 bg-ember-sweep text-ink shadow-ember' : 'border-line bg-ink-800 text-mist-muted'
                    } ${current ? 'animate-node-pulse' : ''}`}
                    animate={active ? { scale: 1 } : { scale: 0.92 }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </motion.span>
                  <p className="label-mono">{label}</p>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${index}-${stage >= index}`}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: active ? 1 : 0.35, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE_EXPO }}
                      className="mt-1 text-sm leading-relaxed text-mist sm:text-base"
                    >
                      {active ? lines[index] : 'Waiting for signal…'}
                    </motion.div>
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
