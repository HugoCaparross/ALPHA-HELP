// ALPHA-HELP - Application Core Manager
import { supabase } from '@/services/supabase/client.js';

export async function initApp() {
  console.log('ALPHA-HELP: Aplicación lista y corriendo.');
  // Check active Supabase session here securely
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error obteniendo sesión de Supabase:', error);
  } else {
    console.log('Sesión activa:', session ? 'Usuario logueado' : 'Invitado');
  }
}
