
#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

find . -type f -name "*.html" -exec perl -0pi -e \
's/style="color: #f5f0e6 onmouseover="/style="color: #f5f0e6" onmouseover="/gi' {} +

echo "Done."