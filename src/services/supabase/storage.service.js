import { supabase } from './client.js';

export const storageService = {
  async getDownloadUrl(bucket, path) {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60);
    if (error) throw error;
    return data.signedUrl;
  }
};
