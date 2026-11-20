import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  Check,
  Clock,
  Layers,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Page, SectionHeader, Badge, ProgressBar } from "../components/Page";
import { IdentityCapsule } from "../components/IdentityCapsule";
import { getDomain, DOMAINS } from "../lib/domains";
import { DEMO_VAULT } from "../lib/demoData";
import { useAppState } from "../state/AppState";
import { cn } from "../lib/utils";
import { cardRise, listStagger } from "../lib/motion";
import { sfx, haptics } from "../lib/audio";

type Tab = "due" | "missed" | "mastered" | "saved";

export function VaultScreen() {
  const { vault, reviewVaultItem, removeVaultItem, toast } = useAppState();
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>(
    params.get("mode") === "weakness" ? "missed" : "due",
  );
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const items = vault;
  const now = Date.now();
  const due = items.filter((i) => new Date(i.dueAt).getTime() <= now);
  const missed = items.filter((i) => i.missCount > 0);
  const mastered = items.filter((i) => i.stage >= 3);
  const saved = items;

  const counts: Record<Tab, number> = {
    due: due.length,
    missed: missed.length,
    mastered: mastered.length,
    saved: saved.length,
  };

  const visible =
    tab === "due"
      ? due
      : tab === "missed"
        ? missed
        : tab === "mastered"
          ? mastered
          : saved;

  const active = reviewing
    ? items.find((i) => i.conceptId === reviewing)
    : null;

  const handleReview = (correct: boolean) => {
    if (!active) return;
    reviewVaultItem(active.conceptId, correct);
    sfx.play(correct ? "correct" : "incorrect");
    haptics.fire(correct ? "success" : "error");
    toast({
      title: correct ? "Review complete" : "Scheduled sooner",
      message: correct
        ? `${active.concept} moves up a review stage.`
        : `${active.concept} returns earlier — no penalty.`,
      tone: correct ? "success" : "default",
    });
    setReviewing(null);
    setRevealed(false);
  };

  if (!items.length)
    return (
      <div className="play-floor catalog">
        <div className="overline">
          <Layers size={14} /> PLAYER COLLECTION
        </div>
        <h1>
          Concept vault<span>.</span>
        </h1>
        <p>Your personal deck of engineering mental models.</p>
        <section className="vault-start">
          <img src="/arcade/disk.webp" alt="Two collectible floppy disks" />
          <div>
            <small>COLLECTION / 00</small>
            <h2>Save your first concept.</h2>
            <p>
              After a round, save the explanation to your vault. Come back here
              to test your recall and schedule your next review.
            </p>
            <Link className="play-key" to="/queue">
              Play a duel <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    );
  if (active) {
    return (
      <div className="pb-32">
        <Page width="sm" className="pt-[calc(var(--safe-t)+14px)]">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setReviewing(null);
                setRevealed(false);
              }}
              className="press flex h-10 items-center gap-1.5 rounded-full border border-line px-3.5 text-[12.5px] text-muted"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Back
            </button>
            <Badge tone="cyan">review</Badge>
          </div>

          <div className="mt-6">
            <p className="label-mono">{getDomain(active.domainId).arena}</p>
            <h1 className="mt-2 font-display text-[1.7rem] font-semibold leading-tight tracking-[-0.03em]">
              {active.concept}
            </h1>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full border border-line bg-black/25 px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                stage {active.stage + 1} / 5
              </span>
              <span className="rounded-full border border-line bg-black/25 px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                {active.missCount} miss{active.missCount === 1 ? "" : "es"}
              </span>
            </div>
          </div>

          <div className="surface-card mt-5 p-4">
            <p className="label-mono">Principle</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink">
              {active.principle}
            </p>
          </div>

          {!revealed ? (
            <div className="mt-4">
              <button
                onClick={() => setRevealed(true)}
                className="press flex h-12 w-full items-center justify-center rounded-full border border-cyan-line/50 bg-cyan/10 text-[13.5px] font-medium text-cyan"
              >
                Reveal mental model
              </button>
              <p className="mt-3 text-center text-[11.5px] text-faint">
                Try to recall the mechanism before revealing.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-2.5"
            >
              <div className="rounded-2xl border border-cyan-line/25 bg-cyan/5 p-4">
                <p className="label-mono text-cyan">Why it matters</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {active.why}
                </p>
                {active.tradeoff && (
                  <p className="mt-2 text-[12px] leading-relaxed text-faint">
                    <span className="text-muted">Trade-off · </span>
                    {active.tradeoff}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleReview(false)}
                  className="press flex h-12 items-center justify-center gap-1.5 rounded-full border border-error/40 bg-error/10 text-[13px] font-medium text-error"
                >
                  <RotateCcw className="h-4 w-4" /> Again
                </button>
                <button
                  onClick={() => handleReview(true)}
                  className="press flex h-12 items-center justify-center gap-1.5 rounded-full bg-cyan text-[13px] font-semibold text-[#04120F]"
                >
                  <Check className="h-4 w-4" /> Got it
                </button>
              </div>
            </motion.div>
          )}
        </Page>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <Page width="md" className="pt-[calc(var(--safe-t)+14px)]">
        <div className="mt-6 flex items-end justify-between">
          <div>
            <h1 className="font-display text-[1.9rem] font-semibold leading-none tracking-[-0.03em]">
              Concept vault
            </h1>
            <p className="mt-1.5 text-[12.5px] text-faint">
              {items.length} concepts · {due.length} due now
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-surface/70">
            <Layers className="h-5 w-5 text-cyan" />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex rounded-full border border-line bg-surface/60 p-1">
          {(
            [
              { id: "due", label: "Due" },
              { id: "missed", label: "Missed" },
              { id: "mastered", label: "Mastered" },
              { id: "saved", label: "All" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "press flex-1 rounded-full px-2 py-1.5 text-[11.5px] font-medium transition-colors",
                tab === t.id ? "bg-white/8 text-ink" : "text-faint",
              )}
            >
              {t.label}
              <span className="ml-1 font-mono text-[9.5px] opacity-60">
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Mastery overview */}
        <div className="surface-card mt-3 p-3.5">
          <div className="flex items-center justify-between">
            <p className="label-mono">Review health</p>
            <span className="font-mono text-[10px] text-faint">
              Leitner · 1/3/7/14/30d
            </span>
          </div>
          <div className="mt-2.5 flex gap-1">
            {[0, 1, 2, 3, 4].map((stage) => {
              const count = items.filter((i) => i.stage === stage).length;
              return (
                <div key={stage} className="flex-1">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      background:
                        count > 0 ? "#00F5D4" : "rgba(255,255,255,0.08)",
                      opacity: count > 0 ? 0.4 + stage * 0.15 : 1,
                    }}
                  />
                  <p className="mt-1 text-center font-mono text-[8.5px] text-faint">
                    {count}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cards */}
        <div className="mt-4">
          <SectionHeader
            title={
              tab === "due"
                ? "Due for review"
                : tab === "missed"
                  ? "Missed concepts"
                  : tab === "mastered"
                    ? "Recently mastered"
                    : "All saved"
            }
            subtitle={
              tab === "due"
                ? "Short recall, then schedule the next interval"
                : undefined
            }
          />
          <motion.div
            variants={listStagger}
            initial="hidden"
            animate="show"
            className="space-y-2.5"
          >
            {visible.map((item) => {
              const d = getDomain(item.domainId);
              const isDue = new Date(item.dueAt).getTime() <= now;
              return (
                <motion.div
                  key={item.conceptId}
                  variants={cardRise}
                  className="surface-card p-3.5"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-1 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: d.accent }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-[13.5px] font-semibold text-ink">
                          {item.concept}
                        </p>
                        {isDue && <Badge tone="amber">due</Badge>}
                        {item.stage >= 3 && <Badge tone="cyan">solid</Badge>}
                      </div>
                      <p className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-muted">
                        {item.principle}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-faint">
                        <span className="font-mono uppercase tracking-[0.1em]">
                          {d.short}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-faint/50" />
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {isDue
                            ? "now"
                            : `${Math.max(
                                1,
                                Math.round(
                                  (new Date(item.dueAt).getTime() - now) /
                                    86400000,
                                ),
                              )}d`}
                        </span>
                        <span className="ml-auto font-mono">
                          stage {item.stage + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setReviewing(item.conceptId);
                        setRevealed(false);
                        sfx.play("tap");
                      }}
                      className="press flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-cyan/12 text-[12px] font-medium text-cyan"
                    >
                      Review <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        removeVaultItem(item.conceptId);
                        sfx.play("tap");
                        toast({ title: "Removed from Vault", tone: "default" });
                      }}
                      aria-label={`Remove ${item.concept}`}
                      className="press flex h-9 w-9 items-center justify-center rounded-full border border-line text-faint hover:text-error"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {visible.length === 0 && (
          <div className="surface-card mt-3 flex flex-col items-center px-6 py-9 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-black/30">
              <Bookmark className="h-5 w-5 text-faint" />
            </div>
            <p className="mt-3 text-[13px] font-medium">
              {tab === "due" ? "Nothing due right now" : "Nothing here yet"}
            </p>
            <p className="mt-1 max-w-[250px] text-[12px] leading-snug text-faint">
              {tab === "due"
                ? "Play a duel or two — missed concepts land here automatically."
                : "Save concepts from a match Q&A to build your Vault."}
            </p>
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-line bg-surface/50 p-3.5">
          <p className="text-[11px] leading-relaxed text-faint">
            <span className="text-muted">Domain coverage · </span>
            {DOMAINS.map((d) => d.short).join(" · ")}
          </p>
        </div>
      </Page>
    </div>
  );
}
