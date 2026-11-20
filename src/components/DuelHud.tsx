import { motion } from 'framer-motion';
import { Flame, Lock, Zap } from 'lucide-react';
import { Ring } from './Charts';
import { AvatarToken } from './AvatarToken';
import { cn, formatTimer } from '../lib/utils';
import { streakTierLabel } from '../lib/scoring';
import type { DuelState } from '../lib/duel';

/** Round progress pips — current round is elongated, resolved rounds are filled. */
export function RoundProgress({
  total,
  current,
  results,
}: {
  total: number;
  current: number;
  results: (boolean | null)[];
}) {
  return (
    <div className="flex items-center gap-1" aria-label={`Round ${current + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const done = results[i];
        const isCurrent = i === current;
        return (
          <motion.span
            key={i}
            layout
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              isCurrent ? 'w-5' : 'w-1.5',
              done === true && 'bg-cyan',
              done === false && 'bg-error/80',
              done === null || done === undefined
                ? isCurrent
                  ? 'bg-cyan/50'
                  : 'bg-white/15'
                : '',
              i === total - 1 && !isCurrent && done === null && 'bg-magenta/40',
            )}
          />
        );
      })}
    </div>
  );
}

/** Server-deadline timer ring with warning and expired states. */
export function RoundTimer({
  remainingMs,
  totalMs,
}: {
  remainingMs: number;
  totalMs: number;
}) {
  const progress = Math.max(0, Math.min(1, remainingMs / totalMs));
  const warning = remainingMs <= 2600 && remainingMs > 0;
  const expired = remainingMs <= 0;
  const color = expired ? '#FF5C67' : warning ? '#FFB800' : '#00F5D4';

  return (
    <div className="relative">
      {warning && !expired && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: `${color}55` }}
          animate={{ scale: [1, 1.16], opacity: [0.6, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      <Ring
        progress={progress}
        size={52}
        stroke={3.5}
        color={color}
        glow={warning}
      >
        <span
          className={cn(
            'tnum font-mono text-[13.5px] font-semibold leading-none',
            expired ? 'text-error' : warning ? 'text-amber' : 'text-ink',
          )}
        >
          {expired ? '0.0' : formatTimer(remainingMs)}
        </span>
      </Ring>
    </div>
  );
}

/** Compact self/opponent identity + score. */
export function PlayerMiniCard({
  name,
  rating,
  seed,
  score,
  align = 'left',
  isYou,
  locked,
  accent,
}: {
  name: string;
  rating: number;
  seed: number;
  score: number;
  align?: 'left' | 'right';
  isYou?: boolean;
  locked?: boolean;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 items-center gap-2',
        align === 'right' && 'flex-row-reverse text-right',
      )}
    >
      <div className="relative shrink-0">
        <AvatarToken seed={seed} size={34} ring={accent} />
        {locked && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-canvas bg-cyan text-[#04120F]"
          >
            <Lock className="h-2.5 w-2.5" strokeWidth={3} />
          </motion.span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11.5px] font-medium leading-tight text-ink">
          {name}
          {isYou && <span className="ml-1 text-[9.5px] text-faint">you</span>}
        </p>
        <div
          className={cn(
            'mt-0.5 flex items-baseline gap-1.5',
            align === 'right' && 'flex-row-reverse',
          )}
        >
          <motion.span
            key={score}
            initial={{ scale: 1.18, color: '#00F5D4' }}
            animate={{ scale: 1, color: '#F4F6FA' }}
            transition={{ duration: 0.35 }}
            className="tnum font-mono text-[13px] font-semibold leading-none"
          >
            {score}
          </motion.span>
          <span className="tnum font-mono text-[9.5px] text-faint">{rating}</span>
        </div>
      </div>
    </div>
  );
}

/** Streak + Overdrive marker strip. */
export function StreakStrip({
  streak,
  roundIndex,
  totalRounds,
}: {
  streak: number;
  roundIndex: number;
  totalRounds: number;
}) {
  const isOverdrive = roundIndex === totalRounds - 1;
  const tier = streakTierLabel(streak);
  const hot = streak >= 3;

  return (
    <div className="flex items-center justify-center gap-2">
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors',
          hot
            ? 'border-amber/40 bg-amber/10 text-amber'
            : 'border-line bg-black/25 text-faint',
        )}
      >
        <Flame className={cn('h-3 w-3', hot && 'text-amber')} />
        <span className="tnum font-mono text-[10.5px] font-medium">{streak}</span>
        <span className="font-mono text-[9.5px] opacity-70">{tier}</span>
      </div>

      {isOverdrive && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 20 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-magenta/50 bg-magenta/15 px-2.5 py-1 text-magenta"
        >
          <Zap className="h-3 w-3" />
          <span className="font-mono text-[9.5px] uppercase tracking-[0.14em]">
            Overdrive 1.5×
          </span>
        </motion.div>
      )}
    </div>
  );
}

/** Round resolution summary panel. */
export function RoundResolution({
  correct,
  timedOut,
  points,
  correctLabel,
  chosenLabel,
  explanation,
  opponentCorrect,
  opponentLabel,
  onContinue,
  isLast,
}: {
  correct: boolean;
  timedOut: boolean;
  points: number;
  correctLabel: string;
  chosenLabel: string | null;
  explanation: string;
  opponentCorrect: boolean;
  opponentLabel: string | null;
  onContinue: () => void;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="surface-card overflow-hidden"
    >
      <div
        className={cn(
          'flex items-center gap-2.5 px-4 py-3',
          correct
            ? 'bg-cyan/10'
            : timedOut
              ? 'bg-amber/10'
              : 'bg-error/10',
        )}
      >
        <span
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold',
            correct
              ? 'bg-cyan text-[#04120F]'
              : timedOut
                ? 'bg-amber text-[#1A1200]'
                : 'bg-error text-white',
          )}
        >
          {correct ? '✓' : timedOut ? '·' : '✕'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-tight">
            {correct
              ? 'Correct'
              : timedOut
                ? 'Time expired'
                : 'Not quite'}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-faint">
            {timedOut
              ? `Answer: ${correctLabel}`
              : `You picked ${chosenLabel ?? 'nothing'}`}
          </p>
        </div>
        <div className="text-right">
          <p
            className={cn(
              'tnum font-mono text-[15px] font-semibold leading-none',
              correct ? 'text-cyan' : 'text-faint',
            )}
          >
            +{points}
          </p>
          <p className="label-mono mt-0.5 text-[8px]">points</p>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="label-mono">Rival</span>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-[2px] font-medium',
              opponentCorrect
                ? 'bg-cyan/12 text-cyan'
                : 'bg-error/12 text-error',
            )}
          >
            {opponentCorrect ? 'correct' : 'missed'}
          </span>
          <span className="truncate text-faint">
            {opponentLabel ?? 'no answer'}
          </span>
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-muted">{explanation}</p>
        <button
          onClick={onContinue}
          className="press mt-3 flex h-11 w-full items-center justify-center rounded-full bg-cyan text-[14px] font-semibold text-[#04120F]"
        >
          {isLast ? 'See result' : 'Next round'}
        </button>
      </div>
    </motion.div>
  );
}