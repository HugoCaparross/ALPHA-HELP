import {
  signOut
} from '../lib/auth.js'

import {
  getUser,
  isAdmin
} from '../lib/auth.js'

// ─────────────────────────────────────
// SIDEBAR LINKS
// ─────────────────────────────────────

const USER_LINKS = [

  {
    label: 'Dashboard',
    href: '/src/pages/app/dashboard.html'
  },

  {
    label: 'Sesiones',
    href: '/src/pages/app/sessions.html'
  },

  {
    label: 'Recursos',
    href: '/src/pages/app/resources.html'
  },

  {
    label: 'FAQ',
    href: '/src/pages/app/faq.html'
  },

  {
    label: 'Contacto',
    href: '/src/pages/app/contact.html'
  },

  {
    label: 'Perfil',
    href: '/src/pages/app/profile.html'
  }

]

const ADMIN_LINKS = [

  {
    label: 'Admin',
    href: '/src/pages/admin/dashboard.html'
  },

  {
    label: 'Usuarios',
    href: '/src/pages/admin/users.html'
  },

  {
    label: 'Sesiones',
    href: '/src/pages/admin/sessions.html'
  },

  {
    label: 'Avisos',
    href: '/src/pages/admin/announcements.html'
  }

]

// ─────────────────────────────────────
// MAIN LAYOUT
// ─────────────────────────────────────

export async function renderLayout(
  containerId = 'app'
) {

  const container =
    document.getElementById(
      containerId
    )

  if (!container) return

  const user =
    await getUser()

  if (!user) return

  const admin =
    await isAdmin()

  const links = [

    ...USER_LINKS,

    ...(admin ? ADMIN_LINKS : [])

  ]

  container.innerHTML = `

    <div class="app-layout">

      <!-- SIDEBAR -->

      <aside class="sidebar">

        <div class="sidebar-brand">

          <img
            src="/src/assets/images/logo.svg"
            alt="ALPHA-HELP"
            class="sidebar-logo"
          />

          <span>
            ALPHA-HELP
          </span>

        </div>

        <nav class="sidebar-nav">

          ${links.map(link => `

            <a
              href="${link.href}"
              class="sidebar-link ${
                window.location.pathname === link.href
                  ? 'active'
                  : ''
              }"
            >

              ${link.label}

            </a>

          `).join('')}

        </nav>

        <div class="sidebar-footer">

          <button
            id="logout-button"
            class="button button-secondary"
          >
            Cerrar sesión
          </button>

        </div>

      </aside>

      <!-- CONTENT -->

      <main class="app-content">

        <header class="app-header">

          <div>

            <h1 class="app-page-title">

              ${getPageTitle()}

            </h1>

            <p class="app-page-subtitle">

              Plataforma privada ALPHA-HELP

            </p>

          </div>

          <div class="app-user">

            <span class="app-user-name">

              ${
                user.user_metadata
                  ?.full_name || 'Usuario'
              }

            </span>

          </div>

        </header>

        <section id="page-content">

        </section>

      </main>

    </div>

  `

  initLayoutEvents()

}

// ─────────────────────────────────────
// EVENTS
// ─────────────────────────────────────

function initLayoutEvents() {

  const logoutBtn =
    document.getElementById(
      'logout-button'
    )

  if (!logoutBtn) return

  logoutBtn.addEventListener(
    'click',
    async () => {

      try {

        logoutBtn.disabled = true

        await signOut()

      } catch (error) {

        console.error(
          '[LOGOUT_ERROR]',
          error
        )

        logoutBtn.disabled = false

      }

    }
  )

}

// ─────────────────────────────────────
// PAGE TITLE
// ─────────────────────────────────────

function getPageTitle() {

  const path =
    window.location.pathname

  if (
    path.includes('dashboard')
  ) {
    return 'Dashboard'
  }

  if (
    path.includes('sessions')
  ) {
    return 'Sesiones'
  }

  if (
    path.includes('resources')
  ) {
    return 'Recursos'
  }

  if (
    path.includes('faq')
  ) {
    return 'Preguntas frecuentes'
  }

  if (
    path.includes('contact')
  ) {
    return 'Contacto'
  }

  if (
    path.includes('profile')
  ) {
    return 'Perfil'
  }

  if (
    path.includes('/admin/')
  ) {
    return 'Administración'
  }

  return 'ALPHA-HELP'
}