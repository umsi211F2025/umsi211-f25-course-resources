-- Seed data for survey app

INSERT INTO questions (id, text) VALUES
  (1, 'What is your favorite fruit?'),
  (2, 'What is your favorite animal?'),
  (3, 'Does Pineapple belong on pizza?');

INSERT INTO answer_options (id, question_id, text) VALUES
  (1, 1, 'Apple'),
  (2, 1, 'Banana'),
  (3, 1, 'Cherry'),
  (4, 1, 'Pomegranate'),
  (5, 2, 'Dog'),
  (6, 2, 'Cat'),
  (7, 2, 'Snake'),
  (8, 2, 'Rhinoceros'),
  (9, 3, 'Yes'),
  (10, 3, 'No');

-- Optionally, add a demo user
INSERT INTO users (id, name, email) VALUES
  (42, 'Demo User', 'demo@example.com');

-- Optionally, add some answers
INSERT INTO answers (user_id, question_id, answer_id, free_answer) VALUES
  (42, 1, 2, NULL),
  (42, 2, NULL, '5');
