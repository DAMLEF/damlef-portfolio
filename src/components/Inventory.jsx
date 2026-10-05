/**
 * Inventory — bottom-left button + slide-out panel of collected items.
 * Clicking an item triggers an avatar animation (see Character.jsx).
 * Keyboard: `I` toggles the panel.
 */

import { useEffect, useState } from 'react';
import { useGame, playBeep, playConfirm } from '../state/GameContext.jsx';

/** Mapping itemId -> emoji glyph + avatar action trigger. */
const ITEM_META = {
  pickaxe: { glyph: '⛏', action: 'combat', beep: 220 },
  crystal: { glyph: '◈', action: 'cast',   beep: 880 },
  mask:    { glyph: '☾', action: 'cast',   beep: 660 },
  headset: { glyph: '◉', action: 'cast',   beep: 520 },
  token:   { glyph: '⌬', action: 'cast',   beep: 780 },
  dossier: { glyph: '▤', action: 'combat', beep: 440 },
};
const SLOTS = 6;

export default function Inventory() {
  const { state, t, triggerAvatarAction } = useGame();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'i' || e.key === 'I') {
        setOpen((v) => !v);
        playBeep(660, 0.05, 'square');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const items = state.inventory;
  const slots = Array.from({ length: SLOTS }, (_, i) => items[i] || null);

  const handleClick = (itemId) => {
    if (!itemId) return;
    const meta = ITEM_META[itemId];
    playBeep(meta?.beep ?? 500, 0.09, 'square');
    triggerAvatarAction(meta?.action ?? 'cast');
  };

  return (
    <div className="hud__corner hud__corner--bl">
      <div className="inventory">
        <button
          type="button"
          className="inventory__toggle"
          onClick={() => {
            setOpen((v) => !v);
            playConfirm();
          }}
          aria-label={t.inventory.title}
          aria-expanded={open}
        >
          <span aria-hidden="true">▤</span>
          {items.length > 0 && (
            <span className="inventory__badge">{items.length}</span>
          )}
        </button>

        {open && (
          <div className="inventory__panel" role="menu">
            {slots.map((itemId, idx) => {
              if (!itemId) {
                return (
                  <div
                    key={idx}
                    className="inventory__slot inventory__slot--empty"
                    aria-hidden="true"
                  >
                    <span style={{ opacity: 0.5 }}>·</span>
                  </div>
                );
              }
              const meta = ITEM_META[itemId];
              const label = t.inventory.items[itemId]?.name ?? itemId;
              return (
                <button
                  key={itemId}
                  type="button"
                  className="inventory__slot"
                  onClick={() => handleClick(itemId)}
                  aria-label={label}
                  title={label}
                >
                  <span aria-hidden="true">{meta?.glyph ?? '?'}</span>
                  <span className="inventory__tooltip">{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
