-- Trigger logging admin operations
CREATE OR REPLACE TRIGGER log_admin_banners_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_action();
