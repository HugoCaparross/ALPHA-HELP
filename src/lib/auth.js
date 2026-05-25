import { supabase } from './supabase.js'

// ─────────────────────────────────────
// HELPERS
// ─────────────────────────────────────

function sanitize(value = '') {
  return value.trim()
}

function sanitizeEmail(email = '') {
  return email
    .trim()
    .toLowerCase()
}

function parseAuthError(error) {

  const message =
    error?.message || ''

  // Supabase auth errors
  if (
    message.includes('Invalid login')
    || message.includes('invalid_credentials')
  ) {
    return 'Correo o contraseña incorrectos.'
  }

  if (
    message.includes('Email not confirmed')
  ) {
    return 'Debes confirmar tu correo electrónico.'
  }

  if (
    message.includes('User already registered')
  ) {
    return 'Ya existe una cuenta con este correo.'
  }

  if (
    message.includes('Password should be')
  ) {
    return 'La contraseña no cumple los requisitos.'
  }

  if (
    message.includes('network')
    || message.includes('fetch')
  ) {
    return 'Error de conexión. Inténtalo de nuevo.'
  }

  return 'Ha ocurrido un error inesperado.'
}

// ─────────────────────────────────────
// REGISTER
// ─────────────────────────────────────

export async function signUp({
  full_name,
  email,
  password,
  region
}) {

  const cleanName =
    sanitize(full_name)

  const cleanEmail =
    sanitizeEmail(email)

  // SQL enum exacto
  const country =
    region === 'ES'
      ? 'ES'
      : 'LATAM'

  const {
    data,
    error
  } = await supabase.auth.signUp({

    email: cleanEmail,

    password,

    options: {

      data: {
        full_name: cleanName,
        country
      }

    }

  })

  if (error) {
    throw new Error(
      parseAuthError(error)
    )
  }

  return data
}

// ─────────────────────────────────────
// LOGIN
// ─────────────────────────────────────

export async function signIn(
  email,
  password
) {

  const cleanEmail =
    sanitizeEmail(email)

  const cleanPassword =
    sanitize(password)

  const {
    data,
    error
  } = await supabase.auth.signInWithPassword({

    email: cleanEmail,
    password: cleanPassword

  })

  if (error) {
    throw new Error(
      parseAuthError(error)
    )
  }

  return data
}

// ─────────────────────────────────────
// GOOGLE OAUTH
// ─────────────────────────────────────

export async function signInWithGoogle() {

  const redirectTo =
    `${window.location.origin}/src/pages/app/dashboard.html`

  const {
    data,
    error
  } = await supabase.auth.signInWithOAuth({

    provider: 'google',

    options: {
      redirectTo
    }

  })

  if (error) {
    throw new Error(
      parseAuthError(error)
    )
  }

  return data
}

// ─────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────

export async function signOut() {

  const { error } =
    await supabase.auth.signOut()

  if (error) {
    throw new Error(
      parseAuthError(error)
    )
  }

  window.location.replace(
    '/src/pages/public/login.html'
  )
}

// ─────────────────────────────────────
// PASSWORD RESET
// ─────────────────────────────────────

export async function resetPassword(
  email
) {

  const cleanEmail =
    sanitizeEmail(email)

  const {
    error
  } = await supabase.auth.resetPasswordForEmail(

    cleanEmail,

    {
      redirectTo:
        `${window.location.origin}/src/pages/public/reset-password.html`
    }

  )

  if (error) {
    throw new Error(
      parseAuthError(error)
    )
  }

  return true
}

// ─────────────────────────────────────
// UPDATE PASSWORD
// ─────────────────────────────────────

export async function updatePassword(
  password
) {

  const {
    data,
    error
  } = await supabase.auth.updateUser({

    password

  })

  if (error) {
    throw new Error(
      parseAuthError(error)
    )
  }

  return data
}

// ─────────────────────────────────────
// USER
// ─────────────────────────────────────

export async function getUser() {

  const {
    data,
    error
  } = await supabase.auth.getUser()

  if (error) {

    console.error(
      '[GET_USER_ERROR]',
      error.message
    )

    return null
  }

  return data?.user || null
}

// ─────────────────────────────────────
// SESSION
// ─────────────────────────────────────

export async function getSession() {

  const {
    data,
    error
  } = await supabase.auth.getSession()

  if (error) {

    console.error(
      '[GET_SESSION_ERROR]',
      error.message
    )

    return null
  }

  return data?.session || null
}

// ─────────────────────────────────────
// SESSION VALIDATION
// ─────────────────────────────────────

export async function requireAuth() {

  const session =
    await getSession()

  if (!session) {

    window.location.replace(
      '/src/pages/public/login.html'
    )

    return null
  }

  return session
}

// ─────────────────────────────────────
// ADMIN CHECK
// ─────────────────────────────────────

export async function isAdmin() {

  const user =
    await getUser()

  if (!user) {
    return false
  }

  const {
    data,
    error
  } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (error) {
    return false
  }

  return !!data?.is_admin
}