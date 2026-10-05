/**
 * Neons — Background parallax lights + floating particles.
 * Purely decorative; no interaction. Kept cheap: instanced points.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 220;

export default function Neons() {
  const pointsRef = useRef();
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const cyan = new THREE.Color('#45f0ff');
    const magenta = new THREE.Color('#ff2bd6');
    const yellow = new THREE.Color('#f5c518');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 12 + Math.random() * 22;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3 + 0] = Math.cos(a) * r;
      positions[i * 3 + 1] = 0.5 + Math.random() * 8;
      positions[i * 3 + 2] = Math.sin(a) * r - 4;
      const pick = Math.random();
      const c = pick < 0.45 ? cyan : pick < 0.85 ? magenta : yellow;
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  // Slight upward drift so the world feels alive.
  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    const attr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = attr.array[i * 3 + 1] + delta * 0.4;
      attr.array[i * 3 + 1] = y > 10 ? 0.2 : y;
    }
    attr.needsUpdate = true;
    pointsRef.current.rotation.y += delta * 0.02;
  });

  return (
    <>
      {/* Ambient neon particles */}
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          size={0.08}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Two floor "puddles" of neon light */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, 0.02, -4]}>
        <ringGeometry args={[0.2, 3, 32]} />
        <meshBasicMaterial
          color="#ff2bd6"
          transparent
          opacity={0.22}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12, 0.02, -4]}>
        <ringGeometry args={[0.2, 3, 32]} />
        <meshBasicMaterial
          color="#45f0ff"
          transparent
          opacity={0.22}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}
