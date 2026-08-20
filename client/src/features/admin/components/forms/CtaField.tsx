import { asRecord } from '../../forms/formUtils';
import { FieldShell, SelectInput, SwitchRow, TextInput } from './inputs';

const CTA_VARIANTS = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'link', label: 'Link' },
];

export function CtaField({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: unknown;
  onChange: (next: Record<string, unknown>) => void;
  readOnly?: boolean;
}) {
  const cta = asRecord(value);

  function patch(key: string, val: string | boolean) {
    onChange({ label: '', url: '/book', variant: 'primary', isExternal: false, isActive: true, ...cta, [key]: val });
  }

  return (
    <div className="admin-group-card sm:col-span-2">
      <p className="font-display text-sm font-bold text-ink">{label}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <FieldShell label="Button label" required>
          <TextInput value={String(cta.label ?? '')} readOnly={readOnly} onChange={(v) => patch('label', v)} />
        </FieldShell>
        <FieldShell label="Link URL" required>
          <TextInput value={String(cta.url ?? '')} readOnly={readOnly} placeholder="/book or https://..." onChange={(v) => patch('url', v)} />
        </FieldShell>
        <FieldShell label="Style">
          <SelectInput value={String(cta.variant ?? 'primary')} options={CTA_VARIANTS} readOnly={readOnly} onChange={(v) => patch('variant', v)} />
        </FieldShell>
        <FieldShell label="Aria label">
          <TextInput value={String(cta.ariaLabel ?? '')} readOnly={readOnly} onChange={(v) => patch('ariaLabel', v)} />
        </FieldShell>
        <SwitchRow label="Opens in new tab" checked={Boolean(cta.isExternal)} readOnly={readOnly} onChange={(v) => patch('isExternal', v)} />
        <SwitchRow label="Button visible on site" checked={cta.isActive !== false} readOnly={readOnly} onChange={(v) => patch('isActive', v)} />
      </div>
    </div>
  );
}
