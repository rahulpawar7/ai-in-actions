import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, EffectFade, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Quote, Star, Play } from 'lucide-react';
import { Reveal, Stagger, StaggerChild } from '@/components/motion/Reveal';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { Marquee } from '@/components/motion/Marquee';
import { MediaFrame } from '@/components/media/MediaFrame';
import { bindSwiperAutoplay, useEnsureSwiperAutoplay } from '@/hooks/useEnsureSwiperAutoplay';
import { cn } from '@/lib/utils';
import { swiperAutoplay, swiperLoopExtras, swiperPagination } from '@/lib/swiperConfig';
import type { Testimonial } from '@/types/content';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn('h-3.5 w-3.5', i < rating ? 'fill-gold-400 text-gold-400' : 'text-mist-faint')} />
      ))}
    </div>
  );
}

function TestimonialCard({
  item,
  featured,
  onVideo,
}: {
  item: Testimonial;
  featured?: boolean;
  onVideo?: () => void;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <Quote className="h-8 w-8 shrink-0 text-royal-400/60" aria-hidden />
        <Stars rating={item.rating} />
      </div>
      {item.highlight ? (
        <p className="mt-4 font-display text-base font-semibold text-ember-300">{item.highlight}</p>
      ) : null}
      <blockquote className="mt-3 text-base leading-relaxed text-mist sm:text-lg">"{item.quote}"</blockquote>
      {item.resultMetric ? (
        <p className="mt-4 inline-block rounded-full border border-line px-3 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-volt-300">
          {item.resultMetric}
        </p>
      ) : null}
      <footer className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
        <div>
          <p className="font-display font-bold text-paper">{item.name}</p>
          <p className="text-sm text-mist-muted">
            {item.role}
            {item.company ? ` · ${item.company}` : ''}
          </p>
        </div>
        {item.video?.url ? (
          <button
            type="button"
            onClick={onVideo}
            className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-paper transition hover:border-ember-400"
          >
            <Play className="h-3 w-3 fill-current" /> Watch
          </button>
        ) : null}
      </footer>
    </>
  );

  if (featured) {
    return (
      <InteractiveCard glow="ember" featured className="h-full p-6 sm:p-8">
        {inner}
      </InteractiveCard>
    );
  }

  return <div className="surface-card h-full p-5 sm:p-6">{inner}</div>;
}

export function TestimonialExperience({ items }: { items: Testimonial[] }) {
  const [videoItem, setVideoItem] = useState<Testimonial | null>(null);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  useEnsureSwiperAutoplay(swiper);

  if (!items.length) return null;

  const featured = items.filter((t) => t.isFeatured).slice(0, 3);
  const featuredDisplay = featured.length > 0 ? featured : items.slice(0, 3);
  const featuredIds = new Set(featuredDisplay.map((t) => t.id));
  const rest = items.filter((t) => !featuredIds.has(t.id));
  const sliderItems = featuredDisplay.length ? featuredDisplay : items.slice(0, 5);

  return (
    <>
      {featuredDisplay.length > 0 ? (
        <Stagger className="mb-10 grid gap-4 md:grid-cols-3">
          {featuredDisplay.map((item) => (
            <StaggerChild key={item.id}>
              <TestimonialCard item={item} featured onVideo={() => setVideoItem(item)} />
            </StaggerChild>
          ))}
        </Stagger>
      ) : null}

      <Reveal>
        <Swiper
          modules={[Navigation, Pagination, A11y, EffectFade, Autoplay]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          {...swiperLoopExtras(sliderItems.length)}
          autoplay={swiperAutoplay}
          navigation
          pagination={swiperPagination}
          observer
          observeParents
          className="testimonial-swiper !pb-12"
          onSwiper={(s) => {
            setSwiper(s);
            bindSwiperAutoplay(s);
          }}
        >
          {sliderItems.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="mx-auto max-w-3xl px-2 text-center">
                <Stars rating={item.rating} />
                <blockquote className="mt-6 font-display text-display-xs font-semibold leading-snug text-paper sm:text-display-sm">
                  "{item.quote}"
                </blockquote>
                <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-mist-muted">
                  {item.name}
                  {item.company ? ` · ${item.company}` : ''}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Reveal>

      {rest.length > 0 ? (
        <div className="mt-10 space-y-4">
          <Marquee duration={52} pauseOnHover>
            {rest.map((item) => (
              <div key={item.id} className="w-[20rem] shrink-0 px-2 sm:w-[24rem]">
                <TestimonialCard item={item} />
              </div>
            ))}
          </Marquee>
          <Marquee duration={58} reverse pauseOnHover>
            {rest.slice().reverse().map((item) => (
              <div key={`${item.id}-rev`} className="w-[20rem] shrink-0 px-2 sm:w-[24rem]">
                <TestimonialCard item={item} />
              </div>
            ))}
          </Marquee>
        </div>
      ) : null}

      {videoItem?.video ? (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-ink/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal
          onClick={() => setVideoItem(null)}
        >
          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <MediaFrame media={videoItem.video} title={videoItem.name} />
            <button
              type="button"
              className="mt-4 w-full rounded-md border border-line py-2 font-mono text-xs uppercase tracking-wider text-mist"
              onClick={() => setVideoItem(null)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
