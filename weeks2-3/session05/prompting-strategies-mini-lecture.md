---
marp: true
theme: default
paginate: true
---

# Prompting Strategies for Copilot Chat

---

## Getting Set Up: Saving Prompt Snippets in VS Code

- We created a `prompt-snippets.md` file at the top level in this repository.
- Add sections for different types of prompts (e.g., debugging, code generation, explanation requests).
- Copy and paste from this file as needed.

---

## Brainstorm: What Snippets Would Be Useful?
- Think about tasks you often ask Copilot to help with. For example:
  - Brainstorming about what to build and how to build it
  - Helping you understand existing code
  - Suggesting improvements to code structure or design
  - Identifying potential bugs or issues
  - Explaining error messages and fixing the code
  - Generating documentation
  - Meta: helping you formulate better prompts!

---

## What Makes a Good Prompt?
- **Specificity:** Be clear about what you want.
- **Context:** Provide enough information (e.g., code, error messages).
- **Iteration:** Refine your prompt if the first answer isn't what you need.

---

## Activity
- Add at least 3 prompt snippets you think you'll use often to your `prompt-snippets.md` file or your VS Code snippets.
- Share your favorite prompt ideas with a partner.

---

# Prompts for the Advent Game Problem Set

As you work on the Advent game problem set, you’ll need to use Copilot Chat for a variety of tasks. Here are some key types of prompts you might use, with discussion points for each:

---

## 1. Understanding Existing Code
- **Discussion:** How can you ask Copilot to explain how a function or part of the game works? What information should you provide for the best answer?
- **Starter Prompt:**
  > Explain what this function does and how it fits into the game logic:
  > [Paste function here]

---

## 2. Extending the Game Map
- **Discussion:** How can you prompt Copilot to help you add new rooms, items, or connections to the game map? What details should you specify?
- **Starter Prompt:**
  > Suggest how to add a new room called '[Room Name]' to the game map in `game.json`, and connect it to [existing room].

---

## 3. Extending Game Mechanics
- **Discussion:** What’s the best way to ask Copilot to help you implement a new game mechanic (e.g., a new command or rule)? How specific should you be?
- **Starter Prompt:**
  > Help me add a new command called '[command]' that lets the player [describe action]. What changes do I need to make in `advent.py`?

---

## 4. Writing and Running Tests
- **Discussion:** How can you ask Copilot to help you write unit tests, especially for new features or the playback functionality?
- **Starter Prompt:**
  > Write a unit test for the [feature/command] in `test_advent.py`.

---

## 5. Debugging and Error Fixing
- **Discussion:** What information should you give Copilot when you encounter an error or bug?
- **Starter Prompt:**
  > Explain this error and suggest how to fix it:
  > [Paste error message here]

---

## 6. Documentation and Reflection
- **Discussion:** How can Copilot help you write clear documentation or reflect on your process?
- **Starter Prompt:**
  > Help me write a summary of the new features I added to the game for my README.

---

## Experiment and Expand
Feel free to expand your prompt collection and experiment with new strategies as you work!
