-- Schema for participant completion progress
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  completed_sessions_count INTEGER NOT NULL DEFAULT 0 CHECK (completed_sessions_count BETWEEN 0 AND 9),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
