-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins have total select access"
  ON public.users FOR SELECT
  USING ((SELECT role_id FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins have total update access"
  ON public.users FOR UPDATE
  USING ((SELECT role_id FROM public.users WHERE id = auth.uid()) = 'admin');
