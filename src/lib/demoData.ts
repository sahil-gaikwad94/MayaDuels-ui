import type { DomainId } from './domains';

export interface HistoryRow {
  id: string;
  opponent: string;
  opponentSeed: number;
  opponentRating: number;
  domainId: DomainId;
  result: 'W' | 'L' | 'D';
  selfScore: number;
  oppScore: number;
  delta: number;
  playedAt: string;
  accuracy: number;
  isRival: boolean;
}

const OPPONENTS = [
  'Rival 07',
  'Rival 12',
  'Rival 23',
  'Rival 31',
  'Rival 44',
  'Rival 58',
  'Rival 61',
  'Rival 72',
];

const DOMAIN_POOL: DomainId[] = [
  'AI_ML',
  'INFRA',
  'DATA',
  'WEB',
  'CORE_CS',
  'SECURITY',
];

/** Deterministic demo history so the UI is stable across reloads. */
export const DEMO_HISTORY: HistoryRow[] = Array.from({ length: 14 }).map(
  (_, i) => {
    const seed = (i + 3) * 7919;
    const rand = (n: number) => ((seed * (n + 11)) % 100) / 100;
    const result: 'W' | 'L' | 'D' =
      rand(1) > 0.62 ? 'W' : rand(2) > 0.86 ? 'D' : 'L';
    const selfScore = 780 + Math.floor(rand(3) * 380);
    const oppScore =
      result === 'W'
        ? selfScore - 60 - Math.floor(rand(4) * 160)
        : result === 'L'
          ? selfScore + 40 + Math.floor(rand(5) * 180)
          : selfScore;
    const daysAgo = i < 3 ? 0 : Math.floor(i / 2);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - i * 3);
    return {
      id: `demo_${i}`,
      opponent: OPPONENTS[i % OPPONENTS.length],
      opponentSeed: (seed % 89) + 1,
      opponentRating: 1200 + Math.floor(rand(6) * 420),
      domainId: DOMAIN_POOL[i % DOMAIN_POOL.length],
      result,
      selfScore,
      oppScore,
      delta:
        result === 'W'
          ? 12 + Math.floor(rand(7) * 14)
          : result === 'L'
            ? -(8 + Math.floor(rand(8) * 10))
            : 1,
      playedAt: date.toISOString(),
      accuracy: 50 + Math.floor(rand(9) * 45),
      isRival: i % 3 !== 1,
    };
  },
);

export interface LeaderRow {
  rank: number;
  handle: string;
  seed: number;
  rating: number;
  wins: number;
  matches: number;
  country: string;
  trend: number;
  isYou?: boolean;
}

const HANDLES = [
  'kernelpanic',
  'tls_heartbeat',
  'backpressure',
  'cachecarver',
  'nullptr_nina',
  'seq_and_continue',
  'vector_v',
  'oom_killer',
  'graphite',
  'async_await',
  'page_fault',
  'quorum',
];

export const DEMO_LEADERS: LeaderRow[] = HANDLES.map((handle, i) => ({
  rank: i + 1,
  handle,
  seed: (i * 37 + 11) % 97,
  rating: 1980 - i * 34 - (i % 3) * 7,
  wins: 240 - i * 12,
  matches: 320 - i * 14,
  country: ['US', 'DE', 'IN', 'GB', 'BR', 'JP', 'CA', 'FR', 'NL', 'SE', 'PL', 'AU'][i],
  trend: i % 4 === 0 ? 18 : i % 4 === 1 ? -9 : i % 4 === 2 ? 6 : 0,
}));

export const DEMO_YOU: LeaderRow = {
  rank: 1284,
  handle: 'you',
  seed: 7,
  rating: 1482,
  wins: 86,
  matches: 148,
  country: '—',
  trend: 18,
  isYou: true,
};

export interface VaultSeed {
  conceptId: string;
  concept: string;
  domainId: DomainId;
  principle: string;
  why: string;
  tradeoff?: string;
  stage: number;
  dueInDays: number;
  missCount: number;
}

