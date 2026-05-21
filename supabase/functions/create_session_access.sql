-- Function inserting session access record
CREATE OR REPLACE FUNCTION public.create_session_access(p_user_id UUID, p_session_id UUID, p_unlocked BOOLEAN)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.session_access (user_id, session_id, is_unlocked, unlocked_at)
  VALUES (p_user_id, p_session_id, p_unlocked, CASE WHEN p_unlocked THEN NOW() ELSE NULL END)
  ON CONFLICT (user_id, session_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
