/**
 * FaceStation — FaceRehab.
 * A stylized wire-frame head hovering over a soft base. Subtle bobbing +
 * slow rotation. The wire look reads as "digital / metahuman" without
 * heavy assets.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FaceStation({ color = '#45f0ff', accent = '#f5c518' }) {
  const head = useRef();
  const wire = useRef();

  const skinMat = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#20153a',
      emissive: color,
      emissiveIntensity: 0.35,
      metalness: 0.5,
      roughness: 0.4,
    }),
    [color]
  );

  const wireMat = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    }),
    [color]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.6) * 0.5;
      head.current.position.y = 1.1 + Math.sin(t * 1.6) * 0.08;
    }
    if (wire.current) {
      wire.current.rotation.y = -t * 0.4;
      wire.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
  });

  return (
    <group>
      {/* Solid inner head */}
      <mesh ref={head} position={[0, 1.1, 0]} material={skinMat}>
        <sphereGeometry args={[0.55, 32, 32]} />
      </mesh>

      {/* Wireframe outer shell — the "digital metahuman" hint */}
      <mesh ref={wire} position={[0, 1.1, 0]} material={wireMat}>
        <sphereGeometry args={[0.7, 16, 12]} />
      </mesh>

      {/* Eye "pins" */}
      <mesh position={[-0.18, 1.18, 0.5]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh position={[0.18, 1.18, 0.5]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={accent} />
      </mesh>

      {/* Base pedestal */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.5, 24]} />
        <meshStandardMaterial
          color="#150925"
          emissive={color}
          emissiveIntensity={0.25}
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>

      {/* Data lines rising from the base */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[
          Math.cos((i / 6) * Math.PI * 2) * 0.5,
          0.65,
          Math.sin((i / 6) * Math.PI * 2) * 0.5,
        ]}>
          <boxGeometry args={[0.02, 0.5, 0.02]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      ))}
    </group>
  );
}
