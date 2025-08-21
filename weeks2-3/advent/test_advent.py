import unittest
from advent import Game

class TestAdventGame(unittest.TestCase):
    def setUp(self):
        # Use a test copy of the game file
        self.game = Game("game.json")

    def test_describe_current_room_outputs_description(self):
        desc = self.game.describe_current_room()
        self.assertTrue("cave" in desc.lower() or "dark" in desc.lower())

    def test_move_to_forest(self):
        result = self.game.move("north")
        self.assertEqual(self.game.current_room, "forest")
        self.assertIn("sunlit", result.lower())
        self.assertIn("torch", result.lower())


if __name__ == "__main__":
    unittest.main()
