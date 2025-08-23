---
marp: true
---
# Session 03: Functions

---
## Learning Goals
- Understand what functions are and why we use them
- Identify and describe functions in a Python program (advent.py)
- Read and reason about code structure (with help from your AI assistant!)

---
## What is a Function?
- A function is a named block of code that can be invoked to do something.
    - Can take inputs, called parameters
    - Can return outputs
    - Can also have side effects (e.g., printing something; saving something)
- Functions help us organize code, avoid repetition, and make programs easier to read and test.


---
## Functions in python

- In Python, we define a function using the `def` keyword.

```python
def longer_string(a: str, b: str) -> str:
    if len(a) > len(b):
        return a
    else:
        return b
```

**Example invocations:**
```python
longer_string("cat", "giraffe")   # returns 'giraffe'
longer_string("hello", "hi")      # returns 'hello'
longer_string("dog", "bat")       # returns 'dog' (same length, returns first)
```

--- 

## ADVENT: a text-based adventure game

- A game where players navigate through rooms, take items, and solve puzzles using text commands.
- History: Inspired by classic text-based adventure games like Zork and Adventure.
    - Adventure (also known as Colossal Cave Adventure) was created in the mid-1970s.
```
cd advent/
python advent.py
```

---

## The Concept of State

- State refers to the current status or condition of a program execution.
- In ADVENT, the state includes all relevant information about the game, including the player's location, inventory, and any other relevant information.
- In our advent.py code, state is managed through instance variables in the `Game` class, such as `self.current_room` and `self.inventory`.
    - The contents of those variables change over time as the player interacts with the game.

---

## Activity: Code Walkthrough

- Let's look at the `advent.py` game code, in the `advent/` directory.
- Identify the functions: `describe_current_room`, `move`, `take`, `use`, `play`
- For each function:
    - What are its inputs (parameters)?
    - What does it return (if anything)?
    - What side effects does it have (printing; saving data for later use)
    - Where is it invoked?

Not sure? Ask your AI assistant to explain!

---

## Discussion

- Why do you think the author chose to break the code into these functions?
    - Could the code for each of the functions have just been included in the main play() function?
- Notice that only play() ever prints anything out.
    - Why do you think that is?


