import { motion } from 'framer-motion';
import { AlertTriangle, Gauge, GitMerge, Quote, Sparkle } from 'lucide-react';
import type { Question } from '../lib/questions';
import { MECHANICS } from '../lib/domains';
import { cn } from '../lib/utils';
import { EASE } from '../lib/motion';

/**
 * Mechanic-specific question stage. The prompt and choices remain the primary
 * decision surface; the visuals are compact, supportive and never interactive.
 */
export function QuestionStage({
  question,
  compact,
}: {
  question: Question;
  compact?: boolean;
}) {
  const mechanic = MECHANICS[question.mechanic];
  const Icon =
    question.mechanic === 'TRIAD_COMPRESSION'
      ? GitMerge
      : question.mechanic === 'ARCHITECTURE_TRIAGE'
        ? Gauge
        : question.mechanic === 'SHIFT_THE_KNOB'
          ? Sparkle
          : Quote;

  return (
    <div className="relative">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-black/30 px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
          <Icon className="h-2.5 w-2.5" />
          {mechanic.short}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint/70">
          {question.difficultyBand}
        </span>
        <span className="ml-auto truncate font-mono text-[9px] uppercase tracking-[0.12em] text-faint/60">
          {question.subtopic}
        </span>
      </div>

      {question.mechanic === 'TRIAD_COMPRESSION' && question.clues && (
        <div className="mb-3 space-y-1.5">
          {question.clues.map((clue, i) => (
            <motion.div
              key={clue}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.07, duration: 0.28, ease: EASE.out }}
              className="flex items-start gap-2 rounded-xl border border-line bg-black/25 px-2.5 py-1.5"
            >
              <span className="mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] bg-cyan/15 font-mono text-[8px] text-cyan">
                {i + 1}
              </span>
              <span className="text-[11.5px] leading-snug text-muted">{clue}</span>
            </motion.div>
          ))}
        </div>
      )}

      {question.mechanic === 'ARCHITECTURE_TRIAGE' && question.telemetry && (
        <div className="mb-3 grid grid-cols-3 gap-1.5">
          {question.telemetry.map((t) => (
            <div
              key={t.label}
              className={cn(
                'rounded-xl border px-2 py-1.5',
                t.tone === 'crit'
                  ? 'border-error/30 bg-error/8'
                  : t.tone === 'warn'
                    ? 'border-amber/25 bg-amber/8'
                    : t.tone === 'good'
                      ? 'border-cyan/25 bg-cyan/8'
                      : 'border-line bg-black/25',
              )}
            >
              <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-faint">
                {t.label}
              </p>
              <p
                className={cn(
                  'tnum mt-0.5 truncate font-mono text-[10.5px] font-medium',
                  t.tone === 'crit'
                    ? 'text-error'
                    : t.tone === 'warn'
                      ? 'text-amber'
                      : t.tone === 'good'
                        ? 'text-cyan'
                        : 'text-ink',
                )}
              >
                {t.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {question.mechanic === 'SHIFT_THE_KNOB' && question.knob && (
        <div className="mb-3 rounded-xl border border-line bg-black/25 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-faint">
              {question.knob.label}
            </p>
            <motion.span
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="font-mono text-[9px] text-cyan"
            >
              shifting
            </motion.span>
          </div>
          <div className="relative mt-2.5 h-1.5 rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan/40 to-cyan"
              style={{ width: `${question.knob.position}%` }}
            />
            <motion.span
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-canvas bg-cyan"
              style={{ left: `${question.knob.position}%` }}
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[9px] text-faint">
            <span>{question.knob.from}</span>
            <span>{question.knob.to}</span>
          </div>
        </div>
      )}

      {question.mechanic === 'MYTHBUSTER' && question.claim && (
        <div className="mb-3 rounded-xl border border-magenta/25 bg-magenta/6 px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3 text-magenta" />
            <p className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-magenta">
              claim under test
            </p>
          </div>
          <p className="mt-1.5 text-[12px] leading-snug text-ink/90">
            “{question.claim}”
          </p>
        </div>
      )}

      <h2
        className={cn(
          'font-display font-semibold leading-[1.22] tracking-[-0.02em] text-ink',
          compact ? 'text-[17px]' : 'text-[19px]',
        )}
      >
        {question.prompt}
      </h2>
    </div>
  );
}