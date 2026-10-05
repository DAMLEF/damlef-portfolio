/**
 * CarouselActivity — a miniature carousel with 4 little horses rotating
 * around a central pole. Idle: slow spin. On R (or click): accelerates
 * for one full lap (ease-out) then resumes drifting. Each horse bobs
 * up and down for the classic carousel feel.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../state/GameContext.jsx';

const SPIN_DURATION = 2.4;

export default function CarouselActivity({ color = '#ff2bd6', accent = '#f5c518' }) {
  const { state, t } = useGame();
  const disk = useRef();
  const horseRefs = [useRef(), useRef(), useRef(), useRef()];
  const [spinAt, setSpinAt] = useState(0);
  const angle = useRef(0);

  useEffect(() => {
    if (state.activityAction?.id !== 'carousel') return;
    setSpinAt(state.activityAction.at);
  }, [state.activityAction]);

  const horseColors = useMemo(() => ['#ff2bd6', '#45f0ff', '#f5c518', '#7cf29c'], []);

  useFrame((s, delta) => {
    const time = s.clock.elapsedTime;
    const since = spinAt ? (Date.now() - spinAt) / 1000 : 999;
    const spinning = since < SPIN_DURATION;
    const baseSpeed = 0.45;

    let speed = baseSpeed;
    if (spinning) {
      const k = 1 - since / SPIN_DURATION;
      speed = baseSpeed + 5 * k * k;
    }
    angle.current += speed * delta;
    if (disk.current) {
      disk.current.rotation.y = angle.current;
    }

    // Individual up/down bobbing so each horse rides its wave.
    for (let i = 0; i < horseRefs.length; i++) {
      const ref = horseRefs[i];
      if (!ref.current) continue;
      const phase = time * 3.0 + i * 1.4;
      // Small bob amplitude so heads stay well under the roof.
      ref.current.position.y = 0.02 + Math.sin(phase) * 0.06;
      ref.current.rotation.z = Math.cos(phase) * 0.06;
    }
  });

  const showCaption = spinAt && (Date.now() - spinAt) / 1000 < 3.0;

  return (
    <group>
      {/* Base pillar */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.35, 0.5, 0.5, 12]} />
        <meshStandardMaterial color="#1a0a2b" emissive={accent} emissiveIntensity={0.3} metalness={0.65} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.1, 12]} />
        <meshStandardMaterial color="#2a1444" emissive={color} emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Rotating disc with horses */}
      <group ref={disk} position={[0, 1.05, 0]}>
        {/* Circular platter */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.95, 24]} />
          <meshStandardMaterial color="#3a1032" emissive={color} emissiveIntensity={0.35} metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>

        {/* 4 horses arranged around the ring */}
        {horseColors.map((c, i) => {
          const a = (i / horseColors.length) * Math.PI * 2;
          const r = 0.72;
          const x = Math.cos(a) * r;
          const z = Math.sin(a) * r;
          // Horse faces "outward" tangentially so it looks like it's galloping around.
          const yaw = a + Math.PI / 2;
          return (
            <group key={i} position={[x, 0.02, z]} rotation={[0, yaw, 0]}>
              <group ref={horseRefs[i]} scale={0.65}>
                <Horse color={c} accent={accent} />
              </group>
              {/* Support pole going from platter up to roof */}
              <mesh position={[0, 0.55, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 1.05, 8]} />
                <meshStandardMaterial color="#f2e8c8" emissive={accent} emissiveIntensity={0.6} metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          );
        })}

        {/* Roof — raised so horses fit clearly underneath */}
        <mesh position={[0, 1.1, 0]}>
          <coneGeometry args={[1.05, 0.5, 16]} />
          <meshStandardMaterial color="#1a0a2b" emissive={accent} emissiveIntensity={0.55} metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Roof rim ring (carnival stripe look) */}
        <mesh position={[0, 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.05, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.85} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        {/* Roof drapes: 8 alternating panels around the rim */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.95, 0.82, Math.sin(a) * 0.95]} rotation={[0, -a + Math.PI / 2, 0]}>
              <planeGeometry args={[0.62, 0.16]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? color : accent}
                emissive={i % 2 === 0 ? color : accent}
                emissiveIntensity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
        {/* Tiny orb on top */}
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color={accent} />
        </mesh>
        {/* Flag pole + pennant */}
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
          <meshStandardMaterial color="#f2e8c8" emissive={accent} emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0.08, 1.72, 0]}>
          <planeGeometry args={[0.16, 0.1]} />
          <meshBasicMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {showCaption ? (
        <Html position={[0, 3.6, 0]} center distanceFactor={7} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              padding: '3px 10px',
              background: 'rgba(5,3,12,0.85)',
              border: `1px solid ${accent}`,
              color: '#f2e8c8',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 11,
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
              textShadow: `0 0 6px ${accent}`,
              userSelect: 'none',
            }}
          >
            {t.activities?.carousel?.caption ?? ''}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

/**
 * A tiny stylized horse: elongated body, four legs, angled neck, head, mane, tail.
 * The horse faces +X (tangent direction on the carousel).
 */
function Horse({ color = '#ff2bd6', accent = '#f5c518' }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.06, 0.24, 6, 12]} />
        <meshStandardMaterial color="#f2e8c8" emissive={color} emissiveIntensity={0.7} metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Legs (4 short cylinders) */}
      {[
        [ 0.10, 0.04,  0.05],
        [ 0.10, 0.04, -0.05],
        [-0.10, 0.04,  0.05],
        [-0.10, 0.04, -0.05],
      ].map((p, i) => (
        <mesh key={i} position={p}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
          <meshStandardMaterial color="#2b1a45" emissive={color} emissiveIntensity={0.4} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Neck (angled forward) */}
      <mesh position={[0.15, 0.24, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.035, 0.045, 0.16, 10]} />
        <meshStandardMaterial color="#f2e8c8" emissive={color} emissiveIntensity={0.65} metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Head */}
      <mesh position={[0.24, 0.32, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.11, 0.07, 0.07]} />
        <meshStandardMaterial color="#f2e8c8" emissive={color} emissiveIntensity={0.7} metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Ear */}
      <mesh position={[0.22, 0.37, 0]}>
        <coneGeometry args={[0.02, 0.05, 6]} />
        <meshStandardMaterial color="#2b1a45" emissive={color} emissiveIntensity={0.4} />
      </mesh>

      {/* Mane */}
      <mesh position={[0.15, 0.32, 0]} rotation={[0, 0, -Math.PI / 3.5]}>
        <boxGeometry args={[0.03, 0.15, 0.08]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.1} />
      </mesh>

      {/* Tail */}
      <mesh position={[-0.16, 0.22, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.03, 0.15, 0.06]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.0} />
      </mesh>

      {/* Eye */}
      <mesh position={[0.28, 0.33, 0.04]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#0a0612" />
      </mesh>
    </group>
  );
}
