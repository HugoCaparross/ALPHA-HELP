import { supabase } from './client.js';

export const authService = {
  async register(email, password, region) {
    // Create authentication account in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/src/pages/public/login.html'
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No se pudo crear la cuenta.');

    // RPC to automatically assign intervention
    const { error: rpcError } = await supabase.rpc('assign_intervention', {
      p_user_id: authData.user.id,
      p_region: region
    });
    if (rpcError) console.error('Error asignando la región:', rpcError.message);

    return authData;
  },

  async login(email, password, rememberMe = false) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Verify if profile is marked as verified
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('email_verified, role_id')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;
    if (!profile.email_verified) {
      // Sign out immediately if email is not confirmed in profile
      await supabase.auth.signOut();
      throw new Error('Debes verificar tu dirección de correo antes de acceder.');
    }

    if (rememberMe) {
      // Handled automatically by Supabase local storage persistence
    }
    return { user: data.user, role: profile.role_id };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = '/src/pages/public/login.html';
  },

  async forgotPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/src/pages/public/reset-password.html'
    });
    if (error) throw error;
    return data;
  },

  async resetPassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  }
};
