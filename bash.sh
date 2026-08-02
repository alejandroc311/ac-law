#!/usr/bin/env bash

set -euo pipefail

/usr/bin/python3 <<'PY'
from pathlib import Path
import re

TARGET_DIR = Path("bankruptcy")

TEL_NUMBER = "+19048224739"
DISPLAY_NUMBER = "(904) 822-4739"

changed = []

# Common ways your PR number may appear
patterns = [
    # tel links
    (r'tel:\+?1?787[-\s]?476[-\s]?4562', f'tel:{TEL_NUMBER}'),
    (r'tel:\+?1?7874764562', f'tel:{TEL_NUMBER}'),
    (r'tel:\+17874764562', f'tel:{TEL_NUMBER}'),

    # visible/display numbers
    (r'\+1\s*787[-\s]?476[-\s]?4562', DISPLAY_NUMBER),
    (r'\+17874764562', DISPLAY_NUMBER),
    (r'\(787\)\s*476[-\s]?4562', DISPLAY_NUMBER),
    (r'787[-\s]?476[-\s]?4562', DISPLAY_NUMBER),
    (r'787\.476\.4562', DISPLAY_NUMBER),
]

for file in TARGET_DIR.rglob("*"):
    if file.suffix.lower() not in [".html", ".js", ".css"]:
        continue

    original = file.read_text(encoding="utf-8")
    text = original

    for pattern, replacement in patterns:
        text = re.sub(pattern, replacement, text, flags=re.I)

    if text != original:
        backup = file.with_suffix(file.suffix + ".bak")
        backup.write_text(original, encoding="utf-8")
        file.write_text(text, encoding="utf-8")
        changed.append(str(file))

for f in changed:
    print("Updated:", f)

print(f"Done. Updated {len(changed)} files.")
print("Backups created as .bak files.")
PY