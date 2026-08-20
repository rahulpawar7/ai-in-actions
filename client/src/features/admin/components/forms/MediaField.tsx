import { asRecord } from '../../forms/formUtils';
import { FieldShell, SelectInput, TextInput } from './inputs';

const MEDIA_KINDS = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'gif', label: 'GIF' },
  { value: 'audio', label: 'Audio' },
  { value: 'document', label: 'Document' },
];

const MEDIA_PROVIDERS = [
  { value: 'external', label: 'External URL' },
  { value: 'cloudinary', label: 'Cloudinary' },
  { value: 'local', label: 'Local' },
];

export function MediaField({
  label,
  hint,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  hint?: string;
  value: unknown;
  onChange: (next: Record<string, unknown> | undefined) => void;
  readOnly?: boolean;
}) {
  const media = asRecord(value);
  const url = String(media.url ?? '');
  const kind = String(media.kind ?? 'image');
  const provider = String(media.provider ?? 'external');
  const alt = String(media.alt ?? '');
  const posterUrl = String(media.posterUrl ?? '');

  function patch(key: string, val: string) {
    const next = { ...media, [key]: val };
    if (!next.url) {
      onChange(undefined);
      return;
    }
    onChange(next);
  }

  return (
    <div className="admin-group-card sm:col-span-2">
      <p className="font-display text-sm font-bold text-ink">{label}</p>
      {hint ? <p className="mt-0.5 text-xs text-ink/50">{hint}</p> : null}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <FieldShell label="Media URL" required className="sm:col-span-2">
          <TextInput value={url} readOnly={readOnly} placeholder="https://..." onChange={(v) => patch('url', v)} />
        </FieldShell>
        <FieldShell label="Kind">
          <SelectInput value={kind} options={MEDIA_KINDS} readOnly={readOnly} onChange={(v) => patch('kind', v)} />
        </FieldShell>
        <FieldShell label="Provider">
          <SelectInput value={provider} options={MEDIA_PROVIDERS} readOnly={readOnly} onChange={(v) => patch('provider', v)} />
        </FieldShell>
        <FieldShell label="Alt text">
          <TextInput value={alt} readOnly={readOnly} onChange={(v) => patch('alt', v)} />
        </FieldShell>
        {kind === 'video' ? (
          <FieldShell label="Poster URL" hint="Thumbnail shown before video plays">
            <TextInput value={posterUrl} readOnly={readOnly} placeholder="https://..." onChange={(v) => patch('posterUrl', v)} />
          </FieldShell>
        ) : null}
      </div>
      {url ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-line-paper bg-paper-100">
          {kind === 'video' ? (
            <video src={url} poster={posterUrl || undefined} controls className="max-h-40 w-full object-cover" />
          ) : (
            <img src={url} alt={alt || label} className="max-h-40 w-full object-cover" />
          )}
        </div>
      ) : null}
    </div>
  );
}
