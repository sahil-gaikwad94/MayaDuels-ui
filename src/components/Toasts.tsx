import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, X, AlertTriangle } from 'lucide-react';
import { useAppState } from '../state/AppState';
import { cn } from '../lib/utils';

export function Toasts() {
  const { toasts, dismissToast } = useAppState();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(var(--safe-t)+12px)] z-[60] flex flex-col items-center gap-2 px-4">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon =
            t.tone === 'success'
              ? Check
              : t.tone === 'error'
                ? AlertTriangle
                : t.tone === 'accent'
                  ? Info
                  : Info;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className={cn(
                'glass pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-2xl px-3.5 py-3 shadow-dock',
                t.tone === 'success' && 'border-cyan-line/50',
                t.tone === 'error' && 'border-error/40',
              )}
              role="status"
            >
              <span
                className={cn(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                  t.tone === 'success' && 'bg-cyan/15 text-cyan',
                  t.tone === 'error' && 'bg-error/15 text-error',
                  (!t.tone || t.tone === 'default' || t.tone === 'accent') &&
                    'bg-white/8 text-muted',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium leading-snug text-ink">
                  {t.title}
                </p>
                {t.message && (
                  <p className="mt-0.5 text-[11.5px] leading-snug text-faint">
                    {t.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismissToast(t.id)}
                aria-label="Dismiss"
                className="press -mr-1 flex h-7 w-7 items-center justify-center rounded-full text-faint hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/** Scrolls to top on route change — keeps single-column mobile flow predictable. */
export function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}