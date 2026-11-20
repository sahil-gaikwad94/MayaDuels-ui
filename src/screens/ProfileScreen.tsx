import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  Flame,
  Settings as SettingsIcon,
  Share2,
  Shield,
  Sparkles,
  Swords,
  Target,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Page, Badge, ProgressBar, SectionHeader } from "../components/Page";
import { IdentityCapsule } from "../components/IdentityCapsule";
import { AvatarToken } from "../components/AvatarToken";
import { Ring, Sparkline } from "../components/Charts";
import { DOMAINS, divisionFor, nextDivision } from "../lib/domains";
import { ACHIEVEMENTS } from "../lib/demoData";
import { useAppState } from "../state/AppState";
import { cn, formatNumber } from "../lib/utils";
import { cardRise, listStagger } from "../lib/motion";

export function ProfileScreen() {
  const navigate = useNavigate();
  const { profile, matchesPlayed, wins, streak, xp, sparks, vault } =
    useAppState();
  const division = divisionFor(1482);
  const next = nextDivision(1482);
  const winRate = matchesPlayed ? Math.round((wins / matchesPlayed) * 100) : 0;

  return (
    <div className="pb-32">
      <Page width="md" className="pt-[calc(var(--safe-t)+14px)]">
        <div className="flex justify-between items-center">
          <span className="overline">ARCADE MEMBERSHIP</span>
          <button className="back-link" onClick={() => navigate("/onboarding")}>
            Edit player pass ↗
          </button>
        </div>
        {/* Identity header */}
        <motion.div
          variants={cardRise}
          initial="hidden"
          animate="show"
          className="relative mt-5 overflow-hidden rounded-[28px] border border-line bg-gradient-to-b from-raised to-surface p-4"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(0,245,212,0.28), transparent 70%)",
            }}
          />
          <div className="relative flex items-start gap-3.5">
            <AvatarToken
              seed={profile.avatarSeed}
              size={64}
              ring={division.color}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="truncate font-display text-[1.35rem] font-semibold leading-none tracking-[-0.02em]">
                  {profile.handle}
                </h1>
                <Badge tone="cyan">{division.name}</Badge>
              </div>
              <p className="mt-1 text-[12px] text-muted">{profile.title}</p>
              <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-snug text-faint">
                {profile.bio}
              </p>
            </div>
            <button
              onClick={() => navigate("/settings")}
              aria-label="Profile settings"
              className="press flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-faint"
            >
              <SettingsIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mt-4 grid grid-cols-4 gap-2 border-t border-line pt-3.5">
            {[
              { label: "Rating", value: formatNumber(1482) },
              { label: "Duels", value: matchesPlayed },
              { label: "Win rate", value: `${winRate}%` },
              { label: "Streak", value: `${streak.count}d` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="tnum font-display text-[15px] font-semibold leading-none">
                  {s.value}
                </p>
                <p className="label-mono mt-1 text-[8px]">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* XP + sparks */}
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <div className="surface-card p-3.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan" />
              <p className="label-mono">Level {Math.floor(xp / 1000) + 1}</p>
            </div>
            <p className="tnum mt-1.5 font-display text-lg font-semibold leading-none">
              {xp.toLocaleString()} XP
            </p>
            <div className="mt-2">
              <ProgressBar value={(xp % 1000) / 10} height={4} />
            </div>
          </div>
          <div className="surface-card p-3.5">
            <div className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber" />
              <p className="label-mono">Sparks</p>
            </div>
            <p className="tnum mt-1.5 font-display text-lg font-semibold leading-none">
              {sparks.toLocaleString()}
            </p>
            <p className="mt-2 text-[10.5px] text-faint">
              cosmetic currency only
            </p>
          </div>
        </div>

        {/* Division progress */}
        <div className="surface-card mt-2.5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-mono">Division progress</p>
              <p className="mt-1 font-display text-[15px] font-semibold">
                {division.name}
                {next && <span className="text-faint"> → {next.name}</span>}
              </p>
            </div>
            <span className="tnum font-mono text-[11px] text-faint">
              {next ? `${next.min - 1482} to go` : "peak"}
            </span>
          </div>
          <div className="mt-2.5">
            <ProgressBar
              value={
                next
                  ? ((1482 - division.min) / (next.min - division.min)) * 100
                  : 100
              }
              color={division.color}
              height={5}
            />
          </div>
        </div>

        {/* Domain mastery */}
        <div className="mt-6">
          <SectionHeader
            title="Domain mastery"
            subtitle="Separate from rating — how robust each mental model is"
          />
          <motion.div
            variants={listStagger}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {DOMAINS.map((d) => (
              <motion.div
                key={d.id}
                variants={cardRise}
                className="surface-card flex items-center gap-3 p-3"
              >
                <Ring
                  progress={d.mastery / 100}
                  size={38}
                  stroke={3}
                  color={d.accent}
                >
                  <span className="tnum font-mono text-[9.5px] text-muted">
                    {d.mastery}
                  </span>
                </Ring>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[12.5px] font-medium text-ink">
                      {d.arena}
                    </p>
                    {d.provisional && (
                      <span className="rounded-full bg-amber/15 px-1.5 py-[1px] font-mono text-[8px] uppercase tracking-wider text-amber">
                        prov
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[10.5px] text-faint">
                    {d.matches} duels · {d.tagline}
                  </p>
                </div>
                <div className="text-right">
                  <p className="tnum font-mono text-[11.5px] text-muted">
                    {formatNumber(d.rating)}
                  </p>
                  <p className="label-mono mt-0.5 text-[8px]">rating</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Radar + insight */}
        <div className="mt-4 grid grid-cols-1 gap-2.5 xs:grid-cols-2 sm:grid-cols-2">
          <div className="surface-card p-3.5">
            <p className="label-mono">Skill shape</p>
            <div className="mt-2 flex items-center justify-center">
              <RadarChart />
            </div>
          </div>
          <div className="surface-card flex flex-col justify-between p-3.5">
            <div>
              <p className="label-mono">Plain-language insight</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">
                Strongest in <span className="text-ink">Web runtime</span> and{" "}
                <span className="text-ink">Core CS</span>. Biggest opportunity:{" "}
                <span className="text-amber">Security</span> — 38% mastery with
                three concepts due.
              </p>
            </div>
            <button
              onClick={() => navigate("/vault?mode=weakness")}
              className="press mt-3 flex h-9 items-center justify-center gap-1.5 rounded-full bg-cyan/12 text-[12px] font-medium text-cyan"
            >
              <Target className="h-3.5 w-3.5" /> Review gaps
            </button>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-6">
          <SectionHeader
            title="Achievements"
            subtitle={`${ACHIEVEMENTS.filter((a) => a.earned).length} of ${ACHIEVEMENTS.length} unlocked`}
            action={
              <button
                onClick={() => navigate("/locker")}
                className="text-[11.5px] font-medium text-cyan"
              >
                Locker
              </button>
            }
          />
          <div className="grid grid-cols-3 gap-2">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.id}
                className={cn(
                  "surface-card flex flex-col items-center px-2 py-3 text-center",
                  !a.earned && "opacity-45",
                )}
              >
                <span className="text-lg">{a.icon}</span>
                <p className="mt-1.5 text-[10.5px] font-medium leading-tight text-ink">
                  {a.name}
                </p>
                <p className="mt-0.5 text-[9px] leading-tight text-faint">
                  {a.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Season / account */}
        <div className="mt-5 space-y-2">
          <div className="surface-card flex items-center gap-3 p-3.5">
            <Calendar className="h-4 w-4 shrink-0 text-faint" />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-ink">Joined</p>
              <p className="text-[10.5px] text-faint">
                {new Date(profile.joinedAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Badge tone="neutral">anonymous</Badge>
          </div>
          <div className="surface-card flex items-center gap-3 p-3.5">
            <Shield className="h-4 w-4 shrink-0 text-faint" />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-ink">
                Account linking
              </p>
              <p className="text-[10.5px] text-faint">
                Preserve handle, rating and history across devices
              </p>
            </div>
            <button
              onClick={() => navigate("/settings")}
              className="press rounded-full border border-cyan-line/50 bg-cyan/10 px-3 py-1.5 text-[11.5px] font-medium text-cyan"
            >
              Link
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] leading-relaxed text-faint/70">
          No fabricated employer, school or verification is shown on any
          profile.
        </p>
      </Page>
    </div>
  );
}

/** Lightweight six-axis radar — supporting visual only, never the sole summary. */
function RadarChart() {
  const axes = ["AI", "Infra", "Data", "Web", "Core", "Sec"];
  const values = [72, 64, 51, 81, 68, 38];
  const size = 132;
  const c = size / 2;
  const r = 46;
  const point = (i: number, radius: number) => {
    const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
    return [c + Math.cos(angle) * radius, c + Math.sin(angle) * radius];
  };
  const polygon = (radius: number) =>
    axes.map((_, i) => point(i, radius).join(",")).join(" ");
  const valuePoints = values
    .map((v, i) => point(i, (v / 100) * r).join(","))
    .join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-[132px] w-[132px]">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={polygon(r * f)}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
        />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, r);
        return (
          <line
            key={i}
            x1={c}
            y1={c}
            x2={x}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={valuePoints}
        fill="rgba(0,245,212,0.16)"
        stroke="#00F5D4"
        strokeWidth={1.5}
      />
      {values.map((v, i) => {
        const [x, y] = point(i, (v / 100) * r);
        return <circle key={i} cx={x} cy={y} r={2.2} fill="#00F5D4" />;
      })}
      {axes.map((label, i) => {
        const [x, y] = point(i, r + 12);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#6E7789"
            fontSize="7"
            fontFamily="JetBrains Mono, monospace"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
