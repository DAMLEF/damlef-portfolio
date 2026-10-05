/**
 * MusicToggle — Optional ambient soundtrack.
 *
 * Drop-in behaviour:
 *   1. Put `theme.mp3` (or `.wav` / `.ogg`) in `public/audio/`.
 *   2. On mount we probe the file with HEAD requests — if none of the
 *      candidates exists, the component renders nothing (no button, no
 *      audio element).
 *   3. If a file is found, we mount a looping <audio> element and try to
 *      autoplay it. Browsers only allow autoplay-with-sound after a user
 *      gesture, so we also retry on the very first user interaction (click
 *      / keydown) — the intro "Enter the scene" button covers that case
 *      naturally.
 *   4. Mute / unmute preference is persisted in localStorage through
 *      `GameContext.musicMuted`.
 */

import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/GameContext.jsx';

const CANDIDATES = [
  '/damlef-portfolio/audio/theme.wav',
];

export default function MusicToggle() {
  const { state, t, toggleMusic } = useGame();
  const audioRef = useRef(null);
  let [src, setSrc] = useState(null);

  // 1. Probe candidate files (HEAD). Pick the first one that responds OK.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const url of CANDIDATES) {
        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok && !cancelled) {
            setSrc(url);
            return;
          }
        } catch {
          /* network or missing — try the next candidate */
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Reasonable ambient volume as soon as we know which file to load.
  useEffect(() => {
    const el = audioRef.current;
    if (el) el.volume = 0.02;
  }, [src]);

  // 2. Play / pause in response to the intro closing + mute preference.
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !src) return;

    const shouldPlay = !state.introOpen && !state.musicMuted;

    if (shouldPlay) {
      // Browsers block autoplay-with-sound until a user gesture. The intro
      // "Enter the scene" click is such a gesture, so this usually works.
      el.play().catch(() => { /* will retry on next user gesture */ });
    } else {
      el.pause();
    }
  }, [state.introOpen, state.musicMuted, src]);

  // 3. Fallback: retry play on the very first user gesture if autoplay
  //    was rejected. Removed once it succeeds.
  useEffect(() => {
    if (!src) return;
    const retry = () => {
      const el = audioRef.current;
      if (!el) return;
      if (!state.musicMuted && !state.introOpen) {
        el.play().catch(() => {});
      }
    };
    window.addEventListener('pointerdown', retry, { once: true });
    window.addEventListener('keydown', retry, { once: true });
    return () => {
      window.removeEventListener('pointerdown', retry);
      window.removeEventListener('keydown', retry);
    };
  }, [src, state.musicMuted, state.introOpen]);


  src = CANDIDATES[0];

  const muted = state.musicMuted;
  const label = muted
    ? (t.hud?.musicOn ?? 'Play music')
    : (t.hud?.musicOff ?? 'Mute music');

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        // Small default; the composition is background ambience.
        // eslint-disable-next-line jsx-a11y/media-has-caption
      />
      <button
        type="button"
        className={`music-toggle${muted ? ' is-muted' : ''}`}
        onClick={toggleMusic}
        aria-label={label}
        aria-pressed={!muted}
        title={label}
      >
        <span aria-hidden="true">{muted ? '♫' : '♫'}</span>
        <span className="music-toggle__state" aria-hidden="true">{muted ? 'off' : 'on'}</span>
      </button>
    </>
  );
}
