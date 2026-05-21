-- Function calculating aggregate statistics for administration dashboard
CREATE OR REPLACE FUNCTION public.admin_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_participants BIGINT,
  completed_pre BIGINT,
  completed_post BIGINT,
  spain_users BIGINT,
  latam_users BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.users) as total_users,
    (SELECT COUNT(*) FROM public.users WHERE role_id = 'participant') as total_participants,
    (SELECT COUNT(*) FROM public.questionnaire_attempts WHERE questionnaire_type = 'PRE' AND status = 'completed') as completed_pre,
    (SELECT COUNT(*) FROM public.questionnaire_attempts WHERE questionnaire_type = 'POST' AND status = 'completed') as completed_post,
    (SELECT COUNT(*) FROM public.users u JOIN public.interventions i ON u.intervention_id = i.id WHERE i.name = 'España') as spain_users,
    (SELECT COUNT(*) FROM public.users u JOIN public.interventions i ON u.intervention_id = i.id WHERE i.name = 'Latinoamérica') as latam_users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
