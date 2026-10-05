/**
 * MinecraftStation — Stacked voxels + one that periodically "cracks" apart.
 * Animation loop:
 *   phase 0..1  ─ intact block spins slowly
 *   phase 1..2  ─ block splits into 3 pieces flying outward
 *   phase 2..3  ─ pieces reassemble into the block
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MinecraftStation({ color = '#7cf29c' }) {
  const g = useRef();
  const shard1 = useRef();
  const shard2 = useRef();
  const shard3 = useRef();

  const mat = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#3e8f42',
      emissive: color,
      emissiveIntensity: 0.35,
      metalness: 0.05,
      roughness: 0.75,
      flatShading: true,
    }),
    [color]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!g.current) return;
    g.current.rotation.y = t * 0.3;

    // Break cycle: 3 seconds intact, 1.2 seconds broken, then back.
    const cycle = (t % 4.2);
    let openAmount = 0;
    if (cycle > 3.0 && cycle < 4.2) {
      openAmount = Math.sin(((cycle - 3.0) / 1.2) * Math.PI); // 0..1..0
    }
    const outward = 0.9 * openAmount;
    if (shard1.current) {
      shard1.current.position.set( outward,  0.5 + openAmount * 0.3,  0);
      shard1.current.rotation.z = openAmount * 0.6;
    }
    if (shard2.current) {
      shard2.current.position.set(-outward * 0.6,  0.9 + openAmount * 0.4, outward * 0.7);
      shard2.current.rotation.x = openAmount * 0.6;
    }
    if (shard3.current) {
      shard3.current.position.set( outward * 0.3, 0.2 + openAmount * 0.2, -outward);
      shard3.current.rotation.y = openAmount * 0.9;
    }
  });

  return (
    <group ref={g}>
      {/* Stacked blocks */}
      <mesh position={[-0.55, 0.2, 0]} material={mat}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
      </mesh>
      <mesh position={[0.55, 0.2, -0.3]} material={mat}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
      </mesh>
      <mesh position={[0, 0.9, -0.15]} material={mat}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
      </mesh>

      {/* Breaking block shards */}
      <mesh ref={shard1} material={mat}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
      </mesh>
      <mesh ref={shard2} material={mat}>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
      </mesh>
      <mesh ref={shard3} material={mat}>
        <boxGeometry args={[0.32, 0.32, 0.32]} />
      </mesh>
    </group>
  );
}
