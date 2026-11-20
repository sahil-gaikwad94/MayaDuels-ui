import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

/**
 * Porcelain surface — the light, tactile card that floats over the arena
 * field. This is the contrast engine of the whole design: saturated
 * atmosphere behind, quiet warm-white object in front.
 */
export function Porcelain({
  children,
  className,
  radius = 'rounded-[30px]',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  radius?: string;
  as?: 'div' | 'section' | 'article';
}) {
  return (
    <Tag
      className={cn(
        'relative overflow-hidden bg-porcelain text-ink-dark shadow-porcelain',
        radius,
        className,
      )}
    >
      {/* warm top sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
        }}
      />
      {/* bottom shading — makes it read as a physical object */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
        style={{
          background:
            'linear-gradient(0deg, rgba(18,20,26,0.06) 0%, rgba(18,20,26,0) 100%)',
        }}
      />
      <div className="relative">{children}</div>
    </Tag>
  );
}

/** A dark chip that sits inside porcelain cards (labels, counts, meta). */
export function PorcelainChip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-ink-dark px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-porcelain',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A hairline divider that works on porcelain. */
export function PorcelainRule({ className }: { className?: string }) {
  return <div className={cn('h-px bg-porcelain-line', className)} />;
}
