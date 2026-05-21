-- Function generating in-app notifications
CREATE OR REPLACE FUNCTION public.generate_notifications(p_user_id UUID, p_title TEXT, p_message TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, is_read)
  VALUES (p_user_id, p_title, p_message, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
