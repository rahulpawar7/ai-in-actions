import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, A11y, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { Reveal } from '@/components/motion/Reveal';
import { MediaFrame } from '@/components/media/MediaFrame';
import { bindSwiperAutoplay, useEnsureSwiperAutoplay } from '@/hooks/useEnsureSwiperAutoplay';
import { swiperAutoplay, swiperLoopExtras, swiperPagination } from '@/lib/swiperConfig';
import { cn } from '@/lib/utils';
import type { Testimonial } from '@/types/content';

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={cn('text-lg', i < rating ? 'text-gold-400' : 'text-mist-faint/40')}>★</span>
      ))}
    </div>
  );
}

export function TestimonialStage({ items }: { items: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [videoItem, setVideoItem] = useState<Testimonial | null>(null);

  useEnsureSwiperAutoplay(swiper);

  if (!items.length) return null;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
        {[0, 1].map((i) => (
          <motion.div
            key={`ghost-l-${i}`}
            className="absolute h-[420px] w-[min(320px,28vw)] rounded-3xl border opacity-20 lg:h-[480px] lg:w-[min(380px,30vw)]"
            style={{
              borderColor: 'rgba(243,238,228,0.08)',
              background: 'rgba(12,8,24,0.6)',
              transform: `translateX(${-120 - i * 40}px) rotate(${-4 - i * 2}deg) scale(${0.88 - i * 0.04})`,
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {[0, 1].map((i) => (
          <motion.div
            key={`ghost-r-${i}`}
            className="absolute h-[420px] w-[min(320px,28vw)] rounded-3xl border opacity-20 lg:h-[480px] lg:w-[min(380px,30vw)]"
            style={{
              borderColor: 'rgba(243,238,228,0.08)',
              background: 'rgba(12,8,24,0.6)',
              transform: `translateX(${120 + i * 40}px) rotate(${4 + i * 2}deg) scale(${0.88 - i * 0.04})`,
            }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4.5 + i, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <Reveal className="relative mx-auto max-w-4xl px-2 sm:px-0">
        <Swiper
          modules={[Autoplay, EffectFade, A11y, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          {...swiperLoopExtras(items.length)}
          autoplay={swiperAutoplay}
          pagination={swiperPagination}
          observer
          observeParents
          className="testimonial-swiper !overflow-visible !pb-12"
          onSwiper={(s) => {
            setSwiper(s);
            bindSwiperAutoplay(s);
          }}
          onSlideChange={(s) => setActive(s.realIndex)}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <article className="relative overflow-hidden rounded-2xl glass-surface p-6 shadow-glass sm:rounded-3xl sm:p-10 lg:p-14">
                <span className="quote-mark absolute -left-1 -top-3 select-none sm:-left-4 sm:-top-4" aria-hidden>"</span>
                <div className="relative">
                  <Stars rating={item.rating} />
                  {item.highlight ? (
                    <p className="mt-3 font-display text-base font-semibold text-ember-300 sm:mt-4 sm:text-lg">{item.highlight}</p>
                  ) : null}
                  <blockquote className="mt-4 font-display text-lg font-medium leading-snug text-paper sm:mt-6 sm:text-display-sm lg:text-display-md">
                    {item.quote}
                  </blockquote>
                  {item.resultMetric ? (
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-wider text-volt-300 sm:mt-6 sm:text-[0.62rem]" style={{ borderColor: 'rgba(147,197,253,0.25)' }}>
                      <span className="h-1.5 w-1.5 rounded-full bg-volt-400" />
                      {item.resultMetric}
                    </p>
                  ) : null}
                  <footer className="mt-8 flex flex-col gap-4 border-t pt-6 sm:mt-10 sm:flex-row sm:items-center sm:pt-8" style={{ borderColor: 'rgba(243,238,228,0.1)' }}>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-royal-sweep font-display text-base font-bold text-ink shadow-glow sm:h-14 sm:w-14 sm:rounded-2xl sm:text-lg">
                        {initials(item.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-lg font-bold sm:text-xl">{item.name}</p>
                        <p className="text-sm text-mist-muted">
                          {item.role}
                          {item.company ? ` · ${item.company}` : ''}
                        </p>
                      </div>
                    </div>
                    {item.video?.url ? (
                      <button
                        type="button"
                        onClick={() => setVideoItem(item)}
                        className="flex shrink-0 items-center justify-center gap-2 rounded-full border px-4 py-2 font-mono text-[0.58rem] uppercase tracking-wider transition hover:border-ember-400 sm:ml-auto sm:text-[0.6rem]"
                        style={{ borderColor: 'rgba(243,238,228,0.15)' }}
                      >
                        <Play className="h-3.5 w-3.5 fill-current" /> Video
                      </button>
                    ) : null}
                  </footer>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={`chip-${item.id}`}
              type="button"
              onClick={() => swiper?.slideToLoop(i)}
              className={cn(
                'rounded-full border px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-wider transition duration-300',
                i === active ? 'border-ember-400 bg-ember-500/15 text-ember-300' : 'border-transparent text-mist-faint hover:text-mist',
              )}
            >
              {item.name.split(' ')[0]}
            </button>
          ))}
        </div>
        <p className="mt-3 text-center font-mono text-[0.58rem] uppercase tracking-[0.2em] text-mist-faint">
          {String(active + 1).padStart(2, '0')} of {String(items.length).padStart(2, '0')} · Auto-advance
        </p>
      </Reveal>

      {videoItem?.video ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/90 p-4 backdrop-blur-md" role="dialog" aria-modal onClick={() => setVideoItem(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <MediaFrame media={videoItem.video} title={videoItem.name} />
            <button type="button" className="mt-4 w-full rounded-xl border py-3 font-mono text-xs uppercase tracking-wider text-mist" style={{ borderColor: 'rgba(243,238,228,0.12)' }} onClick={() => setVideoItem(null)}>
              Close
            </button>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}
