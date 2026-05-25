
// ═══════════════════════════════════════════════════════════
// FILE: src/lib/router.js
// Guard de páginas para MPA (Multi-Page App).
// Cada página HTML llama a initGuard() al cargar.
// ═══════════════════════════════════════════════════════════
import { supabase } from './supabase.js'

// Cada página importa initGuard() y hace:
//   const session = await initGuard()
//   if (!session) return   ← la página se detiene, ya hubo redirect

export async function initGuard() {
  const path = window.location.pathname

  const isApp   = path.includes('/pages/app/')
  const isAdmin = path.includes('/pages/admin/')
  const isAuth  = path.includes('/pages/public/login')
                || path.includes('/pages/public/register')

  // getSession() es local (rápido). No llama al servidor.
  const { data: { session } } = await supabase.auth.getSession()

  // Sin sesión → bloquear zonas privadas
  if (!session && (isApp || isAdmin)) {
    window.location.replace('/pages/public/login.html')
    return null
  }

  // Con sesión → evitar que entre a login/registro de nuevo
  if (session && isAuth) {
    window.location.replace('/pages/app/dashboard.html')
    return null
  }

  // Admin guard: verifica el rol en BD (no confiar solo en el JWT)
  if (session && isAdmin) {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    if (error || !data?.is_admin) {
      window.location.replace('/pages/app/dashboard.html')
      return null
    }
  }

  return session
}

// Navegación programática simple
export function goTo(path) {
  window.location.href = path
}