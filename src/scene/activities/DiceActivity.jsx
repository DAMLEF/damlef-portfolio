/**
 * DiceActivity — two floating d6 that tumble on interaction, then settle
 * with a random 1..6 face shown via a small caption.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../state/GameContext.jsx';

const ROLL_DURATION = 1.4; // seconds (tumbling in the air)
const REST_Y = 0.28;       // settled height in the tray
const HOVER_Y = 0.75;      // idle-hover height while waiting for first roll

export default function DiceActivity({ color = '#45f0ff', accent = '#f5c518' }) {
  const { state, t } = useGame();
  const d1 = useRef();
  const d2 = useRef();
  const [rollAt, setRollAt] = useState(0);
  const [values, setValues] = useState([1, 1]);
  // Fixed euler angles for the two dice once they settle (so they look different).
  const restRots = useRef([
    { x: 0.2, y: 0.15, z: -0.1 },
    { x: -0.15, y: -0.25, z: 0.12 },
  ]);

  useEffect(() => {
    if (state.activityAction?.id !== 'dice') return;
    setRollAt(state.activityAction.at);
    setValues([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]);
    // freeze a new random resting pose
    restRots.current = [0, 1].map(() => ({
      x: (Math.random() - 0.5) * 0.6,
      y: (Math.random() - 0.5) * 0.6,
      z: (Math.random() - 0.5) * 0.4,
    }));
  }, [state.activityAction]);

  const cubeMat = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#f2e8c8',
      emissive: color,
      emissiveIntensity: 0.15,
      metalness: 0.2,
      roughness: 0.5,
    }),
    [color]
  );

  useFrame((s) => {
    const time = s.clock.elapsedTime;
    const since = rollAt ? (Date.now() - rollAt) / 1000 : 999;
    const rolling = since < ROLL_DURATION;
    const neverRolled = rollAt === 0;

    for (const [i, ref] of [[0, d1], [1, d2]]) {
      if (!ref.current) continue;
      if (rolling) {
        // Tumble in the air, then arc down (parabolic descent)
        ref.current.rotation.x = time * 12 + i;
        ref.current.rotation.y = time * 8 + i * 1.7;
        ref.current.rotation.z = time * 9 - i * 0.5;
        const k = since / ROLL_DURATION; // 0 → 1
        // Peak arc then land
        const arc = Math.sin(k * Math.PI) * 0.5;
        ref.current.position.y = HOVER_Y + arc - k * (HOVER_Y - REST_Y);
      } else if (neverRolled) {
        // Idle levitation before the first roll
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, i * 0.3, 0.1);
        ref.current.rotation.y = time * 0.5 + i;
        ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, 0, 0.1);
        ref.current.position.y = HOVER_Y + Math.sin(time * 2 + i) * 0.05;
      } else {
        // Settled: freeze at rest pose in the tray
        const rr = restRots.current[i];
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, rr.x, 0.2);
        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, rr.y, 0.2);
        ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, rr.z, 0.2);
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, REST_Y, 0.2);
      }
    }
  });

  const total = values[0] + values[1];
  const since = rollAt ? (Date.now() - rollAt) / 1000 : 999;
  // Keep the result visible until the next roll (7s window after settle)
  const showCaption = rollAt && since > ROLL_DURATION * 0.9 && since < 8;
  const captionLine = total <= 4
    ? t.activities?.dice?.lows
    : total >= 10
      ? t.activities?.dice?.highs
      : t.activities?.dice?.mids;

  return (
    <group>
      {/* Bowl base */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.7, 0.85, 0.2, 20]} />
        <meshStandardMaterial color="#1a1030" emissive={accent} emissiveIntensity={0.35} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.68, 24]} />
        <meshStandardMaterial color="#050310" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Two dice */}
      <group ref={d1} position={[-0.25, HOVER_Y, 0]}>
        <mesh material={cubeMat}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
        </mesh>
        {/* pip on top for readability */}
        <mesh position={[0, 0.181, 0]}>
          <circleGeometry args={[0.05, 12]} />
          <meshBasicMaterial color="#0a0612" />
        </mesh>
      </group>
      <group ref={d2} position={[0.25, HOVER_Y, 0]}>
        <mesh material={cubeMat}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
        </mesh>
        <mesh position={[0, 0.181, 0]}>
          <circleGeometry args={[0.05, 12]} />
          <meshBasicMaterial color="#0a0612" />
        </mesh>
      </group>

      {/* Result caption */}
      {showCaption ? (
        <Html position={[0, 3.6, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              padding: '4px 12px',
              background: 'rgba(5,3,12,0.9)',
              border: `1px solid ${accent}`,
              color: '#f2e8c8',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 12,
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
              textShadow: `0 0 6px ${accent}`,
              userSelect: 'none',
            }}
          >
            <span style={{ color: accent, fontWeight: 700 }}>
              [{values[0]} + {values[1]} = {total}]
            </span>{' '}
            {captionLine}
          </div>
        </Html>
      ) : null}
    </group>
  );
}
