// src/components/ui.js


// ======================================================
// TOAST
// ======================================================

let toastTimeout;


export function showToast(
  type = 'info',
  message = ''
) {

  removeExistingToast();

  const toast =
    document.createElement('div');

  toast.className =
    `toast toast-${type}`;

  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-message">
        ${message}
      </span>

      <button class="toast-close">
        ×
      </button>
    </div>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const closeButton =
    toast.querySelector('.toast-close');

  closeButton.addEventListener(
    'click',
    () => removeToast(toast)
  );

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    removeToast(toast);
  }, 4500);
}


function removeToast(toast) {

  if (!toast) return;

  toast.classList.remove('show');

  setTimeout(() => {
    toast.remove();
  }, 250);
}


function removeExistingToast() {

  const existing =
    document.querySelector('.toast');

  if (existing) {
    existing.remove();
  }
}


// ======================================================
// LOADER
// ======================================================

export function showLoader(
  text = 'Cargando...'
) {

  if (document.querySelector('.loader-overlay')) {
    return;
  }

  const overlay =
    document.createElement('div');

  overlay.className =
    'loader-overlay';

  overlay.innerHTML = `
    <div class="loader-container">

      <div class="loader-spinner"></div>

      <p class="loader-text">
        ${text}
      </p>

    </div>
  `;

  document.body.appendChild(overlay);

  document.body.classList.add(
    'overflow-hidden'
  );
}


export function hideLoader() {

  const overlay =
    document.querySelector('.loader-overlay');

  if (!overlay) return;

  overlay.remove();

  document.body.classList.remove(
    'overflow-hidden'
  );
}


// ======================================================
// MODAL
// ======================================================

export function openModal({
  title = '',
  content = '',
  size = 'md',
  closable = true
} = {}) {

  closeModal();

  const modal =
    document.createElement('div');

  modal.className =
    'modal-overlay';

  modal.innerHTML = `
    <div class="modal modal-${size}">

      <div class="modal-header">

        <h3 class="modal-title">
          ${title}
        </h3>

        ${
          closable
            ? `
              <button class="modal-close">
                ×
              </button>
            `
            : ''
        }

      </div>

      <div class="modal-body">
        ${content}
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  requestAnimationFrame(() => {
    modal.classList.add('show');
  });

  document.body.classList.add(
    'overflow-hidden'
  );

  // CLOSE BUTTON

  const closeButton =
    modal.querySelector('.modal-close');

  if (closeButton) {

    closeButton.addEventListener(
      'click',
      closeModal
    );
  }

  // OUTSIDE CLICK

  modal.addEventListener(
    'click',
    (event) => {

      if (
        event.target === modal &&
        closable
      ) {
        closeModal();
      }
    }
  );

  // ESC KEY

  document.addEventListener(
    'keydown',
    handleEscapeClose
  );
}


export function closeModal() {

  const modal =
    document.querySelector('.modal-overlay');

  if (!modal) return;

  modal.classList.remove('show');

  setTimeout(() => {
    modal.remove();
  }, 200);

  document.body.classList.remove(
    'overflow-hidden'
  );

  document.removeEventListener(
    'keydown',
    handleEscapeClose
  );
}


function handleEscapeClose(event) {

  if (event.key === 'Escape') {
    closeModal();
  }
}


// ======================================================
// CONFIRM MODAL
// ======================================================

export function openConfirmModal({
  title = 'Confirmar acción',
  message = '',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm = null
} = {}) {

  const content = `
    <div class="confirm-modal">

      <p class="confirm-message">
        ${message}
      </p>

      <div class="confirm-actions">

        <button
          class="btn btn-secondary"
          id="confirm-cancel"
        >
          ${cancelText}
        </button>

        <button
          class="btn btn-danger"
          id="confirm-accept"
        >
          ${confirmText}
        </button>

      </div>

    </div>
  `;

  openModal({
    title,
    content
  });

  const cancelButton =
    document.getElementById(
      'confirm-cancel'
    );

  const confirmButton =
    document.getElementById(
      'confirm-accept'
    );

  cancelButton?.addEventListener(
    'click',
    closeModal
  );

  confirmButton?.addEventListener(
    'click',
    async () => {

      if (onConfirm) {
        await onConfirm();
      }

      closeModal();
    }
  );
}


// ======================================================
// EMPTY STATE
// ======================================================

export function renderEmptyState({
  title = 'Sin contenido',
  description = '',
  buttonText = '',
  buttonAction = null,
  icon = '📭'
} = {}) {

  const wrapper =
    document.createElement('div');

  wrapper.className =
    'empty-state';

  wrapper.innerHTML = `
    <div class="empty-state-icon">
      ${icon}
    </div>

    <h3 class="empty-state-title">
      ${title}
    </h3>

    <p class="empty-state-description">
      ${description}
    </p>

    ${
      buttonText
        ? `
          <button
            class="btn btn-primary"
            id="empty-state-button"
          >
            ${buttonText}
          </button>
        `
        : ''
    }
  `;

  if (buttonText && buttonAction) {

    requestAnimationFrame(() => {

      const button =
        wrapper.querySelector(
          '#empty-state-button'
        );

      button?.addEventListener(
        'click',
        buttonAction
      );
    });
  }

  return wrapper;
}


// ======================================================
// ACCORDION
// ======================================================

export function initAccordions() {

  const accordions =
    document.querySelectorAll(
      '[data-accordion]'
    );

  accordions.forEach(accordion => {

    const trigger =
      accordion.querySelector(
        '[data-accordion-trigger]'
      );

    const content =
      accordion.querySelector(
        '[data-accordion-content]'
      );

    if (!trigger || !content) return;

    trigger.addEventListener(
      'click',
      () => {

        accordion.classList.toggle(
          'active'
        );

        if (
          accordion.classList.contains(
            'active'
          )
        ) {

          content.style.maxHeight =
            `${content.scrollHeight}px`;

        } else {

          content.style.maxHeight = null;
        }
      }
    );
  });
}


// ======================================================
// DROPDOWNS
// ======================================================

export function initDropdowns() {

  const dropdowns =
    document.querySelectorAll(
      '[data-dropdown]'
    );

  dropdowns.forEach(dropdown => {

    const trigger =
      dropdown.querySelector(
        '[data-dropdown-trigger]'
      );

    const menu =
      dropdown.querySelector(
        '[data-dropdown-menu]'
      );

    if (!trigger || !menu) return;

    trigger.addEventListener(
      'click',
      (event) => {

        event.stopPropagation();

        closeAllDropdowns();

        dropdown.classList.toggle(
          'active'
        );
      }
    );
  });

  document.addEventListener(
    'click',
    closeAllDropdowns
  );
}


function closeAllDropdowns() {

  const dropdowns =
    document.querySelectorAll(
      '[data-dropdown]'
    );

  dropdowns.forEach(dropdown => {
    dropdown.classList.remove(
      'active'
    );
  });
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

    showToast(
      'success',
      'Copiado al portapapeles'
    );

  } catch (error) {

    console.error(error);

    showToast(
      'error',
      'No se pudo copiar'
    );
  }
}


// ======================================================
// SCROLL TOP
// ======================================================

export function scrollToTop() {

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}