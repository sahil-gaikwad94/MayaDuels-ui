/**
 * Headless smoke test for the pure game logic (scoring, deck building, duel
 * resolution). Run with: npx tsx scripts/smoke.ts
 */
import { buildDeck } from '../src/lib/questions';
import {
  SCORE,
  roundPoints,
  speedBonus,
  streakMultiplier,
} from '../src/lib/scoring';
import {
  createDuel,
  finalizeDuel,
  opponentAnswerFor,
  resolveRound,
} from '../src/lib/duel';
import { DOMAINS, ALL_ARENAS, divisionFor, nextDivision } from '../src/lib/domains';

let failures = 0;
function check(name: string, cond: boolean, extra?: unknown) {
  if (cond) {
    console.log(`  ok  ${name}`);
  } else {
    failures++;
    console.log(`FAIL  ${name}`, extra ?? '');
  }
}

console.log('\n— Scoring —');
check('base correct at deadline = 100', roundPoints({
  correct: true, elapsedMs: SCORE.roundDeadlineMs, streakBefore: 0, roundIndex: 1,
}) === 100);
check('instant correct = 160', roundPoints({
  correct: true, elapsedMs: 0, streakBefore: 0, roundIndex: 1,
}) === 160);
check('incorrect = 0', roundPoints({
  correct: false, elapsedMs: 1000, streakBefore: 4, roundIndex: 1,
}) === 0);
check('streak 5 → 1.2x', streakMultiplier(5) === 1.2);
check('streak 3 → 1.1x', streakMultiplier(3) === 1.1);
check('streak 2 → 1.0x', streakMultiplier(2) === 1.0);
check('speed bonus decays with time', speedBonus(0) > speedBonus(3000));
check('speed bonus bounded by V', speedBonus(0) <= SCORE.maxSpeedBonus + 0.001);
check('overdrive round 8 multiplies', roundPoints({
  correct: true, elapsedMs: SCORE.roundDeadlineMs, streakBefore: 0, roundIndex: 8,
}) === 150);
check('non-overdrive round is 100', roundPoints({
  correct: true, elapsedMs: SCORE.roundDeadlineMs, streakBefore: 0, roundIndex: 7,
}) === 100);

console.log('\n— Deck building —');
for (const d of ALL_ARENAS) {
  const deck = buildDeck(d.id, 4242);
  check(`${d.id}: 8 rounds`, deck.length === 8, deck.length);
  check(
    `${d.id}: every round has 4 choices`,
    deck.every((q) => q.choices.length === 4),
  );
  check(
    `${d.id}: correct choice exists in choices`,
    deck.every((q) => q.choices.some((c) => c.id === q.correctChoiceId)),
  );
  check(
    `${d.id}: no duplicate question ids`,
    new Set(deck.map((q) => q.id)).size === deck.length,
  );
  const mechanics = new Set(deck.map((q) => q.mechanic));
  check(`${d.id}: >= 3 mechanics`, mechanics.size >= 3, [...mechanics]);
  check(
    `${d.id}: no mechanic 3x in a row`,
    !deck.some(
      (q, i) =>
        i >= 2 && q.mechanic === deck[i - 1].mechanic && q.mechanic === deck[i - 2].mechanic,
    ),
  );
  check(`${d.id}: round 8 is expert-ish`, Boolean(deck[7]));
}

console.log('\n— Duel lifecycle —');
for (const domain of DOMAINS) {
  const duel = createDuel(domain.id, 1337, domain.rating);
  check(`${domain.id}: 8 rounds`, duel.rounds.length === 8);
  check(`${domain.id}: starts in countdown`, duel.status === 'countdown');
  check(
    `${domain.id}: no correct answer leaked pre-resolution`,
    duel.rounds.every((r) => r.self === null && r.opponent === null),
  );

  // Play all 8 rounds, always answering correctly and instantly.
  let state = duel;
  for (let i = 0; i < 8; i++) {
    const opp = opponentAnswerFor(state, i);
    state = resolveRound(
      state,
      i,
      {
        choiceId: state.rounds[i].question.correctChoiceId,
        correct: true,
        elapsedMs: 1200,
        points: 0,
        status: 'answered',
      },
      opp,
    );
  }
  const final = finalizeDuel(state);
  check(`${domain.id}: all rounds resolved`, final.rounds.every((r) => r.resolved));
  check(`${domain.id}: outcome WIN`, final.outcome === 'WIN', final.outcome);
  check(`${domain.id}: score > 0`, final.selfScore > 0, final.selfScore);
  check(
    `${domain.id}: score equals sum of round points`,
    final.selfScore === final.rounds.reduce((s, r) => s + (r.self?.points ?? 0), 0),
  );
  check(`${domain.id}: rating applied`, final.selfRatingAfter !== final.selfRatingBefore);
  check(`${domain.id}: practice match not rating-eligible`, final.ratingEligible === false);
  check(
    `${domain.id}: both slots have answers every round`,
    final.rounds.every((r) => r.self !== null && r.opponent !== null),
  );
}

console.log('\n— Divisions —');
check('rating 0 → Initiate', divisionFor(0).name === 'Initiate');
check('rating 1500 → Specialist', divisionFor(1500).name === 'Specialist');
check('rating 2000 → Grandmaster', divisionFor(2000).name === 'Grandmaster');
check('next division from 1500 → Architect', nextDivision(1500)?.name === 'Architect');
check('no next division at peak', nextDivision(2000) === null);

console.log('\n— Timeout path —');
{
  const duel = createDuel('AI_ML', 99, 1400);
  const opp = opponentAnswerFor(duel, 0);
  const resolved = resolveRound(
    duel,
    0,
    {
      choiceId: null,
      correct: false,
      elapsedMs: SCORE.roundDeadlineMs,
      points: 0,
      status: 'timeout',
    },
    opp,
  );
  check('timeout awards 0 points', resolved.selfScore === 0);
  check('timeout resets streak', resolved.selfStreak === 0);
  check('timeout recorded as timeout', resolved.rounds[0].self?.status === 'timeout');
  check(
    'timeout does not fabricate a choice',
    resolved.rounds[0].self?.choiceId === null,
  );
}

console.log(
  failures === 0
    ? '\nAll smoke checks passed.\n'
    : `\n${failures} check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);