export type DomainId =
  | 'AI_ML'
  | 'INFRA'
  | 'DATA'
  | 'WEB'
  | 'CORE_CS'
  | 'SECURITY'
  | 'OMNI';

export type MechanicId =
  | 'TRIAD_COMPRESSION'
  | 'ARCHITECTURE_TRIAGE'
  | 'SHIFT_THE_KNOB'
  | 'MYTHBUSTER';

export interface Domain {
  id: DomainId;
  arena: string;
  short: string;
  tagline: string;
  description: string;
  accent: string;
  accentSoft: string;
  rating: number;
  matches: number;
  mastery: number;
  provisional: boolean;
  topics: string[];
  trend: number[];
  difficulty: 'Foundation' | 'Applied' | 'Advanced' | 'Expert';
  contentReady: boolean;
  playersLabel: string;
}

export const DOMAINS: Domain[] = [
  {
    id: 'AI_ML',
    arena: 'Neural Forge',
    short: 'AI / ML',
    tagline: 'Inference, training dynamics & model architecture',
    description:
      'Read the mechanism behind a model: attention, normalization, sampling, quantization and the economics of inference at scale.',
    accent: '#00F5D4',
    accentSoft: 'rgba(0,245,212,0.14)',
    rating: 1482,
    matches: 148,
    mastery: 72,
    provisional: false,
    topics: [
      'Transformers',
      'Inference economics',
      'Normalization',
      'Quantization',
      'Distributed training',
      'Retrieval',
      'Evaluation',
    ],
    trend: [1320, 1348, 1331, 1372, 1390, 1384, 1421, 1440, 1436, 1462, 1470, 1482],
    difficulty: 'Advanced',
    contentReady: true,
    playersLabel: '2.4k duelling',
  },
  {
    id: 'INFRA',
    arena: 'Systems Grid',
    short: 'Infrastructure',
    tagline: 'Distributed systems, queues & tail latency',
    description:
      'Reason about failure, backpressure and coordination: consensus, queues, containers, observability and the shape of an outage.',
    accent: '#9FB4C7',
    accentSoft: 'rgba(159,180,199,0.14)',
    rating: 1395,
    matches: 121,
    mastery: 64,
    provisional: false,
    topics: [
      'Consensus',
      'Queues',
      'Kubernetes',
      'Observability',
      'Reliability',
      'Networking',
      'Scaling',
    ],
    trend: [1288, 1301, 1318, 1309, 1340, 1352, 1348, 1366, 1381, 1377, 1390, 1395],
    difficulty: 'Advanced',
    contentReady: true,
    playersLabel: '1.9k duelling',
  },
  {
    id: 'DATA',
    arena: 'Data Vault',
    short: 'Data',
    tagline: 'Storage engines, transactions & query plans',
    description:
      'Go under the hood of databases: indexes, isolation levels, write-ahead logs, streaming and vector search trade-offs.',
    accent: '#FFB800',
    accentSoft: 'rgba(255,184,0,0.14)',
    rating: 1268,
    matches: 96,
    mastery: 51,
    provisional: false,
    topics: [
      'Indexing',
      'Transactions',
      'Storage engines',
      'Query plans',
      'Caching',
      'Streaming',
      'Vector search',
    ],
    trend: [1190, 1204, 1198, 1216, 1222, 1215, 1234, 1240, 1252, 1249, 1260, 1268],
    difficulty: 'Applied',
    contentReady: true,
    playersLabel: '1.6k duelling',
  },
  {
    id: 'WEB',
    arena: 'Runtime District',
    short: 'Web',
    tagline: 'Browsers, runtimes & web performance',
    description:
      'Understand the runtime you ship into: event loops, rendering, HTTP semantics, Core Web Vitals and application security.',
    accent: '#7FE3D4',
    accentSoft: 'rgba(127,227,212,0.14)',
    rating: 1510,
    matches: 173,
    mastery: 81,
    provisional: false,
    topics: [
      'Event loop',
      'Rendering',
      'HTTP',
      'Core Web Vitals',
      'Frontend architecture',
      'Web security',
      'APIs',
    ],
    trend: [1402, 1418, 1425, 1440, 1436, 1452, 1461, 1470, 1478, 1490, 1502, 1510],
    difficulty: 'Applied',
    contentReady: true,
    playersLabel: '2.8k duelling',
  },
  {
    id: 'CORE_CS',
    arena: 'Core Circuit',
    short: 'Core CS',
    tagline: 'Operating systems, memory & algorithms',
    description:
      'The fundamentals that decide real behaviour: CPU caches, memory models, concurrency, complexity and compilers.',
    accent: '#C9D4E2',
    accentSoft: 'rgba(201,212,226,0.14)',
    rating: 1442,
    matches: 134,
    mastery: 68,
    provisional: false,
    topics: [
      'Memory',
      'CPU / cache',
      'Concurrency',
      'Algorithms',
      'Data structures',
      'Compilers',
      'Complexity',
    ],
    trend: [1350, 1362, 1358, 1374, 1381, 1390, 1402, 1398, 1414, 1420, 1434, 1442],
    difficulty: 'Advanced',
    contentReady: true,
    playersLabel: '2.1k duelling',
  },
  {
    id: 'SECURITY',
    arena: 'Redline Protocol',
    short: 'Security',
    tagline: 'Threat modelling & defensive reasoning',
    description:
      'Think like an attacker, decide like a defender: cryptography, identity, secure design and incident response under pressure.',
    accent: '#FF2A85',
    accentSoft: 'rgba(255,42,133,0.14)',
    rating: 1188,
    matches: 74,
    mastery: 38,
    provisional: true,
    topics: [
      'Cryptography',
      'Identity',
      'Threat modelling',
      'AppSec',
      'Network security',
      'Incident response',
    ],
    trend: [1104, 1112, 1128, 1121, 1140, 1146, 1152, 1160, 1155, 1172, 1180, 1188],
    difficulty: 'Applied',
    contentReady: true,
    playersLabel: '1.2k duelling',
  },
];

