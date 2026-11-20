import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, Settings, ShieldCheck } from 'lucide-react';
import { useAppState } from '../state/AppState';
import { divisionFor } from '../lib/domains';
import { cn, formatNumber } from '../lib/utils';
import { dockMarkerTransition, springSoft } from '../lib/motion';
import { AvatarToken } from './AvatarToken';

/**
 * Floating identity capsule (brief §5.1).
 *
 * `tone="onField"` renders the light porcelain variant used when the capsule
 * sits directly on a saturated arena field — the reference's signature move:
 * a bright, tactile object floating over a coloured atmosphere.
 */
export function IdentityCapsule({
  compactOnScroll = true,
  tone = 'default',
}: {
  compactOnScroll?: boolean;
  tone?: 'default' | 'onField';
}) {
  const { profile, matchesPlayed, selectedDomain } = useAppState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const division = divisionFor(1482);
  const provisional = matchesPlayed < 8;
  const onField = tone === 'onField';

  return (
    <div className="relative z-30">
      <motion.div
        layout
        transition={springSoft}
        className={cn(
          'flex items-center gap-1 rounded-full pl-1.5 pr-1.5',
          onField
            ? 'bg-porcelain/95 shadow-float backdrop-blur-xl'
            : 'glass shadow-capsule',
        )}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Open identity menu"
          className="press flex min-w-0 flex-1 items-center gap-2.5 rounded-full py-1.5 pl-0.5 pr-2 text-left"
        >
          <AvatarToken seed={profile.avatarSeed} size={38} ring={division.color} />
          <span className="min-w-0">
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  'truncate text-[13.5px] font-semibold leading-tight',
                  onField ? 'text-ink-dark' : 'text-ink',
                )}
              >
                {profile.handle}
              </span>
              {provisional && (
                <span className="rounded-full bg-amber/20 px-1.5 py-[1px] font-mono text-[9px] uppercase tracking-wider text-amber">
                  prov
                </span>
              )}
            </span>
            <span
              className={cn(
                'mt-0.5 flex items-center gap-1.5 text-[11px] leading-none',
                onField ? 'text-ink-faint' : 'text-faint',
              )}
            >
              <span
                className={cn(
                  'tnum font-mono text-[10.5px]',
                  onField ? 'text-ink-soft' : 'text-muted',
                )}
              >
                {formatNumber(1482)}
              </span>
              <span
                className={cn(
                  'h-1 w-1 rounded-full',
                  onField ? 'bg-ink-faint/50' : 'bg-faint/60',
                )}
              />
              <span className="truncate">{division.name}</span>
            </span>
          </span>
          <ChevronDown
            className={cn(
              'ml-auto h-4 w-4 shrink-0 transition-transform duration-300',
              onField ? 'text-ink-faint' : 'text-faint',
              open && 'rotate-180',
            )}
          />
        </button>

        <button
          onClick={() => navigate('/settings')}
          aria-label="Settings"
          className={cn(
            'press hidden h-9 w-9 items-center justify-center rounded-full sm:flex',
            onField
              ? 'text-ink-soft hover:bg-ink-dark/8'
              : 'text-muted hover:bg-white/5 hover:text-ink',
          )}
        >
          <Settings className="h-[17px] w-[17px]" />
        </button>
        <button
          onClick={() => navigate('/identity')}
          aria-label="Profile"
          className={cn(
            'press flex h-9 w-9 items-center justify-center rounded-full',
            onField
              ? 'bg-ink-dark text-porcelain'
              : 'text-muted hover:bg-white/5 hover:text-ink',
          )}
        >
          <ShieldCheck className="h-[17px] w-[17px]" />
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-30 cursor-default"
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="glass absolute left-0 right-0 top-[calc(100%+10px)] z-40 overflow-hidden rounded-3xl p-2 shadow-dock"
            >
              <div className="flex items-center gap-3 rounded-2xl px-3 py-3">
                <AvatarToken seed={profile.avatarSeed} size={44} ring={division.color} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{profile.handle}</p>
                  <p className="truncate text-xs text-faint">{profile.title}</p>
                </div>
              </div>
              <div className="my-1 h-px bg-line" />
              {[
                { label: 'Identity', to: '/identity' },
                { label: 'Match history', to: '/history' },
                { label: 'Locker', to: '/locker' },
                { label: 'Settings', to: '/settings' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm text-muted transition-colors',
                    'hover:bg-white/5 hover:text-ink',
                    location.pathname === item.to && 'bg-white/5 text-ink',
                  )}
                >
                  {item.label}
                  <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                    {selectedDomain === 'OMNI' ? 'omni' : selectedDomain.toLowerCase()}
                  </span>
                </Link>
              ))}
              <div className="my-1 h-px bg-line" />
              <div className="flex items-center gap-2 px-3 py-2.5 text-[11px] text-faint">
                <Bell className="h-3.5 w-3.5" />
                Notifications are quiet in this demo build
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DockMarker({ active }: { active: boolean }) {
  return (
    <motion.span
      layoutId="dock-marker"
      transition={dockMarkerTransition}
      className={cn(
        'absolute inset-x-1.5 inset-y-1 rounded-full',
        active ? 'bg-cyan/12' : 'bg-transparent',
      )}
      aria-hidden
    />
  );
}
