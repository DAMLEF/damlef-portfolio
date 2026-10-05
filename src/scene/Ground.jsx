/**
 * Ground — Neon grid floor with a wide reflective plane below.
 * The grid uses drei's <Grid /> for consistent cyberpunk aesthetic.
 */

import { Grid } from '@react-three/drei';

export default function Ground() {
  return (
    <>
      {/* Solid dark plane below everything */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow={false}
      >
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial color="#0a0612" />
      </mesh>

      {/* Neon grid — subtle cyan primary, magenta secondary lines */}
      <Grid
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#1e3d55"
        sectionSize={4}
        sectionThickness={1.4}
        sectionColor="#45f0ff"
        fadeDistance={40}
        fadeStrength={1.2}
        infiniteGrid={false}
        followCamera={false}
        position={[0, 0, 0]}
      />

      {/* Distant magenta horizon glow */}
      <mesh position={[0, 5, -35]}>
        <planeGeometry args={[80, 12]} />
        <meshBasicMaterial
          color="#ff2bd6"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 2, -34.9]}>
        <planeGeometry args={[80, 4]} />
        <meshBasicMaterial
          color="#f5c518"
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
