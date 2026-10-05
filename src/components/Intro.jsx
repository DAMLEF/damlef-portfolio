/**
 * Intro overlay — "boot" screen with name/age/pitch and CTA.
 * Closes on click of the CTA button or on Enter/Space.
 */

import { useEffect } from 'react';
import { useGame, playConfirm } from '../state/GameContext.jsx';

const LANGUAGES = ['fr', 'en'];

export default function Intro() {
  const { state, t, closeIntro, setLanguage, openProject } = useGame();

  // Keyboard shortcut: Enter or Space also closes the intro.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playConfirm();
        closeIntro();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeIntro]);

  const handleEnter = () => {
    playConfirm();
    closeIntro();
  };

  const handleAbout = () => {
    playConfirm();
    closeIntro();
    openProject('about');
  };

  return (
    <div className="intro" role="dialog" aria-modal="true" aria-label={t.intro.name}>
      <div className="intro__frame">
        <div className="intro__lang" role="group" aria-label={t.hud?.language ?? 'Language'}>
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

        <div className="intro__eyebrow">{t.intro.eyebrow}</div>

        <h1
          className="intro__title glitch display"
          data-text={t.intro.name}
        >
          {t.intro.name}
        </h1>

        <div className="intro__subtitle">{t.intro.subtitle}</div>
        <div className="divider" style={{ margin: '10px 0 22px' }} />

        <p className="intro__body" style={{ whiteSpace: 'pre-line' }}>
          {t.intro.body}
        </p>

        <button
          type="button"
          className="intro__cta"
          onClick={handleEnter}
          autoFocus
        >
          {t.intro.cta}
        </button>

        <button
          type="button"
          className="intro__cta intro__cta--secondary"
          onClick={handleAbout}
        >
          {t.intro.aboutCta}
        </button>

        {/* Recruiter shortcuts: text-only version + PDF download. Kept
            visually secondary so they don't fight the main CTA. */}
        <div className="intro__shortcuts">
          <a
            className="intro__shortcut"
            href="/damlef-portfolio/cv/cv-damien-lfm.pdf"
            download
          >
            ▾ {t.intro.pdfCvCta}
          </a>
        </div>

        <div className="intro__controls">
          <span>
            {(t.controls?.keysMove ?? ['W','A','S','D']).map((k) => (
              <kbd key={k}>{k}</kbd>
            ))}
            {' '}
            {t.intro.hint1}
          </span>
          <span><kbd>E</kbd> {t.intro.hint2}</span>
          <span><kbd>R</kbd> {t.intro.hint5}</span>
          <span><kbd>I</kbd> {t.intro.hint3}</span>
          <span><kbd>G</kbd> {t.intro.hint4}</span>
        </div>
      </div>
    </div>
  );
}
