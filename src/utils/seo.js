const SEO_CONFIG = {

  dashboard: {
    title: 'Dashboard | ALPHA-HELP',
    description:
      'Panel privado de sesiones y recursos.'
  },

  sessions: {
    title: 'Sesiones | ALPHA-HELP',
    description:
      'Sesiones privadas y contenido exclusivo.'
  },

  profile: {
    title: 'Perfil | ALPHA-HELP',
    description:
      'Gestión segura del perfil de usuario.'
  },

  login: {
    title: 'Iniciar sesión | ALPHA-HELP',
    description:
      'Acceso seguro a la plataforma privada.'
  },

  register: {
    title: 'Crear cuenta | ALPHA-HELP',
    description:
      'Registro seguro en la plataforma.'
  }

}

// ─────────────────────────────────────
// APPLY SEO
// ─────────────────────────────────────

export function applySEO() {

  const path =
    window.location.pathname

  let page = null

  if (
    path.includes('dashboard')
  ) {
    page = SEO_CONFIG.dashboard
  }

  else if (
    path.includes('sessions')
  ) {
    page = SEO_CONFIG.sessions
  }

  else if (
    path.includes('profile')
  ) {
    page = SEO_CONFIG.profile
  }

  else if (
    path.includes('login')
  ) {
    page = SEO_CONFIG.login
  }

  else if (
    path.includes('register')
  ) {
    page = SEO_CONFIG.register
  }

  if (!page) return

  // TITLE
  document.title =
    page.title

  // DESCRIPTION
  updateMeta(
    'description',
    page.description
  )

  // OG TITLE
  updateProperty(
    'og:title',
    page.title
  )

  // OG DESCRIPTION
  updateProperty(
    'og:description',
    page.description
  )

  // OG TYPE
  updateProperty(
    'og:type',
    'website'
  )

  // TWITTER
  updateMeta(
    'twitter:card',
    'summary_large_image'
  )

}

// ─────────────────────────────────────
// META HELPERS
// ─────────────────────────────────────

function updateMeta(
  name,
  content
) {

  let tag =
    document.querySelector(
      `meta[name="${name}"]`
    )

  if (!tag) {

    tag =
      document.createElement('meta')

    tag.setAttribute(
      'name',
      name
    )

    document.head.appendChild(tag)

  }

  tag.setAttribute(
    'content',
    content
  )

}

function updateProperty(
  property,
  content
) {

  let tag =
    document.querySelector(
      `meta[property="${property}"]`
    )

  if (!tag) {

    tag =
      document.createElement('meta')

    tag.setAttribute(
      'property',
      property
    )

    document.head.appendChild(tag)

  }

  tag.setAttribute(
    'content',
    content
  )

}