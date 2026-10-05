/**
 * TowerStation — VR Tower Defense.
 * A cyberpunk turret: cylinder base + rotating gun mount + orbiting drones
 * suggesting waves of avatars circling the tower.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TowerStation({ color = '#d2492b', accent = '#f5c518' }) {
  const gunGroup = useRef();
  const drones = useRef([]);

  const bodyMat = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#26102b',
      emissive: color,
      emissiveIntensity: 0.35,
      metalness: 0.6,
      roughness: 0.3,
    }),
    [color]
  );

  const droneMat = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 1.0,
    }),
    [accent]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (gunGroup.current) {
      gunGroup.current.rotation.y = t * 0.9;
    }
    for (let i = 0; i < drones.current.length; i++) {
      const d = drones.current[i];
      if (!d) continue;
      const a = t * 1.4 + (i * Math.PI * 2) / drones.current.length;
      const rad = 1.4 + Math.sin(t * 2 + i) * 0.15;
      d.position.set(Math.cos(a) * rad, 1.2 + Math.sin(a * 3) * 0.2, Math.sin(a) * rad);
    }
  });

  const droneCount = 3;

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.35, 0]} material={bodyMat}>
        <cylinderGeometry args={[0.5, 0.6, 0.65, 8]} />
      </mesh>

      {/* Middle segment */}
      <mesh position={[0, 0.85, 0]} material={bodyMat}>
        <cylinderGeometry args={[0.4, 0.5, 0.4, 8]} />
      </mesh>

      {/* Rotating gun mount */}
      <group ref={gunGroup} position={[0, 1.2, 0]}>
        <mesh material={bodyMat}>
          <boxGeometry args={[0.9, 0.4, 0.4]} />
        </mesh>
        <mesh position={[0.55, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[-0.55, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Orbiting drones (represent the deployed avatars) */}
      {Array.from({ length: droneCount }).map((_, i) => (
        <mesh key={i} ref={(m) => (drones.current[i] = m)} material={droneMat}>
          <tetrahedronGeometry args={[0.16, 0]} />
        </mesh>
      ))}
    </group>
  );
}
