import type { QueryClient } from '@tanstack/react-query';
import { CONTENT_QUERY_KEY, clearPublicContentCache } from '@/services/content.service';

/** After admin CMS changes, drop stale public content from sessionStorage and refetch the live site payload. */
export function syncPublicContentAfterAdminChange(client: QueryClient) {
  clearPublicContentCache();
  void client.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
  void client.refetchQueries({ queryKey: CONTENT_QUERY_KEY, type: 'active' });
}
