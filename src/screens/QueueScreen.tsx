import { artFor } from "../components/DomainCard";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, ShieldQuestion, X } from "lucide-react";
import { Page, Badge } from "../components/Page";
import { HeroStage } from "../components/HeroStage";
import { Button } from "../components/Button";
import { getDomain } from "../lib/domains";
import { useAppState } from "../state/AppState";
import { cn, formatNumber } from "../lib/utils";
import { sfx, haptics } from "../lib/audio";

const STAGES = [
  { at: 0, label: "Opening arena channel" },
  { at: 900, label: "Core synchronised" },
  { at: 1900, label: "Calibrating rival skill band" },
  { at: 3000, label: "Sealing question deck" },
];

const TIPS = [
  "Speed matters, but accuracy decides matches. A fast wrong answer scores zero.",
  "Round 8 is Overdrive: a 1.5× multiplier on a high-discrimination question.",
  "Three correct in a row raises your multiplier to 1.1×. Five raises it to 1.2×.",
  "Timeouts score zero and reset your streak — tap something rather than nothing.",
  "Every finished match unlocks a two-player Q&A comparison with mental models.",
];

export function QueueScreen() {
  const navigate = useNavigate();
  const { selectedDomain, matchesPlayed } = useAppState();
  const domain = getDomain(selectedDomain);
  const [elapsed, setElapsed] = useState(0);
  const [stage, setStage] = useState(0);
  const [tip] = useState(
    () => TIPS[Math.floor(Math.random() * TIPS.length) % TIPS.length],
  );

  useEffect(() => {
    const started = Date.now();
    const id = window.setInterval(() => {
      const e = Date.now() - started;
      setElapsed(e);
      const nextStage = STAGES.reduce((acc, s, i) => (e >= s.at ? i : acc), 0);
      setStage(nextStage);
    }, 120);
    return () => window.clearInterval(id);
  }, []);

  // Auto-enter the duel after the activation sequence.
  useEffect(() => {
    if (elapsed > 4200) {
      sfx.play("whoosh");
      navigate("/duel", { replace: true });
    }
  }, [elapsed, navigate]);

  const seconds = (elapsed / 1000).toFixed(1);
  const progress = Math.min(1, elapsed / 4200);

  return (
    <div className="ticket-desk">
      <div className="match-ticket">
        <div className="ticket-top">
          <span>BLITZ ADMISSION</span>
          <span>1 × ENTRY</span>
        </div>
        <img src={artFor(domain.id)} alt="" />
        <div className="ticket-body">
          <div className="overline">
            <i /> MATCH PREPARATION
          </div>
          <h1>{domain.arena}</h1>
          <p>8 rounds · 60 seconds · Arena rival</p>
          <div className="tear" />
          <div className="queue-stage" role="status">
            {STAGES[stage].label}
            <small>{seconds}s</small>
          </div>
          <progress max={1} value={progress} />
          <p className="ticket-tip">{tip}</p>
          <button onClick={() => navigate("/")} className="back-link">
            <ArrowLeft size={15} /> Cancel and return
          </button>
        </div>
      </div>
    </div>
  );
}
