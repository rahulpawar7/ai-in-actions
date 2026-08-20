import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type RefObject } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';

import { deleteCollection, getSingleton, listCollection, saveCollection, saveSingleton, toggleCollection } from '../api/adminApi';

import { getApiErrorMessage } from '@/lib/api';

import { syncPublicContentAfterAdminChange } from '@/lib/publicContentSync';



export type JsonEditorHandle = {

  parse: () => Record<string, unknown>;

};



const JsonEditor = forwardRef<

  JsonEditorHandle,

  {

    value: Record<string, unknown>;

    onChange: (next: Record<string, unknown>) => void;

    readOnly?: boolean;

  }

>(function JsonEditor({ value, onChange, readOnly }, ref) {

  const [text, setText] = useState(() => JSON.stringify(value, null, 2));



  useEffect(() => {

    setText(JSON.stringify(value, null, 2));

  }, [value]);



  useImperativeHandle(

    ref,

    () => ({

      parse: () => {

        const parsed = JSON.parse(text) as Record<string, unknown>;

        onChange(parsed);

        return parsed;

      },

    }),

    [text, onChange],

  );



  return (

    <textarea

      className="min-h-[280px] w-full rounded-xl border border-line-paper bg-white p-3 font-mono text-xs leading-relaxed sm:min-h-[360px] sm:p-4 sm:text-sm lg:min-h-[420px]"

      value={text}

      spellCheck={false}

      readOnly={readOnly}

      onChange={(event) => {

        if (readOnly) return;

        setText(event.target.value);

        try {

          onChange(JSON.parse(event.target.value) as Record<string, unknown>);

        } catch {

          /* keep typing */

        }

      }}

    />

  );

});



function itemLabel(item: Record<string, unknown>) {

  return String(item.title ?? item.name ?? item.question ?? item.fullName ?? item.registrationCode ?? item.id ?? 'Item');

}



function parseEditorPayload(editorRef: RefObject<JsonEditorHandle | null>) {

  try {

    return editorRef.current!.parse();

  } catch {

    throw new Error('Invalid JSON — fix syntax before saving.');

  }

}



