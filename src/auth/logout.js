import { supabase } from '@/services/supabase/client.js';
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = '/src/pages/public/login.html';
}
