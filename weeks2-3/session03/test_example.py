import unittest

def longer_string(a, b):
    if len(a) > len(b):
        return a
    else:
        return b

class TestLongerString(unittest.TestCase):
    def test_longer(self):
        self.assertEqual(longer_string("cat", "giraffe"), "giraffe")