/**
 * Design system tokens – exported for TypeScript usage and for
 * potential future integration with Tailwind's `theme` extension.
 *
 * Colors are based on the Maya brand palette: obsidian, graphite, cyan, magenta, amber.
 */

export const colors = {
  canvas: '#090A0F',
  surface: '#11141C',
  surfaceRaised: '#181D28',
  line: '#2A2E38',
  faint: '#6E7789',
  cyan: '#00F5D4',
  magenta: '#FF2A85',
  amber: '#FFB800',
  error: '#FF5555',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const;

export const radii = {
  sm: '0.375rem',
  md: '0.75rem',
  lg: '1rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 10px 15px rgba(0,0,0,0.15)',
} as const;

export const motion = {
  springSoft: 'spring(70, 8, 0, 0.5)',
  springSnap: 'spring(70, 8, 0, 0.1)',
  springHeavy: 'spring(70, 8, 0, 0.8)',
} as const;

export type Theme = {
  colors: Record<keyof typeof colors, string>;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: typeof shadows;
  motion: typeof motion;
};

export const lightTheme: Theme = {
  colors,
  spacing,
  radii,
  shadows,
  motion,
};

export const darkTheme: Theme = {
  colors: {
    ...colors,
    canvas: '#0A0A0A',
    surface: '#141414',
    surfaceRaised: '#1E1E1E',
    line: '#2C2C2C',
    faint: '#4A4A4A',
  },
  spacing,
  radii,
  shadows,
  motion,
};
