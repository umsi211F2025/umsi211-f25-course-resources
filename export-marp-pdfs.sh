#!/bin/zsh
set -e

find . -name "*.md" -print0 | xargs -0 -n 1 sh -c '
  mdfile="$1"
  dir="$(dirname "$mdfile")"
  base="$(basename "$mdfile")"
  if grep -q "^---" "$mdfile" && grep -q "marp:" "$mdfile"; then
    pdffile="${mdfile%.md}.pdf"
    if [ ! -f "$pdffile" ] || [ "$pdffile" -ot "$mdfile" ]; then
      echo "About to run: (cd \"$dir\" && marp \"$base\" --pdf -o \"${base%.md}.pdf\" --allow-local-files)"
      (cd "$dir" && marp "$base" --pdf -o "${base%.md}.pdf" --allow-local-files)
    else
      echo "Skipping $mdfile (PDF is up to date)"
    fi
  else
    echo "Skipping $mdfile (no Marp front-matter)"
  fi
' _