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
- Or you may decide that you want to save it somewhere else, like a notes file on your own computer, so that it's handy in any codespace that you use (you will have a different codespace for each problem set).

---

## Tasks for Your AI Assistant 
- Brainstorm about what to build and how to build it
- Help you understand existing code
- Suggest improvements to code structure or design
- Identify potential bugs or issues
- Explain error messages and fix the code
- Generate documentation
- What else?

---

## What Makes a Good Prompt?
- **Specificity:** Be clear about what you want.
- **Context:** Provide enough information (e.g., code, error messages).

---
## Discussion: What Can Go Wrong?
- Generates code when I wanted to brainstorm alternatives
- Generates code that fails type checks
- Claims that it fixed it when it didn't
- Misunderstands my question or request
- Provides irrelevant information
- Uses jargon I don't understand
- Makes giant changes when there's a simpler way
- Reimplements things rather than reusing existing code
- Tries again to do something that I decided 20 minutes (or yesterday) ago was bad
- ...

---
## Discussion
- What can we add to prompts to avoid those problems?

## Activity
- Add at least 3 prompt snippets you think you'll use often to your `prompt-snippets.md` file or your VS Code snippets.

---

## A Prompt For Summarizing Prompting Issues?

Problem set requires you to do document prompting wins and fails.

```text
Whenever you have a particularly good interaction with Copilot 
(a win), or not so good (a fail), record a little note about it. 
Where it's useful, copy and paste your exact prompt. 
Use your judgment, but it's probably not helpful to copy and paste 
its entire response; better to summarize in our own words what went
wrong, or what was particularly useful about its response. If you
have a fail that you eventually resolved, it will be particularly
useful to write a note about how you resolved the problem.
```
How might we prompt Copilot to help us generate summaries of our prompting experiences?