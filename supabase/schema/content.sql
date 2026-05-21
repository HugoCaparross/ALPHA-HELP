-- Content schema
CREATE TABLE IF NOT EXISTS public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT UNIQUE NOT NULL,
  body JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
