# Advent Game: Starter README

This README provides instructions for running the starter `advent.py` game, editing the game map, and running tests.

## How to Run the Game

1. Open a terminal and navigate to the `weeks2-3/advent/` directory:
   ```sh
   cd weeks2-3/advent
   ```
2. Run the game with Python 3:
   ```sh
   python advent.py
   ```

## User Commands

While playing, you can enter commands such as:
- `go <direction>` (e.g., `go north`, `go east`)
- `look` (describe your current location)
- `inventory` (show what you are carrying)
- `take <item>` (pick up an item)
- `drop <item>` (drop an item)
- `help` (show available commands)
- `quit` (exit the game)

Other commands may be available depending on the current game state or your extensions.

## How to Run the Tests

1. Make sure you are in the `weeks2-3/advent/` directory.
2. Run the tests with:
   ```sh
   python -m unittest test_advent.py
   ```

## Editing the Game Map (`game.json`)

- The game world is defined in the `game.json` file in the same directory.
- You can add or edit rooms and connections by modifying this file.
- Be sure to follow the existing format for rooms, etc.
- After editing, restart the game to see your changes.

## Changing the Game Mechanics (`advent.py`)

- The game mechanics are defined in the `advent.py` file.
- You can modify the game's behavior (e.g., to include new commands or item types) by changing the code in this file.