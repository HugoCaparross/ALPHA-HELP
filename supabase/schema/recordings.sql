-- Schema for video recordings of sessions
CREATE TABLE IF NOT EXISTS public.recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE UNIQUE,
  video_url TEXT NOT NULL,
  duration_seconds INTEGER CHECK (duration_seconds > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
