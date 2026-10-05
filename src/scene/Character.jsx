/**
 * Character — Player-controlled avatar.
 *
 * Movement:
 *   ZQSD (FR) / WASD (EN) / Arrow keys move on the XZ plane. Smooth
 *   acceleration for a "gliding" futuristic feel. World bounds clamp the
 *   avatar to the play area. Movement is CAMERA-RELATIVE so "up" on the
 *   keyboard is always "up on screen".
 *
 * Visuals:
 *   - Chunky rounded body + small emissive head (readable low-poly silhouette).
 *   - Motion "boost" ring that pulses under the avatar when moving.
 *   - Grows in scale as the player levels up (visits new stations).
 *   - Particle burst above the head on level up.
 *
 * Interactions:
 *   - Publishes position to `avatarPositionRef` (used by CameraRig + HUD).
 *   - Publishes nearest station to `nearbyStationRef`.
 *   - Publishes nearest activity to `nearbyActivityRef`.
 *   - `E` opens the nearest station's project modal.
 *   - `R` triggers a station-themed animation (dance/jump/spin/etc.) with XP,
 *          OR triggers a nearby mini-activity (poker flip / dice roll / …).
 *   - `G` toggles Play Mode.
 *   - Reacts to inventory item clicks via `state.avatarAction`.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import {
  avatarPositionRef,
  nearbyStationRef,
  nearbyActivityRef,
  useGame,
} from '../state/GameContext.jsx';
import {
  INTERACT_RADIUS,
  WORLD_BOUNDS,
  projects,
} from '../data/projects.js';
import { ACTIVITY_INTERACT_RADIUS, activities } from '../data/activities.js';

// ---- Tuning -----------------------------------------------------------------
const MOVE_SPEED       = 8;    // units / s
const ACCEL            = 12;   // exp smoothing (higher = snappier)
const ROT_LERP         = 0.22; // rotation smoothing
const BASE_SCALE       = 1.0;
const LEVEL_SCALE_STEP = 0.03; // avatar grows per level (visit)

const PARTICLE_COUNT   = 120;  // ~ level-up burst
const PARTICLE_LIFE    = 2.2;  // seconds
const HALO_LIFE        = 1.4;  // seconds (expanding ring)

export default function Character() {
  const group     = useRef();
  const body      = useRef();
  const boostRing = useRef();
  const particles = useRef();
  const halo      = useRef();
  const particleState = useRef(null); // { velocities, life, burstAt }
  const haloState = useRef({ startedAt: 0 });

  const {
    state,
    level,
    visitStation,
    openProject,
    togglePlayMode,
    triggerActivity,
    clearAvatarAction,
  } = useGame();

  // language-aware keyboard mapping
  const keys = useKeys(state.language);

  // Latest state/level captured in a ref so useFrame can read them
  // without needing to be re-registered.
  const latest = useRef({ state, level });
  latest.current = { state, level };

  const modalOpen = state.introOpen || Boolean(state.activeProjectId);

  const velocity      = useRef(new THREE.Vector3());
  const targetRot     = useRef(0);
  const currentRot    = useRef(0);
  const actionUntil   = useRef(0);
  const stationPose   = useRef({ kind: null, until: 0, startedAt: 0 });
  const lastLevelUpAt = useRef(0);
  const { camera }    = useThree();

  // ---------------------------------------------------------------------------
  // Particle buffer (allocated once, reused on every level-up)
  // ---------------------------------------------------------------------------
  const particleGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const color = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < pos.length; i++) pos[i] = 9999;
    // Palette per particle: yellow / cyan / magenta / green
    const palette = [
      [0.96, 0.77, 0.10],
      [0.27, 0.94, 1.00],
      [1.00, 0.17, 0.84],
      [0.49, 0.95, 0.61],
    ];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const c = palette[i % palette.length];
      color[i * 3]     = c[0];
      color[i * 3 + 1] = c[1];
      color[i * 3 + 2] = c[2];
    }
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(color, 3));
    return geom;
  }, []);

  const particleMat = useMemo(() =>
    new THREE.PointsMaterial({
      size: 0.42,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    }),
    []
  );

  // Expanding halo ring at the moment of level-up
  const haloMat = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color: '#f5c518',
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    []
  );

  useEffect(() => {
    particleState.current = {
      velocities: Array.from({ length: PARTICLE_COUNT }, () => ({ x: 0, y: 0, z: 0 })),
      life: new Float32Array(PARTICLE_COUNT),
      burstAt: 0,
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Keyboard: E opens modal, R triggers playful action OR activity, G play mode
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      // Ignore when a modal is up so we don't hijack Escape / Enter etc.
      if (latest.current.state.introOpen || latest.current.state.activeProjectId) {
        return;
      }
      const k = e.key.toLowerCase();

      if (k === 'e') {
        const near = nearbyStationRef.current;
        if (near) {
          const p = projects.find((x) => x.id === near);
          openProject(near);
          visitStation(near, p?.itemReward);
        }
        return;
      }

      if (k === 'r') {
        // Prefer a mini-activity if we're standing on one.
        const nearActivity = nearbyActivityRef.current;
        if (nearActivity) {
          triggerActivity(nearActivity);
          triggerStationPose(stationPose, 'burst');
          return;
        }
        // Otherwise, do a themed dance near a station and gain XP.
        const nearStation = nearbyStationRef.current;
        if (nearStation) {
          const p = projects.find((x) => x.id === nearStation);
          triggerStationPose(stationPose, p?.actionKind ?? 'wave');
          visitStation(nearStation, p?.itemReward);
        }
        return;
      }

      if (k === 'g') togglePlayMode();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openProject, visitStation, togglePlayMode, triggerActivity]);

  // ---------------------------------------------------------------------------
  // Watch levelUpAt and trigger a particle burst
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!state.levelUpAt || state.levelUpAt === lastLevelUpAt.current) return;
    lastLevelUpAt.current = state.levelUpAt;
    burstParticles(particleState.current);
    if (particleMat) particleMat.opacity = 1;
    // trigger the halo ring pulse
    haloState.current.startedAt = performance.now();
  }, [state.levelUpAt, particleMat]);

  // ---------------------------------------------------------------------------
  // Frame loop
  // ---------------------------------------------------------------------------
  useFrame((_state, delta) => {
    if (!group.current) return;

    const nowMs = performance.now();
    const inStationPose = stationPose.current.kind && nowMs < stationPose.current.until;

    // --- Input (blocked while a modal is up OR during a locked pose) ---
    let dx = 0, dz = 0;
    const canMove = !modalOpen && !isLockedPose(stationPose.current, nowMs);
    if (canMove) {
      if (keys.current.up)    dz -= 1;
      if (keys.current.down)  dz += 1;
      if (keys.current.left)  dx -= 1;
      if (keys.current.right) dx += 1;
    }
    const inputLen = Math.hypot(dx, dz);
    if (inputLen > 0) { dx /= inputLen; dz /= inputLen; }

    // --- Camera-relative rotation so "up" on keys = "up on screen" ---
    const camAngle = Math.atan2(
      camera.position.x - group.current.position.x,
      camera.position.z - group.current.position.z,
    );
    const cos = Math.cos(camAngle), sin = Math.sin(camAngle);
    const relX = dx * cos - dz * sin;
    const relZ = dx * sin + dz * cos;

    // --- Smooth accel/decel ---
    const desiredVX = relX * MOVE_SPEED;
    const desiredVZ = relZ * MOVE_SPEED;
    const smooth = Math.min(1, delta * ACCEL);
    velocity.current.x += (desiredVX - velocity.current.x) * smooth;
    velocity.current.z += (desiredVZ - velocity.current.z) * smooth;

    // --- Apply movement ---
    group.current.position.x += velocity.current.x * delta;
    group.current.position.z += velocity.current.z * delta;

    // --- Clamp to world bounds ---
    group.current.position.x = clamp(group.current.position.x, WORLD_BOUNDS.minX, WORLD_BOUNDS.maxX);
    group.current.position.z = clamp(group.current.position.z, WORLD_BOUNDS.minZ, WORLD_BOUNDS.maxZ);

    // --- Face direction of motion ---
    const speedSq = velocity.current.x ** 2 + velocity.current.z ** 2;
    if (speedSq > 0.5) {
      targetRot.current = Math.atan2(velocity.current.x, velocity.current.z);
    }
    currentRot.current = lerpAngle(currentRot.current, targetRot.current, ROT_LERP);
    group.current.rotation.y = currentRot.current;

    // --- Bob/pose animation (baseline) ---
    const time = _state.clock.elapsedTime;
    const moving = speedSq > 1;
    if (body.current) {
      body.current.position.y = moving
        ? 0.9 + Math.sin(time * 12) * 0.08
        : 0.9 + Math.sin(time * 2) * 0.05;
      body.current.position.x = 0;
      body.current.rotation.z = moving ? Math.sin(time * 12) * 0.05 : 0;
      body.current.rotation.x = 0;
      body.current.scale.setScalar(1);
    }

    // --- Station-themed action pose (from R key) — overrides baseline ---
    if (body.current && inStationPose) {
      applyStationPose(body.current, stationPose.current, nowMs);
    } else if (stationPose.current.kind && !inStationPose) {
      // Pose finished — reset visor opacity in case flash left it dim
      resetFlashOpacity(body.current);
      stationPose.current.kind = null;
    }

    // --- Boost ring (motion feedback) ---
    if (boostRing.current) {
      const ringScale = moving ? 1.2 + Math.sin(time * 14) * 0.15 : 0.9;
      boostRing.current.scale.x = THREE.MathUtils.lerp(boostRing.current.scale.x, ringScale, 0.15);
      boostRing.current.scale.y = boostRing.current.scale.x;
      boostRing.current.material.opacity = THREE.MathUtils.lerp(
        boostRing.current.material.opacity,
        moving ? 0.9 : 0.4,
        0.1
      );
      boostRing.current.rotation.z += delta * (moving ? 3 : 0.5);
    }

    // --- Level growth ---
    const targetScale = BASE_SCALE + (latest.current.level - 1) * LEVEL_SCALE_STEP;
    group.current.scale.setScalar(
      THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.06)
    );

    // --- Publish position for UI + camera ---
    const p = group.current.position;
    avatarPositionRef.current = { x: p.x, y: p.y, z: p.z };

    // --- Find nearest station within interact radius ---
    let nearestStation = null;
    let nearestStationD = Infinity;
    for (const proj of projects) {
      const d = Math.hypot(proj.position[0] - p.x, proj.position[2] - p.z);
      if (d < INTERACT_RADIUS && d < nearestStationD) {
        nearestStationD = d;
        nearestStation = proj.id;
      }
    }
    nearbyStationRef.current = nearestStation;

    // --- Find nearest mini-activity ---
    let nearestActivity = null;
    let nearestActivityD = Infinity;
    for (const act of activities) {
      const d = Math.hypot(act.position[0] - p.x, act.position[2] - p.z);
      if (d < ACTIVITY_INTERACT_RADIUS && d < nearestActivityD) {
        nearestActivityD = d;
        nearestActivity = act.id;
      }
    }
    nearbyActivityRef.current = nearestActivity;

    // --- Inventory-triggered avatar actions ---
    const action = latest.current.state.avatarAction;
    if (action && actionUntil.current === 0) {
      actionUntil.current = performance.now() + 1200;
    }
    const inAction = performance.now() < actionUntil.current;
    if (!inAction && actionUntil.current !== 0) {
      actionUntil.current = 0;
      clearAvatarAction();
    }
    if (body.current && inAction) {
      if (action === 'combat') {
        body.current.rotation.y = (performance.now() * 0.02) % (Math.PI * 2);
      } else if (action === 'cast') {
        body.current.position.y += 0.4 * Math.sin(((performance.now() % 1200) / 1200) * Math.PI);
        body.current.rotation.z += 0.05;
      }
    }

    // --- Particle burst update ---
    updateParticles(particleGeom, particleMat, particleState.current, delta);
    updateHalo(halo.current, haloMat, haloState.current);
  });

  return (
    <group ref={group} position={[0, 0, 4]}>
      {/* --- Boost ring under the avatar --- */}
      <mesh
        ref={boostRing}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 0]}
      >
        <ringGeometry args={[0.55, 0.75, 32]} />
        <meshBasicMaterial
          color="#f5c518"
          transparent
          opacity={0.4}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* --- Body group --- */}
      <group ref={body}>
        <RoundedBox
          args={[0.85, 1.2, 0.65]}
          radius={0.14}
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color="#2b1a45"
            emissive="#ff2bd6"
            emissiveIntensity={0.55}
            metalness={0.55}
            roughness={0.35}
          />
        </RoundedBox>

        {/* Head */}
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.28, 20, 20]} />
          <meshStandardMaterial
            color="#0a0612"
            emissive="#45f0ff"
            emissiveIntensity={1.1}
            metalness={0.65}
            roughness={0.3}
          />
        </mesh>

        {/* Eye visor */}
        <mesh position={[0, 0.85, 0.22]}>
          <boxGeometry args={[0.35, 0.06, 0.02]} />
          <meshBasicMaterial color="#f5c518" />
        </mesh>

        {/* Chest emblem */}
        <mesh position={[0, 0, 0.34]}>
          <ringGeometry args={[0.08, 0.16, 24]} />
          <meshBasicMaterial color="#45f0ff" />
        </mesh>
      </group>

      {/* Personal soft light — makes the avatar pop against the ground */}
      <pointLight position={[0, 1.4, 0]} intensity={2.4} distance={5} color="#ff2bd6" />

      {/* Level-up particles — anchored at the character head */}
      <points ref={particles} geometry={particleGeom} material={particleMat} position={[0, 1.7, 0]} />

      {/* Level-up expanding halo (flat ring hovering over the ground) */}
      <mesh ref={halo} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} material={haloMat}>
        <ringGeometry args={[0.9, 1.05, 48]} />
      </mesh>
    </group>
  );
}

