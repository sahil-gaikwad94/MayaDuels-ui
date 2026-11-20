import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ChevronLeft, Sparkles, Zap } from 'lucide-react';
import { Page } from '../components/Page';
import { HeroStage } from '../components/HeroStage';
import { Button } from '../components/Button';
import { ObjectGlyph, toObjectKind } from '../components/ObjectGlyph';
import { DOMAINS, type DomainId } from '../lib/domains';
import { useAppState } from '../state/AppState';
import { cn } from '../lib/utils';
import { cardRise, listStagger } from '../lib/motion';
import { sfx } from '../lib/audio';

const STEPS = 3;

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { completeOnboarding, profile } = useAppState();
  const [step, setStep] = useState(0);
  const [domain, setDomain] = useState<DomainId>('AI_ML');
  const [handle, setHandle] = useState(profile.handle === 'new.engineer' ? '' : profile.handle);

  const next = () => {
    sfx.play('tap');
    setStep((s) => Math.min(STEPS - 1, s + 1));
  };
  const back = () => {
    sfx.play('tap');
    setStep((s) => Math.max(0, s - 1));
  };

  const finish = () => {
    completeOnboarding(domain, handle || undefined);
    sfx.play('promote');
    navigate('/', { replace: true });
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden pb-32">
      {/* ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-faint opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(0,245,212,0.20), transparent 68%)',
        }}
      />

      <Page width="sm" className="relative pt-[calc(var(--safe-t)+20px)]">
        {/* progress */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: STEPS }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors duration-300',
                i <= step ? 'bg-cyan' : 'bg-white/10',
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0 — brand reveal */}
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <div className="relative mx-auto h-[250px] w-full">
                <HeroStage
                  kind="core"
                  accent="#00F5D4"
                  intensity="hero"
                  zoom={2.7}
                  className="h-full w-full"
                  label="Maya Core"
                />
              </div>
              <div className="mt-2 text-center">
                <p className="label-mono">maya-duels</p>
                <h1 className="mt-2 font-display text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.035em]">
                  Test your engineering
                  <br />
                  instincts in 60 seconds.
                </h1>
                <p className="mx-auto mt-3 max-w-[320px] text-[13px] leading-relaxed text-muted">
                  Eight rounds. One rival. Real mechanisms, trade-offs and failure
                  modes — answered with taps, not code.
                </p>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { icon: Zap, label: '60s blitz' },
                  { icon: Sparkles, label: '4 mechanics' },
                  { icon: Check, label: 'learn after' },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="surface-card flex flex-col items-center gap-1.5 py-3"
                  >
                    <f.icon className="h-4 w-4 text-cyan" />
                    <span className="text-[10px] text-faint">{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button
                  size="lg"
                  full
                  onClick={next}
                  trailingIcon={<ArrowRight className="h-4 w-4 opacity-70" />}
                >
                  Continue
                </Button>
                <p className="mt-3 text-center text-[10.5px] text-faint">
                  No account required to play
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 1 — pick a starting domain */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-5"
            >
              <h2 className="font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.03em]">
                Where do you want to start?
              </h2>
              <p className="mt-1.5 text-[12.5px] text-faint">
                You can change this any time. Your first duels set a provisional
                rating.
              </p>

              <motion.div
                variants={listStagger}
                initial="hidden"
                animate="show"
                className="mt-4 space-y-2"
              >
                {DOMAINS.map((d) => (
                  <motion.button
                    key={d.id}
                    variants={cardRise}
                    onClick={() => {
                      setDomain(d.id);
                      sfx.play('tap');
                    }}
                    className={cn(
                      'press flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left',
                      domain === d.id
                        ? 'border-cyan-line/60 bg-cyan/8'
                        : 'border-line bg-surface/70',
                    )}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-black/30">
                      <ObjectGlyph
                        kind={toObjectKind(d.id)}
                        accent={d.accent}
                        className="h-8 w-8"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-ink">
                        {d.arena}
                      </p>
                      <p className="truncate text-[11px] text-faint">{d.tagline}</p>
                    </div>
                    <span
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                        domain === d.id
                          ? 'border-cyan bg-cyan text-[#04120F]'
                          : 'border-line',
                      )}
                    >
                      {domain === d.id && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  </motion.button>
                ))}
              </motion.div>

              <div className="mt-5 flex gap-2">
                <Button variant="secondary" onClick={back} className="px-5">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button full onClick={next} trailingIcon={<ArrowRight className="h-4 w-4" />}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2 — handle + calibration */}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-5"
            >
              <h2 className="font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.03em]">
                Claim a handle
              </h2>
              <p className="mt-1.5 text-[12.5px] text-faint">
                Optional. You can link an account later to keep your rating and
                history across devices.
              </p>

              <div className="glass mt-4 flex items-center gap-2.5 rounded-full px-4 py-2.5">
                <span className="font-mono text-[13px] text-faint">@</span>
                <input
                  value={handle}
                  onChange={(e) =>
                    setHandle(e.target.value.replace(/[^a-zA-Z0-9_.]/g, '').slice(0, 16))
                  }
                  placeholder="your.handle"
                  aria-label="Handle"
                  className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-faint/80 focus:outline-none"
                />
              </div>

              <div className="surface-card mt-4 p-4">
                <p className="label-mono">what happens next</p>
                <ol className="mt-2.5 space-y-2">
                  {[
                    'A short calibration set estimates your starting band.',
                    'You get a provisional rating — clearly marked until settled.',
                    'Every match ends with a two-player Q&A and a mental model.',
                  ].map((t, i) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan/15 font-mono text-[9px] text-cyan">
                        {i + 1}
                      </span>
                      <span className="text-[11.5px] leading-relaxed text-muted">
                        {t}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-5 flex gap-2">
                <Button variant="secondary" onClick={back} className="px-5">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  full
                  onClick={finish}
                  icon={<Zap className="h-[18px] w-[18px]" />}
                  trailingIcon={<ArrowRight className="h-4 w-4 opacity-70" />}
                >
                  Start calibration
                </Button>
              </div>
              <p className="mt-3 text-center text-[10.5px] text-faint">
                Anonymous progress survives relaunch on this device
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Page>
    </div>
  );
}