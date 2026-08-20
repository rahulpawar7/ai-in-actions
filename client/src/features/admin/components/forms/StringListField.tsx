import { Plus, Trash2 } from 'lucide-react';
import { AdminButton } from '../AdminButton';
import { asStringList } from '../../forms/formUtils';
import { FieldShell, TextAreaInput } from './inputs';

export function StringListField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  readOnly,
}: {
  label: string;
  hint?: string;
  value: unknown;
  onChange: (next: string[]) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  const items = asStringList(value);
  const text = items.join('\n');

  return (
    <FieldShell label={label} hint={hint ?? 'One item per line'} className="sm:col-span-2">
      <TextAreaInput
        value={text}
        readOnly={readOnly}
        placeholder={placeholder ?? 'Item one\nItem two'}
        rows={Math.min(8, Math.max(3, items.length + 1))}
        onChange={(raw) => {
          const next = raw
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
          onChange(next);
        }}
      />
      {!readOnly ? (
        <div className="mt-2 flex flex-wrap gap-2">
          <AdminButton type="button" variant="ghost" size="sm" onClick={() => onChange([...items, ''])}>
            <Plus className="h-3 w-3" /> Add line
          </AdminButton>
          {items.length ? (
            <AdminButton type="button" variant="danger" size="sm" onClick={() => onChange([])}>
              <Trash2 className="h-3 w-3" /> Clear all
            </AdminButton>
          ) : null}
        </div>
      ) : null}
    </FieldShell>
  );
}
