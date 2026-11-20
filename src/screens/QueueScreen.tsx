import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, ShieldQuestion, X } from 'lucide-react';
import { Page, Badge } from '../components/Page';
import { HeroStage } from '../components/HeroStage';
import { Button } from '../components/Button';
import { getDomain } from '../lib/domains';
import { useAppState } from '../state/AppState';
import { cn, formatNumber } from '../lib/utils';
import { sfx, haptics } from '../lib/audio';

const STAGES = [
  { at: 0, label: 'Opening arena channel' },
  { at: 900, label: 'Core synchronised' },
  { at: 1900, label: 'Calibrating rival skill band' },
  { at: 3000, label: 'Sealing question deck' },
];

const TIPS = [
  'Speed matters, but accuracy decides matches. A fast wrong answer scores zero.',
  'Round 8 is Overdrive: a 1.5× multiplier on a high-discrimination question.',
  'Three correct in a row raises your multiplier to 1.1×. Five raises it to 1.2×.',
  'Timeouts score zero and reset your streak — tap something rather than nothing.',
  'Every finished match unlocks a two-player Q&A comparison with mental models.',
];

export function QueueScreen() {
  const navigate = useNavigate();
  const { selectedDomain, matchesPlayed } = useAppState();
  const domain = getDomain(selectedDomain);
  const [elapsed, setElapsed] = useState(0);
  const [stage, setStage] = useState(0);
  const [tip] = useState(
    () => TIPS[Math.floor(Math.random() * TIPS.length) % TIPS.length],
  );

  useEffect(() => {
    const started = Date.now();
    const id = window.setInterval(() => {
      const e = Date.now() - started;
      setElapsed(e);
      const nextStage = STAGES.reduce(
        (acc, s, i) => (e >= s.at ? i : acc),
        0,
      );
      setStage(nextStage);
    }, 120);
    return () => window.clearInterval(id);
  }, []);

  // Auto-enter the duel after the activation sequence.
  useEffect(() => {
    if (elapsed > 4200) {
      sfx.play('whoosh');
      navigate('/duel', { replace: true });
    }
  }, [elapsed, navigate]);

  const seconds = (elapsed / 1000).toFixed(1);
  const progress = Math.min(1, elapsed / 4200);

  const queueCopy = useMemo(() => {
    if (matchesPlayed === 0) {
      return 'Finding your first rival. New players are placed against a calibrated arena rival so you can play immediately.';
    }
    return 'Searching for a human rival near your rating. If the queue is quiet, an arena rival steps in — same rules, same Q&A.';
  }, [matchesPlayed]);

  return (
    <div className="pb-32">
      <Page width="sm" className="pt-[calc(var(--safe-t)+14px)]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            aria-label="Cancel matchmaking"
            className="press flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <Badge tone="cyan">matchmaking</Badge>
          <button
            onClick={() => navigate('/')}
            aria-label="Close"
            className="press flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="label-mono">Entering</p>
          <h1 className="mt-1.5 font-display text-[1.7rem] font-semibold leading-tight tracking-[-0.03em]">
            {domain.arena}
          </h1>
          <p className="mt-1 text-[12.5px] text-faint">
            {formatNumber(domain.rating)} rating · 8 rounds · 60s Blitz
          </p>
        </div>

        {/* Core activation */}
        <div className="relative mx-auto mt-2 h-[290px] w-full">
          <HeroStage
            kind="core"
            accent={domain.accent}
            intensity="hero"
            zoom={2.7}
            className="h-full w-full"
            label="Maya Core activating"
          />
          {/* activation rings */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border"
              style={{
                width: 150 + i * 46,
                height: 150 + i * 46,
                marginLeft: -(150 + i * 46) / 2,
                marginTop: -(150 + i * 46) / 2,
                borderColor: `${domain.accent}33`,
              }}
              animate={{ scale: [0.94, 1.06, 0.94], opacity: [0.5, 0.15, 0.5] }}
              transition={{
                duration: 2.6 + i * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Stage checklist */}
        <div className="surface-card p-4">
          <div className="flex items-center justify-between">
            <p className="label-mono">Queue status</p>
            <span className="tnum font-mono text-[11px] text-faint">
              {seconds}s
            </span>
          </div>
          <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-cyan transition-[width] duration-200 ease-linear"
              style={{
                width: `${progress * 100}%`,
                boxShadow: '0 0 12px rgba(0,245,212,0.6)',
              }}
            />
          </div>
          <ul className="mt-3.5 space-y-2">
            {STAGES.map((s, i) => {
              const done = stage > i;
              const active = stage === i;
              return (
                <li key={s.label} className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
                      done && 'border-cyan/50 bg-cyan/15 text-cyan',
                      active && 'border-cyan/60 bg-cyan/10 text-cyan',
                      !done && !active && 'border-line text-faint/50',
                    )}
                  >
                    {done ? (
                      <Check className="h-3 w-3" />
                    ) : active ? (
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="h-1.5 w-1.5 rounded-full bg-cyan"
                      />
                    ) : (
                      <span className="h-1 w-1 rounded-full bg-current" />
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-[12.5px] transition-colors',
                      done ? 'text-muted' : active ? 'text-ink' : 'text-faint/70',
                    )}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-4 px-2 text-center text-[11.5px] leading-relaxed text-faint">
          {queueCopy}
        </p>

        <div className="mt-5">
          <Button variant="secondary" full onClick={() => navigate('/')}>
            Cancel search
          </Button>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-line bg-surface/60 p-3.5">
          <ShieldQuestion className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
          <div>
            <p className="label-mono mb-1">While you wait</p>
            <p className="text-[11.5px] leading-relaxed text-muted">{tip}</p>
          </div>
        </div>
      </Page>
    </div>
  );
}