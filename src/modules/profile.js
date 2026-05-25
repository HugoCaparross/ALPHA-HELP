import {
  getUser,
  updatePassword,
  signOut
} from '../lib/auth.js'

import {
  getProfile,
  updateProfile,
  uploadAvatar,
  getAvatarUrl
} from '../lib/db.js'

import {

  sanitize,
  isValidName,
  isValidRegion,
  validateImageFile

} from '../utils/validators.js'

// ─────────────────────────────────────
// MAIN
// ─────────────────────────────────────

export async function loadProfile(
  container
) {

  try {

    renderLoading(container)

    const user =
      await getUser()

    if (!user) {
      return
    }

    const profile =
      await getProfile(user.id)

    renderProfile(
      container,
      user,
      profile
    )

  } catch (error) {

    console.error(
      '[PROFILE_ERROR]',
      error
    )

    renderError(container)

  }

}

// ─────────────────────────────────────
// RENDER
// ─────────────────────────────────────

function renderProfile(
  container,
  user,
  profile
) {

  const avatar =
    getAvatarUrl(
      profile?.avatar_url
    )

  container.innerHTML = `

    <div class="card profile-card">

      <div class="profile-header">

        <div class="profile-avatar-wrapper">

          <img
            src="${
              avatar ||
              '/src/assets/images/default-avatar.png'
            }"
            alt="Avatar"
            class="profile-avatar"
            id="profile-avatar"
          />

        </div>

        <div>

          <h2>
            ${profile?.full_name || ''}
          </h2>

          <p>
            ${profile?.email || ''}
          </p>

        </div>

      </div>

      <form
        id="profile-form"
        class="auth-form"
      >

        <input
          id="full_name"
          class="input"
          type="text"
          value="${profile?.full_name || ''}"
          maxlength="80"
          required
        />

        <select
          id="region"
          class="input"
          required
        >

          <option
            value="ES"
            ${
              profile?.region === 'ES'
                ? 'selected'
                : ''
            }
          >
            España
          </option>

          <option
            value="LATAM"
            ${
              profile?.region === 'LATAM'
                ? 'selected'
                : ''
            }
          >
            Latinoamérica
          </option>

        </select>

        <input
          id="avatar"
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
        />

        <button
          class="button"
          type="submit"
        >
          Guardar cambios
        </button>

      </form>

      <div class="profile-divider"></div>

      <form
        id="password-form"
        class="auth-form"
      >

        <input
          id="new-password"
          class="input"
          type="password"
          placeholder="Nueva contraseña"
          minlength="8"
          required
        />

        <button
          class="button button-secondary"
          type="submit"
        >
          Cambiar contraseña
        </button>

      </form>

      <div class="profile-divider"></div>

      <button
        id="logout-btn"
        class="button button-secondary"
      >
        Cerrar sesión
      </button>

      <p
        id="profile-message"
        class="form-success hidden"
      ></p>

      <p
        id="profile-error"
        class="form-error hidden"
      ></p>

    </div>

  `

  initProfileEvents(
    user,
    profile
  )

}

// ─────────────────────────────────────
// EVENTS
// ─────────────────────────────────────

function initProfileEvents(
  user,
  profile
) {

  const profileForm =
    document.getElementById(
      'profile-form'
    )

  const passwordForm =
    document.getElementById(
      'password-form'
    )

  const logoutBtn =
    document.getElementById(
      'logout-btn'
    )

  const messageEl =
    document.getElementById(
      'profile-message'
    )

  const errorEl =
    document.getElementById(
      'profile-error'
    )

  function showError(message) {

    errorEl.textContent =
      message

    errorEl.classList.remove(
      'hidden'
    )

    messageEl.classList.add(
      'hidden'
    )
  }

  function showSuccess(message) {

    messageEl.textContent =
      message

    messageEl.classList.remove(
      'hidden'
    )

    errorEl.classList.add(
      'hidden'
    )
  }

  // ─────────────────────────────────
  // PROFILE UPDATE
  // ─────────────────────────────────

  profileForm.addEventListener(
    'submit',
    async (e) => {

      e.preventDefault()

      try {

        const full_name =
          sanitize(
            document
              .getElementById(
                'full_name'
              )
              .value
          )

        const region =
          document
            .getElementById(
              'region'
            )
            .value

        const avatarFile =
          document
            .getElementById(
              'avatar'
            )
            .files[0]

        if (
          !isValidName(full_name)
        ) {
          throw new Error(
            'Nombre inválido.'
          )
        }

        if (
          !isValidRegion(region)
        ) {
          throw new Error(
            'Región inválida.'
          )
        }

        let avatar_url =
          profile?.avatar_url || null

        if (avatarFile) {

          if (
            !validateImageFile(
              avatarFile
            )
          ) {

            throw new Error(
              'Imagen inválida.'
            )
          }

          const uploaded =
            await uploadAvatar(
              user.id,
              avatarFile
            )

          avatar_url =
            uploaded?.path || null
        }

        await updateProfile(
          user.id,
          {
            full_name,
            region,
            avatar_url
          }
        )

        showSuccess(
          'Perfil actualizado correctamente.'
        )

      } catch (error) {

        console.error(
          '[PROFILE_UPDATE_ERROR]',
          error
        )

        showError(
          error.message
        )

      }

    }
  )

  // ─────────────────────────────────
  // PASSWORD
  // ─────────────────────────────────

  passwordForm.addEventListener(
    'submit',
    async (e) => {

      e.preventDefault()

      try {

        const password =
          document
            .getElementById(
              'new-password'
            )
            .value
            .trim()

        if (
          password.length < 8
        ) {

          throw new Error(
            'La contraseña debe tener mínimo 8 caracteres.'
          )

        }

        await updatePassword(
          password
        )

        passwordForm.reset()

        showSuccess(
          'Contraseña actualizada correctamente.'
        )

      } catch (error) {

        console.error(
          '[PASSWORD_UPDATE_ERROR]',
          error
        )

        showError(
          error.message
        )

      }

    }
  )

  // ─────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────

  logoutBtn.addEventListener(
    'click',
    async () => {

      try {

        await signOut()

      } catch (error) {

        showError(
          'No se pudo cerrar sesión.'
        )

      }

    }
  )

}

// ─────────────────────────────────────
// LOADING
// ─────────────────────────────────────

function renderLoading(container) {

  container.innerHTML = `

    <div class="card profile-card">

      <div class="skeleton skeleton-title"></div>

      <div class="skeleton skeleton-text"></div>

      <div class="skeleton skeleton-text short"></div>

    </div>

  `

}

// ─────────────────────────────────────
// ERROR
// ─────────────────────────────────────

function renderError(container) {

  container.innerHTML = `

    <div class="card empty-state">

      <h3>
        Error al cargar el perfil
      </h3>

      <p>
        Ha ocurrido un problema al cargar tus datos.
      </p>

    </div>

  `

}