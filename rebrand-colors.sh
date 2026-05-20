#!/usr/bin/env bash
set -euo pipefail

ES_DIR="${1:-./es}"

if [[ ! -d "$ES_DIR" ]]; then
  echo "Error: directory '$ES_DIR' does not exist."
  exit 1
fi

find "$ES_DIR" -type f -name "*.html" | while read -r file; do
  perl -0pi -e '
    # Replace any tel: href with the Puerto Rico number
    s/href="tel:[^"]*"/href="tel:+17874764562"/gi;

    # Replace visible Spanish call text, regardless of the old number
    s/O\s+llama\s+al\s*\([0-9]{3}\)\s*[0-9]{3}[\s-]?[0-9]{4}/Llame al (787) 476 4562/gi;
    s/Llame\s+al\s*\([0-9]{3}\)\s*[0-9]{3}[\s-]?[0-9]{4}/Llame al (787) 476 4562/gi;
  ' "$file"

  echo "Updated $file"
done

echo "Done."