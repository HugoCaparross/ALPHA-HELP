import { supabase } from "./supabase.js";

import { sanitizeFormData } from "../utils/validators.js";

import { showToast } from "../components/ui.js";

// ======================================================
// CONSTANTS
// ======================================================

const LOGIN_REDIRECT = "/src/pages/app/dashboard.html";

const PUBLIC_LOGIN = "/src/pages/public/login.html";

// ======================================================
// LOGIN
// ======================================================

export async function login(data = {}) {
  try {
    const sanitized = sanitizeFormData(data);
    const { email, password } = sanitized;
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    showToast("success", "Sesión iniciada correctamente");
    window.location.href = LOGIN_REDIRECT;
    return authData;
  } catch (error) {
    console.error(error);
    throw new Error(getAuthErrorMessage(error));
  }
}

// ======================================================
// REGISTER
// ======================================================

export async function register(data = {}) {
  try {
    const sanitized = sanitizeFormData(data);

    const { email, password, region } = sanitized;

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/.test(
        password,
      )
    ) {
      throw new Error("La contraseña no cumple los requisitos de seguridad");
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${PUBLIC_LOGIN}`,

        data: {
          region,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (!authData?.user) {
      showToast(
        "success",
        "Cuenta creada correctamente. Revisa tu correo para verificar tu cuenta.",
      );

      return authData;
    }

    showToast("success", "Revisa tu email para verificar tu cuenta");

    return authData;
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    throw new Error(getAuthErrorMessage(error));
  }
}

// ======================================================
// GOOGLE AUTH
// ======================================================

export async function loginWithGoogle() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${LOGIN_REDIRECT}`,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });
    if (error) throw error;
  } catch (error) {
    console.error(error);
    showToast("error", getAuthErrorMessage(error));
  }
}

// ======================================================
// LOGOUT
// ======================================================

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    localStorage.clear();

    sessionStorage.clear();

    window.location.href = PUBLIC_LOGIN;
  } catch (error) {
    console.error(error);

    showToast("error", "No se pudo cerrar sesión");
  }
}

// ======================================================
// RECOVER PASSWORD
// ======================================================

export async function recoverPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/src/pages/public/reset-password.html`,
    });

    if (error) {
      throw error;
    }

    showToast("success", "Te hemos enviado un email de recuperación");

    return true;
  } catch (error) {
    console.error(error);

    throw new Error(getAuthErrorMessage(error));
  }
}

// ======================================================
// UPDATE PASSWORD
// ======================================================

export async function updatePassword(password) {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }

    showToast("success", "Contraseña actualizada correctamente");

    setTimeout(() => {
      window.location.href = PUBLIC_LOGIN;
    }, 1200);

    return true;
  } catch (error) {
    console.error(error);

    throw new Error(getAuthErrorMessage(error));
  }
}

// ======================================================
// GET USER
// ======================================================

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();

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
    const { data, error } = await supabase.auth.getSession();

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

// ======================================================
// REQUIRE AUTH
// ======================================================

export async function requireAuth() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      window.location.href = PUBLIC_LOGIN;
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);

    window.location.href = PUBLIC_LOGIN;

    return false;
  }
}

// ======================================================
// REQUIRE GUEST
// ======================================================

export async function requireGuest() {
  const session = await getSession();

  if (session) {
    window.location.href = LOGIN_REDIRECT;

    return false;
  }

  return true;
}

// ======================================================
// AUTH LISTENER
// ======================================================

export function listenAuthChanges(callback) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    callback(event, session);

    if (event === "SIGNED_OUT") {
      localStorage.clear();

      sessionStorage.clear();
    }
  });
}

// ======================================================
// ERROR HANDLER
// ======================================================

function getAuthErrorMessage(error) {
  const message = error?.message?.toLowerCase() || "";

  if (message.includes("invalid login credentials")) {
    return "Email o contraseña incorrectos";
  }

  if (message.includes("email not confirmed")) {
    return "Debes verificar tu email antes de iniciar sesión";
  }

  if (message.includes("user already registered")) {
    return "Este email ya está registrado";
  }

  if (message.includes("password")) {
    return "La contraseña no cumple los requisitos";
  }

  if (message.includes("too many requests")) {
    return "Demasiados intentos. Inténtalo más tarde";
  }

  if (message.includes("network")) {
    return "Error de conexión";
  }

  if (message.includes("email")) {
    return "Error relacionado con el email";
  }

  return "Ha ocurrido un error inesperado";
}

// ======================================================
// REQUIRE ADMIN
// ======================================================

export async function requireAdmin() {
  try {
    const { data: userData, error } = await supabase.auth.getUser();
    if (error) throw error;
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userData.user.id)
      .single();
    if (profileErr) throw profileErr;
    if (!profile.is_admin) {
      window.location.href = "/src/pages/app/dashboard.html";
      return false;
    }
    return true;
  } catch (error) {
    console.error("Admin guard error:", error);
    window.location.href = "/src/pages/public/login.html";
    return false;
  }
}
