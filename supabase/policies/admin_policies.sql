-- Policies restricting sensitive tables to Admin
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can select or insert audit logs"
  ON public.audit_logs FOR ALL
  USING ((SELECT role_id FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can manage admin actions"
  ON public.admin_actions FOR ALL
  USING ((SELECT role_id FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can manage settings"
  ON public.settings FOR ALL
  USING ((SELECT role_id FROM public.users WHERE id = auth.uid()) = 'admin');
