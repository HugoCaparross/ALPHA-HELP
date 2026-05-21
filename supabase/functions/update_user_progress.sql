-- Function updating user progress aggregates
CREATE OR REPLACE FUNCTION public.update_user_progress(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_completed_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_completed_count
  FROM public.user_sessions
  WHERE user_id = p_user_id AND is_completed = TRUE;

  UPDATE public.user_progress
  SET completed_sessions_count = v_completed_count,
      last_activity_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
