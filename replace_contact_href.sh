#!/usr/bin/env bash
set -euo pipefail

# Project root = directory where this script lives
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SEARCH='href="./../contact.html"'
REPLACE='href="./../contact.html"'

echo "Root: $ROOT_DIR"
echo "Replacing: $SEARCH → $REPLACE"
echo

grep -rl --binary-files=without-match --fixed-strings "$SEARCH" "$ROOT_DIR" \
| while IFS= read -r file; do
    echo "Updating: $file"
    sed -i '' "s|$SEARCH|$REPLACE|g" "$file"
  done

echo
echo "✅ Done. No backup files were created."
