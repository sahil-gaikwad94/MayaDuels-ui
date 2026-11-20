import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { roundedBoxGeometry, useMaterials } from './materials';

interface FloatProps {
  children: React.ReactNode;
  speed?: number;
  amplitude?: number;
  offset?: number;
  enabled?: boolean;
}

/** Gentle idle float — disabled entirely under reduced motion. */
export function Float({
  children,
  speed = 1,
  amplitude = 0.06,
  offset = 0,
  enabled = true,
}: FloatProps) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current || !enabled) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.y = Math.sin(t) * amplitude;
    ref.current.rotation.y = Math.sin(t * 0.42) * 0.08;
  });
  return <group ref={ref}>{children}</group>;
}

/**
 * Maya Core — the signature object. A faceted ceramic core with a cyan signal
 * window, wrapped by two orbiting plates and a chamfered containment ring.
 * Silhouette is simple enough to reduce to an app icon / loading mark.
 */
export function MayaCore({
  accent = '#00F5D4',
  active = true,
  idle = true,
}: {
  accent?: string;
  active?: boolean;
  idle?: boolean;
}) {
  const m = useMaterials(accent);
  const coreRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const plateA = useRef<THREE.Group>(null);
  const plateB = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  const coreGeo = useMemo(() => new THREE.IcosahedronGeometry(0.52, 0), []);
  const plateGeo = useMemo(() => roundedBoxGeometry(0.62, 0.1, 0.42, 0.05), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(0.78, 0.045, 10, 48), []);
  const innerGeo = useMemo(() => new THREE.OctahedronGeometry(0.26, 0), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current && idle) {
      coreRef.current.rotation.y += delta * 0.24;
      coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.08;
    }
    if (ringRef.current && idle) {
      ringRef.current.rotation.z += delta * 0.16;
      ringRef.current.rotation.x = 1.15 + Math.sin(t * 0.4) * 0.06;
    }
    if (plateA.current && idle) {
      plateA.current.position.set(
        Math.cos(t * 0.5) * 0.95,
        0.34 + Math.sin(t * 0.7) * 0.05,
        Math.sin(t * 0.5) * 0.95,
      );
      plateA.current.rotation.set(t * 0.3, -t * 0.5, 0.3);
    }
    if (plateB.current && idle) {
      plateB.current.position.set(
        Math.cos(t * 0.5 + 2.4) * 0.86,
        -0.42 + Math.cos(t * 0.6) * 0.05,
        Math.sin(t * 0.5 + 2.4) * 0.86,
      );
      plateB.current.rotation.set(-t * 0.24, t * 0.4, -0.2);
    }
    if (inner.current) {
      const pulse = active ? 1 + Math.sin(t * 2.1) * 0.07 : 1;
      inner.current.scale.setScalar(pulse);
      inner.current.rotation.y -= delta * 0.6;
    }
  });

  return (
    <group>
      <group ref={coreRef}>
        <mesh geometry={coreGeo} material={m.ceramic} castShadow />
        {/* signal window */}
        <mesh position={[0, 0, 0.5]} material={m.glass}>
          <circleGeometry args={[0.2, 24]} />
        </mesh>
        <mesh position={[0, 0, 0.505]}>
          <circleGeometry args={[0.13, 20]} />
          <meshBasicMaterial
            color={active ? accent : '#4A5361'}
            toneMapped={false}
            transparent
            opacity={active ? 0.95 : 0.5}
          />
        </mesh>
        {/* edge pins */}
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.46, Math.sin(a) * 0.46, 0]}
              rotation={[0, 0, a]}
              material={m.titanium}
            >
              <boxGeometry args={[0.12, 0.05, 0.05]} />
            </mesh>
          );
        })}
      </group>

      <mesh ref={inner} geometry={innerGeo} material={m.cyan} />

      <group ref={ringRef}>
        <mesh geometry={ringGeo} material={m.titanium} />
        <mesh geometry={ringGeo} material={m.graphite} scale={1.06} />
      </group>

      <group ref={plateA}>
        <mesh geometry={plateGeo} material={m.titanium} />
        <mesh geometry={plateGeo} material={m.dark} scale={0.86} />
      </group>
      <group ref={plateB}>
        <mesh geometry={plateGeo} material={m.aluminium} scale={0.82} />
      </group>
    </group>
  );
}

