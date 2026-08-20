const store = new Map<string, { value: unknown; expiresAt: number }>();

export const CACHE_KEYS = {
  publicContent: 'public:content',
  publicSeo: 'public:seo',
};

export const cache = {
  async wrap<T>(key: string, ttlSeconds: number, factory: () => Promise<T>): Promise<T> {
    const hit = store.get(key);
    if (hit && hit.expiresAt > Date.now()) {
      return hit.value as T;
    }
    const value = await factory();
    store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
    return value;
  },
  del(key: string) {
    store.delete(key);
  },
  flush() {
    store.clear();
  },
};

export function invalidatePublicCache() {
  cache.del(CACHE_KEYS.publicContent);
  cache.del(CACHE_KEYS.publicSeo);
}
