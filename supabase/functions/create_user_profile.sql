-- Function to automatically create a public user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role_id, email_verified)
  VALUES (
    new.id,
    new.email,
    'participant',
    (new.email_confirmed_at IS NOT NULL)
  );
  
  -- Initialize empty user progress
  INSERT INTO public.user_progress (user_id, completed_sessions_count)
  VALUES (new.id, 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
