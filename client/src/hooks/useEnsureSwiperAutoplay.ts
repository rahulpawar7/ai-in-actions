import { useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';

/** Force Swiper autoplay to start (React StrictMode / lazy mount safe). */
export function startSwiperAutoplay(swiper: SwiperType | null | undefined) {
  if (!swiper || swiper.destroyed || !swiper.autoplay) return;
  try {
    swiper.autoplay.stop();
    swiper.autoplay.start();
  } catch {
    /* swiper tearing down */
  }
}

export function useEnsureSwiperAutoplay(swiper: SwiperType | null) {
  useEffect(() => {
    if (!swiper) return;
    startSwiperAutoplay(swiper);

    const resume = () => {
      if (document.visibilityState === 'visible') startSwiperAutoplay(swiper);
    };

    const delayed = window.setTimeout(() => startSwiperAutoplay(swiper), 120);

    document.addEventListener('visibilitychange', resume);
    window.addEventListener('focus', resume);

    return () => {
      window.clearTimeout(delayed);
      document.removeEventListener('visibilitychange', resume);
      window.removeEventListener('focus', resume);
    };
  }, [swiper]);
}

export function bindSwiperAutoplay(swiper: SwiperType) {
  startSwiperAutoplay(swiper);
}