/** Neural Forge — sculptural neural processor with orbiting tensor tiles. */
export function NeuralForge({
  accent = '#00F5D4',
  idle = true,
}: {
  accent?: string;
  idle?: boolean;
}) {
  const m = useMaterials(accent);
  const dieRef = useRef<THREE.Group>(null);
  const tiles = useRef<THREE.Group>(null);
  const dieGeo = useMemo(() => roundedBoxGeometry(0.92, 0.92, 0.16, 0.07), []);
  const tileGeo = useMemo(() => roundedBoxGeometry(0.24, 0.24, 0.05, 0.03), []);
  const pinGeo = useMemo(() => new THREE.BoxGeometry(0.03, 0.03, 0.16), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (dieRef.current && idle) {
      dieRef.current.rotation.y = Math.sin(t * 0.35) * 0.28 - 0.2;
      dieRef.current.rotation.x = -0.42 + Math.sin(t * 0.5) * 0.05;
    }
    if (tiles.current && idle) {
      tiles.current.rotation.y += delta * 0.22;
    }
  });

  return (
    <group>
      <group ref={dieRef}>
        <mesh geometry={dieGeo} material={m.graphite} />
        {/* silicon inner die */}
        <mesh position={[0, 0, 0.1]} material={m.dark}>
          <boxGeometry args={[0.6, 0.6, 0.05]} />
        </mesh>
        <mesh position={[0, 0, 0.135]} material={m.accent}>
          <planeGeometry args={[0.3, 0.3]} />
        </mesh>
        {/* circuit traces */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[-0.24 + i * 0.16, 0, 0.13]}
            material={m.titanium}
          >
            <boxGeometry args={[0.012, 0.46, 0.008]} />
          </mesh>
        ))}
        {/* pins on all four edges */}
        {Array.from({ length: 7 }).map((_, i) => {
          const p = -0.36 + i * 0.12;
          return (
            <group key={i}>
              <mesh position={[p, 0.5, 0]} material={m.aluminium}>
                <primitive object={pinGeo} attach="geometry" />
              </mesh>
              <mesh position={[p, -0.5, 0]} material={m.aluminium}>
                <primitive object={pinGeo} attach="geometry" />
              </mesh>
              <mesh position={[0.5, p, 0]} rotation={[0, Math.PI / 2, 0]} material={m.aluminium}>
                <primitive object={pinGeo} attach="geometry" />
              </mesh>
              <mesh position={[-0.5, p, 0]} rotation={[0, Math.PI / 2, 0]} material={m.aluminium}>
                <primitive object={pinGeo} attach="geometry" />
              </mesh>
            </group>
          );
        })}
      </group>

      <group ref={tiles}>
        {[
          [0.86, 0.42, 0.3],
          [-0.8, 0.5, -0.2],
          [0.6, -0.62, -0.4],
          [-0.7, -0.5, 0.45],
        ].map((pos, i) => (
          <mesh
            key={i}
            geometry={tileGeo}
            material={i === 1 ? m.accent : i === 3 ? m.glass : m.titanium}
            position={pos as [number, number, number]}
            rotation={[i * 0.4, i * 0.7, i * 0.2]}
          />
        ))}
      </group>
    </group>
  );
}

