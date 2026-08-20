import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { EASE_EXPO } from '@/lib/motion';

const PROMPTS = [
  'I spend 3 hours a day writing quotations…',
  'Follow-ups die in my WhatsApp unread pile…',
  'Weekly numbers live in five different sheets…',
  'My team repeats the same support replies daily…',
  'Proposals take days when they should take hours…',
];

const OUTCOMES = [
  '→ AI drafts the quote. You approve in 90 seconds.',
  '→ A follow-up sequence runs while you sleep.',
  '→ One dashboard. One summary. Every Monday.',
  '→ Triage + draft replies. You handle exceptions only.',
  '→ First draft in minutes. Brand voice locked in.',
];

export function AnimatedIntakeForm({ onRunEngine }: { onRunEngine?: (text: string) => void }) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (reduced || focused || value) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % PROMPTS.length), 3200);
    return () => window.clearInterval(timer);
  }, [reduced, focused, value]);

  const activePrompt = PROMPTS[index];
  const activeOutcome = OUTCOMES[index];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = value.trim() || PROMPTS[index];
    setSubmitted(true);
    onRunEngine?.(text);
    window.setTimeout(() => {
      document.getElementById('live-engine')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }

  return (
    <form onSubmit={handleSubmit} className="panel gradient-border relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-royal-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-ember-500/15 blur-[90px]" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-ember-400" />
          <p className="label-mono text-ember-300">Input → AI engine → Output</p>
        </div>
        <h3 className="mt-4 font-display text-display-xs font-bold sm:text-display-sm">
          What repetitive work is <span className="text-gradient-animated">eating your week?</span>
        </h3>

        <label className="mt-8 block">
          <span className="label-mono">Your business problem</span>
          <div className="relative mt-3">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              rows={4}
              className="w-full resize-none rounded-2xl border bg-ink/70 px-5 py-4 font-sans text-lg leading-relaxed text-paper outline-none transition focus:border-royal-400 focus:ring-2 focus:ring-royal-400/20"
              style={{ borderColor: 'rgba(243,238,228,0.15)', minHeight: '8rem' }}
            />
            {!value && !focused ? (
              <div className="pointer-events-none absolute left-5 top-4 max-w-[90%] font-sans text-lg text-mist-muted" aria-hidden>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activePrompt}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease: EASE_EXPO }}
                    className="inline-block"
                  >
                    {activePrompt}
                  </motion.span>
                </AnimatePresence>
              </div>
            ) : null}
          </div>
        </label>

        <AnimatePresence mode="wait">
          <motion.p
            key={submitted ? 'done' : activeOutcome}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 font-display text-base font-medium text-volt-300 sm:text-lg"
          >
            {submitted ? 'Running your problem through the live engine below…' : activeOutcome}
          </motion.p>
        </AnimatePresence>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" className="w-full sm:w-auto">
            Run through the engine <ArrowRight className="h-4 w-4" />
          </Button>
          <Link
            to="/book"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3.5 font-display text-sm font-bold transition hover:border-ember-400"
            style={{ borderColor: 'rgba(243,238,228,0.15)' }}
          >
            Skip to booking
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {PROMPTS.slice(0, 3).map((example) => (
            <button
              key={example}
              type="button"
              className="rounded-full border px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-wider text-mist transition hover:border-ember-400 hover:text-paper"
              style={{ borderColor: 'rgba(243,238,228,0.12)' }}
              onClick={() => setValue(example.replace('…', ''))}
            >
              {example.slice(0, 28)}…
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
