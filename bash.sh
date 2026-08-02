#!/usr/bin/env bash

set -euo pipefail

/usr/bin/python3 <<'PY'
from pathlib import Path
import re

TARGET_DIR = Path("bankruptcy")

REAL_TEL = "+19048224739"
REAL_DISPLAY = "(904) 822-4739"

changed = []

patterns = [
    # Fake placeholder display numbers
    (r'\(904\)\s*555[-\s]?0123', REAL_DISPLAY),
    (r'904[-\s]?555[-\s]?0123', REAL_DISPLAY),
    (r'904\.555\.0123', REAL_DISPLAY),
    (r'\+1\s*904[-\s]?555[-\s]?0123', REAL_DISPLAY),
    (r'\+19045550123', REAL_DISPLAY),

    # Fake placeholder tel links, just in case any remain
    (r'tel:\+?1?904[-\s]?555[-\s]?0123', f'tel:{REAL_TEL}'),
    (r'tel:\+19045550123', f'tel:{REAL_TEL}'),
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