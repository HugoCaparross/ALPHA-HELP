// src/lib/supabase.js

import { createClient } from '@supabase/supabase-js';


// ======================================================
// ENV VARIABLES
// ======================================================

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL;

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY;


// ======================================================
// VALIDATION
// ======================================================

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {

  throw new Error(
    'Supabase environment variables are missing'
  );
}


// ======================================================
// CLIENT
// ======================================================

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {

    auth: {

      persistSession: true,

      autoRefreshToken: true,

      detectSessionInUrl: true,

      flowType: 'pkce'
    },

    global: {

      headers: {
        'X-Client-Info': 'alpha-help-web'
      }
    }
  }
);


// ======================================================
// SESSION HELPERS
// ======================================================

export async function getSession() {

  const {
    data,
    error
  } = await supabase.auth.getSession();

  if (error) {
    console.error(error);
    return null;
  }

  return data.session;
}


// ======================================================
// CURRENT USER
// ======================================================

export async function getCurrentUser() {

  const {
    data,
    error
  } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
    return null;
  }

  return data.user;
}


// ======================================================
// SIGN OUT
// ======================================================

export async function clearSession() {

  const { error } =
    await supabase.auth.signOut();

  if (error) {
    console.error(error);
    throw error;
  }
}


// ======================================================
// AUTH LISTENER
// ======================================================

export function onAuthChange(callback) {

  return supabase.auth.onAuthStateChange(
    async (event, session) => {

      callback(event, session);
    }
  );
}


// ======================================================
// PASSWORD RECOVERY
// ======================================================

export async function sendPasswordRecovery(
  email
) {

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

  return true;
}


// ======================================================
// UPDATE PASSWORD
// ======================================================

export async function updateUserPassword(
  password
) {

  const {
    error
  } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    throw error;
  }

  return true;
}


// ======================================================
// GOOGLE AUTH
// ======================================================

export async function signInWithGoogle() {

  const {
    error
  } = await supabase.auth.signInWithOAuth({

    provider: 'google',

    options: {

      redirectTo:
        `${window.location.origin}/src/pages/app/dashboard.html`,

      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });

  if (error) {
    throw error;
  }
}


// ======================================================
// SESSION EXPIRED CHECK
// ======================================================

export function isSessionExpired(session) {

  if (!session) return true;

  const expiresAt =
    session.expires_at * 1000;

  return Date.now() > expiresAt;
}


// ======================================================
// REFRESH SESSION
// ======================================================

export async function refreshSession() {

  const {
    data,
    error
  } = await supabase.auth.refreshSession();

  if (error) {
    throw error;
  }

  return data.session;
}


// ======================================================
// STORAGE HELPERS
// ======================================================

export async function getPrivateFileUrl(
  path,
  expiresIn = 3600
) {

  const {
    data,
    error
  } = await supabase
    .storage
    .from('resources')
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}


// ======================================================
// AVATAR UPLOAD
// ======================================================

export async function uploadAvatar(
  file,
  userId
) {

  const fileExt =
    file.name.split('.').pop();

  const fileName =
    `${Date.now()}.${fileExt}`;

  const filePath =
    `${userId}/${fileName}`;

  const {
    error
  } = await supabase
    .storage
    .from('avatars')
    .upload(filePath, file, {

      cacheControl: '3600',

      upsert: true
    });

  if (error) {
    throw error;
  }

  const {
    data
  } = supabase
    .storage
    .from('avatars')
    .getPublicUrl(filePath);

  return data.publicUrl;
}


// ======================================================
// DELETE FILE
// ======================================================

export async function deleteStorageFile(
  bucket,
  path
) {

  const {
    error
  } = await supabase
    .storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw error;
  }

  return true;
}


// ======================================================
// HEALTH CHECK
// ======================================================

export async function testConnection() {

  try {

    const {
      error
    } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    return !error;

  } catch (error) {

    console.error(error);

    return false;
  }
}