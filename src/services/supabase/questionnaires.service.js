import { supabase } from './client.js';

export const questionnairesService = {
  async getQuestionnaireByType(type) {
    const { data, error } = await supabase
      .from('questionnaires')
      .select('*')
      .eq('type', type)
      .single();

    if (error) throw error;
    return data;
  },

  async submitAttempt(questionnaireId, type, answers) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Los cuestionarios no admiten envíos anónimos.');

    const { data, error } = await supabase
      .from('questionnaire_attempts')
      .insert({
        user_id: user.id,
        questionnaire_id: questionnaireId,
        questionnaire_type: type,
        answers: answers,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;
    return data;
  }
};
