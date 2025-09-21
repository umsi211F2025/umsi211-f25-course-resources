---
marp: true
theme: default
paginate: true
---
# Introduction to HTML

---
## What is HTML?
- HyperText Markup Language
- Structure of web pages
- Uses tags to organize and display content

### Resources for Further Exploration
- [MDN HTML Guide](https://developer.mozilla.org/en-US/docs/Web/HTML)

---
## Example: a Poll Page

![Poll Page Screenshot](images/poll_static.png)

---
**Activity:**
  - Open the file `poll_static.html` in your code editor.
  - Review the HTML structure and tags in the file.

---
**Activity: Open the Page in a Browser**
  1. In a terminal window, run a simple HTTP server that will serve the contents of the session08 folder.
  ```
  python3 -m http.server 8080 --directory "$(git rev-parse --show-toplevel)/week5/session08"
  ```

  This will start a server on port 8080.
  
  If you are are in a GitHub Codesspace, it will set up a port forwarding URL for you, something like, `https://bug-free-orbit-x5vrrrg5jq-8080.app.github.dev/`

  If running vscode locally, you will want to use the URL `http://localhost:8080/`

  2. Open that URL in a new browser tab. You should see a directory listing. 
  3. Click on `poll_static.html` to open it in the browser.

---
## Key Features in the Example

---
## 1. Structure
- Every tag like `<html>` has content inside, and then a closing tag `</html>`.
- For an HTML document, the enclosing `<html>` tag includes two top-level tags: `<head>` and `<body>`.
- Indentation can be helpful for human readers, but is not required.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Poll Example</title>
  </head>
  <body>
    ...
  </body>
</html>
```

---

## 2. `<section>` as semantic divider

Using `<section>` tags to divide the page into meaningful parts is a good practice.
- It's especially helpful for accessibility (screen readers, etc.)

```html
<div class="poll-container">
    <section>...</section>
    <section>...</section>
  ...
</div>
```
---
## 3. Headings and Lists
- `<h1>`, `<h2>`, etc. for headings
- `<ul>` for unordered lists
    - `<li>` for list items
- `<button>` for clickable buttons
    - Later we'll add interactivity with JavaScript to make the button do something
```html
<section>
  <h2>Which is your favorite fruit?</h2>
  <ul>
    <li><button>Apple</button></li>
    <li><button>Banana</button></li>
    <li><button>Cherry</button></li>
    <li><button>Grape</button></li>
    <li><button>Pomegranate</button></li>
  </ul>
</section>
```
---
## 4. `<form>` for user input

```html
<section>
  <h2>Prediction</h2>
  <form>
    <label for="prediction">What percentage of other respondents do you think will choose the same fruit as you?</label><br>
    <input type="number" id="prediction" name="prediction" min="0" max="100" step="1"> %
  </form>
</section>
```

