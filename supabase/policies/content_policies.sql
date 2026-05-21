-- Content RLS
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view content" ON public.content FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage content" ON public.content FOR ALL USING ((SELECT role_id FROM public.users WHERE id = auth.uid()) = 'admin');
