-- Trigger function preventing more than 1 completed attempt per questionnaire
CREATE OR REPLACE FUNCTION public.check_duplicate_questionnaire_attempt()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.questionnaire_attempts
    WHERE user_id = new.user_id 
      AND questionnaire_id = new.questionnaire_id 
      AND status = 'completed'
  ) THEN
    RAISE EXCEPTION 'Este cuestionario ya ha sido completado y no puede reenviarse.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
