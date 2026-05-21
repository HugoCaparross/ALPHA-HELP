-- Row Level Security for sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view sessions"
  ON public.sessions FOR SELECT TO authenticated
  USING (TRUE);
