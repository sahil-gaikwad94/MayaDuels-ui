import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/** Standard mobile-first page container with a max readable width. */
export function Page({
  children,
  className,
  width = "md",
}: {
  children: ReactNode;
  className?: string;
  width?: "sm" | "md" | "lg";
}) {
  const widths = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
  };
  const path = useLocation().pathname.split("/")[1];
  const sections: Record<string, string> = {
    identity: "Player identity",
    locker: "Equipment locker",
    settings: "Station controls",
    ranks: "Competitive standings",
    history: "Match archive",
    match: "Round analysis",
    result: "Duel debrief",
    vault: "Concept vault",
    anomaly: "Daily investigation",
    arenas: "Domain dossier",
    onboarding: "Player calibration",
    queue: "Rival search",
    duel: "Blitz circuit",
  };
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        widths[width],
        `route-page page-${path}`,
        className,
      )}
    >
      {path !== "duel" && sections[path] && (
        <div className="station-path">
          <Link to="/" aria-label="Return to lobby">
            MAYA / DUELS
          </Link>
          <span>/</span>
          {sections[path]}
        </div>
      )}
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  action,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-[12px] leading-snug text-faint">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-line", className)} />;
}

export function Stat({
  label,
  value,
  hint,
  accent,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="label-mono truncate">{label}</p>
      <p
        className="tnum mt-1 font-display text-xl font-semibold leading-none"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-[11px] leading-tight text-faint">{hint}</p>
      )}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "cyan" | "magenta" | "amber" | "error";
  className?: string;
}) {
  const tones = {
    neutral: "bg-white/6 text-muted border-white/8",
    cyan: "bg-cyan/12 text-cyan border-cyan/25",
    magenta: "bg-magenta/12 text-magenta border-magenta/25",
    amber: "bg-amber/12 text-amber border-amber/25",
    error: "bg-error/12 text-error border-error/25",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  color = "#00F5D4",
  height = 6,
  className,
  trackClassName,
}: {
  value: number;
  color?: string;
  height?: number;
  className?: string;
  trackClassName?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-white/8",
        trackClassName,
        className,
      )}
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          boxShadow: `0 0 12px ${color}55`,
        }}
      />
    </div>
  );
}
