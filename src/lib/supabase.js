
// ═══════════════════════════════════════════════════════════
// FILE: src/lib/supabase.js
// Cliente singleton. Se importa en todos los demás archivos.
// ═══════════════════════════════════════════════════════════
import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!URL || !KEY) throw new Error('[alpha-help] Faltan variables de entorno de Supabase.')

export const supabase = createClient(URL, KEY, {
  auth: {
    persistSession: true,       // sesión persiste entre recargas
    autoRefreshToken: true,     // renueva JWT automáticamente
    detectSessionInUrl: true,   // captura tokens de OAuth / reset-password
    storageKey: 'alpha-help.auth'
  }
})