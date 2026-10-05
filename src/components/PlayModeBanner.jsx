/**
 * PlayModeBanner — visible while the "play mode" (easter-egg) is ON.
 * Currently used by the Minecraft station: clicking on the ground near it
 * places colored voxels.
 */

import { useGame } from '../state/GameContext.jsx';

export default function PlayModeBanner() {
  const { t } = useGame();
  return <div className="play-mode">{t.playMode.banner}</div>;
}
