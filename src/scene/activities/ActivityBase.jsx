/**
 * ActivityBase — Shared shell for mini side activities.
 *
 * Similar in spirit to StationBase but:
 *   - No modal on click, no XP.
 *   - Smaller pedestal.
 *   - HTML nameplate is smaller and more discreet (side attraction vibe).
 *   - Left-click also triggers the activity (mouse-friendly).
 *
 * The child component is responsible for reading `state.activityAction`
 * from the game context and reacting when its id matches `activity.id`.
 */

import { useRef } from 'react';
import { Billboard, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  nearbyActivityRef,
  useGame,
  playConfirm,
  playCancel,
} from '../../state/GameContext.jsx';

export default function ActivityBase({ activity, children }) {
  const { t, triggerActivity, isMaxLevel } = useGame();
  const group = useRef();
  const ring  = useRef();

  const [x, y, z] = activity.position;
  const label = t.activities?.[activity.id]?.name ?? activity.id;
  const lockedHint = t.activities?.[activity.id]?.lockedHint ?? '';
  const lockedTag = t.activities?.[activity.id]?.locked ?? 'LOCKED';

  const isLocked = Boolean(activity.lockedUntilMax) && !isMaxLevel;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (!group.current) return;
    // Gentle float
    group.current.position.y = y + Math.sin(time * 1.6 + x * 0.3) * 0.03;

    // Highlight pulse when nearby (only when unlocked)
    const isNear = nearbyActivityRef.current === activity.id;
    if (ring.current) {
      const target = isNear && !isLocked ? 1.5 : 1.0;
      ring.current.scale.x = THREE.MathUtils.lerp(ring.current.scale.x, target, 0.12);
      ring.current.scale.y = ring.current.scale.x;
      const opacity = isLocked ? 0.15 : (isNear ? 0.75 : 0.32);
      ring.current.material.opacity = THREE.MathUtils.lerp(
        ring.current.material.opacity, opacity, 0.12
      );
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (isLocked) {
      playCancel();
      return;
    }
    playConfirm();
    triggerActivity(activity.id);
  };

  return (
    <group ref={group} position={[x, y, z]}>
      {/* Pedestal ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} ref={ring}>
        <ringGeometry args={[0.7, 0.95, 32]} />
        <meshBasicMaterial
          color={isLocked ? '#333' : activity.color}
          transparent
          opacity={0.32}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[0.95, 1.15, 32]} />
        <meshBasicMaterial
          color={isLocked ? '#222' : activity.accent}
          transparent
          opacity={isLocked ? 0.08 : 0.15}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Click hitbox */}
      <mesh
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = isLocked ? 'not-allowed' : 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
        position={[0, 0.9, 0]}
      >
        <cylinderGeometry args={[1.0, 1.0, 2.2, 16, 1, true]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Activity-specific visual (hidden when locked; a placeholder is shown instead) */}
      <group position={[0, 0.5, 0]} visible={!isLocked}>{children}</group>

      {/* Placeholder shown while locked so the spot isn't empty */}
      {isLocked ? (
        <group position={[0, 0.9, 0]}>
          <mesh>
            <icosahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial
              color="#0a0612"
              emissive="#301033"
              emissiveIntensity={0.4}
              metalness={0.7}
              roughness={0.4}
              wireframe
            />
          </mesh>
        </group>
      ) : null}

      {/* Discreet nameplate */}
      <Billboard position={[0, 3.0, 0]}>
        <Html
          center
          distanceFactor={12}
          zIndexRange={[0, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              padding: '3px 10px',
              background: 'rgba(5,3,12,0.7)',
              border: `1px dashed ${isLocked ? '#666' : activity.accent}`,
              color: isLocked ? '#8a8296' : '#f2e8c8',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textShadow: isLocked ? 'none' : `0 0 6px ${activity.accent}`,
              userSelect: 'none',
              opacity: isLocked ? 0.7 : 0.85,
            }}
          >
            {isLocked ? `${label} · ${lockedTag}` : label}
          </div>
        </Html>
      </Billboard>

      {/* Locked hint below the nameplate */}
      {isLocked ? (
        <Billboard position={[0, 2.45, 0]}>
          <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div
              style={{
                padding: '2px 8px',
                background: 'rgba(5,3,12,0.6)',
                color: '#8a8296',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 9,
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {lockedHint}
            </div>
          </Html>
        </Billboard>
      ) : null}

      {/* Soft accent light */}
      <pointLight
        position={[0, 1.4, 0]}
        intensity={isLocked ? 0.4 : 1.8}
        distance={4}
        color={isLocked ? '#301033' : activity.accent}
      />
    </group>
  );
}
