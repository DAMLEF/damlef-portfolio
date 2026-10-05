/**
 * AboutModal — bigger, dossier-style modal for the About station.
 * Shows bio paragraphs, education, experience, skills, languages, contact.
 * All content is pulled from `translations.<lang>.about`.
 */

import { useEffect } from 'react';
import { useGame, playCancel } from '../state/GameContext.jsx';
import ModalNav from './ModalNav.jsx';

export default function AboutModal() {
  const { t, closeProject } = useGame();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        playCancel();
        closeProject();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeProject]);

  const a = t.about;

  return (
    <div
      className="modal about-modal"
      role="dialog"
      aria-modal="true"
      aria-label={a.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playCancel();
          closeProject();
        }
      }}
    >
      <div className="modal__frame">
        <header className="modal__header">
          <div>
            <div className="modal__eyebrow">{a.eyebrow}</div>
            <h2 className="modal__title">{a.title}</h2>
            <div className="modal__year">{a.subtitle}</div>
          </div>
          <div className="modal__header-actions">
            <a
              className="modal__cv-btn"
              href="/damlef-portfolio/cv/cv-damien-lfm.pdf"
              download
              aria-label={t.ui?.downloadCv ?? 'Download CV (PDF)'}
            >
              ▾ {t.ui?.downloadCv ?? 'CV PDF'}
            </a>
            <button
              type="button"
              className="modal__close"
              onClick={() => {
                playCancel();
                closeProject();
              }}
              aria-label={t.ui.close}
            >
              ✕
            </button>
          </div>
        </header>

        <div className="modal__body scroll">
          <div className="about-grid">
            {/* ---- Main column: bio paragraphs ---- */}
            <section className="about-section">
              <h3>{a.sections.experience.toUpperCase()}</h3>
              {a.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>

            {/* ---- Right column: quick facts ---- */}
            <aside className="about-section">
              <h3>{a.sections.education}</h3>
              <ul>
                {a.education.map((edu) => (
                  <li key={edu}>{edu}</li>
                ))}
              </ul>
              <br />
              <h3>{a.sections.languages}</h3>
              <ul>
                {a.languages.map((lg) => (
                  <li key={lg}>{lg}</li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="divider" style={{ margin: '20px 0' }} />

          {/* ---- Skills matrix ---- */}
          <section className="about-section">
            <h3>{a.sections.skills}</h3>
            <div className="about-grid">
              <div>
                <p style={{ color: 'var(--pulp-yellow)', margin: 0 }}>› Programming</p>
                <ul>
                  {a.skills.programming.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <br />
                <p style={{ color: 'var(--pulp-yellow)', margin: 0 }}>› Web & Backend</p>
                <ul>
                  {a.skills.web.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={{ color: 'var(--pulp-yellow)', margin: 0 }}>› AI & Data</p>
                <ul>
                  {a.skills.ai.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <br />
                <p style={{ color: 'var(--pulp-yellow)', margin: 0 }}>› 3D, XR & Graphics</p>
                <ul>
                  {a.skills.xr.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className="divider" style={{ margin: '20px 0' }} />

          {/* ---- Contact ---- */}
          <section className="about-section">
            <h3>{a.sections.contact}</h3>
            <div className="about-links">
              <a href={`mailto:${a.contact.email}`}>✉ {a.contact.email}</a>
              <a
                href={`https://${a.contact.github}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                ▲ {a.contact.github}
              </a>
              <a
                href={`https://${a.contact.linkedin}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                ⚑ {a.contact.linkedin}
              </a>
              <span
                style={{
                  color: 'var(--fg-dim)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  padding: '4px 0',
                }}
              >
                ⌘ {a.contact.location}
              </span>
            </div>
          </section>

          <ModalNav currentId="about" />
        </div>
      </div>
    </div>
  );
}
