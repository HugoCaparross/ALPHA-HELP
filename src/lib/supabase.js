import { createClient }
from '@supabase/supabase-js'

// ─────────────────────────────────────
// ENV
// ─────────────────────────────────────

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY

// ─────────────────────────────────────
// ENV VALIDATION
// ─────────────────────────────────────

if (!supabaseUrl) {

  throw new Error(
    'Missing VITE_SUPABASE_URL'
  )

}

if (!supabaseAnonKey) {

  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY'
  )

}

// Nunca permitir service_role
if (
  supabaseAnonKey.includes(
    'service_role'
  )
) {

  throw new Error(
    'SECURITY ERROR: service_role detected.'
  )

}

// URL validation
try {

  new URL(supabaseUrl)

} catch {

  throw new Error(
    'Invalid Supabase URL.'
  )

}

// ─────────────────────────────────────
// CLIENT
// ─────────────────────────────────────

export const supabase =
  createClient(

    supabaseUrl,
    supabaseAnonKey,

    {

      auth: {

        persistSession: true,

        autoRefreshToken: true,

        detectSessionInUrl: true,

        storageKey:
          'alpha-help-auth',

        flowType: 'pkce'

      },

      global: {

        headers: {

          'X-Client-Info':
            'alpha-help-web'

        }

      }

    }

  )

// ─────────────────────────────────────
// SESSION
// ─────────────────────────────────────

export async function getSession() {

  try {

    const {
      data,
      error
    } = await supabase.auth.getSession()

    if (error) {

      console.error(
        '[SESSION_ERROR]',
        error.message
      )

      return null

    }

    return data?.session || null

  } catch (error) {

    console.error(
      '[SESSION_FATAL]',
      error
    )

    return null

  }

}

// ─────────────────────────────────────
// USER
// ─────────────────────────────────────

export async function getCurrentUser() {

  try {

    const {
      data,
      error
    } = await supabase.auth.getUser()

    if (error) {

      console.error(
        '[USER_ERROR]',
        error.message
      )

      return null

    }

    return data?.user || null

  } catch (error) {

    console.error(
      '[USER_FATAL]',
      error
    )

    return null

  }

}

// ─────────────────────────────────────
// AUTH LISTENER
// ─────────────────────────────────────

supabase.auth.onAuthStateChange(
  async (
    event,
    session
  ) => {

    console.info(
      '[AUTH_EVENT]',
      event
    )

    const path =
      window.location.pathname

    const protectedPage =

      path.includes('/app/')
      || path.includes('/admin/')

    // Session expired
    if (

      (
        event === 'SIGNED_OUT'
        || !session
      )

      && protectedPage

    ) {

      window.location.replace(
        '/src/pages/public/login.html'
      )

    }

    // Login success
    if (
      event === 'SIGNED_IN'
    ) {

      const isAuthPage =

        path.includes('/login')
        || path.includes('/register')

      if (isAuthPage) {

        window.location.replace(
          '/src/pages/app/dashboard.html'
        )

      }

    }

    // Token refreshed
    if (
      event === 'TOKEN_REFRESHED'
    ) {

      console.info(
        '[TOKEN_REFRESHED]'
      )

    }

  }
)

// ─────────────────────────────────────
// NETWORK
// ─────────────────────────────────────

window.addEventListener(
  'offline',
  () => {

    console.warn(
      '[NETWORK] Offline.'
    )

  }
)

window.addEventListener(
  'online',
  () => {

    console.info(
      '[NETWORK] Online.'
    )

  }
)