// src/utils/helpers.js


// ======================================================
// DATE
// ======================================================

export function formatDate(
  date,
  locale = 'es-ES'
) {

  if (!date) return '';

  return new Intl.DateTimeFormat(
    locale,
    {

      day: '2-digit',

      month: 'long',

      year: 'numeric'
    }
  ).format(new Date(date));
}


// ======================================================
// TIME
// ======================================================

export function formatTime(
  date,
  locale = 'es-ES'
) {

  if (!date) return '';

  return new Intl.DateTimeFormat(
    locale,
    {

      hour: '2-digit',

      minute: '2-digit'
    }
  ).format(new Date(date));
}


// ======================================================
// DATETIME
// ======================================================

export function formatDateTime(
  date,
  locale = 'es-ES'
) {

  if (!date) return '';

  return new Intl.DateTimeFormat(
    locale,
    {

      day: '2-digit',

      month: 'long',

      year: 'numeric',

      hour: '2-digit',

      minute: '2-digit'
    }
  ).format(new Date(date));
}


// ======================================================
// RELATIVE TIME
// ======================================================

export function timeAgo(date) {

  if (!date) return '';

  const now =
    new Date();

  const target =
    new Date(date);

  const seconds =
    Math.floor(
      (now - target) / 1000
    );

  const intervals = [

    {
      label: 'año',
      seconds: 31536000
    },

    {
      label: 'mes',
      seconds: 2592000
    },

    {
      label: 'día',
      seconds: 86400
    },

    {
      label: 'hora',
      seconds: 3600
    },

    {
      label: 'minuto',
      seconds: 60
    }
  ];

  for (const interval of intervals) {

    const count =
      Math.floor(
        seconds / interval.seconds
      );

    if (count >= 1) {

      return `Hace ${count} ${interval.label}${count > 1 ? 's' : ''}`;
    }
  }

  return 'Hace unos segundos';
}


// ======================================================
// DEBOUNCE
// ======================================================

export function debounce(
  callback,
  delay = 300
) {

  let timeout;

  return (...args) => {

    clearTimeout(timeout);

    timeout = setTimeout(() => {

      callback(...args);

    }, delay);
  };
}


// ======================================================
// THROTTLE
// ======================================================

export function throttle(
  callback,
  limit = 300
) {

  let waiting = false;

  return (...args) => {

    if (waiting) return;

    callback(...args);

    waiting = true;

    setTimeout(() => {

      waiting = false;

    }, limit);
  };
}


// ======================================================
// SLUGIFY
// ======================================================

export function slugify(text = '') {

  return text

    .toLowerCase()

    .trim()

    .normalize('NFD')

    .replace(/[\u0300-\u036f]/g, '')

    .replace(/[^a-z0-9 ]/g, '')

    .replace(/\s+/g, '-');
}


// ======================================================
// CLAMP
// ======================================================

export function clamp(
  value,
  min,
  max
) {

  return Math.min(
    Math.max(value, min),
    max
  );
}


// ======================================================
// RANDOM ID
// ======================================================

export function generateId(
  prefix = 'id'
) {

  return `
    ${prefix}-${Math.random()
      .toString(36)
      .substring(2, 10)}
  `.trim();
}


// ======================================================
// COPY TO CLIPBOARD
// ======================================================

export async function copyToClipboard(
  text
) {

  try {

    await navigator.clipboard.writeText(
      text
    );

    return true;

  } catch (error) {

    console.error(error);

    return false;
  }
}


// ======================================================
// SCROLL
// ======================================================

export function scrollToElement(
  selector,
  offset = 0
) {

  const element =
    document.querySelector(selector);

  if (!element) return;

  const top =
    element.getBoundingClientRect().top
    + window.pageYOffset
    - offset;

  window.scrollTo({

    top,

    behavior: 'smooth'
  });
}


// ======================================================
// QUERY PARAMS
// ======================================================

export function getQueryParam(key) {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get(key);
}


// ======================================================
// SET QUERY PARAM
// ======================================================

export function setQueryParam(
  key,
  value
) {

  const url =
    new URL(window.location);

  url.searchParams.set(
    key,
    value
  );

  window.history.replaceState(
    {},
    '',
    url
  );
}


// ======================================================
// REMOVE QUERY PARAM
// ======================================================

export function removeQueryParam(
  key
) {

  const url =
    new URL(window.location);

  url.searchParams.delete(key);

  window.history.replaceState(
    {},
    '',
    url
  );
}


// ======================================================
// STORAGE
// ======================================================

export function saveToStorage(
  key,
  value
) {

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}


export function getFromStorage(
  key,
  fallback = null
) {

  try {

    const value =
      localStorage.getItem(key);

    return value
      ? JSON.parse(value)
      : fallback;

  } catch {

    return fallback;
  }
}


export function removeFromStorage(
  key
) {

  localStorage.removeItem(key);
}


// ======================================================
// SESSION STORAGE
// ======================================================

export function saveToSession(
  key,
  value
) {

  sessionStorage.setItem(
    key,
    JSON.stringify(value)
  );
}


export function getFromSession(
  key,
  fallback = null
) {

  try {

    const value =
      sessionStorage.getItem(key);

    return value
      ? JSON.parse(value)
      : fallback;

  } catch {

    return fallback;
  }
}


// ======================================================
// CAPITALIZE
// ======================================================

export function capitalize(
  text = ''
) {

  if (!text) return '';

  return (
    text.charAt(0).toUpperCase()
    + text.slice(1)
  );
}


// ======================================================
// TRUNCATE
// ======================================================

export function truncate(
  text = '',
  length = 100
) {

  if (text.length <= length) {
    return text;
  }

  return `
    ${text.slice(0, length)}...
  `.trim();
}


// ======================================================
// LOADING BUTTON
// ======================================================

export function setButtonLoading(
  button,
  loading = true
) {

  if (!button) return;

  if (loading) {

    button.dataset.originalText =
      button.innerHTML;

    button.disabled = true;

    button.innerHTML = `
      <span class="btn-loader"></span>
      Cargando...
    `;

  } else {

    button.disabled = false;

    button.innerHTML =
      button.dataset.originalText
      || 'Enviar';
  }
}


// ======================================================
// FILE SIZE
// ======================================================

export function formatFileSize(bytes) {

  if (!bytes) return '0 KB';

  const units = [
    'B',
    'KB',
    'MB',
    'GB'
  ];

  let size = bytes;

  let unitIndex = 0;

  while (
    size >= 1024 &&
    unitIndex < units.length - 1
  ) {

    size /= 1024;

    unitIndex++;
  }

  return `
    ${size.toFixed(1)}
    ${units[unitIndex]}
  `.trim();
}


// ======================================================
// DOWNLOAD FILE
// ======================================================

export function downloadFile(
  url,
  filename = ''
) {

  const link =
    document.createElement('a');

  link.href = url;

  link.download = filename;

  document.body.appendChild(link);

  link.click();

  link.remove();
}


// ======================================================
// MOBILE CHECK
// ======================================================

export function isMobile() {

  return window.innerWidth <= 768;
}


// ======================================================
// TABLET CHECK
// ======================================================

export function isTablet() {

  return (
    window.innerWidth > 768
    &&
    window.innerWidth <= 1024
  );
}


// ======================================================
// DESKTOP CHECK
// ======================================================

export function isDesktop() {

  return window.innerWidth > 1024;
}