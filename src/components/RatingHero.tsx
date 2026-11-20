import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { Domain } from '../lib/domains';
import { divisionFor, nextDivision } from '../lib/domains';
import type { FieldPalette } from '../lib/field';
import { cn, formatNumber } from '../lib/utils';
import { Sparkline } from './Charts';
import { EASE } from '../lib/motion';

/**
 * The hero metric. Reference-inspired: a very large numeral sitting directly
 * on the field, with the supporting telemetry in small caps around it.
 * The numeral is the loudest thing on the screen — that is deliberate.
 */
export function RatingHero({
  arena,
  palette,
  delta,
  provisional,
  className,
}: {
  arena: Domain;
  palette: FieldPalette;
  delta: number;
  provisional: boolean;
  className?: string;
}) {
  const division = divisionFor(arena.rating);
  const next = nextDivision(arena.rating);
  const toNext = next ? next.min - arena.rating : 0;
  const span = next ? next.min - division.min : 1;
  const progress = next
    ? Math.min(100, Math.max(0, ((arena.rating - division.min) / span) * 100))
    : 100;

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: palette.ink, opacity: 0.72 }}
            >
              {arena.short} rating
            </span>
            {provisional && (
              <span
                className="rounded-full px-1.5 py-[1px] font-mono text-[8.5px] uppercase tracking-[0.14em]"
                style={{
                  background: 'rgba(255,184,0,0.22)',
                  color: '#FFE0A3',
                }}
              >
                provisional
              </span>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE.out }}
            className="mt-1 flex items-end gap-3"
          >
            <span
              className="tnum font-display text-[4.15rem] font-semibold leading-[0.78] tracking-[-0.045em] sm:text-[4.6rem]"
              style={{
                color: palette.ink,
                textShadow: `0 12px 40px ${palette.glow}`,
              }}
            >
              {formatNumber(arena.rating)}
            </span>
            <span
              className="mb-2 inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11px] font-semibold"
              style={{
                background: 'rgba(255,255,255,0.16)',
                color: palette.ink,
                backdropFilter: 'blur(8px)',
              }}
            >
              {delta >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {delta >= 0 ? '+' : ''}
              {delta} this week
            </span>
          </motion.div>

          <p
            className="mt-2 text-[12px] leading-snug"
            style={{ color: palette.ink, opacity: 0.66 }}
          >
            {division.name} division
            {next ? ` · ${toNext} to ${next.name}` : ' · peak division'}
          </p>
        </div>

        <div className="shrink-0 pt-1">
          <Sparkline
            data={arena.trend}
            width={96}
            height={42}
            color={palette.ink}
            fill={false}
          />
        </div>
      </div>

      {/* division progress — a light rail on the field */}
      <div className="mt-4 flex items-center gap-3">
        <div
          className="h-[3px] flex-1 overflow-hidden rounded-full"
          style={{ background: 'rgba(255,255,255,0.18)' }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.9, ease: EASE.out, delay: 0.15 }}
            className="h-full origin-left rounded-full"
            style={{ background: palette.ink }}
          />
        </div>
        <span
          className="font-mono text-[9.5px] uppercase tracking-[0.14em]"
          style={{ color: palette.ink, opacity: 0.6 }}
        >
          {next ? next.name : 'max'}
        </span>
      </div>
    </div>
  );
}
