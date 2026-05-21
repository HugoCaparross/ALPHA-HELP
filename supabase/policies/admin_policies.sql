-- Admin full control policies for settings and logs
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have access to global settings"
  ON public.settings TO authenticated
  USING ((SELECT role_id FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins have access to audit logs"
  ON public.audit_logs TO authenticated
  USING ((SELECT role_id FROM public.users WHERE id = auth.uid()) = 'admin');
