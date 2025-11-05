# Deployment Guide for `react_survey_app`

This guide will walk you through deploying your React Survey App, following the architecture outlined in your diagram. Authentication is not included in this version.

## Prerequisites
- Node.js and npm installed
- Access to the project directory (`react_survey_app/`)
- GitHub account

---

## Test Your App Locally
Before deploying, make sure your app works locally with both frontend and backend running.

### 1. Start the Backend Server

In a terminal, from your app directory:
```sh
cd weeks10-14/react_survey_app/backend
node server.cjs
```
This will start the backend API (default port: 4000). (If you used something else for your backend, invoke it accordingly.)

### 2. Start the Frontend Preview
Open a new terminal, then:
```sh
cd weeks10-14/react_survey_app
npm install
npm run build
npm run preview
```
This will start the frontend preview server (default port: 4173).

### 3. Test the App
Visit the frontend preview URL (shown in the terminal, e.g., http://localhost:4173) and confirm you can interact with the app and it communicates with the backend API.

### 4. Commit and Push Working Code
Once everything works:
```sh
git add .
git commit -m "Working production build"
git push origin main
```

---

## Frontend Deployment (Vite/React)
### Prepare & Build
1. Navigate to your frontend directory:
   ```sh
   cd weeks10-14/react_survey_app
   npm install
   npm run build
   ```
   (Vite outputs to `dist/`)

2. Push your working code to GitHub (see above).

### Deploy to Netlify or Vercel
- **Netlify**: Import your repo, set build command to `npm run build`, publish directory to `dist`. Netlify will build from source; you do NOT need to commit the `dist/` folder.
- **Vercel**: Import your repo, set build command to `npm run build`, output directory to `dist`. Vercel will build from source; you do NOT need to commit the `dist/` folder.


---

## Backend API Deployment (Express)
### Prepare
1. Ensure your backend code is in `backend/` (e.g., `server.cjs`, `init-db.cjs`).
2. Add a `package.json` in `backend/` if not present, listing dependencies (`express`, `sqlite3`, `body-parser`).
3. Ensure your backend listens on the port provided by the hosting service (e.g., `process.env.PORT`).
4. Push your working code to GitHub (see above).

### Deploy to Render or Railway
1. Go to [Render](https://render.com) or [Railway](https://railway.app) and create a new web service.
2. Connect your GitHub repo and select the backend folder.
3. Set the start command (e.g., `node server.cjs`).
4. Add any required environment variables for basic setup (e.g., PORT). You will add database connection variables after setting up your cloud DB.

---

## 3. Cloud SQL Database Setup
Choose a cloud SQL provider:
- **Supabase**: Easiest for Postgres, free tier available.
- **Neon**: Serverless Postgres, free tier.
- **PlanetScale**: MySQL, free tier.

### Steps
1. Sign up and create a new database.
2. Note the connection string (host, user, password, db name).
3. (Optional) Use the provider’s dashboard to run schema SQL or seed data. If you don't have a GUI, you can modify your `init-db.cjs` to connect to the cloud DB and run the setup code.

---

## 4. Connect Backend to Cloud DB
1. Update your backend code to use the cloud DB connection string (not local SQLite).
   - For Postgres: use `pg` npm package.
   - For MySQL: use `mysql2` npm package.
2. Store DB credentials in environment variables (never commit secrets).
3. Update API endpoints to use the cloud DB.

### Environment variables 101 (what, where, and when)
- What they are: key/value settings that your app reads at runtime. Examples: `DATABASE_URL`, `PORT`, `NODE_ENV`.
- Backend vs Frontend:
   - Backend secrets (DB URLs, API keys) live ONLY on the backend platform (Render/Railway). Never expose them to the browser.
   - Frontend env vars are optional and must be public. In Vite, they must start with `VITE_` (e.g., `VITE_API_URL`). Use these only for non-secret values the browser needs, like the backend API base URL.
- When you need a frontend env var: if your frontend has to call a backend at a full URL (e.g., `https://your-api.onrender.com`). If you use relative paths (`/api/...`) and proxy/same-origin setups, you may not need one.

#### Typical values to set
- Backend (Render/Railway):
   - `DATABASE_URL` (Postgres/MySQL connection string from your DB provider)
   - `PORT` (provided by platform; make sure your server uses `process.env.PORT`)
- Frontend (Netlify/Vercel), optional:
   - `VITE_API_URL` (e.g., `https://your-api.onrender.com`) so the browser knows where to call the API in production

#### Where to set them
- Render (backend): Service → Environment → Add Environment Variable → redeploy.
- Railway (backend): Project → Service → Variables → New Variable → redeploy.
- Netlify (frontend, optional): Site settings → Build & deploy → Environment → Edit variables. Use `VITE_` prefix.
- Vercel (frontend, optional): Project Settings → Environment Variables. Use `VITE_` prefix.

#### Local development env vars
- Backend: create `react_survey_app/backend/.env` and load it with `dotenv`.
   1) Install once in the backend folder: `npm install dotenv`
   2) At the very top of `backend/server.cjs` add:
       ```js
       require('dotenv').config();
       ```
   3) Put local settings in `backend/.env` (don’t commit secrets):
       ```env
       DATABASE_URL=postgres://user:pass@localhost:5432/mydb
       ```
- Frontend (Vite): create `react_survey_app/.env.local` for values like:
   ```env
   VITE_API_URL=http://localhost:4000
   ```
   Note: `.env.local` is for your machine only; it should be gitignored.

### Where to store environment variables
- Render (backend): Service > Environment > Add Environment Variable. Save and redeploy.
- Railway (backend): Project > Service > Variables > New Variable. Save and redeploy.
- Netlify (frontend, if needed): Site settings > Build & deploy > Environment > Edit variables. Use keys starting with `VITE_` to expose to the client.
- Vercel (frontend, if needed): Project Settings > Environment Variables. Use keys starting with `VITE_` to expose to the client.
- Local development (optional): create `backend/.env` and load with `dotenv` in your server code. Do not commit `.env`.

---

## 5. Set Up GitHub Auto-Deploy (CI/CD)
### Frontend
- Netlify/Vercel: Enable GitHub integration. Every push to main triggers a deploy.

### Backend
- Render/Railway: Enable GitHub integration. Every push to main triggers a deploy.

---

## 6. Verify Everything
- Visit your frontend URL (Netlify or Vercel)
- Test API endpoints (Render/Railway)
- Confirm DB connection and data flow

---

## Next Steps
- Add authentication (Auth0, Firebase, Clerk) when ready
- Set up environment variables for secrets
- Monitor deployments for errors

---

**Tip:** For custom domains, follow your host’s instructions.

For troubleshooting, see docs for [Netlify](https://docs.netlify.com/), [Vercel](https://vercel.com/docs), [Render](https://render.com/docs), [Railway](https://docs.railway.app/), [Supabase](https://supabase.com/docs), [Neon](https://neon.tech/docs), [PlanetScale](https://planetscale.com/docs).
