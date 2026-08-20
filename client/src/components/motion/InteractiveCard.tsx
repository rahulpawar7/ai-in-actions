import { useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type GlowTone = 'royal' | 'ember' | 'volt';

const glowMap: Record<GlowTone, string> = {
  royal: 'rgba(139,92,246,0.35)',
  ember: 'rgba(234,88,12,0.35)',
  volt: 'rgba(59,130,246,0.35)',
};

export function InteractiveCard({
  children,
  className,
  glow = 'royal',
  featured,
}: {
  children: ReactNode;
  className?: string;
  glow?: GlowTone;
  featured?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 180, damping: 18 });

  function onMove(event: MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-line bg-ink-800/75 shadow-panel backdrop-blur-sm',
        featured && 'gradient-border',
        className,
      )}
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--gx,50%) var(--gy,50%), ${glowMap[glow]}, transparent 55%)`,
        }}
      />
      <div
        className="relative h-full"
        onMouseMove={(e) => {
          if (!ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          ref.current.style.setProperty('--gx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
          ref.current.style.setProperty('--gy', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
