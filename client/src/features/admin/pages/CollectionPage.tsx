import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AdminButton } from '../components/AdminButton';
import { EditSheet, StickySaveBar } from '../components/EditSheet';
import { StatusBadge } from '../components/StatusBadge';
import { DynamicForm } from '../components/forms/DynamicForm';
import { TextInput, ToggleSwitch } from '../components/forms/inputs';
import { deleteCollection, getSingleton, listCollection, saveCollection, saveSingleton, toggleCollection } from '../api/adminApi';
import { getAdminFormSchema } from '../forms/schemas';
import { getApiErrorMessage } from '@/lib/api';
import { syncPublicContentAfterAdminChange } from '@/lib/publicContentSync';

function itemLabel(item: Record<string, unknown>) {
  return String(item.title ?? item.name ?? item.question ?? item.fullName ?? item.registrationCode ?? item.id ?? 'Item');
}

function itemMeta(item: Record<string, unknown>, path: string) {
  if (path === 'features') return String(item.group ?? '');
  if (path === 'curriculum') return item.dayNumber != null ? `Day ${item.dayNumber}` : '';
  if (path === 'gallery') return String(item.category ?? '');
  if (path === 'workshops') return String(item.batchName ?? '');
  return '';
}

function formatDetailValue(value: unknown): string {
  if (value == null || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
    const d = new Date(text);
    if (!Number.isNaN(d.getTime())) return d.toLocaleString();
  }
  return text;
}

const READONLY_FIELDS: Record<string, { key: string; label: string; wide?: boolean }[]> = {
  registrations: [
    { key: 'registrationCode', label: 'Registration code' },
    { key: 'fullName', label: 'Full name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company' },
    { key: 'city', label: 'City' },
    { key: 'workshopName', label: 'Workshop' },
    { key: 'batchName', label: 'Batch' },
    { key: 'amount', label: 'Amount' },
    { key: 'currency', label: 'Currency' },
    { key: 'status', label: 'Status' },
    { key: 'paidAt', label: 'Paid at' },
    { key: 'createdAt', label: 'Registered at' },
    { key: 'notes', label: 'Notes', wide: true },
  ],
  payments: [
    { key: 'registrationCode', label: 'Registration code' },
    { key: 'amount', label: 'Amount' },
    { key: 'currency', label: 'Currency' },
    { key: 'status', label: 'Status' },
    { key: 'method', label: 'Method' },
    { key: 'razorpayOrderId', label: 'Razorpay order ID' },
    { key: 'razorpayPaymentId', label: 'Razorpay payment ID' },
    { key: 'verifiedAt', label: 'Verified at' },
    { key: 'createdAt', label: 'Created at' },
  ],
};

function ReadOnlyDetail({ item, path }: { item: Record<string, unknown>; path: string }) {
  const fields = READONLY_FIELDS[path] ?? Object.keys(item).map((key) => ({ key, label: key }));

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {fields.map(({ key, label, wide }) => {
        const value = item[key];
        if (value === undefined && key !== 'notes') return null;
        return (
          <div key={key} className={`admin-readonly-field ${wide ? 'sm:col-span-2' : ''}`}>
            <dt>{label}</dt>
            <dd>{formatDetailValue(value)}</dd>
          </div>
        );
      })}
    </dl>
  );
}

