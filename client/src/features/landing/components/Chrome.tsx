import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { BrandMark } from '@/components/ui/BrandMark';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { PublicContent } from '@/types/content';

export function Navbar({ content }: { content: PublicContent }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = (content.site?.navLinks ?? []).filter((l) => l.isActive !== false);
  const cta = content.site?.headerCta;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-all duration-500',
          scrolled ? 'border-line bg-ink/95 py-0 shadow-panel backdrop-blur-xl' : 'border-transparent bg-ink/60 py-0.5 backdrop-blur-md',
        )}
      >
        {content.site?.announcementBar?.isEnabled ? (
          <p className="bg-royal-700/90 py-1.5 text-center font-mono text-[0.65rem] uppercase tracking-[0.18em] text-paper">
            {content.site.announcementBar?.highlight ? (
              <span className="mr-2 text-ember-300">{content.site.announcementBar.highlight}</span>
            ) : null}
            {content.site.announcementBar?.text ?? ''}
          </p>
        ) : null}
        <div className="shell flex items-center justify-between py-3">
          <BrandMark linkToHome />
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative font-sans text-sm font-medium text-mist transition hover:text-paper after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-ember-400 after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
            {cta ? <ButtonLink to={cta.url}>{cta.label}</ButtonLink> : null}
          </nav>
          <button className="focus-ring rounded-md p-2 text-paper lg:hidden" aria-label="Menu" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="absolute inset-0 bg-ink/80 backdrop-blur-sm" aria-label="Close menu" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col border-l border-line bg-ink-800 p-6 shadow-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="flex items-center justify-between">
                <BrandMark linkToHome onNavigate={() => setOpen(false)} />
                <button className="focus-ring rounded-md p-2" aria-label="Close" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-10 flex flex-col gap-1">
                {links.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-3 font-display text-lg font-semibold text-paper hover:bg-ink-700"
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
              {cta ? (
                <ButtonLink to={cta.url} className="mt-auto w-full">
                  {cta.label} <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function Footer({ content }: { content: PublicContent }) {
  const footer = content.site?.footer;
  return (
    <footer className="relative border-t border-line py-section-sm">
      <div className="shell grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <BrandMark linkToHome />
          <p className="mt-4 max-w-sm text-base leading-relaxed text-mist">{footer?.description}</p>
        </div>
        {footer?.linkGroups?.map((group) => (
          <div key={group.title}>
            <p className="label-mono">{group.title}</p>
            <ul className="mt-4 space-y-2.5">
              {(group.links ?? []).map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-mist transition hover:text-paper hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="shell mt-12 text-xs text-mist-faint">{footer?.copyright}</p>
      {footer?.disclaimer ? <p className="shell mt-2 max-w-3xl text-xs leading-relaxed text-mist-faint">{footer.disclaimer}</p> : null}
    </footer>
  );
}

export function StickyCta({ content }: { content: PublicContent }) {
  const cta = content.site?.stickyMobileCta;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!cta?.isEnabled) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 p-3 backdrop-blur-xl md:hidden"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        >
          <ButtonLink to="/book" className="w-full">
            {cta.label}
            {cta.helperText ? <span className="font-sans text-xs font-medium opacity-80"> · {cta.helperText}</span> : null}
          </ButtonLink>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
