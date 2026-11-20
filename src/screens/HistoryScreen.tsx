import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Filter, Search } from 'lucide-react';
import { Page, SectionHeader, Badge } from '../components/Page';
import { IdentityCapsule } from '../components/IdentityCapsule';
import { AvatarToken } from '../components/AvatarToken';
import { DOMAINS, getDomain } from '../lib/domains';
import { DEMO_HISTORY } from '../lib/demoData';
import { cn, formatDelta, timeAgo } from '../lib/utils';
import { cardRise, listStagger } from '../lib/motion';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'W', label: 'Wins' },
  { id: 'L', label: 'Losses' },
  { id: 'D', label: 'Draws' },
];

export function HistoryScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [domain, setDomain] = useState('all');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    return DEMO_HISTORY.filter((r) => {
      if (filter !== 'all' && r.result !== filter) return false;
      if (domain !== 'all' && r.domainId !== domain) return false;
      if (query && !r.opponent.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [filter, domain, query]);

  const wins = DEMO_HISTORY.filter((r) => r.result === 'W').length;

  return (
    <div className="pb-32">
      <Page width="md" className="pt-[calc(var(--safe-t)+14px)]">
        <IdentityCapsule />

        <div className="mt-6">
          <h1 className="font-display text-[1.9rem] font-semibold leading-none tracking-[-0.03em]">
            Match history
          </h1>
          <p className="mt-1.5 text-[12.5px] text-faint">
            {DEMO_HISTORY.length} duels · {wins} wins · every result keeps both
            players&apos; Q&A
          </p>
        </div>

        {/* Search */}
        <div className="glass mt-4 flex items-center gap-2.5 rounded-full px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search opponent"
            aria-label="Search opponents"
            className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-faint/80 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'press shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-medium',
                filter === f.id
                  ? 'border-cyan-line/60 bg-cyan/12 text-cyan'
                  : 'border-line bg-surface/60 text-faint',
              )}
            >
              {f.label}
            </button>
          ))}
          <span className="mx-1 w-px shrink-0 bg-line" />
          <button
            onClick={() => setDomain('all')}
            className={cn(
              'press shrink-0 rounded-full border px-3 py-1.5 text-[12px]',
              domain === 'all'
                ? 'border-cyan-line/60 bg-cyan/12 text-cyan'
                : 'border-line bg-surface/60 text-faint',
            )}
          >
            All arenas
          </button>
          {DOMAINS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDomain(d.id)}
              className={cn(
                'press shrink-0 rounded-full border px-3 py-1.5 text-[12px]',
                domain === d.id
                  ? 'border-cyan-line/60 bg-cyan/12 text-cyan'
                  : 'border-line bg-surface/60 text-faint',
              )}
            >
              {d.short}
            </button>
          ))}
        </div>

        {/* Rows */}
        <div className="mt-4">
          <SectionHeader
            title={`${rows.length} result${rows.length === 1 ? '' : 's'}`}
            action={
              <span className="inline-flex items-center gap-1 text-[10.5px] text-faint">
                <Filter className="h-3 w-3" /> newest first
              </span>
            }
          />
          <motion.div
            variants={listStagger}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {rows.map((r) => {
              const d = getDomain(r.domainId);
              return (
                <motion.div key={r.id} variants={cardRise}>
                  <button
                    onClick={() => navigate('/match')}
                    className="press surface-card flex w-full items-center gap-3 p-3 text-left"
                  >
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-[12px] font-bold',
                        r.result === 'W' && 'bg-cyan/15 text-cyan',
                        r.result === 'L' && 'bg-error/15 text-error',
                        r.result === 'D' && 'bg-white/8 text-muted',
                      )}
                    >
                      {r.result}
                    </span>
                    <AvatarToken seed={r.opponentSeed} size={32} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-[12.5px] font-medium text-ink">
                          {r.opponent}
                        </p>
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: d.accent }}
                        />
                        <span className="truncate text-[10.5px] text-faint">
                          {d.short}
                        </span>
                      </div>
                      <p className="tnum mt-0.5 font-mono text-[10.5px] text-faint">
                        {r.selfScore}–{r.oppScore} · {r.accuracy}% acc ·{' '}
                        {timeAgo(r.playedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          'tnum font-mono text-[11.5px] font-medium',
                          r.delta > 0 ? 'text-cyan' : r.delta < 0 ? 'text-error' : 'text-muted',
                        )}
                      >
                        {formatDelta(r.delta)}
                      </p>
                      <p className="label-mono mt-0.5 text-[8px]">
                        {r.isRival ? 'practice' : 'ranked'}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-faint" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {rows.length === 0 && (
          <div className="surface-card mt-3 px-6 py-9 text-center">
            <p className="text-[13px] font-medium">No matches in this filter</p>
            <p className="mt-1 text-[12px] text-faint">
              Try a different result or arena.
            </p>
          </div>
        )}

        <p className="mt-5 text-center text-[10.5px] leading-relaxed text-faint/70">
          No replay player exists by design. Each row opens a static two-player
          Q&A record.
        </p>
      </Page>
    </div>
  );
}