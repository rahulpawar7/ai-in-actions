/** Shared Swiper autoplay settings — used across every carousel on the site. */
export const SWIPER_AUTOPLAY_DELAY = 5000;

export const swiperAutoplay = {
  delay: SWIPER_AUTOPLAY_DELAY,
  disableOnInteraction: false,
  pauseOnMouseEnter: false,
  waitForTransition: false,
  stopOnLastSlide: false,
};

export const swiperPagination = {
  clickable: true,
  dynamicBullets: true,
};

export function swiperLoop(count: number) {
  return count > 1;
}

export function swiperLoopExtras(count: number) {
  if (count <= 1) return {};
  return {
    loop: true,
    loopAdditionalSlides: Math.max(count, 3),
    loopPreventsSliding: false,
  };
}
