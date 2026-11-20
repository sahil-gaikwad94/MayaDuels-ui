import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Globe, Medal, TrendingDown, TrendingUp, Trophy } from 'lucide-react';
import { Page, SectionHeader, Badge, ProgressBar } from '../components/Page';
import { IdentityCapsule } from '../components/IdentityCapsule';
import { AvatarToken } from '../components/AvatarToken';
import { Sparkline } from '../components/Charts';
import { HeroStage } from '../components/HeroStage';
import { DEMO_LEADERS, DEMO_YOU, type LeaderRow } from '../lib/demoData';
import { DIVISIONS, divisionFor, nextDivision } from '../lib/domains';
import { useAppState } from '../state/AppState';
import { cn, formatNumber } from '../lib/utils';
import { cardRise, listStagger } from '../lib/motion';

const SCOPES = [
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'domain', label: 'Domain', icon: Medal },
  { id: 'friends', label: 'Friends', icon: Trophy },
];

export function RanksScreen() {
  const { profile } = useAppState();
  const [scope, setScope] = useState('global');

  const rows = useMemo(() => {
    const base = DEMO_LEADERS.map((r) =>
      r.handle === 'you' ? { ...r, handle: profile.handle, seed: profile.avatarSeed } : r,
    );
    return base;
  }, [profile.handle, profile.avatarSeed]);

  const you: LeaderRow = { ...DEMO_YOU, handle: profile.handle, seed: profile.avatarSeed };
  const division = divisionFor(you.rating);
  const next = nextDivision(you.rating);
  const progress = next
    ? ((you.rating - division.min) / (next.min - division.min)) * 100
    : 100;

  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div className="pb-32">
      <Page width="md" className="pt-[calc(var(--safe-t)+14px)]">
        <IdentityCapsule />

        <div className="mt-6 flex items-end justify-between">
          <div>
            <h1 className="font-display text-[1.9rem] font-semibold leading-none tracking-[-0.03em]">
              Ranks
            </h1>
            <p className="mt-1.5 text-[12.5px] text-faint">
              Glicko-2 · provisional ratings stay marked until settled
            </p>
          </div>
          <Badge tone="cyan">{division.name}</Badge>
        </div>

        {/* Division progress hero */}
        <motion.div
          variants={cardRise}
          initial="hidden"
          animate="show"
          className="relative mt-4 overflow-hidden rounded-[26px] border border-line bg-gradient-to-br from-raised to-surface p-4"
        >
          <div className="flex items-start gap-3">
            <div className="relative h-16 w-16 shrink-0">
              <HeroStage
                kind="trophy"
                accent={division.color}
                intensity="mini"
                zoom={3.4}
                className="h-full w-full"
                label="Division emblem"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="label-mono">your division</p>
              <p className="mt-1 font-display text-xl font-semibold leading-none">
                {division.name}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="tnum font-mono text-[13px] font-medium text-ink">
                  {formatNumber(you.rating)}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-cyan/12 px-1.5 py-[1px] text-[10px] text-cyan">
                  <TrendingUp className="h-2.5 w-2.5" />+18
                </span>
                {you.rank > 0 && (
                  <span className="font-mono text-[10px] text-faint">
                    provisional
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3.5">
            <div className="mb-1.5 flex justify-between font-mono text-[9.5px] text-faint">
              <>{division.name}</>
              <>{next ? `${next.name} · ${next.min}` : 'peak'}</>
            </div>
            <ProgressBar value={progress} color={division.color} height={5} />
          </div>
        </motion.div>

        {/* Scope tabs */}
        <div className="mt-4 flex rounded-full border border-line bg-surface/60 p-1">
          {SCOPES.map((s) => (
            <button
              key={s.id}
              onClick={() => setScope(s.id)}
              className={cn(
                'press flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11.5px] font-medium transition-colors',
                scope === s.id ? 'bg-white/8 text-ink' : 'text-faint',
              )}
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          ))}
        </div>

        {scope === 'friends' ? (
          <div className="surface-card mt-3 px-6 py-9 text-center">
            <p className="text-[13px] font-medium">No friends graph yet</p>
            <p className="mt-1 text-[12px] text-faint">
              Friend lists arrive with the social phase. No fabricated social
              proof here.
            </p>
          </div>
        ) : (
          <>
            {/* Podium */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[1, 0, 2].map((idx) => {
                const p = podium[idx];
                if (!p) return <div key={idx} />;
                const heights = ['h-20', 'h-24', 'h-16'];
                const medals = ['🥈', '🥇', '🥉'];
                return (
                  <motion.div
                    key={p.handle}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="flex flex-col items-center"
                  >
                    <AvatarToken
                      seed={p.seed}
                      size={idx === 0 ? 46 : 38}
                      ring={idx === 0 ? '#FFB800' : '#9FB4C7'}
                    />
                    <p className="mt-1.5 w-full truncate text-center text-[11px] font-medium text-ink">
                      {p.handle}
                    </p>
                    <p className="tnum font-mono text-[10.5px] text-faint">
                      {formatNumber(p.rating)}
                    </p>
                    <div
                      className={cn(
                        'mt-1.5 flex w-full items-start justify-center rounded-t-xl border border-b-0 pt-1.5',
                        heights[idx],
                        idx === 0
                          ? 'border-amber/30 bg-gradient-to-t from-amber/12 to-transparent'
                          : 'border-line bg-white/4',
                      )}
                    >
                      <span className="text-sm">{medals[idx]}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Table */}
            <div className="mt-4">
              <SectionHeader
                title={scope === 'global' ? 'Global leaderboard' : 'Domain leaderboard'}
                subtitle="Top 12 · rating and movement"
              />
              <div className="surface-card divide-y divide-line">
                {rest.map((r, i) => (
                  <motion.div
                    key={r.handle}
                    variants={cardRise}
                    className="flex items-center gap-2.5 px-3 py-2.5"
                  >
                    <span className="w-6 shrink-0 text-center font-mono text-[11px] text-faint">
                      {i + 4}
                    </span>
                    <AvatarToken seed={r.seed} size={28} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-ink">
                        {r.handle}
                      </p>
                      <p className="font-mono text-[9.5px] text-faint">
                        {r.wins}W · {r.matches}M
                      </p>
                    </div>
                    <span className="tnum font-mono text-[11.5px] text-muted">
                      {formatNumber(r.rating)}
                    </span>
                    <span
                      className={cn(
                        'flex w-11 items-center justify-end gap-0.5 font-mono text-[10px]',
                        r.trend > 0
                          ? 'text-cyan'
                          : r.trend < 0
                            ? 'text-error'
                            : 'text-faint',
                      )}
                    >
                      {r.trend > 0 ? (
                        <TrendingUp className="h-2.5 w-2.5" />
                      ) : r.trend < 0 ? (
                        <TrendingDown className="h-2.5 w-2.5" />
                      ) : null}
                      {r.trend !== 0 && Math.abs(r.trend)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Your row */}
            <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-cyan-line/40 bg-cyan/8 px-3 py-3">
              <span className="w-6 shrink-0 text-center font-mono text-[11px] text-cyan">
                {you.rank}
              </span>
              <AvatarToken seed={you.seed} size={30} ring="#00F5D4" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-ink">
                  {you.handle} <span className="text-[10px] text-cyan">you</span>
                </p>
                <p className="font-mono text-[9.5px] text-faint">
                  {you.wins}W · {you.matches}M
                </p>
              </div>
              <span className="tnum font-mono text-[11.5px] font-medium text-ink">
                {formatNumber(you.rating)}
              </span>
              <span className="flex w-11 items-center justify-end gap-0.5 font-mono text-[10px] text-cyan">
                <TrendingUp className="h-2.5 w-2.5" />18
              </span>
            </div>

            {/* Divisions ladder */}
            <div className="mt-5">
              <SectionHeader title="Divisions" subtitle="Thresholds set after rating simulation" />
              <div className="surface-card p-3.5">
                <div className="flex items-center justify-between gap-1">
                  {DIVISIONS.map((d, i) => {
                    const reached = you.rating >= d.min;
                    return (
                      <div key={d.name} className="flex flex-1 flex-col items-center gap-1.5">
                        <div className="flex w-full items-center">
                          <div
                            className="h-[3px] flex-1 rounded-full"
                            style={{
                              background: reached ? d.color : 'rgba(255,255,255,0.08)',
                            }}
                          />
                          {i < DIVISIONS.length - 1 && (
                            <div
                              className="h-[3px] w-2"
                              style={{ background: 'rgba(255,255,255,0.08)' }}
                            />
                          )}
                        </div>
                        <span
                          className={cn(
                            'text-center text-[9px] leading-tight',
                            reached ? 'text-muted' : 'text-faint/60',
                          )}
                        >
                          {d.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-black/25 p-2.5">
                  <Sparkline
                    data={[1320, 1348, 1331, 1372, 1390, 1384, 1421, 1440, 1436, 1462, 1470, 1482]}
                    color="#00F5D4"
                    width={110}
                    height={32}
                  />
                  <p className="text-[10.5px] leading-snug text-faint">
                    Your rating moved{' '}
                    <span className="text-cyan">+162</span> over the last 12
                    matches.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-faint/70">
              <Crown className="h-3 w-3" />
              Percentiles are hidden until population coverage is valid.
            </p>
          </>
        )}
      </Page>
    </div>
  );
}