import {
  getUser
} from '../lib/auth.js'

import {

  getAnnouncements,
  getMySessions

} from '../lib/db.js'

import {
  safeArray,
  safeText
} from '../utils/validators.js'

// ─────────────────────────────────────
// MAIN
// ─────────────────────────────────────

export async function loadDashboard() {

  try {

    showDashboardLoading()

    const user =
      await getUser()

    if (!user) {
      return
    }

    const [
      announcements,
      sessions
    ] = await Promise.all([

      getAnnouncements(),
      getMySessions()

    ])

    renderWelcome(user)

    renderAnnouncements(
      announcements
    )

    renderNextSession(
      sessions
    )

    renderStats(
      sessions
    )

  } catch (error) {

    console.error(
      '[DASHBOARD_ERROR]',
      error
    )

    renderDashboardError()

  }

}

// ─────────────────────────────────────
// LOADING
// ─────────────────────────────────────

function showDashboardLoading() {

  const sections = [

    'dashboard-welcome',
    'dashboard-announcements',
    'dashboard-next-session',
    'dashboard-stats'

  ]

  sections.forEach(id => {

    const el =
      document.getElementById(id)

    if (!el) return

    el.innerHTML = `

      <div class="card dashboard-card skeleton-card">

        <div class="skeleton skeleton-title"></div>

        <div class="skeleton skeleton-text"></div>

        <div class="skeleton skeleton-text short"></div>

      </div>

    `

  })

}

// ─────────────────────────────────────
// WELCOME
// ─────────────────────────────────────

function renderWelcome(user) {

  const container =
    document.getElementById(
      'dashboard-welcome'
    )

  if (!container) return

  const fullName =
    safeText(
      user?.user_metadata?.full_name
    )

  container.innerHTML = `

    <div class="card dashboard-welcome-card">

      <h1 class="dashboard-title">
        Bienvenido,
        ${fullName || 'usuario'}
      </h1>

      <p class="dashboard-subtitle">
        Accede a tus sesiones, recursos y contenidos del programa.
      </p>

    </div>

  `

}

// ─────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────

function renderAnnouncements(
  announcements = []
) {

  const container =
    document.getElementById(
      'dashboard-announcements'
    )

  if (!container) return

  const items =
    safeArray(announcements)

  if (!items.length) {

    container.innerHTML = `

      <div class="card empty-state">

        <h3>
          No hay avisos disponibles
        </h3>

        <p>
          Los nuevos avisos aparecerán aquí automáticamente.
        </p>

      </div>

    `

    return
  }

  container.innerHTML = `

    <div class="dashboard-section-header">

      <h2>
        Avisos importantes
      </h2>

    </div>

    <div class="dashboard-cards">

      ${items.map(item => `

        <article class="card announcement-card">

          <div class="announcement-top">

            <span class="badge ${safeText(item.type)}">

              ${safeText(item.type)}

            </span>

          </div>

          <h3>
            ${safeText(item.title)}
          </h3>

          <p>
            ${safeText(item.message)}
          </p>

        </article>

      `).join('')}

    </div>

  `

}

// ─────────────────────────────────────
// NEXT SESSION
// ─────────────────────────────────────

function renderNextSession(
  sessions = []
) {

  const container =
    document.getElementById(
      'dashboard-next-session'
    )

  if (!container) return

  const items =
    safeArray(sessions)

  const next =
    items.find(
      item =>
        item?.access_status === 'upcoming'
    )

  if (!next) {

    container.innerHTML = `

      <div class="card empty-state">

        <h3>
          No hay próximas sesiones
        </h3>

        <p>
          Las próximas sesiones aparecerán aquí.
        </p>

      </div>

    `

    return
  }

  container.innerHTML = `

    <div class="card next-session-card">

      <div class="next-session-header">

        <span class="badge info">
          Próxima sesión
        </span>

      </div>

      <h2>
        Sesión ${safeText(next.month_number)}
      </h2>

      <h3>
        ${safeText(next.title)}
      </h3>

      <p>
        ${safeText(next.description)}
      </p>

      <div class="next-session-date">

        ${formatDate(next.live_at)}

      </div>

    </div>

  `

}

// ─────────────────────────────────────
// STATS
// ─────────────────────────────────────

function renderStats(
  sessions = []
) {

  const container =
    document.getElementById(
      'dashboard-stats'
    )

  if (!container) return

  const items =
    safeArray(sessions)

  const available =
    items.filter(
      item =>
        item.access_status === 'available'
    ).length

  const upcoming =
    items.filter(
      item =>
        item.access_status === 'upcoming'
    ).length

  container.innerHTML = `

    <div class="dashboard-stats-grid">

      <div class="card stat-card">

        <span class="stat-number">
          ${available}
        </span>

        <span class="stat-label">
          Sesiones disponibles
        </span>

      </div>

      <div class="card stat-card">

        <span class="stat-number">
          ${upcoming}
        </span>

        <span class="stat-label">
          Próximas sesiones
        </span>

      </div>

    </div>

  `

}

// ─────────────────────────────────────
// ERROR
// ─────────────────────────────────────

function renderDashboardError() {

  const sections = [

    'dashboard-welcome',
    'dashboard-announcements',
    'dashboard-next-session',
    'dashboard-stats'

  ]

  sections.forEach(id => {

    const el =
      document.getElementById(id)

    if (!el) return

    el.innerHTML = `

      <div class="card empty-state">

        <h3>
          Error al cargar
        </h3>

        <p>
          Ha ocurrido un problema al cargar el dashboard.
        </p>

      </div>

    `

  })

}

// ─────────────────────────────────────
// DATE
// ─────────────────────────────────────

function formatDate(date) {

  if (!date) {
    return 'Fecha pendiente'
  }

  try {

    return new Intl.DateTimeFormat(
      'es-ES',
      {

        dateStyle: 'long',
        timeStyle: 'short'

      }
    ).format(new Date(date))

  } catch {

    return 'Fecha inválida'

  }

}