/**
 * AboutStation — a vintage sci-fi CRT terminal, floating slightly.
 * Uses the pulp-yellow / cream palette to feel more "personal file" and
 * less "project artifact". Displays a scrolling PID-like status stripe.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function AboutStation({ color = '#f5c518', accent = '#45f0ff' }) {
  const screen = useRef();
  const flicker = useRef();

  const caseMat = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#241d0f',
      emissive: '#d2492b',
      emissiveIntensity: 0.15,
      metalness: 0.35,
      roughness: 0.6,
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (flicker.current) {
      // Random flicker — very subtle
      const n = 0.9 + Math.sin(t * 34) * 0.05 + Math.random() * 0.02;
      flicker.current.material.opacity = n;
    }
    if (screen.current) {
      screen.current.rotation.y = Math.sin(t * 0.6) * 0.15;
    }
  });

  return (
    <group ref={screen}>
      {/* CRT body */}
      <mesh position={[0, 1.1, 0]} material={caseMat}>
        <boxGeometry args={[1.6, 1.2, 1.1]} />
      </mesh>

      {/* Screen glass */}
      <mesh position={[0, 1.1, 0.56]}>
        <planeGeometry args={[1.15, 0.8]} />
        <meshBasicMaterial color="#05060a" />
      </mesh>

      {/* Screen glow (flickering) */}
      <mesh position={[0, 1.1, 0.561]} ref={flicker}>
        <planeGeometry args={[1.1, 0.75]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Scanlines on screen */}
      <mesh position={[0, 1.1, 0.562]}>
        <planeGeometry args={[1.1, 0.75]} />
        <meshBasicMaterial color="#000" transparent opacity={0.25} />
      </mesh>

      {/* Screen text — HTML rendering so we depend on zero external fonts */}
      <Html
        position={[0, 1.1, 0.58]}
        center
        transform
        distanceFactor={4}
        occlude={false}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            width: 120,
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 10,
            lineHeight: 1.4,
            color: '#0a0612',
            textAlign: 'center',
            whiteSpace: 'pre-line',
            userSelect: 'none',
            fontWeight: 700,
          }}
        >
          {'> WHOAMI\nDAMIEN\nOK. //'}
        </div>
      </Html>

      {/* Antenna */}
      <mesh position={[-0.3, 1.9, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#d2492b" emissive="#d2492b" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.3, 2.15, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1} />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.75, 0.85, 0.4, 24]} />
        <meshStandardMaterial
          color="#1a1108"
          emissive="#d2492b"
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Knobs on the CRT (rotated to face the viewer) */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.7, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}
