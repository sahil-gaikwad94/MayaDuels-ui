import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, X } from 'lucide-react';
import { IdentityCapsule } from '../components/IdentityCapsule';
import { ArenaField } from '../components/ArenaField';
import { HeroStage } from '../components/HeroStage';
import { toObjectKind } from '../components/ObjectGlyph';
import { ObjectGlyph } from '../components/ObjectGlyph';
import { Porcelain, PorcelainChip } from '../components/Porcelain';
import { DOMAINS, type Domain } from '../lib/domains';
import { fieldFor } from '../lib/field';
import { cn, formatNumber } from '../lib/utils';
import { listStagger } from '../lib/motion';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'AI_ML', label: 'AI / ML' },
  { id: 'INFRA', label: 'Infra' },
  { id: 'DATA', label: 'Data' },
  { id: 'WEB', label: 'Web' },
  { id: 'CORE_CS', label: 'Core CS' },
  { id: 'SECURITY', label: 'Security' },
];

const SUGGESTED = [
  'Transformers',
  'Consensus',
  'Query plans',
  'Event loop',
  'False sharing',
  'Cryptography',
];

export function ArenasScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DOMAINS.filter((d) => {
      const matchesFilter = filter === 'all' || d.id === filter;
      if (!matchesFilter) return false;
      if (!q) return true;
      return (
        d.arena.toLowerCase().includes(q) ||
        d.short.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q) ||
        d.topics.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, filter]);

  const featured: Domain = results[0] ?? DOMAINS[0];
  const featuredPalette = fieldFor(featured.id);
  const topicHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return DOMAINS.flatMap((d) =>
      d.topics
        .filter((t) => t.toLowerCase().includes(q))
        .map((t) => ({ topic: t, domain: d })),
    ).slice(0, 5);
  }, [query]);

  return (
    <div className="relative min-h-dvh pb-32">
      {/* ---------- Arena field ---------- */}
      <div className="absolute inset-x-0 top-0 h-[520px] overflow-hidden">
        <ArenaField palette={featuredPalette} intensity="soft" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background: `linear-gradient(to bottom, transparent, #090A0F 90%)`,
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-md px-4 pt-[calc(var(--safe-t)+14px)]">
        <IdentityCapsule tone="onField" />

        {/* ---------- Big title (like "Brands") ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5"
        >
          <h1 className="font-display text-[1.95rem] font-semibold leading-none tracking-[-0.03em]">
            Arenas
          </h1>
          <p className="mt-1.5 text-[12px]">
            Six domains, each with its own object language.
          </p>
        </motion.div>

        {/* ---------- Search pill ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-5"
        >
          <div
            className={cn(
              'flex items-center gap-2.5 rounded-full px-4 py-2.5 transition-all duration-300',
              focused && 'border-cyan-line/60 shadow-[0_0_0_3px_rgba(0,245,212,0.08)]',
            )}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: featuredPalette.ink,
            }}
          >
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search arenas, topics, concepts"
              aria-label="Search arenas and topics"
              className="w-full bg-transparent text-[13.5px] focus:outline-none"
              style={{ color: featuredPalette.ink }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="press flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {focused && !query && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass absolute inset-x-0 top-[calc(100%+8px)] z-30 rounded-3xl p-3 shadow-dock"
            >
              <p className="label-mono px-1 pb-2">Suggested topics</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setQuery(s)}
                    className="press rounded-full border border-line bg-white/4 px-2.5 py-1 text-[11.5px] text-muted hover:text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ---------- Category chips ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6"
        >
          {FILTERS.map((f) => {
            const match = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'press shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors',
                  match
                    ? 'border-cyan-line/60 bg-cyan/12 text-cyan'
                    : 'border-line bg-white/8 text-faint hover:text-muted',
                )}
              >
                {f.label}
              </button>
            );
          })}
        </motion.div>

        {/* ---------- Featured composition (like the reference's hero card) ---------- */}
        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-5 overflow-hidden rounded-[28px] border border-line bg-gradient-to-b from-raised to-surface shadow-card"
          >
            <div className="relative h-[250px]">
              <HeroStage
                kind={toObjectKind(featured.id)}
                accent={featured.accent}
                intensity="hero"
                zoom={2.9}
                className="h-full w-full"
                label={`${featured.arena} hero composition`}
              />
              <div className="absolute left-4 top-4">
                <PorcelainChip className="bg-ink-dark text-porcelain">
                  featured arena
                </PorcelainChip>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-raised via-raised/92 to-transparent p-5 pt-10">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-semibold leading-tight">
                      {featured.arena}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-ink-soft">
                      {featured.description}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/arenas/${featured.id}`)}
                    aria-label={`Open ${featured.arena}`}
                    className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan text-[#04120F]"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ---------- Results list ---------- */}
        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2.5"
          >
            {results.length === 0 ? (
              <div className="surface-card flex flex-col items-center px-6 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-black/30">
                  <Search className="h-5 w-5 text-faint" />
                </div>
                <p className="mt-3 text-[13.5px] font-medium">No arenas match</p>
                <p className="mt-1 max-w-[240px] text-[12px] leading-snug text-faint">
                  Try a broader term, or browse a popular category below.
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {['AI', 'Data', 'Web', 'Security'].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setQuery('');
                        setFilter('all');
                      }}
                      className="press rounded-full border border-line px-2.5 py-1 text-[11px] text-muted"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div variants={listStagger} initial="hidden" animate="show">
                {results.map((d) => (
                  <motion.div key={d.id}>
                    <Link
                      to={`/arenas/${d.id}`}
                      className="press surface-card flex items-center gap-3 p-3.5"
                    >
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-black/30">
                        <ObjectGlyph
                          kind={toObjectKind(d.id)}
                          accent={d.accent}
                          className="h-10 w-10"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-[13.5px] font-semibold">
                            {d.arena}
                          </p>
                          {d.provisional && (
                            <span className="rounded-full bg-amber/15 px-1.5 py-[1px] font-mono text-[8.5px] uppercase tracking-wider text-amber">
                              prov
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-[11.5px] text-faint">
                          {d.tagline}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2.5">
                          <span className="tnum font-mono text-[11px] text-muted">
                            {formatNumber(d.rating)}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-faint/50" />
                          <span className="text-[10.5px] text-faint">
                            {d.mastery}% mastery
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-faint" />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
