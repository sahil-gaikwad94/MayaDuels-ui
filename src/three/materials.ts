import { useMemo } from 'react';
import * as THREE from 'three';

export interface MaterialSet {
  graphite: THREE.MeshStandardMaterial;
  ceramic: THREE.MeshStandardMaterial;
  titanium: THREE.MeshStandardMaterial;
  aluminium: THREE.MeshStandardMaterial;
  rubber: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  cyan: THREE.MeshStandardMaterial;
  magenta: THREE.MeshStandardMaterial;
  amber: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
}

/**
 * Shared material library (brief §1.4). One instance per canvas keeps draw
 * calls and material count low, and guarantees every object belongs to the
 * same authored family.
 */
export function useMaterials(accent = '#00F5D4'): MaterialSet {
  return useMemo(() => {
    const graphite = new THREE.MeshStandardMaterial({
      color: '#151922',
      roughness: 0.72,
      metalness: 0.28,
    });
    const ceramic = new THREE.MeshStandardMaterial({
      color: '#1D232F',
      roughness: 0.44,
      metalness: 0.12,
    });
    const titanium = new THREE.MeshStandardMaterial({
      color: '#8E99A8',
      roughness: 0.3,
      metalness: 0.92,
    });
    const aluminium = new THREE.MeshStandardMaterial({
      color: '#C6D0DC',
      roughness: 0.38,
      metalness: 0.75,
    });
    const rubber = new THREE.MeshStandardMaterial({
      color: '#0E1117',
      roughness: 0.95,
      metalness: 0.02,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: '#9FE9E0',
      roughness: 0.12,
      metalness: 0,
      transmission: 0.86,
      thickness: 0.6,
      transparent: true,
      opacity: 0.42,
      ior: 1.35,
    });
    const cyan = new THREE.MeshStandardMaterial({
      color: '#00F5D4',
      emissive: new THREE.Color('#00F5D4'),
      emissiveIntensity: 1.5,
      roughness: 0.35,
      metalness: 0.1,
      toneMapped: false,
    });
    const magenta = new THREE.MeshStandardMaterial({
      color: '#FF2A85',
      emissive: new THREE.Color('#FF2A85'),
      emissiveIntensity: 1.4,
      roughness: 0.35,
      metalness: 0.1,
      toneMapped: false,
    });
    const amber = new THREE.MeshStandardMaterial({
      color: '#FFB800',
      emissive: new THREE.Color('#FFB800'),
      emissiveIntensity: 1.1,
      roughness: 0.4,
      metalness: 0.15,
      toneMapped: false,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: '#0A0C12',
      roughness: 0.85,
      metalness: 0.18,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: accent,
      emissive: new THREE.Color(accent),
      emissiveIntensity: 1.25,
      roughness: 0.32,
      metalness: 0.2,
      toneMapped: false,
    });
    return {
      graphite,
      ceramic,
      titanium,
      aluminium,
      rubber,
      glass,
      cyan,
      magenta,
      amber,
      dark,
      accent: accentMat,
    };
  }, [accent]);
}

/** Shared geometry factory with consistent bevel/chamfer language. */
export function roundedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  radius = 0.08,
  segments = 3,
) {
  const shape = new THREE.Shape();
  const w = width / 2;
  const h = height / 2;
  const r = Math.min(radius, w, h);
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.01, depth - r * 2),
    bevelEnabled: true,
    bevelThickness: r,
    bevelSize: r * 0.9,
    bevelSegments: segments,
    curveSegments: segments + 2,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}