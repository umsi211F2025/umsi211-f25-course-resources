import json

class Game:
    def __init__(self, game_file):
        with open(game_file) as f:
            data = json.load(f)
        self.rooms = data["rooms"]
        self.items = data["items"]
        self.current_room = data["start_room"]
        self.inventory = []
        # Track item states (e.g., torch lit or not)
        self.item_states = {}

    def describe_current_room(self):
        room = self.rooms[self.current_room]
        desc = room["description"]
        items = room.get("items", [])
        exits = room.get("exits", {})
        output = desc
        if items:
            output += "\nYou see: " + ", ".join(items)
        output += "\nExits: " + ", ".join(exits.keys())
        return output

    def move(self, direction):
        room = self.rooms[self.current_room]
        exits = room.get("exits", {})
        if direction in exits:
            self.current_room = exits[direction]
        else:
            self.current_room = direction  # nonsensical, but for error demonstration
        return f"You move {direction}.\n" + self.describe_current_room()

    def take(self, item):
        room = self.rooms[self.current_room]
        self.inventory.append(item)
        if item in room.get("items", []):
            room["items"].remove(item)
        return f"You take the {item}."

    def use(self, item):
        # Framework for item actions
        if item == "torch":
            if self.item_states.get("torch_lit", False):
                return "The torch is already lit."
            else:
                self.item_states["torch_lit"] = True
                return "You light the torch. The cave is now illuminated!\n" + self.describe_current_room()
        else:
            return f"You can't use the {item} right now."

    def play(self):
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
    game = Game("game.json")
    game.play()
