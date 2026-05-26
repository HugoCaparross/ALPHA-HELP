// ======================================================
// ROUTER
// ======================================================

import {

  initRouter,

  getCurrentPage

} from './lib/router.js';


// ======================================================
// AUTH
// ======================================================

import {

  listenAuthChanges,

  getSession,

  loginWithGoogle

} from './lib/auth.js';


// ======================================================
// LAYOUT
// ======================================================

import {

  renderPrivateLayout

} from './components/layout.js';


// ======================================================
// UI
// ======================================================

import {

  initDropdowns,

  initAccordions

} from './components/ui.js';


// ======================================================
// SEO
// ======================================================

import {

  applyLoginSEO,

  applyDashboardSEO,

  applySessionsSEO,

  applyResourcesSEO,

  applyProfileSEO,

  applyAdminSEO,

  trackPageView,

  setDefaultSEO

} from './utils/seo.js';


// ======================================================
// MODULES
// ======================================================

import {

  initDashboard

} from './modules/dashboard.js';

import {

  initSessions

} from './modules/sessions.js';

import {

  initResources,

  initResourceSearch

} from './modules/resources.js';

import {

  initProfile

} from './modules/profile.js';

import {

  initAdminDashboard,

  initAdminUsers,

  initAdminSessions

} from './modules/admin.js';


// ======================================================
// APP INIT
// ======================================================

document.addEventListener(

  'DOMContentLoaded',

  async () => {

    await initApp();
  }
);


// ======================================================
// INIT APP
// ======================================================

async function initApp() {

  try {

    // ROUTER

    await initRouter();

    // SEO

    initSEO();

    // UI

    initGlobalUI();

    // AUTH BUTTONS

    initAuthButtons();

    // AUTH SESSION

    await handleInitialSession();

    // AUTH LISTENER

    initAuthListener();

    // PRIVATE LAYOUT

    await initLayout();

    // PAGE MODULES

    await loadPageModule();

    // ANALYTICS

    initAnalytics();

  } catch (error) {

    console.error(
      'App initialization error:',
      error
    );
  }
}


// ======================================================
// INITIAL SESSION
// ======================================================

async function handleInitialSession() {

  try {

    const session =
      await getSession();

    const pathname =
      window.location.pathname;

    const isPublicPage =
      pathname.includes('/public/');

    const isAuthPage =

      pathname.includes('login') ||

      pathname.includes('register');

    if (

      session &&

      isPublicPage &&

      isAuthPage

    ) {

      window.location.href =
        '/src/pages/app/dashboard.html';
    }

  } catch (error) {

    console.error(
      'Session initialization error:',
      error
    );
  }
}


// ======================================================
// SEO
// ======================================================

function initSEO() {

  const page =
    getCurrentPage();

  setDefaultSEO();

  switch (page) {

    // PUBLIC

    case 'login':

      applyLoginSEO();

      break;

    // APP

    case 'dashboard':

      applyDashboardSEO();

      break;

    case 'sessions':

      applySessionsSEO();

      break;

    case 'resources':

      applyResourcesSEO();

      break;

    case 'profile':

      applyProfileSEO();

      break;

    // ADMIN

    case 'users':

    case 'announcements':

      applyAdminSEO();

      break;

    default:

      break;
  }

  trackPageView(page);
}


// ======================================================
// AUTH LISTENER
// ======================================================

function initAuthListener() {

  listenAuthChanges(

    async (event, session) => {

      console.info(
        'Auth event:',
        event
      );

      // SIGNED IN

      if (

        event === 'SIGNED_IN' &&

        session

      ) {

        const isPublicPage =

          window.location.pathname.includes(
            '/public/'
          );

        if (isPublicPage) {

          window.location.href =
            '/src/pages/app/dashboard.html';
        }
      }

      // SIGNED OUT

      if (
        event === 'SIGNED_OUT'
      ) {

        const isPrivatePage =

          window.location.pathname.includes(
            '/app/'
          ) ||

          window.location.pathname.includes(
            '/admin/'
          );

        if (isPrivatePage) {

          window.location.href =
            '/src/pages/public/login.html';
        }
      }

      // TOKEN REFRESH

      if (
        event === 'TOKEN_REFRESHED'
      ) {

        console.info(
          'Session refreshed'
        );
      }
    }
  );
}


// ======================================================
// GLOBAL UI
// ======================================================

