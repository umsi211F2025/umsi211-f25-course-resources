
import json
from typing import Dict, List, Any

class Game:
    def __init__(self, game_file: str) -> None:
        with open(game_file) as f:
            data: Dict[str, Any] = json.load(f)
        self.rooms: Dict[str, Dict[str, Any]] = data["rooms"]
        self.current_room: str = data["start_room"]
        self.inventory: List[str] = []
        # Track item states (e.g., torch lit or not)
        self.item_states: Dict[str, Any] = {}

    def describe_current_room(self) -> str:
        room = self.rooms[self.current_room]
        desc = room["description"]
        item_names = room.get("item_names", [])
        exits = room.get("exits", {})
        output = desc
        if item_names:
            output += "\nYou see:"
            for item_name in item_names:
                output += f"\n  - {item_name}"
        else:
            output += "\nYou see nothing of interest."
        output += "\nExits:"
        if exits:
            for direction in exits.keys():
                output += f" {direction}"
        else:
            output += " None"
        return output

    def move(self, direction: str) -> str:
        room = self.rooms[self.current_room]
        exits = room.get("exits", {})
        self.current_room = exits[direction]
        return f"You move {direction}.\n" + self.describe_current_room()

    def take(self, item_name: str) -> str:
        room = self.rooms[self.current_room]
        self.inventory.append(item_name)
        if item_name in room.get("item_names", []):
            room["item_names"].remove(item_name)
        return f"You take the {item_name}."

    def use(self, item_name: str) -> str:
        # Framework for item actions
        if item_name == "torch":
            if self.item_states.get("torch_lit", False):
                return "The torch is already lit."
            else:
                self.item_states["torch_lit"] = True
                return "You light the torch. The cave is now illuminated!\n" + self.describe_current_room()
        else:
            return f"You can't use the {item_name} right now."

    def play(self) -> None:
        print("Welcome to ADVENT!")
        print(self.describe_current_room())
        while True:
            command = input("> ").strip().lower()
            if command in ("quit", "exit"):
                print("Goodbye!")
                break
            elif command.startswith("go "):
                print(self.move(command[3:]))
            elif command.startswith("take "):
                print(self.take(command[5:]))
            elif command.startswith("use "):
                print(self.use(command[4:]))
            elif command == "look":
                print(self.describe_current_room())
            elif command == "inventory":
                print("Inventory:", ", ".join(self.inventory) if self.inventory else "(empty)")
            else:
                print("I don't understand that command.")

if __name__ == "__main__":
    game: Game = Game("game.json")
    game.play()
