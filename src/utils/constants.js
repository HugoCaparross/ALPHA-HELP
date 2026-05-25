// src/utils/constants.js


// ======================================================
// APP
// ======================================================

export const APP_NAME =
  'ALPHA-HELP';

export const APP_VERSION =
  '1.0.0';

export const APP_DESCRIPTION =
  `
    Plataforma privada de intervención
    familiar y bienestar digital.
  `.trim();


// ======================================================
// URLS
// ======================================================

export const ROUTES = {

  // PUBLIC

  LOGIN:
    '/src/pages/public/login.html',

  REGISTER:
    '/src/pages/public/register.html',

  FORGOT_PASSWORD:
    '/src/pages/public/forgot-password.html',

  RESET_PASSWORD:
    '/src/pages/public/reset-password.html',

  PRIVACY:
    '/src/pages/public/privacy.html',

  COOKIES:
    '/src/pages/public/cookies.html',

  LEGAL_NOTICE:
    '/src/pages/public/legal-notice.html',

  TERMS:
    '/src/pages/public/terms.html',

  // APP

  DASHBOARD:
    '/src/pages/app/dashboard.html',

  SESSIONS:
    '/src/pages/app/sessions.html',

  RESOURCES:
    '/src/pages/app/resources.html',

  FAQ:
    '/src/pages/app/faq.html',

  CONTACT:
    '/src/pages/app/contact.html',

  PROFILE:
    '/src/pages/app/profile.html',

  // ADMIN

  ADMIN_DASHBOARD:
    '/src/pages/admin/dashboard.html',

  ADMIN_USERS:
    '/src/pages/admin/users.html',

  ADMIN_SESSIONS:
    '/src/pages/admin/sessions.html',

  ADMIN_ANNOUNCEMENTS:
    '/src/pages/admin/announcements.html'
};


// ======================================================
// STORAGE
// ======================================================

export const STORAGE_BUCKETS = {

  RESOURCES:
    'resources',

  AVATARS:
    'avatars'
};


// ======================================================
// REGIONS
// ======================================================

export const REGIONS = {

  ES: 'ES',

  LATAM: 'LATAM'
};


// ======================================================
// USER ROLES
// ======================================================

export const ROLES = {

  USER: 'user',

  ADMIN: 'admin'
};


// ======================================================
// SESSION STATUS
// ======================================================

export const SESSION_STATUS = {

  UPCOMING:
    'upcoming',

  AVAILABLE:
    'available',

  COMPLETED:
    'completed'
};


// ======================================================
// ANNOUNCEMENTS
// ======================================================

export const ANNOUNCEMENT_TYPES = {

  INFO:
    'info',

  WARNING:
    'warning',

  SUCCESS:
    'success'
};


// ======================================================
// RESOURCE TYPES
// ======================================================

export const RESOURCE_TYPES = {

  PDF:
    'pdf',

  VIDEO:
    'video',

  LINK:
    'link',

  GUIDE:
    'guide'
};


// ======================================================
// FORM LIMITS
// ======================================================

export const LIMITS = {

  PASSWORD_MIN_LENGTH:
    8,

  NAME_MAX_LENGTH:
    50,

  TITLE_MAX_LENGTH:
    120,

  DESCRIPTION_MAX_LENGTH:
    5000,

  MAX_AVATAR_SIZE_MB:
    3,

  MAX_RESOURCE_SIZE_MB:
    20
};


// ======================================================
// PAGINATION
// ======================================================

export const PAGINATION = {

  USERS_PER_PAGE:
    10,

  SESSIONS_PER_PAGE:
    9,

  RESOURCES_PER_PAGE:
    12
};


// ======================================================
// UI
// ======================================================

export const TOAST_DURATION =
  4500;

export const LOADER_DELAY =
  300;

export const MOBILE_BREAKPOINT =
  768;

export const TABLET_BREAKPOINT =
  1024;


// ======================================================
// SEO
// ======================================================

export const SEO = {

  DEFAULT_TITLE:
    'ALPHA-HELP',

  DEFAULT_DESCRIPTION:
    `
      Plataforma privada de intervención
      familiar, bienestar digital y
      educación tecnológica.
    `.trim(),

  KEYWORDS: [

    'intervención familiar',

    'bienestar digital',

    'educación digital',

    'uso responsable pantallas',

    'salud digital familiar',

    'acompañamiento familiar',

    'nuevas tecnologías',

    'formación familias'
  ],

  OG_IMAGE:
    '/public/og-image.jpg'
};


// ======================================================
// ANALYTICS
// ======================================================

export const ANALYTICS = {

  GA_ID:
    import.meta.env.VITE_GA_ID,

  CLARITY_ID:
    import.meta.env.VITE_CLARITY_ID
};


// ======================================================
// SUPPORT
// ======================================================

export const SUPPORT = {

  EMAIL:
    'support@alpha-help.com',

  LEGAL_EMAIL:
    'legal@alpha-help.com'
};


// ======================================================
// SOCIALS
// ======================================================

export const SOCIALS = {

  INSTAGRAM:
    '',

  YOUTUBE:
    '',

  LINKEDIN:
    ''
};


// ======================================================
// VIDEO PROVIDERS
// ======================================================

export const VIDEO_PROVIDERS = {

  YOUTUBE:
    'youtube',

  VIMEO:
    'vimeo',

  ZOOM:
    'zoom'
};


// ======================================================
// LOCAL STORAGE KEYS
// ======================================================

export const STORAGE_KEYS = {

  SESSION:
    'alpha-help-session',

  USER:
    'alpha-help-user',

  THEME:
    'alpha-help-theme',

  COOKIES:
    'alpha-help-cookies'
};


// ======================================================
// HTTP STATUS
// ======================================================

export const HTTP_STATUS = {

  SUCCESS:
    200,

  CREATED:
    201,

  UNAUTHORIZED:
    401,

  FORBIDDEN:
    403,

  NOT_FOUND:
    404,

  SERVER_ERROR:
    500
};


// ======================================================
// ERROR MESSAGES
// ======================================================

export const ERROR_MESSAGES = {

  GENERIC:
    'Ha ocurrido un error inesperado.',

  NETWORK:
    'Error de conexión.',

  AUTH:
    'No autorizado.',

  SESSION_EXPIRED:
    'Tu sesión ha expirado.',

  VALIDATION:
    'Revisa los campos del formulario.'
};


// ======================================================
// SUCCESS MESSAGES
// ======================================================

export const SUCCESS_MESSAGES = {

  LOGIN:
    'Sesión iniciada correctamente.',

  REGISTER:
    'Cuenta creada correctamente.',

  PROFILE_UPDATED:
    'Perfil actualizado.',

  PASSWORD_UPDATED:
    'Contraseña actualizada.',

  SESSION_COMPLETED:
    'Sesión completada.'
};


// ======================================================
// DEFAULT AVATAR
// ======================================================

export const DEFAULT_AVATAR =
  '/src/assets/images/default-avatar.png';


// ======================================================
// MONTHS
// ======================================================

export const MONTHS = [

  'Enero',

  'Febrero',

  'Marzo',

  'Abril',

  'Mayo',

  'Junio',

  'Julio',

  'Agosto',

  'Septiembre',

  'Octubre',

  'Noviembre',

  'Diciembre'
];