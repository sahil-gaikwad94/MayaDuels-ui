import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers3, Search, X } from "lucide-react";
import { DomainCard } from "../components/DomainCard";
import { DOMAINS } from "../lib/domains";
const FILTERS = [
  { id: "all", label: "All" },
  { id: "AI_ML", label: "AI / ML" },
  { id: "INFRA", label: "Infra" },
  { id: "DATA", label: "Data" },
  { id: "WEB", label: "Web" },
  { id: "CORE_CS", label: "Core CS" },
  { id: "SECURITY", label: "Security" },
];

export function ArenasScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DOMAINS.filter((d) => {
      const matchesFilter = filter === "all" || d.id === filter;
      if (!matchesFilter) return false;
      if (!q) return true;
      return (
        d.arena.toLowerCase().includes(q) ||
        d.short.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q) ||
        d.topics.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, filter]);

  return (
    <div className="lobby catalog">
      <div className="kicker">
        <i /> GAME LIBRARY
      </div>
      <h1>
        Arena library<span>.</span>
      </h1>
      <p className="text-muted">
        Choose an engineering domain to explore its topics and enter a duel.
      </p>
      <label className="catalog-search">
        <Search size={17} />
        <input
          aria-label="Search arenas and topics"
          placeholder="Search arenas, topics, concepts"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button aria-label="Clear search" onClick={() => setQuery("")}>
            <X size={16} />
          </button>
        )}
      </label>
      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="domain-row">
        {results.map((d) => (
          <DomainCard key={d.id} d={d} />
        ))}
      </div>
      {!results.length && (
        <div className="surface-card p-6">
          No matching arenas.{" "}
          <button
            className="text-cyan"
            onClick={() => {
              setFilter("all");
              setQuery("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <Link className="omni-link" to="/arenas/OMNI">
        <Layers3 />
        Omni Arena <small>All domains combined</small>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
