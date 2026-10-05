/**
 * CrystalStation — Utopex.
 * A floating icosahedron/crystal that pulses with an inner light. Orbiting
 * smaller shards suggest the "wave defense" theme.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CrystalStation({ color = '#ff2bd6', accent = '#45f0ff' }) {
  const core = useRef();
  const light = useRef();
  const shards = useRef([]);

  const material = useMemo(() =>
    new THREE.MeshPhysicalMaterial({
      color,
      transmission: 0.4,
      thickness: 1,
      roughness: 0.15,
      metalness: 0.3,
      emissive: color,
      emissiveIntensity: 0.9,
    }),
    [color]
  );
  const shardMat = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.2,
    }),
    [accent]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (core.current) {
      core.current.rotation.y = t * 0.6;
      core.current.rotation.x = Math.sin(t * 0.4) * 0.25;
      const pulse = 0.9 + Math.sin(t * 3.2) * 0.08;
      core.current.scale.setScalar(pulse);
    }
    if (light.current) {
      light.current.intensity = 3.5 + Math.sin(t * 3.2) * 1.5;
    }
    for (let i = 0; i < shards.current.length; i++) {
      const s = shards.current[i];
      if (!s) continue;
      const a = t * 0.9 + (i * Math.PI * 2) / shards.current.length;
      s.position.set(Math.cos(a) * 1.2, 0.9 + Math.sin(a * 2) * 0.25, Math.sin(a) * 1.2);
      s.rotation.y = a * 2;
    }
  });

  const shardCount = 4;

  return (
    <group>
      {/* Core crystal */}
      <mesh ref={core} material={material} position={[0, 1.0, 0]}>
        <icosahedronGeometry args={[0.7, 0]} />
      </mesh>

      {/* Orbiting shards */}
      {Array.from({ length: shardCount }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => (shards.current[i] = m)}
          material={shardMat}
        >
          <octahedronGeometry args={[0.14, 0]} />
        </mesh>
      ))}

      {/* Base "cyberpunk vending machine" — small box hint */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.5, 0.7, 0.5]} />
        <meshStandardMaterial
          color="#1a0a2b"
          emissive={accent}
          emissiveIntensity={0.3}
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>

      <pointLight ref={light} position={[0, 1.0, 0]} color={color} distance={5} intensity={4} />
    </group>
  );
}