/** Systems Grid — modular server cluster with route links and packet tiles. */
export function SystemsGrid({
  accent = '#9FB4C7',
  idle = true,
}: {
  accent?: string;
  idle?: boolean;
}) {
  const m = useMaterials(accent);
  const group = useRef<THREE.Group>(null);
  const packets = useRef<THREE.Group>(null);
  const blockGeo = useMemo(() => roundedBoxGeometry(0.42, 0.3, 0.42, 0.05), []);
  const packetGeo = useMemo(() => new THREE.BoxGeometry(0.09, 0.09, 0.09), []);

  const nodes: [number, number, number][] = [
    [0, 0.16, 0],
    [-0.52, -0.22, 0.18],
    [0.5, -0.26, -0.14],
    [0.06, 0.5, -0.42],
    [-0.16, -0.5, 0.36],
  ];

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current && idle) {
      group.current.rotation.y = Math.sin(t * 0.3) * 0.2 + 0.3;
    }
    if (packets.current && idle) {
      packets.current.children.forEach((child, i) => {
        const p = (t * 0.35 + i * 0.2) % 1;
        child.position.y = 0.1 + p * 0.9;
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) mat.opacity = 1;
      });
    }
  });

  return (
    <group ref={group}>
      {nodes.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh geometry={blockGeo} material={i === 0 ? m.ceramic : m.graphite} />
          {/* server face lights */}
          {[0, 1, 2].map((r) => (
            <mesh
              key={r}
              position={[0, 0.07 - r * 0.07, 0.215]}
              material={i === 0 ? m.accent : m.titanium}
            >
              <boxGeometry args={[0.24, 0.014, 0.01]} />
            </mesh>
          ))}
          {i === 0 && (
            <mesh position={[0, 0.17, 0]} material={m.accent}>
              <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
            </mesh>
          )}
        </group>
      ))}

      {/* route links */}
      {nodes.slice(1).map((pos, i) => {
        const from = new THREE.Vector3(...nodes[0]);
        const to = new THREE.Vector3(...pos);
        const mid = from.clone().add(to).multiplyScalar(0.5);
        const len = from.distanceTo(to);
        const dir = to.clone().sub(from).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir,
        );
        return (
          <mesh
            key={i}
            position={mid}
            quaternion={quat}
            material={m.titanium}
          >
            <cylinderGeometry args={[0.008, 0.008, len, 6]} />
          </mesh>
        );
      })}

      <group ref={packets}>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            geometry={packetGeo}
            material={i === 1 ? m.accent : m.aluminium}
            position={[nodes[i + 1][0], 0.2, nodes[i + 1][2]]}
          />
        ))}
      </group>
    </group>
  );
}

/** Data Vault — stacked storage plates with a growing index structure. */
export function DataVault({
  accent = '#FFB800',
  idle = true,
}: {
  accent?: string;
  idle?: boolean;
}) {
  const m = useMaterials(accent);
  const group = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const plateGeo = useMemo(() => new THREE.CylinderGeometry(0.62, 0.62, 0.07, 40), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(0.72, 0.018, 8, 40), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current && idle) group.current.rotation.y = t * 0.14;
    if (rings.current && idle) rings.current.rotation.y -= delta * 0.3;
  });

  return (
    <group ref={group}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          geometry={plateGeo}
          material={i === 2 ? m.titanium : m.graphite}
          position={[0, -0.3 + i * 0.19, 0]}
          scale={1 - i * 0.03}
        />
      ))}
      {/* index tree growing from the stack */}
      <group position={[0, 0.42, 0]}>
        <mesh material={m.ceramic}>
          <boxGeometry args={[0.1, 0.34, 0.1]} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.16, 0.2, 0]}>
            <mesh material={m.titanium}>
              <boxGeometry args={[0.24, 0.05, 0.14]} />
            </mesh>
            <mesh position={[s * 0.1, 0.1, 0]} material={m.accent}>
              <boxGeometry args={[0.05, 0.05, 0.05]} />
            </mesh>
          </group>
        ))}
      </group>
      <group ref={rings} position={[0, 0.05, 0]}>
        <mesh geometry={ringGeo} material={m.accent} rotation={[Math.PI / 2, 0, 0]} />
        <mesh
          geometry={ringGeo}
          material={m.titanium}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.26, 0]}
          scale={0.86}
        />
      </group>
    </group>
  );
}

