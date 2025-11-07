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
npm start
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
Once everything works, you push your code to GitHub. Note that you should not commit the `dist/` folder-- you can add it to your `.gitignore` file. The contents of that folder will be regenerated at netlify or vercel during the deployment process.
```sh
git add .
git commit -m "Working production build"
git push origin main
```

## Convert Your DB from SQLite to Cloud SQL (Dev first, then Prod)

Previously, you probably used SQLLite for your database. That's fine for local development, but with our cloud deployment, we will want to be able to connect remotely to the database, so we won't want it to be a local file-based database anymore, which SQLite is.

The instructions below will guide you through switching from SQLite to a managed Postgres database. We will actually have you generate two databases: one for development and one for production. You could choose to just create one database for both dev and prod, but it's a better practice to separate them.

### Sign Up for a Cloud SQL Provider

There are several cloud SQL providers you can use. Here are three popular options with free tiers:
- **Neon**: Serverless Postgres, free tier, database branching.
- **Supabase**: Postgres with built-in features, free tier available.
- **PlanetScale**: MySQL, free tier.

The instructions below are all for Neon.

### A. Create Your Dev and Prod Databases with Neon
1. Go to [Neon](https://neon.tech/) and sign up for a free account.
2. Create a new project:
   - Project name: something with your name or id in it to make it uniqe.
   - Postgres version: Choose the latest (default)
   - Region: Choose one closest to where you'll deploy your backend (e.g., US East for Render's US region)
3. After creating the project, it will automatically create a production and a development branch.
- You will use the development branch for your local (github codespace) development and testing
- You will use the production branch for your deployed backend.
- You also have the option of using the same database for both local development and the deployed backend. That may save you some confusion ("what happened to the data I entered? Oh, it's in the other version.") But it also means that you won't be able to experiment with stuff in the development environment without affecting the deployed app.
4. Get your connection strings:
   - For **dev**: Click on the `development` branch, then click on the Connect button. find the connection string (it will show a `postgresql://neondb...` string). Click to "show password" if needed, then copy the full connection string. Don't share it with anyone, not even your copilot. For communicating with your copilot, replace the password replaced with `****`. For example, `postgresql://neondb_owner:*******@ep-sparkling-lab-a49995cm-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`.
   - Do the same for production.
   - Save both connection strings (including the passwords) somewhere safe
5. Set up environment variables for the two databases, by running the following commands in your terminal (adjusting for your actual connection strings):
   - `export DATABASE_URL_DEV="<your_dev_connection_string>"`
   - `export DATABASE_URL_PROD="<your_prod_connection_string>"`



### B. Prepare schema and seed data in Postgres

For our sample project, we have:
- `backend/schema.sql`, which defines the database tables
- `backend/seed.sql`, which populates initial data

Postgres isn’t 100% identical to SQLite, so you'll have to ask your copilot to make the following checks/adjustments. I've already made them for the survey app.
- `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL PRIMARY KEY` (or `GENERATED ALWAYS AS IDENTITY`)
- Booleans use `BOOLEAN`
- Timestamps: `TIMESTAMPTZ DEFAULT now()`
- Foreign keys: `REFERENCES questions(id)`

Apply to your dev DB first, by running the following commands in your terminal:
```sh
# Optional: install psql locally or use the provider's SQL editor
psql "$DATABASE_URL_DEV" -f backend/schema.sql
psql "$DATABASE_URL_DEV" -f backend/seed.sql
```

Now check at Neon to see if the tables and data are there. 
- From the project dashboard page, scroll across the horizontal carousel at the top to find a "Go to Tables Page" button. 
- Make sure you are on the development branch, because you have only applied the schema and seed to that branch so far.
- You should see your tables (e.g., `questions`, `answer_options`, etc.)
- Click on any table to check whether the seed data is present.

When you're ready, you can also initialize the contents of the production DB.

```sh
psql "$DATABASE_URL_PROD" -f backend/schema.sql
psql "$DATABASE_URL_PROD" -f backend/seed.sql
```


### C. Make Your Local backend use the dev DB (instead of SQLite)
To switch from SQLite to Postgres, you will need to update your backend code to use the `pg` package instead of `sqlite3`.

From a terminal connected to directory `weeks10-14/react_survey_app/backend`:
```sh
npm install pg dotenv
```
Update `server.cjs` to load env vars and use a connection pool and switch to Postgres pool.query invocations (keep your Express routes the same, just swap SQLite calls gradually):
```js
// at the very top
require('dotenv').config();
const { Pool } = require('pg');

// replace SQLite setup with a Pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// example query usage
// const { rows } = await pool.query('SELECT * FROM questions');
```
Create `backend/.env` (not committed to git for security reasons; add to .gitignore) with your dev DB URL:
```env
DATABASE_URL=<paste DATABASE_URL_DEV here>
```
Run locally and verify the endpoints against dev DB:
```sh
node server.cjs
# then in another terminal
curl 'http://localhost:4000/api/questions'
```

It should return the list of questions from your Postgres dev database. 

To make sure it's getting data from the right database, you can try adding a new question via the neon console and then run it again. Do you see the new question?

---


## Create a Personal Fork for Deployment

I had originally planned to have you automatically deploy from your classroom repository every time you pushed a commit to it. But there are several reasons this may not be desirable:
- Some deployment services (like Netlify and Vercel) have free tiers that may not support deploying from organization-owned private repositories.
- You may want more control over the repository settings, access permissions, and integrations than what is allowed for organization-owned repositories.
- You may want to push code to your classroom repo for safe keeping and grading, but not have every push trigger a deployment.

