-- ═══════════════════════════════════════
-- EXTENSIONS
-- ═══════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════
-- TYPES
-- ═══════════════════════════════════════

CREATE TYPE user_region AS ENUM (
  'ES',
  'LATAM'
);

CREATE TYPE announcement_type AS ENUM (
  'info',
  'warning',
  'success'
);

CREATE TYPE resource_type AS ENUM (
  'video',
  'pdf',
  'link'
);

-- ═══════════════════════════════════════
-- PROFILES
-- ═══════════════════════════════════════

CREATE TABLE profiles (

  id UUID PRIMARY KEY
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  email TEXT UNIQUE NOT NULL,

  full_name TEXT NOT NULL,

  region user_region NOT NULL
    DEFAULT 'ES',

  avatar_url TEXT,

  is_admin BOOLEAN NOT NULL
    DEFAULT false,

  enrolled_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL
    DEFAULT NOW(),

  updated_at TIMESTAMPTZ NOT NULL
    DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- SESSIONS
-- ═══════════════════════════════════════

CREATE TABLE sessions (

  id UUID PRIMARY KEY
    DEFAULT uuid_generate_v4(),

  region user_region NOT NULL,

  month_number INTEGER NOT NULL,

  title TEXT NOT NULL,

  description TEXT,

  youtube_url TEXT,

  recording_url TEXT,

  live_at TIMESTAMPTZ,

  is_published BOOLEAN NOT NULL
    DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL
    DEFAULT NOW(),

  updated_at TIMESTAMPTZ NOT NULL
    DEFAULT NOW(),

  UNIQUE(region, month_number)
);

-- ═══════════════════════════════════════
-- USER PROGRESS
-- ═══════════════════════════════════════

CREATE TABLE user_progress (

  id UUID PRIMARY KEY
    DEFAULT uuid_generate_v4(),

  user_id UUID NOT NULL
    REFERENCES profiles(id)
    ON DELETE CASCADE,

  session_id UUID NOT NULL
    REFERENCES sessions(id)
    ON DELETE CASCADE,

  watched BOOLEAN NOT NULL
    DEFAULT false,

  completed BOOLEAN NOT NULL
    DEFAULT false,

  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL
    DEFAULT NOW(),

  updated_at TIMESTAMPTZ NOT NULL
    DEFAULT NOW(),

  UNIQUE(user_id, session_id)
);

-- ═══════════════════════════════════════
-- SESSION RESOURCES
-- ═══════════════════════════════════════

CREATE TABLE session_resources (

  id UUID PRIMARY KEY
    DEFAULT uuid_generate_v4(),

  session_id UUID NOT NULL
    REFERENCES sessions(id)
    ON DELETE CASCADE,

  title TEXT NOT NULL,

  description TEXT,

  type resource_type NOT NULL,

  url TEXT NOT NULL,

  sort_order INTEGER NOT NULL
    DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL
    DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- ANNOUNCEMENTS
-- ═══════════════════════════════════════

CREATE TABLE announcements (

  id UUID PRIMARY KEY
    DEFAULT uuid_generate_v4(),

  title TEXT NOT NULL,

  message TEXT NOT NULL,

  type announcement_type NOT NULL
    DEFAULT 'info',

  region user_region,

  is_active BOOLEAN NOT NULL
    DEFAULT true,

  starts_at TIMESTAMPTZ,

  ends_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL
    DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════

CREATE INDEX idx_profiles_region
ON profiles(region);

CREATE INDEX idx_sessions_region
ON sessions(region);

CREATE INDEX idx_sessions_published
ON sessions(is_published);

CREATE INDEX idx_progress_user
ON user_progress(user_id);

CREATE INDEX idx_progress_session
ON user_progress(session_id);

CREATE INDEX idx_announcements_active
ON announcements(is_active);

-- ═══════════════════════════════════════
-- UPDATED_AT TRIGGER
-- ═══════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()

RETURNS TRIGGER AS $$

BEGIN

  NEW.updated_at = NOW();

  RETURN NEW;

END;

$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════

CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER sessions_updated_at
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER progress_updated_at
BEFORE UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════
-- CREATE PROFILE ON REGISTER
-- ═══════════════════════════════════════

CREATE OR REPLACE FUNCTION handle_new_user()

RETURNS TRIGGER AS $$

BEGIN

  INSERT INTO profiles (
    id,
    email,
    full_name,
    region
  )

  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      ''
    ),
    COALESCE(
      (
        NEW.raw_user_meta_data->>'country'
      )::user_region,
      'ES'
    )
  );

  RETURN NEW;

END;

$$ LANGUAGE plpgsql
SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════
-- ADMIN FUNCTION
-- ═══════════════════════════════════════

CREATE OR REPLACE FUNCTION is_admin()

RETURNS BOOLEAN AS $$

BEGIN

  RETURN EXISTS (

    SELECT 1
    FROM profiles
    WHERE
      id = auth.uid()
      AND is_admin = true

  );

END;

$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- ═══════════════════════════════════════
-- GET MY SESSIONS
-- ═══════════════════════════════════════

CREATE OR REPLACE FUNCTION get_my_sessions()

RETURNS TABLE (

  id UUID,

  month_number INTEGER,

  title TEXT,

  description TEXT,

  youtube_url TEXT,

  recording_url TEXT,

  live_at TIMESTAMPTZ,

  access_status TEXT

)

LANGUAGE plpgsql
SECURITY DEFINER

AS $$

BEGIN

  RETURN QUERY

  SELECT
    s.id,
    s.month_number,
    s.title,
    s.description,
    s.youtube_url,
    s.recording_url,
    s.live_at,

    CASE
      WHEN s.live_at IS NULL
        THEN 'upcoming'

      WHEN s.live_at > NOW()
        THEN 'upcoming'

      ELSE 'available'
    END

  FROM sessions s

  INNER JOIN profiles p
    ON p.id = auth.uid()

  WHERE
    s.region = p.region
    AND s.is_published = true

  ORDER BY s.month_number ASC;

END;

$$;

-- ═══════════════════════════════════════
-- ENABLE RLS
-- ═══════════════════════════════════════

ALTER TABLE profiles
ENABLE ROW LEVEL SECURITY;

ALTER TABLE sessions
ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_progress
ENABLE ROW LEVEL SECURITY;

ALTER TABLE session_resources
ENABLE ROW LEVEL SECURITY;

ALTER TABLE announcements
ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════
-- PROFILE POLICIES
-- ═══════════════════════════════════════

CREATE POLICY "profiles_own_select"

ON profiles
FOR SELECT

USING (
  auth.uid() = id
);

CREATE POLICY "profiles_own_update"

ON profiles
FOR UPDATE

USING (
  auth.uid() = id
)

WITH CHECK (
  auth.uid() = id
);

CREATE POLICY "profiles_admin_select"

ON profiles
FOR SELECT

USING (
  is_admin()
);

-- ═══════════════════════════════════════
-- SESSIONS POLICIES
-- ═══════════════════════════════════════

CREATE POLICY "sessions_region_select"

ON sessions
FOR SELECT

USING (

  is_published = true

  AND region = (
    SELECT region
    FROM profiles
    WHERE id = auth.uid()
  )
);

CREATE POLICY "sessions_admin_all"

ON sessions
FOR ALL

USING (
  is_admin()
);

-- ═══════════════════════════════════════
-- USER PROGRESS POLICIES
-- ═══════════════════════════════════════

CREATE POLICY "progress_own_select"

ON user_progress
FOR SELECT

USING (
  auth.uid() = user_id
);

CREATE POLICY "progress_own_insert"

ON user_progress
FOR INSERT

WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "progress_own_update"

ON user_progress
FOR UPDATE

USING (
  auth.uid() = user_id
);

-- ═══════════════════════════════════════
-- RESOURCES POLICIES
-- ═══════════════════════════════════════

CREATE POLICY "resources_select"

ON session_resources
FOR SELECT

USING (

  EXISTS (

    SELECT 1
    FROM sessions s

    JOIN profiles p
      ON p.id = auth.uid()

    WHERE
      s.id = session_resources.session_id
      AND s.region = p.region
      AND s.is_published = true

  )
);

CREATE POLICY "resources_admin_all"

ON session_resources
FOR ALL

USING (
  is_admin()
);

-- ═══════════════════════════════════════
-- ANNOUNCEMENTS POLICIES
-- ═══════════════════════════════════════

CREATE POLICY "announcements_select"

ON announcements
FOR SELECT

USING (

  is_active = true

  AND (
    region IS NULL

    OR region = (
      SELECT region
      FROM profiles
      WHERE id = auth.uid()
    )
  )

  AND (
    starts_at IS NULL
    OR starts_at <= NOW()
  )

  AND (
    ends_at IS NULL
    OR ends_at >= NOW()
  )
);

CREATE POLICY "announcements_admin_all"

ON announcements
FOR ALL

USING (
  is_admin()
);

-- ═══════════════════════════════════════
-- STORAGE
-- ═══════════════════════════════════════

INSERT INTO storage.buckets (
  id,
  name,
  public
)

VALUES
(
  'avatars',
  'avatars',
  true
),

(
  'resources',
  'resources',
  false
);

-- ═══════════════════════════════════════
-- AVATARS POLICIES
-- ═══════════════════════════════════════

CREATE POLICY "avatars_public_read"

ON storage.objects
FOR SELECT

USING (
  bucket_id = 'avatars'
);

CREATE POLICY "avatars_own_upload"

ON storage.objects
FOR INSERT

WITH CHECK (

  bucket_id = 'avatars'

  AND auth.uid()::TEXT =
  (storage.foldername(name))[1]
);

CREATE POLICY "avatars_own_update"

ON storage.objects
FOR UPDATE

USING (

  bucket_id = 'avatars'

  AND auth.uid()::TEXT =
  (storage.foldername(name))[1]
);

CREATE POLICY "avatars_own_delete"

ON storage.objects
FOR DELETE

USING (

  bucket_id = 'avatars'

  AND auth.uid()::TEXT =
  (storage.foldername(name))[1]
);

-- ═══════════════════════════════════════
-- RESOURCES STORAGE POLICIES
-- ═══════════════════════════════════════

CREATE POLICY "resources_authenticated_read"

ON storage.objects
FOR SELECT

USING (

  bucket_id = 'resources'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "resources_admin_upload"

ON storage.objects
FOR INSERT

WITH CHECK (

  bucket_id = 'resources'
  AND is_admin()
);

CREATE POLICY "resources_admin_update"

ON storage.objects
FOR UPDATE

USING (

  bucket_id = 'resources'
  AND is_admin()
);

CREATE POLICY "resources_admin_delete"

ON storage.objects
FOR DELETE

USING (

  bucket_id = 'resources'
  AND is_admin()
);

-- ═══════════════════════════════════════
-- CUESTIONARIOS Y RESPUESTAS
-- ═══════════════════════════════════════

CREATE TABLE IF NOT EXISTS questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questionnaire_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  question_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  options JSONB,
  scale_min INTEGER,
  scale_max INTEGER,
  scale_labels JSONB,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(questionnaire_id, question_number)
);

CREATE TABLE IF NOT EXISTS questionnaire_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questionnaire_questions(id) ON DELETE CASCADE,
  likert_value INTEGER,
  text_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, questionnaire_id, question_id)
);

CREATE TABLE IF NOT EXISTS user_children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_order INTEGER NOT NULL,
  age INTEGER NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('Mujer', 'Hombre', 'Otro')),
  received_therapy BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, child_order)
);

ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "questionnaires_read_all" ON questionnaires FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "questions_read_all" ON questionnaire_questions FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "answers_own_select" ON questionnaire_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "answers_own_insert" ON questionnaire_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "answers_own_update" ON questionnaire_answers FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "children_own_select" ON user_children FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "children_own_insert" ON user_children FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "children_own_update" ON user_children FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "children_own_delete" ON user_children FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "questionnaires_admin_all" ON questionnaires FOR ALL USING (is_admin());
CREATE POLICY "questions_admin_all" ON questionnaire_questions FOR ALL USING (is_admin());
CREATE POLICY "answers_admin_all" ON questionnaire_answers FOR ALL USING (is_admin());
CREATE POLICY "children_admin_all" ON user_children FOR ALL USING (is_admin());