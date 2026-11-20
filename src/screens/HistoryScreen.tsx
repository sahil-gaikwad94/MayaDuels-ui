import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Ticket, History } from "lucide-react";
import { readArchive } from "../lib/matchArchive";
import { artFor } from "../components/DomainCard";
import { getDomain } from "../lib/domains";
export function HistoryScreen() {
  const [filter, setFilter] = useState("All");
  const [matches] = useState(readArchive);
  const visible = matches.filter(
    (m) =>
      filter === "All" ||
      m.outcome ===
        (
          { Wins: "WIN", Losses: "LOSS", Draws: "DRAW" } as Record<
            string,
            string
          >
        )[filter],
  );
  return (
    <div className="play-floor catalog">
      <div className="overline">
        <History size={14} /> PLAYER RECORD
      </div>
      <h1>
        Match history<span>.</span>
      </h1>
      <p>
        Your last 25 duels on this device. Open a ticket to review both players’
        answers.
      </p>
      <div className="filters mt-4">
        {["All", "Wins", "Losses", "Draws"].map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      {!visible.length ? (
        <div className="archive-empty">
          <Ticket size={40} />
          <h2>
            {matches.length
              ? "No matching tickets"
              : "Your first ticket goes here."}
          </h2>
          <p>
            {matches.length
              ? "Try another result filter."
              : "Finish a Blitz Duel to collect your match ticket."}
          </p>
          <Link to="/queue" className="play-key">
            Play Blitz <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        visible.map((m) => (
          <Link
            className="match-row"
            key={m.matchId}
            to={"/match?id=" + encodeURIComponent(m.matchId)}
          >
            <img src={artFor(m.domainId)} alt="" />
            <div>
              <small>
                {new Date(m.startedAt).toLocaleDateString()} · {m.outcome}
              </small>
              <strong>{getDomain(m.domainId).arena}</strong>
              <p>vs {m.opponentName}</p>
            </div>
            <b>
              {m.selfScore} : {m.opponentScore}
            </b>
            <ArrowRight size={16} />
          </Link>
        ))
      )}
    </div>
  );
}
