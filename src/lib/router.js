// src/lib/router.js

import {
  requireAuth,
  requireAdmin
} from './auth.js';


// ======================================================
// ROUTES
// ======================================================

const PUBLIC_ROUTES = [

  '/src/pages/public/login.html',

  '/src/pages/public/register.html',

  '/src/pages/public/forgot-password.html',

  '/src/pages/public/reset-password.html',

  '/src/pages/public/privacy.html',

  '/src/pages/public/cookies.html',

  '/src/pages/public/legal-notice.html',

  '/src/pages/public/terms.html',

  '/src/pages/public/404.html'
];


const ADMIN_ROUTES = [

  '/src/pages/admin/dashboard.html',

  '/src/pages/admin/users.html',

  '/src/pages/admin/sessions.html',

  '/src/pages/admin/announcements.html'
];


// ======================================================
// INIT ROUTER
// ======================================================

export async function initRouter() {

  const currentPath =
    window.location.pathname;

  // PUBLIC

  if (isPublicRoute(currentPath)) {
    return;
  }

  // ADMIN

  if (isAdminRoute(currentPath)) {

    const isAdmin =
      await requireAdmin();

    if (!isAdmin) {
      return;
    }

    return;
  }

  // PRIVATE

  const authenticated =
    await requireAuth();

  if (!authenticated) {
    return;
  }
}


// ======================================================
// PUBLIC ROUTE
// ======================================================

export function isPublicRoute(path) {

  return PUBLIC_ROUTES.some(route =>
    path.includes(route)
  );
}


// ======================================================
// ADMIN ROUTE
// ======================================================

export function isAdminRoute(path) {

  return ADMIN_ROUTES.some(route =>
    path.includes(route)
  );
}


// ======================================================
// REDIRECT IF AUTHENTICATED
// ======================================================

export async function redirectIfAuthenticated() {

  const {
    getSession
  } = await import('./auth.js');

  const session =
    await getSession();

  if (!session) return;

  const currentPath =
    window.location.pathname;

  if (isPublicRoute(currentPath)) {

    window.location.href =
      '/src/pages/app/dashboard.html';
  }
}


// ======================================================
// NAVIGATE
// ======================================================

export function navigate(path) {

  if (!path) return;

  window.location.href = path;
}


// ======================================================
// BACK
// ======================================================

export function goBack() {

  window.history.back();
}


// ======================================================
// CURRENT PAGE
// ======================================================

export function getCurrentPage() {

  const path =
    window.location.pathname;

  return path
    .split('/')
    .pop()
    ?.replace('.html', '');
}


// ======================================================
// PAGE TITLE
// ======================================================

export function setPageTitle(title) {

  document.title =
    `${title} | ALPHA-HELP`;
}


// ======================================================
// ACTIVE NAVIGATION
// ======================================================

export function setActiveNavLink() {

  const currentPage =
    getCurrentPage();

  const links =
    document.querySelectorAll(
      '[data-nav-link]'
    );

  links.forEach(link => {

    const page =
      link.dataset.navLink;

    if (page === currentPage) {

      link.classList.add('active');

    } else {

      link.classList.remove('active');
    }
  });
}


// ======================================================
// NOT FOUND
// ======================================================

export function redirectTo404() {

  window.location.href =
    '/src/pages/public/404.html';
}


// ======================================================
// LOGOUT ROUTE
// ======================================================

export async function handleLogoutRoute() {

  const logoutButton =
    document.querySelector(
      '[data-logout]'
    );

  if (!logoutButton) return;

  const {
    logout
  } = await import('./auth.js');

  logoutButton.addEventListener(
    'click',
    async () => {

      await logout();
    }
  );
}


// ======================================================
// PROTECTED PAGE INIT
// ======================================================

export async function initProtectedPage() {

  const authenticated =
    await requireAuth();

  if (!authenticated) {
    return false;
  }

  setActiveNavLink();

  await handleLogoutRoute();

  return true;
}


// ======================================================
// ADMIN PAGE INIT
// ======================================================

export async function initAdminPage() {

  const admin =
    await requireAdmin();

  if (!admin) {
    return false;
  }

  setActiveNavLink();

  await handleLogoutRoute();

  return true;
}