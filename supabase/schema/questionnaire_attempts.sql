-- Schema for questionnaire attempts linked directly to auth.users via public.users.id
CREATE TABLE IF NOT EXISTS public.questionnaire_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  questionnaire_id UUID REFERENCES public.questionnaires(id) ON DELETE CASCADE,
  questionnaire_type TEXT NOT NULL CHECK (questionnaire_type IN ('PRE', 'POST')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'started', 'completed')) DEFAULT 'pending',
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (user_id, questionnaire_id)
);

CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON public.questionnaire_attempts(user_id);
