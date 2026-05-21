-- Function to automatically assign an intervention based on selection
CREATE OR REPLACE FUNCTION public.assign_intervention(p_user_id UUID, p_region TEXT)
RETURNS VOID AS $$
DECLARE
  v_intervention_id UUID;
BEGIN
  SELECT id INTO v_intervention_id FROM public.interventions WHERE name = p_region;
  
  IF v_intervention_id IS NULL THEN
    RAISE EXCEPTION 'Intervención para la región % no encontrada.', p_region;
  END IF;

  UPDATE public.users 
  SET intervention_id = v_intervention_id 
  WHERE id = p_user_id;

  -- Auto unlock the first session of the assigned intervention for the user
  INSERT INTO public.session_access (user_id, session_id, is_unlocked, unlocked_at)
  SELECT p_user_id, id, TRUE, NOW()
  FROM public.sessions
  WHERE intervention_id = v_intervention_id AND month_number = 1
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
