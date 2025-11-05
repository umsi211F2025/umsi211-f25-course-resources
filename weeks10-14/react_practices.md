# React Practices Guide

This document records preferred approaches for structuring React projects in this course. Give this guide to your Copilot as context when prompting it to create anything for you. Tell it to follow these practices! Ask it frequently to check whether it has followed these practices and propose refactorings if it has strayed.

## Import style
- We are using "type": "module" in package.json, so we use ES module syntax (`import`/`export`), not CommonJS (`require`/`module.exports`).
- Use named imports/exports where possible, default exports only when there is a single main thing being exported.
- Use absolute imports from `src/` where possible, relative imports only when necessary (e.g., importing a sibling component).

## Component Structure
- We use functional components with hooks, not class components.
- Each component should be in its own file, named with PascalCase (e.g., `UserProfile.js`).
- Each component file should export a single component as the default export.

## Component Organization
- **Favor feature-based (domain-based) folders** for most components.
- Use a `pages/` directory for top-level route components.- Place shared, generic components in a `components/` or `common/` folder.

## Component Types

In modern React, it's common to have components that both manage state/logic and render UI. You do not need to split every feature into separate "container" and "presentational" components.

**Recommended practice:**
- Keep components small and focused on a single responsibility.
- Extract logic or UI into separate components only when it improves clarity or reusability.
- Compose page components by combining smaller components as needed.


## CSS Practices
- **Hybrid approach:**
  - Place feature- or component-specific styles in the same folder as the component (e.g., `Question.css` in the `question/` folder).
  - Place shared or global styles in a central `styles/` folder, or in `App.css`/`index.css`.
- Page layout styles go with the page component (e.g., `UserProfilePage.css`).
- Use CSS Modules or styled-components for scoped styles if desired.

## Naming Conventions
- Use clear, descriptive names (e.g., `UserList`, `LoginForm`, `UserListContainer`).
- Use PascalCase for component files.
- Be consistent in naming and organization.

## Test-Driven Development (TDD)
- When asked for by the user, before implementing write tests and check with the user about whether the tests cover the desired behavior.
- Place tests in a `__tests__/` folder or alongside components with a `.test.tsx` suffix.
- Write unit tests for components and integration tests for component interactions.
- Use vitest and React Testing Library for automated tests.
- Favor user-centric queries (`getByRole`, `getByLabelText`, etc.) in tests.
- A tests file should be placed in the same directory as the component it tests, in a `__tests__/` subdirectory. For example, `src/survey/page/__tests__/SurveyPage.test.tsx` tests `src/survey/page/SurveyPage.tsx`.
- In tests, wrap user actions in `act(...)` calls. That will prevent warnings about multiple state updates not being wrapped in `act(...)`.

## Specification-Driven Development
- Maintain a `spec.md` file that describes the features and behavior of your app in sufficient detail that the copilot can implement them.
- Before implementing a new feature, update the `spec.md` file to describe the desired behavior.
- When the app doesn't behave as you'd like, update the `spec.md` file to clarify the intended behavior and point the copilot to the relevant section when asking it to fix the issue.

## Directory Example
```
src/
  pages/
    HomePage.js
    UserProfilePage.js
  user/
    UserList.js
    UserForm.js
  product/
    ProductList.js
    ProductForm.js
  components/
    Button.js
    Modal.js
  styles/
    App.css
    UserProfilePage.css
```

## General Advice
- Keep components small and focused.
- Document component responsibilities and data flow.
- Update this guide as practices evolve.

## Starting a new React Project
- Use Vite to create a new React project:
  ```bash
  npm create vite@latest my-react-app -- --template react
  cd my-react-app
  npm install
  npm run dev
  ```
- install TypeScript and types for React if using TypeScript:
  ```bash
  npm install --save-dev typescript @types/react @types/react-dom
  npx tsc --init
  ```
- rename `.js` files to `.tsx` for TypeScript React files
- update `vite.config.js` to use `tsx` extension:
  ```js
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    }
  })
  ```
- update `index.html` to point to `main.tsx` if using TypeScript:
  ```html
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
  ```
- update `main.tsx` to use TypeScript:
  ```tsx
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import App from './App.tsx';

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  ```

## Best Practices: Handling User Input in SQL Queries

- **Never** insert user input directly into SQL strings (risk of SQL injection)
- Always use parameterized queries or prepared statements
    - Example (Node.js with SQLite):
      ```js
      db.get("SELECT * FROM answers WHERE user_id = ?", [userId]);
      ```
- Validate and sanitize all user input before using it in a query
    - Check types (e.g., is it a number? a valid string?)
    - Enforce length and format constraints
- Escape or reject unexpected characters if needed (for text fields)
- Log and handle errors gracefully (never show raw SQL errors to users)
- Use database libraries that support parameterized queries by default
- Review and test for edge cases and possible attacks

**Remember:** Parameterized queries are the single most important defense against SQL injection!

