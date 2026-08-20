import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';

const MotionLink = motion(Link);

const styles = {
  primary: 'relative overflow-hidden bg-ember-sweep text-ink shadow-ember',
  secondary: 'border border-line bg-ink-700/90 text-paper hover:border-line-strong backdrop-blur-sm',
  ghost: 'border border-transparent text-paper hover:border-line hover:bg-ink-800/50',
};

function useMagnetic() {
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 22 });
  const springY = useSpring(y, { stiffness: 280, damping: 22 });

  function onMove(e: MouseEvent<HTMLElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.12);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.12);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return { springX, springY, onMove, onLeave, reduced };
}

const baseClasses =
  'focus-ring group relative inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-display text-sm font-bold tracking-wide transition-colors duration-300';

export function Button({
  variant = 'primary',
  className,
  children,
  magnetic = true,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> & {
  variant?: keyof typeof styles;
  children: ReactNode;
  magnetic?: boolean;
}) {
  const { springX, springY, onMove, onLeave, reduced } = useMagnetic();

  return (
    <motion.button
      className={cn(baseClasses, styles[variant], className)}
      style={magnetic && !reduced ? { x: springX, y: springY } : undefined}
      onMouseMove={magnetic ? onMove : undefined}
      onMouseLeave={magnetic ? onLeave : undefined}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      {...props}
    >
      {variant === 'primary' ? (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 group-hover:animate-shine" />
      ) : null}
      <span className="relative">{children}</span>
    </motion.button>
  );
}

export function ButtonLink({
  to,
  variant = 'primary',
  className,
  children,
  external,
  magnetic = true,
}: {
  to: string;
  variant?: keyof typeof styles;
  className?: string;
  children: ReactNode;
  external?: boolean;
  magnetic?: boolean;
}) {
  const { springX, springY, onMove, onLeave, reduced } = useMagnetic();
  const classes = cn(baseClasses, styles[variant], className);

  const motionProps = {
    style: magnetic && !reduced ? { x: springX, y: springY } : undefined,
    onMouseMove: magnetic ? onMove : undefined,
    onMouseLeave: magnetic ? onLeave : undefined,
    whileTap: reduced ? undefined : { scale: 0.98 },
  };

  const inner = (
    <>
      {variant === 'primary' ? (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 group-hover:animate-shine" />
      ) : null}
      <span className="relative">{children}</span>
    </>
  );

  if (external || to.startsWith('http')) {
    return (
      <motion.a href={to} className={classes} target="_blank" rel="noopener noreferrer" {...motionProps}>
        {inner}
      </motion.a>
    );
  }
  if (to.startsWith('#')) {
    return (
      <motion.a href={to} className={classes} {...motionProps}>
        {inner}
      </motion.a>
    );
  }
  return (
    <MotionLink to={to} className={classes} {...motionProps}>
      {inner}
    </MotionLink>
  );
}
