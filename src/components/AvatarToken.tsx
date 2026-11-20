import { useMemo } from 'react';
import { cn, seededRandom } from '../lib/utils';

const PALETTES = [
  ['#00F5D4', '#0B3B36'],
  ['#9FB4C7', '#1B2430'],
  ['#FFB800', '#3A2A00'],
  ['#7FE3D4', '#0E3330'],
  ['#C9D4E2', '#20262F'],
  ['#FF2A85', '#3A0A1E'],
];

/**
 * Procedurally generated abstract rival/player avatar.
 * Never a fake human portrait — a neutral geometric sigil derived from a seed.
 */
export function AvatarToken({
  seed = 1,
  size = 40,
  ring,
  className,
  rounded = 'rounded-full',
}: {
  seed?: number;
  size?: number;
  ring?: string;
  className?: string;
  rounded?: string;
}) {
  const { petals, palette, rotation } = useMemo(() => {
    const rand = seededRandom(seed * 2654435761);
    const count = 5 + Math.floor(rand() * 3);
    const p = PALETTES[Math.floor(rand() * PALETTES.length) % PALETTES.length];
    return {
      petals: Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * 360 + rand() * 18,
        dist: 10 + rand() * 9,
        w: 3 + rand() * 4.5,
      })),
      palette: p,
      rotation: rand() * 360,
    };
  }, [seed]);

  return (
    <span
      className={cn('relative inline-flex shrink-0', rounded, className)}
      style={{
        width: size,
        height: size,
        boxShadow: ring ? `inset 0 0 0 1.5px ${ring}55` : undefined,
      }}
    >
      <svg viewBox="0 0 48 48" className={cn('h-full w-full', rounded)}>
        <defs>
          <radialGradient id={`av-${seed}`} cx="40%" cy="32%" r="70%">
            <stop offset="0%" stopColor={palette[0]} stopOpacity="0.42" />
            <stop offset="100%" stopColor={palette[1]} stopOpacity="0.9" />
          </radialGradient>
        </defs>
        <rect width="48" height="48" rx="16" fill={`url(#av-${seed})`} />
        <g transform={`rotate(${rotation} 24 24)`}>
          {petals.map((pt, i) => {
            const rad = (pt.angle * Math.PI) / 180;
            const x = 24 + Math.cos(rad) * pt.dist;
            const y = 24 + Math.sin(rad) * pt.dist;
            return (
              <rect
                key={i}
                x={x - pt.w / 2}
                y={y - pt.w / 2}
                width={pt.w}
                height={pt.w}
                rx={pt.w * 0.32}
                fill={palette[0]}
                opacity={0.55 + (i % 3) * 0.14}
              />
            );
          })}
          <circle cx="24" cy="24" r="5.4" fill={palette[0]} opacity="0.95" />
          <circle cx="24" cy="24" r="2.2" fill="#090A0F" opacity="0.75" />
        </g>
      </svg>
    </span>
  );
}