/**
 * PlayModeGround — Invisible ground plane that captures pointer events
 * ONLY when Play Mode is active. Clicking spawns a small Minecraft-style
 * voxel at the click location.
 *
 * This is the "easter egg" mini-game the user asked for. It works globally
 * on the play area but is themed after the Minecraft station.
 */

import { useState } from 'react';
import { useGame, playBeep } from '../state/GameContext.jsx';

const COLORS = ['#7cf29c', '#f5c518', '#ff2bd6', '#45f0ff', '#d2492b'];

export default function PlayModeGround() {
  const { state } = useGame();
  const [blocks, setBlocks] = useState([]);

  if (!state.playMode) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    const p = e.point;
    if (!p) return;
    // Snap to unit grid
    const gx = Math.round(p.x);
    const gz = Math.round(p.z);
    // Prevent placing at exact same tile twice → stack them
    const stack = blocks.filter((b) => b.x === gx && b.z === gz).length;
    playBeep(220 + stack * 40, 0.06, 'square');
    setBlocks((cur) => [
      ...cur,
      {
        id: Date.now() + Math.random(),
        x: gx,
        y: 0.5 + stack,
        z: gz,
        color: COLORS[cur.length % COLORS.length],
      },
    ]);
  };

  return (
    <>
      {/* Invisible click catcher */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
        onClick={handleClick}
      >
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {blocks.map((b) => (
        <mesh key={b.id} position={[b.x, b.y, b.z]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={b.color}
            emissive={b.color}
            emissiveIntensity={0.5}
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>
      ))}
    </>
  );
}
