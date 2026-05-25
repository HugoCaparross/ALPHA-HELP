// src/modules/resources.js

import {
  getResources
} from '../lib/db.js';

import {
  showLoader,
  hideLoader,
  renderEmptyState,
  showToast
} from '../components/ui.js';

import {
  formatDate
} from '../utils/helpers.js';


// ======================================================
// INIT RESOURCES
// ======================================================

export async function initResources() {

  try {

    showLoader(
      'Cargando recursos...'
    );

    const resources =
      await getResources();

    renderResources(resources);

    initResourceFilters();

  } catch (error) {

    console.error(error);

    renderResourcesError();

  } finally {

    hideLoader();
  }
}


// ======================================================
// RENDER RESOURCES
// ======================================================

function renderResources(
  resources = []
) {

  const container =
    document.getElementById(
      'resources-grid'
    );

  if (!container) return;

  if (!resources.length) {

    const empty =
      renderEmptyState({

        icon: '📚',

        title:
          'No hay recursos disponibles',

        description:
          'Los materiales aparecerán automáticamente cuando estén disponibles.'
      });

    container.appendChild(empty);

    return;
  }

  container.innerHTML =
    resources.map(resource => `

      <article
        class="resource-card"
        data-resource-type="${resource.type}"
      >

        <div class="resource-card-header">

          <div class="resource-icon">

            ${getResourceIcon(
              resource.type
            )}

          </div>

          <span
            class="
              resource-badge
              resource-${resource.type}
            "
          >

            ${resource.type}

          </span>

        </div>

        <div class="resource-card-body">

          <h3 class="resource-title">
            ${resource.title}
          </h3>

          <p class="resource-description">
            ${resource.description}
          </p>

          ${
            resource.sessions
              ? `
                <div class="resource-session">

                  <span>
                    🎥
                    Sesión
                    ${resource.sessions.month_number}
                  </span>

                </div>
              `
              : ''
          }

        </div>

        <div class="resource-card-footer">

          <a
            href="${resource.url}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary resource-download"
          >

            Abrir recurso

          </a>

        </div>

      </article>

    `).join('');
}


// ======================================================
// FILTERS
// ======================================================

function initResourceFilters() {

  const filters =
    document.querySelectorAll(
      '[data-resource-filter]'
    );

  if (!filters.length) return;

  filters.forEach(filter => {

    filter.addEventListener(
      'click',
      () => {

        const type =
          filter.dataset.resourceFilter;

        setActiveFilter(filter);

        filterResources(type);
      }
    );
  });
}


// ======================================================
// FILTER RESOURCES
// ======================================================

function filterResources(type) {

  const cards =
    document.querySelectorAll(
      '.resource-card'
    );

  cards.forEach(card => {

    const resourceType =
      card.dataset.resourceType;

    const visible =
      type === 'all'
      || type === resourceType;

    card.style.display =
      visible
        ? 'flex'
        : 'none';
  });
}


// ======================================================
// ACTIVE FILTER
// ======================================================

function setActiveFilter(activeFilter) {

  const filters =
    document.querySelectorAll(
      '[data-resource-filter]'
    );

  filters.forEach(filter => {
    filter.classList.remove(
      'active'
    );
  });

  activeFilter.classList.add(
    'active'
  );
}


// ======================================================
// SEARCH
// ======================================================

export function initResourceSearch() {

  const input =
    document.getElementById(
      'resource-search'
    );

  if (!input) return;

  input.addEventListener(
    'input',
    () => {

      const query =
        input.value
          .trim()
          .toLowerCase();

      searchResources(query);
    }
  );
}


// ======================================================
// SEARCH RESOURCES
// ======================================================

function searchResources(query) {

  const cards =
    document.querySelectorAll(
      '.resource-card'
    );

  cards.forEach(card => {

    const title =
      card.querySelector(
        '.resource-title'
      )?.textContent
        .toLowerCase() || '';

    const description =
      card.querySelector(
        '.resource-description'
      )?.textContent
        .toLowerCase() || '';

    const visible =
      title.includes(query)
      || description.includes(query);

    card.style.display =
      visible
        ? 'flex'
        : 'none';
  });
}


// ======================================================
// DOWNLOAD TRACKING
// ======================================================

export function initResourceTracking() {

  const links =
    document.querySelectorAll(
      '.resource-download'
    );

  links.forEach(link => {

    link.addEventListener(
      'click',
      () => {

        console.info(
          'Resource opened'
        );
      }
    );
  });
}


// ======================================================
// RECENT RESOURCES
// ======================================================

export function renderRecentResources(
  resources = []
) {

  const container =
    document.getElementById(
      'recent-resources'
    );

  if (!container) return;

  const recent =
    resources.slice(0, 4);

  container.innerHTML =
    recent.map(resource => `

      <a
        href="${resource.url}"
        target="_blank"
        class="recent-resource"
      >

        <div class="recent-resource-icon">

          ${getResourceIcon(
            resource.type
          )}

        </div>

        <div class="recent-resource-content">

          <h4>
            ${resource.title}
          </h4>

          <p>
            ${resource.description}
          </p>

        </div>

      </a>

    `).join('');
}


// ======================================================
// COPY LINK
// ======================================================

export async function copyResourceLink(
  url
) {

  try {

    await navigator.clipboard.writeText(
      url
    );

    showToast(
      'success',
      'Enlace copiado'
    );

  } catch (error) {

    console.error(error);

    showToast(
      'error',
      'No se pudo copiar el enlace'
    );
  }
}


// ======================================================
// HELPERS
// ======================================================

function getResourceIcon(type) {

  const icons = {

    pdf: '📄',

    video: '🎥',

    link: '🔗',

    guide: '📘'
  };

  return icons[type] || '📁';
}


// ======================================================
// ERROR
// ======================================================

function renderResourcesError() {

  const container =
    document.getElementById(
      'resources-grid'
    );

  if (!container) return;

  const empty =
    renderEmptyState({

      icon: '⚠️',

      title:
        'Error cargando recursos',

      description:
        'No se pudieron cargar los materiales.'
    });

  container.innerHTML = '';

  container.appendChild(empty);
}