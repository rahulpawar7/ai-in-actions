import type { ReactNode } from 'react';
import { AmbientBackdrop } from '@/components/motion/Backdrop';
import { Gear } from '@/components/ui/BrandMark';

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-ink-700/80 ${className ?? ''}`} aria-hidden />;
}

export function PageShell({ children }: { children?: ReactNode }) {
  return (
    <div className="relative min-h-screen text-paper">
      <AmbientBackdrop />
      <div className="fixed inset-x-0 top-0 z-50 border-b border-line/40 bg-ink/90 backdrop-blur-xl">
        <div className="shell flex items-center justify-between py-4">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="hidden h-9 w-28 lg:block" />
        </div>
      </div>
      {children}
    </div>
  );
}

export function LoadingStudio({ label = 'Engine starting' }: { label?: string }) {
  return (
    <PageShell>
      <div className="shell grid min-h-screen place-items-center pt-24 text-center">
        <div className="w-full max-w-4xl">
          <Skeleton className="mx-auto h-4 w-32" />
          <Skeleton className="mx-auto mt-8 h-14 w-full max-w-2xl" />
          <Skeleton className="mx-auto mt-4 h-14 w-full max-w-xl" />
          <Skeleton className="mx-auto mt-6 h-5 w-full max-w-lg" />
          <div className="mx-auto mt-10 flex justify-center gap-3">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-32" />
          </div>
          <div className="mt-16 flex items-center justify-center gap-3">
            <Gear className="h-8 w-8 animate-gear text-ember-400" />
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-mist-muted">{label}</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export function UnavailableStudio({ onRetry }: { onRetry: () => void }) {
  return (
    <PageShell>
      <div className="grid min-h-screen place-items-center px-6 pt-20">
        <div className="panel gradient-border max-w-md rounded-3xl p-8 text-center">
          <p className="label-mono text-ember-400">Studio paused</p>
          <h1 className="mt-3 font-display text-display-sm font-bold">The workshop is taking a breath.</h1>
          <p className="mt-3 text-sm leading-relaxed text-mist">
            We couldn’t load the live session details. Nothing is wrong with your booking — please try again in a moment.
          </p>
          <button
            type="button"
            className="focus-ring mt-6 inline-flex items-center justify-center rounded-lg bg-ember-500 px-6 py-3.5 font-display text-sm font-bold text-ink transition hover:bg-ember-400"
            onClick={onRetry}
          >
            Try again
          </button>
        </div>
      </div>
    </PageShell>
  );
}

export function SectionFallback() {
  return <div className="py-section-sm shell" aria-hidden><Skeleton className="h-64 w-full rounded-3xl" /></div>;
}
