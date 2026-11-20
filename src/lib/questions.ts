import type { DomainId, MechanicId } from './domains';

export type DifficultyBand = 'Foundation' | 'Applied' | 'Advanced' | 'Expert';

export interface Choice {
  id: string;
  label: string;
}

export interface Telemetry {
  label: string;
  value: string;
  tone?: 'neutral' | 'warn' | 'crit' | 'good';
}

export interface Question {
  id: string;
  version: number;
  domain: DomainId;
  subtopic: string;
  conceptId: string;
  concept: string;
  mechanic: MechanicId;
  difficultyBand: DifficultyBand;
  prompt: string;
  clues?: string[];
  telemetry?: Telemetry[];
  knob?: { label: string; from: string; to: string; position: number };
  claim?: string;
  choices: Choice[];
  correctChoiceId: string;
  explanation: {
    summary: string;
    mentalModel: string;
    tradeoff?: string;
  };
  source: string;
}

export const QUESTIONS: Question[] = [
  {
    id: 'q_rmsnorm',
    version: 3,
    domain: 'AI_ML',
    subtopic: 'Normalization',
    conceptId: 'rmsnorm',
    concept: 'RMSNorm',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Applied',
    prompt: 'Which primitive satisfies all three constraints?',
    clues: [
      'Normalizes activations across feature channels',
      'Does not depend on batch statistics',
      'Standard inside Transformer blocks',
    ],
    choices: [
      { id: 'batchnorm', label: 'BatchNorm' },
      { id: 'rmsnorm', label: 'RMSNorm' },
      { id: 'weightdecay', label: 'Weight decay' },
      { id: 'dropout', label: 'Dropout' },
    ],
    correctChoiceId: 'rmsnorm',
    explanation: {
      summary:
        'RMSNorm divides by the root-mean-square of the normalized axis and rescales with a learned gain — no mean subtraction, no batch dependence.',
      mentalModel:
        'RMSNorm is a cheaper, batch-independent alternative to LayerNorm: same scale invariance, fewer reductions.',
      tradeoff:
        'It drops the centering step, which occasionally matters for convolutional features but is rarely needed in deep Transformer stacks.',
    },
    source: 'Zhang & Sennrich, "Root Mean Square Layer Normalization", 2019',
  },
  {
    id: 'q_softmax_temp',
    version: 2,
    domain: 'AI_ML',
    subtopic: 'Sampling math',
    conceptId: 'softmax_temperature',
    concept: 'Softmax temperature',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Applied',
    prompt:
      'In standard temperature-scaled softmax, what happens to the distribution as T → ∞?',
    knob: { label: 'Softmax temperature', from: 'T → 0', to: 'T → ∞', position: 88 },
    choices: [
      { id: 'uniform', label: 'Uniform' },
      { id: 'greedy', label: 'Greedy' },
      { id: 'zero_entropy', label: 'Zero entropy' },
      { id: 'one_hot', label: 'One-hot' },
    ],
    correctChoiceId: 'uniform',
    explanation: {
      summary:
        'Dividing finite logits by a very large temperature shrinks their scaled differences toward zero, so every class approaches equal probability.',
      mentalModel:
        'Temperature rescales the logit gaps. Large T flattens the distribution; small T sharpens it toward argmax.',
      tradeoff:
        'High temperature raises diversity but lowers the chance of sampling the highest-logit token.',
    },
    source: 'Standard softmax formulation with temperature scaling',
  },
  {
    id: 'q_hot_key',
    version: 4,
    domain: 'INFRA',
    subtopic: 'Caching',
    conceptId: 'cache_stampede',
    concept: 'Cache stampede',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Advanced',
    prompt:
      'A hot cache key expires and thousands of requests miss simultaneously, saturating PostgreSQL. What is the highest-leverage first move?',
    telemetry: [
      { label: 'Cache', value: 'HOT KEY EXPIRED', tone: 'crit' },
      { label: 'DB CPU', value: '100%', tone: 'crit' },
      { label: 'Traffic', value: '14.2k → 41k rps', tone: 'warn' },
    ],
    choices: [
      { id: 'singleflight', label: 'Singleflight' },
      { id: 'connections', label: 'More DB connections' },
      { id: 'write_through', label: 'Write-through cache' },
      { id: 'hashing', label: 'Consistent hashing' },
    ],
    correctChoiceId: 'singleflight',
    explanation: {
      summary:
        'Collapse concurrent misses so exactly one request rebuilds the key while the rest wait or briefly serve stale data.',
      mentalModel:
        'A stampede is a coordination failure, not a capacity failure. Fix the fan-in before adding capacity.',
      tradeoff:
        'Singleflight adds a small wait for coalesced callers; stale-while-revalidate removes the wait but tolerates briefly old data.',
    },
    source: 'Cache stampede / request coalescing literature',
  },
  {
    id: 'q_kafka_partitions',
    version: 2,
    domain: 'INFRA',
    subtopic: 'Queues',
    conceptId: 'consumer_parallelism',
    concept: 'Consumer parallelism',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Applied',
    prompt:
      'A topic has 12 partitions. Consumers in one group scale from 1 instance to 36. What happens to end-to-end throughput?',
    knob: { label: 'Consumer instances', from: '1', to: '36', position: 76 },
    choices: [
      { id: 'linear', label: 'Scales linearly' },
      { id: 'plateau', label: 'Plateaus at 12 effective consumers' },
      { id: 'collapse', label: 'Collapses from rebalancing' },
      { id: 'batch', label: 'Depends only on batch size' },
    ],
    correctChoiceId: 'plateau',
    explanation: {
      summary:
        'Within a consumer group each partition is served by at most one consumer, so instances beyond the partition count sit idle.',
      mentalModel:
        'Parallelism ceiling = partition count. Extra consumers add coordination cost, not throughput.',
      tradeoff:
        'More partitions raise parallelism and rebalance cost; fewer partitions give coarser but cheaper scaling.',
    },
    source: 'Kafka consumer group semantics',
  },
  {
    id: 'q_false_sharing',
    version: 1,
    domain: 'DATA',
    subtopic: 'Storage engines',
    conceptId: 'false_sharing',
    concept: 'False sharing',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Advanced',
    prompt: 'Evaluate the claim.',
    claim:
      'Two threads updating independent fields of the same cache line cannot interfere with each other.',
    choices: [
      { id: 'false_sharing', label: 'False sharing' },
      { id: 'data_race', label: 'Data race' },
      { id: 'false_positive', label: 'False positive' },
      { id: 'valid', label: 'Valid principle' },
    ],
    correctChoiceId: 'false_sharing',
    explanation: {
      summary:
        'Coherence is tracked per cache line, not per variable. A write invalidates the line in other cores even when the fields differ.',
      mentalModel:
        'The cache line is the unit of sharing. Independent data in one line still serializes.',
      tradeoff:
        'Padding or aligning fields fixes it but costs memory and can reduce cache density.',
    },
    source: 'CPU cache coherence / MESI protocol',
  },
  {
    id: 'q_two_phase_commit',
    version: 2,
    domain: 'DATA',
    subtopic: 'Transactions',
    conceptId: 'two_phase_commit',
    concept: 'Two-phase commit',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Advanced',
    prompt: 'Which protocol satisfies all three constraints?',
    clues: [
      'Keeps atomicity across multiple shards',
      'Requires a coordinator and a prepare phase',
      'Blocks if the coordinator fails mid-commit',
    ],
    choices: [
      { id: 'replica', label: 'Read replica' },
      { id: '2pc', label: 'Two-phase commit' },
      { id: 'columnar', label: 'Columnar index' },
      { id: 'wal', label: 'Write-ahead log' },
    ],
    correctChoiceId: '2pc',
    explanation: {
      summary:
        'A coordinator asks all participants to prepare, then commits only if every participant voted yes.',
      mentalModel:
        '2PC buys atomicity across services by adding a blocking dependency on the coordinator.',
      tradeoff:
        'Strong atomicity versus availability: many systems prefer sagas with idempotent retries over blocking 2PC.',
    },
    source: 'Gray, "Notes on Distributed Databases", 1978',
  },
  {
    id: 'q_lcp',
    version: 3,
    domain: 'WEB',
    subtopic: 'Web performance',
    conceptId: 'lcp_priority',
    concept: 'LCP prioritisation',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Applied',
    prompt:
      'Mobile LCP is 4.2s. The hero image is 1.8MB and a webfont blocks first paint. What is the highest-leverage first move?',
    telemetry: [
      { label: 'LCP', value: '4.2 s', tone: 'crit' },
      { label: 'Hero image', value: '1.8 MB', tone: 'warn' },
      { label: 'Font', value: 'render-blocking', tone: 'warn' },
    ],
    choices: [
      { id: 'defer_js', label: 'Defer all JavaScript' },
      { id: 'preload_font', label: 'Preload hero + swap font' },
      { id: 'sw', label: 'Add a service worker' },
      { id: 'gzip', label: 'Enable gzip' },
    ],
    correctChoiceId: 'preload_font',
    explanation: {
      summary:
        'LCP is gated by the largest paint. Prioritise its discovery and remove render-blocking resources from the critical path.',
      mentalModel:
        'Optimise the resource that determines the largest paint, not every resource equally.',
      tradeoff:
        'Over-preloading starves other requests; preload only the true LCP candidate and let the rest stream in.',
    },
    source: 'web.dev — Largest Contentful Paint',
  },
  {
    id: 'q_http2_hol',
    version: 1,
    domain: 'WEB',
    subtopic: 'HTTP',
    conceptId: 'http2_hol',
    concept: 'HTTP/2 head-of-line blocking',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Advanced',
    prompt: 'Evaluate the claim.',
    claim: 'Moving from HTTP/1.1 to HTTP/2 removes head-of-line blocking entirely.',
    choices: [
      { id: 'tcp_blocks', label: 'False — TCP still blocks' },
      { id: 'streams_independent', label: 'True — streams are independent' },
      { id: 'grpc_only', label: 'Only for gRPC' },
      { id: 'tls13_only', label: 'Only with TLS 1.3' },
    ],
    correctChoiceId: 'tcp_blocks',
    explanation: {
      summary:
        'HTTP/2 removes application-layer head-of-line blocking, but a single lost TCP segment stalls every stream on that connection.',
      mentalModel:
        'Multiplexing fixes HOL at the framing layer; only moving streams off one ordered transport fixes it end to end.',
      tradeoff:
        'HTTP/3 moves streams onto QUIC over UDP, trading TCP maturity for per-stream independence.',
    },
    source: 'RFC 9113 / HTTP/3 design notes',
  },
  {
    id: 'q_mutex_order',
    version: 2,
    domain: 'CORE_CS',
    subtopic: 'Concurrency',
    conceptId: 'mutex_fairness',
    concept: 'Mutex fairness',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Foundation',
    prompt: 'Evaluate the claim.',
    claim: 'A mutex guarantees waiting threads acquire it in arrival order.',
    choices: [
      { id: 'no_order', label: 'No ordering guarantee' },
      { id: 'fifo', label: 'Guaranteed FIFO' },
      { id: 'priority', label: 'Guaranteed priority' },
      { id: 'linux_only', label: 'Only on Linux' },
    ],
    correctChoiceId: 'no_order',
    explanation: {
      summary:
        'A mutex guarantees mutual exclusion, not wake order. Scheduling and implementation decide who proceeds next.',
      mentalModel:
        'Mutual exclusion says nothing about fairness; starvation is a scheduler property, not a lock property.',
      tradeoff:
        'Fair (ticket/queue) locks bound waiting time but usually lower throughput under contention.',
    },
    source: 'POSIX threads / mutex semantics',
  },
  {
    id: 'q_cas',
    version: 1,
    domain: 'CORE_CS',
    subtopic: 'Algorithms',
    conceptId: 'compare_and_swap',
    concept: 'Compare-and-swap',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Foundation',
    prompt: 'Which primitive satisfies all three constraints?',
    clues: [
      'Atomic read-modify-write on one word',
      'Returns success or failure and never blocks',
      'Foundation of lock-free data structures',
    ],
    choices: [
      { id: 'cas', label: 'Compare-and-swap' },
      { id: 'tas', label: 'Test-and-set' },
      { id: 'semaphore', label: 'Counting semaphore' },
      { id: 'futex', label: 'Futex wait' },
    ],
    correctChoiceId: 'cas',
    explanation: {
      summary:
        'CAS writes a new value only if the current value still equals the expected one, returning whether it won the race.',
      mentalModel:
        'Optimistic concurrency: detect conflicts instead of preventing them, then retry.',
      tradeoff:
        'Lock-free progress under contention can degrade into livelock; wait-free designs bound steps but are harder to build.',
    },
    source: 'Herlihy & Shavit, The Art of Multiprocessor Programming',
  },
  {
    id: 'q_password_hash',
    version: 2,
    domain: 'SECURITY',
    subtopic: 'Identity',
    conceptId: 'password_hashing',
    concept: 'Password hashing',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Foundation',
    prompt: 'Evaluate the claim.',
    claim: 'Storing passwords as a single round of SHA-256 is sufficient for credential storage.',
    choices: [
      { id: 'fast_hash', label: 'Unsalted fast hash' },
      { id: 'kdf', label: 'Salted slow KDF' },
      { id: 'reversible', label: 'Reversible encryption' },
      { id: 'truncated', label: 'Truncated digest' },
    ],
    correctChoiceId: 'kdf',
    explanation: {
      summary:
        'Fast general-purpose hashes are GPU-friendly. Use a memory-hard, salted KDF such as Argon2id, scrypt or bcrypt with a tuned cost.',
      mentalModel:
        'Password storage should be deliberately expensive per guess and unique per user.',
      tradeoff:
        'Higher KDF cost slows legitimate logins; tune to your hardware envelope and rehash on login as costs rise.',
    },
    source: 'OWASP Password Storage Cheat Sheet',
  },
  {
    id: 'q_tls_handshake',
    version: 1,
    domain: 'SECURITY',
    subtopic: 'Network security',
    conceptId: 'tls_hsts',
    concept: 'TLS + HSTS',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Applied',
    prompt:
      'Users can still reach the site over plain HTTP and get redirected. What is the highest-leverage first move?',
    telemetry: [
      { label: 'TLS', value: 'valid, 2048-bit', tone: 'good' },
      { label: 'HSTS', value: 'absent', tone: 'crit' },
      { label: 'Redirect', value: '301 at edge', tone: 'warn' },
    ],
    choices: [
      { id: 'hsts', label: 'Enable HSTS with preload' },
      { id: 'longer_key', label: 'Move to a 4096-bit key' },
      { id: 'hide_server', label: 'Hide the server header' },
      { id: 'rotate_certs', label: 'Rotate certificates weekly' },
    ],
    correctChoiceId: 'hsts',
    explanation: {
      summary:
        'A redirect still gives the first plaintext request to an attacker. HSTS instructs browsers to go straight to HTTPS.',
      mentalModel:
        'Encrypt the first hop, not just the second. Trust-on-first-use must be replaced by a browser-pinned policy.',
      tradeoff:
        'HSTS is sticky: a wrong max-age or preload mistake can lock users out of HTTP for months.',
    },
    source: 'RFC 6797 — HTTP Strict Transport Security',
  },
  {
    id: 'q_event_loop',
    version: 2,
    domain: 'WEB',
    subtopic: 'Event loop',
    conceptId: 'microtask_starvation',
    concept: 'Microtask starvation',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Advanced',
    prompt:
      'A loop keeps scheduling resolved promises with queueMicrotask. What happens to rendering as the loop grows?',
    knob: { label: 'Microtask queue growth', from: 'bounded', to: 'unbounded', position: 82 },
    choices: [
      { id: 'renders_fine', label: 'Rendering stays smooth' },
      { id: 'starves_render', label: 'Rendering starves' },
      { id: 'blocks_io', label: 'Network I/O blocks' },
      { id: 'gc_only', label: 'Only GC pauses' },
    ],
    correctChoiceId: 'starves_render',
    explanation: {
      summary:
        'Microtasks drain completely before the browser yields to rendering, so an unbounded microtask queue prevents paint.',
      mentalModel:
        'Microtasks run to exhaustion; tasks yield. Starvation is a queue-discipline problem.',
      tradeoff:
        'Chunking work into tasks restores paint but adds scheduling latency and more task boundaries.',
    },
    source: 'HTML spec — event loop processing model',
  },
  {
    id: 'q_p99',
    version: 1,
    domain: 'INFRA',
    subtopic: 'Observability',
    conceptId: 'tail_latency',
    concept: 'Tail latency',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Advanced',
    prompt:
      'Median latency is 20 ms but p99 is 2.4 s. Users report timeouts. What is the highest-leverage first move?',
    telemetry: [
      { label: 'p50', value: '20 ms', tone: 'good' },
      { label: 'p99', value: '2.4 s', tone: 'crit' },
      { label: 'GC pause', value: '1.9 s spikes', tone: 'crit' },
    ],
    choices: [
      { id: 'hedged', label: 'Hedged requests' },
      { id: 'gc', label: 'Fix the GC pause source' },
      { id: 'cache_all', label: 'Cache everything' },
      { id: 'more_replicas', label: 'Add replicas evenly' },
    ],
    correctChoiceId: 'gc',
    explanation: {
      summary:
        'A 1.9 s pause inside a 2.4 s p99 points at one dominant cause. Hedging hides tail latency instead of removing it.',
      mentalModel:
        'Find the mechanism that owns the tail before adding redundancy around it.',
      tradeoff:
        'Fixing GC may mean allocation work or a collector change; hedging is faster to ship but doubles load on the tail.',
    },
    source: 'Google SRE Book — Addressing Tail Latency',
  },
  {
    id: 'q_btree_write',
    version: 1,
    domain: 'DATA',
    subtopic: 'Indexing',
    conceptId: 'btree_write_amplification',
    concept: 'B-tree write amplification',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Advanced',
    prompt:
      'A table grows from 10M to 1B rows with 12 secondary B-tree indexes. What happens to write throughput?',
    knob: { label: 'Secondary indexes', from: '2', to: '12', position: 85 },
    choices: [
      { id: 'unchanged', label: 'Roughly unchanged' },
      { id: 'drops', label: 'Drops sharply per insert' },
      { id: 'doubles', label: 'Doubles with row count' },
      { id: 'reads_only', label: 'Only reads slow down' },
    ],
    correctChoiceId: 'drops',
    explanation: {
      summary:
        'Every secondary index must be maintained on each insert, so write cost scales with index count and random I/O grows with depth.',
      mentalModel:
        'Indexes are read-optimised write taxes. Each one adds random writes and WAL volume.',
      tradeoff:
        'Fewer indexes speed writes but push work to scans; LSM trees trade read amplification for cheaper writes.',
    },
    source: 'Database internals — B-tree vs LSM write paths',
  },
  {
    id: 'q_isolation',
    version: 2,
    domain: 'DATA',
    subtopic: 'Transactions',
    conceptId: 'phantom_reads',
    concept: 'Phantom reads',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Advanced',
    prompt: 'Evaluate the claim.',
    claim:
      'Under REPEATABLE READ, a transaction that re-runs the same range query can never see new rows.',
    choices: [
      { id: 'snapshot_yes', label: 'True in snapshot isolation' },
      { id: 'depends_engine', label: 'False — engine dependent' },
      { id: 'always_true', label: 'True in all engines' },
      { id: 'only_postgres', label: 'Only PostgreSQL' },
    ],
    correctChoiceId: 'depends_engine',
    explanation: {
      summary:
        'REPEATABLE READ is defined by the anomalies it forbids, and implementations differ: snapshot engines prevent phantoms, lock-based engines may not.',
      mentalModel:
        'Isolation levels are contracts about anomalies, not about mechanisms. Check the engine.',
      tradeoff:
        'Snapshot isolation is non-blocking but can surface write skew; serializable adds validation and retries.',
    },
    source: 'PostgreSQL / MySQL InnoDB isolation documentation',
  },
  {
    id: 'q_dns_ttl',
    version: 1,
    domain: 'INFRA',
    subtopic: 'Networking',
    conceptId: 'dns_ttl_failover',
    concept: 'DNS TTL failover',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Applied',
    prompt: 'Evaluate the claim.',
    claim: 'Lowering a DNS record TTL to 30 seconds guarantees traffic moves to the new endpoint within a minute.',
    choices: [
      { id: 'resolvers', label: 'False — resolvers ignore TTL' },
      { id: 'true', label: 'True — TTL is honoured' },
      { id: 'only_aws', label: 'Only on managed DNS' },
      { id: 'tcp_only', label: 'Only for TCP records' },
    ],
    correctChoiceId: 'resolvers',
    explanation: {
      summary:
        'TTL is a hint. Stub resolvers, corporate caches and connection pools can hold records far longer than the published TTL.',
      mentalModel:
        'DNS failover is best-effort. Treat it as a hint, not a control-plane guarantee.',
      tradeoff:
        'Fast failover needs a load balancer or anycast layer in front; DNS alone cannot bound convergence.',
    },
    source: 'RFC 1035 TTL semantics / resolver behaviour studies',
  },
  {
    id: 'q_backpressure',
    version: 2,
    domain: 'INFRA',
    subtopic: 'Queues',
    conceptId: 'backpressure',
    concept: 'Backpressure',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Advanced',
    prompt: 'Which mechanism satisfies all three constraints?',
    clues: [
      'Signals an overloaded consumer to slow producers',
      'Bounded queues reject or delay instead of growing',
      'Keeps latency predictable under sustained overload',
    ],
    choices: [
      { id: 'retry', label: 'Unbounded retry loop' },
      { id: 'backpressure', label: 'Backpressure with bounded queues' },
      { id: 'sharding', label: 'Client-side sharding' },
      { id: 'batching', label: 'Larger batches' },
    ],
    correctChoiceId: 'backpressure',
    explanation: {
      summary:
        'Bounded queues plus explicit rejection or delay push back on producers so the system degrades instead of collapsing.',
      mentalModel:
        'Unbounded queues convert overload into latency; bounded queues convert it into visible rejection.',
      tradeoff:
        'Rejecting load is honest but user-visible; buffering more hides the problem and moves it into memory pressure.',
    },
    source: 'Reactive Streams / flow control literature',
  },
  {
    id: 'q_cache_aside',
    version: 1,
    domain: 'WEB',
    subtopic: 'APIs',
    conceptId: 'cache_invalidation',
    concept: 'Cache invalidation',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Applied',
    prompt:
      'A cache-aside service serves stale user settings after updates. What is the highest-leverage first move?',
    telemetry: [
      { label: 'Hit rate', value: '94%', tone: 'good' },
      { label: 'Stale reads', value: 'rising', tone: 'crit' },
      { label: 'Invalidation', value: 'on write, best-effort', tone: 'warn' },
    ],
    choices: [
      { id: 'ttl', label: 'Short TTL + versioned keys' },
      { id: 'bigger_cache', label: 'Increase cache size' },
      { id: 'no_cache', label: 'Disable caching' },
      { id: 'double_ttl', label: 'Double the TTL' },
    ],
    correctChoiceId: 'ttl',
    explanation: {
      summary:
        'Best-effort invalidation loses races. Versioned keys plus a short TTL bound staleness without dropping the cache.',
      mentalModel:
        'If you cannot guarantee invalidation, bound the damage with expiry and versioning.',
      tradeoff:
        'Shorter TTLs raise origin load; versioning adds key churn and requires old versions to expire.',
    },
    source: 'Cache-aside pattern / consistency trade-offs',
  },
  {
    id: 'q_gc_pause',
    version: 1,
    domain: 'CORE_CS',
    subtopic: 'Memory',
    conceptId: 'gc_pause_types',
    concept: 'GC pause types',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Advanced',
    prompt: 'Evaluate the claim.',
    claim: 'A stop-the-world collector pauses every mutator thread for its entire collection cycle.',
    choices: [
      { id: 'true_stw', label: 'True — all mutators pause' },
      { id: 'concurrent', label: 'False — concurrent collectors overlap' },
      { id: 'only_young', label: 'Only young generation pauses' },
      { id: 'only_server', label: 'Only server VMs' },
    ],
    correctChoiceId: 'concurrent',
    explanation: {
      summary:
        'Concurrent collectors such as ZGC, Shenandoah and Go’s collector do most marking while mutators run, with short pauses.',
      mentalModel:
        'Pause time is a design choice: throughput collectors pause hard, latency collectors do the work alongside you.',
      tradeoff:
        'Concurrency costs CPU and floating-garbage headroom; low-pause collectors trade throughput for tail latency.',
    },
    source: 'ZGC / Shenandoah design papers',
  },
  {
    id: 'q_idempotency',
    version: 2,
    domain: 'WEB',
    subtopic: 'APIs',
    conceptId: 'idempotency_keys',
    concept: 'Idempotency keys',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Applied',
    prompt: 'Which mechanism satisfies all three constraints?',
    clues: [
      'Makes a retried POST safe to repeat',
      'Requires the server to remember the first response',
      'Prevents duplicate charges or duplicate rows',
    ],
    choices: [
      { id: 'retry', label: 'Client retry with backoff' },
      { id: 'idempotency', label: 'Server-side idempotency key' },
      { id: 'put', label: 'Switch to PUT only' },
      { id: 'dedupe_ui', label: 'Disable the button' },
    ],
    correctChoiceId: 'idempotency',
    explanation: {
      summary:
        'A client-supplied key lets the server recognise a replay and return the stored result instead of executing again.',
      mentalModel:
        'Retries are inevitable; make the operation a function of the key, not of the attempt count.',
      tradeoff:
        'Keys must be stored with a retention window; unbounded retention is a memory and privacy cost.',
    },
    source: 'Stripe / IETF idempotency-key draft',
  },
  {
    id: 'q_attention_cost',
    version: 1,
    domain: 'AI_ML',
    subtopic: 'Transformers',
    conceptId: 'attention_cost',
    concept: 'Attention cost',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Advanced',
    prompt:
      'Context length grows from 4k to 128k tokens with full attention. What happens to compute per token?',
    knob: { label: 'Context length', from: '4k', to: '128k', position: 90 },
    choices: [
      { id: 'linear', label: 'Grows linearly' },
      { id: 'quadratic', label: 'Grows quadratically' },
      { id: 'flat', label: 'Stays flat' },
      { id: 'log', label: 'Grows logarithmically' },
    ],
    correctChoiceId: 'quadratic',
    explanation: {
      summary:
        'Full self-attention compares every token to every other, so cost scales with the square of sequence length.',
      mentalModel:
        'Attention is an all-pairs operation. Long context is expensive by construction, not by tuning.',
      tradeoff:
        'Sparse, sliding-window or linear attention cut cost but weaken exact long-range recall.',
    },
    source: 'Vaswani et al., "Attention Is All You Need"',
  },
  {
    id: 'q_rate_limit',
    version: 1,
    domain: 'SECURITY',
    subtopic: 'AppSec',
    conceptId: 'token_bucket',
    concept: 'Token bucket',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Applied',
    prompt:
      'A login endpoint is being credential-stuffed from many IPs at low rate each. What is the highest-leverage first move?',
    telemetry: [
      { label: 'Login fails', value: '12× baseline', tone: 'crit' },
      { label: 'Distinct IPs', value: '48k', tone: 'warn' },
      { label: 'Per-IP rate', value: 'below limits', tone: 'warn' },
    ],
    choices: [
      { id: 'per_account', label: 'Per-account + device risk throttling' },
      { id: 'per_ip', label: 'Tighten per-IP limits only' },
      { id: 'captcha_all', label: 'CAPTCHA every login' },
      { id: 'block_asn', label: 'Block hosting ASNs' },
    ],
    correctChoiceId: 'per_account',
    explanation: {
      summary:
        'Distributed stuffing evades per-IP limits. Throttle on the account and device signals that actually concentrate.',
      mentalModel:
        'Rate-limit the scarce resource being attacked — the account — not the abundant one — the IP.',
      tradeoff:
        'Aggressive per-account limits can lock out legitimate shared-network users; combine with step-up challenges.',
    },
    source: 'OWASP — Credential Stuffing Prevention',
  },
  {
    id: 'q_replica_lag',
    version: 2,
    domain: 'DATA',
    subtopic: 'Replication',
    conceptId: 'read_your_writes',
    concept: 'Read-your-writes',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Advanced',
    prompt: 'Evaluate the claim.',
    claim: 'Routing all reads to a read replica is safe for a profile page that was just updated.',
    choices: [
      { id: 'unsafe', label: 'False — replication lag' },
      { id: 'safe', label: 'True — replicas are synchronous' },
      { id: 'only_same_region', label: 'Only across regions' },
      { id: 'only_postgres', label: 'Only PostgreSQL' },
    ],
    correctChoiceId: 'unsafe',
    explanation: {
      summary:
        'Async replicas trail the primary, so a read right after a write can miss it. Read-your-writes needs pinning or quorum reads.',
      mentalModel:
        'Async replication buys throughput with a consistency window; user-visible writes must be pinned to the primary.',
      tradeoff:
        'Pinning loads the primary; session pinning or monotonic reads reduce the blast radius.',
    },
    source: 'Read-your-writes consistency literature',
  },
  {
    id: 'q_cpu_cache_line',
    version: 1,
    domain: 'CORE_CS',
    subtopic: 'CPU / cache',
    conceptId: 'cache_line_locality',
    concept: 'Cache locality',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Foundation',
    prompt:
      'A loop iterates a 4096×4096 matrix column-major over a row-major array. What happens to runtime?',
    knob: { label: 'Access order', from: 'row-major', to: 'column-major', position: 80 },
    choices: [
      { id: 'faster', label: 'Gets faster' },
      { id: 'slower', label: 'Gets much slower' },
      { id: 'same', label: 'Roughly the same' },
      { id: 'jit_fixes', label: 'JIT removes the cost' },
    ],
    correctChoiceId: 'slower',
    explanation: {
      summary:
        'Column-major access jumps by a full row each step, so nearly every access misses the cache line.',
      mentalModel:
        'Locality is a property of the access pattern, not the data size. Stride kills throughput.',
      tradeoff:
        'Blocked/tiled traversal restores locality at the cost of extra index arithmetic.',
    },
    source: 'CPU cache / memory hierarchy fundamentals',
  },
  {
    id: 'q_vector_index',
    version: 1,
    domain: 'AI_ML',
    subtopic: 'Retrieval',
    conceptId: 'ann_recall',
    concept: 'ANN recall',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Advanced',
    prompt:
      'An ANN index returns results in 8 ms but recall@10 is 0.71. What is the highest-leverage first move?',
    telemetry: [
      { label: 'Latency', value: '8 ms', tone: 'good' },
      { label: 'Recall@10', value: '0.71', tone: 'crit' },
      { label: 'efSearch', value: 'low', tone: 'warn' },
    ],
    choices: [
      { id: 'efsearch', label: 'Raise efSearch / re-tune the graph' },
      { id: 'brute_force', label: 'Replace with brute force' },
      { id: 'more_data', label: 'Collect more documents' },
      { id: 'bigger_batch', label: 'Increase batch size' },
    ],
    correctChoiceId: 'efsearch',
    explanation: {
      summary:
        'ANN recall is a search-effort dial. Raising efSearch or improving the graph trades a little latency for a lot of recall.',
      mentalModel:
        'Approximate search is a recall/latency curve you can slide, not a binary switch.',
      tradeoff:
        'Brute force is exact but does not scale; tune the index before abandoning it.',
    },
    source: 'HNSW — Malkov & Yashunin',
  },
  {
    id: 'q_grpc_deadline',
    version: 1,
    domain: 'WEB',
    subtopic: 'APIs',
    conceptId: 'deadline_propagation',
    concept: 'Deadline propagation',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Advanced',
    prompt: 'Which practice satisfies all three constraints?',
    clues: [
      'Prevents wasted work after the caller gave up',
      'Requires every hop to forward the remaining budget',
      'Keeps tail latency bounded across a deep call graph',
    ],
    choices: [
      { id: 'retries', label: 'Aggressive client retries' },
      { id: 'deadline', label: 'Deadline propagation with cancellation' },
      { id: 'timeouts', label: 'Per-hop fixed timeouts' },
      { id: 'bigger_pool', label: 'Larger connection pools' },
    ],
    correctChoiceId: 'deadline',
    explanation: {
      summary:
        'Propagating an absolute deadline lets each hop stop early and skip work nobody is waiting for.',
      mentalModel:
        'A deadline is a shared budget. Fixed per-hop timeouts multiply into unbounded totals.',
      tradeoff:
        'Requires cooperation across services; partial adoption still helps but the slowest legacy hop dominates.',
    },
    source: 'gRPC deadline propagation / Google SRE',
  },
  {
    id: 'q_shuffle_map',
    version: 1,
    domain: 'CORE_CS',
    subtopic: 'Algorithms',
    conceptId: 'uniform_shuffle',
    concept: 'Uniform shuffle',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Applied',
    prompt: 'Evaluate the claim.',
    claim: 'Sorting an array by a random comparator produces a uniformly random permutation.',
    choices: [
      { id: 'biased', label: 'False — biased distribution' },
      { id: 'uniform', label: 'True — uniform' },
      { id: 'only_unique', label: 'Only for unique keys' },
      { id: 'stable_only', label: 'Only with stable sort' },
    ],
    correctChoiceId: 'biased',
    explanation: {
      summary:
        'Random comparators are inconsistent and order-dependent, so permutations are not equally likely.',
      mentalModel:
        'Uniform shuffles need Fisher–Yates: each position chosen uniformly from the remaining items.',
      tradeoff:
        'Fisher–Yates is O(n) and needs a good RNG; biased shuffles are shorter but silently wrong.',
    },
    source: 'Fisher–Yates shuffle / ACM analysis of random comparators',
  },
  {
    id: 'q_otel_sampling',
    version: 1,
    domain: 'INFRA',
    subtopic: 'Observability',
    conceptId: 'tail_sampling',
    concept: 'Tail-based sampling',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Advanced',
    prompt:
      'Head sampling at 1% drops every error trace. What is the highest-leverage first move?',
    telemetry: [
      { label: 'Sample rate', value: '1%', tone: 'warn' },
      { label: 'Error traces kept', value: '0', tone: 'crit' },
      { label: 'Trace volume', value: 'high', tone: 'neutral' },
    ],
    choices: [
      { id: 'tail', label: 'Tail-based sampling on outcome' },
      { id: 'raise_head', label: 'Raise head sampling to 100%' },
      { id: 'logs_only', label: 'Drop tracing, keep logs' },
      { id: 'lower_head', label: 'Lower head sampling to 0.1%' },
    ],
    correctChoiceId: 'tail',
    explanation: {
      summary:
        'Head sampling decides before the outcome is known. Tail sampling buffers spans and keeps interesting traces.',
      mentalModel:
        'Sample on what you want to debug, not on what you can decide early.',
      tradeoff:
        'Tail sampling needs buffering and memory; 100% head sampling explodes cost and mostly stores boring traces.',
    },
    source: 'OpenTelemetry sampling guidance',
  },
  {
    id: 'q_huffman',
    version: 1,
    domain: 'CORE_CS',
    subtopic: 'Algorithms',
    conceptId: 'prefix_codes',
    concept: 'Prefix codes',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Foundation',
    prompt: 'Evaluate the claim.',
    claim: 'A Huffman code can contain a codeword that is a prefix of another codeword.',
    choices: [
      { id: 'never', label: 'False — prefix-free by construction' },
      { id: 'sometimes', label: 'True — depends on input' },
      { id: 'only_binary', label: 'Only for binary alphabets' },
      { id: 'only_adaptive', label: 'Only for adaptive variants' },
    ],
    correctChoiceId: 'never',
    explanation: {
      summary:
        'Huffman codes are prefix-free: no codeword is a prefix of another, which makes decoding unambiguous and greedy.',
      mentalModel:
        'Prefix-free is what lets you decode bit-by-bit without lookahead.',
      tradeoff:
        'Prefix-free costs at most one extra bit per symbol versus entropy; arithmetic coding closes that gap with more complexity.',
    },
    source: 'Huffman, 1952 — prefix code construction',
  },
  {
    id: 'q_container_limits',
    version: 1,
    domain: 'INFRA',
    subtopic: 'Containers',
    conceptId: 'cpu_throttling',
    concept: 'CPU throttling',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Applied',
    prompt: 'Evaluate the claim.',
    claim: 'Setting a container CPU limit of 2 cores makes the workload use at most 2 cores continuously.',
    choices: [
      { id: 'throttled', label: 'False — CFS quota throttles in bursts' },
      { id: 'true', label: 'True — hard cap' },
      { id: 'only_requests', label: 'Only with requests set' },
      { id: 'only_k8s', label: 'Only on Kubernetes' },
    ],
    correctChoiceId: 'throttled',
    explanation: {
      summary:
        'CFS quota is enforced per scheduling period, so a burst can exhaust the quota and get throttled even at low average usage.',
      mentalModel:
        'Limits are averaged over a period, not instantaneous. Bursty services see latency from their own quota.',
      tradeoff:
        'Requests-only scheduling avoids throttling but risks noisy-neighbour contention.',
    },
    source: 'Linux CFS bandwidth control',
  },
  {
    id: 'q_xss',
    version: 2,
    domain: 'SECURITY',
    subtopic: 'AppSec',
    conceptId: 'xss_encoding',
    concept: 'Output encoding',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Foundation',
    prompt: 'Evaluate the claim.',
    claim: 'Escaping user input on the way into the database prevents cross-site scripting.',
    choices: [
      { id: 'output_encode', label: 'False — encode on output' },
      { id: 'true', label: 'True — input escaping is enough' },
      { id: 'waf_only', label: 'Only a WAF helps' },
      { id: 'https_only', label: 'Only HTTPS helps' },
    ],
    correctChoiceId: 'output_encode',
    explanation: {
      summary:
        'XSS is a rendering-context problem. Encode at output for the exact context: HTML body, attribute, URL or JavaScript.',
      mentalModel:
        'Store raw, encode at the sink. Input escaping cannot know every future context.',
      tradeoff:
        'Context-sensitive encoding is verbose; templating frameworks with auto-escaping reduce the chance of a mistake.',
    },
    source: 'OWASP XSS Prevention Cheat Sheet',
  },
  {
    id: 'q_consistent_hash',
    version: 1,
    domain: 'INFRA',
    subtopic: 'Scaling',
    conceptId: 'consistent_hashing',
    concept: 'Consistent hashing',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Advanced',
    prompt:
      'A cache cluster grows from 4 to 5 nodes using modulo hashing. What happens to key placement?',
    knob: { label: 'Cluster size', from: '4 nodes', to: '5 nodes', position: 78 },
    choices: [
      { id: 'most_move', label: 'Most keys remap' },
      { id: 'few_move', label: 'Only ~1/5 of keys move' },
      { id: 'none_move', label: 'No keys move' },
      { id: 'all_move', label: 'Every key moves twice' },
    ],
    correctChoiceId: 'few_move',
    explanation: {
      summary:
        'Consistent hashing maps keys and nodes onto a ring so adding a node only reassigns the arc it owns.',
      mentalModel:
        'Modulo hashing couples every key to the node count; ring hashing decouples them.',
      tradeoff:
        'Consistent hashing can produce uneven load; virtual nodes smooth the distribution at the cost of more metadata.',
    },
    source: 'Karger et al., Consistent Hashing and Random Trees',
  },
  {
    id: 'q_wal',
    version: 1,
    domain: 'DATA',
    subtopic: 'Storage engines',
    conceptId: 'write_ahead_log',
    concept: 'Write-ahead log',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Applied',
    prompt: 'Which mechanism satisfies all three constraints?',
    clues: [
      'Makes committed writes survive a crash',
      'Appends redo records before data pages change',
      'Lets a replica replay the log to catch up',
    ],
    choices: [
      { id: 'wal', label: 'Write-ahead log' },
      { id: 'snapshot', label: 'Periodic full snapshot' },
      { id: 'checksum', label: 'Page checksums' },
      { id: 'vacuum', label: 'Autovacuum' },
    ],
    correctChoiceId: 'wal',
    explanation: {
      summary:
        'WAL appends a durable record before the data page is written, so recovery can redo committed work after a crash.',
      mentalModel:
        'Log first, apply later. Durability comes from the log, not from the page write.',
      tradeoff:
        'WAL doubles write volume; group commit and checkpointing keep that affordable.',
    },
    source: 'ARIES — Mohan et al., 1992',
  },
  {
    id: 'q_jwt',
    version: 1,
    domain: 'SECURITY',
    subtopic: 'Cryptography',
    conceptId: 'jwt_verification',
    concept: 'JWT verification',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Applied',
    prompt: 'Evaluate the claim.',
    claim: 'A JWT is trustworthy as long as the client sends it back unchanged.',
    choices: [
      { id: 'verify_sig', label: 'False — signature must be verified' },
      { id: 'true', label: 'True — possession is proof' },
      { id: 'https_suffices', label: 'True if HTTPS is used' },
      { id: 'only_rs256', label: 'Only for RS256' },
    ],
    correctChoiceId: 'verify_sig',
    explanation: {
      summary:
        'The payload is base64-encoded, not encrypted. Verify the signature, the algorithm allowlist, issuer, audience and expiry.',
      mentalModel:
        'A JWT is a signed statement, not a secret. Trust the signature, never the contents.',
      tradeoff:
        'Stateless JWTs are hard to revoke; short lifetimes plus refresh rotation trade a little complexity for control.',
    },
    source: 'RFC 8725 — JWT Best Current Practices',
  },
  {
    id: 'q_paging',
    version: 1,
    domain: 'CORE_CS',
    subtopic: 'Memory',
    conceptId: 'page_faults',
    concept: 'Page faults',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Applied',
    prompt:
      'A service slows down after a memory limit increase, with rising major page faults. What is the highest-leverage first move?',
    telemetry: [
      { label: 'Major faults', value: 'rising', tone: 'crit' },
      { label: 'RSS', value: 'near limit', tone: 'warn' },
      { label: 'Swap', value: 'active', tone: 'crit' },
    ],
    choices: [
      { id: 'swap', label: 'Remove swap pressure / size the working set' },
      { id: 'raise_limit', label: 'Raise the limit again' },
      { id: 'restart', label: 'Restart on a schedule' },
      { id: 'more_threads', label: 'Add worker threads' },
    ],
    correctChoiceId: 'swap',
    explanation: {
      summary:
        'Major faults mean pages are being read from disk. Swapping turns memory pressure into orders-of-magnitude latency.',
      mentalModel:
        'Latency cliffs are usually a resource being over-committed, not a limit being too low.',
      tradeoff:
        'Disabling swap risks OOM kills; the real fix is right-sizing the working set or adding RAM.',
    },
    source: 'Linux memory management / swap behaviour',
  },
  {
    id: 'q_feature_store',
    version: 1,
    domain: 'AI_ML',
    subtopic: 'Retrieval',
    conceptId: 'train_serving_skew',
    concept: 'Train/serve skew',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Advanced',
    prompt:
      'A model scores 0.94 offline but 0.71 in production. What is the highest-leverage first move?',
    telemetry: [
      { label: 'Offline AUC', value: '0.94', tone: 'good' },
      { label: 'Online AUC', value: '0.71', tone: 'crit' },
      { label: 'Features', value: 'recomputed per path', tone: 'warn' },
    ],
    choices: [
      { id: 'unify', label: 'Unify feature computation for train and serve' },
      { id: 'retrain', label: 'Retrain on more data' },
      { id: 'tune_threshold', label: 'Tune the decision threshold' },
      { id: 'bigger_model', label: 'Use a larger model' },
    ],
    correctChoiceId: 'unify',
    explanation: {
      summary:
        'Two different implementations of the same features drift apart. One shared definition removes the skew.',
      mentalModel:
        'If training and serving disagree about a feature, the model is optimising a different function than it runs.',
      tradeoff:
        'A shared feature store adds infrastructure, but it is cheaper than debugging silent skew per model.',
    },
    source: 'Sculley et al., Hidden Technical Debt in ML Systems',
  },
  {
    id: 'q_cdn_cache_key',
    version: 1,
    domain: 'WEB',
    subtopic: 'Web performance',
    conceptId: 'cache_key_design',
    concept: 'CDN cache keys',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Advanced',
    prompt: 'Evaluate the claim.',
    claim: 'Adding a query string to a static asset URL is enough to bust every CDN cache.',
    choices: [
      { id: 'config_dependent', label: 'False — cache key config decides' },
      { id: 'true', label: 'True — URLs are the key' },
      { id: 'only_cloudflare', label: 'Only on Cloudflare' },
      { id: 'only_assets', label: 'Only for images' },
    ],
    correctChoiceId: 'config_dependent',
    explanation: {
      summary:
        'CDNs cache on a configured key that may ignore query strings. Fingerprint the path or verify the cache-key policy.',
      mentalModel:
        'Cache identity is whatever the edge says it is — inspect the hit ratio, not the URL shape.',
      tradeoff:
        'Fingerprinted filenames are the most reliable bust; query strings are cheaper but depend on configuration.',
    },
    source: 'CDN cache key documentation (CloudFront / Fastly)',
  },

  /* ================= EXTRA CONTENT ================= */
  {
    id: 'q_kv_cache',
    version: 1,
    domain: 'AI_ML',
    subtopic: 'Inference economics',
    conceptId: 'kv_cache',
    concept: 'KV cache',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Advanced',
    prompt:
      'Autoregressive decoding recomputes attention keys and values for the whole prefix at every token, so latency grows with context length. What is the highest-leverage first fix?',
    telemetry: [
      { label: 'TOKENS/S', value: '18', tone: 'warn' },
      { label: 'KV MEM', value: '41 GB', tone: 'crit' },
      { label: 'BATCH', value: '1', tone: 'neutral' },
    ],
    choices: [
      { id: 'kv_cache', label: 'Cache K/V per layer' },
      { id: 'quantize_weights', label: 'Quantize weights to int4' },
      { id: 'bigger_gpu', label: 'Move to a larger GPU' },
      { id: 'shorten_prompt', label: 'Truncate the system prompt' },
    ],
    correctChoiceId: 'kv_cache',
    explanation: {
      summary:
        'Caching keys and values per layer turns each decode step from a full-prefix recompute into a single new-token append.',
      mentalModel:
        'Attention is the bottleneck in decoding; the KV cache trades memory for a large drop in repeated compute.',
      tradeoff:
        'KV memory scales with batch × context × layers, which caps concurrency and pushes you toward paging or quantization.',
    },
    source: 'Transformer inference / KV cache literature',
  },
  {
    id: 'q_temperature_zero',
    version: 1,
    domain: 'AI_ML',
    subtopic: 'Sampling math',
    conceptId: 'temperature_zero',
    concept: 'Temperature → 0',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Foundation',
    prompt:
      'As softmax temperature approaches zero from above, the sampled token distribution approaches:',
    knob: { label: 'Temperature', from: 'T → ∞', to: 'T → 0', position: 6 },
    choices: [
      { id: 'uniform', label: 'Uniform' },
      { id: 'greedy', label: 'Greedy (argmax)' },
      { id: 'zero_entropy', label: 'Zero entropy' },
      { id: 'one_hot', label: 'One-hot' },
    ],
    correctChoiceId: 'greedy',
    explanation: {
      summary:
        'Dividing by a near-zero temperature blows up logit gaps, so the largest logit takes essentially all the probability mass.',
      mentalModel:
        'Low temperature sharpens; in the limit it becomes deterministic argmax — a one-hot distribution.',
      tradeoff:
        'Greedy decoding is reproducible but removes diversity, which hurts creative sampling.',
    },
    source: 'Standard softmax formulation with temperature scaling',
  },
  {
    id: 'q_attention_complexity',
    version: 1,
    domain: 'AI_ML',
    subtopic: 'Architecture',
    conceptId: 'attention_cost',
    concept: 'Attention cost',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Applied',
    prompt: 'Which statement about self-attention cost is correct?',
    claim:
      'Doubling the sequence length doubles the cost of self-attention, because there are twice as many tokens.',
    choices: [
      { id: 'quadratic', label: 'Cost grows quadratically' },
      { id: 'linear', label: 'Cost grows linearly' },
      { id: 'constant', label: 'Cost is constant' },
      { id: 'log', label: 'Cost grows logarithmically' },
    ],
    correctChoiceId: 'quadratic',
    explanation: {
      summary:
        'Every token attends to every token, so the score matrix is n × n — doubling n roughly quadruples attention work.',
      mentalModel:
        'Attention is O(n²·d) in sequence length. This is why long-context work needs sparse, linear or FlashAttention-style IO-aware kernels.',
      tradeoff:
        'Quadratic attention buys unrestricted dependency modelling; sparse variants recover speed but restrict which pairs interact.',
    },
    source: 'Vaswani et al., "Attention Is All You Need", 2017',
  },
  {
    id: 'q_quantization',
    version: 1,
    domain: 'AI_ML',
    subtopic: 'Optimization',
    conceptId: 'quantization',
    concept: 'Quantization',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Advanced',
    prompt: 'Which technique satisfies all three constraints?',
    clues: [
      'Stores weights in lower precision',
      'Needs calibration data or a small correction step',
      'Cuts memory bandwidth and often improves throughput',
    ],
    choices: [
      { id: 'quant', label: 'Quantization' },
      { id: 'prune', label: 'Pruning' },
      { id: 'distill', label: 'Distillation' },
      { id: 'spec_decode', label: 'Speculative decoding' },
    ],
    correctChoiceId: 'quant',
    explanation: {
      summary:
        'Quantization maps weights and activations to int8/int4 with scales, sometimes calibrated on a small dataset.',
      mentalModel:
        'Lower precision means smaller tensors and cheaper math; the risk is accuracy loss concentrated in outlier channels.',
      tradeoff:
        'Aggressive low-bit formats need outlier handling (mixed precision, GPTQ/AWQ-style methods) to stay accurate.',
    },
    source: 'Jacob et al., "Quantization and Training of Neural Networks", 2018',
  },
  {
    id: 'q_batch_size',
    version: 1,
    domain: 'AI_ML',
    subtopic: 'Training dynamics',
    conceptId: 'batch_size',
    concept: 'Batch size and gradient noise',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Advanced',
    prompt:
      'Holding the learning rate fixed, what happens to gradient noise as batch size grows very large?',
    knob: { label: 'Batch size', from: 'small', to: 'very large', position: 92 },
    choices: [
      { id: 'decreases', label: 'Gradient noise decreases' },
      { id: 'increases', label: 'Gradient noise increases' },
      { id: 'constant', label: 'Stays constant' },
      { id: 'zero', label: 'Becomes exactly zero' },
    ],
    correctChoiceId: 'decreases',
    explanation: {
      summary:
        'Averaging over more examples reduces the variance of the gradient estimate, so updates become less noisy.',
      mentalModel:
        'Large batches approximate the true gradient more closely — which is why they often need learning-rate scaling to stay efficient.',
      tradeoff:
        'Very large batches reduce noise but can generalise worse and lower hardware utilisation per example.',
    },
    source: 'Smith et al., "Don\'t Decay the Learning Rate, Increase the Batch Size", 2018',
  },
  {
    id: 'q_replica_lag',
    version: 1,
    domain: 'INFRA',
    subtopic: 'Scaling',
    conceptId: 'replication_lag',
    concept: 'Replication lag',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Applied',
    prompt:
      'A read replica serves stale rows because replication lag spikes under write load. What is the highest-leverage first move?',
    telemetry: [
      { label: 'REPLAG', value: '8.4 s', tone: 'crit' },
      { label: 'WRITES/S', value: '9.1k', tone: 'warn' },
      { label: 'READS', value: 'read-your-writes', tone: 'warn' },
    ],
    choices: [
      { id: 'read_primary', label: 'Route read-your-writes to primary' },
      { id: 'add_replica', label: 'Add another read replica' },
      { id: 'bigger_replica', label: 'Scale the replica vertically' },
      { id: 'cache_forever', label: 'Cache all reads indefinitely' },
    ],
    correctChoiceId: 'read_primary',
    explanation: {
      summary:
        'Send the reads that must observe their own writes to the primary, or gate them on a replication position.',
      mentalModel:
        'Replication is asynchronous; consistency is a per-read decision, not a property of the whole system.',
      tradeoff:
        'Routing to the primary costs read scaling and adds load to the write path.',
    },
    source: 'Database replication / read-your-writes consistency literature',
  },
  {
    id: 'q_idempotency',
    version: 1,
    domain: 'INFRA',
    subtopic: 'Reliability',
    conceptId: 'idempotency',
    concept: 'Idempotency keys',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Foundation',
    prompt: 'Which claim about retries is correct?',
    claim:
      'Retrying a failed POST is always safe, because the first attempt failed and therefore did nothing.',
    choices: [
      { id: 'unsafe', label: 'Retries can duplicate side effects' },
      { id: 'safe', label: 'Retries are always safe' },
      { id: 'safe_get', label: 'Only GET can be retried' },
      { id: 'safe_idem', label: 'Retries are safe if the server is fast' },
    ],
    correctChoiceId: 'unsafe',
    explanation: {
      summary:
        'A timeout does not prove the server did nothing — the request may have succeeded while the response was lost.',
      mentalModel:
        'Retries need idempotency keys so the server can recognise a repeat and return the original result instead of re-executing.',
      tradeoff:
        'Idempotency requires the server to store key → result mappings, which adds state and a retention policy.',
    },
    source: 'Idempotent API design / Stripe idempotency documentation',
  },
  {
    id: 'q_backpressure',
    version: 1,
    domain: 'INFRA',
    subtopic: 'Queues',
    conceptId: 'backpressure',
    concept: 'Backpressure',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Applied',
    prompt:
      'Consumers slow down while producers keep arriving at the same rate. What happens to the queue?',
    knob: { label: 'Producer rate vs consumer rate', from: 'balanced', to: 'producers faster', position: 88 },
    choices: [
      { id: 'grows', label: 'Queue grows without bound' },
      { id: 'stable', label: 'Queue stays stable' },
      { id: 'shrinks', label: 'Queue drains faster' },
      { id: 'drops_all', label: 'Messages are silently dropped' },
    ],
    correctChoiceId: 'grows',
    explanation: {
      summary:
        'When arrival rate exceeds service rate the queue length grows without limit until memory or retention is exhausted.',
      mentalModel:
        'Queues only absorb bursts. Sustained overload needs backpressure, load shedding or added capacity.',
      tradeoff:
        'Applying backpressure protects latency but pushes rejection upstream to callers.',
    },
    source: 'Queueing theory / Little\'s Law',
  },
  {
    id: 'q_consensus',
    version: 1,
    domain: 'INFRA',
    subtopic: 'Consensus',
    conceptId: 'quorum',
    concept: 'Quorum writes',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Advanced',
    prompt: 'Which protocol satisfies all three constraints?',
    clues: [
      'Requires a majority of nodes to agree',
      'Tolerates minority failures',
      'Provides linearizable reads when reads also use a quorum',
    ],
    choices: [
      { id: 'raft', label: 'Raft / Paxos' },
      { id: 'gossip', label: 'Gossip protocol' },
      { id: 'lww', label: 'Last-write-wins' },
      { id: 'crdt', label: 'CRDT' },
    ],
    correctChoiceId: 'raft',
    explanation: {
      summary:
        'Majority quorums give both safety and liveness under minority failure, which is what Raft and Paxos provide.',
      mentalModel:
        'A majority of any two quorums always intersects, so a value acknowledged by one is visible to the next.',
      tradeoff:
        'Consensus costs an extra round trip and stalls writes while a leader is unavailable.',
    },
    source: 'Ongaro & Ousterhout, "In Search of an Understandable Consensus Algorithm" (Raft), 2014',
  },
  {
    id: 'q_cdn_ttl',
    version: 1,
    domain: 'INFRA',
    subtopic: 'Networking',
    conceptId: 'cdn_ttl',
    concept: 'CDN TTL',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Applied',
    prompt:
      'A CDN object has a very long TTL and you need to ship a breaking change now. What happens if you simply wait?',
    knob: { label: 'Cache TTL', from: '60s', to: '24h', position: 95 },
    choices: [
      { id: 'stale', label: 'Stale content persists at edges' },
      { id: 'instant', label: 'Change propagates instantly' },
      { id: 'origin_only', label: 'Only the origin updates' },
      { id: 'all_purge', label: 'All edges purge automatically' },
    ],
    correctChoiceId: 'stale',
    explanation: {
      summary:
        'Long TTLs mean edge nodes keep serving the old object until it expires or is explicitly purged.',
      mentalModel:
        'Caching is a deliberate staleness trade: you buy latency and origin offload with delayed invalidation.',
      tradeoff:
        'Short TTLs are fresher but raise origin load; long TTLs need versioned URLs or active purges.',
    },
    source: 'HTTP caching semantics (RFC 9111)',
  },
  {
    id: 'q_2pc_block',
    version: 1,
    domain: 'INFRA',
    subtopic: 'Coordination',
    conceptId: 'two_phase_commit',
    concept: 'Two-phase commit blocking',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Advanced',
    prompt: 'Which claim about two-phase commit is correct?',
    claim:
      'Two-phase commit is non-blocking, so a coordinator crash can never stall participants.',
    choices: [
      { id: 'blocking', label: 'It can block indefinitely' },
      { id: 'nonblocking', label: 'It is non-blocking' },
      { id: 'only_read', label: 'It only affects reads' },
      { id: 'auto_heal', label: 'Participants auto-heal' },
    ],
    correctChoiceId: 'blocking',
    explanation: {
      summary:
        'After prepare, a participant holding locks cannot decide unilaterally — if the coordinator dies it waits.',
      mentalModel:
        '2PC trades availability for atomicity; that is why sagas and idempotent retries often replace it.',
      tradeoff:
        'Strong atomicity versus availability — pick based on whether the operation can be safely retried.',
    },
    source: 'Gray & Lamport, "Consensus on Transaction Commit", 2006',
  },
  {
    id: 'q_hlc',
    version: 1,
    domain: 'DATA',
    subtopic: 'Transactions',
    conceptId: 'isolation_level',
    concept: 'Isolation levels',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Advanced',
    prompt:
      'Two concurrent transactions read the same row, then both update it, and one update is silently lost. Which isolation level prevents this?',
    telemetry: [
      { label: 'ANOMALY', value: 'lost update', tone: 'crit' },
      { label: 'LEVEL', value: 'read committed', tone: 'warn' },
      { label: 'RETRIES', value: 'none', tone: 'neutral' },
    ],
    choices: [
      { id: 'serializable', label: 'Serializable' },
      { id: 'read_committed', label: 'Read committed' },
      { id: 'read_uncommitted', label: 'Read uncommitted' },
      { id: 'snapshot_only', label: 'Snapshot alone' },
    ],
    correctChoiceId: 'serializable',
    explanation: {
      summary:
        'Serializable execution prevents lost updates by detecting or preventing conflicting concurrent writes.',
      mentalModel:
        'Isolation levels trade concurrency for correctness; each level closes a specific class of anomaly.',
      tradeoff:
        'Serializable can abort or block transactions, so it needs retry logic and careful contention design.',
    },
    source: 'PostgreSQL transaction isolation documentation',
  },
  {
    id: 'q_btree',
    version: 1,
    domain: 'DATA',
    subtopic: 'Indexing',
    conceptId: 'btree',
    concept: 'B-tree indexes',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Foundation',
    prompt: 'Which structure satisfies all three constraints?',
    clues: [
      'Keeps keys sorted for range scans',
      'Stays balanced as data grows',
      'Supports point lookups in logarithmic time',
    ],
    choices: [
      { id: 'btree', label: 'B-tree / B+ tree' },
      { id: 'hash', label: 'Hash index' },
      { id: 'bitmap', label: 'Bitmap index' },
      { id: 'lsm', label: 'LSM tree' },
    ],
    correctChoiceId: 'btree',
    explanation: {
      summary:
        'B+ trees keep data in sorted leaves linked for scans, with a shallow balanced tree above them.',
      mentalModel:
        'B+ trees are the default relational index because they serve equality, range and ordered scans from one structure.',
      tradeoff:
        'They cost write amplification on inserts and need cache-friendly page sizing to stay fast.',
    },
    source: 'Database system concepts / B-tree index literature',
  },
  {
    id: 'q_vacuum',
    version: 1,
    domain: 'DATA',
    subtopic: 'Storage engines',
    conceptId: 'vacuum',
    concept: 'MVCC and vacuum',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Advanced',
    prompt:
      'A long-running read transaction prevents old row versions from being reclaimed. What happens to table size?',
    knob: { label: 'Oldest transaction age', from: 'seconds', to: 'days', position: 94 },
    choices: [
      { id: 'bloats', label: 'Table and indexes bloat' },
      { id: 'stable', label: 'Size stays constant' },
      { id: 'shrinks', label: 'Table shrinks' },
      { id: 'drops_rows', label: 'Rows are deleted' },
    ],
    correctChoiceId: 'bloats',
    explanation: {
      summary:
        'MVCC keeps versions that any live snapshot might still need, so a long transaction pins dead tuples in place.',
      mentalModel:
        'Vacuum reclaims versions no snapshot can see; an old snapshot widens that window and blocks reclamation.',
      tradeoff:
        'Aggressive vacuuming reclaims space but competes for IO; delaying it keeps reads correct but grows storage.',
    },
    source: 'PostgreSQL MVCC / vacuum documentation',
  },
  {
    id: 'q_event_loop',
    version: 1,
    domain: 'WEB',
    subtopic: 'Event loop',
    conceptId: 'microtask',
    concept: 'Microtask queue',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Applied',
    prompt: 'Which claim about the JavaScript event loop is correct?',
    claim:
      'A promise callback always runs after the next macrotask, because promises are asynchronous.',
    choices: [
      { id: 'before_render', label: 'Microtasks run before rendering' },
      { id: 'after_task', label: 'They run after the next task' },
      { id: 'parallel', label: 'They run in parallel' },
      { id: 'never', label: 'They never run' },
    ],
    correctChoiceId: 'before_render',
    explanation: {
      summary:
        'The microtask queue is drained completely after the current task and before the next task or render.',
      mentalModel:
        'One task → drain all microtasks → render → next task. That ordering explains most "why did my promise run early" bugs.',
      tradeoff:
        'Draining microtasks before paint favours consistency; an infinite microtask chain starves rendering entirely.',
    },
    source: 'HTML specification — event loop processing model',
  },
  {
    id: 'q_cwv',
    version: 1,
    domain: 'WEB',
    subtopic: 'Web performance',
    conceptId: 'lcp',
    concept: 'Core Web Vitals',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Foundation',
    prompt: 'Which metric satisfies all three constraints?',
    clues: [
      'Measures when the largest content element paints',
      'Sensitive to render-blocking resources',
      'One of the three Core Web Vitals',
    ],
    choices: [
      { id: 'lcp', label: 'LCP' },
      { id: 'cls', label: 'CLS' },
      { id: 'inp', label: 'INP' },
      { id: 'ttfb', label: 'TTFB' },
    ],
    correctChoiceId: 'lcp',
    explanation: {
      summary:
        'Largest Contentful Paint reports when the biggest above-the-fold element becomes visible.',
      mentalModel:
        'LCP, CLS and INP cover loading, stability and responsiveness — the three user-perceived pillars.',
      tradeoff:
        'Optimising LCP can conflict with delaying non-critical JS; both compete for the same bandwidth.',
    },
    source: 'web.dev Core Web Vitals documentation',
  },
  {
    id: 'q_debounce',
    version: 1,
    domain: 'WEB',
    subtopic: 'Frontend architecture',
    conceptId: 'debounce',
    concept: 'Debounce vs throttle',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Applied',
    prompt:
      'A search box fires a network request on every keystroke. You want one request after typing stops. What do you reach for?',
    knob: { label: 'Input event rate', from: '1 per keystroke', to: 'burst of 12', position: 80 },
    choices: [
      { id: 'debounce', label: 'Debounce' },
      { id: 'throttle', label: 'Throttle' },
      { id: 'memo', label: 'Memoise' },
      { id: 'virtualise', label: 'Virtualise the list' },
    ],
    correctChoiceId: 'debounce',
    explanation: {
      summary:
        'Debounce waits for a quiet period before firing, which matches "one request after typing stops".',
      mentalModel:
        'Debounce delays until activity stops; throttle guarantees a maximum rate during continuous activity.',
      tradeoff:
        'Debounce adds latency to the final result; throttle gives steady updates but fires during idle gaps.',
    },
    source: 'Standard UI interaction patterns',
  },
  {
    id: 'q_cors',
    version: 1,
    domain: 'WEB',
    subtopic: 'HTTP',
    conceptId: 'cors',
    concept: 'CORS',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Foundation',
    prompt: 'Which claim about CORS is correct?',
    claim:
      'CORS is a server-side access control that stops attackers from sending requests to your API.',
    choices: [
      { id: 'browser', label: 'It is browser-enforced only' },
      { id: 'server', label: 'It blocks requests server-side' },
      { id: 'auth', label: 'It replaces authentication' },
      { id: 'csrf', label: 'It prevents CSRF' },
    ],
    correctChoiceId: 'browser',
    explanation: {
      summary:
        'CORS is enforced by the browser: it blocks reading cross-origin responses, not the request itself.',
      mentalModel:
        'Never treat CORS as authorisation. Attackers using curl ignore it entirely — authenticate on the server.',
      tradeoff:
        'Permissive CORS is convenient for prototypes but widens the surface for credentialed cross-origin reads.',
    },
    source: 'Fetch specification — CORS protocol',
  },
  {
    id: 'q_cow',
    version: 1,
    domain: 'CORE_CS',
    subtopic: 'Memory',
    conceptId: 'copy_on_write',
    concept: 'Copy-on-write',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Applied',
    prompt: 'Which technique satisfies all three constraints?',
    clues: [
      'Defers copying until a write occurs',
      'Shares physical pages between processes',
      'Used by fork() on modern kernels',
    ],
    choices: [
      { id: 'cow', label: 'Copy-on-write' },
      { id: 'swap', label: 'Swapping' },
      { id: 'mmap', label: 'Memory mapping' },
      { id: 'garbage', label: 'Garbage collection' },
    ],
    correctChoiceId: 'cow',
    explanation: {
      summary:
        'fork() maps the parent pages read-only; the first write triggers a page fault and a private copy.',
      mentalModel:
        'Share while read-only, duplicate lazily on write — cheap cloning with correct isolation.',
      tradeoff:
        'Write-heavy children pay fault overhead and lose the sharing benefit entirely.',
    },
    source: 'Operating system concepts — virtual memory / fork',
  },
  {
    id: 'q_deadlock',
    version: 1,
    domain: 'CORE_CS',
    subtopic: 'Concurrency',
    conceptId: 'deadlock',
    concept: 'Deadlock conditions',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Advanced',
    prompt: 'Which set of conditions is required for deadlock?',
    clues: [
      'Mutual exclusion on resources',
      'Hold and wait while requesting more',
      'No preemption, plus a circular wait',
    ],
    choices: [
      { id: 'all_four', label: 'All four conditions' },
      { id: 'only_circle', label: 'Only circular wait' },
      { id: 'only_hold', label: 'Only hold and wait' },
      { id: 'only_preempt', label: 'Only preemption' },
    ],
    correctChoiceId: 'all_four',
    explanation: {
      summary:
        'Deadlock needs mutual exclusion, hold-and-wait, no preemption and a circular wait simultaneously.',
      mentalModel:
        'Break any one condition to prevent deadlock — lock ordering breaks circular wait, timeouts break hold-and-wait.',
      tradeoff:
        'Prevention is simple but can cost concurrency; detection allows more parallelism but needs recovery.',
    },
    source: 'Coffman conditions / operating systems literature',
  },
  {
    id: 'q_cache_local',
    version: 1,
    domain: 'CORE_CS',
    subtopic: 'CPU / cache',
    conceptId: 'cache_locality',
    concept: 'Cache locality',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Applied',
    prompt:
      'You switch from a linked list to a contiguous array for the same traversal. What happens to cache behaviour?',
    knob: { label: 'Access pattern', from: 'pointer chasing', to: 'sequential', position: 12 },
    choices: [
      { id: 'improves', label: 'Locality improves' },
      { id: 'worsens', label: 'Locality worsens' },
      { id: 'same', label: 'No change' },
      { id: 'random', label: 'Becomes random' },
    ],
    correctChoiceId: 'improves',
    explanation: {
      summary:
        'Sequential access lets the hardware prefetcher fetch cache lines ahead of demand, so each miss covers many elements.',
      mentalModel:
        'Caches reward spatial locality; pointer chasing pays a miss per node, arrays amortise one miss per line.',
      tradeoff:
        'Contiguity speeds reads but makes insertions expensive because elements must shift.',
    },
    source: 'Computer architecture — memory hierarchy',
  },
  {
    id: 'q_twos_complement',
    version: 1,
    domain: 'CORE_CS',
    subtopic: 'Algorithms',
    conceptId: 'two_complement',
    concept: 'Two\'s complement',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Foundation',
    prompt: 'Which claim about two\'s complement is correct?',
    claim:
      'In two\'s complement, adding one to the maximum signed integer wraps to the minimum negative value.',
    choices: [
      { id: 'wraps', label: 'True — it wraps' },
      { id: 'saturates', label: 'False — it saturates' },
      { id: 'errors', label: 'False — it traps' },
      { id: 'undefined', label: 'False — it is undefined' },
    ],
    correctChoiceId: 'wraps',
    explanation: {
      summary:
        'Signed overflow in two\'s complement wraps modulo 2ⁿ, so INT_MAX + 1 becomes INT_MIN.',
      mentalModel:
        'Two\'s complement makes signed and unsigned addition identical at the bit level; only the interpretation differs.',
      tradeoff:
        'Wraparound is fast and branch-free but hides bugs — hence checked or saturating arithmetic in safety-critical code.',
    },
    source: 'Two\'s complement representation',
  },
  {
    id: 'q_page_fault',
    version: 1,
    domain: 'CORE_CS',
    subtopic: 'Operating systems',
    conceptId: 'page_fault',
    concept: 'Page faults',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Advanced',
    prompt:
      'A service shows high CPU with rising minor page faults and no memory pressure. What is the most likely cause?',
    telemetry: [
      { label: 'CPU', value: '94%', tone: 'crit' },
      { label: 'MINFAULT', value: 'high', tone: 'warn' },
      { label: 'FREE MEM', value: 'plenty', tone: 'good' },
    ],
    choices: [
      { id: 'alloc', label: 'Allocation-heavy workload' },
      { id: 'swap', label: 'Swap thrashing' },
      { id: 'leak', label: 'Memory leak' },
      { id: 'disk', label: 'Disk failure' },
    ],
    correctChoiceId: 'alloc',
    explanation: {
      summary:
        'Minor faults come from mapping new anonymous pages, which is exactly what allocation-heavy code does constantly.',
      mentalModel:
        'Minor faults are cheap but frequent allocation signals; major faults mean real IO from disk.',
      tradeoff:
        'Reducing faults means reusing buffers or pools, which adds complexity and lifetime management.',
    },
    source: 'Linux memory management / procfs documentation',
  },
  {
    id: 'q_ttl_cache',
    version: 1,
    domain: 'SECURITY',
    subtopic: 'Cryptography',
    conceptId: 'nonce',
    concept: 'Nonce reuse',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Advanced',
    prompt: 'Which claim about nonce reuse is correct?',
    claim:
      'Reusing a nonce with the same key in a stream cipher is harmless because the key stays secret.',
    choices: [
      { id: 'xor_leak', label: 'Plaintexts can be XORed apart' },
      { id: 'safe', label: 'It is harmless' },
      { id: 'only_aes', label: 'Only AES is affected' },
      { id: 'only_short', label: 'Only short messages' },
    ],
    correctChoiceId: 'xor_leak',
    explanation: {
      summary:
        'Two ciphertexts under the same keystream XOR to the XOR of the plaintexts, leaking relationships and often the content.',
      mentalModel:
        'Stream ciphers are a one-time pad per nonce; reuse destroys the "one-time" guarantee.',
      tradeoff:
        'Nonce management needs either random 96-bit values or a strictly monotonic counter — both add state.',
    },
    source: 'NIST SP 800-38A / stream cipher keystream reuse literature',
  },
  {
    id: 'q_bcrypt_cost',
    version: 1,
    domain: 'SECURITY',
    subtopic: 'Identity',
    conceptId: 'password_hash',
    concept: 'Password hashing cost',
    mechanic: 'SHIFT_THE_KNOB',
    difficultyBand: 'Applied',
    prompt:
      'You lower the password KDF work factor to speed up logins. What happens to offline cracking economics?',
    knob: { label: 'KDF work factor', from: 'high', to: 'low', position: 10 },
    choices: [
      { id: 'cheaper', label: 'Cracking gets cheaper' },
      { id: 'costlier', label: 'Cracking gets costlier' },
      { id: 'same', label: 'No change' },
      { id: 'impossible', label: 'Cracking becomes impossible' },
    ],
    correctChoiceId: 'cheaper',
    explanation: {
      summary:
        'The work factor is exactly the attacker\'s cost per guess, so lowering it linearly speeds up brute force.',
      mentalModel:
        'Password hashing is a deliberate asymmetry: you pay the cost once per login, the attacker pays it per guess.',
      tradeoff:
        'Higher cost hardens against cracking but raises login latency and CPU load under traffic spikes.',
    },
    source: 'OWASP Password Storage Cheat Sheet',
  },
  {
    id: 'q_zero_trust',
    version: 1,
    domain: 'SECURITY',
    subtopic: 'Secure design',
    conceptId: 'zero_trust',
    concept: 'Zero trust',
    mechanic: 'TRIAD_COMPRESSION',
    difficultyBand: 'Foundation',
    prompt: 'Which approach satisfies all three constraints?',
    clues: [
      'Never trusts the network location alone',
      'Verifies every request explicitly',
      'Assumes a breach and limits blast radius',
    ],
    choices: [
      { id: 'zero_trust', label: 'Zero trust' },
      { id: 'vpn_only', label: 'VPN perimeter' },
      { id: 'firewall', label: 'Firewall rules' },
      { id: 'secrets', label: 'Shared secrets' },
    ],
    correctChoiceId: 'zero_trust',
    explanation: {
      summary:
        'Zero trust removes implicit trust from network position and authenticates and authorises every request.',
      mentalModel:
        'Perimeter security assumes inside is safe; zero trust assumes the attacker is already inside.',
      tradeoff:
        'Per-request verification costs latency and identity infrastructure, but contains breaches far better.',
    },
    source: 'NIST SP 800-207 — Zero Trust Architecture',
  },
  {
    id: 'q_sql_injection',
    version: 1,
    domain: 'SECURITY',
    subtopic: 'AppSec',
    conceptId: 'sql_injection',
    concept: 'SQL injection',
    mechanic: 'ARCHITECTURE_TRIAGE',
    difficultyBand: 'Foundation',
    prompt:
      'A query built by string concatenation breaks when a username contains a quote. What is the highest-leverage fix?',
    telemetry: [
      { label: 'INPUT', value: "O'Brien", tone: 'warn' },
      { label: 'QUERY', value: 'concatenated', tone: 'crit' },
      { label: 'ERROR', value: 'syntax', tone: 'crit' },
    ],
    choices: [
      { id: 'params', label: 'Use parameterised queries' },
      { id: 'escape', label: 'Escape quotes manually' },
      { id: 'waf', label: 'Add a WAF rule' },
      { id: 'hide_errors', label: 'Hide error messages' },
    ],
    correctChoiceId: 'params',
    explanation: {
      summary:
        'Bound parameters keep data out of the SQL grammar entirely, so input can never change the query structure.',
      mentalModel:
        'Injection is a confusion of code and data; parameterisation restores the boundary.',
      tradeoff:
        'Parameterised queries fix injection but not authorisation — still enforce per-row access control.',
    },
    source: 'OWASP SQL Injection Prevention Cheat Sheet',
  },
  {
    id: 'q_rate_limit',
    version: 1,
    domain: 'SECURITY',
    subtopic: 'AppSec',
    conceptId: 'rate_limit',
    concept: 'Rate limiting',
    mechanic: 'MYTHBUSTER',
    difficultyBand: 'Applied',
    prompt: 'Which claim about client-side rate limiting is correct?',
    claim:
      'Rate limiting enforced only in the browser is enough to stop credential stuffing.',
    choices: [
      { id: 'server_side', label: 'False — enforce server-side' },
      { id: 'enough', label: 'True — it is enough' },
      { id: 'only_captcha', label: 'Only CAPTCHA helps' },
      { id: 'only_https', label: 'Only HTTPS helps' },
    ],
    correctChoiceId: 'server_side',
    explanation: {
      summary:
        'Any client-side check can be bypassed by calling the API directly, so limits must be enforced server-side.',
      mentalModel:
        'Treat the client as untrusted input: every control that protects a resource belongs on the server.',
      tradeoff:
        'Server-side limits need shared state (Redis or similar) and careful key selection to avoid punishing shared NATs.',
    },
    source: 'OWASP Authentication / rate limiting guidance',
  },
];

