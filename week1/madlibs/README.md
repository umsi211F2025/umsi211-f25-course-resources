
# Madlibs

This directory contains the madlibs program and related files.

## How to Run the Madlibs Program

1. Open a terminal and navigate to this directory:
   
	```sh
	cd week1/madlibs
	```

2. Run the program using Python:
   
	```sh
	python madlibs.py
	```

3. Follow the prompts to enter words and complete your story!


# Possible Extensions for Madlibs Lab Exercise

Here are some ideas for ways you could extend or modify the madlibs program. This will be a lab exercise in session 2.

1. **Add Support for Default Values:**
	Allow placeholders to specify a default value, e.g., `{noun:dog}` or `{1:noun:dog}`, so if the user just presses Enter, the default is used.

2. **Support for Pluralization:**
	Add a way to mark a placeholder as plural (e.g., `{noun*}`), and prompt the user accordingly, then use the plural form in the story.

3. **Randomize Prompts:**
	Instead of always prompting in the order of appearance, randomize the order of prompts.

6. **Multiple Stories:**
	Allow the user to choose from multiple story files in the directory.

7. **Enhanced Placeholder Syntax:**
	Support more complex placeholder syntax, such as `{1:noun:plural}` or `{adjective|color}` to give hints.

9. **Count and Display Placeholder Types:**
	Before prompting, display how many of each type of word (noun, verb, etc.) will be needed.

10. **Command-Line Arguments:**
	 Allow the user to specify the story file or answers via command-line arguments.

11. **Replay for testing purposes**
	Because it can be annoying to re-enter all the words as you make one fix or another during development, implement a replay feature that allows you to quickly re-run the program with a set of inputs that were entered previously during an interactive session.

You do not need to implement all of these! Pick one or more to try, or come up with your own extension.