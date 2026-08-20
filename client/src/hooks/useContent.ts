import { useQuery } from '@tanstack/react-query';
import { normalizePublicContent } from '@/lib/normalizeContent';
import { CONTENT_QUERY_KEY, fetchPublicContent, readCachedContent } from '@/services/content.service';
import type { PublicContent } from '@/types/content';

export function useContent() {
  const cached = readCachedContent();
  const query = useQuery({
    queryKey: CONTENT_QUERY_KEY,
    queryFn: fetchPublicContent,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: cached ?? undefined,
    select: (data) => normalizePublicContent(data),
  });

  return {
    content: query.data,
    isLoading: query.isLoading && !query.data,
    isError: query.isError && !query.data,
    isStaleFallback: Boolean(cached && query.isError),
    refetch: () => void query.refetch(),
  };
}

export function isSectionVisible(content: PublicContent, key: string) {
  return content.site?.sectionVisibility?.[key] !== false;
}
