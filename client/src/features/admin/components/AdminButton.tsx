import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const variants = {
  primary: 'bg-royal-600 text-white shadow-sm hover:bg-royal-700 active:bg-royal-800',
  secondary: 'border border-line-paper bg-white text-ink shadow-sm hover:bg-paper-100',
  ghost: 'text-ink/70 hover:bg-paper-200 hover:text-ink',
  danger: 'text-ember-600 hover:bg-ember-500/10',
};

export function AdminButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-sm',
  };

  return (
    <button
      type="button"
      className={cn(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
