---
marp: true
---

# Using Copilot Chat

---

## How to use Copilot Chat
- If the sidebar isn't visible
    - Open it with the keyboard shortcut Cmd+I (Mac) or Ctrl+I (Windows/Linux)
    - or use the Command Palette (Cmd+Shift+P) and search "Copilot Chat"
- Put it in Agent mode if it isn't already.
    - That authorizes it to read and edit your code files and run some terminal commands. Sometimes, it may ask you for permission for specific actions.
- Make requests in plain English.
    - In future classes, we will explore ways to make these requests more effectively, but just try it for now and see what works.

---

## Tips for Success
- Be specific with your questions and requests.
- If you think a suggestion is incorrect, provide feedback to help improve it.
- If you think a suggestion *might* be incorrect, ask for an explanation.

We will talk much more about strategies for assessing whether Copilot's changes are good and for making better requests. That will be a running theme throughout the course!

---

## Accepting or Rejecting Changes

Sadly, not all of the code changes made by Copilot Chat will be perfect.

- In the code windows, you will see a file with red and green markings to show what has been edited.
- In individual files, you can review specific changes and accept or reject each one, or all of them in a file.
- In the chat window, if you click keep or discard, it will either keep all changes in all files or discard them all.

Note: if you try to make a commit while there are unaccepted changes, you will be prompted to accept or discard those changes before proceeding.

---

## Lab Exercise: Improve the Madlib program

- Look at the README.md file in the madlibs directory for some ideas of possible extensions you could implement.
    - Or come up with your own idea for an extension!

- Open the madlibs.py file and ask the copilot to explain how the code works.
    - If it uses programming or python terms that you don't understand, ask for clarification and tell it what level of description you need.
- Have a discussion with the copilot about alternative implementation approaches.
- Then ask it to implement your extension idea.
- Test it. Copy any error messages you get into the chat and ask it to diagnose and fix the errors.