export function questionsForDomain(domain: DomainId): Question[] {
  if (domain === 'OMNI') return QUESTIONS;
  return QUESTIONS.filter((q) => q.domain === domain);
}

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

/** Deterministic 8-round deck with the pacing arc from the brief §2.2. */
export function buildDeck(domain: DomainId, seed: number): Question[] {
  const pool = questionsForDomain(domain);
  const deck: Question[] = [];
  const used = new Set<string>();
  let s = seed;
  const next = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  const mechanicsInPool = (list: Question[]) => [...new Set(list.map((q) => q.mechanic))];

  const takeFrom = (candidates: Question[]): Question | null => {
    const fresh = candidates.filter((q) => !used.has(q.id));
    if (!fresh.length) return null;
    const chosen = fresh[Math.floor(next() * fresh.length) % fresh.length];
    used.add(chosen.id);
    return chosen;
  };

  // Round 1-2 warm-up, 3-5 main, 6-7 pressure, 8 Overdrive.
  for (let round = 0; round < 8; round++) {
    // Never repeat the same mechanic three rounds in a row (brief §4.6).
    const last = deck.length ? deck[deck.length - 1].mechanic : undefined;
    const beforeLast = deck.length > 1 ? deck[deck.length - 2].mechanic : undefined;
    const banned = last && last === beforeLast ? last : undefined;

    const available = pool.filter((q) => !used.has(q.id));
    if (!available.length) break;

    const allowedMechanics = mechanicsInPool(available).filter((m) => m !== banned);
    const pool2 = available.filter((q) => allowedMechanics.includes(q.mechanic));
    const target = pool2.length ? pool2 : available;

    // Prefer a mechanic different from the previous round for variety.
    const varied = target.filter((q) => q.mechanic !== last);
    const chosen = takeFrom(varied.length ? varied : target);
    if (!chosen) break;
    deck.push(chosen);
  }

  // Safety net: a duel must always have exactly 8 rounds. If the domain pool
  // is ever too small, top up from the full bank rather than shipping a short
  // match (which would break scoring, Q&A and rating contracts).
  if (deck.length < 8) {
    const backup = QUESTIONS.filter((q) => !used.has(q.id));
    const shuffled = [...backup].sort(() => next() - 0.5);
    for (const q of shuffled) {
      if (deck.length >= 8) break;
      used.add(q.id);
      deck.push(q);
    }
  }

  return deck.slice(0, 8);
}