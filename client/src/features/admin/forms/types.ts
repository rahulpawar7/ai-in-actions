export type FieldDef =
  | TextFieldDef
  | SelectFieldDef
  | ToggleFieldDef
  | StringListFieldDef
  | MediaFieldDef
  | CtaFieldDef
  | GroupFieldDef
  | RepeaterFieldDef
  | SectionVisibilityFieldDef;

interface BaseFieldDef {
  key: string;
  label: string;
  hint?: string;
  required?: boolean;
  colSpan?: 1 | 2;
}

export interface TextFieldDef extends BaseFieldDef {
  type: 'text' | 'textarea' | 'number' | 'date' | 'datetime-local' | 'email' | 'url';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
}

export interface SelectFieldDef extends BaseFieldDef {
  type: 'select';
  options: { value: string; label: string }[];
}

export interface ToggleFieldDef extends BaseFieldDef {
  type: 'toggle';
}

export interface StringListFieldDef extends BaseFieldDef {
  type: 'string-list';
  placeholder?: string;
}

export interface MediaFieldDef extends BaseFieldDef {
  type: 'media';
}

export interface CtaFieldDef extends BaseFieldDef {
  type: 'cta';
}

export interface GroupFieldDef extends BaseFieldDef {
  type: 'group';
  fields: FieldDef[];
}

export interface RepeaterFieldDef extends BaseFieldDef {
  type: 'repeater';
  fields: FieldDef[];
  defaultItem?: Record<string, unknown>;
  addLabel?: string;
  itemLabel?: string;
}

export interface SectionVisibilityFieldDef extends BaseFieldDef {
  type: 'section-visibility';
  sections: { key: string; label: string }[];
}

export interface FormSectionDef {
  title: string;
  description?: string;
  fields: FieldDef[];
}

export interface FormSchema {
  sections: FormSectionDef[];
  newItemDefaults?: Record<string, unknown>;
}
