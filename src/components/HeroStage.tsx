import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { ObjectGlyph } from './ObjectGlyph';
import { useShouldRender3D } from '../hooks/useShouldRender3D';
import { cn } from '../lib/utils';
import type { ObjectKind } from '../three/objects';

const HeroCanvas = lazy(() =>
  import('../three/HeroCanvas').then((m) => ({ default: m.HeroCanvas })),
);

interface HeroStageProps {
  kind: ObjectKind;
  accent?: string;
  className?: string;
  /** Camera distance — lower is closer/larger. */
  zoom?: number;
  /** Vertical offset of the object group. */
  offsetY?: number;
  intensity?: 'hero' | 'card' | 'mini';
  label?: string;
}

/**
 * Hosts one real-time 3D hero object with a controlled camera, local
 * illumination and a static vector fallback. Rendering pauses when offscreen.
 */
export function HeroStage({
  kind,
  accent = '#00F5D4',
  className,
  zoom = 3.1,
  offsetY = 0,
  intensity = 'hero',
  label,
}: HeroStageProps) {
  const { enabled } = useShouldRender3D();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '120px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show3D = enabled && visible;
  const shadowOpacity = intensity === 'hero' ? 0.5 : 0.32;

  return (
    <div
      ref={containerRef}
      className={cn('relative flex items-center justify-center', className)}
      aria-label={label}
    >
      {/* Ambient brand glow behind the object */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(circle at 50% 46%, ${accent}22 0%, transparent 62%)`,
        }}
      />

      {show3D ? (
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <ObjectGlyph
                kind={kind}
                accent={accent}
                className="h-[70%] w-[70%] opacity-70"
              />
            </div>
          }
        >
          <HeroCanvas
            kind={kind}
            accent={accent}
            zoom={zoom}
            offsetY={offsetY}
            shadowOpacity={shadowOpacity}
          />
        </Suspense>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ObjectGlyph
            kind={kind}
            accent={accent}
            className="h-[78%] w-[78%] drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]"
          />
        </div>
      )}
    </div>
  );
}