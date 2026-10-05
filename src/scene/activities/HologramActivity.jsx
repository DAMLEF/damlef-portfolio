/**
 * HologramActivity — a floating food-delivery hologram kiosk.
 * Idle: shows a rotating menu with 4 lines.
 * On R (or click): swaps in a "Order placed" confirmation for ~2.5s +
 * a small bounce animation on the food shape.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../state/GameContext.jsx';

export default function HologramActivity({ color = '#45f0ff', accent = '#7cf29c' }) {
  const { state, t } = useGame();
  const food = useRef();
  const beam = useRef();
  const [orderAt, setOrderAt] = useState(0);

  useEffect(() => {
    if (state.activityAction?.id !== 'hologram') return;
    setOrderAt(state.activityAction.at);
  }, [state.activityAction]);

  const beamMat = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    [color]
  );

  useFrame((s) => {
    const time = s.clock.elapsedTime;
    const since = orderAt ? (Date.now() - orderAt) / 1000 : 999;
    const ordering = since < 1.4;

    if (food.current) {
      // Rotate only around the vertical axis so it looks like a hologram
      // stably levitating, not a tumbling shape.
      food.current.rotation.y = time * 1.2;
      food.current.rotation.x = 0;
      food.current.rotation.z = 0;
      food.current.position.y = 0.9 + Math.sin(time * 2.5) * 0.06 + (ordering ? Math.sin(since * Math.PI * 4) * 0.15 : 0);
      food.current.scale.setScalar(1 + (ordering ? 0.15 * Math.sin(since * Math.PI * 4) : 0));
    }
    if (beam.current) {
      beam.current.material.opacity = 0.18 + Math.sin(time * 3) * 0.05 + (ordering ? 0.2 : 0);
    }
  });

  const menuLines = t.activities?.hologram?.lines ?? [];
  const menuTitle = t.activities?.hologram?.menu ?? '';
  const orderedText = t.activities?.hologram?.ordered ?? '';
  const isOrdered = orderAt && (Date.now() - orderAt) / 1000 < 2.6;

  return (
    <group>
      {/* Kiosk pedestal */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.4, 12]} />
        <meshStandardMaterial color="#1a0a2b" emissive={accent} emissiveIntensity={0.3} metalness={0.65} roughness={0.4} />
      </mesh>

      {/* Emitter — a thin ring */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.16, 0.24, 20]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Cone-shaped light beam */}
      <mesh ref={beam} position={[0, 0.75, 0]} material={beamMat}>
        <coneGeometry args={[0.55, 1.1, 24, 1, true]} />
      </mesh>

      {/* Floating "food" object (a stacked burger-ish shape) */}
      <group ref={food} position={[0, 0.9, 0]}>
        {/* bun bottom */}
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.18, 0.2, 0.06, 20]} />
          <meshStandardMaterial color="#d2492b" emissive="#f5c518" emissiveIntensity={0.45} />
        </mesh>
        {/* patty */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 20]} />
          <meshStandardMaterial color="#3a1032" emissive="#ff2bd6" emissiveIntensity={0.6} />
        </mesh>
        {/* cheese */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 0.015, 20]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.9} />
        </mesh>
        {/* bun top */}
        <mesh position={[0, 0.11, 0]}>
          <sphereGeometry args={[0.2, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f5c518" emissive="#d2492b" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* Menu / order status label */}
      <Html position={[0, 3.6, 0]} center distanceFactor={7} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            padding: '6px 10px',
            background: 'rgba(5,3,12,0.85)',
            border: `1px solid ${isOrdered ? accent : color}`,
            color: '#f2e8c8',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 10,
            lineHeight: 1.4,
            letterSpacing: '0.08em',
            textShadow: `0 0 6px ${isOrdered ? accent : color}`,
            userSelect: 'none',
            minWidth: 140,
            textAlign: 'left',
          }}
        >
          {isOrdered ? (
            <div style={{ color: accent, textAlign: 'center', fontWeight: 700 }}>
              ✓ {orderedText}
            </div>
          ) : (
            <>
              <div style={{ color, marginBottom: 3, textAlign: 'center', fontWeight: 700 }}>
                {menuTitle}
              </div>
              {menuLines.map((l, i) => (
                <div key={i} style={{ opacity: 0.85 }}>{l}</div>
              ))}
            </>
          )}
        </div>
      </Html>
    </group>
  );
}
