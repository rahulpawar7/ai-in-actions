import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function Marquee({
  children,
  className,
  duration = 40,
  reverse,
  pauseOnHover,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={cn('flex flex-wrap justify-center gap-4', className)}>{children}</div>;
  }

  return (
    <div className={cn('overflow-hidden', pauseOnHover && 'group/marquee', className)}>
      <div
        className={cn(
          'flex w-max gap-6',
          reverse ? 'animate-marquee-x-reverse' : 'animate-marquee-x',
          pauseOnHover && 'group-hover/marquee:[animation-play-state:paused]',
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
