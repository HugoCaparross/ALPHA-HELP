-- Questionnaire attempts schema
CREATE TABLE IF NOT EXISTS public.questionnaire_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  questionnaire_id UUID REFERENCES public.questionnaires(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
