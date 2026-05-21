-- Function executing regex password check at DB level
CREATE OR REPLACE FUNCTION public.validate_password_policy(p_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF length(p_password) < 12 THEN
    RETURN FALSE;
  END IF;
  IF p_password !~ '[A-Z]' THEN
    RETURN FALSE;
  END IF;
  IF p_password !~ '[a-z]' THEN
    RETURN FALSE;
  END IF;
  IF p_password !~ '[0-9]' THEN
    RETURN FALSE;
  END IF;
  IF p_password !~ '[!@#$%^&*(),.?":{}|<>]' THEN
    RETURN FALSE;
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
