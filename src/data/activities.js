/**
 * =============================================================================
 *  MINI-ACTIVITIES DATA
 * =============================================================================
 *
 *  Hidden side attractions scattered on the outer edges of the map.
 *  They are NOT projects — they don't grant XP, don't open a modal.
 *  They exist to reward exploration with a small dose of "wow" + FX.
 *
 *  Interaction:
 *    - Approach one, the HUD prompt shows "R // <activity name>".
 *    - Press R to trigger the activity's built-in animation (flip a chip,
 *      roll dice, spin a carousel, order fake food from a hologram).
 *
 *  Positions are along the perimeter so they don't clutter the central
 *  station play area.
 * =============================================================================
 */

export const ACTIVITY_INTERACT_RADIUS = 2.6;

export const activities = [
  {
    id: 'poker',
    kind: 'poker',
    position: [-14, 0, 6],
    color: '#f5c518',
    accent: '#ff2bd6',
  },
  {
    id: 'dice',
    kind: 'dice',
    position: [14, 0, 6],
    color: '#45f0ff',
    accent: '#f5c518',
  },
  {
    id: 'carousel',
    kind: 'carousel',
    position: [-14, 0, -14],
    color: '#ff2bd6',
    accent: '#f5c518',
  },
  {
    id: 'hologram',
    kind: 'hologram',
    position: [14, 0, -14],
    color: '#45f0ff',
    accent: '#7cf29c',
  },
  {
    /* Locked until player has visited every station AND every other activity.
       Launching triggers a fireworks show above the map. */
    id: 'rocket',
    kind: 'rocket',
    position: [0, 0, 10],
    color: '#ff2bd6',
    accent: '#f5c518',
    lockedUntilMax: true,
  },
];
