import { useMemo } from 'react';
import { cn } from '../lib/utils';

/** Compact rating sparkline — no animation, purely informational. */
export function Sparkline({
  data,
  color = '#00F5D4',
  width = 120,
  height = 34,
  className,
  strokeWidth = 1.6,
  fill = true,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  strokeWidth?: number;
  fill?: boolean;
}) {
  const { path, area, last } = useMemo(() => {
    if (data.length < 2) return { path: '', area: '', last: [0, 0] };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const pad = 3;
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * (width - pad * 2) + pad;
      const y = height - pad - ((v - min) / span) * (height - pad * 2);
      return [x, y] as const;
    });
    const d = pts
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
      .join(' ');
    const a = `${d} L${pts[pts.length - 1][0].toFixed(2)},${height} L${pts[0][0].toFixed(2)},${height} Z`;
    return { path: d, area: a, last: pts[pts.length - 1] };
  }, [data, width, height]);

  const id = useMemo(
    () => `spark-${Math.random().toString(36).slice(2, 8)}`,
    [],
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('overflow-visible', className)}
      aria-hidden
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${id})`} />}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {last[0] > 0 && (
        <circle cx={last[0]} cy={last[1]} r={2.4} fill={color} />
      )}
    </svg>
  );
}

/** Circular progress ring used by the round timer and mastery meters. */
export function Ring({
  progress,
  size = 44,
  stroke = 3.5,
  color = '#00F5D4',
  trackColor = 'rgba(255,255,255,0.1)',
  children,
  className,
  glow = false,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, progress));
  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
          style={{
            transition: 'stroke-dashoffset 120ms linear, stroke 200ms ease',
            filter: glow ? `drop-shadow(0 0 6px ${color}88)` : undefined,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}