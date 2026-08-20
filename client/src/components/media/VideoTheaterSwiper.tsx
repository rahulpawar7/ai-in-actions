import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation, A11y, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Play, Pause } from 'lucide-react';
import { ActiveSlideVideo } from '@/components/media/ActiveSlideVideo';
import { Reveal } from '@/components/motion/Reveal';
import { bindSwiperAutoplay, useEnsureSwiperAutoplay } from '@/hooks/useEnsureSwiperAutoplay';
import { swiperAutoplay, swiperLoopExtras } from '@/lib/swiperConfig';
import type { GalleryItem } from '@/types/content';

export function VideoTheaterSwiper({ items, eyebrow }: { items: GalleryItem[]; eyebrow?: string }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [active, setActive] = useState(0);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEnsureSwiperAutoplay(thumbsSwiper);

  const current = items[active];
  const isVideo = current?.media?.kind === 'video';

  useEffect(() => {
    thumbsSwiper?.slideToLoop(active);
  }, [active, thumbsSwiper]);

  useEffect(() => {
    const video = mainVideoRef.current;
    if (!video || !isVideo) return;
    void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [current?.id, isVideo]);

  if (!items.length) return null;

  function togglePlay() {
    if (!mainVideoRef.current) return;
    if (playing) {
      mainVideoRef.current.pause();
      setPlaying(false);
    } else {
      void mainVideoRef.current.play();
      setPlaying(true);
    }
  }

  return (
    <Reveal>
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <div className="grid gap-4 lg:grid-cols-[1fr_0.32fr]">
        <div className="group relative overflow-hidden rounded-2xl border border-line bg-ink-800 shadow-glow">
          {isVideo ? (
            <>
              <video
                ref={mainVideoRef}
                key={current.id}
                className="aspect-video w-full object-cover lg:aspect-[16/10]"
                src={current.media.url}
                poster={current.media.posterUrl}
                muted
                loop
                playsInline
                preload="metadata"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
              <button
                type="button"
                onClick={togglePlay}
                className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-line bg-ink/80 px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-wider text-paper backdrop-blur transition hover:border-ember-400 sm:bottom-4 sm:left-4 sm:px-4 sm:py-2 sm:text-[0.62rem]"
              >
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                {playing ? 'Pause' : 'Play'}
              </button>
            </>
          ) : (
            <img src={current.media?.url} alt={current.media?.alt ?? current.title} className="aspect-video w-full object-cover lg:aspect-[16/10]" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/60 to-transparent p-4 sm:p-6">
            <p className="font-display text-lg font-bold sm:text-2xl">{current.title}</p>
            {current.description ? <p className="mt-1 max-w-xl text-sm text-mist">{current.description}</p> : null}
          </div>
        </div>

        <Swiper
          modules={[Thumbs, Navigation, A11y, Autoplay]}
          onSwiper={(s) => {
            setThumbsSwiper(s);
            bindSwiperAutoplay(s);
          }}
          spaceBetween={10}
          slidesPerView={2.2}
          {...swiperLoopExtras(items.length)}
          autoplay={swiperAutoplay}
          observer
          observeParents
          breakpoints={{ 640: { slidesPerView: 3 }, 1024: { direction: 'vertical', slidesPerView: 4 } }}
          className="!h-auto lg:!h-[min(420px,50vw)]"
          watchSlidesProgress
          onSlideChange={(s) => setActive(s.realIndex)}
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.id} className="!h-auto">
              <button
                type="button"
                onClick={() => {
                  setActive(index);
                  thumbsSwiper?.slideToLoop(index);
                }}
                className={`relative w-full overflow-hidden rounded-xl border transition duration-300 ${
                  active === index ? 'border-ember-400 ring-2 ring-ember-400/30' : 'border-line opacity-70 hover:opacity-100'
                }`}
              >
                {item.media?.kind === 'video' ? (
                  <ActiveSlideVideo active={active === index} src={item.media.url} poster={item.media.posterUrl} className="aspect-video w-full object-cover lg:aspect-[4/3]" />
                ) : (
                  <img src={item.media?.url} alt="" className="aspect-video w-full object-cover lg:aspect-[4/3]" loading="lazy" />
                )}
                <span className="absolute inset-0 bg-ink/20" />
                <Play className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 fill-paper text-paper opacity-80" />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <p className="mt-3 text-center font-mono text-[0.62rem] uppercase tracking-[0.2em] text-mist-muted">
        {active + 1} / {items.length} · Auto-advance
      </p>
    </Reveal>
  );
}
