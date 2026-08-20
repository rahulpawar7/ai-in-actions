import { useCallback, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, Maximize2 } from 'lucide-react';
import 'swiper/css';
import { ActiveSlideVideo } from '@/components/media/ActiveSlideVideo';
import { Reveal } from '@/components/motion/Reveal';
import { useSwiperAutoplay } from '@/hooks/useSwiperAutoplay';
import { EASE_EXPO } from '@/lib/motion';
import { swiperLoopExtras } from '@/lib/swiperConfig';
import { cn } from '@/lib/utils';
import type { GalleryItem } from '@/types/content';

function VideoProgress({ videoRef, playing }: { videoRef: React.RefObject<HTMLVideoElement>; playing: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playing) return;
    const tick = () => {
      if (video.duration) setProgress((video.currentTime / video.duration) * 100);
    };
    video.addEventListener('timeupdate', tick);
    return () => video.removeEventListener('timeupdate', tick);
  }, [videoRef, playing]);

  return (
    <div className="h-0.5 w-full overflow-hidden bg-ink-600">
      <motion.div className="h-full bg-royal-sweep" style={{ width: `${progress}%` }} />
    </div>
  );
}

export function VideoShowcase({
  items,
  eyebrow = 'Workshop films',
  title = 'See AI',
  emphasis = 'in action.',
}: {
  items: GalleryItem[];
  eyebrow?: string;
  title?: string;
  emphasis?: string;
}) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mobileSwiper, setMobileSwiper] = useState<SwiperType | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const goTo = useCallback((index: number) => {
    setActive(index);
    mobileSwiper?.slideToLoop(index);
  }, [mobileSwiper]);

  useSwiperAutoplay(items.length, setActive);

  useEffect(() => {
    if (mobileSwiper && !mobileSwiper.destroyed) {
      mobileSwiper.slideToLoop(active);
    }
  }, [active, mobileSwiper]);

  if (!items.length) return null;

  const current = items[active];
  const prev = items[(active - 1 + items.length) % items.length];
  const next = items[(active + 1) % items.length];

  return (
    <section className="relative overflow-hidden py-section-sm lg:py-section">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-royal-500/5 via-transparent to-ember-500/5" />

      <Reveal className="shell relative mb-8 text-center sm:mb-10 lg:mb-14">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-display text-display-md font-bold tracking-tight sm:text-display-lg lg:text-display-xl">
          {title} <span className="text-gradient-animated">{emphasis}</span>
        </h2>
        <p className="lead body-muted mx-auto mt-4 max-w-3xl px-2">
          Full-screen workshop moments. Auto-advancing reel — tap any film to play.
        </p>
      </Reveal>

      <div className="shell relative">
        <div className="hidden items-stretch gap-2 md:grid md:grid-cols-[0.18fr_1fr_0.18fr] lg:gap-3">
          <PreviewPeek item={prev} label="Previous" onClick={() => goTo((active - 1 + items.length) % items.length)} side="left" />
          <MainStage
            item={current}
            videoRef={videoRef}
            playing={playing}
            setPlaying={setPlaying}
            onPrev={() => goTo((active - 1 + items.length) % items.length)}
            onNext={() => goTo((active + 1) % items.length)}
            index={active}
            total={items.length}
          />
          <PreviewPeek item={next} label="Next" onClick={() => goTo((active + 1) % items.length)} side="right" />
        </div>

        <div className="md:hidden">
          <Swiper
            modules={[A11y, Keyboard]}
            slidesPerView={1.05}
            centeredSlides
            spaceBetween={12}
            {...swiperLoopExtras(items.length)}
            keyboard={{ enabled: true }}
            onSwiper={setMobileSwiper}
            onSlideChange={(s) => setActive(s.realIndex)}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                {({ isActive }) => (
                  <div className={cn('transition duration-500', isActive ? 'scale-100 opacity-100' : 'scale-[0.94] opacity-50')}>
                    <MobileSlide item={item} isActive={isActive} />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-5 sm:mt-6 lg:mt-8">
          {current.media?.kind === 'video' && playing ? (
            <VideoProgress videoRef={videoRef} playing={playing} />
          ) : (
            <div className="h-0.5 w-full bg-ink-700">
              <div className="h-full bg-royal-sweep transition-all duration-500" style={{ width: `${((active + 1) / items.length) * 100}%` }} />
            </div>
          )}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 snap-x">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(index)}
                className={cn(
                  'relative shrink-0 snap-start overflow-hidden rounded-xl border transition duration-300',
                  active === index ? 'border-ember-400 ring-2 ring-ember-400/25' : 'border-transparent opacity-60 hover:opacity-100',
                )}
              >
                <div className="h-16 w-28 sm:h-20 sm:w-36">
                  {item.media?.kind === 'video' ? (
                    <video src={item.media.url} poster={item.media.posterUrl} className="h-full w-full object-cover" muted preload="none" />
                  ) : (
                    <img src={item.media?.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  )}
                </div>
                <span className="absolute inset-x-0 bottom-0 truncate bg-ink/80 px-2 py-1 font-mono text-[0.55rem] uppercase tracking-wider text-paper">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-center font-mono text-[0.62rem] uppercase tracking-[0.22em] text-mist-muted">
            {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')} · Auto-advance
          </p>
        </div>
      </div>
    </section>
  );
}

function PreviewPeek({ item, label, onClick, side }: { item: GalleryItem; label: string; onClick: () => void; side: 'left' | 'right' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative hidden overflow-hidden rounded-2xl border opacity-50 transition duration-500 hover:opacity-90 lg:block',
        side === 'left' ? '-rotate-2 hover:rotate-0' : 'rotate-2 hover:rotate-0',
      )}
      style={{ borderColor: 'rgba(243,238,228,0.12)' }}
    >
      <div className="relative aspect-[3/4] w-full">
        {item.media?.kind === 'video' ? (
          <video src={item.media.url} poster={item.media.posterUrl} className="h-full w-full object-cover" muted preload="none" />
        ) : (
          <img src={item.media?.url} alt="" className="h-full w-full object-cover" loading="lazy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <span className="absolute bottom-3 left-3 font-mono text-[0.58rem] uppercase tracking-wider text-mist-muted">{label}</span>
      </div>
    </button>
  );
}

function MainStage({
  item,
  videoRef,
  playing,
  setPlaying,
  onPrev,
  onNext,
  index,
  total,
}: {
  item: GalleryItem;
  videoRef: React.RefObject<HTMLVideoElement>;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  index: number;
  total: number;
}) {
  const isVideo = item.media?.kind === 'video';

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      void video.play();
      setPlaying(true);
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;
    void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [item.id, isVideo, setPlaying]);

  return (
    <div className="relative overflow-hidden rounded-2xl border shadow-cinema lg:rounded-3xl" style={{ borderColor: 'rgba(243,238,228,0.15)' }}>
      <div className="relative aspect-video w-full min-h-[220px] bg-ink-800 sm:min-h-[280px] lg:aspect-[16/9] lg:min-h-[min(48vh,560px)]">
        <AnimatePresence mode="wait">
          <motion.div key={item.id} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55, ease: EASE_EXPO }} className="absolute inset-0">
            {isVideo ? (
              <video ref={videoRef} className="h-full w-full object-cover" src={item.media.url} poster={item.media.posterUrl} muted loop playsInline preload="metadata" />
            ) : (
              <img src={item.media?.url} alt={item.media?.alt ?? item.title} className="h-full w-full object-cover" />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
        {!playing && isVideo ? (
          <button type="button" onClick={togglePlay} className="absolute inset-0 grid place-items-center bg-ink/30 transition hover:bg-ink/20" aria-label="Play video">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-line bg-ink/70 shadow-glow backdrop-blur transition hover:scale-105 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
              <Play className="ml-1 h-8 w-8 fill-paper text-paper sm:h-9 sm:w-9 lg:h-10 lg:w-10" />
            </span>
          </button>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
          <p className="label-mono text-ember-300">{item.category}</p>
          <h3 className="mt-2 font-display text-lg font-bold sm:text-display-xs lg:text-display-md">{item.title}</h3>
          {item.description ? <p className="body-muted mt-2 hidden max-w-xl text-sm sm:block sm:text-base">{item.description}</p> : null}
        </div>
      </div>
      <div className="flex items-center justify-between border-t px-3 py-2 sm:px-4 sm:py-3" style={{ borderColor: 'rgba(243,238,228,0.12)' }}>
        <div className="flex gap-1.5 sm:gap-2">
          <NavBtn onClick={onPrev} aria-label="Previous"><ChevronLeft className="h-4 w-4" /></NavBtn>
          <NavBtn onClick={onNext} aria-label="Next"><ChevronRight className="h-4 w-4" /></NavBtn>
          {isVideo ? <NavBtn onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}</NavBtn> : null}
        </div>
        <span className="font-mono text-[0.58rem] tabular uppercase tracking-wider text-mist-muted sm:text-[0.62rem]">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        {isVideo ? <NavBtn onClick={() => videoRef.current?.requestFullscreen?.()} aria-label="Fullscreen"><Maximize2 className="h-4 w-4" /></NavBtn> : <span className="w-8 sm:w-10" />}
      </div>
    </div>
  );
}

function MobileSlide({ item, isActive }: { item: GalleryItem; isActive: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border shadow-cinema" style={{ borderColor: 'rgba(243,238,228,0.12)' }}>
      {item.media?.kind === 'video' ? (
        <ActiveSlideVideo active={isActive} src={item.media.url} poster={item.media.posterUrl} className="aspect-video w-full object-cover" />
      ) : (
        <img src={item.media?.url} alt={item.title} className="aspect-video w-full object-cover" loading="lazy" />
      )}
      <div className="p-3 sm:p-4">
        <h3 className="font-display text-base font-bold sm:text-lg">{item.title}</h3>
        {item.description ? <p className="mt-1 text-sm text-mist-muted">{item.description}</p> : null}
      </div>
    </div>
  );
}

function NavBtn({ children, onClick, 'aria-label': ariaLabel }: { children: React.ReactNode; onClick: () => void; 'aria-label': string }) {
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className="nav-pill">
      {children}
    </button>
  );
}
