-- Function updating banner
CREATE OR REPLACE FUNCTION public.update_banner(p_banner_id UUID, p_title TEXT, p_content TEXT, p_is_active BOOLEAN)
RETURNS VOID AS $$
BEGIN
  UPDATE public.banners
  SET title = p_title,
      content = p_content,
      is_active = p_is_active
  WHERE id = p_banner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
