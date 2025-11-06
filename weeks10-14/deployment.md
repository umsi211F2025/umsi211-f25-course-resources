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
Once everything works, you push your code to GitHub. Note that you should not commit the `dist/` folder-- you can add it to your `.gitignore` file. The contents of that folder will be regenerated at netlify or vercel during the deployment process.
```sh
git add .
git commit -m "Working production build"
git push origin main
```

## Create a Personal Fork for Deployment

The free tiers of Netlify and Vercel have restrictions when deploying from private repositories owned by organizations, such as your GitHub Classroom repos. 

To work around this, you will create a personal fork of your Classroom repository in your own GitHub account and have Netlify or Vercel deploy from that fork.

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


---

## Frontend Deployment (Vite/React) to Netlify or Vercel

- **Netlify**: 
    - Create an account at [Netlify](https://www.netlify.com/) if you don't have one.
    - Click `Add New Project -> Import an existing project`.
    - Select GitHub as the source.
    - You will have to authorize github access. If you are given an option, be sure to select your personal account, not any organization or classroom account you may belong to.
    - During the authorization process, select which repositories Netlify can access.
        - If you don't do this during the authorization step, you can click on the `Configure Netlify on GitHub` button in your Netlify dashboard, which will take you to a page on github where you can manage access.
    - On Netlify, select the repository to deploy from.
    - You will be taken to a page to configure the project.
        - Project Name will determine the URL at which people will access your app (e.g., `https://presnick-react-survey-app.netlify.app`).
        - Branch to deploy: select `main`.
        - Base directory: set to the directory where your react app is located (e.g., `weeks10-14/react_survey_app`).
        - Build command: set to `npm run build`. 
        - Publish directory: it will autofill with the base directory but let you add a suffix: add `dist` (or wherever your npm build is configured to output; ask your copilot for assistance to check whether it is `dist`).
        - Functions directory: leave it as default (we haven't learned how to configure serverless functions; feel free to explore with your copilot if you're interested).
        - Environment variables: Click "Add environment variables" and add:
            - Key: `VITE_API_URL`
            - Value: `BACKEND_NOT_DEPLOYED_YET`
            - This is a temporary placeholder. The frontend will fail to connect to the API until you replace this with your actual backend URL after deploying the backend. If you forget to update it and get an error, in the chrome debugger console you will see failed API requests to `BACKEND_NOT_DEPLOYED_YET/api/...` and you will be reminded that you need to fill in the correct backend URL.
    - Click on the blue Deploy button at the bottom of the page.


- **Vercel**: 
    - Create an account at [Vercel](https://vercel.com/) if you don't have one.
    - Follow a similar approach as for Netlify


## A Development and Deployment Workflow to Prevent Using Up Monthly Deploy Credits on Netlify

In the free tier of Netlify, each "production deployment" uses up 15 of your 300 monthly credits, enough for just 20 deployments (and you need to save some of the credits for serving web pages to users; 10,000 web requests uses 3 credits). So if you do a lot of small changes and deploy each of them separately, you will run out of credits. Moreover, you will probably find that some of your deploys don't work quite right, because you configured something wrong or forgot to set an environment variable. Even getting my first deployment working took me several tries.

To work around this, follow this workflow:
### 1. Turn off auto-publishing
- In Netlify, go to your site dashboard → Deploys
- Click "Lock to stop auto publishing" (top right)
- This prevents pushes to `main` from automatically triggering production deploys

### 2. Develop and Test Locally
- Do your normal development work in your codespace launched from the Classroom repo.
- Test your app thoroughly locally, ensuring both frontend and backend work as expected.
- Only move things from your classroom repo to your personal fork when you are satisfied with the changes and ready to deploy for public use.

### 3. Use Pull Request (PR) Deploy Previews for Testing

When you're ready to move changes from your classroom repo to your personal fork for deployment, GitHub has a "sync" button on your personal repo that pulls in changes from the classroom repo. **Don't use that sync feature**. Instead, you will create a "pull request" (PR) from the classroom repo to your personal fork.

Netlify will automatically create a preview deployment for that pull request. You can use this to test your changes in a live environment without affecting the main production site and **without using up 15 credits**. Once you are satisfied that the production works, you can mmerge the PR into your personal fork's `main` branch, and then manually trigger a production deploy in Netlify.

Here's how to do that:
- Go to your personal fork on GitHub
- Click "Pull requests" 
- Click "New pull request"
- Click "compare across forks" 
- Set base repository: `<your-username>/<your-repo>`, base: `main`
    - this is critical; you want to merge into your personal fork, not the other way around
- Set head repository: `umsi211F2025/<classroom-repo>`, compare: `main`
- Click "Create pull request"
- Now you'll be on a page that shows the PR details. Take a look and you'll see a summary of the changes that will be merged.
- You'll also see a section with info from Netlify about the Deploy Preview that was created for this PR. Click on the Deploy Preview URL to test your app in a live environment. Or, if there are problems with the deployment, click through to find information about the error, and cut and paste the deployment logs into your copilot chat to help diagnose the issue.

When you're satisfied that everything works:
- Merge the PR into your personal fork's `main` branch.
- In Netlify, go to Deploys
- Find the Deploy Preview for your PR and click on it.
- Click "Promote to Production" to deploy your changes.

---

## Backend API Deployment (Express)
### Prepare
1. Ensure your backend code is in `backend/` (e.g., `server.cjs`, `init-db.cjs`).
2. Add a `package.json` in `backend/` if not present, listing dependencies (`express`, `sqlite3`, `body-parser`).
3. Ensure your backend listens on the port provided by the hosting service (e.g., `process.env.PORT`).
    - for example, in `backend/server.cjs`:
    ```js
4. Push your working code to GitHub (see above).

### Deploy to Render or Railway
1. Go to [Render](https://render.com) or [Railway](https://railway.app) and create a new web service.
2. Connect your GitHub repo and select the backend folder.
3. Set the start command (e.g., `node server.cjs`).
4. Add any required environment variables for basic setup (e.g., PORT). You will add database connection variables after setting up your cloud DB.
5. Once deployed, copy the backend URL (e.g., `https://your-app.onrender.com` or `https://your-app.up.railway.app`).

### Connect Frontend to Backend
After your backend is deployed:
1. Go to your Netlify (or Vercel) project dashboard.
2. Navigate to Site settings → Environment variables (or Project Settings → Environment Variables for Vercel).
3. Find the `VITE_API_URL` variable you created earlier (with the placeholder value `BACKEND_NOT_DEPLOYED_YET`).
4. Edit it and replace the value with your actual backend URL (e.g., `https://your-app.onrender.com`).
   - Important: Do NOT include `/api` at the end if your frontend code already adds that path.
5. Trigger a new deployment (Netlify: Deploys → Trigger deploy → Deploy site; Vercel: Deployments → Redeploy).
6. Once the rebuild completes, your frontend should now successfully connect to your backend!



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
