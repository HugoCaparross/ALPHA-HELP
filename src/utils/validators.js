// ─────────────────────────────────────
// SANITIZE
// ─────────────────────────────────────

export function sanitize(value = '') {

  return value
    .trim()
    .replace(/\s+/g, ' ')
}

// ─────────────────────────────────────
// EMAIL
// ─────────────────────────────────────

export function sanitizeEmail(email = '') {

  return sanitize(email)
    .toLowerCase()
}

export function isValidEmail(email = '') {

  const cleanEmail =
    sanitizeEmail(email)

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(cleanEmail)
}

// ─────────────────────────────────────
// PASSWORD
// ─────────────────────────────────────

export function isValidPassword(
  password = ''
) {

  return (
    password.length >= 8
  )
}

// ─────────────────────────────────────
// NAME
// ─────────────────────────────────────

export function isValidName(
  name = ''
) {

  const cleanName =
    sanitize(name)

  return (
    cleanName.length >= 2
    && cleanName.length <= 80
  )
}

// ─────────────────────────────────────
// REGION
// ─────────────────────────────────────

export function isValidRegion(
  region = ''
) {

  return (
    region === 'ES'
    || region === 'LATAM'
  )
}

// ─────────────────────────────────────
// URL
// ─────────────────────────────────────

export function isValidUrl(
  url = ''
) {

  try {

    new URL(url)

    return true

  } catch {

    return false

  }
}

// ─────────────────────────────────────
// HTML ESCAPE
// ─────────────────────────────────────

export function escapeHtml(
  unsafe = ''
) {

  return unsafe

    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ─────────────────────────────────────
// FILE VALIDATION
// ─────────────────────────────────────

export function validateImageFile(
  file
) {

  if (!file) {
    return false
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ]

  const maxSize =
    2 * 1024 * 1024

  return (
    allowedTypes.includes(file.type)
    && file.size <= maxSize
  )
}

// ─────────────────────────────────────
// FORM ERRORS
// ─────────────────────────────────────

export function getPasswordError(
  password = ''
) {

  if (!password) {
    return 'Introduce una contraseña.'
  }

  if (password.length < 8) {
    return 'La contraseña debe tener mínimo 8 caracteres.'
  }

  return ''
}

export function getEmailError(
  email = ''
) {

  if (!email) {
    return 'Introduce tu correo.'
  }

  if (!isValidEmail(email)) {
    return 'Correo electrónico inválido.'
  }

  return ''
}

export function getNameError(
  name = ''
) {

  if (!name) {
    return 'Introduce tu nombre.'
  }

  if (!isValidName(name)) {
    return 'Nombre inválido.'
  }

  return ''
}

// ─────────────────────────────────────
// SAFE ARRAY
// ─────────────────────────────────────

export function safeArray(data) {

  return Array.isArray(data)
    ? data
    : []
}

// ─────────────────────────────────────
// SAFE TEXT
// ─────────────────────────────────────

export function safeText(
  value = ''
) {

  if (
    value === null
    || value === undefined
  ) {
    return ''
  }

  return String(value)
}