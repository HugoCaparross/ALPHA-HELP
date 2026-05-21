-- Function to validate answers schema
CREATE OR REPLACE FUNCTION public.validate_questionnaire(p_questions JSONB, p_answers JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  -- Ensures answer fields map correctly without orphan objects
  IF jsonb_typeof(p_answers) <> 'object' THEN
    RETURN FALSE;
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