export function CollectionPage({ path, title, readOnly }: { path: string; title: string; readOnly?: boolean }) {

  const client = useQueryClient();

  const editorRef = useRef<JsonEditorHandle>(null);

  const query = useQuery({ queryKey: ['cms', path], queryFn: () => listCollection(path) });

  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);



  const save = useMutation({

    mutationFn: () => {

      const parsed = parseEditorPayload(editorRef);

      const id = editing && typeof editing.id === 'string' ? editing.id : null;

      return saveCollection(path, id, parsed);

    },

    onSuccess: async () => {

      toast.success('Saved');

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



  return (

    <div className="mx-auto max-w-5xl">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{title}</h1>

          <p className="mt-1 text-sm text-ink/50">{query.data?.meta.total ?? 0} items</p>

        </div>

        {!readOnly ? (

          <Button className="w-full !text-ink sm:w-auto" variant="secondary" onClick={() => setEditing({ isActive: true, order: 0 })}>

            New item

          </Button>

        ) : null}

      </div>



      {query.isLoading ? (

        <div className="mt-6 space-y-3">

          {Array.from({ length: 4 }).map((_, i) => (

            <div key={i} className="h-16 animate-pulse rounded-xl bg-paper-300" />

          ))}

        </div>

      ) : query.isError ? (

        <p className="mt-6 rounded-xl border border-ember-400/30 bg-ember-500/10 p-4 text-sm text-ember-600">Could not load items. Refresh the page.</p>

      ) : (

        <ul className="mt-6 divide-y divide-line-paper overflow-hidden rounded-xl border border-line-paper bg-white shadow-sm">

          {(query.data?.items ?? []).map((item) => (

            <li key={String(item.id)} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0 flex-1">

                <p className="truncate font-medium">{itemLabel(item)}</p>

                <p className="text-xs text-ink/50">{item.isActive === false ? 'Inactive' : 'Active'}</p>

              </div>

              <div className="flex flex-wrap gap-2">

                {!readOnly ? (

                  <>

                    <Button variant="ghost" className="!px-3 !py-1.5 !text-xs !text-ink" onClick={() => setEditing(item)}>

                      Edit

                    </Button>

                    <Button

                      variant="ghost"

                      className="!px-3 !py-1.5 !text-xs !text-ink"

                      onClick={() =>

                        toggleCollection(path, String(item.id), !item.isActive)

                          .then(() => afterMutation())

                          .catch((error) => toast.error(getApiErrorMessage(error)))

                      }

                    >

                      Toggle

                    </Button>

                    <Button

                      variant="ghost"

                      className="!px-3 !py-1.5 !text-xs !text-ember-600"

                      onClick={() => {

                        if (!window.confirm('Remove this item?')) return;

                        const id = String(item.id);

                        deleteCollection(path, id)

                          .then(() => afterMutation(id))

                          .catch((error) => toast.error(getApiErrorMessage(error)));

                      }}

                    >

                      Remove

                    </Button>

                  </>

                ) : (

                  <Button variant="ghost" className="!px-3 !py-1.5 !text-xs !text-ink" onClick={() => setEditing(item)}>

                    View

                  </Button>

                )}

              </div>

            </li>

          ))}

        </ul>

      )}



      {editing ? (

        <div className="mt-6 rounded-xl border border-line-paper bg-white p-4 shadow-sm sm:p-6">

          <h2 className="font-display text-lg font-bold">{readOnly ? 'View item' : 'Edit item'}</h2>

          <div className="mt-4">

            <JsonEditor ref={editorRef} value={editing} onChange={setEditing} readOnly={readOnly} />

          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">

            {!readOnly ? (

              <Button className="w-full sm:w-auto" onClick={() => save.mutate()} disabled={save.isPending}>

                {save.isPending ? 'Saving…' : 'Save'}

              </Button>

            ) : null}

            <Button variant="secondary" className="w-full !text-ink sm:w-auto" onClick={() => setEditing(null)}>

              Close

            </Button>

          </div>

        </div>

      ) : null}

    </div>

  );

}



export function SingletonPage({ path, title }: { path: string; title: string }) {

  const client = useQueryClient();

  const editorRef = useRef<JsonEditorHandle>(null);

  const query = useQuery({ queryKey: ['singleton', path], queryFn: () => getSingleton(path) });

  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);

  const value = draft ?? query.data ?? {};



  const save = useMutation({

    mutationFn: () => saveSingleton(path, parseEditorPayload(editorRef)),

    onSuccess: async (data) => {

      toast.success('Saved');

      setDraft(null);

      client.setQueryData(['singleton', path], data);

      await client.refetchQueries({ queryKey: ['singleton', path] });

      syncPublicContentAfterAdminChange(client);

    },

    onError: (error) => toast.error(getApiErrorMessage(error)),

  });



  if (query.isLoading) {

    return (

      <div className="mx-auto max-w-4xl space-y-4">

        <div className="h-8 w-48 animate-pulse rounded-lg bg-paper-300" />

        <div className="h-80 animate-pulse rounded-xl bg-paper-300" />

      </div>

    );

  }



  if (query.isError) {

    return <p className="text-sm text-ember-600">Could not load {title.toLowerCase()}.</p>;

  }



  return (

    <div className="mx-auto max-w-4xl">

      <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{title}</h1>

      <p className="mt-1 text-sm text-ink/50">Edit JSON and save — changes appear on the live site.</p>

      <div className="mt-6 rounded-xl border border-line-paper bg-white p-4 shadow-sm sm:p-6">

        <JsonEditor ref={editorRef} value={value} onChange={setDraft} />

        <Button className="mt-4 w-full sm:w-auto" onClick={() => save.mutate()} disabled={save.isPending}>

          {save.isPending ? 'Saving…' : 'Save changes'}

        </Button>

      </div>

    </div>

  );

}

