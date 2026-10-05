/**
 * =============================================================================
 *  PROJECTS DATA
 * =============================================================================
 *
 *  Metadata for every 3D station on the map — position, visuals, media, links.
 *  Language-neutral. All translatable text lives in /src/i18n/translations.js
 *  under `translations.<lang>.projects.<id>`.
 *
 *  To ADD / EDIT a project:
 *    1. Add or update the entry below.
 *    2. Add the matching `translations.fr.projects.<id>` and
 *                        `translations.en.projects.<id>` blocks.
 *    3. Drop a video into `/public/videos/<id>.mp4` (optional — a
 *       stylized placeholder appears if missing).
 *
 *  Positions:
 *    Coordinates are `[x, 0, z]` on the ground plane (y=0).
 *    Keep stations spread out so the avatar can weave between them.
 *
 * =============================================================================
 */

export const projects = [
  {
    id: 'about',
    kind: 'about',
    position: [0, 0, 6],
    color: '#f5c518',
    accent: '#45f0ff',
    video: '/videos/about.mp4', // optional
    poster: null,
    href: null,
    itemReward: 'dossier',
    actionKind: 'wave',
  },
  {
    id: 'minecraft',
    kind: 'minecraft',
    position: [-9, 0, 0],
    color: '#7cf29c',
    accent: '#a0ff5c',
    video: '/videos/minecraft.mp4',
    poster: null,
    href: 'https://github.com/DAMLEF',
    itemReward: 'pickaxe',
    actionKind: 'jump',
  },
  {
    id: 'utopex',
    kind: 'crystal',
    position: [9, 0, 0],
    color: '#ff2bd6',
    accent: '#45f0ff',
    video: '/videos/utopex.mp4',
    poster: null,
    href: 'https://github.com/DAMLEF',
    itemReward: 'crystal',
    actionKind: 'spin',
  },
  {
    id: 'facerehab',
    kind: 'face',
    position: [-6, 0, -8],
    color: '#45f0ff',
    accent: '#f5c518',
    video: '/videos/facerehab.mp4',
    poster: null,
    href: null,
    itemReward: 'mask',
    actionKind: 'bow',
  },
  {
    id: 'vrtower',
    kind: 'tower',
    position: [6, 0, -8],
    color: '#d2492b',
    accent: '#f5c518',
    video: '/videos/vrtower.mp4',
    poster: null,
    href: null,
    itemReward: 'headset',
    actionKind: 'salute',
  },
  {
    id: 'aiportal',
    kind: 'portal',
    position: [0, 0, -14],
    color: '#ff2bd6',
    accent: '#45f0ff',
    video: '/videos/aiportal.mp4',
    poster: null,
    href: 'https://github.com/DAMLEF',
    itemReward: 'token',
    actionKind: 'flash',
  },
];

/** Distance under which the avatar can "interact" with a station. */
export const INTERACT_RADIUS = 3.2;

/** Playfield bounds (used for camera clamping and physics). */
export const WORLD_BOUNDS = {
  minX: -18,
  maxX: 18,
  minZ: -20,
  maxZ: 12,
};