function initGlobalUI() {

  initDropdowns();

  initAccordions();

  initKeyboardAccessibility();

  initExternalLinks();

  initLazyLoading();
}


// ======================================================
// AUTH BUTTONS
// ======================================================

function initAuthButtons() {

  const googleLoginButton =

    document.querySelector(
      '#google-login-button'
    );

  const googleRegisterButton =

    document.querySelector(
      '#google-register-button'
    );

  if (googleLoginButton) {

    googleLoginButton.addEventListener(

      'click',

      async () => {

        try {

          await loginWithGoogle();

        } catch (error) {

          console.error(error);
        }
      }
    );
  }

  if (googleRegisterButton) {

    googleRegisterButton.addEventListener(

      'click',

      async () => {

        try {

          await loginWithGoogle();

        } catch (error) {

          console.error(error);
        }
      }
    );
  }
}


// ======================================================
// LAYOUT
// ======================================================

async function initLayout() {

  const session =
    await getSession();

  if (!session) return;

  const isPublicPage =

    window.location.pathname.includes(
      '/public/'
    );

  if (isPublicPage) return;

  await renderPrivateLayout();
}


// ======================================================
// PAGE MODULES
// ======================================================

async function loadPageModule() {

  const page =
    getCurrentPage();

  switch (page) {

    // DASHBOARD

    case 'dashboard':

      if (
        window.location.pathname.includes(
          '/admin/'
        )
      ) {

        await initAdminDashboard();

      } else {

        await initDashboard();
      }

      break;

    // SESSIONS

    case 'sessions':

      if (
        window.location.pathname.includes(
          '/admin/'
        )
      ) {

        await initAdminSessions();

      } else {

        await initSessions();
      }

      break;

    // USERS

    case 'users':

      await initAdminUsers();

      break;

    // RESOURCES

    case 'resources':

      await initResources();

      initResourceSearch();

      break;

    // PROFILE

    case 'profile':

      await initProfile();

      break;

    default:

      break;
  }
}


// ======================================================
// ANALYTICS
// ======================================================

function initAnalytics() {

  initGoogleAnalytics();

  initClarity();
}


// ======================================================
// GOOGLE ANALYTICS
// ======================================================

function initGoogleAnalytics() {

  const GA_ID =
    import.meta.env.VITE_GA_ID;

  if (!GA_ID) return;

  const script =
    document.createElement(
      'script'
    );

  script.async = true;

  script.src =
    `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

  document.head.appendChild(script);

  window.dataLayer =
    window.dataLayer || [];

  function gtag() {

    dataLayer.push(arguments);
  }

  window.gtag = gtag;

  gtag('js', new Date());

  gtag('config', GA_ID);
}


// ======================================================
// MICROSOFT CLARITY
// ======================================================

function initClarity() {

  const clarityId =
    import.meta.env.VITE_CLARITY_ID;

  if (!clarityId) return;

  (function (c, l, a, r, i, t, y) {

    c[a] =

      c[a] ||

      function () {

        (c[a].q = c[a].q || [])
          .push(arguments);
      };

    t =
      l.createElement(r);

    t.async = 1;

    t.src =
      `https://www.clarity.ms/tag/${i}`;

    y =
      l.getElementsByTagName(r)[0];

    y.parentNode.insertBefore(
      t,
      y
    );

  })(

    window,
    document,
    'clarity',
    'script',
    clarityId
  );
}


// ======================================================
// ACCESSIBILITY
// ======================================================

function initKeyboardAccessibility() {

  document.addEventListener(

    'keydown',

    (event) => {

      // ESC CLOSE MODALS

      if (
        event.key === 'Escape'
      ) {

        const modal =

          document.querySelector(
            '.modal-overlay'
          );

        if (modal) {

          modal.remove();
        }
      }
    }
  );
}


// ======================================================
// EXTERNAL LINKS
// ======================================================

function initExternalLinks() {

  const links =

    document.querySelectorAll(
      'a[target="_blank"]'
    );

  links.forEach((link) => {

    link.setAttribute(

      'rel',

      'noopener noreferrer'
    );
  });
}


// ======================================================
// LAZY LOADING
// ======================================================

function initLazyLoading() {

  const images =

    document.querySelectorAll(
      'img'
    );

  images.forEach((image) => {

    image.loading = 'lazy';
  });
}