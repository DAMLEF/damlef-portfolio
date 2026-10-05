/**
 * InteractPrompt — Contextual controls prompt shown when the avatar stands
 * near a station or a mini-activity.
 *
 * - Near a STATION:  shows [E] open + [R] dance
 * - Near an ACTIVITY: shows [R] <activity hint>
 *
 * Reads state from `nearbyStationRef` / `nearbyActivityRef` via polling hooks.
 */

import {
  useGame,
  useNearbyStationPoll,
  useNearbyActivityPoll,
} from '../state/GameContext.jsx';

export default function InteractPrompt() {
  const { t, state } = useGame();
  const nearStation = useNearbyStationPoll(8);
  const nearActivity = useNearbyActivityPoll(8);

  // Hide when a modal or the intro is open.
  if (state.introOpen || state.activeProjectId) return null;

  // Activity takes priority (usually you approach one or the other).
  if (nearActivity) {
    const act = t.activities?.[nearActivity];
    const label = act?.name ?? nearActivity;
    const hint = act?.hint ?? t.interact.toInteract;
    return (
      <div className="interact-prompt">
        <kbd>R</kbd>
        <span className="tracked-tight">
          {t.interact.prompt} <strong>R</strong> {t.interact.toPlay}
        </span>
        <span
          style={{
            marginLeft: 12,
            color: 'var(--pulp-yellow)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.06em',
          }}
        >
          · {label} — {hint}
        </span>
      </div>
    );
  }

  if (nearStation) {
    const proj = t.projects[nearStation];
    const label = proj?.name ?? nearStation;
    return (
      <div className="interact-prompt">
        <kbd>E</kbd>
        <span className="tracked-tight">
          {t.interact.prompt} <strong>E</strong> {t.interact.toOpen}
        </span>
        <span
          style={{
            marginLeft: 12,
            color: 'var(--pulp-yellow)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.06em',
          }}
        >
          · {label}
        </span>
      </div>
    );
  }

  return null;
}
