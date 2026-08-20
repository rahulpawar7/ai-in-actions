import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Menu, X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { BrandMark } from '@/components/ui/BrandMark';
import { AdminButton } from './AdminButton';
import { cn } from '@/lib/utils';

const NAV_GROUPS: { label: string; links: { to: string; label: string; end?: boolean }[] }[] = [
  {
    label: 'Overview',
    links: [{ to: '/admin', label: 'Dashboard', end: true }],
  },
  {
    label: 'Landing content',
    links: [
      { to: '/admin/hero', label: 'Hero' },
      { to: '/admin/site-settings', label: 'Site settings' },
      { to: '/admin/sections', label: 'Sections' },
      { to: '/admin/features', label: 'Features' },
    ],
  },
  {
    label: 'Workshop',
    links: [
      { to: '/admin/workshops', label: 'Workshops' },
      { to: '/admin/curriculum', label: 'Curriculum' },
      { to: '/admin/bonuses', label: 'Bonuses' },
    ],
  },
  {
    label: 'Social proof',
    links: [
      { to: '/admin/testimonials', label: 'Testimonials' },
      { to: '/admin/speakers', label: 'Speakers' },
      { to: '/admin/gallery', label: 'Gallery' },
      { to: '/admin/faqs', label: 'FAQ' },
      { to: '/admin/contacts', label: 'Contacts' },
    ],
  },
  {
    label: 'Operations',
    links: [
      { to: '/admin/registrations', label: 'Registrations' },
      { to: '/admin/payments', label: 'Payments' },
    ],
  },
  {
    label: 'Settings',
    links: [{ to: '/admin/seo', label: 'SEO' }],
  },
];

const ALL_LINKS = NAV_GROUPS.flatMap((g) => g.links);

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-4 last:mb-0">
          <p className="mb-1.5 px-3 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink/40">{group.label}</p>
          <div className="space-y-0.5">
            {group.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'block rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive ? 'bg-royal-600 text-white shadow-sm' : 'text-ink/70 hover:bg-white hover:text-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentLabel = ALL_LINKS.find((l) => (l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)))?.label ?? 'Studio';

  return (
    <div className="admin-shell min-h-screen text-ink">
      <aside className="admin-sidebar fixed inset-y-0 left-0 z-40 hidden w-60 overflow-y-auto border-r border-line-paper bg-paper-100 p-4 lg:block xl:w-64">
        <BrandMark linkToHome />
        <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink/45">CMS Studio</p>
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-preview-link mt-4 w-full justify-center text-xs">
          <ExternalLink className="h-3.5 w-3.5" /> View live site
        </a>
        <nav className="mt-5">{<NavItems />}</nav>
      </aside>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-[60] flex w-[min(100%,18rem)] flex-col border-r border-line-paper bg-paper-100 p-4 shadow-panel lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="flex items-center justify-between">
                <BrandMark linkToHome onNavigate={() => setMenuOpen(false)} />
                <button type="button" className="rounded-lg p-2 hover:bg-paper-300" aria-label="Close" onClick={() => setMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-6 flex-1 overflow-y-auto">{<NavItems onNavigate={() => setMenuOpen(false)} />}</nav>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="lg:ml-60 xl:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line-paper bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-line-paper bg-white p-2 lg:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate font-display text-base font-bold sm:text-lg">{currentLabel}</p>
              <p className="truncate font-mono text-[0.58rem] uppercase tracking-wider text-ink/45">{admin?.email}</p>
            </div>
          </div>
          <AdminButton
            variant="secondary"
            size="sm"
            className="shrink-0"
            onClick={async () => {
              await logout();
              navigate('/admin/login');
            }}
          >
            Sign out
          </AdminButton>
        </header>

        <main className="admin-main px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
