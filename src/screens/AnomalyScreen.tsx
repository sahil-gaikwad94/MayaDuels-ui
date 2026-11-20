import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Clock,
  Flame,
  Share2,
  Sparkles,
  Timer,
} from 'lucide-react';
import { Page, Badge, ProgressBar, SectionHeader } from '../components/Page';
import { IdentityCapsule } from '../components/IdentityCapsule';
import { HeroStage } from '../components/HeroStage';
import { Button } from '../components/Button';
import { Ring } from '../components/Charts';
import { useAppState } from '../state/AppState';
import { cn, formatCountdown } from '../lib/utils';
import { cardRise, listStagger } from '../lib/motion';
import { sfx } from '../lib/audio';

const STEPS = [
  { label: 'Cache stampede', mechanic: 'Triage' },
  { label: 'Isolation level', mechanic: 'Triad' },
  { label: 'TCP semantics', mechanic: 'Myth' },
  { label: 'Cache line', mechanic: 'Myth' },
  { label: 'Backpressure', mechanic: 'Knob' },
];

export function AnomalyScreen() {
  const { toast } = useAppState();
  const [remaining, setRemaining] = useState(7 * 3600 + 42 * 60 + 11);
  const [completed, setCompleted] = useState(3);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const resetLabel = useMemo(() => {
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [remaining]);

  const progress = (completed / STEPS.length) * 100;

  return (
    <div className="pb-32">
      <Page width="sm" className="pt-[calc(var(--safe-t)+14px)]">
        <IdentityCapsule />

        <div className="mt-6 text-center">
          <Badge tone="magenta">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-magenta" />
            daily anomaly
          </Badge>
          <h1 className="mt-2.5 font-display text-[1.9rem] font-semibold leading-none tracking-[-0.03em]">
            One deck. Everyone.
          </h1>
          <p className="mx-auto mt-2 max-w-[300px] text-[12.5px] leading-snug text-faint">
            A shared five-step investigation, identical for every player. Resets
            at 00:00 UTC.
          </p>
        </div>

        {/* Hero */}
        <div className="relative mt-2 h-[210px]">
          <HeroStage
            kind="core"
            accent="#FF2A85"
            intensity="hero"
            zoom={2.9}
            className="h-full w-full"
            label="Daily Anomaly core"
          />
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            <div className="glass flex items-center gap-2 rounded-full px-3.5 py-1.5">
              <Timer className="h-3.5 w-3.5 text-magenta" />
              <span className="tnum font-mono text-[12px] text-ink">
                {resetLabel}
              </span>
              <span className="text-[10.5px] text-faint">to reset</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="surface-card mt-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-mono">Today&apos;s run</p>
              <p className="mt-1 font-display text-lg font-semibold leading-none">
                {completed} / {STEPS.length} steps
              </p>
            </div>
            <Ring progress={completed / STEPS.length} size={48} stroke={4} color="#FF2A85">
              <span className="tnum font-mono text-[11px] text-ink">
                {Math.round(progress)}%
              </span>
            </Ring>
          </div>
          <div className="mt-3">
            <ProgressBar value={progress} color="#FF2A85" height={5} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
            {[
              { label: 'Your time', value: '2:14' },
              { label: 'Score', value: '684' },
              { label: 'Streak', value: '6 days' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="label-mono text-[8px]">{s.label}</p>
                <p className="tnum mt-1 font-mono text-[12.5px] font-medium text-ink">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="mt-5">
          <SectionHeader
            title="Investigation path"
            subtitle="Same order for every player"
          />
          <motion.div
            variants={listStagger}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {STEPS.map((s, i) => {
              const done = i < completed;
              const current = i === completed;
              return (
                <motion.div
                  key={s.label}
                  variants={cardRise}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border px-3.5 py-3',
                    done
                      ? 'border-cyan/25 bg-cyan/6'
                      : current
                        ? 'border-magenta/40 bg-magenta/8'
                        : 'border-line bg-surface/50',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold',
                      done
                        ? 'bg-cyan text-[#04120F]'
                        : current
                          ? 'bg-magenta text-white'
                          : 'border border-line text-faint',
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'truncate text-[12.5px] font-medium',
                        done || current ? 'text-ink' : 'text-muted',
                      )}
                    >
                      {s.label}
                    </p>
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-faint">
                      {s.mechanic}
                    </p>
                  </div>
                  {current && (
                    <span className="shrink-0 rounded-full bg-magenta/15 px-2 py-[2px] font-mono text-[8.5px] uppercase tracking-wider text-magenta">
                      next
                    </span>
                  )}
                  {done && (
                    <span className="tnum shrink-0 font-mono text-[10px] text-cyan">
                      +{120 + i * 10}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-5 space-y-2">
          {completed < STEPS.length ? (
            <Button
              size="lg"
              full
              variant="magenta"
              onClick={() => {
                setStarted(true);
                sfx.play('overdrive');
                setCompleted((c) => Math.min(STEPS.length, c + 1));
                toast({
                  title: 'Step cleared',
                  message: 'Progress saved locally for this preview.',
                  tone: 'success',
                });
              }}
              icon={<Flame className="h-[18px] w-[18px]" />}
              trailingIcon={<ArrowRight className="h-4 w-4 opacity-70" />}
            >
              {started ? 'Continue run' : 'Start today’s run'}
            </Button>
          ) : (
            <div className="rounded-2xl border border-cyan/30 bg-cyan/8 p-4 text-center">
              <p className="text-[13.5px] font-semibold text-cyan">
                Anomaly complete
              </p>
              <p className="mt-1 text-[11.5px] text-faint">
                Come back after 00:00 UTC for a new investigation.
              </p>
            </div>
          )}
          <button
            onClick={() =>
              toast({
                title: 'Spoiler-safe card copied',
                message: 'Shares progress without revealing any answer.',
                tone: 'success',
              })
            }
            className="press flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line text-[13px] font-medium text-muted"
          >
            <Share2 className="h-4 w-4" /> Share progress
          </button>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-line bg-surface/50 p-3.5">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
          <p className="text-[11px] leading-relaxed text-faint">
            <span className="text-muted">Percentiles stay hidden. </span>
            Global comparison appears only after a valid population threshold is
            met — no invented “top 14%”.
          </p>
        </div>
      </Page>
    </div>
  );
}