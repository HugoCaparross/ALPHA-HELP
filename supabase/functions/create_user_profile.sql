-- Function to automatically create a public user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role_id, email_verified)
  VALUES (new.id, new.email, 'participant', (new.email_confirmed_at IS NOT NULL));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
