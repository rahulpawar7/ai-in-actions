import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function BrandMark({
  className,
  showWordmark = false,
  linkToHome = false,
  onNavigate,
}: {
  className?: string;
  showWordmark?: boolean;
  linkToHome?: boolean;
  onNavigate?: () => void;
}) {
  const inner = (
    <>
      <img src="/brand/logo.png" alt="" className="h-12 w-auto sm:h-14" />
      {showWordmark ? (
        <span className="hidden font-display text-sm font-extrabold uppercase tracking-[0.18em] sm:inline">
          AI IN ACTI
          <span className="text-ember-400">⚙</span>
          N
        </span>
      ) : null}
    </>
  );

  if (linkToHome) {
    return (
      <Link
        to="/"
        aria-label="AI IN ACTION home"
        onClick={onNavigate}
        className={cn('inline-flex items-center gap-3 transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-400', className)}
      >
        {inner}
      </Link>
    );
  }

  return <span className={cn('inline-flex items-center gap-3', className)}>{inner}</span>;
}

export function Gear({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('text-ember-400', className)} aria-hidden>
      <path
        fill="currentColor"
        d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8.3 2.7-1.4-.3a6.9 6.9 0 0 0-.6-1.5l.8-1.2a.8.8 0 0 0-.1-1L17.7 5a.8.8 0 0 0-1-.1l-1.2.8a6.9 6.9 0 0 0-1.5-.6l-.3-1.4A.8.8 0 0 0 12.9 3h-1.8a.8.8 0 0 0-.8.7l-.3 1.4a6.9 6.9 0 0 0-1.5.6L7.3 4.9a.8.8 0 0 0-1 .1L5 6.2a.8.8 0 0 0-.1 1l.8 1.2a6.9 6.9 0 0 0-.6 1.5l-1.4.3a.8.8 0 0 0-.7.8v1.8c0 .4.3.7.7.8l1.4.3c.1.5.3 1 .6 1.5L4.9 16.7a.8.8 0 0 0 .1 1L6.2 19a.8.8 0 0 0 1 .1l1.2-.8c.5.3 1 .5 1.5.6l.3 1.4c.1.4.4.7.8.7h1.8c.4 0 .7-.3.8-.7l.3-1.4c.5-.1 1-.3 1.5-.6l1.2.8a.8.8 0 0 0 1-.1l1.3-1.3a.8.8 0 0 0 .1-1l-.8-1.2c.3-.5.5-1 .6-1.5l1.4-.3c.4-.1.7-.4.7-.8v-1.8a.8.8 0 0 0-.7-.8Z"
      />
    </svg>
  );
}
