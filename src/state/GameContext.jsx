/**
 * =============================================================================
 *  GAME CONTEXT
 * =============================================================================
 *
 *  Central React store for discrete state:
 *    - current language
 *    - player level & visited stations
 *    - inventory
 *    - which modal is open (intro / project / about / null)
 *    - "play mode" toggle (easter-egg)
 *    - transient events (level-up flash, item-found flash)
 *
 *  Note: real-time state (avatar position, velocity, camera) does NOT live
 *  here — it lives in refs inside R3F components to avoid re-renders every
 *  frame. Only "discrete" state that the UI reacts to is stored here.
 *
 * =============================================================================
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { DEFAULT_LANGUAGE, LANGUAGES, translations } from '../i18n/translations.js';

// ------------------------------------------------------------------
// Persistence keys
// ------------------------------------------------------------------
const LS_LANG = 'dl.portfolio.lang';
const LS_INVENTORY = 'dl.portfolio.inv';
const LS_VISITED = 'dl.portfolio.visited';
const LS_ACTIVITIES = 'dl.portfolio.activities';
const LS_MUSIC_MUTED = 'dl.portfolio.musicMuted';

// ------------------------------------------------------------------
// Reducer
// ------------------------------------------------------------------
const initialState = {
  language: DEFAULT_LANGUAGE,
  introOpen: true,
  activeProjectId: null, // string | null
  playMode: false,       // easter-egg mode
  visited: [],           // stationIds visited (unique)
  inventory: [],         // itemIds owned (unique)
  activitiesInteracted: [], // activityIds that have been triggered at least once
  levelUpAt: 0,          // timestamp; used to trigger UI flash + FX
  levelUpLevel: 1,       // level captured at last level up
  itemFoundAt: 0,        // timestamp; used to trigger UI flash
  itemFoundId: null,     // last item id acquired
  avatarAction: null,    // 'combat' | 'drink' | 'eat' | 'cast' | station kind | null
  avatarActionAt: 0,
  activityAction: null,  // { id, at } — set when player interacts with a mini activity
  musicMuted: false,     // user preference — audio playback muted?
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LANGUAGE':
      if (!LANGUAGES.includes(action.value)) return state;
      return { ...state, language: action.value };

    case 'CLOSE_INTRO':
      return { ...state, introOpen: false };

    case 'OPEN_INTRO':
      return { ...state, introOpen: true };

    case 'OPEN_PROJECT':
      return { ...state, activeProjectId: action.id };

    case 'CLOSE_PROJECT':
      return { ...state, activeProjectId: null };

    case 'TOGGLE_PLAY_MODE':
      return { ...state, playMode: !state.playMode };

    case 'VISIT_STATION': {
      if (state.visited.includes(action.id)) return state;
      const nextVisited = [...state.visited, action.id];
      return {
        ...state,
        visited: nextVisited,
        levelUpAt: Date.now(),
        levelUpLevel: nextVisited.length + 1,
      };
    }

    case 'PICKUP_ITEM': {
      if (!action.itemId || state.inventory.includes(action.itemId)) return state;
      return {
        ...state,
        inventory: [...state.inventory, action.itemId],
        itemFoundId: action.itemId,
        itemFoundAt: Date.now(),
      };
    }

    case 'TRIGGER_AVATAR_ACTION':
      return {
        ...state,
        avatarAction: action.action,
        avatarActionAt: Date.now(),
      };

    case 'CLEAR_AVATAR_ACTION':
      return { ...state, avatarAction: null };

    case 'TRIGGER_ACTIVITY': {
      const already = state.activitiesInteracted.includes(action.id);
      return {
        ...state,
        activityAction: { id: action.id, at: Date.now() },
        activitiesInteracted: already
          ? state.activitiesInteracted
          : [...state.activitiesInteracted, action.id],
      };
    }

    case 'SET_MUSIC_MUTED':
      return { ...state, musicMuted: Boolean(action.value) };

    case 'HYDRATE':
      return { ...state, ...action.patch };

    default:
      return state;
  }
}

// ------------------------------------------------------------------
// Context
// ------------------------------------------------------------------
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Restore persisted parts on first mount.
  useEffect(() => {
    try {
      const patch = {};
      const lang = localStorage.getItem(LS_LANG);
      if (lang && LANGUAGES.includes(lang)) patch.language = lang;
      const inv = JSON.parse(localStorage.getItem(LS_INVENTORY) || 'null');
      if (Array.isArray(inv)) patch.inventory = inv;
      const vis = JSON.parse(localStorage.getItem(LS_VISITED) || 'null');
      if (Array.isArray(vis)) patch.visited = vis;
      const acts = JSON.parse(localStorage.getItem(LS_ACTIVITIES) || 'null');
      if (Array.isArray(acts)) patch.activitiesInteracted = acts;
      const muted = localStorage.getItem(LS_MUSIC_MUTED);
      if (muted !== null) patch.musicMuted = muted === '1';
      if (Object.keys(patch).length) dispatch({ type: 'HYDRATE', patch });
    } catch {
      /* localStorage may be disabled — silently continue */
    }
  }, []);

  // Persist mutations
  useEffect(() => {
    try { localStorage.setItem(LS_LANG, state.language); } catch {}
  }, [state.language]);
  useEffect(() => {
    try { localStorage.setItem(LS_INVENTORY, JSON.stringify(state.inventory)); } catch {}
  }, [state.inventory]);
  useEffect(() => {
    try { localStorage.setItem(LS_VISITED, JSON.stringify(state.visited)); } catch {}
  }, [state.visited]);
  useEffect(() => {
    try { localStorage.setItem(LS_ACTIVITIES, JSON.stringify(state.activitiesInteracted)); } catch {}
  }, [state.activitiesInteracted]);
  useEffect(() => {
    try { localStorage.setItem(LS_MUSIC_MUTED, state.musicMuted ? '1' : '0'); } catch {}
  }, [state.musicMuted]);

  // ------- convenience API -------
  const t = useMemo(() => translations[state.language], [state.language]);
  const level = state.visited.length + 1;
  // "Max level" = all 6 stations visited AND all 4 side activities interacted
  // with. The rocket itself is a 5th activity and is NOT counted here.
  const REQUIRED_ACTIVITIES = ['poker', 'dice', 'carousel', 'hologram'];
  const isMaxLevel =
    state.visited.length >= 6 &&
    REQUIRED_ACTIVITIES.every((id) => state.activitiesInteracted.includes(id));

  const api = useMemo(
    () => ({
      // language
      setLanguage: (v) => dispatch({ type: 'SET_LANGUAGE', value: v }),

      // intro
      closeIntro: () => dispatch({ type: 'CLOSE_INTRO' }),
      openIntro: () => dispatch({ type: 'OPEN_INTRO' }),

      // modals
      openProject: (id) => dispatch({ type: 'OPEN_PROJECT', id }),
      closeProject: () => dispatch({ type: 'CLOSE_PROJECT' }),

      // play mode
      togglePlayMode: () => dispatch({ type: 'TOGGLE_PLAY_MODE' }),

      // interactions
      visitStation: (id, itemId) => {
        dispatch({ type: 'VISIT_STATION', id });
        if (itemId) dispatch({ type: 'PICKUP_ITEM', itemId });
      },

      // avatar actions (from inventory clicks OR from station R-interaction)
      triggerAvatarAction: (action) => {
        dispatch({ type: 'TRIGGER_AVATAR_ACTION', action });
      },
      clearAvatarAction: () => dispatch({ type: 'CLEAR_AVATAR_ACTION' }),

      // mini-activity interaction (poker / dice / carousel / hologram)
      triggerActivity: (id) => {
        dispatch({ type: 'TRIGGER_ACTIVITY', id });
      },

      // music toggle
      setMusicMuted: (v) => dispatch({ type: 'SET_MUSIC_MUTED', value: v }),
      toggleMusic: () => dispatch({ type: 'SET_MUSIC_MUTED', value: !state.musicMuted }),
    }),
    [state.musicMuted]
  );

  const value = useMemo(
    () => ({ state, level, isMaxLevel, t, ...api }),
    [state, level, isMaxLevel, t, api]
  );
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within <GameProvider>');
  return ctx;
}