export const OMNI_DOMAIN: Domain = {
  id: 'OMNI',
  arena: 'Omni Arena',
  short: 'All arenas',
  tagline: 'Every domain, one deck',
  description:
    'A mixed deck drawn from all six arenas. The widest test of engineering instinct — and the least forgiving.',
  accent: '#00F5D4',
  accentSoft: 'rgba(0,245,212,0.12)',
  rating: 1404,
  matches: 58,
  mastery: 61,
  provisional: false,
  topics: ['Mixed deck', 'All domains', 'Adaptive'],
  trend: [1310, 1322, 1330, 1326, 1348, 1352, 1366, 1372, 1388, 1394, 1400, 1404],
  difficulty: 'Expert',
  contentReady: true,
  playersLabel: '3.1k duelling',
};

export const ALL_ARENAS: Domain[] = [...DOMAINS, OMNI_DOMAIN];

export function getDomain(id: string | undefined | null): Domain {
  if (!id) return DOMAINS[0];
  return ALL_ARENAS.find((d) => d.id === id) ?? DOMAINS[0];
}

export const MECHANICS: Record<
  MechanicId,
  { name: string; short: string; blurb: string }
> = {
  TRIAD_COMPRESSION: {
    name: 'Triad Compression',
    short: 'Triad',
    blurb: 'Three constraints converge on one primitive.',
  },
  ARCHITECTURE_TRIAGE: {
    name: 'Architecture Triage',
    short: 'Triage',
    blurb: 'Read the telemetry, pick the highest-leverage fix.',
  },
  SHIFT_THE_KNOB: {
    name: 'Shift the Knob',
    short: 'Knob',
    blurb: 'Predict the emergent behaviour at the extreme.',
  },
  MYTHBUSTER: {
    name: 'Mythbuster',
    short: 'Myth',
    blurb: 'Find the flaw in a confident engineering claim.',
  },
};

export interface Division {
  name: string;
  min: number;
  color: string;
}

export const DIVISIONS: readonly Division[] = [
  { name: 'Initiate', min: 0, color: '#6E7789' },
  { name: 'Builder', min: 1200, color: '#9FB4C7' },
  { name: 'Specialist', min: 1400, color: '#00F5D4' },
  { name: 'Architect', min: 1600, color: '#FFB800' },
  { name: 'Grandmaster', min: 1800, color: '#FF2A85' },
];

export function divisionFor(rating: number): Division {
  let current: Division = DIVISIONS[0];
  for (const d of DIVISIONS) if (rating >= d.min) current = d;
  return current;
}

export function nextDivision(rating: number): Division | null {
  return DIVISIONS.find((d) => d.min > rating) ?? null;
}