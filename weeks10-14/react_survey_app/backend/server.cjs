// Express backend for survey app
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 4000;

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const SALT_ROUNDS = 10;

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

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded; // Add user info to request object
    next();
  });
}

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name || null]
    );
    
    const user = result.rows[0];
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    // Find user by email
    const result = await pool.query(
      'SELECT id, email, password_hash, name FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all questions with their answer options (public route)
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

// Get all answers for a user (protected route)
app.get('/api/answers', authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Get from JWT token
  
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

// Add or update one answer (protected route)
app.post('/api/answers', authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Get from JWT token
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
