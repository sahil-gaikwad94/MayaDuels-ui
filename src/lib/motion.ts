import type { Transition, Variants } from 'framer-motion';

/**
 * Motion tokens from the V3 brief §9.2.
 * Durations are starting ranges — tuned for a mobile-first, one-thumb product.
 */
export const DURATION = {
  tap: 0.1,
  quick: 0.16,
  standard: 0.24,
  spring: 0.34,
  feature: 0.5,
  celebrate: 0.8,
  idle: 6,
} as const;

export const EASE = {
  out: [0.16, 1, 0.3, 1] as const,
  snap: [0.22, 1.2, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  linear: [0, 0, 1, 1] as const,
};

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
  mass: 0.9,
};

export const springSnap: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
  mass: 0.8,
};

export const springHeavy: Transition = {
  type: 'spring',
  stiffness: 180,
  damping: 22,
  mass: 1.1,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.standard, ease: EASE.out },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.quick, ease: EASE.out } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.spring, ease: EASE.snap },
  },
};

export const listStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.03 },
  },
};

export const cardRise: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.spring, ease: EASE.snap },
  },
};

export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: DURATION.standard, ease: EASE.out },
};

/** Shared layout transition used by the floating dock marker. */
export const dockMarkerTransition: Transition = {
  type: 'spring',
  stiffness: 480,
  damping: 34,
  mass: 0.7,
};

export const reducedMotionConfig = {
  duration: 0.001,
} as const;