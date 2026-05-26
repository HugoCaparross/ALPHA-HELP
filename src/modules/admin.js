// src/modules/admin.js

import {
  adminGetUsers,
  adminUpdateUser,
  adminDeleteUser,
  adminGetSessions,
  adminCreateSession,
  adminUpdateSession,
  adminDeleteSession,
  adminCreateAnnouncement,
  adminDeleteAnnouncement,
  getAnnouncements
} from '../lib/db.js';

import {
  showLoader,
  hideLoader,
  showToast,
  openModal,
  openConfirmModal,
  renderEmptyState
} from '../components/ui.js';

import {
  formatDate,
  formatTime
} from '../utils/helpers.js';


// ======================================================
// INIT ADMIN DASHBOARD
// ======================================================

export async function initAdminDashboard() {

  try {

    showLoader();

    const [
      users,
      sessions,
      announcements
    ] = await Promise.all([

      adminGetUsers(),

      adminGetSessions(),

      getAnnouncements()
    ]);

    renderAdminStats({
      users,
      sessions,
      announcements
    });

  } catch (error) {

    console.error(error);

    showToast(
      'error',
      'Error cargando el panel admin'
    );

  } finally {

    hideLoader();
  }
}


// ======================================================
// ADMIN USERS
// ======================================================

export async function initAdminUsers() {

  try {

    showLoader(
      'Cargando usuarios...'
    );

    const users =
      await adminGetUsers();

    renderUsers(users);

    initUserSearch(users);

  } catch (error) {

    console.error(error);

    renderUsersError();

  } finally {

    hideLoader();
  }
}


// ======================================================
// RENDER USERS
// ======================================================

function renderUsers(users = []) {

  const container =
    document.getElementById(
      'admin-users-table'
    );

  if (!container) return;

  if (!users.length) {

    const empty =
      renderEmptyState({

        icon: '👥',

        title:
          'No hay usuarios',

        description:
          'Los usuarios aparecerán aquí automáticamente.'
      });

    container.appendChild(empty);

    return;
  }

  container.innerHTML = `
    <table class="admin-table">

      <thead>

        <tr>

          <th>Usuario</th>

          <th>Email</th>

          <th>Región</th>

          <th>Admin</th>

          <th>Fecha</th>

          <th>Acciones</th>

        </tr>

      </thead>

      <tbody>

        ${users.map(user => `

          <tr>

            <td>
              ${user.full_name}
            </td>

            <td>
              ${user.email}
            </td>

            <td>
              ${user.region}
            </td>

            <td>

              ${
                user.is_admin
                  ? 'Sí'
                  : 'No'
              }

            </td>

            <td>
              ${formatDate(
                user.created_at
              )}
            </td>

            <td>

              <div class="admin-actions">

                <button
                  class="
                    btn
                    btn-secondary
                    admin-edit-user
                  "
                  data-user-id="${user.id}"
                >
                  Editar
                </button>

                <button
                  class="
                    btn
                    btn-danger
                    admin-delete-user
                  "
                  data-user-id="${user.id}"
                >
                  Eliminar
                </button>

              </div>

            </td>

          </tr>

        `).join('')}

      </tbody>

    </table>
  `;

  initUserActions(users);
}


// ======================================================
// USER ACTIONS
// ======================================================

function initUserActions(users) {

  const editButtons =
    document.querySelectorAll(
      '.admin-edit-user'
    );

  const deleteButtons =
    document.querySelectorAll(
      '.admin-delete-user'
    );

  // EDIT

  editButtons.forEach(button => {

    button.addEventListener(
      'click',
      () => {

        const userId =
          button.dataset.userId;

        const user =
          users.find(
            item => item.id === userId
          );

        if (!user) return;

        openEditUserModal(user);
      }
    );
  });

  // DELETE

  deleteButtons.forEach(button => {

    button.addEventListener(
      'click',
      () => {

        const userId =
          button.dataset.userId;

        openConfirmModal({

          title:
            'Eliminar usuario',

          message:
            'Esta acción no se puede deshacer.',

          confirmText:
            'Eliminar',

          onConfirm: async () => {

            await deleteUser(
              userId
            );
          }
        });
      }
    );
  });
}


