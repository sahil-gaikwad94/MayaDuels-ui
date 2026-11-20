import { useEffect, useState } from 'react';
import { useAppState } from '../state/AppState';

let cachedWebgl: boolean | null = null;

export function detectWebGL(): boolean {
  if (cachedWebgl !== null) return cachedWebgl;
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    cachedWebgl = Boolean(gl);
  } catch {
    cachedWebgl = false;
  }
  return cachedWebgl;
}

/**
 * Decides whether to render live 3D or the static SVG fallback.
 * Falls back when: no WebGL, reduced motion, low-effects mode, small viewport
 * or a data-saver hint from the network information API.
 */
export function useShouldRender3D() {
  const { settings } = useAppState();
  const [webgl, setWebgl] = useState<boolean>(() => detectWebGL());
  const [narrow, setNarrow] = useState<boolean>(() =>
    typeof window === 'undefined' ? false : window.innerWidth < 360,
  );
  const [saveData, setSaveData] = useState<boolean>(() => {
    if (typeof navigator === 'undefined') return false;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } })
      .connection;
    return Boolean(conn?.saveData);
  });

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 360);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const enabled =
    webgl && !settings.reduceMotion && !settings.lowEffects && !narrow && !saveData;

  return { enabled, webgl };
}