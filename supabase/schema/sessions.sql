-- Schema for 9 Sessions (1 per month)
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id UUID REFERENCES public.interventions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  month_number INTEGER NOT NULL CHECK (month_number BETWEEN 1 AND 9),
  unlock_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (intervention_id, month_number)
);

CREATE INDEX IF NOT EXISTS idx_sessions_intervention ON public.sessions(intervention_id);
