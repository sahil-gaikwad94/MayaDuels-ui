import { motion } from 'framer-motion';
import { Check, Lock, X } from 'lucide-react';
import type { Choice } from '../lib/questions';
import { cn } from '../lib/utils';

export type TileState =
  | 'idle'
  | 'pressed'
  | 'locked'
  | 'correct'
  | 'incorrect'
  | 'muted';

const LETTERS = ['A', 'B', 'C', 'D'];

export function AnswerTile({
  choice,
  index,
  state,
  disabled,
  onClick,
  showResult,
}: {
  choice: Choice;
  index: number;
  state: TileState;
  disabled?: boolean;
  onClick: () => void;
  showResult?: boolean;
}) {
  const isCorrect = state === 'correct';
  const isWrong = state === 'incorrect';
  const isLocked = state === 'locked';

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.1 }}
      aria-label={`Answer ${LETTERS[index]}: ${choice.label}`}
      className={cn(
        'press group relative flex min-h-[56px] w-full items-center gap-3 overflow-hidden rounded-2xl border px-3.5 py-3 text-left transition-colors duration-200',
        'disabled:cursor-default',
        state === 'idle' &&
          'border-line bg-raised/80 hover:border-line-strong hover:bg-elevated',
        isLocked && 'border-cyan/60 bg-cyan/10',
        isCorrect && 'border-cyan bg-cyan/15',
        isWrong && 'border-error/70 bg-error/12',
        state === 'muted' && 'border-line/60 bg-surface/50 opacity-55',
        state === 'pressed' && 'border-cyan-line bg-cyan/8',
      )}
    >
      {/* left accent bar for result states */}
      {(isCorrect || isWrong) && (
        <motion.span
          layout
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          className={cn(
            'absolute inset-y-2 left-0 w-[3px] rounded-full',
            isCorrect ? 'bg-cyan' : 'bg-error',
          )}
        />
      )}

      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-[11px] font-medium transition-colors',
          state === 'idle' && 'border-line bg-black/30 text-faint group-hover:text-muted',
          isLocked && 'border-cyan/40 bg-cyan/15 text-cyan',
          isCorrect && 'border-cyan/50 bg-cyan/20 text-cyan',
          isWrong && 'border-error/40 bg-error/15 text-error',
          state === 'muted' && 'border-line/50 text-faint/60',
          state === 'pressed' && 'border-cyan/40 text-cyan',
        )}
      >
        {LETTERS[index]}
      </span>

      <span
        className={cn(
          'flex-1 text-[14px] font-medium leading-snug transition-colors',
          state === 'idle' && 'text-ink/90',
          isLocked && 'text-ink',
          isCorrect && 'text-ink',
          isWrong && 'text-ink/80',
          state === 'muted' && 'text-muted',
        )}
      >
        {choice.label}
      </span>

      {showResult && isCorrect && (
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan text-[#04120F]"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </motion.span>
      )}
      {showResult && isWrong && (
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-error text-white"
        >
          <X className="h-3.5 w-3.5" strokeWidth={3} />
        </motion.span>
      )}
      {isLocked && !showResult && (
        <Lock className="h-3.5 w-3.5 shrink-0 text-cyan" />
      )}
    </motion.button>
  );
}