-- Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sessions of their intervention"
  ON public.sessions FOR SELECT
  USING (intervention_id = (SELECT intervention_id FROM public.users WHERE id = auth.uid()) OR (SELECT role_id FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can view own session access"
  ON public.session_access FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own completed sessions"
  ON public.user_sessions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins have full access to session control"
  ON public.sessions TO authenticated
  USING ((SELECT role_id FROM public.users WHERE id = auth.uid()) = 'admin');
