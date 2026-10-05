/**
 * =============================================================================
 *  App — Root layout
 * =============================================================================
 *
 *  Composes:
 *    - The interactive 3D scene (background layer)
 *    - The HUD & UI overlays
 *    - The intro overlay (first "boot" screen)
 *    - Modals (project + about)
 *    - CRT / scanline / glitch overlays
 *
 *  Order in the DOM matters — the CRT overlays sit on top of everything.
 * =============================================================================
 */

import Scene from './scene/Scene.jsx';
import HUD from './components/HUD.jsx';
import Intro from './components/Intro.jsx';
import Inventory from './components/Inventory.jsx';
import InteractPrompt from './components/InteractPrompt.jsx';
import ProjectModal from './components/ProjectModal.jsx';
import AboutModal from './components/AboutModal.jsx';
import LevelUpFlash from './components/LevelUpFlash.jsx';
import PlayModeBanner from './components/PlayModeBanner.jsx';
import CRTOverlay from './components/CRTOverlay.jsx';
import MusicToggle from './components/MusicToggle.jsx';
import TextCV from './components/TextCV.jsx';

import { useGame } from './state/GameContext.jsx';

// Recruiter-friendly shortcut: `?cv=1` renders the plain text version instead
// of the interactive scene. Cheaper on the browser, screen-reader friendly,
// and print-ready.
function isTextCVMode() {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('cv') === '1';
}

export default function App() {
  const { state } = useGame();

  if (isTextCVMode()) {
    return <TextCV />;
  }

  return (
    <div className="app-root">
      {/* --- 3D scene, always visible in the background --- */}
      <Scene />

      {/* --- HUD (top corners + language switcher + coords) --- */}
      <HUD />

      {/* --- Optional ambient music (only mounts if a file exists) --- */}
      <MusicToggle />

      {/* --- Bottom-left inventory --- */}
      <Inventory />

      {/* --- Contextual "Press E" prompt near stations --- */}
      <InteractPrompt />

      {/* --- Level-up flash (transient) --- */}
      <LevelUpFlash />

      {/* --- Play-mode easter-egg banner --- */}
      {state.playMode && <PlayModeBanner />}

      {/* --- Intro overlay ("boot" screen) --- */}
      {state.introOpen && <Intro />}

      {/* --- Modals for project & about stations --- */}
      {state.activeProjectId && state.activeProjectId !== 'about' && (
        <ProjectModal projectId={state.activeProjectId} />
      )}
      {state.activeProjectId === 'about' && <AboutModal />}

      {/* --- CRT overlays are last so they sit above everything --- */}
      <CRTOverlay />
    </div>
  );
}
