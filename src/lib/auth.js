// src/lib/auth.js

import { supabase } from './supabase.js';

import {
  sanitizeFormData
} from '../utils/validators.js';

import {
  showToast
} from '../components/ui.js';


// ======================================================
// LOGIN
// ======================================================

export async function login(data = {}) {

  try {

    const sanitized =
      sanitizeFormData(data);

    const {
      email,
      password
    } = sanitized;

    const {
      data: authData,
      error
    } = await supabase.auth.signInWithPassword({

      email,
      password
    });

    if (error) {
      throw error;
    }

    showToast(
      'success',
      'Sesión iniciada correctamente'
    );

    return authData;

  } catch (error) {

    console.error(error);

    throw new Error(
      getAuthErrorMessage(error)
    );
  }
}


// ======================================================
// REGISTER
// ======================================================

export async function register(data = {}) {

  try {

    const sanitized =
      sanitizeFormData(data);

    const {
      name,
      surname,
      email,
      password,
      country
    } = sanitized;

    const fullName =
      `${name} ${surname}`;

    const {
      data: authData,
      error
    } = await supabase.auth.signUp({

      email,

      password,

      options: {

        emailRedirectTo:
          `${window.location.origin}/src/pages/public/login.html`,

        data: {

          full_name: fullName,

          country
        }
      }
    });

    if (error) {
      throw error;
    }

    showToast(
      'success',
      'Revisa tu email para verificar tu cuenta'
    );

    return authData;

  } catch (error) {

    console.error(error);

    throw new Error(
      getAuthErrorMessage(error)
    );
  }
}


// ======================================================
// LOGOUT
// ======================================================

export async function logout() {

  try {

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    window.location.href =
      '/src/pages/public/login.html';

  } catch (error) {

    console.error(error);

    showToast(
      'error',
      'No se pudo cerrar sesión'
    );
  }
}


// ======================================================
// LOGIN GOOGLE
// ======================================================

export async function loginWithGoogle() {

  try {

    const {
      error
    } = await supabase.auth.signInWithOAuth({

      provider: 'google',

      options: {

        redirectTo:
          `${window.location.origin}/src/pages/app/dashboard.html`
      }
    });

    if (error) {
      throw error;
    }

  } catch (error) {

    console.error(error);

    showToast(
      'error',
      getAuthErrorMessage(error)
    );
  }
}


// ======================================================
// RECOVER PASSWORD
// ======================================================

export async function recoverPassword(
  email
) {

  try {

    const {
      error
    } = await supabase.auth.resetPasswordForEmail(
      email,
      {

        redirectTo:
          `${window.location.origin}/src/pages/public/reset-password.html`
      }
    );

    if (error) {
      throw error;
    }

    showToast(
      'success',
      'Te hemos enviado un email de recuperación'
    );

    return true;

  } catch (error) {

    console.error(error);

    throw new Error(
      getAuthErrorMessage(error)
    );
  }
}


// ======================================================
// UPDATE PASSWORD
// ======================================================

export async function updatePassword(
  password
) {

  try {

    const {
      error
    } = await supabase.auth.updateUser({

      password
    });

    if (error) {
      throw error;
    }

    showToast(
      'success',
      'Contraseña actualizada correctamente'
    );

    return true;

  } catch (error) {

    console.error(error);

    throw new Error(
      getAuthErrorMessage(error)
    );
  }
}


// ======================================================
// GET CURRENT USER
// ======================================================

export async function getCurrentUser() {

  try {

    const {
      data,
      error
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return data.user;

  } catch (error) {

    console.error(error);

    return null;
  }
}


// ======================================================
// GET SESSION
// ======================================================

export async function getSession() {

  try {

    const {
      data,
      error
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return data.session;

  } catch (error) {

    console.error(error);

    return null;
  }
}


// ======================================================
// REQUIRE AUTH
// ======================================================

export async function requireAuth() {

  const session =
    await getSession();

  if (!session) {

    window.location.href =
      '/src/pages/public/login.html';

    return false;
  }

  return true;
}


// ======================================================
// REQUIRE ADMIN
// ======================================================

export async function requireAdmin() {

  try {

    const session =
      await getSession();

    if (!session) {

      window.location.href =
        '/src/pages/public/login.html';

      return false;
    }

    const {
      data,
      error
    } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (error) {
      throw error;
    }

    if (!data.is_admin) {

      window.location.href =
        '/src/pages/app/dashboard.html';

      return false;
    }

    return true;

  } catch (error) {

    console.error(error);

    window.location.href =
      '/src/pages/public/login.html';

    return false;
  }
}


// ======================================================
// LISTEN AUTH CHANGES
// ======================================================

export function listenAuthChanges(
  callback
) {

  return supabase.auth.onAuthStateChange(
    async (event, session) => {

      callback(event, session);
    }
  );
}


// ======================================================
// VERIFY SESSION
// ======================================================

export async function verifySession() {

  const session =
    await getSession();

  if (!session) {
    return false;
  }

  return true;
}


// ======================================================
// REFRESH SESSION
// ======================================================

export async function refreshSession() {

  try {

    const {
      data,
      error
    } = await supabase.auth.refreshSession();

    if (error) {
      throw error;
    }

    return data.session;

  } catch (error) {

    console.error(error);

    return null;
  }
}


// ======================================================
// GET AUTH ERROR MESSAGE
// ======================================================

function getAuthErrorMessage(error) {

  const message =
    error?.message?.toLowerCase() || '';

  // LOGIN

  if (
    message.includes('invalid login credentials')
  ) {
    return 'Email o contraseña incorrectos';
  }

  // REGISTER

  if (
    message.includes('user already registered')
  ) {
    return 'Este email ya está registrado';
  }

  // PASSWORD

  if (
    message.includes('password')
  ) {
    return 'La contraseña no cumple los requisitos';
  }

  // RATE LIMIT

  if (
    message.includes('too many requests')
  ) {
    return 'Demasiados intentos. Inténtalo más tarde';
  }

  // EMAIL

  if (
    message.includes('email')
  ) {
    return 'Error relacionado con el email';
  }

  return 'Ha ocurrido un error inesperado';
}