To work around this, you will create a personal fork of your Classroom repository in your own GitHub account and have the service called Render auto-deploy your frontend and backend from that fork. You will decide when you want to sync changes from the classroom repo to your personal fork, triggering the auto-deploy.

### Concepts

- Remember that:
  - a github repository is a remote location for a bunch of code files.
  - you can open a codespace on any repository you have access to, which gives you a vscode environment in the cloud with the repo's files loaded in the file explorer, the ability to run terminal commands, interact with copilot, and push changes back to github.
- New concept: a "fork". A fork is a copy of a repository that is connected to the original repository. You can make changes in the parent repository and then sync those changes to the fork (or vice-versa, but we won't do that here).
- New concept: organization-owned repositories vs personal-account-owned repositories.
  - An organization-owned repository is owned by a github organization (like the course organization UMSI211F2025). When you are viewing the repo on github.com, the URL will look like `https://github.com/umsi211F2025/<repo-name>`. When you accept an assignment for the course, via the link in Canvas, you get a private *organization-owned repository*. It is visible to you and course staff (that enables grading when you push code back to github).
  - A personal-account-owned repository is owned by your personal github account. You have full control over it.  When you are viewing the repo on github.com, the URL will look like `https://github.com/<your-username>/<repo-name>`.

### Creating a Personal Fork
- Go to your Classroom repository on GitHub (under the course organization). It will look like `https://github.com/umsi211F2025/<repo-name>`.
- Click the "Fork" button in the top-right corner.
- Choose your personal GitHub account as the destination for the fork.
- Keep the fork private if prompted (acceptable for Netlify/Vercel free tier since it’s a personal private repo).
- Done. You now have `https://github.com/<your-username>/<repo-name>`.


### Updating Your Personal Fork (Triggering Deployments)
When you make changes in your classroom repo (e.g., fixing bugs, adding features), you will push those to github. That updates the classroom repo. If you want to deploy those changes, you will need to sync those changes to your personal fork.
- Go to your personal fork on GitHub.
- You will see a message above the file list that says "This branch is X commits behind umsi211F2025:main" (or whatever the classroom repo's default branch is called).
- Click on the `Sync fork` button, then `Update branch` to sync the changes from the classroom repo to your personal fork.

---

## Deploy Both Frontend and Backend to Render

While some services like Netlify specialize in frontend static site hosting and others in backend hosting, most of them will would be happy to provide the full stack of services (static frontend + backend API + database). Unfortunately, I didn't find one that would provide all three for free in the free tier.

I did find one, Render, that seems to provide a free tier with ample resources for both frontend and backend hosting. (It also provides a managed Postgres database, but it's only free for the first month, so I had you use neon for that instead.)

You are welcome to use any combination of services you like for all three of these components. My instructions below assume you are using Render for both frontend and backend.

I recommend deploying the backend first, then the frontend. That's because the frontend needs to be configured with an environment variable that points to the backend URL, which you won't know until after deploying the backend.

### Deploy Backend (Web Service) to Render

0. Create an account on Render if you don't have one already.
1. Go to [Render dashboard](https://dashboard.render.com/)
2. Click "+ Create New Service" → "New Web Service"
3. Connect your GitHub account if you haven't already
    - Allow access to your personal fork repository
4. Back at the Render website, select the repository to deploy
5. Configure the web service:
   - **Name**: Choose a name (e.g., `presnick-211-survey-backend`)
   - **Language**: `Node`
   - **Branch**: `main`
   - **Region**: Choose the region closest to your database (e.g., US East Virginia if that's where your Neon DB is-- check your DB URL to see the region)
   - **Root Directory**: the directory with your backend code (e.g., `weeks10-14/react_survey_app/backend`)
     - make sure this directory has a package.json file. If not, ask your copilot to help you create one. Don't forget to push it to github and then sync it to your personal fork before proceeding.
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
   - **Environment Variables**: 
       - Key: `DATABASE_URL`
       - Value: Your production database connection string (e.g., from Neon)
4. Click "Deploy Web Service"
5. Wait for the deployment to complete
6. Test the backend URL in your browser
    - visit a backend URL that should provide data (e.g., `https://presnick-211-survey-backend.onrender.com/api/answer_counts?question_id=1`) to see if the API is responding
7. Copy the backend URL from the Render dashboard (e.g., `https://presnick-211-survey-backend.onrender.com`). You will use this in the next section.


### Deploy Frontend (Static Site) to Render

1. Go to [Render dashboard](https://dashboard.render.com/)
2. In Render dashboard, go to the page for your project and click "+ New Service" → "Static Site"
3. Select the same GitHub repository as before
4. Configure the static site:
   - **Name**: Choose a name (e.g., `presnick-211-survey-frontend`)
   - **Branch**: `main`
   - **Root Directory**: where your react app is located (e.g., `weeks10-14/react_survey_app`)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Environment Variables:
        - key: `VITE_API_URL`
        - value: Your backend API base URL and include `/api` at the end (e.g., `https://presnick-211-survey-backend.onrender.com/api`)
            - Our frontend expects `VITE_API_URL` to already include `/api` and then it requests paths like `/questions`, `/answers`, etc.
6. Click "Deploy Static Site"
7. Render will build and deploy your frontend.
8. Test it. You should have a working survey app.
    - Check that new data appears in the database as the app is used, by visiting the Neon dashboard and looking at the contents of the answers table.

