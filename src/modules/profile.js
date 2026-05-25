// src/modules/profile.js

import {
  getMyProfile,
  updateMyProfile
} from '../lib/db.js';

import {
  updatePassword,
  logout
} from '../lib/auth.js';

import {
  uploadAvatar
} from '../lib/supabase.js';

import {
  initProfileForm,
  initChangePasswordForm
} from '../components/forms.js';

import {
  showLoader,
  hideLoader,
  showToast,
  openConfirmModal
} from '../components/ui.js';

import {
  validateImageFile
} from '../utils/validators.js';


// ======================================================
// INIT PROFILE
// ======================================================

export async function initProfile() {

  try {

    showLoader(
      'Cargando perfil...'
    );

    const profile =
      await getMyProfile();

    renderProfile(profile);

    initProfileUpdate();

    initPasswordChange();

    initAvatarUpload(profile);

    initLogoutButton();

  } catch (error) {

    console.error(error);

    showToast(
      'error',
      'No se pudo cargar el perfil'
    );

  } finally {

    hideLoader();
  }
}


// ======================================================
// RENDER PROFILE
// ======================================================

function renderProfile(profile) {

  renderProfileHeader(profile);

  renderProfileForm(profile);
}


// ======================================================
// PROFILE HEADER
// ======================================================

function renderProfileHeader(profile) {

  const container =
    document.getElementById(
      'profile-header'
    );

  if (!container) return;

  container.innerHTML = `
    <div class="profile-header-card">

      <div class="profile-avatar-wrapper">

        ${
          profile.avatar_url

            ? `
              <img
                src="${profile.avatar_url}"
                alt="${profile.full_name}"
                class="profile-avatar-image"
              >
            `

            : `
              <div class="profile-avatar-placeholder">

                ${getInitials(
                  profile.full_name
                )}

              </div>
            `
        }

        <label
          for="avatar-input"
          class="profile-avatar-edit"
        >
          ✏️
        </label>

        <input
          type="file"
          id="avatar-input"
          accept="image/*"
          hidden
        >

      </div>

      <div class="profile-header-info">

        <h1 class="profile-name">
          ${profile.full_name}
        </h1>

        <p class="profile-email">
          ${profile.email}
        </p>

        <span class="profile-region">
          ${profile.region}
        </span>

      </div>

    </div>
  `;
}


// ======================================================
// PROFILE FORM
// ======================================================

function renderProfileForm(profile) {

  const container =
    document.getElementById(
      'profile-form-container'
    );

  if (!container) return;

  const [
    name = '',
    surname = ''
  ] = profile.full_name.split(' ');

  container.innerHTML = `
    <form
      id="profile-form"
      class="profile-form"
    >

      <div class="form-grid">

        <div class="form-group">

          <label>
            Nombre
          </label>

          <input
            type="text"
            name="name"
            value="${name}"
            data-validate="name"
          >

        </div>

        <div class="form-group">

          <label>
            Apellidos
          </label>

          <input
            type="text"
            name="surname"
            value="${surname}"
            data-validate="name"
          >

        </div>

      </div>

      <div class="form-group">

        <label>
          Email
        </label>

        <input
          type="email"
          value="${profile.email}"
          disabled
        >

      </div>

      <button
        type="submit"
        class="btn btn-primary"
      >
        Guardar cambios
      </button>

    </form>
  `;

  renderPasswordForm();
}


// ======================================================
// PASSWORD FORM
// ======================================================

function renderPasswordForm() {

  const container =
    document.getElementById(
      'change-password-container'
    );

  if (!container) return;

  container.innerHTML = `
    <form
      id="change-password-form"
      class="profile-password-form"
    >

      <div class="form-group">

        <label>
          Nueva contraseña
        </label>

        <input
          type="password"
          name="password"
          data-validate="password"
        >

      </div>

      <button
        type="submit"
        class="btn btn-secondary"
      >
        Cambiar contraseña
      </button>

    </form>
  `;
}


// ======================================================
// PROFILE UPDATE
// ======================================================

function initProfileUpdate() {

  initProfileForm(
    async data => {

      try {

        showLoader(
          'Actualizando perfil...'
        );

        const fullName =
          `${data.name} ${data.surname}`;

        await updateMyProfile({

          full_name: fullName
        });

        showToast(
          'success',
          'Perfil actualizado correctamente'
        );

      } catch (error) {

        console.error(error);

        showToast(
          'error',
          'No se pudo actualizar el perfil'
        );

      } finally {

        hideLoader();
      }
    }
  );
}


// ======================================================
// PASSWORD CHANGE
// ======================================================

function initPasswordChange() {

  initChangePasswordForm(
    async data => {

      try {

        showLoader(
          'Actualizando contraseña...'
        );

        await updatePassword(
          data.password
        );

        showToast(
          'success',
          'Contraseña actualizada'
        );

      } catch (error) {

        console.error(error);

        showToast(
          'error',
          error.message
        );

      } finally {

        hideLoader();
      }
    }
  );
}


// ======================================================
// AVATAR
// ======================================================

function initAvatarUpload(profile) {

  const input =
    document.getElementById(
      'avatar-input'
    );

  if (!input) return;

  input.addEventListener(
    'change',
    async event => {

      const file =
        event.target.files[0];

      if (!file) return;

      // VALIDATE

      const valid =
        validateImageFile(file);

      if (!valid) {

        showToast(
          'error',
          'Imagen no válida'
        );

        return;
      }

      try {

        showLoader(
          'Subiendo avatar...'
        );

        const avatarUrl =
          await uploadAvatar(
            file,
            profile.id
          );

        await updateMyProfile({

          avatar_url: avatarUrl
        });

        showToast(
          'success',
          'Avatar actualizado'
        );

        window.location.reload();

      } catch (error) {

        console.error(error);

        showToast(
          'error',
          'No se pudo subir el avatar'
        );

      } finally {

        hideLoader();
      }
    }
  );
}


// ======================================================
// LOGOUT
// ======================================================

function initLogoutButton() {

  const button =
    document.getElementById(
      'profile-logout-button'
    );

  if (!button) return;

  button.addEventListener(
    'click',
    () => {

      openConfirmModal({

        title:
          'Cerrar sesión',

        message:
          '¿Seguro que quieres cerrar sesión?',

        confirmText:
          'Cerrar sesión',

        onConfirm: async () => {

          await logout();
        }
      });
    }
  );
}


// ======================================================
// HELPERS
// ======================================================

function getInitials(name = '') {

  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}