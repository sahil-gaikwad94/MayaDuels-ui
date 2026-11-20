import type { DomainId } from './domains';

/**
 * The "arena field" is the luminous atmosphere behind the home hero.
 * Each domain owns a three-stop gradient so the whole screen changes
 * climate when you swipe the carousel — the reference's blue field,
 * but earned per-arena instead of decorative.
 */
export interface FieldPalette {
  /** Deep base, used at the edges */
  base: string;
  /** Mid stop — the dominant colour */
  mid: string;
  /** Bright stop near the horizon */
  bright: string;
  /** Text colour that sits on the field */
  ink: string;
  /** Soft glow for radial highlights */
  glow: string;
  /** Tint for glass surfaces floating on the field */
  glass: string;
}

export const FIELD_PALETTES: Record<DomainId, FieldPalette> = {
  AI_ML: {
    base: '#04201F',
    mid: '#0A5A54',
    bright: '#22D9C0',
    ink: '#F2FFFC',
    glow: 'rgba(34,217,192,0.55)',
    glass: 'rgba(6,32,31,0.55)',
  },
  INFRA: {
    base: '#0A1520',
    mid: '#1F3B52',
    bright: '#6E9DBE',
    ink: '#F1F7FC',
    glow: 'rgba(110,157,190,0.5)',
    glass: 'rgba(9,20,30,0.55)',
  },
  DATA: {
    base: '#20140A',
    mid: '#7A4E12',
    bright: '#FFC24D',
    ink: '#FFF9EE',
    glow: 'rgba(255,194,77,0.5)',
    glass: 'rgba(28,18,8,0.55)',
  },
  WEB: {
    base: '#061B26',
    mid: '#0E4C63',
    bright: '#4FD8E8',
    ink: '#F0FCFF',
    glow: 'rgba(79,216,232,0.5)',
    glass: 'rgba(5,24,33,0.55)',
  },
  CORE_CS: {
    base: '#111524',
    mid: '#2C3550',
    bright: '#9AA9CC',
    ink: '#F4F6FC',
    glow: 'rgba(154,169,204,0.45)',
    glass: 'rgba(14,18,32,0.55)',
  },
  SECURITY: {
    base: '#1D0713',
    mid: '#6E1039',
    bright: '#FF5C9E',
    ink: '#FFF2F7',
    glow: 'rgba(255,92,158,0.5)',
    glass: 'rgba(28,7,18,0.55)',
  },
  OMNI: {
    base: '#0B0F1A',
    mid: '#1C3A55',
    bright: '#5FE3D0',
    ink: '#F4FAFF',
    glow: 'rgba(95,227,208,0.5)',
    glass: 'rgba(9,14,24,0.55)',
  },
};

export function fieldFor(id: DomainId): FieldPalette {
  return FIELD_PALETTES[id] ?? FIELD_PALETTES.OMNI;
}

/** CSS custom properties for a field, ready to spread onto a style prop. */
export function fieldVars(id: DomainId): React.CSSProperties {
  const f = fieldFor(id);
  return {
    ['--field-1' as string]: f.base,
    ['--field-2' as string]: f.mid,
    ['--field-3' as string]: f.bright,
    ['--field-ink' as string]: f.ink,
    ['--field-glow' as string]: f.glow,
    ['--field-glass' as string]: f.glass,
  } as React.CSSProperties;
}
