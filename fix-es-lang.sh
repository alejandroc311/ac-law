#!/usr/bin/env bash
set -euo pipefail

find . -type f -name "*.html" -print0 | while IFS= read -r -d '' file; do
  rel="${file#./}"

  # Skip if a meta description already exists
  if grep -qi '<meta[^>]*name=["'"'"']description["'"'"']' "$file"; then
    echo "Skipping (already has meta description): $file"
    continue
  fi

  # Build placeholder text
  if [[ "$rel" == "index.html" ]]; then
    desc="Homepage description placeholder"
  elif [[ "$rel" == "es/index.html" ]]; then
    desc="Descripción provisional de la página principal"
  else
    desc="Placeholder description for $rel"
  fi

  perl -0pi -e '
    my $tag = qq{    <meta name="description" content="'"$desc"'" />\n};
    s{</head>}{$tag</head>}i;
  ' "$file"

  echo "Updated: $file"
done

echo "Done."