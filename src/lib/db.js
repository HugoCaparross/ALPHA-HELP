// src/lib/db.js

import { supabase } from './supabase.js';


// ======================================================
// PROFILE
// ======================================================

export async function getMyProfile() {

  const {
    data,
    error
  } = await supabase
    .from('profiles')
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function updateMyProfile(
  updates = {}
) {

  const {
    data: userData
  } = await supabase.auth.getUser();

  const {
    data,
    error
  } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date()
    })
    .eq('id', userData.user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


// ======================================================
// SESSIONS
// ======================================================

export async function getMySessions() {

  const {
    data,
    error
  } = await supabase.rpc(
    'get_my_sessions'
  );

  if (error) {
    throw error;
  }

  return data;
}


export async function getSessionById(id) {

  const {
    data,
    error
  } = await supabase
    .from('sessions')
    .select(`
      *,
      session_resources (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function getUpcomingSession() {

  const {
    data,
    error
  } = await supabase
    .from('sessions')
    .select('*')
    .eq('is_published', true)
    .gte('live_at', new Date().toISOString())
    .order('live_at', {
      ascending: true
    })
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  return data;
}


export async function markSessionCompleted(
  sessionId
) {

  const {
    data: userData
  } = await supabase.auth.getUser();

  const {
    data,
    error
  } = await supabase
    .from('user_progress')
    .upsert({

      user_id: userData.user.id,

      session_id: sessionId,

      watched: true,

      completed: true,

      completed_at:
        new Date().toISOString()

    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


// ======================================================
// RESOURCES
// ======================================================

export async function getResources() {

  const {
    data,
    error
  } = await supabase
    .from('session_resources')
    .select(`
      *,
      sessions (
        title,
        month_number
      )
    `)
    .order('sort_order', {
      ascending: true
    });

  if (error) {
    throw error;
  }

  return data;
}


// ======================================================
// ANNOUNCEMENTS
// ======================================================

export async function getAnnouncements() {

  const {
    data,
    error
  } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', {
      ascending: false
    });

  if (error) {
    throw error;
  }

  return data;
}


// ======================================================
// USER PROGRESS
// ======================================================

export async function getUserProgress() {

  const {
    data,
    error
  } = await supabase
    .from('user_progress')
    .select(`
      *,
      sessions (
        title,
        month_number
      )
    `);

  if (error) {
    throw error;
  }

  return data;
}


// ======================================================
// ADMIN USERS
// ======================================================

export async function adminGetUsers() {

  const {
    data,
    error
  } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', {
      ascending: false
    });

  if (error) {
    throw error;
  }

  return data;
}


export async function adminGetUserById(
  userId
) {

  const {
    data,
    error
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function adminUpdateUser(
  userId,
  updates = {}
) {

  const {
    data,
    error
  } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function adminDeleteUser(
  userId
) {

  const {
    error
  } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) {
    throw error;
  }

  return true;
}


// ======================================================
// ADMIN SESSIONS
// ======================================================

export async function adminGetSessions() {

  const {
    data,
    error
  } = await supabase
    .from('sessions')
    .select('*')
    .order('month_number', {
      ascending: true
    });

  if (error) {
    throw error;
  }

  return data;
}


export async function adminCreateSession(
  session
) {

  const {
    data,
    error
  } = await supabase
    .from('sessions')
    .insert(session)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function adminUpdateSession(
  sessionId,
  updates
) {

  const {
    data,
    error
  } = await supabase
    .from('sessions')
    .update({
      ...updates,
      updated_at: new Date()
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function adminDeleteSession(
  sessionId
) {

  const {
    error
  } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    throw error;
  }

  return true;
}


// ======================================================
// SESSION RESOURCES
// ======================================================

export async function adminCreateResource(
  resource
) {

  const {
    data,
    error
  } = await supabase
    .from('session_resources')
    .insert(resource)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function adminDeleteResource(
  resourceId
) {

  const {
    error
  } = await supabase
    .from('session_resources')
    .delete()
    .eq('id', resourceId);

  if (error) {
    throw error;
  }

  return true;
}


// ======================================================
// ANNOUNCEMENTS ADMIN
// ======================================================

export async function adminCreateAnnouncement(
  announcement
) {

  const {
    data,
    error
  } = await supabase
    .from('announcements')
    .insert(announcement)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function adminUpdateAnnouncement(
  id,
  updates
) {

  const {
    data,
    error
  } = await supabase
    .from('announcements')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function adminDeleteAnnouncement(
  id
) {

  const {
    error
  } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
}