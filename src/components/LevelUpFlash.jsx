/**
 * LevelUpFlash — transient overlay shown right after `visitStation`.
 * Watches the `levelUpAt` timestamp; renders for 1.6s then unmounts.
 */

import { useEffect, useState } from 'react';
import { useGame, playConfirm } from '../state/GameContext.jsx';

export default function LevelUpFlash() {
  const { state, level, t } = useGame();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!state.levelUpAt) return;
    setVisible(true);
    playConfirm();
    const to = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(to);
  }, [state.levelUpAt]);

  if (!visible) return null;

  return (
    <div className="level-up" aria-live="polite">
      {t.hud.levelUp} · {String(level).padStart(2, '0')}
    </div>
  );
}
