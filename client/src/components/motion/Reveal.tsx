import { motion, useInView } from 'framer-motion';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { EASE_EXPO } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

function useAboveFold(ref: React.RefObject<Element | null>, enabled: boolean) {
  const [aboveFold, setAboveFold] = useState(enabled);

  useLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) setAboveFold(true);
  }, [enabled, ref]);

  return aboveFold;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  priority = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: priority ? '0px 0px -2% 0px' : '-8% 0px' });
  const reduced = usePrefersReducedMotion();
  const aboveFold = useAboveFold(ref, priority);

  if (reduced || priority) {
    return <div className={className}>{children}</div>;
  }

  const visible = aboveFold || inView;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={visible ? false : { opacity: 0, y }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.75, delay, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
  priority = false,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: priority ? '0px 0px -2% 0px' : '-6% 0px' });
  const reduced = usePrefersReducedMotion();
  const aboveFold = useAboveFold(ref, priority);

  if (reduced || priority) {
    return <div className={className}>{children}</div>;
  }

  const visible = aboveFold || inView;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChild({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_EXPO } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function LineReveal({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = usePrefersReducedMotion();

  return (
    <div ref={ref} className={cn('h-px overflow-hidden bg-line', className)}>
      <motion.div
        className="h-full bg-ember-sweep"
        initial={{ scaleX: 0 }}
        animate={inView || reduced ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.9, ease: EASE_EXPO }}
        style={{ transformOrigin: 'left' }}
      />
    </div>
  );
}
