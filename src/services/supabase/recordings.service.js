import { supabase } from './client.js';

export const recordingsService = {
  async getRecordingBySession(sessionId) {
    const { data, error } = await supabase
      .from('recordings')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
    return data;
  }
};
