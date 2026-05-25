// ═══════════════════════════════════════════════════════════
// FILE: src/lib/auth.js
// Login, registro, logout, Google OAuth, reset contraseña.
// Toda la lógica de autenticación centralizada aquí.
// ═══════════════════════════════════════════════════════════
import { supabase } from './supabase.js'
import { validateEmail, validatePassword, sanitize } from '../utils/validators.js'

// ── Rate limiting cliente (brute force básico) ────────────
// El límite real lo aplica Supabase en servidor.
// Este añade una capa adicional en el navegador.
const _rl = { count: 0, lockedUntil: 0 }
const MAX  = 5
const LOCK = 15 * 60 * 1000 // 15 min

function _checkRateLimit() {
  if (_rl.lockedUntil && Date.now() < _rl.lockedUntil) {
    const mins = Math.ceil((_rl.lockedUntil - Date.now()) / 60000)
    throw new Error(`Demasiados intentos. Espera ${mins} minutos e inténtalo de nuevo.`)
  }
  if (Date.now() >= _rl.lockedUntil) { _rl.count = 0; _rl.lockedUntil = 0 }
}

function _failedAttempt() {
  _rl.count++
  if (_rl.count >= MAX) _rl.lockedUntil = Date.now() + LOCK
}

// ── signIn ────────────────────────────────────────────────
export async function signIn(email, password) {
  _checkRateLimit()

  const clean = sanitize(email).toLowerCase().trim()
  if (!validateEmail(clean)) throw new Error('El correo no tiene un formato válido.')
  if (!password)             throw new Error('La contraseña es obligatoria.')

  const { data, error } = await supabase.auth.signInWithPassword({
    email: clean,
    password
  })

  if (error) {
    _failedAttempt()
    // Mensaje genérico: no revelar si existe o no el correo (OWASP A2)
    throw new Error('Correo o contraseña incorrectos.')
  }

  // Bloquear acceso si el email no está verificado
  if (!data.user?.email_confirmed_at) {
    await supabase.auth.signOut()
    throw new Error(
      'Debes verificar tu correo antes de acceder. ' +
      'Revisa tu bandeja de entrada (y la carpeta de spam).'
    )
  }

  _rl.count = 0; _rl.lockedUntil = 0
  return data
}

// ── signInWithGoogle ──────────────────────────────────────
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/pages/app/dashboard.html`,
      queryParams: { access_type: 'offline', prompt: 'consent' }
    }
  })
  if (error) throw new Error('No se pudo conectar con Google. Inténtalo de nuevo.')
}

// ── signUp ────────────────────────────────────────────────
export async function signUp({ email, password, fullName, country, acceptTerms }) {
  if (!acceptTerms) throw new Error('Debes aceptar los Términos de Uso y la Política de Privacidad.')

  const cleanEmail = sanitize(email).toLowerCase().trim()
  const cleanName  = sanitize(fullName).trim()

  if (!validateEmail(cleanEmail))       throw new Error('El correo no tiene un formato válido.')
  if (!['ES', 'LATAM'].includes(country)) throw new Error('Selecciona una región válida.')
  if (!cleanName || cleanName.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.')
  if (cleanName.length > 100)             throw new Error('El nombre es demasiado largo.')

  const pwErrors = validatePassword(password)
  if (pwErrors.length) throw new Error(pwErrors[0])

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: { full_name: cleanName, country },
      emailRedirectTo: `${window.location.origin}/pages/public/login.html`
    }
  })

  if (error) {
    // No revelar si el email ya existe (previene enumeración)
    if (error.message?.toLowerCase().includes('already registered')) {
      throw new Error('No se pudo completar el registro. Prueba con otro correo o inicia sesión.')
    }
    throw new Error('No se pudo crear la cuenta. Inténtalo de nuevo.')
  }

  return data
}

// ── signOut ───────────────────────────────────────────────
export async function signOut() {
  await supabase.auth.signOut()
  // Limpiar cualquier dato local por seguridad
  sessionStorage.clear()
  window.location.replace('/pages/public/login.html')
}

// ── forgotPassword ────────────────────────────────────────
export async function forgotPassword(email) {
  const clean = sanitize(email).toLowerCase().trim()
  if (!validateEmail(clean)) throw new Error('El correo no tiene un formato válido.')

  // Siempre responde con éxito para evitar enumeración de emails (OWASP)
  await supabase.auth.resetPasswordForEmail(clean, {
    redirectTo: `${window.location.origin}/pages/public/reset-password.html`
  })

  return true
}

// ── resetPassword ─────────────────────────────────────────
// Se llama desde reset-password.html tras hacer clic en el enlace del email.
// Supabase detecta el token en la URL automáticamente (detectSessionInUrl: true).
export async function resetPassword(newPassword) {
  const errors = validatePassword(newPassword)
  if (errors.length) throw new Error(errors[0])

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error('No se pudo actualizar la contraseña. Solicita un nuevo enlace.')
  return true
}

// ── resendVerification ────────────────────────────────────
export async function resendVerification(email) {
  const clean = sanitize(email).toLowerCase().trim()
  if (!validateEmail(clean)) throw new Error('El correo no tiene un formato válido.')

  const { error } = await supabase.auth.resend({ type: 'signup', email: clean })
  if (error) throw new Error('No se pudo reenviar el correo. Inténtalo en unos minutos.')
  return true
}

// ── getSession / getUser ──────────────────────────────────
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  // getUser() valida el JWT en el servidor (más seguro que getSession)
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ── onAuthChange ──────────────────────────────────────────
export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => callback(session))
}