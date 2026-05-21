import { supabase } from '@/services/supabase/client.js';

export async function protectRoute() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/src/pages/public/login.html';
  }
  return session;
}
