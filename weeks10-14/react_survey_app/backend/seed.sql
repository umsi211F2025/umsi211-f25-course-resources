-- Seed data for survey app

-- For Postgres, we don't manually specify IDs for SERIAL columns
-- The database will auto-generate them
INSERT INTO questions (text) VALUES
  ('What is your favorite fruit?'),
  ('What is your favorite animal?'),
  ('Does Pineapple belong on pizza?');

INSERT INTO answer_options (question_id, text) VALUES
  (1, 'Apple'),
  (1, 'Banana'),
  (1, 'Cherry'),
  (1, 'Pomegranate'),
  (2, 'Dog'),
  (2, 'Cat'),
  (2, 'Snake'),
  (2, 'Rhinoceros'),
  (3, 'Yes'),
  (3, 'No');

-- Optionally, add a demo user
INSERT INTO users (name, email) VALUES
  ('Demo User', 'demo@example.com');

-- Optionally, add some answers
-- Note: Using 1 as user_id since the demo user will be auto-assigned id=1
INSERT INTO answers (user_id, question_id, answer_id, free_answer) VALUES
  (1, 1, 2, NULL),
  (1, 2, NULL, '5');
