-- Function marking email status in profile
CREATE OR REPLACE FUNCTION public.verify_user_email(p_user_id UUID)
RETURNS VOID AS $$ 
BEGIN
  UPDATE public.users
  SET email_verified = TRUE
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
