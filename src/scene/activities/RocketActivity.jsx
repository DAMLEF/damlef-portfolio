/**
 * RocketActivity — Final unlockable activity.
 * Requires isMaxLevel (all stations + all other activities) to launch.
 * Sequence:
 *   1. Idle: rocket sits on the pad, slight bob, boosters cold.
 *   2. On trigger (if unlocked): 1s countdown, then the rocket lifts to
 *      the sky over ~2s with an exhaust plume of glowing points.
 *   3. At apex: three sequential fireworks bursts explode in different
 *      colors, then everything fades and the rocket resets.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../state/GameContext.jsx';

const COUNTDOWN = 1.2;
const LIFT = 2.2;
const APEX_Y = 14;
const FIREWORK_LIFE = 2.4;
const EXHAUST_COUNT = 90;
const FW_COUNT = 70;
const FW_BURSTS = 3;

export default function RocketActivity({ color = '#f5c518', accent = '#ff2bd6' }) {
  const { state, t, isMaxLevel } = useGame();
  const rocket = useRef();
  const exhaustPts = useRef();
  const fwPts = useRef([useRef(), useRef(), useRef()]);
  const [launchAt, setLaunchAt] = useState(0);

  // Per-particle state stored in refs so we don't rebuild buffers each frame.
  const exhaustState = useRef(null);
  const fwState = useRef(null);

  // Exhaust plume geometry
  const exhaustGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(EXHAUST_COUNT * 3), 3));
    g.setAttribute('color',    new THREE.BufferAttribute(new Float32Array(EXHAUST_COUNT * 3), 3));
    return g;
  }, []);
  const exhaustMat = useMemo(() =>
    new THREE.PointsMaterial({
      size: 0.28,
      transparent: true,
      opacity: 0,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    []
  );

  // Fireworks — 3 independent bursts
  const fwColors = useMemo(() => ['#f5c518', '#45f0ff', '#ff2bd6'], []);
  const fwGeoms = useMemo(() =>
    Array.from({ length: FW_BURSTS }, () => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(FW_COUNT * 3), 3));
      return g;
    }),
    []
  );
  const fwMats = useMemo(() =>
    fwColors.map((c) =>
      new THREE.PointsMaterial({
        color: c,
        size: 0.35,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    ),
    [fwColors]
  );

  // React to trigger
  useEffect(() => {
    if (state.activityAction?.id !== 'rocket') return;
    if (!isMaxLevel) return;
    setLaunchAt(state.activityAction.at);
    // Seed exhaust particles at pad
    exhaustState.current = Array.from({ length: EXHAUST_COUNT }, () => ({
      x: 0, y: 0, z: 0,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.5 - Math.random() * 1.2,
      vz: (Math.random() - 0.5) * 0.6,
      life: 1,
      born: Math.random() * 0.4,
    }));
    fwState.current = null;
  }, [state.activityAction, isMaxLevel]);

  useFrame((s, delta) => {
    const time = s.clock.elapsedTime;
    const t0 = launchAt ? (Date.now() - launchAt) / 1000 : 999;
    const launched = launchAt > 0;

    // Phase timing
    const inCountdown = launched && t0 < COUNTDOWN;
    const inLift = launched && t0 >= COUNTDOWN && t0 < COUNTDOWN + LIFT;
    const inFireworks = launched && t0 >= COUNTDOWN + LIFT && t0 < COUNTDOWN + LIFT + FIREWORK_LIFE + 0.6;

    // Rocket transform
    if (rocket.current) {
      if (inCountdown) {
        const shake = (COUNTDOWN - t0) < 0.5 ? Math.sin(time * 60) * 0.03 : 0;
        rocket.current.position.x = shake;
        rocket.current.position.y = 0.9 + Math.sin(time * 2) * 0.02;
      } else if (inLift) {
        const k = (t0 - COUNTDOWN) / LIFT; // 0 → 1
        const ease = k * k;
        rocket.current.position.x = 0;
        rocket.current.position.y = 0.9 + ease * APEX_Y;
      } else if (inFireworks || t0 > COUNTDOWN + LIFT + FIREWORK_LIFE + 0.6) {
        // Hide the rocket once it's exploded / after cool-down we snap it back.
        if (t0 > COUNTDOWN + LIFT + FIREWORK_LIFE + 0.5) {
          // reset
          if (launchAt !== 0) setLaunchAt(0);
          rocket.current.position.y = 0.9;
          rocket.current.position.x = 0;
        } else {
          rocket.current.position.y = 0.9 + APEX_Y;
        }
      } else {
        // Idle
        rocket.current.position.x = 0;
        rocket.current.position.y = 0.9 + Math.sin(time * 1.5) * 0.04;
      }
    }

    // Exhaust plume
    if (exhaustPts.current && exhaustState.current) {
      const visible = inCountdown || inLift;
      const pos = exhaustGeom.getAttribute('position');
      const col = exhaustGeom.getAttribute('color');
      const parr = pos.array;
      const carr = col.array;

      const originY = rocket.current ? rocket.current.position.y - 0.7 : 0;

      for (let i = 0; i < EXHAUST_COUNT; i++) {
        const p = exhaustState.current[i];
        if (visible) {
          p.x += p.vx * delta;
          p.y += p.vy * delta;
          p.z += p.vz * delta;
          p.life -= delta * 0.9;
          if (p.life <= 0) {
            // respawn near thruster
            p.x = (Math.random() - 0.5) * 0.15;
            p.y = 0;
            p.z = (Math.random() - 0.5) * 0.15;
            p.vx = (Math.random() - 0.5) * 0.8;
            p.vy = -1 - Math.random() * 1.6;
            p.vz = (Math.random() - 0.5) * 0.8;
            p.life = 0.6 + Math.random() * 0.5;
          }
        }
        parr[i * 3]     = p.x;
        parr[i * 3 + 1] = originY + p.y;
        parr[i * 3 + 2] = p.z;
        // Color: orange -> yellow -> red as life fades
        const l = Math.max(0, p.life);
        carr[i * 3]     = 1;
        carr[i * 3 + 1] = 0.4 + l * 0.5;
        carr[i * 3 + 2] = 0.1 * l;
      }
      pos.needsUpdate = true;
      col.needsUpdate = true;
      exhaustMat.opacity = visible ? 1 : Math.max(0, exhaustMat.opacity - delta * 2);
    }

    // Fireworks
    if (inFireworks) {
      // Seed on first frame
      if (!fwState.current) {
        const cx = rocket.current ? rocket.current.position.x : 0;
        const cy = 0.9 + APEX_Y;
        fwState.current = Array.from({ length: FW_BURSTS }, (_, b) => ({
          delay: b * 0.35,
          started: false,
          startAt: 0,
          cx: cx + (b - 1) * 1.2,
          cy: cy + (b % 2) * 0.6,
          parts: Array.from({ length: FW_COUNT }, () => {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const speed = 3 + Math.random() * 2;
            return {
              x: 0, y: 0, z: 0,
              vx: Math.sin(phi) * Math.cos(theta) * speed,
              vy: Math.cos(phi) * speed,
              vz: Math.sin(phi) * Math.sin(theta) * speed,
              life: 1,
            };
          }),
        }));
      }
      const localT = t0 - (COUNTDOWN + LIFT);
      for (let b = 0; b < FW_BURSTS; b++) {
        const burst = fwState.current[b];
        const geom = fwGeoms[b];
        const mat = fwMats[b];
        const pts = fwPts.current[b].current;
        if (!pts) continue;
        if (!burst.started && localT >= burst.delay) {
          burst.started = true;
          burst.startAt = localT;
        }
        if (burst.started) {
          const age = localT - burst.startAt;
          const attr = geom.getAttribute('position');
          const arr = attr.array;
          for (let i = 0; i < FW_COUNT; i++) {
            const p = burst.parts[i];
            p.x += p.vx * delta;
            p.y += p.vy * delta - 4 * delta * age; // gravity
            p.z += p.vz * delta;
            arr[i * 3]     = burst.cx + p.x;
            arr[i * 3 + 1] = burst.cy + p.y;
            arr[i * 3 + 2] = p.z;
          }
          attr.needsUpdate = true;
          const fade = Math.max(0, 1 - age / FIREWORK_LIFE);
          mat.opacity = fade;
          mat.size = 0.35 + 0.15 * (1 - fade);
        } else {
          mat.opacity = 0;
        }
      }
    } else {
      for (let b = 0; b < FW_BURSTS; b++) {
        fwMats[b].opacity = Math.max(0, fwMats[b].opacity - delta * 2);
      }
      if (!launched) fwState.current = null;
    }
  });

  const now = launchAt ? (Date.now() - launchAt) / 1000 : 999;
  const captionText = !isMaxLevel
    ? null
    : now < COUNTDOWN
      ? t.activities?.rocket?.launching ?? ''
      : now < COUNTDOWN + LIFT + FIREWORK_LIFE
        ? t.activities?.rocket?.launched ?? ''
        : null;

  return (
    <group>
      {/* Hex pad */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.9, 1.0, 0.3, 6]} />
        <meshStandardMaterial color="#0a0612" emissive={accent} emissiveIntensity={0.4} metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Pad glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.11, 0]}>
        <ringGeometry args={[0.55, 0.85, 32]} />
        <meshBasicMaterial color={isMaxLevel ? color : '#4a2a55'} transparent opacity={isMaxLevel ? 0.6 : 0.25} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Rocket body */}
      <group ref={rocket} position={[0, 0.9, 0]}>
        {/* Fuselage */}
        <mesh>
          <cylinderGeometry args={[0.22, 0.28, 1.3, 20]} />
          <meshStandardMaterial
            color="#f2e8c8"
            emissive={isMaxLevel ? accent : '#301033'}
            emissiveIntensity={isMaxLevel ? 0.6 : 0.15}
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>
        {/* Nose cone */}
        <mesh position={[0, 0.85, 0]}>
          <coneGeometry args={[0.22, 0.55, 20]} />
          <meshStandardMaterial
            color={isMaxLevel ? color : '#5a3a55'}
            emissive={isMaxLevel ? color : '#301033'}
            emissiveIntensity={isMaxLevel ? 0.9 : 0.2}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Porthole */}
        <mesh position={[0, 0.25, 0.23]}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color={isMaxLevel ? '#45f0ff' : '#204555'} />
        </mesh>
        {/* Fins */}
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.27, -0.55, Math.sin(a) * 0.27]} rotation={[0, -a, 0]}>
              <boxGeometry args={[0.05, 0.35, 0.28]} />
              <meshStandardMaterial
                color={isMaxLevel ? accent : '#402244'}
                emissive={isMaxLevel ? accent : '#301033'}
                emissiveIntensity={isMaxLevel ? 0.9 : 0.2}
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
          );
        })}
      </group>

      {/* Exhaust plume */}
      <points ref={exhaustPts} geometry={exhaustGeom} material={exhaustMat} />

      {/* Fireworks bursts */}
      {fwGeoms.map((g, i) => (
        <points key={i} ref={fwPts.current[i]} geometry={g} material={fwMats[i]} />
      ))}

      {/* Countdown / launch caption */}
      {captionText ? (
        <Html position={[0, 3.8, 0]} center distanceFactor={7} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              padding: '4px 12px',
              background: 'rgba(5,3,12,0.9)',
              border: `1px solid ${accent}`,
              color: '#f5c518',
              fontFamily: 'var(--font-display, "Rye", serif)',
              fontSize: 12,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textShadow: `0 0 6px ${accent}`,
              userSelect: 'none',
            }}
          >
            {captionText}
          </div>
        </Html>
      ) : null}
    </group>
  );
}
