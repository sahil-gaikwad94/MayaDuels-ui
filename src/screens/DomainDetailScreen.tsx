import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Layers3,
  Clock3,
  Swords,
} from "lucide-react";
import { DOMAINS, getDomain } from "../lib/domains";
import { artFor } from "../components/DomainCard";
import { Sparkline } from "../components/Charts";
import { useAppState } from "../state/AppState";
export function DomainDetailScreen() {
  const { domainId } = useParams();
  const d = getDomain(domainId);
  const i = DOMAINS.findIndex((a) => a.id === d.id);
  const { selectDomain } = useAppState();
  const navigate = useNavigate();
  return (
    <div className="play-floor">
      <Link to="/arenas" className="back-link">
        <ArrowLeft size={15} /> Arena library
      </Link>
      <section className={"dossier cartridge-" + i}>
        <div
          className="dossier-image"
          style={{ backgroundImage: `url(${artFor(d.id)})` }}
        />
        <div className="dossier-copy">
          <div className="overline">
            GAME CARTRIDGE / {i < 0 ? "OMNI" : "0" + (i + 1)}
          </div>
          <h1>{d.arena}</h1>
          <p>{d.description}</p>
          <div className="game-rules">
            <span>
              <Clock3 />
              60 sec
            </span>
            <span>
              <Layers3 />8 rounds
            </span>
            <span>
              <Swords />1 vs 1
            </span>
          </div>
          <button
            className="play-key"
            onClick={() => {
              selectDomain(d.id);
              navigate("/queue");
            }}
          >
            <Play size={13} fill="currentColor" /> Play this arena{" "}
            <ArrowRight size={15} />
          </button>
        </div>
      </section>
      <div className="dossier-grid">
        <section>
          <div className="overline">INSIDE THE DECK</div>
          <h2>What you’ll play</h2>
          <p>{d.tagline}.</p>
          <div className="topic-chips">
            {d.topics.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </section>
        <section>
          <div className="overline">ARENA RECORD</div>
          <h2>
            {d.rating.toLocaleString()} <small>rating</small>
          </h2>
          <p>
            {d.mastery}% mastery · {d.matches} matches · {d.difficulty}
          </p>
          <Sparkline
            data={d.trend}
            color="#397760"
            width={320}
            height={42}
            className="mt-4 h-12 w-full"
          />
        </section>
      </div>
    </div>
  );
}
