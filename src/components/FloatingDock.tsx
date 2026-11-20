import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Layers, Trophy, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { dockMarkerTransition } from '../lib/motion';
import { sfx, haptics } from '../lib/audio';

const ITEMS = [
  { to: '/', label: 'Arena', icon: Compass },
  { to: '/vault', label: 'Vault', icon: Layers },
  { to: '/ranks', label: 'Ranks', icon: Trophy },
  { to: '/identity', label: 'Identity', icon: User },
];

/**
 * Floating detached dock (brief §5.5).
 *
 * Porcelain shell, dark active chip — the same light-object-on-field language
 * as the identity capsule. Every screen reserves bottom padding so the dock
 * never covers content.
 */
export function FloatingDock() {
  const location = useLocation();

  const activeIndex = (() => {
    const path = location.pathname;
    if (path.startsWith('/vault')) return 1;
    if (path.startsWith('/ranks')) return 2;
    if (path.startsWith('/identity') || path.startsWith('/locker')) return 3;
    return 0;
  })();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[calc(var(--safe-b)+14px)]">
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.15 }}
        aria-label="Primary"
        className="pointer-events-auto flex items-center gap-0.5 rounded-full bg-porcelain/96 p-1.5 shadow-float-lg backdrop-blur-xl"
      >
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          const active = activeIndex === i;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => {
                sfx.play('tap');
                haptics.fire('light');
              }}
              className={cn(
                'press relative flex h-12 items-center gap-2 rounded-full px-3.5 transition-colors sm:px-4',
                active ? 'text-porcelain' : 'text-ink-faint hover:text-ink-soft',
              )}
            >
              {active && (
                <motion.span
                  layoutId="dock-active"
                  transition={dockMarkerTransition}
                  className="absolute inset-0 rounded-full bg-ink-dark shadow-inner-dark"
                  aria-hidden
                />
              )}
              <Icon
                className="relative h-[19px] w-[19px]"
                strokeWidth={active ? 2.2 : 1.9}
              />
              <span
                className={cn(
                  'relative text-[13px] font-medium tracking-[-0.01em]',
                  active ? 'block' : 'hidden',
                )}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </motion.nav>
    </div>
  );
}
