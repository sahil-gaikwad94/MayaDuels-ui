import { readArchive } from "../lib/matchArchive";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  Clock,
  Filter,
  Share2,
  X,
} from "lucide-react";
import { Page, Badge } from "../components/Page";
import { AvatarToken } from "../components/AvatarToken";
import { MECHANICS, getDomain } from "../lib/domains";
import { useAppState } from "../state/AppState";
import { cn, formatClock, formatNumber } from "../lib/utils";
import { sfx } from "../lib/audio";
import type { DuelState } from "../lib/duel";

type FilterMode = "all" | "missed";

const LETTERS = ["A", "B", "C", "D"];

export function MatchQAScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const matchId = params.get("id");
  const { profile, saveVaultItem, toast } = useAppState();
  const [filter, setFilter] = useState<FilterMode>("all");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const duel = useMemo<DuelState | null>(() => {
    try {
      if (matchId)
        return readArchive().find((m) => m.matchId === matchId) ?? null;
      const raw = sessionStorage.getItem("mayaduels.lastDuel");
      return raw ? (JSON.parse(raw) as DuelState) : null;
    } catch {
      return null;
    }
  }, [matchId]);

  if (!duel) {
    return (
      <div className="pb-32">
        <Page width="sm" className="pt-[calc(var(--safe-t)+12px)]">
          <div className="surface-card mt-10 px-6 py-10 text-center">
            <p className="text-[13.5px] font-medium">No match to review</p>
            <p className="mt-1 text-[12px] text-faint">
              Finish a duel and the two-player Q&A appears here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="press mt-4 rounded-full bg-cyan px-4 py-2 text-[13px] font-semibold text-[#04120F]"
            >
              Back to arena
            </button>
          </div>
        </Page>
      </div>
    );
  }

  const domain = getDomain(duel.domainId);
  const rounds = duel.rounds.filter((r) =>
    filter === "all" ? true : !r.self?.correct,
  );
  const missedCount = duel.rounds.filter((r) => !r.self?.correct).length;

  return (
    <div className="pb-32">
      <Page width="md" className="pt-[calc(var(--safe-t)+12px)]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="press flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="label-mono">match Q&A</span>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  `${domain.arena} · ${duel.outcome} · ${8 - missedCount}/8 correct`,
                );
                toast({ title: "Match summary copied", tone: "success" });
              } catch {
                toast({ title: "Clipboard unavailable", tone: "error" });
              }
            }}
            aria-label="Share Q&A"
            className="press flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Header */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-[1.6rem] font-semibold leading-none tracking-[-0.03em]">
              {domain.arena}
            </h1>
            <Badge
              tone={
                duel.outcome === "WIN"
                  ? "cyan"
                  : duel.outcome === "LOSS"
                    ? "error"
                    : "neutral"
              }
            >
              {duel.outcome?.toLowerCase()}
            </Badge>
          </div>
          <p className="mt-1.5 text-[12px] text-faint">
            {duel.opponentName} · {formatNumber(duel.opponentRating)} ·{" "}
            {duel.selfScore}–{duel.opponentScore}
            {!duel.ratingEligible && " · practice"}
          </p>
        </div>

        {/* Score comparison lanes */}
        <div className="surface-card mt-4 p-3.5">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-faint">
            <span>you</span>
            <span>rival</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <AvatarToken seed={profile.avatarSeed} size={26} ring="#00F5D4" />
              <span className="truncate text-[11.5px] text-ink">
                {profile.handle}
              </span>
            </div>
            <span className="tnum font-mono text-[11.5px] text-muted">
              {duel.selfScore}
            </span>
            <span className="text-faint">:</span>
            <span className="tnum font-mono text-[11.5px] text-muted">
              {duel.opponentScore}
            </span>
            <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
              <span className="truncate text-[11.5px] text-muted">
                {duel.opponentName}
              </span>
              <AvatarToken
                seed={duel.startedAt % 97}
                size={26}
                ring="#FF2A85"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex rounded-full border border-line bg-surface/60 p-1">
            {(
              [
                { id: "all", label: `All rounds` },
                { id: "missed", label: `Missed (${missedCount})` },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "press rounded-full px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                  filter === f.id
                    ? "bg-white/8 text-ink"
                    : "text-faint hover:text-muted",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] text-faint">
            <Filter className="h-3 w-3" />
            {rounds.length} shown
          </span>
        </div>

        {/* Round cards */}
        <div className="mt-3 space-y-2.5">
          {rounds.map((r) => {
            const q = r.question;
            const correctId = q.correctChoiceId;
            const selfCorrect = Boolean(r.self?.correct);
            const oppCorrect = Boolean(r.opponent?.correct);
            const isOpen = expanded[r.index] ?? !selfCorrect;
            const correctLabel =
              q.choices.find((c) => c.id === correctId)?.label ?? "";
            const selfLabel =
              q.choices.find((c) => c.id === r.self?.choiceId)?.label ??
              "No answer";
            const oppLabel =
              q.choices.find((c) => c.id === r.opponent?.choiceId)?.label ??
              "No answer";

            return (
              <motion.div
                key={r.index}
                layout
                className="surface-card overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpanded((prev) => ({ ...prev, [r.index]: !isOpen }))
                  }
                  className="flex w-full items-start gap-3 p-3.5 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-semibold",
                      selfCorrect
                        ? "bg-cyan/15 text-cyan"
                        : r.self?.status === "timeout"
                          ? "bg-amber/15 text-amber"
                          : "bg-error/15 text-error",
                    )}
                  >
                    {selfCorrect ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    ) : r.self?.status === "timeout" ? (
                      <Clock className="h-3.5 w-3.5" />
                    ) : (
                      <X className="h-3.5 w-3.5" strokeWidth={3} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                        R{r.index + 1}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-faint/50" />
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint/80">
                        {MECHANICS[q.mechanic].short}
                      </span>
                      {r.index === 7 && (
                        <span className="rounded-full bg-magenta/15 px-1.5 py-[1px] font-mono text-[8px] uppercase tracking-wider text-magenta">
                          overdrive
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[12.5px] font-medium leading-snug text-ink">
                      {q.prompt}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-faint">
                      <span className="tnum font-mono">
                        {r.self?.elapsedMs
                          ? formatClock(r.self.elapsedMs)
                          : "timeout"}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-faint/50" />
                      <span
                        className={cn(
                          "font-mono",
                          selfCorrect ? "text-cyan" : "text-error",
                        )}
                      >
                        {r.self?.points ?? 0} pts
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "mt-1 h-4 w-4 shrink-0 text-faint transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-line px-3.5 py-3">
                        {/* Choices with stable labels */}
                        <div className="space-y-1">
                          {q.choices.map((c, i) => {
                            const isCorrect = c.id === correctId;
                            const isSelf = c.id === r.self?.choiceId;
                            const isOpp = c.id === r.opponent?.choiceId;
                            return (
                              <div
                                key={c.id}
                                className={cn(
                                  "flex items-center gap-2 rounded-lg border px-2.5 py-1.5",
                                  isCorrect
                                    ? "border-cyan/40 bg-cyan/8"
                                    : "border-line/60 bg-black/20",
                                )}
                              >
                                <span className="font-mono text-[9.5px] text-faint">
                                  {LETTERS[i]}
                                </span>
                                <span
                                  className={cn(
                                    "flex-1 text-[11.5px]",
                                    isCorrect ? "text-ink" : "text-muted",
                                  )}
                                >
                                  {c.label}
                                </span>
                                <div className="flex items-center gap-1">
                                  {isSelf && (
                                    <span className="rounded-full bg-cyan/15 px-1.5 py-[1px] font-mono text-[8px] uppercase tracking-wider text-cyan">
                                      you
                                    </span>
                                  )}
                                  {isOpp && (
                                    <span className="rounded-full bg-magenta/15 px-1.5 py-[1px] font-mono text-[8px] uppercase tracking-wider text-magenta">
                                      rival
                                    </span>
                                  )}
                                  {isCorrect && (
                                    <Check
                                      className="h-3 w-3 text-cyan"
                                      strokeWidth={3}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Two-lane comparison */}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {[
                            {
                              label: "Your answer",
                              value: selfLabel,
                              correct: selfCorrect,
                              time: r.self?.elapsedMs,
                              points: r.self?.points ?? 0,
                              tone: "cyan" as const,
                            },
                            {
                              label: "Rival answer",
                              value: oppLabel,
                              correct: oppCorrect,
                              time: r.opponent?.elapsedMs,
                              points: r.opponent?.points ?? 0,
                              tone: "magenta" as const,
                            },
                          ].map((lane) => (
                            <div
                              key={lane.label}
                              className="rounded-xl border border-line bg-black/25 p-2.5"
                            >
                              <p className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">
                                {lane.label}
                              </p>
                              <p className="mt-1 line-clamp-2 text-[11.5px] font-medium leading-snug text-ink">
                                {lane.value}
                              </p>
                              <div className="mt-1.5 flex items-center gap-1.5 text-[9.5px]">
                                <span
                                  className={cn(
                                    "rounded-full px-1.5 py-[1px] font-mono uppercase tracking-wider",
                                    lane.correct
                                      ? "bg-cyan/15 text-cyan"
                                      : "bg-error/15 text-error",
                                  )}
                                >
                                  {lane.correct ? "correct" : "missed"}
                                </span>
                                <span className="tnum font-mono text-faint">
                                  {lane.time
                                    ? formatClock(lane.time)
                                    : "timeout"}
                                </span>
                                <span className="tnum ml-auto font-mono text-faint">
                                  {lane.points}p
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Mental model */}
                        <div className="mt-3 rounded-xl border border-cyan-line/25 bg-cyan/5 p-3">
                          <div className="flex items-center justify-between">
                            <p className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-cyan">
                              mental model
                            </p>
                            <button
                              onClick={() => {
                                const key = q.conceptId;
                                setSaved((prev) => ({
                                  ...prev,
                                  [key]: !prev[key],
                                }));
                                if (!saved[key]) {
                                  saveVaultItem({
                                    conceptId: q.conceptId,
                                    concept: q.concept,
                                    domainId: q.domain,
                                    principle: q.explanation.summary,
                                    why: q.explanation.mentalModel,
                                    tradeoff: q.explanation.tradeoff,
                                  });
                                  sfx.play("tap");
                                  toast({
                                    title: "Saved to Vault",
                                    message: q.concept,
                                    tone: "success",
                                  });
                                }
                              }}
                              aria-label="Save concept"
                              className={cn(
                                "press flex h-7 items-center gap-1 rounded-full border px-2 text-[10px] font-medium",
                                saved[q.conceptId]
                                  ? "border-cyan/40 bg-cyan/12 text-cyan"
                                  : "border-line text-faint",
                              )}
                            >
                              {saved[q.conceptId] ? (
                                <BookmarkCheck className="h-3 w-3" />
                              ) : (
                                <Bookmark className="h-3 w-3" />
                              )}
                              {saved[q.conceptId] ? "saved" : "save"}
                            </button>
                          </div>
                          <p className="mt-1.5 text-[12px] font-medium leading-snug text-ink">
                            {correctLabel}
                          </p>
                          <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">
                            {q.explanation.mentalModel}
                          </p>
                          {q.explanation.tradeoff && (
                            <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
                              <span className="text-muted">Trade-off · </span>
                              {q.explanation.tradeoff}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {rounds.length === 0 && (
          <div className="surface-card mt-3 px-6 py-8 text-center">
            <p className="text-[13px] font-medium text-cyan">Flawless</p>
            <p className="mt-1 text-[12px] text-faint">
              No missed rounds in this match.
            </p>
          </div>
        )}

        <div className="mt-5">
          <button
            onClick={() => navigate("/queue")}
            className="press flex h-12 w-full items-center justify-center rounded-full bg-cyan text-[14px] font-semibold text-[#04120F]"
          >
            Queue next duel
          </button>
        </div>

        <p className="mt-4 text-center text-[10.5px] leading-relaxed text-faint/70">
          This is a static result record — not a replay. No tap timeline or
          animation is stored.
        </p>
      </Page>
    </div>
  );
}