export function CollectionPage({ path, title, readOnly }: { path: string; title: string; readOnly?: boolean }) {
  const client = useQueryClient();
  const schema = getAdminFormSchema(path);
  const query = useQuery({ queryKey: ['cms', path], queryFn: () => listCollection(path) });
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [search, setSearch] = useState('');

  const items = query.data?.items ?? [];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => itemLabel(item).toLowerCase().includes(q) || itemMeta(item, path).toLowerCase().includes(q));
  }, [items, search, path]);

  const save = useMutation({
    mutationFn: () => {
      const id = editing && typeof editing.id === 'string' ? editing.id : null;
      return saveCollection(path, id, editing ?? {});
    },
    onSuccess: async () => {
      toast.success('Saved — live site updated');
      setEditing(null);
      await client.refetchQueries({ queryKey: ['cms', path] });
      syncPublicContentAfterAdminChange(client);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const afterMutation = async (deletedId?: string) => {
    if (deletedId && editing?.id === deletedId) setEditing(null);
    await client.refetchQueries({ queryKey: ['cms', path] });
    syncPublicContentAfterAdminChange(client);
  };

  function startNewItem() {
    setEditing({ ...(schema?.newItemDefaults ?? { isActive: true, order: items.length }) });
  }

  const editingTitle = readOnly ? 'View details' : editing?.id ? 'Edit item' : 'New item';

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{title}</h1>
          <p className="admin-page-subtitle">
            {query.data?.meta.total ?? 0} items · changes sync to the landing page on save
          </p>
        </div>
        {!readOnly && schema ? (
          <AdminButton size="lg" onClick={startNewItem}>
            <Plus className="h-4 w-4" />
            New item
          </AdminButton>
        ) : null}
      </div>

      <div className="admin-toolbar">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <TextInput
            className="!pl-9"
            value={search}
            onChange={setSearch}
            placeholder={`Search ${title.toLowerCase()}…`}
          />
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-preview-link">
          <ExternalLink className="h-4 w-4" />
          Preview site
        </a>
      </div>

      {query.isLoading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="admin-skeleton h-20" />
          ))}
        </div>
      ) : query.isError ? (
        <div className="admin-alert admin-alert-error">Could not load items. Refresh the page.</div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <p className="font-display text-lg font-bold text-ink">{search ? 'No matches' : 'No items yet'}</p>
          <p className="mt-1 text-sm text-ink/50">
            {search ? 'Try a different search term.' : 'Create your first item to show it on the landing page.'}
          </p>
          {!readOnly && schema && !search ? (
            <AdminButton className="mt-4" onClick={startNewItem}>
              <Plus className="h-4 w-4" /> Create first item
            </AdminButton>
          ) : null}
        </div>
      ) : (
        <ul className="admin-list">
          {filtered.map((item) => {
            const id = String(item.id);
            const meta = itemMeta(item, path);
            return (
              <li key={id} className="admin-list-row">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium text-ink">{itemLabel(item)}</p>
                    <StatusBadge active={item.isActive !== false} featured={Boolean(item.isFeatured)} />
                  </div>
                  {meta ? <p className="mt-0.5 text-xs text-ink/45">{meta}</p> : null}
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {!readOnly && schema ? (
                    <div className="flex items-center gap-2 rounded-lg border border-line-paper bg-paper-50 px-2.5 py-1.5">
                      <span className="text-xs font-medium text-ink/50">Live</span>
                      <ToggleSwitch
                        size="sm"
                        checked={item.isActive !== false}
                        label={`Toggle ${itemLabel(item)}`}
                        onChange={(next) =>
                          toggleCollection(path, id, next)
                            .then(() => afterMutation())
                            .catch((error) => toast.error(getApiErrorMessage(error)))
                        }
                      />
                    </div>
                  ) : null}

                  {!readOnly ? (
                    <>
                      <AdminButton variant="secondary" size="sm" onClick={() => setEditing(item)}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (!window.confirm(`Remove "${itemLabel(item)}"?`)) return;
                          deleteCollection(path, id)
                            .then(() => {
                              toast.success('Removed');
                              afterMutation(id);
                            })
                            .catch((error) => toast.error(getApiErrorMessage(error)));
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </AdminButton>
                    </>
                  ) : (
                    <AdminButton variant="secondary" size="sm" onClick={() => setEditing(item)}>
                      View
                    </AdminButton>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <EditSheet
        open={Boolean(editing)}
        title={editingTitle}
        subtitle={editing ? itemLabel(editing) : undefined}
        readOnly={readOnly || !schema}
        saving={save.isPending}
        onClose={() => setEditing(null)}
        onSave={readOnly || !schema ? undefined : () => save.mutate()}
      >
        {editing ? (
          readOnly || !schema ? (
            <ReadOnlyDetail item={editing} path={path} />
          ) : (
            <DynamicForm schema={schema} value={editing} onChange={setEditing} />
          )
        ) : null}
      </EditSheet>
    </div>
  );
}

export function SingletonPage({ path, title }: { path: string; title: string }) {
  const client = useQueryClient();
  const schema = getAdminFormSchema(path);
  const query = useQuery({ queryKey: ['singleton', path], queryFn: () => getSingleton(path) });
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const base = query.data ?? {};
  const value = draft ?? base;
  const isDirty = draft !== null;

  const save = useMutation({
    mutationFn: () => saveSingleton(path, draft ?? base),
    onSuccess: async (data) => {
      toast.success('Saved — live site updated');
      setDraft(null);
      client.setQueryData(['singleton', path], data);
      await client.refetchQueries({ queryKey: ['singleton', path] });
      syncPublicContentAfterAdminChange(client);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  if (query.isLoading) {
    return (
      <div className="admin-page space-y-4">
        <div className="admin-skeleton h-10 w-48" />
        <div className="admin-skeleton h-96" />
      </div>
    );
  }

  if (query.isError) {
    return <div className="admin-alert admin-alert-error">Could not load {title.toLowerCase()}.</div>;
  }

  if (!schema) {
    return <div className="admin-alert admin-alert-error">No form configured for this section.</div>;
  }

  return (
    <div className={`admin-page ${isDirty ? 'pb-24' : ''}`}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{title}</h1>
          <p className="admin-page-subtitle">Edit below and save — the landing page updates immediately.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-preview-link">
            <ExternalLink className="h-4 w-4" /> Preview site
          </a>
          <AdminButton size="lg" disabled={save.isPending || !isDirty} onClick={() => save.mutate()}>
            {save.isPending ? 'Saving…' : 'Save changes'}
          </AdminButton>
        </div>
      </div>

      <DynamicForm schema={schema} value={value} onChange={setDraft} />

      <StickySaveBar
        dirty={isDirty}
        saving={save.isPending}
        onSave={() => save.mutate()}
        onDiscard={() => setDraft(null)}
      />
    </div>
  );
}
