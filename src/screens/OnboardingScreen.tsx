import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Ticket, Check } from "lucide-react";
import { DOMAINS, type DomainId } from "../lib/domains";
import { artFor } from "../components/DomainCard";
import { Alien } from "../components/StationNav";
import { useAppState } from "../state/AppState";
export function OnboardingScreen() {
  const { profile, selectedDomain, completeOnboarding } = useAppState();
  const [handle, setHandle] = useState(
    profile.handle === "new.engineer" ? "" : profile.handle,
  );
  const [domain, setDomain] = useState<DomainId>(selectedDomain);
  const navigate = useNavigate();
  return (
    <div className="setup-desk">
      <Link to="/" className="back-link">
        <ArrowLeft size={15} /> Arcade
      </Link>
      <div className="setup-grid">
        <aside className="pass-preview">
          <small>MD / ARCADE MEMBERSHIP</small>
          <div className="pass-mascot">
            <Alien />
          </div>
          <small>PLAYER 01</small>
          <h2>{handle || "Rookie player"}</h2>
          <p>{DOMAINS.find((d) => d.id === domain)?.arena || "Omni Arena"}</p>
          <div className="barcode" />
        </aside>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            completeOnboarding(domain, handle);
            navigate("/");
          }}
        >
          <div className="overline">
            <Ticket size={15} /> PLAYER SETUP
          </div>
          <h1>Make it yours.</h1>
          <p>Pick a handle and your first arena. No account needed.</p>
          <label htmlFor="handle">Player handle</label>
          <input
            id="handle"
            placeholder="e.g. bytepilot"
            value={handle}
            maxLength={16}
            onChange={(e) =>
              setHandle(e.target.value.replace(/[^a-zA-Z0-9_.]/g, ""))
            }
          />
          <fieldset>
            <legend>Starting arena</legend>
            <div className="starter-grid">
              {DOMAINS.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  aria-pressed={domain === d.id}
                  onClick={() => setDomain(d.id)}
                >
                  <img src={artFor(d.id)} alt="" />
                  {d.arena}
                  {domain === d.id && <Check size={14} />}
                </button>
              ))}
            </div>
          </fieldset>
          <button className="play-key">
            Save player pass <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
