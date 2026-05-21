-- Function to unlock next monthly session
CREATE OR REPLACE FUNCTION public.unlock_next_session(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_intervention_id UUID;
  v_completed_count INTEGER;
  v_next_session_id UUID;
BEGIN
  -- Get user intervention
  SELECT intervention_id INTO v_intervention_id FROM public.users WHERE id = p_user_id;
  -- Get completed sessions count
  SELECT completed_sessions_count INTO v_completed_count FROM public.user_progress WHERE user_id = p_user_id;
  
  -- Get session id for the next month
  SELECT id INTO v_next_session_id 
  FROM public.sessions 
  WHERE intervention_id = v_intervention_id AND month_number = v_completed_count + 1;

  IF v_next_session_id IS NOT NULL THEN
    INSERT INTO public.session_access (user_id, session_id, is_unlocked, unlocked_at)
    VALUES (p_user_id, v_next_session_id, TRUE, NOW())
    ON CONFLICT (user_id, session_id) 
    DO UPDATE SET is_unlocked = TRUE, unlocked_at = NOW();
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
