-- Trigger function when auth.users updates email verification
CREATE OR REPLACE FUNCTION public.sync_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF new.email_confirmed_at IS NOT NULL AND (old.email_confirmed_at IS NULL) THEN
    PERFORM public.verify_user_email(new.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_user_email_verified
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_email_verification();
