import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, EffectCoverflow, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { Play } from 'lucide-react';
import { ActiveSlideVideo } from '@/components/media/ActiveSlideVideo';
import { Reveal } from '@/components/motion/Reveal';
import { bindSwiperAutoplay, useEnsureSwiperAutoplay } from '@/hooks/useEnsureSwiperAutoplay';
import { swiperAutoplay, swiperLoopExtras, swiperPagination } from '@/lib/swiperConfig';
import { cn } from '@/lib/utils';
import type { GalleryItem } from '@/types/content';

function SlideMedia({ item, active }: { item: GalleryItem; active: boolean }) {
  const isVideo = item.media?.kind === 'video';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-800 shadow-panel">
      {isVideo ? (
        <ActiveSlideVideo active={active} src={item.media.url} poster={item.media.posterUrl} className="aspect-video w-full object-cover" />
      ) : (
        <img src={item.media?.url} alt={item.media?.alt ?? item.title} className="aspect-video w-full object-cover" loading="lazy" />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/50 to-transparent p-4 sm:p-6">
        <p className="label-mono text-ember-300">{item.category}</p>
        <p className="mt-1 font-display text-base font-bold text-paper sm:text-xl">{item.title}</p>
        {item.description ? <p className="mt-1 text-sm text-mist">{item.description}</p> : null}
      </div>
      {isVideo ? (
        <div className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-line bg-ink/70 backdrop-blur sm:right-4 sm:top-4 sm:h-10 sm:w-10">
          <Play className="h-4 w-4 fill-paper text-paper" />
        </div>
      ) : null}
    </div>
  );
}

export function VideoCoverflowSwiper({
  items,
  title,
  subtitle,
  className,
}: {
  items: GalleryItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  useEnsureSwiperAutoplay(swiper);

  if (!items.length) return null;

  return (
    <Reveal className={className}>
      {(title || subtitle) && (
        <header className="mb-6 text-center sm:mb-8">
          {subtitle ? <p className="eyebrow">{subtitle}</p> : null}
          {title ? <h3 className="mt-2 font-display text-display-xs font-bold sm:text-display-sm">{title}</h3> : null}
        </header>
      )}
      <Swiper
        modules={[Navigation, Pagination, A11y, EffectCoverflow, Autoplay]}
        effect="coverflow"
        grabCursor
        centeredSlides
        {...swiperLoopExtras(items.length)}
        slidesPerView={1.1}
        spaceBetween={16}
        coverflowEffect={{ rotate: 0, stretch: 0, depth: 140, modifier: 1.3, slideShadows: false }}
        autoplay={swiperAutoplay}
        pagination={swiperPagination}
        navigation
        observer
        observeParents
        breakpoints={{
          640: { slidesPerView: 1.25, spaceBetween: 20 },
          1024: { slidesPerView: 1.55, spaceBetween: 24 },
        }}
        className="media-swiper !pb-14"
        onSwiper={(s) => {
          setSwiper(s);
          bindSwiperAutoplay(s);
        }}
        onSlideChange={(s: SwiperType) => setActiveIndex(s.realIndex)}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            {({ isActive }) => (
              <div className={cn('transition duration-500', isActive ? 'scale-100 opacity-100' : 'scale-[0.92] opacity-60')}>
                <SlideMedia item={item} active={isActive} />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <p className="mt-2 text-center font-mono text-[0.62rem] uppercase tracking-[0.2em] text-mist-muted">
        {activeIndex + 1} / {items.length} · Auto-advance
      </p>
    </Reveal>
  );
}
