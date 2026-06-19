-- Create ENUMs
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE intent_type AS ENUM ('study_buddy', 'friends', 'networking', 'dating');
CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TYPE conversation_type AS ENUM ('direct', 'group');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'actioned');

-- USERS TABLE
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- matches Clerk user ID
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE,
  age INTEGER,
  college TEXT,
  course TEXT,
  passing_year INTEGER,
  interests TEXT[],
  intent intent_type,
  role user_role DEFAULT 'user',
  is_banned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COLLEGES & COURSES (Admin manageable)
CREATE TABLE colleges (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- CONNECTIONS
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  receiver_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  intro_message TEXT,
  status connection_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  UNIQUE(sender_id, receiver_id)
);

-- CONVERSATIONS
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type conversation_type NOT NULL,
  created_by TEXT REFERENCES users(id) ON DELETE CASCADE,
  member_ids TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FINLIT
CREATE TABLE finlit_questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_option_index INTEGER NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE finlit_progress (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  total_correct INTEGER DEFAULT 0,
  total_attempted INTEGER DEFAULT 0
);

-- REPORTS
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  context_message TEXT,
  status report_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANNOUNCEMENTS
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  target TEXT NOT NULL,
  target_college TEXT,
  sent_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BLOCKS
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  blocked_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);
