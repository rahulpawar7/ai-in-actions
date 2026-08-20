import { useRef, useState } from 'react';
import { Play, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MediaRef } from '@/types/content';

export function MediaFrame({
  media,
  title,
  className,
  aspect = 'video',
}: {
  media?: MediaRef;
  title?: string;
  className?: string;
  aspect?: 'video' | 'square';
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!media?.url) return null;

  const isVideo = media.kind === 'video';

  function togglePlay() {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      void videoRef.current.play();
      setPlaying(true);
    }
  }

  function enterFullscreen() {
    videoRef.current?.requestFullscreen?.();
  }

  return (
    <figure className={cn('group relative overflow-hidden rounded-2xl bg-ink-700', className)}>
      {isVideo ? (
        <>
          <video
            ref={videoRef}
            className={cn('w-full object-cover', aspect === 'video' ? 'aspect-video' : 'aspect-square')}
            poster={media.posterUrl}
            src={media.url}
            playsInline
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          {!playing ? (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 grid place-items-center bg-ink/40 transition hover:bg-ink/25"
              aria-label={`Play ${title ?? 'video'}`}
            >
              <span className="grid h-16 w-16 place-items-center rounded-full border border-line bg-ink/80 text-paper shadow-glow backdrop-blur transition group-hover:scale-105">
                <Play className="ml-1 h-6 w-6 fill-current" />
              </span>
            </button>
          ) : (
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                onClick={togglePlay}
                className="rounded-full border border-line bg-ink/80 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-paper backdrop-blur"
              >
                Pause
              </button>
              <button
                type="button"
                onClick={enterFullscreen}
                className="grid h-8 w-8 place-items-center rounded-full border border-line bg-ink/80 text-paper backdrop-blur"
                aria-label="Fullscreen"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <img
          src={media.url}
          alt={media.alt ?? title ?? ''}
          className={cn('w-full object-cover', aspect === 'video' ? 'aspect-video' : 'aspect-square')}
          loading="lazy"
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/40 to-transparent p-4">
        {title ? <figcaption className="font-display text-sm font-semibold text-paper">{title}</figcaption> : null}
      </div>
    </figure>
  );
}
