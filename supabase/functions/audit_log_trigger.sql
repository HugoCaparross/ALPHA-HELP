-- Function writing standard administrative audits
CREATE OR REPLACE FUNCTION public.log_audit_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, details)
  VALUES (
    auth.uid(),
    TG_OP || ' ON ' || TG_TABLE_NAME,
    'Row ID: ' || coalesce(new.id::text, old.id::text)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
