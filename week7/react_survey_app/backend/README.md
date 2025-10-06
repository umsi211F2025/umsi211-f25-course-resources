# Survey App Backend

## Setup (in GitHub Codespaces or locally)

1. Install dependencies:
   ```sh
   npm install express sqlite3 body-parser
   ```
2. Initialize the database:
   ```sh
   node backend/init-db.ccjs
   ```
3. Start the backend server:
   ```sh
   node backend/server.cjs
   ```

- The backend will run on port 4000 by default.
- The SQLite database file is `backend/survey.db`.
- API endpoints:
  - `GET /api/questions`
  - `GET /api/answers?user_id=42`
  - `POST /api/answers` (JSON body)
  - `GET /api/answer_counts?question_id=1`

You can test endpoints with curl or Postman.
