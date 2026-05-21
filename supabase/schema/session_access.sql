-- Schema for session access control (desbloqueo progresivo)
CREATE TABLE IF NOT EXISTS public.session_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  is_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (user_id, session_id)
);
