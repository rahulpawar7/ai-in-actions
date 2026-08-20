import { useEffect, useRef, type VideoHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ActiveSlideVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> & {
  active: boolean;
  src: string;
  poster?: string;
};

/** Plays muted video when slide is active; pauses and resets when inactive. */
export function ActiveSlideVideo({ active, src, poster, className, muted = true, loop = true, ...props }: ActiveSlideVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (active) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [active, src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className={cn(className)}
      muted={muted}
      loop={loop}
      playsInline
      preload={active ? 'metadata' : 'none'}
      {...props}
    />
  );
}