/** Runtime District — layered window frames at depth with an event-loop ring. */
export function RuntimeDistrict({
  accent = '#7FE3D4',
  idle = true,
}: {
  accent?: string;
  idle?: boolean;
}) {
  const m = useMaterials(accent);
  const group = useRef<THREE.Group>(null);
  const loop = useRef<THREE.Group>(null);
  const frameGeo = useMemo(() => roundedBoxGeometry(0.92, 0.62, 0.05, 0.04), []);
  const tileGeo = useMemo(() => roundedBoxGeometry(0.18, 0.18, 0.04, 0.02), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current && idle) {
      group.current.rotation.y = -0.34 + Math.sin(t * 0.32) * 0.16;
      group.current.rotation.x = 0.12;
    }
    if (loop.current && idle) loop.current.rotation.z += delta * 0.5;
  });

  return (
    <group ref={group}>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[i * 0.06, i * 0.05, -i * 0.26]}>
          <mesh geometry={frameGeo} material={i === 2 ? m.titanium : m.graphite} />
          <mesh position={[0, 0.24, 0.03]} material={m.dark}>
            <boxGeometry args={[0.92, 0.1, 0.02]} />
          </mesh>
          {[0, 1, 2].map((d) => (
            <mesh
              key={d}
              position={[-0.34 + d * 0.09, 0.24, 0.045]}
              material={d === 0 ? m.accent : m.titanium}
            >
              <circleGeometry args={[0.018, 10]} />
            </mesh>
          ))}
          <mesh position={[0, -0.04, 0.035]} material={m.ceramic}>
            <boxGeometry args={[0.7, 0.3, 0.01]} />
          </mesh>
        </group>
      ))}

      <group ref={loop} position={[0.34, -0.42, 0.24]}>
        <mesh material={m.accent}>
          <torusGeometry args={[0.2, 0.022, 8, 32]} />
        </mesh>
        <mesh material={m.titanium}>
          <torusGeometry args={[0.13, 0.012, 8, 24]} />
        </mesh>
      </group>

      {[
        [-0.72, 0.3, 0.3],
        [0.66, 0.42, -0.1],
        [-0.6, -0.44, -0.2],
      ].map((pos, i) => (
        <mesh
          key={i}
          geometry={tileGeo}
          material={i === 1 ? m.accent : m.aluminium}
          position={pos as [number, number, number]}
          rotation={[0.3, 0.5, 0.2]}
        />
      ))}
    </group>
  );
}

/** Core Circuit — CPU die with cache tiles and a highlighted instruction path. */
export function CoreCircuit({
  accent = '#C9D4E2',
  idle = true,
}: {
  accent?: string;
  idle?: boolean;
}) {
  const m = useMaterials(accent);
  const group = useRef<THREE.Group>(null);
  const path = useRef<THREE.Group>(null);
  const dieGeo = useMemo(() => roundedBoxGeometry(0.86, 0.86, 0.12, 0.05), []);
  const tileGeo = useMemo(() => roundedBoxGeometry(0.2, 0.2, 0.06, 0.03), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current && idle) {
      group.current.rotation.y = 0.4 + Math.sin(t * 0.28) * 0.22;
      group.current.rotation.x = -0.36;
    }
    if (path.current && idle) {
      path.current.children.forEach((c, i) => {
        const mesh = c as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          const pulse = 0.6 + Math.sin(t * 2.4 - i * 0.7) * 0.4;
          mat.emissiveIntensity = 0.5 + pulse * 1.1;
        }
      });
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={dieGeo} material={m.graphite} />
      <mesh position={[0, 0, 0.075]} material={m.dark}>
        <boxGeometry args={[0.7, 0.7, 0.03]} />
      </mesh>
      {/* core grid */}
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) => (
          <mesh
            key={`${r}-${c}`}
            position={[-0.24 + c * 0.16, -0.24 + r * 0.16, 0.1]}
            material={(r + c) % 3 === 0 ? m.accent : m.ceramic}
          >
            <boxGeometry args={[0.11, 0.11, 0.02]} />
          </mesh>
        )),
      )}
      {/* cache tiles around the die */}
      {[
        [-0.62, 0.3, 0],
        [0.62, 0.3, 0],
        [-0.62, -0.3, 0],
        [0.62, -0.3, 0],
      ].map((pos, i) => (
        <mesh
          key={i}
          geometry={tileGeo}
          material={i === 0 ? m.titanium : m.aluminium}
          position={pos as [number, number, number]}
          rotation={[0, 0, 0]}
        />
      ))}
      <group ref={path}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[-0.3 + i * 0.2, 0.44, 0.09]}
            material={m.accent.clone()}
          >
            <boxGeometry args={[0.12, 0.02, 0.02]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Redline Protocol — shield/lock hybrid with a handshake ring and keys. */
export function RedlineProtocol({
  accent = '#FF2A85',
  idle = true,
}: {
  accent?: string;
  idle?: boolean;
}) {
  const m = useMaterials(accent);
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const keyGeo = useMemo(() => roundedBoxGeometry(0.1, 0.3, 0.06, 0.03), []);
  const shieldShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.62);
    s.lineTo(0.44, 0.36);
    s.lineTo(0.36, -0.24);
    s.quadraticCurveTo(0, -0.66, 0, -0.66);
    s.quadraticCurveTo(0, -0.66, -0.36, -0.24);
    s.lineTo(-0.44, 0.36);
    s.closePath();
    return s;
  }, []);
  const shieldGeo = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shieldShape, {
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 2,
      }),
    [shieldShape],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current && idle) {
      group.current.rotation.y = -0.3 + Math.sin(t * 0.3) * 0.2;
    }
    if (ring.current && idle) ring.current.rotation.z += delta * 0.4;
  });

  return (
    <group ref={group}>
      <mesh geometry={shieldGeo} material={m.ceramic} position={[0, 0, -0.05]} />
      <mesh geometry={shieldGeo} material={m.titanium} scale={0.72} position={[0, 0, 0.02]} />
      <mesh position={[0, 0.04, 0.1]} material={m.accent}>
        <circleGeometry args={[0.11, 20]} />
      </mesh>
      <mesh position={[0, -0.16, 0.1]} material={m.dark}>
        <boxGeometry args={[0.06, 0.16, 0.03]} />
      </mesh>
      <group ref={ring} position={[0, 0, 0.02]}>
        <mesh material={m.accent} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.66, 0.016, 8, 40]} />
        </mesh>
      </group>
      {[
        [-0.72, 0.34, 0.2],
        [0.74, -0.2, 0.1],
      ].map((pos, i) => (
        <mesh
          key={i}
          geometry={keyGeo}
          material={i === 0 ? m.aluminium : m.titanium}
          position={pos as [number, number, number]}
          rotation={[0.2, 0.4, i === 0 ? 0.5 : -0.4]}
        />
      ))}
    </group>
  );
}

