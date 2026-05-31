// src/components/layout.js

import { getMyProfile } from "../lib/db.js";

import { logout } from "../lib/auth.js";

import { getCurrentPage } from "../lib/router.js";

// ======================================================
// PRIVATE LAYOUT
// ======================================================

export async function renderPrivateLayout() {
  const profile = await getMyProfile();

  renderSidebar(profile);

  renderTopbar(profile);

  renderFooter();

  setActiveNavigation();
}

// ======================================================
// SIDEBAR
// ======================================================

function renderSidebar(profile) {
  const sidebar = document.querySelector("#sidebar");

  if (!sidebar) return;

  sidebar.innerHTML = `
    <aside class="sidebar">

      <div class="sidebar-header">

        <a
          href="/src/pages/app/dashboard.html"
          class="sidebar-logo"
        >
          <img
            src="/src/assets/images/logo.png"
            alt="ALPHA-HELP"
          >
        </a>

      </div>

      <nav class="sidebar-nav">

        ${renderNavLinks(profile)}

      </nav>

      <div class="sidebar-footer">

        <div class="sidebar-user">

  <div class="sidebar-user-avatar">
    ${(profile?.full_name || profile?.email || "U").charAt(0).toUpperCase()}
  </div>

  <div>

    <span class="sidebar-user-name">
      ${profile?.full_name || profile?.email || "Usuario"}
    </span>

    <span class="sidebar-user-region">
      ${profile?.region || ""}
    </span>

  </div>

</div>

      </div>

    </aside>
  `;
}

// ======================================================
// NAV LINKS
// ======================================================

function renderNavLinks(profile) {
  const links = [
    {
      label: "Inicio",
      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9.5L12 2l9 7.5"/>
        <path d="M9 22V12h6v10"/>
      </svg>
    `,
      href: "/src/pages/app/dashboard.html",
      page: "dashboard",
    },

    {
      label: "Sesiones",
      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    `,
      href: "/src/pages/app/sessions.html",
      page: "sessions",
    },

    {
      label: "Cuestionarios",
      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    `,
      href: "/src/pages/app/questionnaires.html",
      page: "questionnaires",
    },

    {
      label: "Recursos",
      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    `,
      href: "/src/pages/app/resources.html",
      page: "resources",
    },

    {
      label: "Ayuda",
      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    `,
      href: "/src/pages/app/faq.html",
      page: "faq",
    },

    {
      label: "Mi perfil",
      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21a8 8 0 0 0-16 0"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    `,
      href: "/src/pages/app/profile.html",
      page: "profile",
    },
  ];

  // ADMIN

  if (profile.is_admin) {
    links.push({
      label: "Administración",

      icon: "⚙️",

      href: "/src/pages/admin/dashboard.html",

      page: "admin",
    });
  }

  return links
    .map(
      (link) => `

<a
  href="${link.href}"
  class="sidebar-link ${isActive ? "active" : ""}"
>

  <div class="sidebar-link-icon">
    ${link.icon}
  </div>

  <span>
    ${link.label}
  </span>

</a>

  `,
    )
    .join("");
}

// ======================================================
// TOPBAR
// ======================================================

function renderTopbar(profile) {
  const topbar = document.querySelector("#topbar");

  if (!topbar) return;

  topbar.innerHTML = `
    <header class="topbar">

      <div class="topbar-left">

        <button
          class="mobile-menu-button"
          id="mobile-menu-button"
        >
          ☰
        </button>

        <div class="breadcrumbs">

          <span class="breadcrumbs-page">
            ${formatPageName()}
          </span>

        </div>

      </div>

      <div class="topbar-right">

        <div
          class="topbar-profile"
          data-dropdown
        >

          <button
            class="topbar-profile-trigger"
            data-dropdown-trigger
          >

            <div class="topbar-avatar">
              ${getInitials(profile.full_name)}
            </div>

            <span class="topbar-name">
              ${profile.full_name}
            </span>

          </button>

          <div
            class="topbar-dropdown"
            data-dropdown-menu
          >

            <a
              href="/src/pages/app/profile.html"
              class="topbar-dropdown-link"
            >
              Perfil
            </a>

            <button
              class="topbar-dropdown-link logout-button"
              id="logout-button"
            >
              Cerrar sesión
            </button>

          </div>

        </div>

      </div>

    </header>
  `;

  initLogout();

  initMobileSidebar();
}

// ======================================================
// FOOTER
// ======================================================

function renderFooter() {
  const footer = document.querySelector("#footer");

  if (!footer) return;

  footer.innerHTML = `
    <footer class="footer">

      <div class="footer-content">

        <p class="footer-copy">
          © ${new Date().getFullYear()}
          ALPHA-HELP.
          Todos los derechos reservados.
        </p>

        <div class="footer-links">

          <a
            href="/src/pages/public/privacy.html"
          >
            Privacidad
          </a>

          <a
            href="/src/pages/public/cookies.html"
          >
            Cookies
          </a>

          <a
            href="/src/pages/public/legal-notice.html"
          >
            Aviso legal
          </a>

          <a
            href="/src/pages/public/terms.html"
          >
            Términos
          </a>

        </div>

      </div>

    </footer>
  `;
}

// ======================================================
// ACTIVE NAVIGATION
// ======================================================

function setActiveNavigation() {
  const currentPage = getCurrentPage();

  const links = document.querySelectorAll("[data-nav-link]");

  links.forEach((link) => {
    const page = link.dataset.navLink;

    if (currentPage.includes(page)) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ======================================================
// LOGOUT
// ======================================================

function initLogout() {
  const logoutButton = document.getElementById("logout-button");

  if (!logoutButton) return;

  logoutButton.addEventListener("click", async () => {
    await logout();
  });
}

// ======================================================
// MOBILE SIDEBAR
// ======================================================

function initMobileSidebar() {
  const button = document.getElementById("mobile-menu-button");

  const sidebar = document.querySelector(".sidebar");

  if (!button || !sidebar) return;

  button.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-open");
  });
}

// ======================================================
// HELPERS
// ======================================================

function getInitials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatPageName() {
  const page = getCurrentPage();

  if (!page) return "Dashboard";

  const names = {
    dashboard: "Dashboard",

    sessions: "Sesiones",

    resources: "Recursos",

    faq: "FAQ",

    contact: "Contacto",

    profile: "Perfil",

    users: "Usuarios",

    announcements: "Avisos",
  };

  return names[page] || "ALPHA-HELP";
}
