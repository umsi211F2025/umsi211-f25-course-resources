// Express backend for survey app
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 4000;

// Create PostgreSQL connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Get all questions with their answer options
app.get('/api/questions', async (req, res) => {
  try {
    // Get all questions
    const questionsResult = await pool.query(
      'SELECT id, text FROM questions ORDER BY id'
    );
    const questions = questionsResult.rows;

    // Get all answer options for these questions
    const optionsResult = await pool.query(
      'SELECT id, question_id, text FROM answer_options ORDER BY question_id, id'
    );
    const allOptions = optionsResult.rows;

    // Group options by question_id
    const questionsWithOptions = questions.map(question => ({
      ...question,
      options: allOptions.filter(opt => opt.question_id === question.id)
    }));

    res.json(questionsWithOptions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Protected route: Get all answers for the authenticated user
app.get('/api/answers', ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId; // Get user ID from Clerk auth
  
  try {
    const result = await pool.query(
      'SELECT id, user_id, question_id, answer_id FROM answers WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Failed to fetch answers' });
  }
});

// Protected route: Add or update an answer for the authenticated user
app.post('/api/answers', ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId; // Get user ID from Clerk auth
  const { question_id, answer_id } = req.body;
  
  if (!question_id || !answer_id) {
    return res.status(400).json({ error: 'question_id and answer_id are required' });
  }

  try {
    // Check if answer already exists
    const existingResult = await pool.query(
      'SELECT id FROM answers WHERE user_id = $1 AND question_id = $2',
      [userId, question_id]
    );

    if (existingResult.rows.length > 0) {
      // Update existing answer
      await pool.query(
        'UPDATE answers SET answer_id = $1 WHERE user_id = $2 AND question_id = $3',
        [answer_id, userId, question_id]
      );
      res.json({ message: 'Answer updated successfully' });
    } else {
      // Insert new answer
      await pool.query(
        'INSERT INTO answers (user_id, question_id, answer_id) VALUES ($1, $2, $3)',
        [userId, question_id, answer_id]
      );
      res.json({ message: 'Answer inserted successfully' });
    }
  } catch (error) {
    console.error('Error upserting answer:', error);
    res.status(500).json({ error: 'Failed to upsert answer' });
  }
});

// Get answer counts for a question
// Get answer counts for a question
app.get('/api/answer_counts', async (req, res) => {
  const questionId = req.query.question_id;
  if (!questionId) {
    return res.status(400).json({ error: 'question_id is required' });
  }

  try {
    const result = await pool.query(
      'SELECT answer_id, COUNT(*) as count FROM answers WHERE question_id = $1 GROUP BY answer_id',
      [questionId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching answer counts:', error);
    res.status(500).json({ error: 'Failed to fetch answer counts' });
  }
});

app.listen(PORT, () => {
  console.log(`Survey backend running on port ${PORT}`);
});
