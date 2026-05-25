// src/modules/sessions.js

import {
  getMySessions,
  getSessionById,
  markSessionCompleted
} from '../lib/db.js';

import {
  showLoader,
  hideLoader,
  showToast,
  openModal,
  renderEmptyState
} from '../components/ui.js';

import {
  formatDate,
  formatTime
} from '../utils/helpers.js';


// ======================================================
// INIT SESSIONS
// ======================================================

export async function initSessions() {

  try {

    showLoader();

    const sessions =
      await getMySessions();

    renderSessions(sessions);

  } catch (error) {

    console.error(error);

    renderSessionsError();

  } finally {

    hideLoader();
  }
}


// ======================================================
// RENDER SESSIONS
// ======================================================

function renderSessions(
  sessions = []
) {

  const container =
    document.getElementById(
      'sessions-grid'
    );

  if (!container) return;

  if (!sessions.length) {

    const empty =
      renderEmptyState({

        icon: '🎥',

        title:
          'No hay sesiones disponibles',

        description:
          'Las sesiones aparecerán automáticamente cuando estén disponibles.'
      });

    container.appendChild(empty);

    return;
  }

  container.innerHTML =
    sessions.map(session => `

      <article
        class="
          session-card
          session-${session.status}
        "
      >

        <div class="session-card-top">

          <span class="session-month">

            Sesión
            ${session.month_number}

          </span>

          <span
            class="
              session-status
              status-${session.status}
            "
          >

            ${getStatusLabel(
              session.status
            )}

          </span>

        </div>

        <div class="session-card-body">

          <h3 class="session-title">
            ${session.title}
          </h3>

          <p class="session-description">
            ${session.description}
          </p>

          ${
            session.live_at
              ? `
                <div class="session-meta">

                  <span>
                    📅
                    ${formatDate(
                      session.live_at
                    )}
                  </span>

                  <span>
                    🕒
                    ${formatTime(
                      session.live_at
                    )}
                  </span>

                </div>
              `
              : ''
          }

        </div>

        <div class="session-card-footer">

          ${
            session.status ===
            'upcoming'

              ? `
                <button
                  class="
                    btn
                    btn-disabled
                  "
                  disabled
                >
                  Próximamente
                </button>
              `

              : `
                <button
                  class="
                    btn
                    btn-primary
                    session-open-button
                  "
                  data-session-id="${session.id}"
                >
                  Ver sesión
                </button>
              `
          }

        </div>

      </article>

    `).join('');

  initSessionButtons();
}


// ======================================================
// SESSION BUTTONS
// ======================================================

function initSessionButtons() {

  const buttons =
    document.querySelectorAll(
      '.session-open-button'
    );

  buttons.forEach(button => {

    button.addEventListener(
      'click',
      async () => {

        const sessionId =
          button.dataset.sessionId;

        await openSession(sessionId);
      }
    );
  });
}


// ======================================================
// OPEN SESSION
// ======================================================

async function openSession(
  sessionId
) {

  try {

    showLoader(
      'Cargando sesión...'
    );

    const session =
      await getSessionById(
        sessionId
      );

    openModal({

      title:
        `Sesión ${session.month_number}`,

      size: 'xl',

      content:
        renderSessionModal(
          session
        )
    });

    initCompleteSessionButton(
      session.id
    );

  } catch (error) {

    console.error(error);

    showToast(
      'error',
      'No se pudo cargar la sesión'
    );

  } finally {

    hideLoader();
  }
}


// ======================================================
// SESSION MODAL
// ======================================================

function renderSessionModal(
  session
) {

  return `
    <div class="session-modal">

      <div class="session-video">

        ${renderVideo(session)}

      </div>

      <div class="session-content">

        <h2 class="session-modal-title">
          ${session.title}
        </h2>

        <p class="session-modal-description">
          ${session.description}
        </p>

        ${
          session.live_at
            ? `
              <div class="session-modal-date">

                <span>
                  📅
                  ${formatDate(
                    session.live_at
                  )}
                </span>

                <span>
                  🕒
                  ${formatTime(
                    session.live_at
                  )}
                </span>

              </div>
            `
            : ''
        }

        ${renderResources(
          session.session_resources
        )}

        <div class="session-modal-actions">

          <button
            class="
              btn
              btn-success
            "
            id="complete-session-button"
            data-session-id="${session.id}"
          >
            Marcar como completada
          </button>

        </div>

      </div>

    </div>
  `;
}


// ======================================================
// VIDEO
// ======================================================

function renderVideo(session) {

  // YOUTUBE

  if (session.youtube_url) {

    return `
      <iframe
        src="${convertYoutubeEmbed(
          session.youtube_url
        )}"
        title="${session.title}"
        allowfullscreen
      ></iframe>
    `;
  }

  // RECORDING

  if (session.recording_url) {

    return `
      <video controls>

        <source
          src="${session.recording_url}"
          type="video/mp4"
        >

      </video>
    `;
  }

  return `
    <div class="session-video-empty">

      <span>
        El vídeo estará disponible próximamente
      </span>

    </div>
  `;
}


// ======================================================
// RESOURCES
// ======================================================

function renderResources(
  resources = []
) {

  if (!resources.length) {

    return `
      <div class="session-resources-empty">

        No hay recursos disponibles.

      </div>
    `;
  }

  return `
    <div class="session-resources">

      <h3>
        Recursos descargables
      </h3>

      <div class="session-resources-grid">

        ${resources.map(resource => `

          <a
            href="${resource.url}"
            target="_blank"
            class="resource-card"
          >

            <div class="resource-icon">

              ${getResourceIcon(
                resource.type
              )}

            </div>

            <div class="resource-info">

              <h4>
                ${resource.title}
              </h4>

              <p>
                ${resource.description}
              </p>

            </div>

          </a>

        `).join('')}

      </div>

    </div>
  `;
}


// ======================================================
// COMPLETE SESSION
// ======================================================

function initCompleteSessionButton(
  sessionId
) {

  const button =
    document.getElementById(
      'complete-session-button'
    );

  if (!button) return;

  button.addEventListener(
    'click',
    async () => {

      try {

        button.disabled = true;

        await markSessionCompleted(
          sessionId
        );

        showToast(
          'success',
          'Sesión completada'
        );

      } catch (error) {

        console.error(error);

        showToast(
          'error',
          'No se pudo actualizar el progreso'
        );

      } finally {

        button.disabled = false;
      }
    }
  );
}


// ======================================================
// HELPERS
// ======================================================

function getStatusLabel(status) {

  const labels = {

    upcoming: 'Bloqueada',

    available: 'Disponible',

    completed: 'Completada'
  };

  return labels[status] || status;
}


function getResourceIcon(type) {

  const icons = {

    pdf: '📄',

    link: '🔗',

    video: '🎥'
  };

  return icons[type] || '📁';
}


function convertYoutubeEmbed(url) {

  if (!url) return '';

  const videoId =
    url.split('v=')[1]?.split('&')[0]
    || url.split('/').pop();

  return `
    https://www.youtube.com/embed/${videoId}
  `;
}


// ======================================================
// ERROR
// ======================================================

function renderSessionsError() {

  const container =
    document.getElementById(
      'sessions-grid'
    );

  if (!container) return;

  const empty =
    renderEmptyState({

      icon: '⚠️',

      title:
        'Error cargando las sesiones',

      description:
        'Ha ocurrido un error inesperado.'
    });

  container.innerHTML = '';

  container.appendChild(empty);
}