import { supabase } from './client.js';

export const contentService = {
  async getSection(sectionName) {
    const { data, error } = await supabase
      .from('content')
      .select('body')
      .eq('section', sectionName)
      .single();
    if (error) throw error;
    return data.body;
  }
};