// =============================================================================
// Helpers
// =============================================================================
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/** Shortest-path angular lerp. */
function lerpAngle(from, to, t) {
  const TAU = Math.PI * 2;
  let d = ((to - from) % TAU + TAU) % TAU;
  if (d > Math.PI) d -= TAU;
  return from + d * t;
}

/** Language-aware key state as a mutable ref (no re-renders on keypress). */
function useKeys(language) {
  const keys = useRef({ up: false, down: false, left: false, right: false });
  useEffect(() => {
    // FR/AZERTY → ZQSD. EN/QWERTY → WASD. Arrow keys always work.
    const useAzerty = language === 'fr';
    const KEY_UP    = useAzerty ? 'z' : 'w';
    const KEY_DOWN  = 's';
    const KEY_LEFT  = useAzerty ? 'q' : 'a';
    const KEY_RIGHT = 'd';

    const handler = (val) => (e) => {
      const k = e.key.toLowerCase();
      if (k === KEY_UP || e.key === 'ArrowUp')             { keys.current.up = val; }
      else if (k === KEY_DOWN || e.key === 'ArrowDown')    { keys.current.down = val; }
      else if (k === KEY_LEFT || e.key === 'ArrowLeft')    { keys.current.left = val; }
      else if (k === KEY_RIGHT || e.key === 'ArrowRight')  { keys.current.right = val; }
      else return;
      if (val && e.key.startsWith('Arrow')) e.preventDefault();
    };
    const down = handler(true);
    const up = handler(false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [language]);
  return keys;
}

// -----------------------------------------------------------------------------
// Station-themed action poses (triggered by R)
// -----------------------------------------------------------------------------
const POSE_DURATION_MS = {
  jump: 700,
  spin: 900,
  bow: 900,
  wave: 900,
  salute: 800,
  flash: 700,
  burst: 700,
};

function triggerStationPose(ref, kind) {
  const now = performance.now();
  ref.current = {
    kind,
    startedAt: now,
    until: now + (POSE_DURATION_MS[kind] ?? 800),
  };
}

/** Certain poses (bow, wave, salute) lock movement for a moment — feels more theatrical. */
function isLockedPose(pose, nowMs) {
  if (!pose.kind) return false;
  if (nowMs >= pose.until) return false;
  return pose.kind === 'bow' || pose.kind === 'salute' || pose.kind === 'wave';
}

/** Apply the station-specific pose to the body group each frame. */
function applyStationPose(body, pose, nowMs) {
  const dur = POSE_DURATION_MS[pose.kind] ?? 800;
  const t = clamp01((nowMs - pose.startedAt) / dur);
  const s = Math.sin(t * Math.PI); // 0 → 1 → 0

  switch (pose.kind) {
    case 'jump':
      body.position.y = 0.9 + 1.1 * s;
      body.rotation.x = -0.15 * s;
      break;
    case 'spin':
      body.rotation.y += 0.5; // extra spin on top of movement facing
      body.position.y = 0.9 + 0.35 * s;
      break;
    case 'bow':
      body.rotation.x = 0.75 * s;
      body.position.y = 0.9 - 0.15 * s;
      break;
    case 'wave':
      body.rotation.z = 0.35 * Math.sin(t * Math.PI * 6);
      body.position.y = 0.9 + 0.12 * s;
      break;
    case 'salute':
      body.scale.setScalar(1 + 0.15 * s);
      body.rotation.z = -0.12 * s;
      break;
    case 'flash': {
      const blink = Math.floor(t * 10) % 2 === 0 ? 1 : 0.25;
      body.scale.setScalar(1 + 0.25 * s);
      body.rotation.y += 0.3;
      // fake "opacity" flicker on visible children
      if (body.children) {
        for (const c of body.children) {
          if (c.material && 'opacity' in c.material) {
            c.material.transparent = true;
            c.material.opacity = blink;
          }
        }
      }
      break;
    }
    case 'burst':
      body.position.y = 0.9 + 0.6 * s;
      body.rotation.z = 0.25 * Math.sin(t * Math.PI * 4);
      break;
    default:
      break;
  }
}

/** Reset flicker opacity back to 1 after a flash. */
function resetFlashOpacity(body) {
  if (!body?.children) return;
  for (const c of body.children) {
    if (c.material && 'opacity' in c.material) {
      c.material.opacity = 1;
    }
  }
}

function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

// -----------------------------------------------------------------------------
// Level-up particle system
// -----------------------------------------------------------------------------
function burstParticles(pstate) {
  if (!pstate) return;
  pstate.burstAt = performance.now();
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const speed = 2.5 + Math.random() * 4;
    pstate.velocities[i].x = Math.sin(phi) * Math.cos(theta) * speed;
    pstate.velocities[i].y = Math.abs(Math.cos(phi)) * speed + 2;
    pstate.velocities[i].z = Math.sin(phi) * Math.sin(theta) * speed;
    pstate.life[i] = PARTICLE_LIFE;
  }
}

function updateParticles(geom, mat, pstate, delta) {
  if (!pstate || !geom) return;
  const attr = geom.getAttribute('position');
  const pos = attr.array;
  let anyAlive = false;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    if (pstate.life[i] <= 0) {
      pos[i * 3]     = 9999;
      pos[i * 3 + 1] = 9999;
      pos[i * 3 + 2] = 9999;
      continue;
    }
    anyAlive = true;
    pstate.velocities[i].y -= 3 * delta;              // gravity
    pstate.velocities[i].x *= 1 - 0.5 * delta;        // horizontal damping
    pstate.velocities[i].z *= 1 - 0.5 * delta;

    pos[i * 3]     += pstate.velocities[i].x * delta;
    pos[i * 3 + 1] += pstate.velocities[i].y * delta;
    pos[i * 3 + 2] += pstate.velocities[i].z * delta;

    pstate.life[i] -= delta;
  }
  attr.needsUpdate = true;

  if (mat) {
    const age = (performance.now() - pstate.burstAt) / (PARTICLE_LIFE * 1000);
    const target = anyAlive ? Math.max(0, 1 - age * 0.9) : 0;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, target, 0.15);
    mat.size = 0.42 + 0.25 * (1 - clamp01(age));
  }
}

// -----------------------------------------------------------------------------
// Level-up halo (expanding flat ring under the avatar)
// -----------------------------------------------------------------------------
function updateHalo(mesh, mat, hstate) {
  if (!mesh || !mat) return;
  const age = hstate.startedAt ? (performance.now() - hstate.startedAt) / 1000 : 999;
  if (age > HALO_LIFE) {
    mat.opacity = 0;
    mesh.scale.setScalar(1);
    return;
  }
  const k = age / HALO_LIFE;         // 0 → 1
  mesh.scale.setScalar(1 + k * 4.5); // expand from 1x to ~5.5x
  mat.opacity = 0.9 * (1 - k);       // fade out
}
