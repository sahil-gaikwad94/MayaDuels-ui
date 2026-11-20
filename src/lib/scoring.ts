/**
 * Scoring model from the V3 product brief §8.1.
 * round_points = floor((B + speed_bonus) * streak_multiplier * overdrive_multiplier)
 * speed_bonus = V * (1 - clamp(t, 0, T) / T) ^ gamma
 */
export const SCORE = {
  base: 100,
  maxSpeedBonus: 60,
  roundDeadlineMs: 7500,
  gamma: 1.4,
  streakTiers: [
    { minStreak: 5, multiplier: 1.2 },
    { minStreak: 3, multiplier: 1.1 },
    { minStreak: 0, multiplier: 1.0 },
  ],
  overdriveMultiplier: 1.5,
  rounds: 8,
  overdriveRound: 8,
} as const;

export function speedBonus(elapsedMs: number) {
  const t = Math.min(Math.max(elapsedMs, 0), SCORE.roundDeadlineMs);
  const ratio = 1 - t / SCORE.roundDeadlineMs;
  return SCORE.maxSpeedBonus * Math.pow(ratio, SCORE.gamma);
}

export function streakMultiplier(streak: number) {
  for (const tier of SCORE.streakTiers) {
    if (streak >= tier.minStreak) return tier.multiplier;
  }
  return 1;
}

export function roundPoints({
  correct,
  elapsedMs,
  streakBefore,
  roundIndex,
}: {
  correct: boolean;
  elapsedMs: number;
  streakBefore: number;
  roundIndex: number;
}) {
  if (!correct) return 0;
  const base = SCORE.base + speedBonus(elapsedMs);
  const streak = streakMultiplier(streakBefore);
  const overdrive = roundIndex === SCORE.overdriveRound ? SCORE.overdriveMultiplier : 1;
  return Math.floor(base * streak * overdrive);
}

export function streakTierLabel(streak: number) {
  const mult = streakMultiplier(streak);
  if (mult >= 1.2) return '1.2×';
  if (mult >= 1.1) return '1.1×';
  return '1.0×';
}

export function nextStreakThreshold(streak: number) {
  if (streak < 3) return 3;
  if (streak < 5) return 5;
  return null;
}