// ======================================================
// EDIT USER MODAL
// ======================================================

function openEditUserModal(user) {

  openModal({

    title:
      'Editar usuario',

    content: `
      <form
        id="admin-edit-user-form"
        class="admin-form"
      >

        <div class="form-group">

          <label>
            Nombre completo
          </label>

          <input
            type="text"
            name="full_name"
            value="${user.full_name}"
          >

        </div>

        <div class="form-group">

          <label>
            Región
          </label>

          <select name="region">

            <option
              value="ES"
              ${
                user.region === 'ES'
                  ? 'selected'
                  : ''
              }
            >
              España
            </option>

            <option
              value="LATAM"
              ${
                user.region === 'LATAM'
                  ? 'selected'
                  : ''
              }
            >
              LATAM
            </option>

          </select>

        </div>

        <div class="form-group">

          <label>
            Administrador
          </label>

          <select name="is_admin">

            <option
              value="false"
              ${
                !user.is_admin
                  ? 'selected'
                  : ''
              }
            >
              No
            </option>

            <option
              value="true"
              ${
                user.is_admin
                  ? 'selected'
                  : ''
              }
            >
              Sí
            </option>

          </select>

        </div>

        <button
          type="submit"
          class="btn btn-primary"
        >
          Guardar cambios
        </button>

      </form>
    `
  });

  const form =
    document.getElementById(
      'admin-edit-user-form'
    );

  form?.addEventListener(
    'submit',
    async event => {

      event.preventDefault();

      const formData =
        new FormData(form);

      const updates = {

        full_name:
          formData.get(
            'full_name'
          ),

        region:
          formData.get(
            'region'
          ),

        is_admin:
          formData.get(
            'is_admin'
          ) === 'true'
      };

      try {

        showLoader();

        await adminUpdateUser(
          user.id,
          updates
        );

        showToast(
          'success',
          'Usuario actualizado'
        );

        window.location.reload();

      } catch (error) {

        console.error(error);

        showToast(
          'error',
          'No se pudo actualizar el usuario'
        );

      } finally {

        hideLoader();
      }
    }
  );
}


// ======================================================
// DELETE USER
// ======================================================

async function deleteUser(
  userId
) {

  try {

    showLoader();

    await adminDeleteUser(
      userId
    );

    showToast(
      'success',
      'Usuario eliminado'
    );

    window.location.reload();

  } catch (error) {

    console.error(error);

    showToast(
      'error',
      'No se pudo eliminar el usuario'
    );

  } finally {

    hideLoader();
  }
}


// ======================================================
// ADMIN SESSIONS
// ======================================================

export async function initAdminSessions() {

  try {

    showLoader();

    const sessions =
      await adminGetSessions();

    renderAdminSessions(
      sessions
    );

    initCreateSession();

  } catch (error) {

    console.error(error);

    showToast(
      'error',
      'No se pudieron cargar las sesiones'
    );

  } finally {

    hideLoader();
  }
}


// ======================================================
// RENDER ADMIN SESSIONS
// ======================================================

function renderAdminSessions(
  sessions = []
) {

  const container =
    document.getElementById(
      'admin-sessions-grid'
    );

  if (!container) return;

  container.innerHTML =
    sessions.map(session => `

      <article class="admin-session-card">

        <div class="admin-session-top">

          <span>

            Sesión
            ${session.month_number}

          </span>

          <span>

            ${session.region}

          </span>

        </div>

        <h3>
          ${session.title}
        </h3>

        <p>
          ${session.description}
        </p>

        ${
          session.live_at
            ? `
              <div class="admin-session-date">

                <span>
                  📅
                  ${formatDate(
                    session.live_at
                  )}
                </span>

                <span>
                  🕒
                  ${formatTime(
                    session.live_at
                  )}
                </span>

              </div>
            `
            : ''
        }

        <div class="admin-session-actions">

          <button
            class="
              btn
              btn-secondary
            "
          >
            Editar
          </button>

          <button
            class="
              btn
              btn-danger
            "
          >
            Eliminar
          </button>

        </div>

      </article>

    `).join('');
}


