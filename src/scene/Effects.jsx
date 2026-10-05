/**
 * Effects — Postprocessing (bloom + chromatic aberration + noise + vignette)
 * to sell the neon / CRT vibe on the WebGL side.
 * The CSS overlay adds a second, subtler CRT layer on top of everything.
 */

import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

export default function Effects() {
  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom
        intensity={0.75}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.65}
        mipmapBlur
      />
      <ChromaticAberration
        offset={new Vector2(0.0009, 0.0014)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.12} />
      <Vignette eskil={false} offset={0.2} darkness={0.75} />
    </EffectComposer>
  );
}
