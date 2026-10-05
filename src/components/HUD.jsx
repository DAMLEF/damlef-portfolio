/**
 * HUD — Diegetic top-corner readouts.
 *
 *   TL : System status, timestamp
 *   TR : Language switcher + level / stations
 *   BL : (reserved for Inventory component)
 *   BR : Coordinates + controls hint
 */

import { useEffect, useState } from 'react';
import { useGame, useAvatarPositionPoll } from '../state/GameContext.jsx';
import { LANGUAGES } from '../i18n/translations.js';

export default function HUD() {
  const { state, level, t, setLanguage } = useGame();
  const pos = useAvatarPositionPoll(4);
  const time = useClock();

  const moveLabel = t.controls?.labelMoveKeys ?? 'WASD';

  return (
    <div className="hud" aria-hidden="false">
      {/* ---- Top left : system readout ---- */}
      <div className="hud__corner hud__corner--tl">
        <div>
          <span className="hud__label">{t.hud.system}//</span>{' '}
          <span className="hud__value neon-cyan">{t.hud.online}</span>
        </div>
        <div>
          <span className="hud__label">T//</span>{' '}
          <span className="hud__value mono">{time}</span>
        </div>
      </div>

      {/* ---- Top right : language, level, stations ---- */}
      <div className="hud__corner hud__corner--tr">
        <div>
          <span className="hud__label">{t.hud.level}//</span>{' '}
          <span className="hud__value hud__value--accent mono">{String(level).padStart(2, '0')}</span>
        </div>
        <div>
          <span className="hud__label">{t.hud.stationsVisited}//</span>{' '}
          <span className="hud__value mono">
            {String(state.visited.length).padStart(2, '0')} / 06
          </span>
        </div>
        <div className="hud__lang" role="group" aria-label={t.hud.language}>
          {LANGUAGES.map((lg) => (
            <button
              key={lg}
              type="button"
              onClick={() => setLanguage(lg)}
              className={state.language === lg ? 'is-active' : ''}
              aria-pressed={state.language === lg}
            >
              {lg.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Bottom right : coords + hints ---- */}
      <div className="hud__corner hud__corner--br">
        <div>
          <span className="hud__label">{t.hud.coords}//</span>{' '}
          <span className="hud__value mono">
            X {fmt(pos.x)} · Z {fmt(pos.z)}
          </span>
        </div>
        <div className="hud__hint">
          <kbd>{moveLabel}</kbd> {t.hud.hintMove} ·{' '}
          <kbd>E</kbd> {t.hud.hintOpen} ·{' '}
          <kbd>R</kbd> {t.hud.hintInteract} ·{' '}
          <kbd>G</kbd> {t.hud.hintPlay}
        </div>
      </div>
    </div>
  );
}

function fmt(n) {
  const s = n.toFixed(1);
  return s.padStart(6, ' ');
}

function useClock() {
  const [now, setNow] = useState(() => stamp());
  useEffect(() => {
    const iv = setInterval(() => setNow(stamp()), 1000);
    return () => clearInterval(iv);
  }, []);
  return now;
}

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
