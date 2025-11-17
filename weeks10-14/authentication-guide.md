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

# Approach 2: External Authentication Provider

External auth providers (also called Identity Providers or IdP) handle authentication for you. Popular options include:
- **Clerk** (Recommended for this course - excellent React integration, generous free tier)
- **Firebase Authentication** (by Google - completely free, good for learning)
- **Auth0** (by Okta - industry standard, enterprise features)
- **Supabase Auth** (includes database, but we're already using Neon)
- **AWS Cognito** (complex setup, AWS ecosystem)

For this course, we recommend **Clerk** because it offers:
- Beautiful pre-built UI components
- Excellent React integration with hooks
- Simple Express backend middleware
- Generous free tier (10,000 monthly active users)
- Works perfectly with your existing Neon Postgres database

### How External Providers Work

1. **Initial Setup**:
   - Sign up for auth provider
   - Create an application in their dashboard
   - Get API keys and configuration details
   - Install their SDK/library in your frontend and backend

2. **User Login Flow**:
   - User clicks "Login" button in your app
   - Frontend shows auth provider's login UI (modal or redirect)
   - User enters credentials on auth provider's secure page
   - Auth provider verifies credentials
   - Auth provider returns token to your app
   - Your app stores token and uses it for authenticated requests

3. **Protected API Requests**:
   - Frontend includes token in API requests
   - Backend verifies token with auth provider
   - Backend processes request with authenticated user info

### Implementing Clerk (Step-by-Step)

> **Official Quickstart:** For the most up-to-date instructions, see [Clerk's React Quickstart](https://clerk.com/docs/quickstarts/react). These instructions are as of November 17, 2025.

#### Step 1: Sign Up and Create Application

1. Go to [clerk.com](https://clerk.com) and sign up (free, no credit card required)
2. Create a new application
3. Choose application name (e.g., "My Survey App")
4. Select authentication methods:
   - ✅ Email (required for basic email/password)
   - ✅ Google (optional, recommended for easy social login)
   - ✅ GitHub (optional, great for developer apps)
5. Click "Create Application"


#### Step 2: Install Clerk in Frontend

```bash
cd weeks10-14/react_survey_app
npm install @clerk/clerk-react@latest
```

#### Step 3: Configure Frontend Environment Variables

In the page that Clerk shows after creating your application, you will see your **Publishable Key** (starts with `pk_test_...`).

**Important:** Use `.env.local` for local development (preferred over `.env`):

Create `.env.local` in your React app root:
```env
VITE_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

> **Note:** The `VITE_` prefix is required for Vite to expose environment variables to client-side code.

Make sure `.env*` files are in your `.gitignore`:
```
.env
.env.local
.env*.local
node_modules/
dist/
```

#### Step 4: Wrap Your App with ClerkProvider

Update `src/main.jsx` or `src/main.tsx`:
```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </StrictMode>
);
```

> **Note:** The `afterSignOutUrl` prop defines where users are redirected after signing out.

#### Step 5: Add Authentication UI to Your App

Update `src/App.tsx` (or `.jsx`):
```tsx
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react';

function App() {
  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
        <h1>Survey App</h1>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <main>
        <SignedIn>
          {/* Your survey content - only visible when signed in */}
          <SurveyContent />
        </SignedIn>
        <SignedOut>
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>
            Please sign in to take the survey
          </p>
        </SignedOut>
      </main>
    </div>
  );
}

function SurveyContent() {
  // Your existing survey code goes here
  return <div>Your survey questions and form here</div>;
}

export default App;
```

#### Step 6: Test Frontend Authentication

1. Start your frontend app:
```sh
npm run dev
```

2. Open browser to http://localhost:5173
3. Click "Sign In" button
4. Create an account or sign in with Google


The Clerk installer page should now recognize that you have successfully integrated Clerk into your React app.


#### Step 7: Install Clerk in Backend

```bash
cd backend
npm install @clerk/clerk-sdk-node
```



#### Step 8: Configure Backend Environment Variables

First, you'll need to find your **Secret Key** from the Clerk dashboard (starts with `sk_test_...`). This is different from the previous key that you configured in the frontend.

- Click on `Configure Your Application` in the application dashboard
- Scroll down to find the Developers section on the left menu
- The first option is API Keys; click on it.
- Copy the secret key 

Add to `backend/.env` (or `backend/.env.local`):
```env
CLERK_SECRET_KEY=the-secret-key-you-copied
```

Make sure `.env*` files are in your `backend/.gitignore`:
```
.env
.env.local
.env*.local
```

#### Step 9: Protect Your Backend Routes

Update `backend/server.cjs`:
```javascript
require('dotenv').config();
const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.json());

// Public routes (no auth needed)
app.get('/api/questions', async (req, res) => {
  // Anyone can view questions
  const { rows } = await pool.query('SELECT * FROM questions');
  res.json(rows);
});

