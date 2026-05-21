-- Schema for Roles
CREATE TABLE IF NOT EXISTS public.roles (
  id TEXT PRIMARY KEY CHECK (id IN ('admin', 'participant')),
  role_name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default Roles
INSERT INTO public.roles (id, role_name) VALUES
  ('admin', 'Administrador'),
  ('participant', 'Participante')
ON CONFLICT (id) DO NOTHING;
