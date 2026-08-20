import type { FormSchema } from '../../forms/types';
import { FormSection } from './inputs';
import { FieldRenderer } from './FieldRenderer';

export function DynamicForm({
  schema,
  value,
  onChange,
  readOnly,
}: {
  schema: FormSchema;
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-5">
      {schema.sections.map((section) => (
        <FormSection key={section.title} title={section.title} description={section.description}>
          {section.fields.map((field) => (
            <FieldRenderer key={`${section.title}-${field.key}-${field.type}`} field={field} value={value} onChange={onChange} readOnly={readOnly} />
          ))}
        </FormSection>
      ))}
    </div>
  );
}