// Protected routes (auth required)
app.post('/api/answers', ClerkExpressRequireAuth(), async (req, res) => {
  // Get the authenticated user's ID from Clerk
  const userId = req.auth.userId;
  const { questionId, answerOptionId } = req.body;
  
  // Save answer with authenticated user ID
  await pool.query(
    'INSERT INTO answers (user_id, question_id, answer_option_id, created_at) VALUES ($1, $2, $3, NOW())',
    [userId, questionId, answerOptionId]
  );
  
  res.json({ success: true });
});

app.get('/api/answers', ClerkExpressRequireAuth(), async (req, res) => {
  // Get only this user's answers
  const userId = req.auth.userId;
  
  const { rows } = await pool.query(
    'SELECT * FROM answers WHERE user_id = $1',
    [userId]
  );
  
  res.json(rows);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### Step 10: Update Your Frontend API Calls

When making API calls to protected routes, get the token from Clerk:

```typescript
import { useAuth } from '@clerk/clerk-react';

function SurveyContent() {
  const { getToken, userId } = useAuth();
  
  async function submitAnswer(questionId: number, answerOptionId: number) {
    // Get token from Clerk
    const token = await getToken();
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/answers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ questionId, answerOptionId })
    });
    
    if (response.status === 401) {
      alert('Please sign in to submit answers');
      return;
    }
    
    const data = await response.json();
    console.log('Answer submitted!', data);
  }
  
  return <div>Your survey UI here</div>;
}
```

#### Step 11: Update Your Database Schema

**Important**: Clerk uses string user IDs, not integers. Update your schema:

```sql
-- Your answers table should reference Clerk user IDs (TEXT, not INTEGER)
CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,  -- Clerk user ID (string format)
  question_id INTEGER REFERENCES questions(id),
  answer_option_id INTEGER REFERENCES answer_options(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Add index for faster lookups
CREATE INDEX idx_answers_user_id ON answers(user_id);
```

Apply to your dev database:
```sh
# Drop and recreate with Clerk-compatible schema
psql "$DATABASE_URL_DEV" <<'SQL'
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS answer_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
SQL

psql "$DATABASE_URL_DEV" -f backend/schema.sql
psql "$DATABASE_URL_DEV" -f backend/seed.sql
```

#### Step 12: Test Locally

1. Start your backend:
```sh
cd backend
npm start
```

2. Start your frontend:
```sh
cd ..
npm run dev
```

3. Open browser to http://localhost:5173 and test:
   - Click "Sign In"
   - Create an account or sign in with Google
   - Submit survey answers
   - Check that answers are saved with your Clerk user ID

4. Verify in database:
```sh
psql "$DATABASE_URL_DEV" -c "SELECT user_id, question_id, answer_id, created_at FROM answers ORDER BY id DESC LIMIT 5;"
```
You should see Clerk user IDs (strings like `user_2abc123...`)

#### Step 13: Update Production Database

When deploying to production, ensure your database schema is up-to-date with the latest changes. You may need to run migrations or manually update the schema. Refer back to step 11 but apply them to your production database.

#### Step 14: Deploy to Render with Environment Variables

When deploying to Render (or similar):

**Frontend** (Static Site):
- Add environment variable: 
  - key: `VITE_CLERK_PUBLISHABLE_KEY` 
  - value: `pk_test_...`

**Backend** (Web Service):
- Add environment variable: 
  - key: `CLERK_SECRET_KEY` 
  - value: `sk_test_...`

Saving the new environment variables on render should trigger a redeploy.


## Pros of External Auth Provider (Clerk)

1. **Fast Implementation**: Authentication working in 30-60 minutes
2. **Beautiful UI**: Professional login/signup forms out of the box
3. **Security Built-In**: Battle-tested security, regular updates
4. **Rich Features**: Social login, email verification, user profiles included
5. **Great Developer Experience**: Excellent docs, intuitive React hooks
6. **Generous Free Tier**: 10,000 monthly active users
7. **Focus on Your App**: Spend time building features, not auth plumbing

### Cons of External Auth Provider

1. **External Dependency**: Relies on third-party service availability
2. **Limited Customization**: Some UI/flow restrictions on free tier
3. **Vendor Lock-in**: Switching providers requires code changes
4. **Data Location**: User authentication data stored on provider's servers

### When to Use External Auth Provider

- **Production applications**: Apps with real users
- **Time constraints**: Need to launch quickly
- **Security priority**: Want professionally managed security
- **Rich features needed**: Social login, MFA, passwordless, etc.
- **Team lacks auth expertise**: Want to focus on core app features

### Comparison: Clerk vs Other Providers

| Feature | Clerk | Firebase Auth | Auth0 |
|---------|-------|---------------|-------|
| **Free Tier Users** | 10,000 MAU | Unlimited | 7,500 MAU |
| **React Integration** | ⭐⭐⭐ Excellent | ⭐⭐ Good | ⭐⭐⭐ Excellent |
| **Pre-built UI** | ✅ Beautiful | ❌ Build yourself | ⚠️ Basic |
| **Setup Time** | 30 min | 60-90 min | 45-60 min |
| **Social Login (Free)** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Best For** | Student projects | Free forever | Enterprise/Resume |
