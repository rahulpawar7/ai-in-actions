import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/motion/Reveal';
import { LineReveal } from '@/components/motion/Reveal';

export function Section({
  id,
  tone = 'ink',
  className,
  children,
  fullBleed,
  noShell,
}: {
  id?: string;
  tone?: 'ink' | 'paper';
  className?: string;
  children: ReactNode;
  fullBleed?: boolean;
  noShell?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-section',
        tone === 'paper' ? 'bg-paper text-ink' : 'text-paper',
        fullBleed && 'overflow-hidden',
        className,
      )}
    >
      {noShell ? children : <div className="shell">{children}</div>}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  emphasis,
  subtitle,
  invert,
  align = 'left',
  reveal = true,
  size = 'default',
}: {
  eyebrow?: string;
  title?: string;
  emphasis?: string;
  subtitle?: string;
  invert?: boolean;
  align?: 'left' | 'center';
  reveal?: boolean;
  size?: 'default' | 'large';
}) {
  const content = (
    <header className={cn('mb-12 max-w-4xl', align === 'center' && 'mx-auto text-center', size === 'large' && 'mb-16')}>
      {eyebrow ? <p className={invert ? 'eyebrow-invert' : 'eyebrow'}>{eyebrow}</p> : null}
      {title ? (
        <h2
          className={cn(
            'mt-3 font-display font-bold tracking-tight',
            size === 'large' ? 'text-display-lg sm:text-display-xl' : 'text-display-md sm:text-display-lg',
          )}
        >
          {title}{' '}
          {emphasis ? (
            <span className={invert ? 'text-gradient-ember' : 'text-gradient-animated'}>{emphasis}</span>
          ) : null}
        </h2>
      ) : null}
      {subtitle ? (
        <p className={cn('lead mt-5 max-w-prose', align === 'center' && 'mx-auto', invert ? 'text-ink/70' : 'body-muted')}>
          {subtitle}
        </p>
      ) : null}
      <LineReveal className={cn('mt-8 max-w-xs', align === 'center' && 'mx-auto')} />
    </header>
  );

  return reveal ? <Reveal>{content}</Reveal> : content;
}

export function EditorialBreak({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Reveal className={cn('py-section-sm text-center', className)}>
      <div className="shell mx-auto max-w-4xl font-display text-display-sm font-semibold leading-tight sm:text-display-md">
        {children}
      </div>
    </Reveal>
  );
}
