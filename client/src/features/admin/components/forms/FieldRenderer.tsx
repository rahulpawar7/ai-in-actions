import type { FieldDef } from '../../forms/types';
import { fromDatetimeLocal, getByPath, setByPath, toDatetimeLocal } from '../../forms/formUtils';
import { CtaField } from './CtaField';
import { FieldShell, NumberInput, SelectInput, SwitchRow, TextAreaInput, TextInput } from './inputs';
import { MediaField } from './MediaField';
import { RepeaterField, SectionVisibilityField } from './RepeaterField';
import { StringListField } from './StringListField';
import { cn } from '@/lib/utils';

export function FieldRenderer({
  field,
  value,
  onChange,
  readOnly,
  prefix = '',
}: {
  field: FieldDef;
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  readOnly?: boolean;
  prefix?: string;
}) {
  const path = prefix ? `${prefix}.${field.key}` : field.key;
  const raw = getByPath(value, path);
  const colClass = field.colSpan === 2 ? 'sm:col-span-2' : '';

  function patch(nextValue: unknown) {
    onChange(setByPath(value, path, nextValue));
  }

  if (field.type === 'group') {
    return (
      <div className={cn('admin-group-card sm:col-span-2', colClass)}>
        <p className="font-display text-sm font-bold text-ink">{field.label}</p>
        {field.hint ? <p className="mt-0.5 text-xs text-ink/50">{field.hint}</p> : null}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {field.fields.map((child) => (
            <FieldRenderer key={child.key} field={child} value={value} onChange={onChange} readOnly={readOnly} prefix={path} />
          ))}
        </div>
      </div>
    );
  }

  if (field.type === 'repeater') {
    return (
      <div className={colClass}>
        <RepeaterField field={field} value={value} onChange={onChange} readOnly={readOnly} prefix={prefix} />
      </div>
    );
  }

  if (field.type === 'string-list') {
    return (
      <div className={colClass}>
        <StringListField label={field.label} hint={field.hint} value={raw} readOnly={readOnly} placeholder={field.placeholder} onChange={patch} />
      </div>
    );
  }

  if (field.type === 'media') {
    return (
      <div className={colClass}>
        <MediaField label={field.label} hint={field.hint} value={raw} readOnly={readOnly} onChange={patch} />
      </div>
    );
  }

  if (field.type === 'cta') {
    return (
      <div className={colClass}>
        <CtaField label={field.label} value={raw} readOnly={readOnly} onChange={patch} />
      </div>
    );
  }

  if (field.type === 'section-visibility') {
    return (
      <div className={colClass}>
        <SectionVisibilityField
          label={field.label}
          hint={field.hint}
          sections={field.sections}
          value={raw}
          readOnly={readOnly}
          onChange={patch}
        />
      </div>
    );
  }

  if (field.type === 'toggle') {
    return (
      <div className={cn('sm:col-span-2', colClass)}>
        <SwitchRow
          label={field.label}
          hint={field.hint}
          checked={Boolean(raw)}
          readOnly={readOnly}
          onChange={patch}
        />
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <FieldShell label={field.label} hint={field.hint} required={field.required} className={colClass}>
        <SelectInput value={String(raw ?? field.options[0]?.value ?? '')} options={field.options} readOnly={readOnly} onChange={patch} />
      </FieldShell>
    );
  }

  if (field.type === 'number') {
    return (
      <FieldShell label={field.label} hint={field.hint} required={field.required} className={colClass}>
        <NumberInput
          value={typeof raw === 'number' ? raw : raw === '' || raw == null ? '' : Number(raw)}
          min={field.min}
          max={field.max}
          step={field.step}
          readOnly={readOnly}
          onChange={(v) => patch(v === '' ? null : v)}
        />
      </FieldShell>
    );
  }

  if (field.type === 'textarea') {
    return (
      <FieldShell label={field.label} hint={field.hint} required={field.required} className={colClass}>
        <TextAreaInput
          value={String(raw ?? '')}
          rows={field.rows}
          placeholder={field.placeholder}
          readOnly={readOnly}
          onChange={patch}
        />
      </FieldShell>
    );
  }

  if (field.type === 'datetime-local') {
    return (
      <FieldShell label={field.label} hint={field.hint} required={field.required} className={colClass}>
        <TextInput
          type="datetime-local"
          value={toDatetimeLocal(raw)}
          readOnly={readOnly}
          onChange={(v) => patch(fromDatetimeLocal(v))}
        />
      </FieldShell>
    );
  }

  return (
    <FieldShell label={field.label} hint={field.hint} required={field.required} className={colClass}>
      <TextInput
        type={field.type}
        value={String(raw ?? '')}
        placeholder={field.placeholder}
        readOnly={readOnly}
        onChange={patch}
      />
    </FieldShell>
  );
}