// ------------------------------------------------------------------
// Avatar-position bridge (ref-based, does NOT re-render UI on move)
// ------------------------------------------------------------------
/**
 * Avatar position is stored on a mutable ref shared across the app.
 * UI reads it via a low-frequency (~5Hz) polling hook `useAvatarPosition`,
 * so we don't re-render on every frame.
 */
export const avatarPositionRef = { current: { x: 0, y: 0, z: 0 } };

export function useAvatarPositionPoll(hz = 4) {
  const [pos, setPos] = useState({ x: 0, y: 0, z: 0 });
  useEffect(() => {
    const iv = setInterval(() => {
      const p = avatarPositionRef.current;
      setPos({ x: p.x, y: p.y, z: p.z });
    }, 1000 / hz);
    return () => clearInterval(iv);
  }, [hz]);
  return pos;
}

// ------------------------------------------------------------------
// Nearby-station bridge (also ref-based to keep frame budget)
// ------------------------------------------------------------------
export const nearbyStationRef = { current: null };

export function useNearbyStationPoll(hz = 8) {
  const [id, setId] = useState(null);
  useEffect(() => {
    const iv = setInterval(() => {
      setId(nearbyStationRef.current);
    }, 1000 / hz);
    return () => clearInterval(iv);
  }, [hz]);
  return id;
}

// ------------------------------------------------------------------
// Nearby-activity bridge (mini side activities — same pattern as stations)
// ------------------------------------------------------------------
export const nearbyActivityRef = { current: null };

export function useNearbyActivityPoll(hz = 8) {
  const [id, setId] = useState(null);
  useEffect(() => {
    const iv = setInterval(() => {
      setId(nearbyActivityRef.current);
    }, 1000 / hz);
    return () => clearInterval(iv);
  }, [hz]);
  return id;
}

// ------------------------------------------------------------------
// Retro beep synth — tiny web-audio helper (no assets needed)
// ------------------------------------------------------------------
let audioCtx = null;
function getAudio() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

/**
 * Plays a short synth beep. Great for HUD feedback with zero assets.
 * @param {number} freq  Frequency in Hz.
 * @param {number} dur   Duration in seconds.
 * @param {'sine'|'square'|'triangle'|'sawtooth'} type
 * @param {number} gain  Peak gain (0..1).
 */
export function playBeep(freq = 440, dur = 0.08, type = 'square', gain = 0.08) {
  const ctx = getAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(g);
  g.connect(ctx.destination);
  const now = ctx.currentTime;
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.start(now);
  osc.stop(now + dur);
}

/** Convenience: a two-note "confirm" beep. */
export function playConfirm() {
  playBeep(660, 0.06, 'square');
  setTimeout(() => playBeep(990, 0.08, 'square'), 60);
}

/** Convenience: a downward "cancel" beep. */
export function playCancel() {
  playBeep(330, 0.09, 'square');
}

// silence unused import warnings (used indirectly by JSX)
useCallback; useRef;
