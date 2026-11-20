import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { DOMAINS, type Domain } from "../lib/domains";
export const plates: Record<string, string> = {
  AI_ML: "neural",
  INFRA: "systems",
  DATA: "data",
  WEB: "web",
  CORE_CS: "chip",
  SECURITY: "lock",
  OMNI: "core",
  core: "core",
};
export const artFor = (id: string) =>
  (
    ({
      AI_ML: "/arcade/brain.webp",
      INFRA: "/arcade/server.webp",
      DATA: "/arcade/disk.webp",
      WEB: "/arcade/web.webp",
      CORE_CS: "/arcade/chip.webp",
      SECURITY: "/arcade/lock.webp",
      core: "/arcade/blitz.webp",
      OMNI: "/arcade/blitz.webp",
    }) as Record<string, string>
  )[id] || "/arcade/blitz.webp";
export function DomainCard({ d }: { d: Domain }) {
  const i = DOMAINS.findIndex((a) => a.id === d.id);
  return (
    <Link className={"cartridge cartridge-" + i} to={"/arenas/" + d.id}>
      <div
        className="cart-art"
        style={{ backgroundImage: `url(${artFor(d.id)})` }}
      />
      <span className="cart-index">ARENA 0{i + 1}</span>
      <div className="cart-title">
        <small>
          {
            [
              "AI / ML",
              "INFRASTRUCTURE",
              "DATABASES",
              "WEB",
              "COMPUTER SCIENCE",
              "SECURITY",
            ][i]
          }
        </small>
        <h3>{d.arena}</h3>
      </div>
      <span className="cart-open">
        <ArrowUpRight size={17} />
      </span>
    </Link>
  );
}
