// src/utils/seo.js

import {
  APP_NAME,
  SEO
} from './constants.js';


// ======================================================
// DEFAULT SEO
// ======================================================

export function setDefaultSEO() {

  updateTitle(
    SEO.DEFAULT_TITLE
  );

  updateDescription(
    SEO.DEFAULT_DESCRIPTION
  );

  updateKeywords(
    SEO.KEYWORDS
  );

  updateOpenGraph({

    title:
      SEO.DEFAULT_TITLE,

    description:
      SEO.DEFAULT_DESCRIPTION,

    image:
      SEO.OG_IMAGE
  });
}


// ======================================================
// PAGE SEO
// ======================================================

export function setPageSEO({
  title = APP_NAME,
  description = SEO.DEFAULT_DESCRIPTION,
  keywords = [],
  image = SEO.OG_IMAGE,
  noIndex = false,
  structuredData = null
} = {}) {

  updateTitle(title);

  updateDescription(description);

  updateKeywords([
    ...SEO.KEYWORDS,
    ...keywords
  ]);

  updateOpenGraph({
    title,
    description,
    image
  });

  updateRobots(noIndex);

  if (structuredData) {
    setStructuredData(
      structuredData
    );
  }
}


// ======================================================
// TITLE
// ======================================================

export function updateTitle(title) {

  document.title =
    `${title} | ${APP_NAME}`;
}


// ======================================================
// DESCRIPTION
// ======================================================

export function updateDescription(
  description
) {

  updateMetaTag(
    'description',
    description
  );
}


// ======================================================
// KEYWORDS
// ======================================================

export function updateKeywords(
  keywords = []
) {

  const content =
    keywords.join(', ');

  updateMetaTag(
    'keywords',
    content
  );
}


// ======================================================
// OPEN GRAPH
// ======================================================

export function updateOpenGraph({
  title,
  description,
  image
}) {

  updateMetaProperty(
    'og:title',
    title
  );

  updateMetaProperty(
    'og:description',
    description
  );

  updateMetaProperty(
    'og:image',
    image
  );

  updateMetaProperty(
    'og:type',
    'website'
  );

  updateMetaProperty(
    'og:site_name',
    APP_NAME
  );

  updateMetaProperty(
    'og:url',
    window.location.href
  );
}


// ======================================================
// TWITTER
// ======================================================

export function updateTwitterCard({
  title,
  description,
  image
}) {

  updateMetaName(
    'twitter:card',
    'summary_large_image'
  );

  updateMetaName(
    'twitter:title',
    title
  );

  updateMetaName(
    'twitter:description',
    description
  );

  updateMetaName(
    'twitter:image',
    image
  );
}


// ======================================================
// ROBOTS
// ======================================================

export function updateRobots(
  noIndex = false
) {

  const content =
    noIndex
      ? 'noindex,nofollow'
      : 'index,follow';

  updateMetaName(
    'robots',
    content
  );
}


// ======================================================
// STRUCTURED DATA
// ======================================================

export function setStructuredData(
  data
) {

  removeStructuredData();

  const script =
    document.createElement('script');

  script.type =
    'application/ld+json';

  script.id =
    'structured-data';

  script.textContent =
    JSON.stringify(data);

  document.head.appendChild(script);
}


// ======================================================
// REMOVE STRUCTURED DATA
// ======================================================

export function removeStructuredData() {

  const existing =
    document.getElementById(
      'structured-data'
    );

  if (existing) {
    existing.remove();
  }
}


// ======================================================
// META HELPERS
// ======================================================

function updateMetaTag(
  name,
  content
) {

  let meta =
    document.querySelector(
      `meta[name="${name}"]`
    );

  if (!meta) {

    meta =
      document.createElement('meta');

    meta.setAttribute(
      'name',
      name
    );

    document.head.appendChild(meta);
  }

  meta.setAttribute(
    'content',
    content
  );
}


function updateMetaProperty(
  property,
  content
) {

  let meta =
    document.querySelector(
      `meta[property="${property}"]`
    );

  if (!meta) {

    meta =
      document.createElement('meta');

    meta.setAttribute(
      'property',
      property
    );

    document.head.appendChild(meta);
  }

  meta.setAttribute(
    'content',
    content
  );
}


function updateMetaName(
  name,
  content
) {

  let meta =
    document.querySelector(
      `meta[name="${name}"]`
    );

  if (!meta) {

    meta =
      document.createElement('meta');

    meta.setAttribute(
      'name',
      name
    );

    document.head.appendChild(meta);
  }

  meta.setAttribute(
    'content',
    content
  );
}


// ======================================================
// PAGE TYPES
// ======================================================

export function applyLoginSEO() {

  setPageSEO({

    title:
      'Login',

    description:
      `
        Plataforma privada de intervención
        familiar y bienestar digital.
      `.trim(),

    keywords: [

      'intervención familiar',

      'bienestar digital',

      'educación digital'
    ]
  });
}


export function applyDashboardSEO() {

  setPageSEO({

    title:
      'Dashboard',

    noIndex: true
  });
}


export function applySessionsSEO() {

  setPageSEO({

    title:
      'Sesiones',

    noIndex: true
  });
}


export function applyResourcesSEO() {

  setPageSEO({

    title:
      'Recursos',

    noIndex: true
  });
}


export function applyProfileSEO() {

  setPageSEO({

    title:
      'Perfil',

    noIndex: true
  });
}


export function applyAdminSEO() {

  setPageSEO({

    title:
      'Administración',

    noIndex: true
  });
}


// ======================================================
// CANONICAL URL
// ======================================================

export function setCanonicalUrl(
  url = window.location.href
) {

  let canonical =
    document.querySelector(
      'link[rel="canonical"]'
    );

  if (!canonical) {

    canonical =
      document.createElement('link');

    canonical.setAttribute(
      'rel',
      'canonical'
    );

    document.head.appendChild(
      canonical
    );
  }

  canonical.setAttribute(
    'href',
    url
  );
}


// ======================================================
// FAVICON
// ======================================================

export function setFavicon(
  href
) {

  let favicon =
    document.querySelector(
      'link[rel="icon"]'
    );

  if (!favicon) {

    favicon =
      document.createElement('link');

    favicon.rel = 'icon';

    document.head.appendChild(
      favicon
    );
  }

  favicon.href = href;
}


// ======================================================
// PAGE ANALYTICS
// ======================================================

export function trackPageView(
  pageName
) {

  if (
    typeof window.gtag !== 'function'
  ) {
    return;
  }

  window.gtag(
    'event',
    'page_view',
    {

      page_title:
        pageName,

      page_location:
        window.location.href,

      page_path:
        window.location.pathname
    }
  );
}