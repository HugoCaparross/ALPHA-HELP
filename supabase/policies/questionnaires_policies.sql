-- Enable RLS
ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can select questionnaires"
  ON public.questionnaires FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Users can manage their own attempts"
  ON public.questionnaire_attempts FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view and manage all attempts"
  ON public.questionnaire_attempts TO authenticated
  USING ((SELECT role_id FROM public.users WHERE id = auth.uid()) = 'admin');
