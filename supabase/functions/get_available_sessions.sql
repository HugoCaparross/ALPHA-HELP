-- Function returning unlocked sessions for a specific participant
CREATE OR REPLACE FUNCTION public.get_available_sessions(p_user_id UUID)
RETURNS TABLE (
  session_id UUID,
  title TEXT,
  month_number INTEGER,
  is_unlocked BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id as session_id,
    s.title,
    s.month_number,
    coalesce(sa.is_unlocked, FALSE) as is_unlocked
  FROM public.sessions s
  LEFT JOIN public.session_access sa ON s.id = sa.session_id AND sa.user_id = p_user_id
  WHERE s.intervention_id = (SELECT intervention_id FROM public.users WHERE id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
