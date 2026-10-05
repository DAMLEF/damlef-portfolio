/**
 * PokerActivity — a small poker table with a big flipping chip on top.
 * Press R (or click) to flip; a random flavor line appears on the chip.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../state/GameContext.jsx';

export default function PokerActivity({ color = '#f5c518', accent = '#ff2bd6' }) {
  const { state, t } = useGame();
  const chip = useRef();
  const felt = useRef();
  const [flipAt, setFlipAt] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);

  // Reacts when the shared activityAction targets 'poker'
  useEffect(() => {
    if (state.activityAction?.id !== 'poker') return;
    setFlipAt(state.activityAction.at);
    const flips = t.activities?.poker?.flips ?? [''];
    setLineIdx(Math.floor(Math.random() * flips.length));
  }, [state.activityAction, t]);

  const feltMat = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#0a3d2e',
      emissive: '#12a86e',
      emissiveIntensity: 0.25,
      metalness: 0.3,
      roughness: 0.55,
    }),
    []
  );

  const chipCoreMat = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#0a0612',
      emissive: accent,
      emissiveIntensity: 0.35,
      metalness: 0.75,
      roughness: 0.35,
    }),
    [accent]
  );

  const chipRimMat = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#f5c518',
      emissive: color,
      emissiveIntensity: 0.55,
      metalness: 0.65,
      roughness: 0.35,
    }),
    [color]
  );

  useFrame((s) => {
    const time = s.clock.elapsedTime;
    // Felt stays flat — no tumbling. Only the featured chip animates.

    if (chip.current) {
      const since = flipAt ? (Date.now() - flipAt) / 1000 : 999;
      const flipping = since < 1.4;
      if (flipping) {
        // rotate ~2.5 turns then settle
        chip.current.rotation.x = since * Math.PI * 3.5;
        chip.current.position.y = 0.6 + Math.sin(since * Math.PI) * 0.35;
      } else {
        chip.current.rotation.x = THREE.MathUtils.lerp(chip.current.rotation.x, 0, 0.1);
        chip.current.position.y = 0.6 + Math.sin(time * 1.6) * 0.05;
        chip.current.rotation.y = time * 0.4;
      }
    }
  });

  const line = t.activities?.poker?.flips?.[lineIdx] ?? '';
  const showCaption = flipAt && (Date.now() - flipAt) / 1000 > 1.2 && (Date.now() - flipAt) / 1000 < 5;

  return (
    <group>
      {/* Table body — hexagonal art deco */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.8, 0.95, 0.3, 6]} />
        <meshStandardMaterial color="#2a1444" emissive={accent} emissiveIntensity={0.4} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Felt top */}
      <mesh ref={felt} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={feltMat}>
        <circleGeometry args={[0.78, 24]} />
      </mesh>

      {/* Small "cards" fanned on the felt */}
      {[-0.35, -0.15, 0.05, 0.25].map((dx, i) => (
        <mesh key={i} position={[dx, 0.04, -0.2]} rotation={[-Math.PI / 2, 0, (i - 1.5) * 0.15]}>
          <planeGeometry args={[0.18, 0.28]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#f2e8c8' : '#d2492b'} />
        </mesh>
      ))}

      {/* Featured flipping chip — dark disc with an accent rim */}
      <group ref={chip} position={[0, 0.6, 0.15]}>
        {/* dark body */}
        <mesh material={chipCoreMat}>
          <cylinderGeometry args={[0.32, 0.32, 0.1, 24]} />
        </mesh>
        {/* accent rim wraps around the chip's edge (torus lies flat with hole facing Y) */}
        <mesh material={chipRimMat} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.32, 0.04, 12, 32]} />
        </mesh>
        {/* engraved star on the visible face */}
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.09, 0.16, 5, 1]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* Caption above the chip after a flip */}
      {showCaption ? (
        <Html position={[0, 3.6, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              padding: '4px 12px',
              background: 'rgba(5,3,12,0.9)',
              border: `1px solid ${accent}`,
              color: '#f5c518',
              fontFamily: 'var(--font-display, "Rye", serif)',
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textShadow: `0 0 6px ${accent}`,
              userSelect: 'none',
            }}
          >
            {line}
          </div>
        </Html>
      ) : null}
    </group>
  );
}
