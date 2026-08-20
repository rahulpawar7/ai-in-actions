import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function ParallaxLayer({
  children,
  className,
  offset = 80,
}: {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export function DataFlowLines({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  return (
    <svg className={className} viewBox="0 0 800 120" fill="none" aria-hidden>
      <path d="M0 60 H200 Q280 60 320 30 T480 60 T640 90 T800 60" stroke="url(#flowGrad)" strokeWidth="2" strokeDasharray="6 10" className="animate-flow" opacity="0.5" />
      <circle cx="200" cy="60" r="4" fill="#8B5CF6" className="animate-node-pulse" />
      <circle cx="480" cy="60" r="4" fill="#3B82F6" className="animate-node-pulse [animation-delay:0.5s]" />
      <circle cx="640" cy="90" r="4" fill="#EA580C" className="animate-node-pulse [animation-delay:1s]" />
      <defs>
        <linearGradient id="flowGrad" x1="0" x2="1">
          <stop stopColor="#8B5CF6" />
          <stop offset="0.5" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
      </defs>
    </svg>
  );
}
