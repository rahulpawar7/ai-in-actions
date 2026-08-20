import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { ActiveSlideVideo } from '@/components/media/ActiveSlideVideo';
import { Reveal } from '@/components/motion/Reveal';
import { bindSwiperAutoplay, useEnsureSwiperAutoplay } from '@/hooks/useEnsureSwiperAutoplay';
import { EASE_EXPO } from '@/lib/motion';
import { swiperAutoplay, swiperLoopExtras, swiperPagination } from '@/lib/swiperConfig';
import { list } from '@/features/landing/sections/utils';
import type { GalleryItem, PublicContent } from '@/types/content';

function SlideMedia({ item, active }: { item: GalleryItem; active: boolean }) {
  if (item.media?.kind === 'video') {
    return (
      <ActiveSlideVideo
        active={active}
        src={item.media.url}
        poster={item.media.posterUrl}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return <img src={item.media?.url} alt={item.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />;
}

export function AiVideoReel({ content }: { content: PublicContent }) {
  const gallery = list(content.gallery);
  const videos = gallery.filter((g) => g.media?.kind === 'video');
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEnsureSwiperAutoplay(swiper);

  if (!videos.length) return null;

  const current = videos[active];

  function toggleAutoplay() {
    if (!swiper?.autoplay) return;
    if (paused) {
      swiper.autoplay.start();
      setPaused(false);
    } else {
      swiper.autoplay.stop();
      setPaused(true);
    }
  }

  return (
    <section id="ai-reel" className="relative overflow-hidden py-section-sm lg:py-section">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-volt-500/10 via-transparent to-royal-500/10" />

      <Reveal className="shell relative z-10 mb-8 text-center lg:mb-12">
        <p className="eyebrow">AI in action — live reel</p>
        <h2 className="mt-3 font-display text-display-md font-bold sm:text-display-lg lg:text-display-xl">
          Watch the <span className="text-gradient-animated">engine work</span>
        </h2>
        <p className="lead body-muted mx-auto mt-4 max-w-2xl">
          Clips from demos and workshop builds — auto-advancing from your CMS gallery.
        </p>
      </Reveal>

      <div className="relative mx-auto w-full max-w-[96rem] px-3 sm:px-6">
        <div
          className="relative min-h-[min(52vh,480px)] overflow-hidden rounded-2xl border shadow-cinema sm:min-h-[min(62vh,640px)] sm:rounded-[2rem] lg:min-h-[min(72vh,820px)] lg:rounded-[2.5rem]"
          style={{ borderColor: 'rgba(243,238,228,0.15)' }}
        >
          <Swiper
            modules={[Autoplay, EffectFade, Pagination, A11y]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            {...swiperLoopExtras(videos.length)}
            autoplay={swiperAutoplay}
            pagination={swiperPagination}
            observer
            observeParents
            className="ai-reel-swiper !absolute inset-0 h-full w-full"
            onSwiper={(s) => {
              setSwiper(s);
              bindSwiperAutoplay(s);
            }}
            onSlideChange={(s) => setActive(s.realIndex)}
          >
            {videos.map((item) => (
              <SwiperSlide key={item.id} className="!h-full">
                {({ isActive }) => (
                  <div className="relative h-full min-h-[min(52vh,480px)] w-full sm:min-h-[min(62vh,640px)] lg:min-h-[min(72vh,820px)]">
                    <SlideMedia item={item} active={isActive} />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/40" />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 sm:p-8 lg:p-14"
            >
              <p className="label-mono text-ember-300">{current.category}</p>
              <h3 className="mt-2 max-w-4xl font-display text-lg font-bold text-paper sm:text-display-sm lg:text-display-lg">
                {current.title}
              </h3>
              {current.description ? (
                <p className="mt-2 max-w-2xl text-sm text-paper/85 sm:mt-3 sm:text-base lg:lead">{current.description}</p>
              ) : null}
              <p className="mt-4 font-mono text-[0.62rem] tabular uppercase tracking-[0.2em] text-mist-muted sm:text-sm">
                {String(active + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')} · Auto-advance
              </p>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={toggleAutoplay}
            className="absolute right-3 top-3 z-30 flex items-center gap-2 rounded-full glass-surface px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-wider text-paper transition hover:border-ember-400 sm:right-8 sm:top-8 sm:px-4 sm:py-2 sm:text-[0.62rem]"
            aria-label={paused ? 'Resume autoplay' : 'Pause autoplay'}
          >
            {paused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{paused ? 'Play reel' : 'Pause reel'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
