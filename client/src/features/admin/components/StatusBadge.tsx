import { cn } from '@/lib/utils';

export function StatusBadge({ active, featured }: { active?: boolean; featured?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide',
          active !== false ? 'bg-emerald-500/15 text-emerald-700' : 'bg-paper-300 text-ink/50',
        )}
      >
        {active !== false ? 'Live' : 'Hidden'}
      </span>
      {featured ? (
        <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-amber-700">
          Featured
        </span>
      ) : null}
    </div>
  );
}
