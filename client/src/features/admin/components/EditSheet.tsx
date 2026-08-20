import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { AdminButton } from './AdminButton';

export function EditSheet({
  open,
  title,
  subtitle,
  onClose,
  onSave,
  saving,
  readOnly,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSave?: () => void;
  saving?: boolean;
  readOnly?: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close editor"
            className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-sheet-title"
            className="admin-edit-sheet fixed inset-x-0 bottom-0 z-[60] flex max-h-[92vh] flex-col rounded-t-2xl border border-line-paper bg-paper shadow-2xl sm:inset-x-auto sm:bottom-0 sm:right-0 sm:top-0 sm:max-h-none sm:w-full sm:max-w-2xl sm:rounded-none sm:rounded-l-2xl lg:max-w-3xl"
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line-paper bg-white px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 id="edit-sheet-title" className="font-display text-lg font-bold text-ink sm:text-xl">
                  {title}
                </h2>
                {subtitle ? <p className="mt-0.5 text-sm text-ink/50">{subtitle}</p> : null}
              </div>
              <AdminButton variant="ghost" size="sm" className="!p-2" aria-label="Close" onClick={onClose}>
                <X className="h-5 w-5" />
              </AdminButton>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">{children}</div>

            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-line-paper bg-white px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
              <AdminButton variant="secondary" size="md" className="w-full sm:w-auto" onClick={onClose}>
                {readOnly ? 'Close' : 'Cancel'}
              </AdminButton>
              {!readOnly && onSave ? (
                <AdminButton size="md" className="w-full sm:w-auto" disabled={saving} onClick={onSave}>
                  {saving ? 'Saving…' : 'Save changes'}
                </AdminButton>
              ) : null}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function StickySaveBar({
  dirty,
  saving,
  onSave,
  onDiscard,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard?: () => void;
}) {
  if (!dirty) return null;

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line-paper bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:px-6"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/70">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-400" />
          Unsaved changes — save to update the live site
        </p>
        <div className="flex gap-2">
          {onDiscard ? (
            <AdminButton variant="ghost" size="sm" onClick={onDiscard}>
              Discard
            </AdminButton>
          ) : null}
          <AdminButton size="sm" disabled={saving} onClick={onSave}>
            {saving ? 'Saving…' : 'Save changes'}
          </AdminButton>
        </div>
      </div>
    </motion.div>
  );
}
