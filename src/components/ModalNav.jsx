/**
 * ModalNav — Left/right arrows to browse from one station's dossier to the
 * next without having to move the avatar. Also visits the station being
 * navigated to (same effect as walking up to it and pressing E) so recruiters
 * can review every project without needing to play the game.
 */

import { useEffect } from 'react';
import { useGame, playConfirm } from '../state/GameContext.jsx';
import { projects as projectsData } from '../data/projects.js';

// Fixed reading order: About first, then the projects.
const ORDER = ['about', 'minecraft', 'utopex', 'facerehab', 'vrtower', 'aiportal'];

export default function ModalNav({ currentId }) {
  const { t, openProject, visitStation } = useGame();

  const idx = ORDER.indexOf(currentId);
  const prevId = idx <= 0 ? ORDER[ORDER.length - 1] : ORDER[idx - 1];
  const nextId = idx >= ORDER.length - 1 ? ORDER[0] : ORDER[idx + 1];

  const nameOf = (id) => t.projects?.[id]?.name ?? (id === 'about' ? t.about?.title ?? 'About' : id);

  const go = (id) => {
    playConfirm();
    visitStation(id);
    openProject(id);
  };

  // Left/Right arrow keys mirror the buttons.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(prevId); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(nextId); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevId, nextId]);

  // Confine the count text so recruiters know the length of the tour.
  const pos = `${String(idx + 1).padStart(2, '0')} / ${String(ORDER.length).padStart(2, '0')}`;

  const projectAccent = (id) => {
    const p = projectsData.find((pp) => pp.id === id);
    return p?.accent ?? '#45f0ff';
  };

  return (
    <div className="modal-nav" role="group" aria-label={`${t.ui?.prev} / ${t.ui?.next}`}>
      <button
        type="button"
        className="modal-nav__btn"
        onClick={() => go(prevId)}
        aria-label={`${t.ui?.prev ?? 'Previous'} — ${nameOf(prevId)}`}
        style={{ '--accent': projectAccent(prevId) }}
      >
        <span className="modal-nav__arrow" aria-hidden="true">◂</span>
        <span className="modal-nav__label">{nameOf(prevId)}</span>
      </button>
      <span className="modal-nav__count mono">{pos}</span>
      <button
        type="button"
        className="modal-nav__btn modal-nav__btn--right"
        onClick={() => go(nextId)}
        aria-label={`${t.ui?.next ?? 'Next'} — ${nameOf(nextId)}`}
        style={{ '--accent': projectAccent(nextId) }}
      >
        <span className="modal-nav__label">{nameOf(nextId)}</span>
        <span className="modal-nav__arrow" aria-hidden="true">▸</span>
      </button>
    </div>
  );
}
