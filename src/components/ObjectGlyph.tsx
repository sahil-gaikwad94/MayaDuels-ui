import type { ObjectKind } from '../three/objects';
import type { DomainId } from '../lib/domains';

/** Maps a domain id to a renderable 3D object kind (OMNI uses the Maya Core). */
export function toObjectKind(id: string): ObjectKind {
  if (id === 'OMNI') return 'core';
  return id as ObjectKind;
}

/**
 * Static vector fallbacks. These are deliberately authored as clean isometric
 * engineering glyphs (not generic icons) so low-power / no-WebGL / reduced
 * motion still feels like Maya-Duels rather than a broken 3D view.
 */
export function ObjectGlyph({
  kind,
  accent = '#00F5D4',
  className,
}: {
  kind: ObjectKind;
  accent?: string;
  className?: string;
}) {
  const common = {
    fill: 'none',
    stroke: accent,
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const dim = { ...common, stroke: 'rgba(255,255,255,0.22)' };

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={`${kind} object`}
    >
      <defs>
        <radialGradient id={`glow-${kind}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.32" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="58" r="46" fill={`url(#glow-${kind})`} />

      {kind === 'core' && (
        <g>
          <path d="M60 26 L88 42 L88 74 L60 90 L32 74 L32 42 Z" {...dim} />
          <path d="M60 38 L78 48 L78 68 L60 78 L42 68 L42 48 Z" {...common} />
          <circle cx="60" cy="58" r="7" fill={accent} opacity="0.9" />
          <ellipse cx="60" cy="58" rx="40" ry="15" {...dim} transform="rotate(-18 60 58)" />
        </g>
      )}

      {kind === 'AI_ML' && (
        <g>
          <rect x="36" y="36" width="48" height="48" rx="6" {...common} />
          <rect x="48" y="48" width="24" height="24" rx="3" {...dim} />
          <circle cx="60" cy="60" r="4" fill={accent} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`rotate(${i * 90} 60 60)`}>
              <path d="M60 30 v-8" {...dim} />
              <path d="M56 24 h8" {...dim} />
            </g>
          ))}
          <rect x="24" y="26" width="9" height="9" rx="2" {...common} />
          <rect x="88" y="82" width="9" height="9" rx="2" {...common} />
        </g>
      )}

      {kind === 'INFRA' && (
        <g>
          {[
            [44, 40],
            [66, 50],
            [38, 64],
            [62, 72],
          ].map(([x, y], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width="20"
              height="16"
              rx="3"
              {...(i === 0 ? common : dim)}
            />
          ))}
          <path d="M54 48 L66 54" {...dim} />
          <path d="M54 56 L48 64" {...dim} />
          <path d="M58 72 L62 72" {...dim} />
          <circle cx="54" cy="48" r="2.4" fill={accent} />
        </g>
      )}

      {kind === 'DATA' && (
        <g>
          {[0, 1, 2].map((i) => (
            <ellipse
              key={i}
              cx="60"
              cy={46 + i * 12}
              rx="26"
              ry="7"
              {...(i === 1 ? common : dim)}
            />
          ))}
          <path d="M34 46 v24" {...dim} />
          <path d="M86 46 v24" {...dim} />
          <path d="M60 40 v-12" {...common} />
          <path d="M50 28 h20" {...common} />
          <circle cx="60" cy="24" r="3" fill={accent} />
        </g>
      )}

      {kind === 'WEB' && (
        <g>
          <rect x="30" y="36" width="60" height="40" rx="5" {...common} />
          <path d="M30 46 h60" {...dim} />
          <circle cx="38" cy="41" r="1.8" fill={accent} />
          <circle cx="44" cy="41" r="1.8" {...dim} />
          <rect x="38" y="52" width="26" height="4" rx="2" {...dim} />
          <rect x="38" y="60" width="38" height="4" rx="2" {...dim} />
          <circle cx="82" cy="80" r="10" {...common} />
          <path d="M82 74 v6 l4 3" {...common} />
        </g>
      )}

      {kind === 'CORE_CS' && (
        <g>
          <rect x="38" y="38" width="44" height="44" rx="5" {...common} />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={46 + c * 10}
                y={46 + r * 10}
                width="6"
                height="6"
                rx="1.5"
                {...((r + c) % 2 === 0 ? common : dim)}
              />
            )),
          )}
          <path d="M30 46 h-6 M30 60 h-6 M30 74 h-6" {...dim} />
          <path d="M90 46 h6 M90 60 h6 M90 74 h6" {...dim} />
        </g>
      )}

      {kind === 'SECURITY' && (
        <g>
          <path
            d="M60 26 L86 38 L82 68 Q60 92 60 92 Q60 92 38 68 L34 38 Z"
            {...common}
          />
          <circle cx="60" cy="54" r="7" {...common} />
          <path d="M60 61 v9" {...common} />
          <ellipse cx="60" cy="58" rx="40" ry="14" {...dim} />
        </g>
      )}

      {kind === 'trophy' && (
        <g>
          <path d="M46 34 h28 v10 a14 14 0 0 1 -28 0 Z" {...common} />
          <path d="M46 38 h-8 a8 8 0 0 0 8 8" {...dim} />
          <path d="M74 38 h8 a8 8 0 0 1 -8 8" {...dim} />
          <path d="M60 58 v12" {...common} />
          <path d="M48 78 h24" {...common} />
          <path d="M52 70 h16 l4 8 h-24 Z" {...dim} />
          <circle cx="60" cy="44" r="3.4" fill={accent} />
        </g>
      )}
    </svg>
  );
}

export function domainGlyphKind(domain: DomainId): ObjectKind {
  if (domain === 'OMNI') return 'core';
  return domain as ObjectKind;
}