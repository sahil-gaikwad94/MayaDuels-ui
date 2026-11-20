import { motion } from 'framer-motion';
import type { FieldPalette } from '../lib/field';
import { cn } from '../lib/utils';

/**
 * The luminous arena field. Three stacked layers:
 *   1. a vertical gradient from deep base to bright horizon,
 *   2. two radial blooms that give the field volume (not a flat fill),
 *   3. fine grain so large gradients never band on OLED.
 *
 * Everything is transform/opacity animated only — no layout thrash.
 */
export function ArenaField({
  palette,
  className,
  intensity = 'full',
}: {
  palette: FieldPalette;
  className?: string;
  intensity?: 'full' | 'soft';
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{ background: palette.base }}
    >
      {/* base gradient */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          background: `linear-gradient(178deg, ${palette.bright} 0%, ${palette.mid} 34%, ${palette.base} 88%)`,
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ opacity: intensity === 'full' ? 1 : 0.82 }}
      />

      {/* radial bloom — top right, the "sun" */}
      <motion.div
        className="absolute -right-[18%] -top-[12%] h-[62vh] w-[62vh] rounded-full blur-[70px]"
        initial={false}
        animate={{ background: `radial-gradient(circle, ${palette.glow}, transparent 68%)` }}
        transition={{ duration: 0.9 }}
        style={{ opacity: intensity === 'full' ? 0.85 : 0.5 }}
      />

      {/* counter bloom — bottom left, keeps it from feeling like a flat wash */}
      <div
        className="absolute -bottom-[26%] -left-[22%] h-[58vh] w-[58vh] rounded-full blur-[80px]"
        style={{
          background: `radial-gradient(circle, ${palette.glow}, transparent 72%)`,
          opacity: 0.32,
        }}
      />

      {/* horizon line — a whisper of structure */}
      <div
        className="absolute inset-x-0 top-[46%] h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${palette.ink}22, transparent)`,
        }}
      />

      {/* grain */}
      <div className="bg-noise absolute inset-0 opacity-[0.16] mix-blend-overlay" />

      {/* vignette so the dock and capsule always read */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(115% 78% at 50% 6%, transparent 42%, rgba(4,6,10,0.55) 100%)',
        }}
      />
    </div>
  );
}
