import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Gamepad2,
  Shapes,
  Trophy,
  History,
  Layers,
  Shirt,
  Settings,
  UserRound,
  Flame,
  Zap,
  ChevronRight,
  Ticket,
  Menu,
  X,
  Orbit,
  Home,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppState } from "../state/AppState";
const groups = [
  {
    name: "PLAY",
    links: [
      ["/", "Arcade", Gamepad2],
      ["/arenas", "Arenas", Shapes],
      ["/anomaly", "Daily challenge", Orbit],
    ],
  },
  {
    name: "PLAYER",
    links: [
      ["/ranks", "Leaderboard", Trophy],
      ["/vault", "Concept vault", Layers],
      ["/history", "Match history", History],
      ["/locker", "Locker", Shirt],
    ],
  },
] as const;
export function Alien() {
  return (
    <svg
      viewBox="0 0 16 14"
      width="30"
      height="27"
      aria-hidden
      shapeRendering="crispEdges"
    >
      <path
        fill="currentColor"
        d="M3 1h2v2h6V1h2v2h-2v2h2v2h2v5h-2v-2h-2v2H5v-2H3v2H1V7h2V5h2V3H3zM3 12h2v2H3zm8 0h2v2h-2z"
      />
      <path fill="#fff6d2" d="M5 6h2v2H5zm4 0h2v2H9z" />
    </svg>
  );
}
export function StationNav() {
  const { profile, xp, streak, onboarded } = useAppState();
  const path = useLocation().pathname;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  const name =
    groups
      .flatMap((g) => [...g.links])
      .find(
        (e) => e[0] === (path.startsWith("/arenas") ? "/arenas" : path),
      )?.[1] ||
    (
      {
        identity: "Player profile",
        settings: "Settings",
        result: "Results",
        match: "Match review",
      } as Record<string, string>
    )[path.slice(1)] ||
    "Arcade";
  return (
    <>
      <aside className={"rail " + (open ? "opened" : "")}>
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-symbol">
            <Alien />
          </span>
          MayaDuels<span className="brand-dot">.</span>
        </Link>
        <button
          className="close-rail"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        >
          <X />
        </button>
        {groups.map((g) => (
          <div key={g.name} className="nav-group">
            <small>{g.name}</small>
            {g.links.map(([url, title, I]) => (
              <NavLink
                end={url === "/"}
                to={url}
                key={url}
                onClick={() => setOpen(false)}
              >
                <I size={18} />
                {title}
                {url === "/anomaly" && <i />}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="rail-bottom">
          <div className="player-pass">
            <Ticket size={19} />
            <small>PLAYER PASS</small>
            <strong>{onboarded ? profile.handle : "Rookie player"}</strong>
            <Link
              to={onboarded ? "/identity" : "/onboarding"}
              onClick={() => setOpen(false)}
            >
              {onboarded ? "View profile" : "Set up profile"} ↗
            </Link>
          </div>
          <NavLink to="/settings" onClick={() => setOpen(false)}>
            <Settings size={17} /> Settings
          </NavLink>
        </div>
      </aside>
      {open && (
        <button
          className="rail-shade"
          aria-label="Dismiss navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <header className="arc-bar">
        <button
          className="menu-key"
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div className="crumb">
          <Home size={15} />
          <ChevronRight size={13} />
          <b>{name}</b>
        </div>
        <div className="bar-end">
          <span className="counter">
            <Flame size={16} fill="#ff965d" color="#bf4b24" />
            {streak.count}
            <em> day streak</em>
          </span>
          <span className="counter">
            <Zap size={15} fill="#f7cb49" color="#846c18" />
            {xp} XP
          </span>
          <Link
            className="player-face"
            to="/identity"
            aria-label="Your player profile"
          >
            <Alien />
          </Link>
        </div>
      </header>
      <nav className="pocket-nav">
        {(
          [
            ["/", "Arcade", Gamepad2],
            ["/arenas", "Arenas", Shapes],
            ["/vault", "Vault", Layers],
            ["/identity", "You", UserRound],
          ] as const
        ).map(([to, label, I]) => (
          <NavLink key={to} end={to === "/"} to={to}>
            <I size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
