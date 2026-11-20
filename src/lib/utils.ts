import clsx, { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function formatNumber(n: number) {
  return Math.round(n).toLocaleString('en-US');
}

export function formatDelta(n: number) {
  if (n === 0) return '±0';
  return `${n > 0 ? '+' : '−'}${Math.abs(Math.round(n))}`;
}

export function formatClock(ms: number) {
  const clamped = Math.max(0, ms);
  const totalSeconds = clamped / 1000;
  const s = Math.floor(totalSeconds);
  const tenths = Math.floor((clamped % 1000) / 100);
  return `${s}.${tenths}s`;
}

export function formatTimer(ms: number) {
  const clamped = Math.max(0, ms);
  const s = Math.floor(clamped / 1000);
  const tenths = Math.floor((clamped % 1000) / 100);
  return `${s}.${tenths}`;
}

export function formatCountdown(ms: number) {
  const clamped = Math.max(0, ms);
  const total = Math.floor(clamped / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/** Deterministic PRNG (mulberry32) so demo data is stable across reloads. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const rand = seededRandom(seed);
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pick<T>(items: T[], seed: number): T {
  return items[Math.floor(seededRandom(seed)() * items.length) % items.length];
}

export function cx(...args: ClassValue[]) {
  return cn(...args);
}

export function pct(part: number, total: number) {
  if (!total) return 0;
  return clamp(Math.round((part / total) * 100), 0, 100);
}

export function pluralize(n: number, word: string, plural?: string) {
  return `${n} ${n === 1 ? word : plural ?? `${word}s`}`;
}