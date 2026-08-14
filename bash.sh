#!/usr/bin/env bash
set -euo pipefail

# Updates the navbar brand/logo link on bankruptcy and quiebras pages only.
#
# Goal:
#   /bankruptcy/... logo  -> English central hub: /
#   /quiebras/... logo    -> Spanish central hub: /es/
#
# It does NOT change Home/Inicio links.
#
# Usage:
#   Dry run:
#     bash scripts/set-brand-logo-links.sh
#
#   Apply changes:
#     bash scripts/set-brand-logo-links.sh --write
#
#   Apply changes and create .bak files:
#     bash scripts/set-brand-logo-links.sh --write --backup

PYTHON_BIN="/usr/bin/python3"

if [[ ! -x "$PYTHON_BIN" ]]; then
  echo "Error: $PYTHON_BIN not found or not executable."
  echo "On your Mac, we are using /usr/bin/python3 because /usr/local/bin/python3 gave you CPU issues before."
  exit 1
fi

"$PYTHON_BIN" - "$@" <<'PY'
from pathlib import Path
import argparse
import os
import re
import shutil
import sys

PROJECT_ROOT = Path(".").resolve()

# Scan these folders only.
# The values are the central hub folders each logo should point to.
TARGETS = {
    "bankruptcy": Path("."),   # English bankruptcy pages -> root hub /
    "quiebras": Path("es"),    # Spanish bankruptcy pages -> Spanish hub /es/
}

LOGO_HINTS = (
    "db0ba355-5315-4870-b1c7-ccc2c1dab646.jpg",
    "Crespo & Crespo Law",
    "Crespo &amp; Crespo Law",
)

NAV_RE = re.compile(r"<nav\b.*?</nav>", re.IGNORECASE | re.DOTALL)
ANCHOR_RE = re.compile(r"<a\b(?P<attrs>[^>]*)>(?P<body>.*?)</a>", re.IGNORECASE | re.DOTALL)
HREF_RE = re.compile(r'\bhref\s*=\s*(["\'])(.*?)\1', re.IGNORECASE)


def href_from_file_to_target(file_path: Path, target_dir: Path) -> str:
    """
    Return relative href from the HTML file's folder to the central hub target.

    Examples:
      bankruptcy/index.html                         -> ../
      bankruptcy/resources/chapter-7/index.html     -> ../../../
      quiebras/index.html                           -> ../es/
      quiebras/resources/capitulo-7/index.html      -> ../../../es/
    """
    start_dir = PROJECT_ROOT / file_path.parent
    target_abs = PROJECT_ROOT / target_dir

    rel = os.path.relpath(target_abs, start_dir).replace(os.sep, "/")

    if rel == ".":
        return "./"

    return rel.rstrip("/") + "/"


def is_logo_anchor(anchor_body: str) -> bool:
    body_lower = anchor_body.lower()

    if "<img" not in body_lower:
        return False

    return any(hint.lower() in body_lower for hint in LOGO_HINTS)


def replace_href_in_anchor(anchor_html: str, new_href: str):
    opening_end = anchor_html.find(">")

    if opening_end == -1:
        return anchor_html, None

    opening = anchor_html[: opening_end + 1]
    rest = anchor_html[opening_end + 1 :]

    href_match = HREF_RE.search(opening)

    if not href_match:
        return anchor_html, None

    old_href = href_match.group(2)
    new_opening = HREF_RE.sub(f'href="{new_href}"', opening, count=1)

    return new_opening + rest, old_href


def update_file(file_path: Path, new_href: str, write: bool, backup: bool):
    text = file_path.read_text(encoding="utf-8")
    nav_match = NAV_RE.search(text)

    if not nav_match:
        return False, "no <nav> found"

    nav_html = nav_match.group(0)

    for anchor_match in ANCHOR_RE.finditer(nav_html):
        anchor_html = anchor_match.group(0)
        anchor_body = anchor_match.group("body")

        if not is_logo_anchor(anchor_body):
            continue

        new_anchor_html, old_href = replace_href_in_anchor(anchor_html, new_href)

        if old_href is None:
            return False, "logo anchor found, but no href found"

        if old_href == new_href:
            return False, f"already correct ({old_href})"

        new_nav_html = (
            nav_html[: anchor_match.start()]
            + new_anchor_html
            + nav_html[anchor_match.end() :]
        )

        new_text = text[: nav_match.start()] + new_nav_html + text[nav_match.end() :]

        if write:
            if backup:
                backup_path = file_path.with_suffix(file_path.suffix + ".bak")
                shutil.copy2(file_path, backup_path)

            file_path.write_text(new_text, encoding="utf-8")

        return True, f"{old_href} -> {new_href}"

    return False, "no logo/brand anchor found in nav"


def html_files_under(folder: Path):
    root = PROJECT_ROOT / folder

    if not root.exists():
        return []

    return sorted(
        p.relative_to(PROJECT_ROOT)
        for p in root.rglob("*.html")
        if p.is_file()
    )


def main():
    parser = argparse.ArgumentParser(
        description="Set bankruptcy/quiebras navbar logo links to the central hub."
    )

    parser.add_argument(
        "--write",
        action="store_true",
        help="Actually modify files. Without this, the script only previews changes.",
    )

    parser.add_argument(
        "--backup",
        action="store_true",
        help="Create .html.bak backups before writing changes.",
    )

    args = parser.parse_args()

    mode = "WRITE" if args.write else "DRY RUN"

    print("")
    print(f"Mode: {mode}")
    print("Scanning bankruptcy/ and quiebras/ HTML files...")
    print("")

    total_files = 0
    changed_files = 0

    for practice_root, target_dir in TARGETS.items():
        files = html_files_under(Path(practice_root))

        if not files:
            print(f"[WARN] No HTML files found under {practice_root}/")
            continue

        for file_path in files:
            total_files += 1
            new_href = href_from_file_to_target(file_path, target_dir)

            changed, message = update_file(
                file_path=file_path,
                new_href=new_href,
                write=args.write,
                backup=args.backup,
            )

            status = "CHANGE" if changed else "SKIP"
            print(f"[{status}] {file_path}: {message}")

            if changed:
                changed_files += 1

    print("")
    print("Done.")
    print(f"Files scanned: {total_files}")
    print(f"Files changed: {changed_files}")

    if not args.write:
        print("")
        print("Preview only. Re-run with --write to apply changes.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
PY