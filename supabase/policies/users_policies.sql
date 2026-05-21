-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins have full access to users"
  ON public.users TO authenticated
  USING ((SELECT role_id FROM public.users WHERE id = auth.uid()) = 'admin');
