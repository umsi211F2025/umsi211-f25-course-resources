---
marp: true
---

# Programs

---

## What is a Program?

- A program is a set of instructions that a computer can execute.
- Written in a restricted language, with a specific syntax and formal semantics (every program has a precise meaning).
    - examples: python, jscript, markdown

---

## Files

- Programs are typically organized into one or more files.
- File extensions can indicate what program is meant to process its contents
    - .py files are meant to be processed by a Python interpreter
    - .md files are meant to be processed by a Markdown parser
- One file can refer to or include things from other files. (We haven't seen that yet; useful when programs get bigger for keeping things organized)

---

## Directories

- A directory or folder groups related files together.
- A directory can contain multiple files and subdirectories. For example:
    - umsi211-f25-course-resources/ contains:
        - some files
        - subdirectory week1/
    - umsi211-f25-course-resources/week1/ contains:
        - README.md
        - madlibs/
        - session01/
        - session02/

---

## Program Execution

- Programs are executed by an interpreter, which follows the instructions specified in the program.
- The execution process typically involves:
    - Loading the program into memory
    - Parsing and interpreting the program's code
    - Performing the specified operations
    - Producing output or modifying data
- The interpreter can be run from a command line, an IDE, a web browser, a phone app, or other ways.
- We'll focus on using the command line initially.

---

## Command Line Program Execution

- Open a Terminal window. (Command-Shift-P then select Terminal: Create New Terminal)
- Use the `cd` command to navigate to the directory containing your program file. 
    - If you are currently connected to umsi211-f25-course-resources:
    ```sh
    cd week1/madlibs
    ```
    - To move up a directory, use:
    ```sh
    cd ..
    ```
- Run the program
    ```sh
    python madlibs.py
    ```
