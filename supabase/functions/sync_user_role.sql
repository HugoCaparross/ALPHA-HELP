-- Function synchronizing user credentials and roles
CREATE OR REPLACE FUNCTION public.sync_user_role(p_user_id UUID, p_role_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users 
  SET role_id = p_role_id 
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
