import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function SectionPulse() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const reduced = usePrefersReducedMotion();

  return (
    <div ref={ref} className="relative h-px overflow-hidden bg-line" aria-hidden>
      {!reduced ? (
        <motion.div
          className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-ember-400 to-transparent"
          initial={{ x: '-30%' }}
          animate={inView ? { x: '400%' } : { x: '-30%' }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : null}
    </div>
  );
}
