import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { Page } from '../components/Page';
import { QuestionStage } from '../components/QuestionStage';
import { AnswerTile, type TileState } from '../components/AnswerTile';
import {
  PlayerMiniCard,
  RoundProgress,
  RoundResolution,
  RoundTimer,
  StreakStrip,
} from '../components/DuelHud';
import {
  createDuel,
  finalizeDuel,
  opponentAnswerFor,
  resolveRound,
  type DuelState,
  type RoundAnswer,
} from '../lib/duel';
import { SCORE, roundPoints } from '../lib/scoring';
import { getDomain } from '../lib/domains';
import { useAppState } from '../state/AppState';
import { cn, formatNumber } from '../lib/utils';
import { sfx, haptics } from '../lib/audio';

type Phase = 'countdown' | 'question' | 'locked' | 'resolved';

const COUNTDOWN_MS = 2200;

export function DuelScreen() {
  const navigate = useNavigate();
  const { selectedDomain, profile, recordMatch, saveVaultItem, toast } =
    useAppState();

  const domain = getDomain(selectedDomain);

  const [duel, setDuel] = useState<DuelState>(() =>
    createDuel(selectedDomain, Math.floor(Math.random() * 900000) + 1000, domain.rating),
  );
  const [phase, setPhase] = useState<Phase>('countdown');
  const [remaining, setRemaining] = useState<number>(SCORE.roundDeadlineMs);
  const [countdown, setCountdown] = useState(COUNTDOWN_MS);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [opponentLocked, setOpponentLocked] = useState(false);
  const [showResolution, setShowResolution] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const deadlineRef = useRef<number>(0);
  const roundStartRef = useRef<number>(0);
  const opponentTimerRef = useRef<number | null>(null);
  const recordedRef = useRef(false);
  const phaseRef = useRef<Phase>('countdown');
  phaseRef.current = phase;

  const round = duel.rounds[duel.currentIndex];
  const question = round?.question;
  const isLastRound = duel.currentIndex >= duel.rounds.length - 1;

  // A duel must always be exactly 8 rounds. If a deck ever comes up short we
  // bail out safely instead of rendering an undefined question.
  useEffect(() => {
    if (!question) {
      navigate('/queue', { replace: true });
    }
  }, [question, navigate]);

  // ---------- Countdown before round 1 ----------
  useEffect(() => {
    if (phase !== 'countdown') return;
    const started = Date.now();
    const id = window.setInterval(() => {
      const left = COUNTDOWN_MS - (Date.now() - started);
      setCountdown(Math.max(0, left));
      if (left <= 0) {
        window.clearInterval(id);
        beginRound(0);
      }
    }, 60);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const beginRound = useCallback(
    (index: number) => {
      const now = Date.now();
      deadlineRef.current = now + SCORE.roundDeadlineMs;
      roundStartRef.current = now;
      setSelectedChoice(null);
      setOpponentLocked(false);
      setShowResolution(false);
      setEarnedPoints(0);
      setRemaining(SCORE.roundDeadlineMs);
      setPhase('question');

      // Opponent locks in at a plausible moment, never revealing choice.
      if (opponentTimerRef.current) window.clearTimeout(opponentTimerRef.current);
      const delay = 1600 + Math.random() * 3400;
      opponentTimerRef.current = window.setTimeout(() => {
        if (phaseRef.current === 'question' || phaseRef.current === 'locked') {
          setOpponentLocked(true);
          sfx.play('opponentLocked');
        }
      }, delay);
      void index;
    },
    [],
  );

  // ---------- Round timer ----------
  useEffect(() => {
    if (phase !== 'question' && phase !== 'locked') return;
    const id = window.setInterval(() => {
      const left = deadlineRef.current - Date.now();
      setRemaining(Math.max(0, left));
      if (left <= 0) {
        window.clearInterval(id);
        handleTimeout();
      }
    }, 50);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const resolveCurrentRound = useCallback(
    (selfAnswer: RoundAnswer) => {
      const opp = opponentAnswerFor(duel, duel.currentIndex);
      const oppAnswer: RoundAnswer = {
        ...opp,
        points: roundPoints({
          correct: opp.correct,
          elapsedMs: opp.elapsedMs,
          streakBefore: duel.opponentStreak,
          roundIndex: duel.currentIndex + 1,
        }),
      };
      const pts = roundPoints({
        correct: selfAnswer.correct,
        elapsedMs: selfAnswer.elapsedMs,
        streakBefore: duel.selfStreak,
        roundIndex: duel.currentIndex + 1,
      });
      setEarnedPoints(pts);
      setDuel((prev) => resolveRound(prev, prev.currentIndex, selfAnswer, oppAnswer));
      setShowResolution(true);
      setPhase('resolved');

      if (selfAnswer.correct) {
        sfx.play('correct');
        haptics.fire('success');
      } else if (selfAnswer.status === 'timeout') {
        sfx.play('incorrect');
        haptics.fire('warning');
      } else {
        sfx.play('incorrect');
        haptics.fire('error');
      }
    },
    [duel],
  );

  const handleTimeout = useCallback(() => {
    if (phaseRef.current === 'resolved') return;
    resolveCurrentRound({
      choiceId: null,
      correct: false,
      elapsedMs: SCORE.roundDeadlineMs,
      points: 0,
      status: 'timeout',
    });
  }, [resolveCurrentRound]);

  const handleSelect = useCallback(
    (choiceId: string) => {
      if (phaseRef.current !== 'question') return;
      const elapsed = Date.now() - roundStartRef.current;
      if (elapsed > SCORE.roundDeadlineMs) {
        handleTimeout();
        return;
      }
      setSelectedChoice(choiceId);
      setPhase('locked');
      sfx.play('lock');
      haptics.fire('medium');
      resolveCurrentRound({
        choiceId,
        correct: choiceId === question.correctChoiceId,
        elapsedMs: elapsed,
        points: 0,
        status: 'answered',
      });
    },
    [handleTimeout, question.correctChoiceId, resolveCurrentRound],
  );

  const handleContinue = useCallback(() => {
    if (isLastRound) {
      setDuel((prev) => {
        const final = finalizeDuel(prev);
        if (!recordedRef.current) {
          recordedRef.current = true;
          const won = final.outcome === 'WIN';
          recordMatch({
            won,
            drew: final.outcome === 'DRAW',
            domainId: final.domainId,
            xp: 40 + (won ? 25 : 10),
            sparks: won ? 12 : 5,
            ratingDelta: final.ratingDelta,
          });
        }
        return final;
      });
      sfx.play('overdrive');
      navigate('/result', { replace: true });
      return;
    }
    const nextIndex = duel.currentIndex + 1;
    setDuel((prev) => ({ ...prev, currentIndex: nextIndex }));
    beginRound(nextIndex);
  }, [beginRound, duel.currentIndex, isLastRound, navigate, recordMatch]);

  // Persist the finished duel so the result + Q&A screens can render it.
  useEffect(() => {
    if (duel.status === 'complete') {
      sessionStorage.setItem('mayaduels.lastDuel', JSON.stringify(duel));
    }
  }, [duel]);

  useEffect(
    () => () => {
      if (opponentTimerRef.current) window.clearTimeout(opponentTimerRef.current);
    },
    [],
  );

  const tileState = useCallback(
    (choiceId: string): TileState => {
      if (phase === 'resolved' || showResolution) {
        if (choiceId === question.correctChoiceId) return 'correct';
        if (choiceId === selectedChoice) return 'incorrect';
        return 'muted';
      }
      if (phase === 'locked') {
        return choiceId === selectedChoice ? 'locked' : 'muted';
      }
      return 'idle';
    },
    [phase, question.correctChoiceId, selectedChoice, showResolution],
  );

  const progressResults = useMemo(
    () =>
      duel.rounds.map((r) =>
        r.resolved ? Boolean(r.self?.correct) : null,
      ),
    [duel.rounds],
  );

  const correctLabel =
    question?.choices.find((c) => c.id === question.correctChoiceId)?.label ?? '';
  const chosenLabel =
    question?.choices.find((c) => c.id === selectedChoice)?.label ?? null;
  const opponentChoice = round?.opponent;
  const opponentLabel =
    question?.choices.find((c) => c.id === opponentChoice?.choiceId)?.label ?? null;

  const countdownNumber = Math.ceil(countdown / 1000);

  if (!question) return null;

  return (
    <div className="relative min-h-[100dvh] pb-10">
      <Page width="sm" className="pt-[calc(var(--safe-t)+12px)]">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-line bg-black/30 px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
              R{Math.min(duel.currentIndex + 1, 8)} / 8
            </span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-faint/70 xs:inline sm:inline">
              {domain.short}
            </span>
          </div>
          <RoundProgress
            total={8}
            current={duel.currentIndex}
            results={progressResults}
          />
          <button
            onClick={() => navigate('/')}
            aria-label="Leave match"
            className="press flex h-8 w-8 items-center justify-center rounded-full border border-line text-faint"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Opponent + timer row */}
        <div className="mt-3 flex items-center gap-3">
          <PlayerMiniCard
            name={duel.opponentName}
            rating={duel.opponentRating}
            seed={duel.startedAt % 97}
            score={duel.opponentScore}
            align="right"
            locked={opponentLocked && phase !== 'resolved'}
            accent="#FF2A85"
          />
          <RoundTimer
            remainingMs={phase === 'question' || phase === 'locked' ? remaining : 0}
            totalMs={SCORE.roundDeadlineMs}
          />
          <PlayerMiniCard
            name={profile.handle}
            rating={duel.selfRatingBefore}
            seed={profile.avatarSeed}
            score={duel.selfScore}
            isYou
            accent="#00F5D4"
          />
        </div>

        <div className="mt-3">
          <StreakStrip
            streak={duel.selfStreak}
            roundIndex={duel.currentIndex}
            totalRounds={8}
          />
        </div>

        {/* Question card */}
        <div className="mt-3">
          <AnimatePresence mode="wait">
            {phase !== 'resolved' && (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="surface-card p-4"
              >
                <QuestionStage question={question} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Answers */}
        {phase !== 'resolved' && (
          <div className="mt-3 space-y-2">
            {question.choices.map((choice, i) => (
              <AnswerTile
                key={choice.id}
                choice={choice}
                index={i}
                state={tileState(choice.id)}
                disabled={phase !== 'question'}
                onClick={() => handleSelect(choice.id)}
              />
            ))}
          </div>
        )}

        {/* Resolution */}
        <div className="mt-3">
          <AnimatePresence>
            {showResolution && (
              <RoundResolution
                correct={Boolean(round.self?.correct)}
                timedOut={round.self?.status === 'timeout'}
                points={earnedPoints}
                correctLabel={correctLabel}
                chosenLabel={chosenLabel}
                explanation={question.explanation.summary}
                opponentCorrect={Boolean(round.opponent?.correct)}
                opponentLabel={opponentLabel}
                onContinue={handleContinue}
                isLast={isLastRound}
              />
            )}
          </AnimatePresence>
        </div>

        {!showResolution && (
          <div className="mt-4 flex items-center justify-between text-[10.5px] text-faint">
            <span className="tnum font-mono">
              {formatNumber(duel.selfScore)} — {formatNumber(duel.opponentScore)}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
              server deadline authoritative
            </span>
          </div>
        )}
      </Page>

      {/* Countdown overlay */}
      <AnimatePresence>
        {phase === 'countdown' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas/92 backdrop-blur-sm"
          >
            <motion.div
              key={countdownNumber}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="text-center"
            >
              <p className="label-mono">{domain.arena}</p>
              <p className="tnum mt-2 font-display text-[5rem] font-semibold leading-none tracking-[-0.04em] text-cyan text-glow-cyan">
                {countdownNumber > 0 ? countdownNumber : 'GO'}
              </p>
              <p className="mt-3 max-w-[260px] text-[12.5px] leading-snug text-muted">
                {duel.opponentName} · {formatNumber(duel.opponentRating)} rating
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save-to-vault affordance after resolution */}
      {showResolution && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[calc(var(--safe-b)+12px)]">
          <button
            onClick={() => {
              saveVaultItem({
                conceptId: question.conceptId,
                concept: question.concept,
                domainId: question.domain,
                principle: question.explanation.summary,
                why: question.explanation.mentalModel,
                tradeoff: question.explanation.tradeoff,
              });
              sfx.play('tap');
              toast({
                title: 'Saved to Vault',
                message: `${question.concept} will resurface for review.`,
                tone: 'success',
              });
            }}
            className={cn(
              'press pointer-events-auto rounded-full border border-cyan-line/50 bg-cyan/12 px-4 py-2 text-[12px] font-medium text-cyan backdrop-blur',
            )}
          >
            Save concept to Vault
          </button>
        </div>
      )}
    </div>
  );
}