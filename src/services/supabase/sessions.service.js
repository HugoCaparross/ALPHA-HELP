import { supabase } from './client.js';

export const sessionsService = {
  async getMySessions() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado.');

    const { data, error } = await supabase.rpc('get_available_sessions', {
      p_user_id: user.id
    });

    if (error) throw error;
    return data;
  },

  async markCompleted(sessionId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado.');

    const { data, error } = await supabase
      .from('user_sessions')
      .upsert({
        user_id: user.id,
        session_id: sessionId,
        is_completed: true,
        completed_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;

    // Auto unlock the next month session
    await supabase.rpc('unlock_next_session', { p_user_id: user.id });
    // Recalculate progress stats
    await supabase.rpc('update_user_progress', { p_user_id: user.id });

    return data;
  }
};
