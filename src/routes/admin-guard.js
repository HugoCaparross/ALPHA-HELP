import { supabase } from '@/services/supabase/client.js';

export async function protectAdminRoute() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/src/pages/public/login.html';
    return;
  }

  const { data: profile, error } = await supabase
    .from('users')
    .select('role_id')
    .eq('id', session.user.id)
    .single();

  if (error || profile.role_id !== 'admin') {
    window.location.href = '/src/pages/protected/dashboard.html';
  }
}