export const DEMO_VAULT: VaultSeed[] = [
  {
    conceptId: 'false_sharing',
    concept: 'False sharing',
    domainId: 'DATA',
    principle:
      'Two threads writing independent fields on the same cache line still contend for the line.',
    why: 'Coherence is tracked per cache line, not per variable. Padding or alignment removes the contention.',
    tradeoff: 'Padding costs memory to buy throughput.',
    stage: 1,
    dueInDays: 0,
    missCount: 2,
  },
  {
    conceptId: 'singleflight',
    concept: 'Singleflight / request coalescing',
    domainId: 'INFRA',
    principle:
      'Collapse concurrent identical misses so one request rebuilds the value.',
    why: 'Prevents a hot-key expiry from turning into a thundering herd against the database.',
    tradeoff: 'Adds wait latency for the coalesced requests.',
    stage: 0,
    dueInDays: 0,
    missCount: 1,
  },
  {
    conceptId: 'rmsnorm',
    concept: 'RMSNorm',
    domainId: 'AI_ML',
    principle:
      'Normalizes by root-mean-square without subtracting the mean or using batch statistics.',
    why: 'Cheaper and more stable than BatchNorm at small or large batch sizes in Transformer blocks.',
    tradeoff: 'Loses the centering benefit that helps some convolutional stacks.',
    stage: 3,
    dueInDays: 5,
    missCount: 0,
  },
  {
    conceptId: 'http2_hol',
    concept: 'HTTP/2 head-of-line blocking',
    domainId: 'WEB',
    principle:
      'HTTP/2 removes application-layer HOL blocking but a lost TCP segment still blocks all streams.',
    why: 'Explains why HTTP/3 moved streams onto QUIC over UDP.',
    tradeoff: 'HTTP/2 keeps a single connection but inherits TCP behaviour.',
    stage: 2,
    dueInDays: 2,
    missCount: 1,
  },
  {
    conceptId: 'two_phase_commit',
    concept: 'Two-phase commit',
    domainId: 'DATA',
    principle:
      'Prepare then commit across participants for cross-shard atomicity.',
    why: 'A coordinator failure can block participants, which is why many systems prefer sagas.',
    tradeoff: 'Strong atomicity versus availability.',
    stage: 4,
    dueInDays: 12,
    missCount: 0,
  },
  {
    conceptId: 'mutex_fairness',
    concept: 'Mutex ordering',
    domainId: 'CORE_CS',
    principle:
      'A mutex guarantees mutual exclusion, not arrival-order acquisition.',
    why: 'Unfair wakeups can starve threads; fair locks trade throughput for bounded waiting.',
    tradeoff: 'Queue-based locks cost more on the fast path.',
    stage: 1,
    dueInDays: 1,
    missCount: 1,
  },
  {
    conceptId: 'argon2',
    concept: 'Password hashing with Argon2id',
    domainId: 'SECURITY',
    principle:
      'Use a salted, memory-hard KDF with a tuned cost, never a single fast hash round.',
    why: 'Fast hashes are GPU-friendly and cheap to brute force.',
    tradeoff: 'Higher cost increases login latency.',
    stage: 0,
    dueInDays: 0,
    missCount: 3,
  },
  {
    conceptId: 'softmax_temperature',
    concept: 'Softmax temperature',
    domainId: 'AI_ML',
    principle:
      'As temperature → ∞ the scaled logits flatten and probabilities approach uniform.',
    why: 'Temperature controls the entropy of the sampling distribution.',
    tradeoff: 'High temperature increases diversity but reduces exploitation.',
    stage: 2,
    dueInDays: 3,
    missCount: 0,
  },
];

export interface Cosmetic {
  id: string;
  name: string;
  kind: 'frames' | 'nameplates' | 'themes';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  owned: boolean;
  preview: string;
}

export const COSMETICS: Cosmetic[] = [
  {
    id: 'frame-graphite',
    name: 'Graphite',
    kind: 'frames',
    rarity: 'common',
    requirement: 'Default',
    owned: true,
    preview: 'linear-gradient(135deg,#2A3140,#12151D)',
  },
  {
    id: 'frame-cyan',
    name: 'Signal Cyan',
    kind: 'frames',
    rarity: 'rare',
    requirement: 'Reach Specialist',
    owned: true,
    preview: 'linear-gradient(135deg,#00F5D4,#0B3B36)',
  },
  {
    id: 'frame-magenta',
    name: 'Overdrive',
    kind: 'frames',
    rarity: 'epic',
    requirement: 'Win an Overdrive round',
    owned: false,
    preview: 'linear-gradient(135deg,#FF2A85,#3A0A1E)',
  },
  {
    id: 'frame-amber',
    name: 'Anomaly',
    kind: 'frames',
    rarity: 'legendary',
    requirement: 'Complete 10 Daily Anomalies',
    owned: false,
    preview: 'linear-gradient(135deg,#FFB800,#3A2A00)',
  },
  {
    id: 'plate-obsidian',
    name: 'Obsidian',
    kind: 'nameplates',
    rarity: 'common',
    requirement: 'Default',
    owned: true,
    preview: 'linear-gradient(90deg,#0A0C12,#1A1F2B)',
  },
  {
    id: 'plate-titanium',
    name: 'Brushed Titanium',
    kind: 'nameplates',
    rarity: 'rare',
    requirement: 'Play 25 duels',
    owned: true,
    preview: 'linear-gradient(90deg,#8E99A8,#C6D0DC)',
  },
  {
    id: 'plate-redline',
    name: 'Redline',
    kind: 'nameplates',
    rarity: 'epic',
    requirement: 'Reach Architect in Security',
    owned: false,
    preview: 'linear-gradient(90deg,#FF2A85,#7A1140)',
  },
  {
    id: 'theme-obsidian',
    name: 'Obsidian Arena',
    kind: 'themes',
    rarity: 'common',
    requirement: 'Default',
    owned: true,
    preview: 'linear-gradient(135deg,#090A0F,#181D28)',
  },
  {
    id: 'theme-forge',
    name: 'Forge Floor',
    kind: 'themes',
    rarity: 'rare',
    requirement: 'Master Neural Forge',
    owned: false,
    preview: 'linear-gradient(135deg,#062A26,#00F5D4)',
  },
  {
    id: 'theme-vault',
    name: 'Vault Light',
    kind: 'themes',
    rarity: 'epic',
    requirement: 'Master Data Vault',
    owned: false,
    preview: 'linear-gradient(135deg,#2A1F00,#FFB800)',
  },
];

export const ACHIEVEMENTS = [
  {
    id: 'first_duel',
    name: 'First Contact',
    detail: 'Complete your first duel',
    earned: true,
    icon: '⚡',
  },
  {
    id: 'streak5',
    name: 'Five Alive',
    detail: 'Answer five correctly in a row',
    earned: true,
    icon: '🔥',
  },
  {
    id: 'overdrive',
    name: 'Overdrive',
    detail: 'Win an Overdrive round',
    earned: true,
    icon: '🌀',
  },
  {
    id: 'architect',
    name: 'Architect',
    detail: 'Reach the Architect division',
    earned: false,
    icon: '🏛️',
  },
  {
    id: 'vault10',
    name: 'Curator',
    detail: 'Save 10 concepts to the Vault',
    earned: false,
    icon: '📚',
  },
  {
    id: 'anomaly7',
    name: 'Anomaly Hunter',
    detail: 'Complete 7 Daily Anomalies',
    earned: false,
    icon: '🛰️',
  },
];