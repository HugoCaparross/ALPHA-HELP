-- Trigger preventing duplicate attempts on Questionnaire Attempts insert
CREATE OR REPLACE TRIGGER before_insert_attempt
  BEFORE INSERT ON public.questionnaire_attempts
  FOR EACH ROW EXECUTE FUNCTION public.check_duplicate_questionnaire_attempt();
