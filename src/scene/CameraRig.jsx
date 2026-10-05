/**
 * CameraRig — Smooth camera that follows the avatar.
 *
 * Behavior:
 *   - Interpolates position toward a target relative to the avatar.
 *   - Adds a small "look ahead" & tilt based on avatar velocity — gives
 *     the sense of speed the user asked for without being disorienting.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { avatarPositionRef } from '../state/GameContext.jsx';

// Camera offset (from avatar) — 3/4 top-down perspective.
const OFFSET = new THREE.Vector3(0, 11, 12);
const LERP = 0.075;

export default function CameraRig() {
  const lastPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame((state) => {
    const p = avatarPositionRef.current;
    const av = new THREE.Vector3(p.x, p.y, p.z);

    // Velocity for tilt
    const vel = av.clone().sub(lastPos.current);
    lastPos.current.copy(av);

    // Desired camera position
    const desired = av.clone().add(OFFSET);
    desired.x += vel.x * 6; // slight lag ahead of the avatar
    desired.z += vel.z * 4;

    state.camera.position.lerp(desired, LERP);

    // Look slightly ahead
    const look = new THREE.Vector3(av.x + vel.x * 10, 1.4, av.z + vel.z * 8);
    targetLook.current.lerp(look, LERP * 1.4);
    state.camera.lookAt(targetLook.current);
  });

  return null;
}
