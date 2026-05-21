-- Sessions schema
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id UUID REFERENCES public.interventions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_url TEXT,
  unlock_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
