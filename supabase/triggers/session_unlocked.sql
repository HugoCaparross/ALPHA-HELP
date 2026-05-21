-- Trigger listening to unlocked sessions to generate notifications
CREATE OR REPLACE FUNCTION public.on_session_unlocked_trigger_fn()
RETURNS TRIGGER AS $$
BEGIN
  IF new.is_unlocked = TRUE AND (old.is_unlocked IS NULL OR old.is_unlocked = FALSE) THEN
    PERFORM public.generate_notifications(
      new.user_id,
      '¡Nueva sesión disponible!',
      'Se ha desbloqueado la sesión correspondiente a este mes.'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER session_unlocked_trigger
  AFTER UPDATE ON public.session_access
  FOR EACH ROW EXECUTE FUNCTION public.on_session_unlocked_trigger_fn();
