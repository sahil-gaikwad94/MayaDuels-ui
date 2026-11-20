import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { DomainObject, type ObjectKind } from './objects';

interface HeroCanvasProps {
  kind: ObjectKind;
  accent: string;
  zoom: number;
  offsetY: number;
  shadowOpacity: number;
}

/**
 * Split out so the Three.js bundle is only fetched when a live 3D hero is
 * actually rendered (never on first paint, never in low-effects mode).
 */
export function HeroCanvas({
  kind,
  accent,
  zoom,
  offsetY,
  shadowOpacity,
}: HeroCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      camera={{ position: [0, 0.15, zoom], fov: 38 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3.2, 4.4, 3.6]} intensity={2.1} color="#EAF2FF" />
      <directionalLight position={[-3.4, -1.6, 2.2]} intensity={0.7} color={accent} />
      <pointLight
        position={[0, -2.2, 1.4]}
        intensity={12}
        color={accent}
        distance={6}
      />
      <Suspense fallback={null}>
        <group position={[0, offsetY, 0]}>
          <DomainObject kind={kind} accent={accent} />
        </group>
        <ContactShadows
          position={[0, -0.92 + offsetY, 0]}
          opacity={shadowOpacity}
          scale={4.2}
          blur={2.6}
          far={2.4}
          resolution={256}
          color="#000000"
        />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}