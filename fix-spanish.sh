#!/usr/bin/env bash

set -euo pipefail

echo "Cleaning top-level section index links..."

TARGET_DIRS=("./bankruptcy" "./quiebras")

for dir in "${TARGET_DIRS[@]}"; do
  [ -d "$dir" ] || continue

  find "$dir" -maxdepth 1 -type f -name "*.html" -print0 | while IFS= read -r -d '' file; do
    sed -i.bak \
      -e 's|href="\./index\.html"|href="./"|g' \
      -e "s|href='\./index\.html'|href='./'|g" \
      "$file"

    if cmp -s "$file" "$file.bak"; then
      rm "$file.bak"
    else
      echo "Updated: $file"
    fi
  done
done

echo "Done."