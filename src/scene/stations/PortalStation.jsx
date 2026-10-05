/**
 * PortalStation — AI generative portal (rework).
 *
 * A more elaborate portal:
 *   - Outer torus ring, thick and emissive
 *   - Two thinner inner rings rotating on offset axes
 *   - Volumetric "energy core": stacked additive discs pulsing outward
 *   - Rim particles orbiting the outer ring
 *   - Scrolling glyphs on the disc
 *   - Base with a two-strut pylon
 */

import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const GLYPHS = [
  'CYBER · CITY · GHOST · NEON · DRIVE',
  'GENERATE · WORLD · TOKEN · FUSION',
  'PROMPT · PIXEL · WAVE · REBIRTH',
  'FIRE · WATER · STEEL · WISH · CODE',
  'ALGO · ROOM · KEY · MASK · DREAM',
];

const ORBIT_PARTICLES = 24;

export default function PortalStation({ color = '#ff2bd6', accent = '#45f0ff' }) {
  const outer = useRef();
  const innerA = useRef();
  const innerB = useRef();
  const core = useRef();
  const rim = useRef();
  const [glyphIdx, setGlyphIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setGlyphIdx((i) => (i + 1) % GLYPHS.length);
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  // Outer torus
  const outerMat = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#20153a',
      emissive: color,
      emissiveIntensity: 1.05,
      metalness: 0.75,
      roughness: 0.22,
    }),
    [color]
  );

  // Inner rings (thin & bright)
  const ringMatA = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    [accent]
  );
  const ringMatB = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    [color]
  );

  // Energy core disc
  const coreMat = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    [color]
  );

  // Orbiting rim particles — Points around the outer ring
  const rimGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(ORBIT_PARTICLES * 3);
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  const rimMat = useMemo(() =>
    new THREE.PointsMaterial({
      color: accent,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    [accent]
  );

  useFrame((s) => {
    const t = s.clock.elapsedTime;

    if (outer.current) outer.current.rotation.z = t * 0.15;
    if (innerA.current) {
      innerA.current.rotation.z = -t * 0.9;
      innerA.current.rotation.x = Math.sin(t * 0.4) * 0.4;
    }
    if (innerB.current) {
      innerB.current.rotation.z = t * 1.3;
      innerB.current.rotation.y = Math.cos(t * 0.5) * 0.4;
    }
    if (core.current) {
      const pulse = 0.55 + Math.sin(t * 2.2) * 0.2;
      core.current.material.opacity = pulse;
      core.current.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06);
      core.current.rotation.z = -t * 0.4;
    }

    // Rim particles orbit the outer ring
    if (rim.current) {
      const attr = rimGeom.getAttribute('position');
      const arr = attr.array;
      for (let i = 0; i < ORBIT_PARTICLES; i++) {
        const a = (i / ORBIT_PARTICLES) * Math.PI * 2 + t * 0.6;
        const wobble = Math.sin(t * 3 + i) * 0.02;
        const r = 0.85 + wobble;
        arr[i * 3]     = Math.cos(a) * r;
        arr[i * 3 + 1] = Math.sin(a) * r;
        arr[i * 3 + 2] = Math.sin(t * 2 + i) * 0.05;
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* All the portal parts sit vertically at y ≈ 1.2 */}
      <group position={[0, 1.2, 0]}>
        {/* Outer torus */}
        <mesh ref={outer} material={outerMat}>
          <torusGeometry args={[0.85, 0.12, 20, 48]} />
        </mesh>

        {/* Thin inner rings (offset axes for a 3D whirl feel) */}
        <mesh ref={innerA} material={ringMatA}>
          <torusGeometry args={[0.68, 0.018, 12, 48]} />
        </mesh>
        <mesh ref={innerB} material={ringMatB}>
          <torusGeometry args={[0.55, 0.02, 12, 48]} />
        </mesh>

        {/* Energy core: two additive discs stacked */}
        <mesh ref={core} material={coreMat}>
          <circleGeometry args={[0.78, 48]} />
        </mesh>
        <mesh position={[0, 0, 0.001]}>
          <circleGeometry args={[0.4, 32]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Orbiting rim particles */}
        <points ref={rim} geometry={rimGeom} material={rimMat} />

        {/* Scrolling glyphs on the disc — HTML so no font needs to load */}
        <Html
          position={[0, 0, 0.05]}
          center
          distanceFactor={7}
          transform
          occlude={false}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              width: 160,
              textAlign: 'center',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 12,
              letterSpacing: '0.14em',
              color: accent,
              textShadow: `0 0 6px ${accent}`,
              userSelect: 'none',
            }}
          >
            {GLYPHS[glyphIdx]}
          </div>
        </Html>
      </group>

      {/* Twin pylons + horizontal crossbar */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.7, 0]}>
          <boxGeometry args={[0.1, 1.4, 0.1]} />
          <meshStandardMaterial
            color="#2a1444"
            emissive={accent}
            emissiveIntensity={0.4}
            metalness={0.65}
            roughness={0.35}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.5, 0.16, 0.3]} />
        <meshStandardMaterial
          color="#1a0a2b"
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>

      {/* Base plate */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[1.7, 0.08, 0.7]} />
        <meshStandardMaterial
          color="#0a0612"
          emissive={color}
          emissiveIntensity={0.15}
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Bright key light behind the disc so the portal actually glows */}
      <pointLight position={[0, 1.2, -0.4]} intensity={5} distance={4} color={color} />
    </group>
  );
}
