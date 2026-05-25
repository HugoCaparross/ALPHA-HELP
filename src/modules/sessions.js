import {
  getMySessions,
  getSessionResources,
  markSessionCompleted
} from '../lib/db.js'

import {
  getUser
} from '../lib/auth.js'

import {
  safeArray,
  safeText
} from '../utils/validators.js'

// ─────────────────────────────────────
// MAIN
// ─────────────────────────────────────

export async function loadSessions() {

  const container =
    document.getElementById(
      'sessions-grid'
    )

  if (!container) return

  try {

    renderLoading(container)

    const user =
      await getUser()

    if (!user) return

    const sessions =
      await getMySessions()

    renderSessions(
      container,
      sessions,
      user.id
    )

  } catch (error) {

    console.error(
      '[SESSIONS_ERROR]',
      error
    )

    renderError(container)

  }

}

// ─────────────────────────────────────
// RENDER
// ─────────────────────────────────────

function renderSessions(
  container,
  sessions = [],
  userId
) {

  const items =
    safeArray(sessions)

  if (!items.length) {

    container.innerHTML = `

      <div class="card empty-state">

        <h3>
          No hay sesiones disponibles
        </h3>

        <p>
          Las nuevas sesiones aparecerán aquí automáticamente.
        </p>

      </div>

    `

    return
  }

  container.innerHTML = items.map(
    session => {

      const available =
        session?.access_status === 'available'

      return `

        <article
          class="card session-card"
        >

          <div class="session-top">

            <span class="badge info">

              Sesión
              ${safeText(
                session.month_number
              )}

            </span>

            <span class="badge ${
              available
                ? 'success'
                : 'warning'
            }">

              ${
                available
                  ? 'Disponible'
                  : 'Próximamente'
              }

            </span>

          </div>

          <h2>
            ${safeText(
              session.title
            )}
          </h2>

          <p>
            ${safeText(
              session.description
            )}
          </p>

          <div class="session-actions">

            ${
              available &&
              session.youtube_url
                ? `
                  <a
                    href="${session.youtube_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="button"
                    data-session-id="${session.id}"
                  >
                    Ver sesión
                  </a>
                `
                : `
                  <button
                    class="button button-secondary"
                    disabled
                  >
                    No disponible
                  </button>
                `
            }

          </div>

          <div
            class="session-resources"
            id="resources-${session.id}"
          ></div>

        </article>

      `
    }
  ).join('')

  initSessionEvents(
    items,
    userId
  )

}

// ─────────────────────────────────────
// EVENTS
// ─────────────────────────────────────

function initSessionEvents(
  sessions,
  userId
) {

  sessions.forEach(session => {

    const link =
      document.querySelector(
        `[data-session-id="${session.id}"]`
      )

    if (!link) return

    link.addEventListener(
      'click',
      async () => {

        try {

          await markSessionCompleted(
            userId,
            session.id
          )

          await loadResources(
            session.id
          )

        } catch (error) {

          console.error(
            '[SESSION_PROGRESS_ERROR]',
            error
          )

        }

      }
    )

  })

}

// ─────────────────────────────────────
// RESOURCES
// ─────────────────────────────────────

async function loadResources(
  sessionId
) {

  const container =
    document.getElementById(
      `resources-${sessionId}`
    )

  if (!container) return

  try {

    container.innerHTML = `

      <div class="resources-loading">

        <span class="spinner-small"></span>

      </div>

    `

    const resources =
      await getSessionResources(
        sessionId
      )

    const items =
      safeArray(resources)

    if (!items.length) {

      container.innerHTML = `

        <div class="empty-resources">

          No hay recursos disponibles.

        </div>

      `

      return
    }

    container.innerHTML = `

      <div class="resources-list">

        ${items.map(resource => `

          <a
            href="${safeText(resource.url)}"
            target="_blank"
            rel="noopener noreferrer"
            class="resource-item"
          >

            <span class="resource-type">

              ${safeText(resource.type)}

            </span>

            <span>

              ${safeText(resource.title)}

            </span>

          </a>

        `).join('')}

      </div>

    `

  } catch (error) {

    console.error(
      '[RESOURCES_ERROR]',
      error
    )

    container.innerHTML = `

      <div class="empty-resources">

        Error al cargar recursos.

      </div>

    `

  }

}

// ─────────────────────────────────────
// LOADING
// ─────────────────────────────────────

function renderLoading(container) {

  container.innerHTML = `

    <div class="sessions-grid">

      ${Array(3).fill('').map(() => `

        <div class="card session-card">

          <div class="skeleton skeleton-title"></div>

          <div class="skeleton skeleton-text"></div>

          <div class="skeleton skeleton-text short"></div>

        </div>

      `).join('')}

    </div>

  `

}

// ─────────────────────────────────────
// ERROR
// ─────────────────────────────────────

function renderError(container) {

  container.innerHTML = `

    <div class="card empty-state">

      <h3>
        Error al cargar sesiones
      </h3>

      <p>
        Ha ocurrido un problema al cargar las sesiones.
      </p>

    </div>

  `

}