/** Maps Mongoose lean documents to API shape with string `id`. */
export function leanWithId<T extends Record<string, unknown>>(doc: T | null | undefined): (T & { id: string }) | null {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, id: String(doc.id ?? _id) } as T & { id: string };
}

export function leanListWithId<T extends Record<string, unknown>>(docs: T[]): (T & { id: string })[] {
  return docs.map((doc, index) => leanWithId(doc) ?? ({ ...doc, id: String(index) } as T & { id: string }));
}
