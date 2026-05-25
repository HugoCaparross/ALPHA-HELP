// ═══════════════════════════════════════════════════════════
// FILE: src/lib/db.js
// Todas las queries a Supabase.
// Nunca construir SQL manual. Siempre usar el query builder.
// La validación de entrada se hace antes de llegar aquí.
// ═══════════════════════════════════════════════════════════
import { supabase } from './supabase.js'

// ── PROFILE ──────────────────────────────────────────────────

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, is_admin, region, enrolled_at')
    .eq('id', userId)
    .single()

  if (error) throw new Error('No se pudo cargar el perfil.')
  return data
}

export async function updateProfile(userId, { fullName }) {
  if (!fullName?.trim() || fullName.trim().length < 2) {
    throw new Error('El nombre debe tener al menos 2 caracteres.')
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName.trim().substring(0, 100),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) throw new Error('No se pudo actualizar el perfil.')
  return true
}

// ── SESSIONS ─────────────────────────────────────────────────

export async function getMySessions() {
  // Función RPC que aplica el filtro por región del usuario
  // y calcula el estado (upcoming/available/completed) en BD
  const { data, error } = await supabase.rpc('get_my_sessions')
  if (error) throw new Error('No se pudieron cargar las sesiones.')
  return data || []
}

export async function getSessionWithResources(sessionId) {
  if (!sessionId) throw new Error('ID de sesión no válido.')

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      id, title, description, youtube_url, live_at,
      recording_url, month_number, is_published,
      session_resources (
        id, title, description, type, url, sort_order
      )
    `)
    .eq('id', sessionId)
    .eq('is_published', true)
    .single()

  if (error) throw new Error('No se pudo cargar la sesión.')
  return data
}

export async function markSessionWatched(userId, sessionId) {
  if (!userId || !sessionId) throw new Error('Datos no válidos.')

  const { error } = await supabase
    .from('user_progress')
    .upsert(
      { user_id: userId, session_id: sessionId, watched: true },
      { onConflict: 'user_id,session_id' }
    )

  if (error) throw new Error('No se pudo guardar el progreso.')
  return true
}

export async function markSessionCompleted(userId, sessionId) {
  if (!userId || !sessionId) throw new Error('Datos no válidos.')

  const { error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: userId,
        session_id: sessionId,
        watched: true,
        completed: true,
        completed_at: new Date().toISOString()
      },
      { onConflict: 'user_id,session_id' }
    )

  if (error) throw new Error('No se pudo guardar el progreso.')
  return true
}

export async function getUserProgress(userId) {
  if (!userId) throw new Error('ID de usuario no válido.')

  const { data, error } = await supabase
    .from('user_progress')
    .select('session_id, watched, completed, completed_at')
    .eq('user_id', userId)

  if (error) throw new Error('No se pudo cargar el progreso.')
  return data || []
}

// ── ANNOUNCEMENTS ─────────────────────────────────────────────

export async function getAnnouncements() {
  const now = new Date().toISOString()

  const { data } = await supabase
    .from('announcements')
    .select('id, title, message, type')
    .eq('is_active', true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order('created_at', { ascending: false })
    .limit(5)

  return data || []   // Fallo silencioso — no es crítico
}

// ── CONTACT ───────────────────────────────────────────────────

export async function sendContactMessage({ userId, name, email, subject, message }) {
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    throw new Error('Todos los campos son obligatorios.')
  }

  const { error } = await supabase
    .from('contact_messages')
    .insert({
      user_id: userId || null,
      name:    name.trim().substring(0, 200),
      email:   email.trim().toLowerCase().substring(0, 200),
      subject: subject.trim().substring(0, 300),
      message: message.trim().substring(0, 3000)
    })

  if (error) throw new Error('No se pudo enviar el mensaje. Inténtalo de nuevo.')
  return true
}

// ── ADMIN — USUARIOS ──────────────────────────────────────────

export async function adminGetUsers({ search = '', limit = 50, offset = 0 } = {}) {
  let q = supabase
    .from('profiles')
    .select('id, email, full_name, is_admin, region, enrolled_at', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('enrolled_at', { ascending: false })

  const s = search.trim()
  if (s) q = q.or(`email.ilike.%${s}%,full_name.ilike.%${s}%`)

  const { data, error, count } = await q
  if (error) throw new Error('No se pudieron cargar los usuarios.')
  return { rows: data || [], total: count || 0 }
}

export async function adminSetAdmin(userId, isAdmin) {
  if (!userId) throw new Error('ID no válido.')

  const { error } = await supabase
    .from('profiles')
    .update({ is_admin: Boolean(isAdmin) })
    .eq('id', userId)

  if (error) throw new Error('No se pudo actualizar el rol.')
  return true
}

// ── ADMIN — SESIONES ──────────────────────────────────────────

export async function adminGetAllSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('id, region, month_number, title, is_published, live_at, recording_url')
    .order('region')
    .order('month_number')

  if (error) throw new Error('No se pudieron cargar las sesiones.')
  return data || []
}

export async function adminUpsertSession(payload) {
  const { id, region, month_number, title, description,
          youtube_url, live_at, recording_url, is_published } = payload

  if (!['ES', 'LATAM'].includes(region)) throw new Error('Región no válida.')
  if (!month_number || month_number < 1 || month_number > 12) throw new Error('Número de sesión no válido (1–12).')
  if (!title?.trim()) throw new Error('El título es obligatorio.')

  const row = {
    region,
    month_number: parseInt(month_number, 10),
    title:        title.trim().substring(0, 200),
    description:  (description || '').trim().substring(0, 2000),
    youtube_url:  youtube_url?.trim()  || null,
    live_at:      live_at              || null,
    recording_url: recording_url?.trim() || null,
    is_published: Boolean(is_published)
  }

  const { error } = id
    ? await supabase.from('sessions').update(row).eq('id', id)
    : await supabase.from('sessions').insert(row)

  if (error) throw new Error('No se pudo guardar la sesión.')
  return true
}

export async function adminDeleteSession(id) {
  if (!id) throw new Error('ID no válido.')
  const { error } = await supabase.from('sessions').delete().eq('id', id)
  if (error) throw new Error('No se pudo eliminar la sesión.')
  return true
}

// ── ADMIN — AVISOS ────────────────────────────────────────────

export async function adminGetAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error('No se pudieron cargar los avisos.')
  return data || []
}

export async function adminUpsertAnnouncement(payload) {
  const { id, title, message, type, region, is_active, starts_at, ends_at } = payload

  if (!title?.trim() || !message?.trim()) throw new Error('Título y mensaje son obligatorios.')

  const row = {
    title:     title.trim().substring(0, 200),
    message:   message.trim().substring(0, 1000),
    type:      ['info', 'warning', 'success'].includes(type) ? type : 'info',
    region:    ['ES', 'LATAM'].includes(region) ? region : null,
    is_active: Boolean(is_active),
    starts_at: starts_at || null,
    ends_at:   ends_at   || null
  }

  const { error } = id
    ? await supabase.from('announcements').update(row).eq('id', id)
    : await supabase.from('announcements').insert(row)

  if (error) throw new Error('No se pudo guardar el aviso.')
  return true
}

export async function adminDeleteAnnouncement(id) {
  if (!id) throw new Error('ID no válido.')
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) throw new Error('No se pudo eliminar el aviso.')
  return true
}

// ── ADMIN — STATS ─────────────────────────────────────────────

export async function adminGetStats() {
  const { data, error } = await supabase.rpc('admin_stats')
  if (error) throw new Error('No se pudieron cargar las estadísticas.')
  // admin_stats() devuelve SETOF (una fila), data es un array
  return data?.[0] || {}
}