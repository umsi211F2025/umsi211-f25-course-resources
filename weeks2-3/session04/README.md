# Session 04: Data Types and Type Annotations

Welcome to Session 04! In this session, we'll explore the concept of **data types**, why they matter, and how using type annotations can help us write better, safer code.

## Learning Goals
- Understand what data types are and why they're important
- Recognize types in python code
- Understand lists, dictionaries, and the idea of nested data structures


## Agenda

1. **Mini-lecture:** Data Types and Type Annotations ([data-types-mini-lecture.md](./data-types-mini-lecture.md))
2. **Mini-lecture:** Complex Data Types & Nested Structures ([complex-data-types-mini-lecture.md](./complex-data-types-mini-lecture.md))
3. **Discussion:** What will a validator for Advent game.json do?
3. **Lab Exercise:** Practice with Data Types in the Advent Game
    - Add an `items` key to `advent/game.json`, where each item has a name and a description.
        - Ask the AI assistant to help you think through whether items should be a list or a dictionary.
    - Update the game code so that the player can type `describe <item_name>` to see the description of an item (if it exists in the current room or inventory).
    - Make a unit test for the new function that checks if the description is returned correctly, when it should, and not when it shouldn't.


## Materials
- `advent/advent.py`
- `advent/game.json` (for nested data structure examples)
- Mini-lecture: [data-types-mini-lecture.md](./data-types-mini-lecture.md)
- Mini-lecture: [complex-data-types-mini-lecture.md](./complex-data-types-mini-lecture.md)


