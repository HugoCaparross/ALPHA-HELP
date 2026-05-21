-- FAQ RLS
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view FAQ" ON public.faq FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage FAQ" ON public.faq FOR ALL USING ((SELECT role_id FROM public.users WHERE id = auth.uid()) = 'admin');
