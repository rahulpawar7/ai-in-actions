import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { swiperAutoplay } from '@/lib/swiperConfig';

/** Auto-advance a carousel index on a fixed interval (non-Swiper UIs). */
export function useSwiperAutoplay(
  count: number,
  setActive: Dispatch<SetStateAction<number>>,
  options?: { enabled?: boolean; delay?: number },
) {
  const reduced = usePrefersReducedMotion();
  const enabled = options?.enabled !== false && count > 1 && !reduced;
  const delay = options?.delay ?? swiperAutoplay.delay;

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, delay);
    return () => window.clearInterval(timer);
  }, [count, delay, enabled, setActive]);
}
