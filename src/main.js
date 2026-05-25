import {
  initGuard
} from './lib/router.js'

import {
  renderLayout
} from './components/layout.js'

import {
  loadDashboard
} from './modules/dashboard.js'

import {
  loadSessions
} from './modules/sessions.js'

import {
  loadProfile
} from './modules/profile.js'

import {
  applySEO
} from './utils/seo.js'

// ─────────────────────────────────────
// INIT
// ─────────────────────────────────────

document.addEventListener(
  'DOMContentLoaded',
  async () => {

    try {

      applySEO()

      const session =
        await initGuard()

      if (!session) return

      // PUBLIC PAGES
      const isPublic =
        window.location.pathname.includes(
          '/public/'
        )

      if (isPublic) return

      // APP LAYOUT
      await renderLayout()

      const pageContent =
        document.getElementById(
          'page-content'
        )

      if (!pageContent) return

      const path =
        window.location.pathname

      // ─────────────────────────────
      // DASHBOARD
      // ─────────────────────────────

      if (
        path.includes(
          '/dashboard.html'
        )
      ) {

        pageContent.innerHTML = `

          <div
            class="dashboard-grid"
          >

            <section
              id="dashboard-welcome"
            ></section>

            <section
              id="dashboard-announcements"
            ></section>

            <section
              id="dashboard-next-session"
            ></section>

            <section
              id="dashboard-stats"
            ></section>

          </div>

        `

        await loadDashboard()

      }

      // ─────────────────────────────
      // SESSIONS
      // ─────────────────────────────

      if (
        path.includes(
          '/sessions.html'
        )
      ) {

        pageContent.innerHTML = `

          <div
            id="sessions-grid"
            class="sessions-grid"
          ></div>

        `

        await loadSessions()

      }

      // ─────────────────────────────
      // PROFILE
      // ─────────────────────────────

      if (
        path.includes(
          '/profile.html'
        )
      ) {

        pageContent.innerHTML = `

          <div
            id="profile-container"
          ></div>

        `

        await loadProfile(
          document.getElementById(
            'profile-container'
          )
        )

      }

    } catch (error) {

      console.error(
        '[APP_INIT_ERROR]',
        error
      )

      document.body.innerHTML = `

        <main
          style="
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:2rem;
          "
        >

          <div
            class="card empty-state"
            style="max-width:500px;width:100%;"
          >

            <h2>
              Error al cargar la aplicación
            </h2>

            <p>
              Ha ocurrido un problema inesperado.
            </p>

          </div>

        </main>

      `

    }

  }
)