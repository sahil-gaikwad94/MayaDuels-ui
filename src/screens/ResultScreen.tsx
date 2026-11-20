import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Check,
  Home,
  RotateCcw,
  Share2,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Page, Badge } from '../components/Page';
import { HeroStage } from '../components/HeroStage';
import { Button } from '../components/Button';
import { AvatarToken } from '../components/AvatarToken';
import { getDomain, divisionFor } from '../lib/domains';
import { useAppState } from '../state/AppState';
import { cn, formatDelta, formatNumber } from '../lib/utils';
import { sfx, haptics } from '../lib/audio';
import type { DuelState } from '../lib/duel';

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function ResultScreen() {
  const navigate = useNavigate();
  const { profile, toast } = useAppState();
  const [skipped, setSkipped] = useState(false);

  const duel = useMemo<DuelState | null>(() => {
    try {
      const raw = sessionStorage.getItem('mayaduels.lastDuel');
      return raw ? (JSON.parse(raw) as DuelState) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!duel) {
      navigate('/', { replace: true });
      return;
    }
    sfx.play(
      duel.outcome === 'WIN' ? 'win' : duel.outcome === 'LOSS' ? 'loss' : 'draw',
    );
    haptics.fire(duel.outcome === 'WIN' ? 'success' : 'medium');
  }, [duel, navigate]);

  const animatedScore = useCountUp(duel?.selfScore ?? 0);
  const animatedRating = useCountUp(duel?.selfRatingAfter ?? 0, 1100);

  if (!duel) return null;

  const domain = getDomain(duel.domainId);
  const won = duel.outcome === 'WIN';
  const drew = duel.outcome === 'DRAW';
  const accent = won ? '#00F5D4' : drew ? '#9FB4C7' : '#FF5C67';
  const division = divisionFor(duel.selfRatingAfter);
  const correctCount = duel.rounds.filter((r) => r.self?.correct).length;
  const accuracy = Math.round((correctCount / duel.rounds.length) * 100);

  // Longest run of correct answers across the match.
  const bestStreak = duel.rounds.reduce(
    (acc, r) => {
      const run = r.self?.correct ? acc.run + 1 : 0;
      return { run, best: Math.max(acc.best, run) };
    },
    { run: 0, best: 0 },
  ).best;

  // Average verified response time across answered rounds.
  const answered = duel.rounds.filter((r) => r.self && r.self.status === 'answered');
  const avgTime = answered.length
    ? answered.reduce((sum, r) => sum + (r.self?.elapsedMs ?? 0), 0) /
      answered.length /
      1000
    : 0;

  return (
    <div className="pb-32">
      <Page width="sm" className="pt-[calc(var(--safe-t)+12px)]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            aria-label="Home"
            className="press flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted"
          >
            <Home className="h-4 w-4" />
          </button>
          <span className="label-mono">{domain.arena} · Blitz</span>
          <button
            onClick={() => {
              sfx.play('tap');
              toast({
                title: 'Result card copied',
                message: 'Spoiler-safe share text is ready to paste.',
                tone: 'success',
              });
            }}
            aria-label="Share result"
            className="press flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Outcome hero */}
        <div className="relative mt-3 flex flex-col items-center">
          {!skipped && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[240px]">
              <HeroStage
                kind={won ? 'trophy' : 'core'}
                accent={accent}
                intensity="hero"
                zoom={3.0}
                className="h-full w-full"
                label={won ? 'Victory trophy' : 'Match core'}
              />
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skipped ? 0 : 0.18, duration: 0.4 }}
            className="relative z-10 mt-[104px] text-center"
          >
            <Badge tone={won ? 'cyan' : drew ? 'neutral' : 'error'}>
              {duel.ratingEligible ? 'ranked result' : 'practice progress'}
            </Badge>
            <h1
              className="mt-2.5 font-display text-[2.6rem] font-semibold leading-none tracking-[-0.04em]"
              style={{ color: accent }}
            >
              {won ? 'Victory' : drew ? 'Draw' : 'Defeat'}
            </h1>
            <p className="mt-2 text-[12.5px] text-faint">
              {won
                ? 'Clean read. You out-scored your rival.'
                : drew
                  ? 'Dead even. Nothing separated the two decks.'
                  : 'A gap showed up. The Q&A shows exactly where.'}
            </p>
          </motion.div>
        </div>

        {/* Score comparison */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="surface-card mt-4 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <AvatarToken seed={profile.avatarSeed} size={38} ring="#00F5D4" />
              <p className="max-w-full truncate text-[11.5px] font-medium text-ink">
                {profile.handle}
              </p>
              <p className="tnum font-display text-[26px] font-semibold leading-none text-ink">
                {animatedScore}
              </p>
              <p className="text-[10px] text-faint">you</p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                final
              </span>
              <span className="h-8 w-px bg-line" />
              <span className="tnum font-mono text-[11px] text-muted">
                {correctCount}/8 correct
              </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <AvatarToken seed={duel.startedAt % 97} size={38} ring="#FF2A85" />
              <p className="max-w-full truncate text-[11.5px] font-medium text-muted">
                {duel.opponentName}
              </p>
              <p className="tnum font-display text-[26px] font-semibold leading-none text-muted">
                {duel.opponentScore}
              </p>
              <p className="text-[10px] text-faint">rival</p>
            </div>
          </div>

          <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-line pt-3">
            {[
              { label: 'Accuracy', value: `${accuracy}%` },
              { label: 'Best streak', value: `${bestStreak}` },
              { label: 'Avg time', value: avgTime ? `${avgTime.toFixed(1)}s` : '—' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="label-mono text-[8.5px]">{s.label}</p>
                <p className="tnum mt-1 font-mono text-[13px] font-medium text-ink">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rating delta */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="surface-card mt-2.5 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="label-mono">
                {duel.ratingEligible ? 'Rating' : 'Provisional rating'}
              </p>
              <div className="mt-1 flex items-end gap-2">
                <span className="tnum font-display text-[26px] font-semibold leading-none">
                  {formatNumber(animatedRating)}
                </span>
                <span
                  className={cn(
                    'mb-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                    duel.ratingDelta >= 0
                      ? 'bg-cyan/12 text-cyan'
                      : 'bg-error/12 text-error',
                  )}
                >
                  {duel.ratingDelta >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatDelta(duel.ratingDelta)}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-faint">
                {division.name} division
                {!duel.ratingEligible && ' · arena rival matches do not affect ranked rating'}
              </p>
            </div>
            <div className="text-right">
              <p className="label-mono text-[8.5px]">match xp</p>
              <p className="tnum mt-1 font-mono text-[13px] font-medium text-cyan">
                +{40 + (won ? 25 : 10)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Milestones */}
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2.5 flex items-center gap-2.5 rounded-2xl border border-amber/25 bg-amber/8 px-3.5 py-3"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-amber" />
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-ink">
                Mastery milestone · {domain.arena}
              </p>
              <p className="mt-0.5 text-[11px] text-faint">
                Three correct in a row unlocked the 1.1× streak tier.
              </p>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="mt-5 space-y-2">
          <Button
            size="lg"
            full
            onClick={() => navigate('/match')}
            trailingIcon={<ArrowRight className="h-4 w-4 opacity-70" />}
            icon={<BookOpen className="h-[18px] w-[18px]" />}
          >
            Review Q&A
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/queue')}
              icon={<RotateCcw className="h-4 w-4" />}
            >
              Rematch
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              icon={<Check className="h-4 w-4" />}
            >
              Queue next
            </Button>
          </div>
          {!skipped && (
            <button
              onClick={() => setSkipped(true)}
              className="press w-full py-1.5 text-center text-[11px] text-faint"
            >
              Skip celebration
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-[10.5px] leading-relaxed text-faint/70">
          This is a UI preview. Opponent behaviour is simulated locally; no
          fabricated human identity or ranking is shown.
        </p>
      </Page>
    </div>
  );
}