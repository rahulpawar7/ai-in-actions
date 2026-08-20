export function list<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}
