import { buildDeck, type Question } from './questions';
import { roundPoints, SCORE } from './scoring';
import type { DomainId, MechanicId } from './domains';
import { seededRandom } from './utils';

export type RoundStatus = 'answered' | 'timeout' | 'pending';

export interface RoundAnswer {
  choiceId: string | null;
  correct: boolean;
  elapsedMs: number;
  points: number;
  status: RoundStatus;
}

export interface DuelRound {
  index: number;
  question: Question;
  deadlineAt: number;
  self: RoundAnswer | null;
  opponent: RoundAnswer | null;
  resolved: boolean;
}

export interface DuelState {
  matchId: string;
  domainId: DomainId;
  rounds: DuelRound[];
  currentIndex: number;
  selfScore: number;
  opponentScore: number;
  selfStreak: number;
  opponentStreak: number;
  status: 'countdown' | 'active' | 'resolving' | 'complete';
  startedAt: number;
  opponentName: string;
  opponentRating: number;
  opponentIsRival: boolean;
  selfRatingBefore: number;
  selfRatingAfter: number;
  ratingDelta: number;
  ratingEligible: boolean;
  outcome: 'WIN' | 'LOSS' | 'DRAW' | null;
}

const RIVAL_NAMES = [
  'Rival 07',
  'Rival 12',
  'Rival 23',
  'Rival 31',
  'Rival 44',
  'Rival 58',
];

/**
 * Deterministic-ish rival: correct probability from a logistic curve,
 * response time from a right-skewed distribution.
 */
function simulateOpponentAnswer(
  question: Question,
  roundIndex: number,
  seed: number,
  skill = 0.62,
): RoundAnswer {
  const rand = seededRandom(seed + roundIndex * 977);
  const difficultyPenalty =
    question.difficultyBand === 'Expert'
      ? 0.2
      : question.difficultyBand === 'Advanced'
        ? 0.1
        : question.difficultyBand === 'Foundation'
          ? -0.12
          : 0;
  const pCorrect = Math.min(0.94, Math.max(0.18, skill - difficultyPenalty));
  const correct = rand() < pCorrect;

  // Right-skewed response time: base + exponential-ish tail
  const base = 1500 + rand() * 1800;
  const tail = Math.pow(rand(), 2.2) * 4200;
  const pressure = roundIndex >= 5 ? 0.86 : 1;
  const elapsed = Math.min(
    SCORE.roundDeadlineMs - 120,
    Math.round((base + tail) * pressure * (correct ? 1 : 1.16)),
  );

  const wrongChoices = question.choices.filter((c) => c.id !== question.correctChoiceId);
  const chosen = correct
    ? question.correctChoiceId
    : wrongChoices[Math.floor(rand() * wrongChoices.length) % wrongChoices.length].id;

  return {
    choiceId: chosen,
    correct,
    elapsedMs: elapsed,
    points: roundPoints({
      correct,
      elapsedMs: elapsed,
      streakBefore: 0,
      roundIndex: roundIndex + 1,
    }),
    status: 'answered',
  };
}

export function createDuel(
  domainId: DomainId,
  seed: number,
  selfRating: number,
): DuelState {
  const deck = buildDeck(domainId, seed);
  const now = Date.now();
  const rivalSeed = Math.floor(seededRandom(seed + 13)() * 9999);
  return {
    matchId: `match_${seed.toString(36).toUpperCase()}`,
    domainId,
    rounds: deck.map((question, i) => ({
      index: i,
      question,
      deadlineAt: now + (i + 1) * SCORE.roundDeadlineMs,
      self: null,
      opponent: null,
      resolved: false,
    })),
    currentIndex: 0,
    selfScore: 0,
    opponentScore: 0,
    selfStreak: 0,
    opponentStreak: 0,
    status: 'countdown',
    startedAt: now,
    opponentName: RIVAL_NAMES[rivalSeed % RIVAL_NAMES.length],
    opponentRating: Math.max(900, selfRating + Math.round((rivalSeed % 120) - 60)),
    opponentIsRival: true,
    selfRatingBefore: selfRating,
    selfRatingAfter: selfRating,
    ratingDelta: 0,
    ratingEligible: false,
    outcome: null,
  };
}

export function opponentAnswerFor(
  duel: DuelState,
  roundIndex: number,
): RoundAnswer {
  return simulateOpponentAnswer(
    duel.rounds[roundIndex].question,
    roundIndex,
    duel.startedAt % 100000,
  );
}

/** Resolve a round for both sides and update scores/streaks. */
export function resolveRound(
  duel: DuelState,
  roundIndex: number,
  selfAnswer: RoundAnswer,
  opponentAnswer: RoundAnswer,
): DuelState {
  const rounds = duel.rounds.map((r, i) =>
    i === roundIndex
      ? { ...r, self: selfAnswer, opponent: opponentAnswer, resolved: true }
      : r,
  );

  const selfPoints = roundPoints({
    correct: selfAnswer.correct,
    elapsedMs: selfAnswer.elapsedMs,
    streakBefore: duel.selfStreak,
    roundIndex: roundIndex + 1,
  });
  const oppPoints = roundPoints({
    correct: opponentAnswer.correct,
    elapsedMs: opponentAnswer.elapsedMs,
    streakBefore: duel.opponentStreak,
    roundIndex: roundIndex + 1,
  });

  const selfStreak = selfAnswer.correct ? duel.selfStreak + 1 : 0;
  const opponentStreak = opponentAnswer.correct ? duel.opponentStreak + 1 : 0;

  return {
    ...duel,
    rounds: rounds.map((r, i) =>
      i === roundIndex
        ? {
            ...r,
            self: { ...selfAnswer, points: selfPoints },
            opponent: { ...opponentAnswer, points: oppPoints },
          }
        : r,
    ),
    selfScore: duel.selfScore + selfPoints,
    opponentScore: duel.opponentScore + oppPoints,
    selfStreak,
    opponentStreak,
  };
}

export function finalizeDuel(duel: DuelState): DuelState {
  const outcome =
    duel.selfScore > duel.opponentScore
      ? 'WIN'
      : duel.selfScore < duel.opponentScore
        ? 'LOSS'
        : 'DRAW';

  // Arena Rival matches never enter human Glicko-2 — show honest practice progress.
  const ratingEligible = !duel.opponentIsRival;
  const baseDelta = outcome === 'WIN' ? 18 : outcome === 'LOSS' ? -14 : 2;
  const ratingDelta = ratingEligible
    ? baseDelta
    : outcome === 'WIN'
      ? 6
      : outcome === 'LOSS'
        ? -4
        : 1;

  return {
    ...duel,
    status: 'complete',
    outcome,
    ratingEligible,
    ratingDelta,
    selfRatingAfter: Math.max(800, duel.selfRatingBefore + ratingDelta),
  };
}

export function mechanicsInDeck(duel: DuelState): MechanicId[] {
  return duel.rounds.map((r) => r.question.mechanic);
}

export function scoreProgress(duel: DuelState) {
  const max = SCORE.rounds * (SCORE.base + SCORE.maxSpeedBonus) * 1.5;
  return Math.min(1, duel.selfScore / max);
}