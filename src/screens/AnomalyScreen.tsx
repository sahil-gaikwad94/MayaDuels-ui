import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Orbit, Check, Trophy } from "lucide-react";
import { buildDeck } from "../lib/questions";
import { QuestionStage } from "../components/QuestionStage";
import { AnswerTile } from "../components/AnswerTile";
export function AnomalyScreen() {
  const day = new Date().toISOString().slice(0, 10);
  const deck = buildDeck("OMNI", Math.floor(Date.parse(day) / 86400000)).slice(
    0,
    5,
  );
  const key = "mayaduels.daily." + day;
  const [picks, setPicks] = useState<string[]>(() => {
    try {
      const p = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(p) ? p.slice(0, 5) : [];
    } catch {
      return [];
    }
  });
  const [step, setStep] = useState(picks.length);
  const [playing, setPlaying] = useState(false);
  const done = step >= 5;
  const q = deck[step];
  const pick = picks[step];
  const score = picks.filter((p, i) => p === deck[i]?.correctChoiceId).length;
  return (
    <div className="play-floor catalog">
      <div className="overline">
        <Orbit size={14} /> DAILY CHALLENGE
      </div>
      <h1>
        Daily Anomaly<span>.</span>
      </h1>
      <p>
        Five engineering puzzles. One shared deck. A new run every day at 00:00
        UTC.
      </p>
      <div className="daily-ticket">
        <small>{day} / DAILY EDITION</small>
        <h2>
          {done
            ? "Run complete."
            : playing
              ? "Investigation in progress"
              : "Today’s investigation"}
        </h2>
        <div className="step-track">
          {deck.map((item, i) => (
            <span className={i < picks.length ? "checked" : ""} key={item.id}>
              {i < picks.length ? <Check size={17} /> : i + 1}
            </span>
          ))}
        </div>
        {done ? (
          <>
            <p>{score} of 5 correct. Your answers are saved on this device.</p>
            <Link className="play-key" to="/">
              <Trophy size={15} /> Back to arcade
            </Link>
          </>
        ) : !playing ? (
          <button className="play-key" onClick={() => setPlaying(true)}>
            {step ? "Resume run" : "Start today’s run"} <ArrowRight size={15} />
          </button>
        ) : (
          <p>Step {step + 1} of 5 · Untimed practice</p>
        )}
      </div>
      {playing && !done && (
        <section className="daily-question">
          <QuestionStage question={q} />
          <div className="space-y-2 mt-4">
            {q.choices.map((c, i) => (
              <AnswerTile
                key={c.id}
                choice={c}
                index={i}
                disabled={!!pick}
                showResult={!!pick}
                state={
                  !pick
                    ? "idle"
                    : c.id === q.correctChoiceId
                      ? "correct"
                      : c.id === pick
                        ? "incorrect"
                        : "muted"
                }
                onClick={() => {
                  if (pick) return;
                  const next = [...picks, c.id];
                  setPicks(next);
                  localStorage.setItem(key, JSON.stringify(next));
                }}
              />
            ))}
          </div>
          {pick && (
            <div className="surface-card p-4 mt-4">
              <b>{pick === q.correctChoiceId ? "Correct" : "Mental model"}</b>
              <p className="text-sm my-2">{q.explanation.summary}</p>
              <button className="play-key" onClick={() => setStep(step + 1)}>
                {step === 4 ? "Finish run" : "Next puzzle"}
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
