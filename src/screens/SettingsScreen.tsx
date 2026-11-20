import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  Eye,
  Gauge,
  LogOut,
  Palette,
  ShieldCheck,
  Trash2,
  Type,
  Volume2,
  Vibrate,
  Zap,
} from "lucide-react";
import { Page, Badge, SectionHeader } from "../components/Page";
import { useAppState } from "../state/AppState";
import { cn } from "../lib/utils";
import { sfx, haptics } from "../lib/audio";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "press relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200",
        checked ? "border-cyan/50 bg-cyan/30" : "border-line bg-white/8",
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all duration-200",
          checked ? "left-[22px] bg-cyan" : "left-1 bg-faint",
        )}
      />
    </button>
  );
}

function Row({
  icon: Icon,
  title,
  detail,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-3">
      <Icon className="h-4 w-4 shrink-0 text-faint" />
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-medium text-ink">{title}</p>
        {detail && (
          <p className="mt-0.5 text-[10.5px] leading-snug text-faint">
            {detail}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export function SettingsScreen() {
  const navigate = useNavigate();
  const { settings, setSettings, resetAll, profile, toast } = useAppState();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="pb-32">
      <Page width="sm" className="pt-[calc(var(--safe-t)+12px)]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="press flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="label-mono">settings</span>
          <span className="w-10" />
        </div>

        <h1 className="mt-4 font-display text-[1.7rem] font-semibold leading-none tracking-[-0.03em]">
          Settings
        </h1>
        <p className="mt-1.5 text-[12.5px] text-faint">
          Sound, haptics, motion and accessibility
        </p>

        {/* Audio */}
        <div className="mt-5">
          <SectionHeader title="Audio" />
          <div className="surface-card divide-y divide-line">
            <Row
              icon={Volume2}
              title="Sound effects"
              detail="Procedural, no downloads"
            >
              <Toggle
                checked={settings.sound}
                onChange={(v) => {
                  setSettings({ sound: v });
                  if (v) sfx.play("correct");
                }}
                label="Sound effects"
              />
            </Row>
            <div className="px-3.5 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] font-medium text-ink">Volume</p>
                <span className="tnum font-mono text-[11px] text-faint">
                  {Math.round(settings.volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(settings.volume * 100)}
                onChange={(e) => {
                  const v = Number(e.target.value) / 100;
                  setSettings({ volume: v });
                  sfx.play("tick");
                }}
                aria-label="Volume"
                className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#00F5D4]"
                style={{ accentColor: "#00F5D4" }}
              />
            </div>
          </div>
        </div>

        {/* Haptics */}
        <div className="mt-4">
          <SectionHeader title="Haptics" />
          <div className="surface-card divide-y divide-line">
            <Row
              icon={Vibrate}
              title="Haptic feedback"
              detail="Optional, never required"
            >
              <Toggle
                checked={settings.haptics}
                onChange={(v) => {
                  setSettings({ haptics: v });
                  haptics.fire(v ? "medium" : "light");
                }}
                label="Haptic feedback"
              />
            </Row>
          </div>
        </div>

        {/* Motion & performance */}
        <div className="mt-4">
          <SectionHeader title="Motion & performance" />
          <div className="surface-card divide-y divide-line">
            <Row
              icon={Eye}
              title="Reduced motion"
              detail="Stops idle float, parallax and large transitions"
            >
              <Toggle
                checked={settings.reduceMotion}
                onChange={(v) => {
                  setSettings({ reduceMotion: v });
                  toast({
                    title: v ? "Reduced motion on" : "Reduced motion off",
                    message: v
                      ? "3D objects fall back to static renders."
                      : undefined,
                  });
                }}
                label="Reduced motion"
              />
            </Row>
            <Row
              icon={Gauge}
              title="Low effects mode"
              detail="Static hero renders, no blur or live shadows"
            >
              <Toggle
                checked={settings.lowEffects}
                onChange={(v) => {
                  setSettings({ lowEffects: v });
                  toast({
                    title: v ? "Low effects enabled" : "Low effects disabled",
                    message: v
                      ? "Hero objects now use static vector fallbacks."
                      : "Live 3D restored where supported.",
                  });
                }}
                label="Low effects mode"
              />
            </Row>
          </div>
        </div>

        {/* Accessibility */}
        <div className="mt-4">
          <SectionHeader title="Accessibility" />
          <div className="surface-card divide-y divide-line">
            <Row icon={Type} title="Text size" detail="Scales supporting copy">
              <div className="flex rounded-full border border-line bg-black/25 p-0.5">
                {(["md", "lg", "xl"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSettings({ textSize: s })}
                    className={cn(
                      "press rounded-full px-2.5 py-1 font-mono text-[10px] uppercase",
                      settings.textSize === s
                        ? "bg-white/10 text-ink"
                        : "text-faint",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Row>
            <Row
              icon={Bell}
              title="Notifications"
              detail="Quiet in this preview build"
            >
              <Badge tone="neutral">off</Badge>
            </Row>
          </div>
        </div>

        {/* Account */}
        <div className="mt-4">
          <SectionHeader title="Account" />
          <div className="surface-card divide-y divide-line">
            <Row
              icon={ShieldCheck}
              title="Link account"
              detail={profile.handle}
            >
              <button
                onClick={() =>
                  toast({
                    title: "Account linking",
                    message:
                      "Preserves handle, rating and history across devices.",
                  })
                }
                className="press rounded-full border border-cyan-line/50 bg-cyan/10 px-3 py-1.5 text-[11.5px] font-medium text-cyan"
              >
                Link
              </button>
            </Row>
            <Row icon={LogOut} title="Sign out" detail="Keeps local progress">
              <ChevronRight className="h-4 w-4 text-faint" />
            </Row>
          </div>
        </div>

        {/* Danger */}
        <div className="mt-4">
          <SectionHeader title="Demo data" />
          <div className="surface-card divide-y divide-line">
            <Row
              icon={Trash2}
              title="Reset local data"
              detail="Clears your player pass, match tickets, daily run and vault. Keeps preferences."
            >
              <button
                onClick={() => {
                  if (!confirmReset) {
                    setConfirmReset(true);
                    return;
                  }
                  resetAll();
                  setConfirmReset(false);
                  navigate("/");
                }}
                className={cn(
                  "press rounded-full border px-3 py-1.5 text-[11.5px] font-medium",
                  confirmReset
                    ? "border-error/50 bg-error/15 text-error"
                    : "border-line text-muted",
                )}
              >
                {confirmReset ? "Confirm" : "Reset"}
              </button>
            </Row>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-line bg-surface/50 p-3.5">
          <p className="text-[11px] leading-relaxed text-faint">
            <span className="text-muted">Maya-Duels V3 · UI preview. </span>
            All match data is simulated locally. Nothing is sent to a server,
            and no fabricated human identity or percentile is displayed.
          </p>
        </div>

        <p className="mt-4 text-center font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint/60">
          build 3.0.0 · design preview
        </p>
      </Page>
    </div>
  );
}
