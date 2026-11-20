import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Swords,
  Layers3,
  Play,
  Sparkles,
  Orbit,
  Target,
  Flag,
} from "lucide-react";
import { DOMAINS } from "../lib/domains";
import { DomainCard } from "../components/DomainCard";
export function HomeScreen() {
  const [page, setPage] = useState(0);
  return (
    <div className="play-floor">
      <div className="arc-intro">
        <div>
          <div className="overline">
            <i /> PLAYER HUB
          </div>
          <h1>
            The Arcade<span>.</span>
          </h1>
          <p>Your daily playground for engineering duels.</p>
        </div>
        <span className="season">
          <Flag size={13} /> SEASON 01
        </span>
      </div>
      <section className="play-poster">
        <div className="poster-art" />
        <div className="poster-info">
          <b className="black-tag">
            <Sparkles size={12} /> FEATURED GAME
          </b>
          <h2>Blitz Duel</h2>
          <p>
            A head-to-head sprint for sharp minds.
            <br />
            Eight questions. One minute. Game on.
          </p>
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
          <Link to="/queue" className="play-key">
            <Play size={14} fill="currentColor" /> Play Blitz{" "}
            <ArrowRight size={16} />
          </Link>
        </div>
        <small className="poster-id">
          MD—001 &nbsp; / &nbsp; ARCADE SERIES
        </small>
      </section>
      <section className="rack">
        <div className="rack-head">
          <div>
            <div className="overline">
              <i /> GAME LIBRARY
            </div>
            <h2>Pick an arena</h2>
          </div>
          <div className="rack-controls">
            <Link to="/arenas">
              View all <ArrowUpRight size={14} />
            </Link>
            <button
              aria-label="Previous arenas"
              onClick={() => setPage(1 - page)}
            >
              <ChevronLeft />
            </button>
            <button aria-label="Next arenas" onClick={() => setPage(1 - page)}>
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="shelf" key={page}>
          {DOMAINS.slice(page * 3, page * 3 + 3).map((d) => (
            <DomainCard key={d.id} d={d} />
          ))}
        </div>
      </section>
      <section className="bonus-row">
        <Link to="/anomaly">
          <span>
            <Orbit />
          </span>
          <div>
            <small>DAILY CHALLENGE</small>
            <strong>Daily Anomaly</strong>
          </div>
          <ArrowUpRight />
        </Link>
        <Link to="/vault?mode=weakness">
          <span>
            <Target />
          </span>
          <div>
            <small>PRACTICE MODE</small>
            <strong>Weakness Blitz</strong>
          </div>
          <ArrowUpRight />
        </Link>
      </section>
    </div>
  );
}
