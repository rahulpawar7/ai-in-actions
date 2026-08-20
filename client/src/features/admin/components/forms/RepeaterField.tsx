import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FieldDef, RepeaterFieldDef } from '../../forms/types';
import { asRecordList, getByPath, setByPath } from '../../forms/formUtils';
import { SwitchRow } from './inputs';
import { FieldRenderer } from './FieldRenderer';
import { AdminButton } from '../AdminButton';

export function RepeaterField({
  field,
  value,
  onChange,
  readOnly,
  prefix = '',
}: {
  field: RepeaterFieldDef;
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  readOnly?: boolean;
  prefix?: string;
}) {
  const path = prefix ? `${prefix}.${field.key}` : field.key;
  const items = asRecordList(getByPath(value, path));

  function updateItems(next: Record<string, unknown>[]) {
    onChange(setByPath(value, path, next));
  }

  function itemTitle(item: Record<string, unknown>, index: number) {
    if (field.itemLabel) {
      const labelField = field.fields.find((f) => f.key === field.itemLabel);
      if (labelField) {
        const val = item[field.itemLabel];
        if (val) return String(val);
      }
    }
    for (const key of ['title', 'name', 'label', 'question']) {
      if (item[key]) return String(item[key]);
    }
    return `${field.label} ${index + 1}`;
  }

  return (
    <div className="sm:col-span-2 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-medium text-ink">{field.label}</p>
          {field.hint ? <p className="text-xs text-ink/45">{field.hint}</p> : null}
        </div>
        {!readOnly ? (
          <AdminButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => updateItems([...items, { ...(field.defaultItem ?? {}), order: items.length }])}
          >
            <Plus className="h-3.5 w-3.5" />
            {field.addLabel ?? 'Add item'}
          </AdminButton>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line-paper px-4 py-6 text-center text-sm text-ink/45">No items yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <RepeaterItem
              key={index}
              title={itemTitle(item, index)}
              fields={field.fields}
              item={item}
              readOnly={readOnly}
              onChange={(nextItem) => {
                const next = [...items];
                next[index] = nextItem;
                updateItems(next);
              }}
              onMoveUp={index > 0 && !readOnly ? () => {
                const next = [...items];
                [next[index - 1], next[index]] = [next[index], next[index - 1]];
                updateItems(next.map((row, i) => ({ ...row, order: i })));
              } : undefined}
              onMoveDown={index < items.length - 1 && !readOnly ? () => {
                const next = [...items];
                [next[index], next[index + 1]] = [next[index + 1], next[index]];
                updateItems(next.map((row, i) => ({ ...row, order: i })));
              } : undefined}
              onRemove={
                readOnly
                  ? undefined
                  : () => {
                      updateItems(items.filter((_, i) => i !== index));
                    }
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function RepeaterItem({
  title,
  fields,
  item,
  readOnly,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  title: string;
  fields: FieldDef[];
  item: Record<string, unknown>;
  readOnly?: boolean;
  onChange: (next: Record<string, unknown>) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <li className="admin-repeater-item">
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-line-paper pb-3">
        <p className="truncate font-display text-sm font-bold text-ink">{title}</p>
        <div className="flex shrink-0 gap-0.5">
          {onMoveUp ? (
            <button type="button" className="admin-icon-btn" onClick={onMoveUp} aria-label="Move up">
              <ChevronUp className="h-4 w-4" />
            </button>
          ) : null}
          {onMoveDown ? (
            <button type="button" className="admin-icon-btn" onClick={onMoveDown} aria-label="Move down">
              <ChevronDown className="h-4 w-4" />
            </button>
          ) : null}
          {onRemove ? (
            <button type="button" className="admin-icon-btn admin-icon-btn-danger" onClick={onRemove} aria-label="Remove">
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((child) => (
          <FieldRenderer
            key={child.key}
            field={child}
            value={item}
            readOnly={readOnly}
            onChange={onChange}
          />
        ))}
      </div>
    </li>
  );
}

export function SectionVisibilityField({
  label,
  hint,
  sections,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  hint?: string;
  sections: { key: string; label: string }[];
  value: unknown;
  onChange: (next: Record<string, boolean>) => void;
  readOnly?: boolean;
}) {
  const map = (value != null && typeof value === 'object' && !Array.isArray(value) ? value : {}) as Record<string, boolean>;

  return (
    <div className="sm:col-span-2">
      <p className="font-medium text-ink">{label}</p>
      {hint ? <p className="mt-0.5 text-xs text-ink/45">{hint}</p> : null}
      <ul className="mt-3 grid gap-2">
        {sections.map((section) => {
          const visible = map[section.key] !== false;
          return (
            <li key={section.key}>
              <SwitchRow
                label={section.label}
                checked={visible}
                readOnly={readOnly}
                onChange={(checked) => onChange({ ...map, [section.key]: checked })}
                className={cn(!visible && 'opacity-80')}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
