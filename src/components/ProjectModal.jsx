/**
 * ProjectModal — pop-up shown when the avatar interacts with a project
 * station (not the About one). Displays: title, meta, video (or a stylized
 * placeholder), short pitch, tags, action buttons, and a togglable Details
 * block. Closes on backdrop click, close button, or Escape key.
 */

import { useEffect, useState } from 'react';
import { useGame, playCancel } from '../state/GameContext.jsx';
import { projects as projectsData } from '../data/projects.js';
import ModalNav from './ModalNav.jsx';

export default function ProjectModal({ projectId }) {
  const { t, closeProject } = useGame();
  const [showDetails, setShowDetails] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const data = projectsData.find((p) => p.id === projectId);
  const tr = t.projects[projectId];

  // Escape key closes the modal.
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

  // Reset the "video failed" state whenever the modal switches project.
  useEffect(() => {
    setVideoFailed(false);
    setShowDetails(false);
  }, [projectId]);

  if (!data || !tr) return null;

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={tr.name}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playCancel();
          closeProject();
        }
      }}
    >
      <div className="modal__frame">
        {/* ---- Header ---- */}
        <header className="modal__header">
          <div>
            <div className="modal__eyebrow">
              [ {t.ui.role} ] {tr.role}
            </div>
            <h2 className="modal__title">{tr.name}</h2>
            <div className="modal__year">
              {t.ui.year} · {tr.year}
            </div>
          </div>
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
        </header>

        {/* ---- Body ---- */}
        <div className="modal__body scroll">
          <VideoBlock
            src={data.video}
            poster={data.poster}
            failed={videoFailed}
            onFail={() => setVideoFailed(true)}
            placeholder={t.ui.videoPlaceholder}
            color={data.color}
          />

          <p className="modal__short">{tr.short}</p>

          {tr.tags?.length > 0 && (
            <div className="modal__tags">
              {tr.tags.map((tag) => (
                <span className="modal__tag" key={tag}>{tag}</span>
              ))}
            </div>
          )}

          <div className="modal__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
            >
              {showDetails ? t.ui.hideDetails : t.ui.showDetails}
            </button>
            {data.href && (
              <a
                className="btn"
                href={data.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                {t.ui.openRepo} ↗
              </a>
            )}
          </div>

          {showDetails && (
            <div className="modal__details">{tr.details}</div>
          )}

          <ModalNav currentId={projectId} />
        </div>
      </div>
    </div>
  );
}

/**
 * Video block — tries to load the mp4; if it fails (or if user hasn't added
 * one yet), renders a stylized "insert your video here" placeholder.
 */
function VideoBlock({ src, poster, failed, onFail, placeholder }) {
  return (
    <div className="modal__video-wrap">
      {!failed && (
        <video
          src={src}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          onError={onFail}
        />
      )}
      {failed && (
        <div className="modal__video-placeholder">
          <span>{placeholder}</span>
        </div>
      )}
    </div>
  );
}