// ======================================================
// CREATE SESSION
// ======================================================

function initCreateSession() {

  const button =
    document.getElementById(
      'create-session-button'
    );

  if (!button) return;

  button.addEventListener(
    'click',
    () => {

      openCreateSessionModal();
    }
  );
}


// ======================================================
// CREATE SESSION MODAL
// ======================================================

function openCreateSessionModal() {

  openModal({

    title:
      'Nueva sesión',

    size: 'lg',

    content: `
      <form
        id="admin-create-session-form"
        class="admin-form"
      >

        <div class="form-group">

          <label>
            Título
          </label>

          <input
            type="text"
            name="title"
            required
          >

        </div>

        <div class="form-group">

          <label>
            Descripción
          </label>

          <textarea
            name="description"
          ></textarea>

        </div>

        <div class="form-grid">

          <div class="form-group">

            <label>
              Región
            </label>

            <select name="region">

              <option value="ES">
                España
              </option>

              <option value="LATAM">
                LATAM
              </option>

            </select>

          </div>

          <div class="form-group">

            <label>
              Mes
            </label>

            <input
              type="number"
              name="month_number"
              min="1"
              max="12"
            >

          </div>

        </div>

        <div class="form-group">

          <label>
            Fecha directo
          </label>

          <input
            type="datetime-local"
            name="live_at"
          >

        </div>

        <button
          type="submit"
          class="btn btn-primary"
        >
          Crear sesión
        </button>

      </form>
    `
  });

  const form =
    document.getElementById(
      'admin-create-session-form'
    );

  form?.addEventListener(
    'submit',
    async event => {

      event.preventDefault();

      const formData =
        new FormData(form);

      const session = {

        title:
          formData.get('title'),

        description:
          formData.get(
            'description'
          ),

        region:
          formData.get('region'),

        month_number:
          Number(
            formData.get(
              'month_number'
            )
          ),

        live_at:
          formData.get(
            'live_at'
          ),

        is_published: true
      };

      try {

        showLoader();

        await adminCreateSession(
          session
        );

        showToast(
          'success',
          'Sesión creada correctamente'
        );

        window.location.reload();

      } catch (error) {

        console.error(error);

        showToast(
          'error',
          'No se pudo crear la sesión'
        );

      } finally {

        hideLoader();
      }
    }
  );
}


// ======================================================
// ADMIN STATS
// ======================================================

function renderAdminStats({
  users,
  sessions,
  announcements
}) {

  const container =
    document.getElementById(
      'admin-stats'
    );

  if (!container) return;

  container.innerHTML = `
    <div class="admin-stat-card">

      <span class="admin-stat-number">
        ${users.length}
      </span>

      <span class="admin-stat-label">
        Usuarios
      </span>

    </div>

    <div class="admin-stat-card">

      <span class="admin-stat-number">
        ${sessions.length}
      </span>

      <span class="admin-stat-label">
        Sesiones
      </span>

    </div>

    <div class="admin-stat-card">

      <span class="admin-stat-number">
        ${announcements.length}
      </span>

      <span class="admin-stat-label">
        Avisos
      </span>

    </div>
  `;
}


// ======================================================
// USER SEARCH
// ======================================================

function initUserSearch(users) {

  const input =
    document.getElementById(
      'admin-user-search'
    );

  if (!input) return;

  input.addEventListener(
    'input',
    () => {

      const query =
        input.value
          .trim()
          .toLowerCase();

      const filtered =
        users.filter(user =>

          user.full_name
            .toLowerCase()
            .includes(query)

          ||

          user.email
            .toLowerCase()
            .includes(query)
        );

      renderUsers(filtered);
    }
  );
}


// ======================================================
// USERS ERROR
// ======================================================

function renderUsersError() {

  const container =
    document.getElementById(
      'admin-users-table'
    );

  if (!container) return;

  const empty =
    renderEmptyState({

      icon: '⚠️',

      title:
        'Error cargando usuarios',

      description:
        'No se pudieron cargar los usuarios.'
    });

  container.innerHTML = '';

  container.appendChild(empty);
}