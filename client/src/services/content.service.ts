import { unwrap, api } from '@/lib/api';
import { normalizePublicContent } from '@/lib/normalizeContent';
import type { PublicContent } from '@/types/content';

export const CONTENT_QUERY_KEY = ['public-content'] as const;
const CACHE_KEY = 'aia_public_content_v4';

export function clearPublicContentCache() {
  try {
    sessionStorage.removeItem(CACHE_KEY);
    sessionStorage.removeItem('aia_public_content_v3');
    sessionStorage.removeItem('aia_public_content_v2');
    sessionStorage.removeItem('aia_last_good_content');
  } catch {
    /* ignore */
  }
}

export async function fetchPublicContent(): Promise<PublicContent> {
  const data = normalizePublicContent(await unwrap<Partial<PublicContent>>(api.get('/content')));
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
    sessionStorage.removeItem('aia_public_content_v2');
    sessionStorage.removeItem('aia_last_good_content');
  } catch {
    /* ignore quota */
  }
  return data;
}

export function readCachedContent(): PublicContent | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? normalizePublicContent(JSON.parse(raw) as Partial<PublicContent>) : null;
  } catch {
    return null;
  }
}
