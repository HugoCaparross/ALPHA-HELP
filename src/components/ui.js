// ─────────────────────────────────────
// TOAST
// ─────────────────────────────────────

export function showToast(
  message = '',
  type = 'info'
) {

  removeExistingToast()

  const toast =
    document.createElement('div')

  toast.className =
    `toast toast-${type}`

  toast.setAttribute(
    'role',
    'alert'
  )

  toast.innerHTML = `

    <div class="toast-content">

      <span class="toast-message">

        ${message}

      </span>

      <button
        class="toast-close"
        aria-label="Cerrar"
      >
        ×
      </button>

    </div>

  `

  document.body.appendChild(toast)

  requestAnimationFrame(() => {

    toast.classList.add('show')

  })

  // Auto close
  const timeout =
    setTimeout(() => {

      closeToast(toast)

    }, 4000)

  // Manual close
  toast
    .querySelector('.toast-close')
    .addEventListener('click', () => {

      clearTimeout(timeout)

      closeToast(toast)

    })

}

// ─────────────────────────────────────
// CLOSE TOAST
// ─────────────────────────────────────

function closeToast(toast) {

  if (!toast) return

  toast.classList.remove('show')

  setTimeout(() => {

    toast.remove()

  }, 200)

}

// ─────────────────────────────────────
// REMOVE EXISTING TOAST
// ─────────────────────────────────────

function removeExistingToast() {

  const existing =
    document.querySelector('.toast')

  if (existing) {
    existing.remove()
  }

}

// ─────────────────────────────────────
// MODAL
// ─────────────────────────────────────

export function openModal({

  title = '',
  content = '',
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  onConfirm = null

}) {

  closeModal()

  const overlay =
    document.createElement('div')

  overlay.className =
    'modal-overlay'

  overlay.innerHTML = `

    <div
      class="modal"
      role="dialog"
      aria-modal="true"
    >

      <div class="modal-header">

        <h2>
          ${title}
        </h2>

      </div>

      <div class="modal-body">

        ${content}

      </div>

      <div class="modal-actions">

        <button
          class="button button-secondary modal-cancel"
        >
          ${cancelText}
        </button>

        <button
          class="button modal-confirm"
        >
          ${confirmText}
        </button>

      </div>

    </div>

  `

  document.body.appendChild(
    overlay
  )

  requestAnimationFrame(() => {

    overlay.classList.add('show')

  })

  // Cancel
  overlay
    .querySelector('.modal-cancel')
    .addEventListener(
      'click',
      closeModal
    )

  // Confirm
  overlay
    .querySelector('.modal-confirm')
    .addEventListener(
      'click',
      async () => {

        try {

          if (
            typeof onConfirm === 'function'
          ) {

            await onConfirm()

          }

          closeModal()

        } catch (error) {

          console.error(
            '[MODAL_CONFIRM_ERROR]',
            error
          )

        }

      }
    )

  // Overlay close
  overlay.addEventListener(
    'click',
    (e) => {

      if (e.target === overlay) {
        closeModal()
      }

    }
  )

  // ESC close
  document.addEventListener(
    'keydown',
    handleEscape
  )

}

// ─────────────────────────────────────
// CLOSE MODAL
// ─────────────────────────────────────

export function closeModal() {

  const modal =
    document.querySelector(
      '.modal-overlay'
    )

  if (!modal) return

  modal.classList.remove('show')

  setTimeout(() => {

    modal.remove()

  }, 200)

  document.removeEventListener(
    'keydown',
    handleEscape
  )

}

// ─────────────────────────────────────
// ESC CLOSE
// ─────────────────────────────────────

function handleEscape(e) {

  if (e.key === 'Escape') {
    closeModal()
  }

}

// ─────────────────────────────────────
// LOADER
// ─────────────────────────────────────

export function createLoader() {

  const loader =
    document.createElement('div')

  loader.className =
    'loader-wrapper'

  loader.innerHTML = `

    <div class="loader"></div>

  `

  return loader

}

// ─────────────────────────────────────
// BUTTON LOADING
// ─────────────────────────────────────

export function setButtonLoading(
  button,
  state = false
) {

  if (!button) return

  button.disabled = state

  button.classList.toggle(
    'loading',
    state
  )

}

// ─────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────

export function createEmptyState({

  title = 'No hay contenido',
  description = ''

}) {

  return `

    <div class="card empty-state">

      <h3>
        ${title}
      </h3>

      <p>
        ${description}
      </p>

    </div>

  `

}