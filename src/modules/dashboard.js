// src/modules/dashboard.js

import {
  getMyProfile,
  getMySessions,
  getUpcomingSession,
  getAnnouncements,
  getUserProgress,
} from "../lib/db.js";

import { showLoader, hideLoader, renderEmptyState } from "../components/ui.js";

import { formatDate, formatTime } from "../utils/helpers.js";

// ======================================================
// INIT DASHBOARD
// ======================================================

export async function initDashboard() {
  try {
    showLoader();

    const [profile, sessions, upcomingSession, announcements, progress] =
      await Promise.all([
        getMyProfile(),

        getMySessions(),

        getUpcomingSession(),

        getAnnouncements(),

        getUserProgress(),
      ]);

    renderWelcome(profile);

    renderUpcomingSession(upcomingSession);

    renderQuestionnaireCard();

    renderAnnouncements(announcements);

    renderRecentSessions(sessions);
  } catch (error) {
    console.error(error);

    renderDashboardError();
  } finally {
    hideLoader();
  }
}

// ======================================================
// WELCOME
// ======================================================

function renderWelcome(profile) {
  const container = document.getElementById("dashboard-welcome");

  if (!container) return;

  const firstName = profile.full_name.split(" ")[0];

  container.innerHTML = `
    <div class="dashboard-welcome-card">

      <div>

<h1 class="dashboard-title">
  Bienvenido de vuelta, ${firstName} 👋
</h1>

<p class="dashboard-subtitle">

Continúa tu recorrido en ALPHA-HELP.

Completa tus cuestionarios y accede a las grabaciones de tu programa.

Todo el contenido está disponible desde el menú lateral.

</p>

      </div>

      <div class="dashboard-region">

        <span class="dashboard-region-badge">
          ${profile.region}
        </span>

      </div>

    </div>
  `;
}

// ======================================================
// UPCOMING SESSION
// ======================================================

function renderUpcomingSession(session) {
  const container = document.getElementById("dashboard-next-session");

  if (!container) return;

  if (!session) {
    const empty = renderEmptyState({
      icon: "📅",

      title: "No hay próximas sesiones",

      description: "Las nuevas sesiones aparecerán aquí automáticamente.",
    });

    container.appendChild(empty);

    return;
  }

  container.innerHTML = `
    <div class="dashboard-widget">

      <div class="dashboard-widget-header">

        <h2>
          Próxima sesión
        </h2>

      </div>

      <div class="next-session-card">

        <div class="next-session-month">

          Sesión
          ${session.month_number}

        </div>

        <h3 class="next-session-title">
          ${session.title}
        </h3>

        <div class="next-session-meta">

          <span>
            📅
            ${formatDate(session.live_at)}
          </span>

          <span>
            🕒
            ${formatTime(session.live_at)}
          </span>

        </div>

        <a
          href="/src/pages/app/sessions.html"
          class="btn btn-primary"
        >
          Ver sesiones
        </a>

      </div>

    </div>
  `;
}

// ======================================================
// QUESTIONNAIRE
// ======================================================

function renderQuestionnaireCard() {
  const container = document.getElementById("dashboard-questionnaire");

  if (!container) return;

  container.innerHTML = `

    <div class="dashboard-widget">

      <div class="dashboard-widget-header">

        <h2>
          Cuestionario
        </h2>

      </div>

      <span class="questionnaire-status">
        Pendiente
      </span>

      <h3 class="questionnaire-title">
        Cuestionario Inicial (PRE)
      </h3>

      <a
        href="/src/pages/app/questionnaires.html"
        class="btn btn-primary"
      >
        Comenzar
      </a>

    </div>

  `;
}

// ======================================================
// ANNOUNCEMENTS
// ======================================================

function renderAnnouncements(announcements = []) {
  const container = document.getElementById("dashboard-announcements");

  if (!container) return;

  if (!announcements.length) {
    return;
  }

  container.innerHTML = announcements
    .map(
      (item) => `

      <div
        class="
          announcement-card
          announcement-${item.type}
        "
      >

        <div class="announcement-content">

          <h3 class="announcement-title">
            ${item.title}
          </h3>

          <p class="announcement-message">
            ${item.message}
          </p>

        </div>

      </div>

    `,
    )
    .join("");
}

// ======================================================
// RECENT SESSIONS
// ======================================================

function renderRecentSessions(sessions = []) {
  const container = document.getElementById("dashboard-recent-sessions");

  if (!container) return;

  const available = sessions
    .filter((session) => session.status !== "upcoming")
    .slice(0, 3);

  if (!available.length) {
    const empty = renderEmptyState({
      icon: "🎥",

      title: "No hay sesiones disponibles",

      description: "Las sesiones aparecerán aquí automáticamente.",
    });

    container.appendChild(empty);

    return;
  }

  container.innerHTML = available
    .map(
      (session) => `

      <div class="session-card">

        <div class="session-card-header">

          <span class="session-number">

            Sesión
            ${session.month_number}

          </span>

          <span
            class="
              session-status
              session-status-${session.status}
            "
          >

            ${getStatusLabel(session.status)}

          </span>

        </div>

        <h3 class="session-title">
          ${session.title}
        </h3>

        <p class="session-description">
          ${session.description}
        </p>

      </div>

    `,
    )
    .join("");
}

// ======================================================
// HELPERS
// ======================================================

function getStatusLabel(status) {
  const labels = {
    upcoming: "Próximamente",

    available: "Disponible",

    completed: "Completada",
  };

  return labels[status] || status;
}

// ======================================================
// ERROR
// ======================================================

function renderDashboardError() {
  const container = document.getElementById("dashboard-content");

  if (!container) return;

  const empty = renderEmptyState({
    icon: "⚠️",

    title: "Error cargando el dashboard",

    description: "Ha ocurrido un error inesperado. Inténtalo más tarde.",
  });

  container.innerHTML = "";

  container.appendChild(empty);
}
