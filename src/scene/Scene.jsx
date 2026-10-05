/**
 * =============================================================================
 *  Scene — Root R3F canvas
 * =============================================================================
 *
 *  Composes:
 *    - Ground: neon grid floor + soft glow
 *    - Neons:  ambient particles + far background lights
 *    - Stations: one 3D element per project (see /scene/stations)
 *    - Character: the player-controlled avatar (WASD/arrows)
 *    - Effects: bloom + chromatic aberration + subtle noise
 *
 *  A smart camera rig follows the avatar smoothly with a slight tilt on
 *  movement, giving the "impression of movement" the user asked for.
 * =============================================================================
 */

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Ground from './Ground.jsx';
import Neons from './Neons.jsx';
import Character from './Character.jsx';
import CameraRig from './CameraRig.jsx';
import Effects from './Effects.jsx';
import Stations from './Stations.jsx';
import Activities from './Activities.jsx';
import PlayModeGround from './PlayModeGround.jsx';

export default function Scene() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
      }}
    >
      <Canvas
        shadows={false}
        dpr={[1, 2]}
        camera={{ position: [0, 14, 14], fov: 48, near: 0.1, far: 120 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#05030c');
        }}
      >
        {/* --- Atmosphere --- */}
        <color attach="background" args={['#05030c']} />
        <fog attach="fog" args={['#05030c', 22, 55]} />

        {/* --- Lighting: cyberpunk key/fill --- */}
        <ambientLight intensity={0.15} color="#8f7bd6" />
        <directionalLight
          position={[10, 18, 6]}
          intensity={0.35}
          color="#ffd07a"
        />
        <pointLight position={[-14, 5, -8]} intensity={20} distance={25} color="#ff2bd6" />
        <pointLight position={[14, 5, -8]}  intensity={20} distance={25} color="#45f0ff" />

        <Suspense fallback={null}>
          <Ground />
          <Neons />
          <PlayModeGround />
          <Stations />
          <Activities />
          <Character />
        </Suspense>

        <CameraRig />
        <Effects />
      </Canvas>
    </div>
  );
}
