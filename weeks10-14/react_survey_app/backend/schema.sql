-- Postgres schema for survey app

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS answer_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Answers table with Clerk user IDs (TEXT format)
CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,  -- Clerk user ID (e.g., 'user_2abc123...')
  question_id INTEGER NOT NULL,
  answer_id INTEGER,
  free_answer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (question_id) REFERENCES questions(id),
  FOREIGN KEY (answer_id) REFERENCES answer_options(id)
);

-- Index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_answers_user_id ON answers(user_id);
