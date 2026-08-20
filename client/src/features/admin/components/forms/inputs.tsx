import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function FieldShell({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('admin-field', className)}>
      <div className="mb-1.5">
        <span className="text-sm font-medium text-ink">
          {label}
          {required ? <span className="text-ember-500"> *</span> : null}
        </span>
        {hint ? <p className="mt-0.5 text-xs leading-relaxed text-ink/50">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="admin-form-section">
      <div className="admin-form-section-header">
        <h3 className="font-display text-base font-bold text-ink">{title}</h3>
        {description ? <p className="mt-1 text-xs leading-relaxed text-ink/50">{description}</p> : null}
      </div>
      <div className="admin-form-grid">{children}</div>
    </section>
  );
}

export const adminInputClass =
  'admin-input w-full rounded-lg border border-line-paper bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink/30 outline-none transition hover:border-royal-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-500/15 disabled:cursor-not-allowed disabled:bg-paper-100 disabled:text-ink/50';

export function TextInput({
  value,
  onChange,
  type = 'text',
  placeholder,
  min,
  max,
  step,
  readOnly,
  disabled,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'url' | 'date' | 'datetime-local';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <input
      type={type}
      className={cn(adminInputClass, className)}
      value={value}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      readOnly={readOnly}
      disabled={disabled || readOnly}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  readOnly,
}: {
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
  step?: number;
  readOnly?: boolean;
}) {
  return (
    <input
      type="number"
      className={adminInputClass}
      value={value}
      min={min}
      max={max}
      step={step}
      readOnly={readOnly}
      disabled={readOnly}
      onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
    />
  );
}

export function TextAreaInput({
  value,
  onChange,
  placeholder,
  rows = 4,
  readOnly,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
}) {
  return (
    <textarea
      className={cn(adminInputClass, 'min-h-[96px] resize-y leading-relaxed')}
      rows={rows}
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={readOnly}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function SelectInput({
  value,
  onChange,
  options,
  readOnly,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  readOnly?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        className={cn(adminInputClass, 'appearance-none pr-9')}
        value={value}
        disabled={readOnly}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink/40">▾</span>
    </div>
  );
}

/** Accessible iOS-style switch */
export function ToggleSwitch({
  checked,
  onChange,
  readOnly,
  label,
  size = 'md',
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  readOnly?: boolean;
  label?: string;
  size?: 'sm' | 'md';
}) {
  const dims = size === 'sm' ? 'h-6 w-10' : 'h-7 w-12';
  const knob = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const onX = size === 'sm' ? 'translate-x-5' : 'translate-x-6';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={readOnly}
      className={cn(
        'admin-switch relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200',
        dims,
        checked ? 'bg-royal-600' : 'bg-paper-400',
        readOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      )}
      onClick={() => !readOnly && onChange(!checked)}
    >
      <span
        className={cn(
          'inline-block transform rounded-full bg-white shadow-md transition-transform duration-200',
          knob,
          checked ? onX : 'translate-x-1',
        )}
      />
    </button>
  );
}

/** Label + hint on left, switch + status on right — standard admin toggle row */
export function SwitchRow({
  label,
  hint,
  checked,
  onChange,
  readOnly,
  className,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('admin-switch-row', className)}>
      <div className="min-w-0 flex-1 pr-4">
        <p className="text-sm font-medium text-ink">{label}</p>
        {hint ? <p className="mt-0.5 text-xs text-ink/50">{hint}</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <span className={cn('text-xs font-medium tabular', checked ? 'text-royal-700' : 'text-ink/40')}>
          {checked ? 'On' : 'Off'}
        </span>
        <ToggleSwitch checked={checked} onChange={onChange} readOnly={readOnly} label={label} />
      </div>
    </div>
  );
}

/** @deprecated use ToggleSwitch or SwitchRow */
export function ToggleInput(props: Parameters<typeof ToggleSwitch>[0]) {
  return <ToggleSwitch {...props} />;
}
