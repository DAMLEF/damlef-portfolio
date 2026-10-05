/**
 * StationBase — Shared shell for every project station.
 *
 * Responsibilities:
 *   - Positioning on the ground (from projects.js)
 *   - Neon pedestal ring under the visual
 *   - Hover pulse when the avatar is nearby
 *   - Click-to-open modal (mouse users)
 *   - A floating billboarded nameplate showing the project title.
 *
 * The actual "personality" of a station (its 3D icon and its animations)
 * lives in the child component passed via props (see /scene/stations/*).
 */

import { useMemo, useRef } from 'react';
import { Billboard, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  nearbyStationRef,
  useGame,
  playConfirm,
} from '../../state/GameContext.jsx';

export default function StationBase({ project, children }) {
  const { openProject, visitStation, t } = useGame();
  const group = useRef();
  const ring = useRef();
  const nearRef = useRef(false);

  const [x, y, z] = project.position;
  const label = t.projects[project.id]?.name ?? project.id;

  const color = useMemo(() => new THREE.Color(project.color), [project.color]);
  const accent = useMemo(() => new THREE.Color(project.accent), [project.accent]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    // Float
    group.current.position.y = 0 + Math.sin(t * 1.4 + x * 0.3) * 0.05;

    // Highlight pulse when nearby
    const isNear = nearbyStationRef.current === project.id;
    nearRef.current = isNear;
    if (ring.current) {
      const target = isNear ? 1.9 : 1.0;
      ring.current.scale.x = THREE.MathUtils.lerp(ring.current.scale.x, target, 0.12);
      ring.current.scale.y = ring.current.scale.x;
      const opacity = isNear ? 0.9 : 0.45;
      ring.current.material.opacity = THREE.MathUtils.lerp(
        ring.current.material.opacity, opacity, 0.12
      );
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    playConfirm();
    openProject(project.id);
    visitStation(project.id, project.itemReward);
  };

  return (
    <group ref={group} position={[x, y, z]}>
      {/* ---- Base neon pedestal ---- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} ref={ring}>
        <ringGeometry args={[0.9, 1.2, 40]} />
        <meshBasicMaterial
          color={project.color}
          transparent
          opacity={0.45}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[1.2, 1.5, 40]} />
        <meshBasicMaterial
          color={project.accent}
          transparent
          opacity={0.2}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ---- Invisible click hitbox ---- */}
      <mesh
        onClick={handleClick}
        onPointerOver={(e) => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
        position={[0, 1.2, 0]}
      >
        <cylinderGeometry args={[1.4, 1.4, 3, 20, 1, true]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* ---- Project-specific visual ---- */}
      <group position={[0, 0.6, 0]}>{children}</group>

      {/* ---- Billboarded nameplate (HTML — no font-loading, instant) ---- */}
      <Billboard position={[0, 3.1, 0]}>
        <Html
          center
          distanceFactor={10}
          zIndexRange={[0, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              padding: '4px 12px',
              background: 'rgba(5,3,12,0.85)',
              border: `1px solid ${project.accent}`,
              color: '#f2e8c8',
              fontFamily: 'var(--font-display, "Rye", serif)',
              fontSize: '14px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textShadow: `0 0 8px ${project.accent}`,
              userSelect: 'none',
            }}
          >
            {label}
          </div>
        </Html>
      </Billboard>

      {/* Soft light so the visual pops */}
      <pointLight position={[0, 2, 0]} intensity={3} distance={5} color={project.accent} />
    </group>
  );
}
