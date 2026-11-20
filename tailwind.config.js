/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#090A0F',
        surface: '#11141C',
        raised: '#181D28',
        elevated: '#1E2431',
        line: 'rgba(255,255,255,0.08)',
        'line-strong': 'rgba(255,255,255,0.14)',
        ink: '#F4F6FA',
        muted: '#A9B1C2',
        faint: '#6E7789',
        cyan: '#00F5D4',
        'cyan-soft': 'rgba(0,245,212,0.14)',
        'cyan-line': 'rgba(0,245,212,0.32)',
        magenta: '#FF2A85',
        'magenta-soft': 'rgba(255,42,133,0.14)',
        amber: '#FFB800',
        'amber-soft': 'rgba(255,184,0,0.14)',
        error: '#FF5C67',
        'error-soft': 'rgba(255,92,103,0.14)',

        /* ---------- Porcelain: the tactile light surface ---------- */
        porcelain: '#F8F5F0',
        'porcelain-dim': '#E9E4DA',
        'porcelain-line': 'rgba(18,20,26,0.10)',
        'ink-dark': '#12141A',
        'ink-soft': '#4B5160',
        'ink-faint': '#7A8194',

        /* ---------- Arena field (set per-domain via CSS vars) ---------- */
        field: 'var(--field-1)',
        'field-2': 'var(--field-2)',
        'field-3': 'var(--field-3)',
        'field-ink': 'var(--field-ink)',
        'field-glow': 'var(--field-glow)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        capsule: '0 18px 40px -18px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)',
        card: '0 24px 60px -30px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.04)',
        dock: '0 30px 60px -20px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.07)',
        cyan: '0 0 0 1px rgba(0,245,212,0.35), 0 18px 50px -18px rgba(0,245,212,0.45)',
        /* Light objects floating over a saturated field */
        float: '0 26px 50px -18px rgba(4,10,18,0.55), 0 8px 18px -8px rgba(4,10,18,0.35)',
        'float-lg':
          '0 48px 90px -30px rgba(4,10,18,0.62), 0 14px 30px -12px rgba(4,10,18,0.38)',
        porcelain:
          '0 30px 60px -24px rgba(4,10,18,0.6), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(18,20,26,0.05)',
        'inner-dark': 'inset 0 1px 0 rgba(255,255,255,0.07)',
      },
      transitionTimingFunction: {
        snap: 'cubic-bezier(0.22, 1.2, 0.36, 1)',
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { opacity: '0.55', transform: 'scale(0.96)' },
          '70%': { opacity: '0', transform: 'scale(1.25)' },
          '100%': { opacity: '0', transform: 'scale(1.25)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.16,1,0.3,1) infinite',
      },
    },
  },
  plugins: [],
};