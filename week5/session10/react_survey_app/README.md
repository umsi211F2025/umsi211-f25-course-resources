# React Survey App

Welcome to the React Survey App! This app is a simple survey tool built with React, designed for learning and experimentation in UMSI 211.

## Getting Started in GitHub Codespaces

Follow these steps to get the app running in your Codespace:

1. **Open the Codespace**
   - Open this repository in a GitHub Codespace. (Click the green "Code" button and select "Open with Codespaces".)

2. **Navigate to the App Directory**
   - In the terminal, change to the app directory:
     ```sh
     cd course-resources/week5/session10/react_survey_app
     ```

3. **Install Dependencies**
   - Install all required packages using npm:
     ```sh
     npm ci
     ```
   - This will install both regular and development dependencies as specified in `package.json` and `package-lock.json`.

4. **Start the Development Server**
    - Run the app locally:
       ```sh
       npm run dev
       ```
    - The app will start and you should see a message with a local URL (e.g., http://localhost:5173). In github Codespaces, use the "Ports" tab to open the forwarded port in your browser.

5. **Run the Tests (Optional)**
   - To run the test suite:
     ```sh
     npm test
     ```

## Troubleshooting
- If you see errors about missing dependencies, make sure you ran `npm ci` in the correct directory.
- If the app doesn't start, check for error messages in the terminal and ensure you are in the `react_survey_app` directory.

## Project Structure
- `src/` — Main source code for the React app
- `public/` — Static assets
- `package.json` — Project metadata and dependencies
- `package-lock.json` — Exact dependency versions

## Need Help?
If you get stuck, ask your copilot or your instructor!

---
Happy coding!
