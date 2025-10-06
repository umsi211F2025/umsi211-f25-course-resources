// Express backend for survey app
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 4000;

const dbPath = path.join(__dirname, 'survey.db');
const db = new sqlite3.Database(dbPath);

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Get all survey questions (with answer options)
app.get('/api/questions', (req, res) => {
  db.all('SELECT * FROM questions', [], (err, questions) => {
    if (err) return res.status(500).json({ error: err.message });
    db.all('SELECT * FROM answer_options', [], (err2, options) => {
      if (err2) return res.status(500).json({ error: err2.message });
      // Attach options to questions
      const questionsWithOptions = questions.map(q => ({
        ...q,
        options: options.filter(opt => opt.question_id === q.id)
      }));
      res.json(questionsWithOptions);
    });
  });
});

// Get all answers for a user
app.get('/api/answers', (req, res) => {
  const userId = parseInt(req.query.user_id, 10);
  if (!userId) return res.status(400).json({ error: 'user_id required' });
  db.all('SELECT * FROM answers WHERE user_id = ?', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add or update one answer
app.post('/api/answers', (req, res) => {
  const { user_id, question_id, answer_id, free_answer } = req.body;
  if (!user_id || !question_id) {
    return res.status(400).json({ error: 'user_id and question_id required' });
  }
  // Check if answer exists
  db.get('SELECT * FROM answers WHERE user_id = ? AND question_id = ?', [user_id, question_id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      // Update
      db.run('UPDATE answers SET answer_id = ?, free_answer = ? WHERE id = ?', [answer_id, free_answer, row.id], function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ updated: true });
      });
    } else {
      // Insert
      db.run('INSERT INTO answers (user_id, question_id, answer_id, free_answer) VALUES (?, ?, ?, ?)', [user_id, question_id, answer_id, free_answer], function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ inserted: true, id: this.lastID });
      });
    }
  });
});

// Get answer counts for a question
app.get('/api/answer_counts', (req, res) => {
  const questionId = parseInt(req.query.question_id, 10);
  if (!questionId) return res.status(400).json({ error: 'question_id required' });
  console.log('Getting answer counts for question:', questionId);
  db.all('SELECT answer_id, COUNT(*) as count FROM answers WHERE question_id = ? AND answer_id IS NOT NULL GROUP BY answer_id', [questionId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log('Answer counts result:', rows);
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Survey backend running on port ${PORT}`);
});