/** Trophy / rank emblem family used on results and profile. */
export function TrophyObject({
  accent = '#00F5D4',
  idle = true,
}: {
  accent?: string;
  idle?: boolean;
}) {
  const m = useMaterials(accent);
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current && idle) {
      group.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });
  return (
    <group ref={group}>
      <mesh position={[0, -0.42, 0]} material={m.graphite}>
        <cylinderGeometry args={[0.34, 0.4, 0.12, 24]} />
      </mesh>
      <mesh position={[0, -0.16, 0]} material={m.titanium}>
        <cylinderGeometry args={[0.07, 0.09, 0.42, 16]} />
      </mesh>
      <mesh position={[0, 0.24, 0]} material={m.aluminium}>
        <cylinderGeometry args={[0.3, 0.14, 0.36, 24, 1, true]} />
      </mesh>
      <mesh position={[0, 0.24, 0]} material={m.accent}>
        <sphereGeometry args={[0.09, 16, 16]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[s * 0.3, 0.26, 0]}
          rotation={[0, 0, s * 0.4]}
          material={m.titanium}
        >
          <torusGeometry args={[0.14, 0.02, 8, 20, Math.PI]} />
        </mesh>
      ))}
    </group>
  );
}

export type ObjectKind =
  | 'core'
  | 'AI_ML'
  | 'INFRA'
  | 'DATA'
  | 'WEB'
  | 'CORE_CS'
  | 'SECURITY'
  | 'trophy';

export function DomainObject({
  kind,
  accent,
  idle = true,
}: {
  kind: ObjectKind;
  accent?: string;
  idle?: boolean;
}) {
  switch (kind) {
    case 'core':
      return <MayaCore accent={accent} idle={idle} />;
    case 'AI_ML':
      return <NeuralForge accent={accent} idle={idle} />;
    case 'INFRA':
      return <SystemsGrid accent={accent} idle={idle} />;
    case 'DATA':
      return <DataVault accent={accent} idle={idle} />;
    case 'WEB':
      return <RuntimeDistrict accent={accent} idle={idle} />;
    case 'CORE_CS':
      return <CoreCircuit accent={accent} idle={idle} />;
    case 'SECURITY':
      return <RedlineProtocol accent={accent} idle={idle} />;
    case 'trophy':
      return <TrophyObject accent={accent} idle={idle} />;
    default:
      return <MayaCore accent={accent} idle={idle} />;
  }
}