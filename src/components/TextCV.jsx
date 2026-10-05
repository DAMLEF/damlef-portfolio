/**
 * TextCV — Plain, no-3D, print-friendly rendering of the CV.
 *
 * Rendered instead of the interactive scene when the URL carries `?cv=1`.
 * Aimed at recruiters who want the content without playing the game, at
 * screen readers, and at anyone with a slow / low-power device.
 *
 * All content is sourced from the same translations file as the About
 * modal and the project stations, so there is only one source of truth.
 */

import { useGame } from '../state/GameContext.jsx';
import { projects as projectsData } from '../data/projects.js';
import { LANGUAGES } from '../i18n/translations.js';

const CV_PDF_PATH = '/cv/cv-damien-lfm.pdf';

export default function TextCV() {
  const { state, t, setLanguage } = useGame();
  const a = t.about;
  const c = t.cv;

  const backToScene = () => {
    // Drop the query param and go back to the interactive scene.
    const url = new URL(window.location.href);
    url.searchParams.delete('cv');
    window.location.href = url.pathname + (url.search || '') + url.hash;
  };

  return (
    <div className="cv-page">
      <div className="cv-page__inner">
        {/* --- Top bar : nav + language + actions --- */}
        <header className="cv-topbar">
          <button
            type="button"
            className="cv-link"
            onClick={backToScene}
            aria-label={c.backToScene}
          >
            ◂ {c.backToScene}
          </button>

          <div className="cv-topbar__actions">
            <div className="cv-lang" role="group" aria-label="Language">
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
            <a className="cv-btn" href={CV_PDF_PATH} download>
              ▾ {t.ui?.downloadCv ?? 'Download CV (PDF)'}
            </a>
            <button
              type="button"
              className="cv-btn cv-btn--ghost"
              onClick={() => window.print()}
            >
              ⎙ {c.printCta}
            </button>
          </div>
        </header>

        {/* --- Title block --- */}
        <section className="cv-hero">
          <div className="cv-eyebrow">{a.eyebrow}</div>
          <h1 className="cv-title">{a.title}</h1>
          <div className="cv-subtitle">{a.subtitle}</div>
          <p className="cv-intro">{c.intro}</p>
        </section>

        <hr className="cv-hr" />

        {/* --- Contact --- */}
        <section className="cv-section">
          <h2>{a.sections.contact}</h2>
          <ul className="cv-contact">
            <li>
              <a href={`mailto:${a.contact.email}`}>{a.contact.email}</a>
            </li>
            <li>
              <a
                href={`https://${a.contact.github}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {a.contact.github}
              </a>
            </li>
            <li>
              <a
                href={`https://${a.contact.linkedin}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {a.contact.linkedin}
              </a>
            </li>
            <li>{a.contact.location}</li>
          </ul>
        </section>

        {/* --- Bio paragraphs --- */}
        <section className="cv-section">
          <h2>{a.sections.experience}</h2>
          {a.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <h3>{a.sections.experience}</h3>
          <ul>
            {a.experience.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <h3>{a.sections.education}</h3>
          <ul>
            {a.education.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        {/* --- Skills --- */}
        <section className="cv-section">
          <h2>{a.sections.skills}</h2>
          <div className="cv-skills">
            <div>
              <h4>Programming</h4>
              <p>{a.skills.programming.join(' · ')}</p>
            </div>
            <div>
              <h4>Web</h4>
              <p>{a.skills.web.join(' · ')}</p>
            </div>
            <div>
              <h4>AI</h4>
              <p>{a.skills.ai.join(' · ')}</p>
            </div>
            <div>
              <h4>XR / Graphics</h4>
              <p>{a.skills.xr.join(' · ')}</p>
            </div>
          </div>
        </section>

        {/* --- Languages --- */}
        <section className="cv-section">
          <h2>{a.sections.languages}</h2>
          <ul>
            {a.languages.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        {/* --- Projects (pulled from the same source as the 3D stations) --- */}
        <section className="cv-section">
          <h2>{c.projectsHeader}</h2>
          {projectsData
            .filter((p) => p.id !== 'about')
            .map((p) => {
              const tr = t.projects[p.id];
              if (!tr) return null;
              return (
                <article key={p.id} className="cv-project">
                  <header className="cv-project__head">
                    <h3>{tr.name}</h3>
                    <span className="cv-project__meta">
                      {c.projectRole} · {tr.role} — {c.projectYear} · {tr.year}
                    </span>
                  </header>
                  <p>{tr.short}</p>
                  {tr.tags?.length ? (
                    <div className="cv-tags">
                      {tr.tags.map((tag) => (
                        <span key={tag} className="cv-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {tr.details ? (
                    <p className="cv-project__details">{tr.details}</p>
                  ) : null}
                  {p.href ? (
                    <p>
                      <a href={p.href} target="_blank" rel="noreferrer noopener">
                        {p.href}
                      </a>
                    </p>
                  ) : null}
                </article>
              );
            })}
        </section>

        <footer className="cv-footer">
          <button type="button" className="cv-link" onClick={backToScene}>
            ◂ {c.backToScene}
          </button>
        </footer>
      </div>
    </div>
  );
}
