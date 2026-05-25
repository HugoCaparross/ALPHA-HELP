import { supabase } from './supabase.js'

// ─────────────────────────────────────
// ERROR HANDLER
// ─────────────────────────────────────

function handleError(error, context) {

  console.error(
    `[DB_ERROR] ${context}`,
    error
  )

  throw new Error(
    'Ha ocurrido un error al cargar los datos.'
  )
}

// ─────────────────────────────────────
// PROFILE
// ─────────────────────────────────────

export async function getProfile(userId) {

  if (!userId) {
    throw new Error(
      'Usuario inválido.'
    )
  }

  const {
    data,
    error
  } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      full_name,
      is_admin,
      region,
      enrolled_at,
      created_at
    `)
    .eq('id', userId)
    .single()

  if (error) {
    handleError(error, 'getProfile')
  }

  return data || null
}

// ─────────────────────────────────────
// UPDATE PROFILE
// ─────────────────────────────────────

export async function updateProfile(
  userId,
  payload = {}
) {

  if (!userId) {
    throw new Error(
      'Usuario inválido.'
    )
  }

  const cleanPayload = {

    full_name:
      payload.full_name?.trim() || '',

    region:
      payload.region || 'ES'
  }

  const {
    data,
    error
  } = await supabase
    .from('profiles')
    .update(cleanPayload)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    handleError(error, 'updateProfile')
  }

  return data
}

// ─────────────────────────────────────
// SESSIONS
// ─────────────────────────────────────

export async function getMySessions() {

  const {
    data,
    error
  } = await supabase.rpc(
    'get_my_sessions'
  )

  if (error) {
    handleError(error, 'getMySessions')
  }

  return Array.isArray(data)
    ? data
    : []
}

// ─────────────────────────────────────
// SINGLE SESSION
// ─────────────────────────────────────

export async function getSessionById(id) {

  if (!id) {
    throw new Error(
      'Sesión inválida.'
    )
  }

  const {
    data,
    error
  } = await supabase
    .from('sessions')
    .select(`
      id,
      title,
      description,
      youtube_url,
      recording_url,
      month_number,
      live_at,
      is_published
    `)
    .eq('id', id)
    .single()

  if (error) {
    handleError(error, 'getSessionById')
  }

  return data || null
}

// ─────────────────────────────────────
// SESSION RESOURCES
// ─────────────────────────────────────

export async function getSessionResources(
  sessionId
) {

  if (!sessionId) {
    throw new Error(
      'Sesión inválida.'
    )
  }

  const {
    data,
    error
  } = await supabase
    .from('session_resources')
    .select(`
      id,
      title,
      description,
      type,
      url,
      sort_order
    `)
    .eq('session_id', sessionId)
    .order('sort_order', {
      ascending: true
    })

  if (error) {
    handleError(error, 'getSessionResources')
  }

  return Array.isArray(data)
    ? data
    : []
}

// ─────────────────────────────────────
// USER PROGRESS
// ─────────────────────────────────────

export async function markSessionCompleted(
  userId,
  sessionId
) {

  if (!userId || !sessionId) {
    throw new Error(
      'Datos inválidos.'
    )
  }

  const payload = {
    user_id: userId,
    session_id: sessionId,
    watched: true,
    completed: true,
    completed_at: new Date()
      .toISOString()
  }

  const {
    data,
    error
  } = await supabase
    .from('user_progress')
    .upsert(payload, {
      onConflict: 'user_id,session_id'
    })
    .select()
    .single()

  if (error) {
    handleError(
      error,
      'markSessionCompleted'
    )
  }

  return data
}

// ─────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────

export async function getAnnouncements() {

  const {
    data,
    error
  } = await supabase
    .from('announcements')
    .select(`
      id,
      title,
      message,
      type,
      starts_at,
      ends_at
    `)
    .order('created_at', {
      ascending: false
    })

  if (error) {
    handleError(
      error,
      'getAnnouncements'
    )
  }

  return Array.isArray(data)
    ? data
    : []
}

// ─────────────────────────────────────
// ADMIN
// ─────────────────────────────────────

export async function getUsers() {

  const {
    data,
    error
  } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      full_name,
      region,
      is_admin,
      enrolled_at
    `)
    .order('created_at', {
      ascending: false
    })

  if (error) {
    handleError(error, 'getUsers')
  }

  return Array.isArray(data)
    ? data
    : []
}

// ─────────────────────────────────────
// ADMIN ANNOUNCEMENTS
// ─────────────────────────────────────

export async function createAnnouncement(
  payload = {}
) {

  const cleanPayload = {

    title:
      payload.title?.trim() || '',

    message:
      payload.message?.trim() || '',

    type:
      payload.type || 'info',

    region:
      payload.region || null,

    is_active: true
  }

  const {
    data,
    error
  } = await supabase
    .from('announcements')
    .insert(cleanPayload)
    .select()
    .single()

  if (error) {
    handleError(
      error,
      'createAnnouncement'
    )
  }

  return data
}

// ─────────────────────────────────────
// STORAGE
// ─────────────────────────────────────

export async function uploadAvatar(
  userId,
  file
) {

  if (!userId || !file) {
    throw new Error(
      'Archivo inválido.'
    )
  }

  const fileExt =
    file.name.split('.').pop()

  const fileName =
    `${userId}/${crypto.randomUUID()}.${fileExt}`

  const {
    data,
    error
  } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true
    })

  if (error) {
    handleError(
      error,
      'uploadAvatar'
    )
  }

  return data
}

// ─────────────────────────────────────
// GET AVATAR URL
// ─────────────────────────────────────

export function getAvatarUrl(path) {

  if (!path) {
    return null
  }

  const {
    data
  } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  return data?.publicUrl || null
}