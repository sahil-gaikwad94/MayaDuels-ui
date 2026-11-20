import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarClock,
  Flame,
  Layers,
  Search,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { IdentityCapsule } from '../components/IdentityCapsule';
import { ArenaField } from '../components/ArenaField';
import { ArenaCarousel } from '../components/ArenaCarousel';
import { RatingHero } from '../components/RatingHero';
import { Porcelain, PorcelainChip, PorcelainRule } from '../components/Porcelain';
import { ObjectGlyph } from '../components/ObjectGlyph';
import { ALL_ARENAS, divisionFor } from '../lib/domains';
import { fieldFor } from '../lib/field';
import { useAppState } from '../state/AppState';
import { cn, formatNumber } from '../lib/utils';
import { EASE } from '../lib/motion';

const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function HomeScreen() {
  const navigate = useNavigate();
  const { selectedDomain, selectDomain, matchesPlayed, streak, vault } =
    useAppState();

  const selectedIndex = useMemo(
    () => Math.max(0, ALL_ARENAS.findIndex((a) => a.id === selectedDomain)),
    [selectedDomain],
  );

  const active = ALL_ARENAS[selectedIndex];
  const palette = useMemo(() => fieldFor(active.id), [active.id]);
  const division = divisionFor(active.rating);
  const provisional = matchesPlayed < 8;

  const dueReviews = vault.filter(
    (v) => new Date(v.dueAt).getTime() <= Date.now(),
  ).length;

  const weekBars = [42, 58, 35, 71, 64, 88, 52];
  const winRate = matchesPlayed ? 58 : 0;

  return (
    <div className="relative min-h-dvh pb-36">
      {/* ---------- Luminous arena field ---------- */}
      <div className="absolute inset-x-0 top-0 h-[560px] overflow-hidden">
        <ArenaField palette={palette} />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background: `linear-gradient(to bottom, transparent, #090A0F 88%)`,
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-md px-4 pt-[calc(var(--safe-t)+14px)]">
        {/* ---------- Floating identity capsule ---------- */}
        <IdentityCapsule tone="onField" />

        {/* ---------- Hero metric ---------- */}
        <RatingHero
          arena={active}
          palette={palette}
          delta={18}
          provisional={provisional}
          className="mt-7"
        />

        {/* ---------- Search capsule ---------- */}
        <Link
          to="/arenas"
          className="press mt-6 flex h-11 items-center gap-2.5 rounded-full px-4 backdrop-blur-md"
          style={{
            background: 'rgba(255,255,255,0.14)',
            border: '1px solid rgba(255,255,255,0.22)',
            color: palette.ink,
          }}
        >
          <Search className="h-4 w-4 opacity-80" />
          <span className="text-[13px] opacity-80">
            Search arenas, topics, concepts
          </span>
        </Link>

        {/* ---------- Carousel ---------- */}
        <div className="mt-7">
          <div className="mb-1 flex items-end justify-between">
            <div>
              <p
                className="font-mono text-[9.5px] uppercase tracking-[0.18em]"
                style={{ color: palette.ink, opacity: 0.6 }}
              >
                Choose your arena
              </p>
              <h2
                className="mt-1 font-display text-[19px] font-semibold tracking-[-0.02em]"
                style={{ color: palette.ink }}
              >
                Six domains. One deck each.
              </h2>
            </div>
            <Link
              to="/arenas"
              className="press inline-flex items-center gap-1 text-[12px] font-medium"
              style={{ color: palette.ink, opacity: 0.8 }}
            >
              All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ArenaCarousel
            arenas={ALL_ARENAS}
            index={selectedIndex}
            onChange={(i) => selectDomain(ALL_ARENAS[i].id)}
            onOpenArena={(a) => navigate(`/arenas/${a.id}`)}
          />
        </div>

        {/* ---------- Primary CTA ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE.out }}
          className="mt-6"
        >
          <button
            onClick={() => navigate('/queue')}
            className="press group relative flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-ink-dark text-[15px] font-semibold text-porcelain shadow-float-lg"
          >
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `linear-gradient(100deg, transparent, ${palette.bright}33, transparent)`,
              }}
            />
            <Zap className="relative h-[18px] w-[18px]" />
            <span className="relative">Enter 60s Blitz</span>
            <span
              className="relative ml-1 rounded-full px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.12em]"
              style={{ background: palette.bright, color: '#0A0F14' }}
            >
              live
            </span>
          </button>
          <p
            className="mt-2.5 text-center text-[11px]"
            style={{ color: palette.ink, opacity: 0.6 }}
          >
            8 rounds · 7.5s each · {active.arena}
          </p>
        </motion.div>

        {/* ---------- Stat trio (porcelain chips on the field) ---------- */}
        <div className="mt-6 grid grid-cols-3 gap-2.5">
          {[
            {
              icon: Flame,
              label: 'Streak',
              value: `${streak.count}d`,
              hint: streak.count > 0 ? 'keep it alive' : 'play today',
              tint: '#FFB800',
            },
            {
              icon: Target,
              label: 'Win rate',
              value: matchesPlayed ? `${winRate}%` : '—',
              hint: `${matchesPlayed} duels`,
              tint: palette.bright,
            },
            {
              icon: Layers,
              label: 'Vault',
              value: `${vault.length}`,
              hint: dueReviews ? `${dueReviews} due` : 'all clear',
              tint: dueReviews ? '#00F5D4' : undefined,
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.45, ease: EASE.out }}
              className="rounded-2xl p-3 backdrop-blur-md"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.16)',
              }}
            >
              <s.icon
                className="h-3.5 w-3.5"
                style={{ color: s.tint ?? palette.ink, opacity: s.tint ? 1 : 0.6 }}
              />
              <p
                className="tnum mt-1.5 font-display text-lg font-semibold leading-none"
                style={{ color: palette.ink }}
              >
                {s.value}
              </p>
              <p
                className="mt-1 text-[10px] leading-tight"
                style={{ color: palette.ink, opacity: 0.55 }}
              >
                {s.hint}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ---------- Below the fold: dark content ---------- */}
      <div className="relative mx-auto mt-8 w-full max-w-md px-4">
        <div className="space-y-3">
          {/* Daily Anomaly — porcelain feature card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: EASE.out }}
          >
            <Link to="/anomaly" className="press block">
              <Porcelain radius="rounded-[26px]" className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink-dark">
                    <Sparkles className="h-5 w-5 text-magenta" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[14.5px] font-semibold text-ink-dark">
                        Daily Anomaly
                      </p>
                      <PorcelainChip className="bg-magenta text-white">
                        live
                      </PorcelainChip>
                    </div>
                    <p className="mt-1 text-[12px] leading-snug text-ink-soft">
                      One shared five-step investigation. Same deck for everyone,
                      resets at 00:00 UTC.
                    </p>
                    <div className="mt-2.5 flex items-center gap-3 text-[11px] text-ink-faint">
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" />
                        07:42:11 left
                      </span>
                      <span className="h-1 w-1 rounded-full bg-ink-faint/40" />
                      <span>1.8k finished</span>
                    </div>
                  </div>
                </div>
              </Porcelain>
            </Link>
          </motion.div>

          {/* Weakness Blitz */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE.out }}
          >
            <Link
              to="/vault?mode=weakness"
              className="press surface-card flex items-center gap-3 p-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-black/30">
                <ObjectGlyph kind="AI_ML" accent="#00F5D4" className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink">Weakness Blitz</p>
                <p className="mt-0.5 text-[12px] text-faint">
                  {dueReviews > 0
                    ? `${dueReviews} concept${dueReviews > 1 ? 's' : ''} ready for review`
                    : 'Attack the gaps in your mental models'}
                </p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-faint">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </motion.div>

          {/* This week */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE.out }}
            className="surface-card p-4"
          >
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-[14px] font-semibold text-ink">This week</p>
                <p className="mt-0.5 text-[11.5px] text-faint">
                  Your last seven days of duels
                </p>
              </div>
              <Link to="/history" className="text-[11.5px] font-medium text-cyan">
                History
              </Link>
            </div>
            <div className="flex items-end justify-between gap-2">
              {weekBars.map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-16 w-full items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.04,
                        type: 'spring',
                        stiffness: 200,
                        damping: 24,
                      }}
                      className={cn(
                        'w-full rounded-md',
                        i === 5 ? 'bg-cyan' : 'bg-white/12',
                      )}
                    />
                  </div>
                  <span className="font-mono text-[9px] text-faint">
                    {WEEK_LABELS[i]}
                  </span>
                </div>
              ))}
            </div>
            <PorcelainRule className="my-3 opacity-0" />
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <div>
                <p className="tnum font-display text-base font-semibold text-ink">
                  {formatNumber(active.rating)}
                </p>
                <p className="text-[10.5px] text-faint">current rating</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-medium text-cyan">
                  {division.name}
                </p>
                <p className="text-[10.5px] text-faint">division</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
