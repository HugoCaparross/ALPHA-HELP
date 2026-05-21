-- Schema for Roles
CREATE TABLE IF NOT EXISTS public.roles (
  id TEXT PRIMARY KEY,
  role_name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert pre-defined roles
INSERT INTO public.roles (id, role_name) VALUES
  ('admin', 'Administrador'),
  ('participant', 'Participante')
ON CONFLICT DO NOTHING;
