import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE_EXPO } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function KineticHeadline({
  lines,
  className,
  accentClassName = 'text-gradient-animated',
  as: Tag = 'h1',
}: {
  lines: { text: string; accent?: boolean }[][];
  className?: string;
  accentClassName?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <Tag className={cn('font-display font-bold', className)}>
        {lines.map((row, rowIndex) => (
          <span key={rowIndex} className={rowIndex > 0 ? 'mt-1 block' : 'block'}>
            {row.map((part, partIndex) => (
              <span key={partIndex} className={part.accent ? accentClassName : undefined}>
                {part.text}
                {partIndex < row.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        ))}
      </Tag>
    );
  }

  let delay = 0;

  return (
    <Tag className={cn('font-display font-bold', className)} aria-label={lines.flat().map((p) => p.text).join(' ')}>
      {lines.map((row, rowIndex) => (
        <span key={rowIndex} className={cn('block', rowIndex > 0 && 'mt-1')}>
          {row.map((part, partIndex) => {
            const words = part.text.split(' ');
            return (
              <span key={partIndex} className={part.accent ? accentClassName : undefined}>
                {words.map((word, wordIndex) => {
                  const currentDelay = delay;
                  delay += 0.07;
                  return (
                    <span key={wordIndex} className="inline-block align-top">
                      <motion.span
                        className="inline-block"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: currentDelay, ease: EASE_EXPO }}
                      >
                        {word}
                        {wordIndex < words.length - 1 ? '\u00A0' : ''}
                      </motion.span>
                    </span>
                  );
                })}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
