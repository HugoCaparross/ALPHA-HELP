-- Schema for Interventions
CREATE TABLE IF NOT EXISTS public.interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL CHECK (name IN ('España', 'Latinoamérica')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default Interventions
INSERT INTO public.interventions (name, description) VALUES
  ('España', 'Intervención para participantes residentes en España'),
  ('Latinoamérica', 'Intervención para participantes residentes en Latinoamérica')
ON CONFLICT (name) DO NOTHING;
