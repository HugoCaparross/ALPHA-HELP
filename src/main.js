// src/main.js

import {
  initRouter,
  getCurrentPage
} from './lib/router.js';

import {
  listenAuthChanges,
  getSession
} from './lib/auth.js';

import {
  renderPrivateLayout
} from './components/layout.js';

import {
  initDropdowns,
  initAccordions
} from './components/ui.js';

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

    // AUTH LISTENER

    initAuthListener();

    // GLOBAL UI

    initGlobalUI();

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

      // SESSION EXPIRED

      if (
        event === 'SIGNED_OUT'
      ) {

        const publicPage =
          window.location.pathname.includes(
            '/public/'
          );

        if (!publicPage) {

          window.location.href =
            '/src/pages/public/login.html';
        }
      }

      // SIGNED IN

      if (
        event === 'SIGNED_IN'
      ) {

        console.info(
          'User authenticated'
        );
      }

      // TOKEN REFRESH

      if (
        event === 'TOKEN_REFRESHED'
      ) {

        console.info(
          'Token refreshed'
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
// LAYOUT
// ======================================================

async function initLayout() {

  const session =
    await getSession();

  if (!session) return;

  const isPublic =
    window.location.pathname.includes(
      '/public/'
    );

  if (isPublic) return;

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
    document.createElement('script');

  script.async = true;

  script.src =
    `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

  document.head.appendChild(
    script
  );

  window.dataLayer =
    window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }

  window.gtag = gtag;

  gtag(
    'js',
    new Date()
  );

  gtag(
    'config',
    GA_ID
  );
}


// ======================================================
// MICROSOFT CLARITY
// ======================================================

function initClarity() {

  const clarityId =
    import.meta.env.VITE_CLARITY_ID;

  if (!clarityId) return;

  (function(c,l,a,r,i,t,y){

    c[a] = c[a] || function(){
      (c[a].q = c[a].q || []).push(arguments);
    };

    t = l.createElement(r);

    t.async = 1;

    t.src =
      `https://www.clarity.ms/tag/${i}`;

    y = l.getElementsByTagName(r)[0];

    y.parentNode.insertBefore(t,y);

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
    event => {

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

  links.forEach(link => {

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

  images.forEach(image => {

    image.loading = 'lazy';
  });
}