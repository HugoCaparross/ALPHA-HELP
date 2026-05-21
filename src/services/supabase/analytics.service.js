import { supabase } from './client.js';

export const analyticsService = {
  async getAdminStats() {
    const { data, error } = await supabase.rpc('admin_stats');
    if (error) throw error;
    return data[0];
  }
};
