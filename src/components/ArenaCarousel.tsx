import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Domain } from '../lib/domains';
import { fieldFor } from '../lib/field';
import { HeroStage } from './HeroStage';
import { toObjectKind } from './ObjectGlyph';
import { Porcelain, PorcelainChip } from './Porcelain';
import { cn } from '../lib/utils';
import { sfx, haptics } from '../lib/audio';
import { EASE } from '../lib/motion';

interface ArenaCarouselProps {
  arenas: Domain[];
  index: number;
  onChange: (index: number) => void;
  onOpenArena?: (arena: Domain) => void;
}

const CARD_W = 262;
const GAP = 14;
const STEP = CARD_W + GAP;
const CARD_H = 400;

/**
 * Signature home element.
 *
 * One porcelain card is centred and dominant; neighbours peek at the edges,
 * scaled down and dimmed. The 3D hero object is *larger than its card* and
 * breaks out of the top edge, so the object — not the frame — is the subject.
 * Drag follows the finger, release snaps with a firm spring.
 */
export function ArenaCarousel({
  arenas,
  index,
  onChange,
  onOpenArena,
}: ArenaCarouselProps) {
  const [dragging, setDragging] = useState(false);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.85 });

  const clampIndex = useCallback(
    (i: number) => Math.max(0, Math.min(arenas.length - 1, i)),
    [arenas.length],
  );

  useEffect(() => {
    x.set(-index * STEP);
  }, [index, x]);

  const go = useCallback(
    (next: number) => {
      const clamped = clampIndex(next);
      if (clamped === index) return;
      sfx.play('tap');
      haptics.fire('light');
      onChange(clamped);
    },
    [clampIndex, index, onChange],
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      setDragging(false);
      const projected = info.offset.x + info.velocity.x * 0.16;
      let next = index;
      if (projected < -STEP * 0.28) next = index + 1;
      else if (projected > STEP * 0.28) next = index - 1;
      go(next);
      x.set(-clampIndex(next) * STEP);
    },
    [clampIndex, go, index, x],
  );

  const active = arenas[index];
  const activePalette = useMemo(() => fieldFor(active.id), [active.id]);

  return (
    <div className="relative">
      <div
        className="mask-fade-x relative -mx-4 overflow-hidden sm:-mx-6"
        style={{ paddingTop: 34 }}
      >
        <motion.div
          className={cn('flex items-start gap-[14px] px-[calc(50%-131px)]', !dragging && 'cursor-grab')}
          style={{ x: springX }}
          drag="x"
          dragConstraints={{ left: -(arenas.length - 1) * STEP, right: 0 }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
        >
          {arenas.map((arena, i) => {
            const isActive = i === index;
            const distance = Math.abs(i - index);
            const palette = fieldFor(arena.id);

            return (
              <motion.div
                key={arena.id}
                animate={{
                  scale: isActive ? 1 : 0.9,
                  opacity: distance > 1 ? 0.45 : distance === 1 ? 0.78 : 1,
                  y: isActive ? 0 : 16,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative shrink-0"
                style={{ width: CARD_W, height: CARD_H }}
              >
                <button
                  onClick={() => {
                    if (isActive) onOpenArena?.(arena);
                    else go(i);
                  }}
                  className="group relative block h-full w-full text-left"
                  aria-label={`${arena.arena}${isActive ? ', selected' : ''}`}
                  aria-pressed={isActive}
                >
                  {/* Porcelain card body */}
                  <Porcelain
                    radius="rounded-[30px]"
                    className={cn(
                      'h-full w-full transition-shadow duration-500',
                      isActive ? 'shadow-float-lg' : 'shadow-float',
                    )}
                  >
                    <div className="flex h-full flex-col">
                      {/* header */}
                      <div className="flex items-start justify-between px-5 pt-5">
                        <div className="min-w-0">
                          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
                            {arena.short}
                          </p>
                          <p className="mt-1 font-display text-[15.5px] font-semibold leading-tight tracking-[-0.02em] text-ink-dark">
                            {arena.arena}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="tnum font-mono text-[13px] font-medium text-ink-dark">
                            {arena.rating}
                          </p>
                          <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-faint">
                            {arena.provisional ? 'prov' : 'rating'}
                          </p>
                        </div>
                      </div>

                      {/* 3D object — deliberately oversized, breaks the frame */}
                      <div className="relative -mt-1 flex-1">
                        <div className="absolute inset-x-[-16%] -top-[26%] bottom-[-6%]">
                          <HeroStage
                            kind={toObjectKind(arena.id)}
                            accent={arena.accent}
                            intensity={isActive ? 'hero' : 'card'}
                            zoom={isActive ? 2.85 : 3.15}
                            offsetY={-0.04}
                            className="h-full w-full"
                            label={`${arena.arena} 3D object`}
                          />
                        </div>
                      </div>

                      {/* footer */}
                      <div className="relative z-10 px-5 pb-5">
                        <p className="line-clamp-2 text-[12px] leading-snug text-ink-soft">
                          {arena.tagline}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <PorcelainChip>
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: palette.bright }}
                            />
                            {arena.playersLabel}
                          </PorcelainChip>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 text-[11.5px] font-semibold transition-opacity',
                              isActive
                                ? 'text-ink-dark opacity-100'
                                : 'text-ink-faint opacity-0 group-hover:opacity-100',
                            )}
                          >
                            {isActive ? 'Enter' : 'Select'}
                            <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Porcelain>

                  {/* active ring — drawn outside so it never clips the object */}
                  {isActive && (
                    <motion.span
                      layoutId="carousel-active-ring"
                      transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                      className="pointer-events-none absolute inset-0 rounded-[30px] ring-2"
                      style={{ boxShadow: `0 0 0 2px ${activePalette.bright}66` }}
                      aria-hidden
                    />
                  )}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* pagination */}
      <div className="mt-5 flex items-center justify-center gap-1.5">
        {arenas.map((a, i) => (
          <button
            key={a.id}
            onClick={() => go(i)}
            aria-label={`Go to ${a.arena}`}
            className="group flex h-6 items-center px-0.5"
          >
            <span
              className={cn(
                'block rounded-full transition-all duration-300',
                i === index ? 'h-1.5 w-6' : 'h-1.5 w-1.5',
              )}
              style={{
                background:
                  i === index
                    ? activePalette.ink
                    : `${activePalette.ink}44`,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
