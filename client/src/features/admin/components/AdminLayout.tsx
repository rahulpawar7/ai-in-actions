import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const LINKS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/hero', label: 'Hero' },
  { to: '/admin/site-settings', label: 'Site' },
  { to: '/admin/workshops', label: 'Workshops' },
  { to: '/admin/curriculum', label: 'Curriculum' },
  { to: '/admin/sections', label: 'Sections' },
  { to: '/admin/features', label: 'Features' },
  { to: '/admin/bonuses', label: 'Bonuses' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/faqs', label: 'FAQ' },
  { to: '/admin/speakers', label: 'Speakers' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/contacts', label: 'Contacts' },
  { to: '/admin/registrations', label: 'Registrations' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/seo', label: 'SEO' },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'block rounded-lg px-3 py-2.5 text-sm font-medium transition',
              isActive ? 'bg-ink text-paper shadow-sm' : 'text-ink/70 hover:bg-paper-300 hover:text-ink',
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );
}

export function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentLabel = LINKS.find((l) => (l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)))?.label ?? 'Studio';

  return (
    <div className="admin-shell min-h-screen bg-paper text-ink">
      {/* Desktop sidebar */}
      <aside className="admin-sidebar fixed inset-y-0 left-0 z-40 hidden w-60 overflow-y-auto border-r border-line-paper bg-paper-100 p-4 lg:block xl:w-64">
        <BrandMark linkToHome />
        <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ink/45">CMS Studio</p>
        <nav className="mt-6 space-y-0.5">
          <NavItems />
        </nav>
      </aside>

      {/* Mobile drawer */}
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
              <nav className="mt-6 flex-1 space-y-0.5 overflow-y-auto">
                <NavItems onNavigate={() => setMenuOpen(false)} />
              </nav>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="lg:ml-60 xl:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line-paper bg-paper/95 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-line-paper p-2 lg:hidden"
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
          <Button
            variant="secondary"
            className="shrink-0 !px-3 !py-2 !text-xs sm:!px-4 sm:!text-sm !text-ink"
            onClick={async () => {
              await logout();
              navigate('/admin/login');
            }}
          >
            Sign out
          </Button>
        </header>

        <main className="admin-main px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
