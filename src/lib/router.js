import {
  getSession,
  isAdmin
} from './auth.js'

// ─────────────────────────────────────
// ROUTES
// ─────────────────────────────────────

const PUBLIC_ROUTES = [

  '/src/pages/public/login.html',
  '/src/pages/public/register.html',
  '/src/pages/public/forgot-password.html',
  '/src/pages/public/reset-password.html',

  '/src/pages/public/privacy.html',
  '/src/pages/public/terms.html',
  '/src/pages/public/cookies.html',
  '/src/pages/public/legal-notice.html'

]

// ─────────────────────────────────────
// HELPERS
// ─────────────────────────────────────

function isPublicRoute(path) {

  return PUBLIC_ROUTES.some(
    route => path.includes(route)
  )
}

function isAdminRoute(path) {

  return path.includes('/admin/')
}

function isAppRoute(path) {

  return (
    path.includes('/app/')
    || path.includes('/admin/')
  )
}

function redirect(path) {

  window.location.replace(path)
}

// ─────────────────────────────────────
// MAIN GUARD
// ─────────────────────────────────────

export async function initGuard() {

  const path =
    window.location.pathname

  const session =
    await getSession()

  const publicPage =
    isPublicRoute(path)

  const protectedPage =
    isAppRoute(path)

  // ─────────────────────────────────
  // NO SESSION + PRIVATE PAGE
  // ─────────────────────────────────

  if (
    !session &&
    protectedPage
  ) {

    redirect(
      '/src/pages/public/login.html'
    )

    return null
  }

  // ─────────────────────────────────
  // SESSION + AUTH PAGE
  // ─────────────────────────────────

  if (
    session &&
    (
      path.includes('/login.html')
      || path.includes('/register.html')
    )
  ) {

    redirect(
      '/src/pages/app/dashboard.html'
    )

    return null
  }

  // ─────────────────────────────────
  // ADMIN VALIDATION
  // ─────────────────────────────────

  if (
    session &&
    isAdminRoute(path)
  ) {

    const admin =
      await isAdmin()

    if (!admin) {

      redirect(
        '/src/pages/app/dashboard.html'
      )

      return null
    }

  }

  // ─────────────────────────────────
  // VALID SESSION
  // ─────────────────────────────────

  return session
}

// ─────────────────────────────────────
// ROUTER HELPERS
// ─────────────────────────────────────

export function goTo(path) {

  if (!path) return

  window.location.href = path
}

export function reloadPage() {

  window.location.reload()
}

export function back() {

  window.history.back()
}

// ─────────────────────────────────────
// SAFE ROUTE LOADER
// ─────────────────────────────────────

export async function loadProtectedPage(
  callback
) {

  try {

    const session =
      await initGuard()

    if (!session) return

    if (
      typeof callback === 'function'
    ) {

      await callback(session)

    }

  } catch (error) {

    console.error(
      '[ROUTER_ERROR]',
      error
    )

    redirect(
      '/src/pages/public/login.html'
    )

  }
}