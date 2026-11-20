import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Clock,
  Info,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Page, Badge, ProgressBar, SectionHeader, Stat } from '../components/Page';
import { HeroStage } from '../components/HeroStage';
import { toObjectKind } from '../components/ObjectGlyph';
import { Sparkline, Ring } from '../components/Charts';
import { Button } from '../components/Button';
import { getDomain } from '../lib/domains';
import { cn, formatNumber } from '../lib/utils';
import { cardRise, listStagger } from '../lib/motion';

const RECENT_FORM = [
  { result: 'W', delta: +18, score: '1012–944', ago: '2h' },
  { result: 'W', delta: +16, score: '988–901', ago: '1d' },
  { result: 'L', delta: -12, score: '870–1004', ago: '2d' },
  { result: 'W', delta: +21, score: '1104–876', ago: '3d' },
  { result: 'D', delta: +2, score: '940–940', ago: '4d' },
];

export function DomainDetailScreen() {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const domain = getDomain(domainId);

  const isOmni = domain.id === 'OMNI';

  return (
    <div className="pb-32">
      <Page width="md" className="pt-[calc(var(--safe-t)+14px)]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="press flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="label-mono">{domain.short}</span>
          <button
            aria-label="Share arena"
            className="press flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>

        {/* Hero */}
        <motion.div
          variants={cardRise}
          initial="hidden"
          animate="show"
          className="relative mt-4 overflow-hidden rounded-[28px] border border-line bg-gradient-to-b from-raised to-surface"
        >
          <div className="relative h-[236px]">
            <HeroStage
              kind={toObjectKind(domain.id)}
              accent={domain.accent}
              intensity="hero"
              zoom={2.85}
              className="h-full w-full"
              label={`${domain.arena} 3D hero`}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface via-surface/80 to-transparent p-4 pt-12">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h1 className="font-display text-[1.6rem] font-semibold leading-none tracking-[-0.03em]">
                    {domain.arena}
                  </h1>
                  <p className="mt-1.5 text-[12px] text-muted">{domain.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="tnum font-display text-xl font-semibold leading-none">
                    {formatNumber(domain.rating)}
                  </p>
                  <p className="label-mono mt-1 text-[8.5px]">
                    {domain.provisional ? 'provisional' : 'rating'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="mt-4 text-[13px] leading-relaxed text-muted">
          {domain.description}
        </p>

        {/* Mastery + rating */}
        <motion.div
          variants={cardRise}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.06 }}
          className="mt-5 grid grid-cols-2 gap-2.5"
        >
          <div className="surface-card p-3.5">
            <div className="flex items-center justify-between">
              <p className="label-mono">Mastery</p>
              <Ring
                progress={domain.mastery / 100}
                size={34}
                stroke={3}
                color={domain.accent}
              >
                <span className="tnum font-mono text-[9px] text-muted">
                  {domain.mastery}
                </span>
              </Ring>
            </div>
            <p className="mt-1 text-[11px] leading-snug text-faint">
              {domain.mastery >= 70
                ? 'Strong mental models'
                : domain.mastery >= 50
                  ? 'Solid, with visible gaps'
                  : 'Developing — review due'}
            </p>
          </div>
          <div className="surface-card p-3.5">
            <div className="flex items-center justify-between">
              <p className="label-mono">Form</p>
              <TrendingUp className="h-3.5 w-3.5 text-cyan" />
            </div>
            <p className="tnum mt-1.5 font-display text-lg font-semibold leading-none">
              +{domain.trend[domain.trend.length - 1] - domain.trend[0]}
            </p>
            <p className="mt-1 text-[11px] text-faint">
              across {domain.matches} duels
            </p>
          </div>
        </motion.div>

        <div className="surface-card mt-2.5 p-3.5">
          <div className="flex items-center justify-between">
            <p className="label-mono">Rating trend</p>
            <span className="font-mono text-[10px] text-faint">last 12 matches</span>
          </div>
          <Sparkline
            data={domain.trend}
            color={domain.accent}
            width={320}
            height={52}
            className="mt-2 h-14 w-full"
            strokeWidth={1.8}
          />
        </div>

        {/* Topics */}
        <div className="mt-6">
          <SectionHeader
            title="Topic clusters"
            subtitle="What this arena actually tests"
          />
          <motion.div
            variants={listStagger}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-1.5"
          >
            {domain.topics.map((t, i) => (
              <motion.span
                key={t}
                variants={cardRise}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[11.5px]',
                  i === 0
                    ? 'border-cyan-line/50 bg-cyan/10 text-cyan'
                    : 'border-line bg-surface/70 text-muted',
                )}
              >
                {t}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Recent form */}
        <div className="mt-6">
          <SectionHeader
            title="Recent form"
            subtitle={isOmni ? 'Mixed-deck results' : `${domain.arena} results`}
            action={
              <Link to="/history" className="text-[11.5px] font-medium text-cyan">
                All
              </Link>
            }
          />
          <div className="surface-card divide-y divide-line">
            {RECENT_FORM.map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-3.5 py-2.5">
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg font-mono text-[10.5px] font-semibold',
                    r.result === 'W' && 'bg-cyan/15 text-cyan',
                    r.result === 'L' && 'bg-error/15 text-error',
                    r.result === 'D' && 'bg-white/8 text-muted',
                  )}
                >
                  {r.result}
                </span>
                <span className="tnum font-mono text-[12px] text-muted">
                  {r.score}
                </span>
                <span
                  className={cn(
                    'ml-auto font-mono text-[11px]',
                    r.delta > 0 ? 'text-cyan' : 'text-error',
                  )}
                >
                  {r.delta > 0 ? '+' : '−'}
                  {Math.abs(r.delta)}
                </span>
                <span className="w-8 text-right text-[10.5px] text-faint">
                  {r.ago}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <Button
            size="lg"
            full
            onClick={() => navigate('/queue')}
            icon={<Zap className="h-[18px] w-[18px]" />}
            trailingIcon={<ArrowRight className="h-4 w-4 opacity-70" />}
          >
            Enter {domain.arena}
          </Button>
          <div className="mt-2.5 flex items-center justify-center gap-4 text-[11px] text-faint">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> 60s
            </span>
            <span className="inline-flex items-center gap-1">
              <Target className="h-3 w-3" /> 8 rounds
            </span>
            <span className="inline-flex items-center gap-1">
              <ChevronRight className="h-3 w-3" /> {domain.difficulty}
            </span>
          </div>
        </div>
      </Page>
    </div>
  );
}