# Authentication Guide: Library-Based vs. External Providers

This guide explores two main approaches to adding authentication to your full-stack React app: using a JWT library to build your own auth system, or integrating an external authentication provider.

## Understanding Authentication vs. Authorization

Before diving in, let's clarify these terms:
- **Authentication** ("Who are you?"): Verifying a user's identity (e.g., login with email/password)
- **Authorization** ("What can you do?"): Determining what an authenticated user can access

This guide focuses primarily on authentication. For authorization, that's currently baked into your app's backend logic (e.g., only allowing users to access their own survey answers).

---

## Approach 1: JWT Library-Based Authentication

(You can skip this approach entirely if you prefer and just go on to use an external provider. You may find it instructive to go through it in order to understand how authentication works under the hood. But if you want to have things like two-factor authentication, and password resets, it's much easier to use an external provider.)

### What is JWT?

JWT (JSON Web Token) is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. A JWT consists of three parts:
- **Header**: Token type and hashing algorithm
- **Payload**: Claims (user data like user ID, email, expiration time)
- **Signature**: Ensures the token hasn't been tampered with

Example JWT structure:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywibmFtZSI6IkphbmUiLCJleHAiOjE3MzQ1Njc4OTB9.abc123signature
```

### How It Works

1. **User Registration/Login**:
   - User provides credentials (email/password)
   - Backend verifies credentials against database
   - If valid, backend creates a JWT containing user info
   - Backend sends JWT to frontend

2. **Authenticated Requests**:
   - Frontend stores JWT (usually in localStorage or httpOnly cookie)
   - Frontend includes JWT in Authorization header for subsequent requests
   - Backend verifies JWT signature and extracts user info
   - Backend processes request with authenticated user context

3. **Token Expiration**:
   - JWTs include an expiration time
   - Expired tokens are rejected
   - Users must login again or use a refresh token

### Implementation Overview

#### Updating Your Dev Database (Postgres) for JWT Auth

If you created your database before adding authentication, you need to add the new columns and constraints. Use the `psql` CLI with your exported dev connection string.

1. Make sure `DATABASE_URL_DEV` is exported in your shell:
```sh
echo $DATABASE_URL_DEV   # should print a postgres://... string
```
If it's empty, export it again (replace with your actual string):
```sh
export DATABASE_URL_DEV="postgres://user:****@host/dbname?sslmode=require"
```

2. Quick reset (drop and re-seed) — this wipes existing dev data for this app:

```sh
psql "$DATABASE_URL_DEV" <<'SQL'
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS answer_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
SQL

# Recreate schema and load seed data
psql "$DATABASE_URL_DEV" -f schema.sql
psql "$DATABASE_URL_DEV" -f seed.sql
```

**NOTE**: If you want to keep existing data, you would need to perform a migration instead of dropping tables. Ask the copilot to help with that.

3. After you've tested everything, you will need to perform a similar update on your production database.


#### Backend (Node.js + Express)

Install dependencies:
```bash
npm install jsonwebtoken bcrypt
```

Key components:
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  
  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Store user in database
  await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
    [email, hashedPassword]
  );
  
  res.status(201).json({ message: 'User created' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Find user in database
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  const user = result.rows[0];
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Verify password
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({ token, user: { id: user.id, email: user.email } });
});

// Middleware to verify JWT on protected routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded; // Add user info to request
    next();
  });
}

// Protected route example
app.get('/api/my-answers', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const result = await pool.query(
    'SELECT * FROM answers WHERE user_id = $1',
    [userId]
  );
  res.json(result.rows);
});
```

#### Frontend (React)

```typescript
// Login function
async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  
  // Store token in localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}

// Authenticated API request
async function fetchMyAnswers() {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/my-answers`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 401) {
    // Token expired or invalid - redirect to login
    window.location.href = '/login';
    return;
  }
  
  return response.json();
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

### Verify Implementation

1. Start backend server:
```sh
cd backend
node server.cjs
```

2. Start frontend app:
```sh
npm run dev
```

3. In browser, Register + login through the app UI, then submit/update an answer. 

4. Then confirm linkage:
```sh
psql "$DATABASE_URL_DEV" -c "SELECT id,email FROM users ORDER BY id DESC LIMIT 3;"
psql "$DATABASE_URL_DEV" -c "SELECT user_id,question_id,answer_id FROM answers ORDER BY id DESC LIMIT 5;"
```
You should see `answers.user_id` matching a `users.id`.

5. Logout in UI (or clear localStorage) then login again; answers should reload correctly.



### Pros of JWT Library Approach

1. **Full Control**: You own the entire authentication flow and can customize it completely
2. **No External Dependencies**: No reliance on third-party services or their availability
3. **No Additional Costs**: No monthly fees for auth services (though you'll need secure server infrastructure)
4. **Learning Opportunity**: Great for understanding how authentication works under the hood
5. **Data Privacy**: User credentials and auth data stay in your database
6. **Simple Integration**: Works with any database and backend framework

### Cons of JWT Library Approach

1. **Security Responsibility**: You must implement security best practices correctly:
   - Secure password hashing (bcrypt with sufficient rounds)
   - Protection against common attacks (SQL injection, XSS, CSRF)
   - Secure token storage
   - Proper token expiration and refresh logic
   - HTTPS enforcement

2. **More Code to Write and Maintain**:
   - Registration, login, logout endpoints
   - Password reset flows
   - Email verification
   - Token refresh logic
   - Rate limiting to prevent brute force attacks

3. **Feature Development Time**:
   - Multi-factor authentication (MFA/2FA)
   - Social login (Google, GitHub, etc.)
   - Password strength requirements
   - Account recovery flows

4. **Token Management Complexity**:
   - Handling expired tokens gracefully
   - Implementing refresh tokens
   - Token revocation (JWTs can't be invalidated easily once issued)

5. **Compliance Concerns**:
   - GDPR, CCPA, and other data privacy regulations
   - Secure storage of personal information
   - Right to erasure (delete user data)

### When to Use JWT Library Approach

- **Educational purposes**: Learning how auth works
- **Simple applications**: Basic login/logout with minimal features
- **Complete control needed**: Specific custom auth flows
- **Internal tools**: Lower security requirements, known user base
- **Budget constraints**: Can't afford external auth services

---

## Approach 2: External Authentication Provider

This approach is covered in the main branch version of this guide.

