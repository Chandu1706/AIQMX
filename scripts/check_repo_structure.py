#!/usr/bin/env python3
"""Fail if tracked files drift outside the allowed monorepo layout."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

ALLOWED_ROOT_FILES = {
    ".editorconfig",
    ".gitignore",
    "README.md",
    "LICENSE",
}

ALLOWED_ROOT_DIRS = {
    ".github",
    "backend",
    "frontend",
    "scripts",
}

ALLOWED_GITHUB_FILES = {
    ".github/workflows/ci.yml",
    ".github/pull_request_template.md",
    ".github/CODEOWNERS",
    ".github/dependabot.yml",
}

ALLOWED_BACKEND_ROOT_FILES = {
    "README.md",
    "requirements.txt",
    "requirements-dev.txt",
    "pyproject.toml",
    ".env.example",
}

ALLOWED_FRONTEND_ROOT_FILES = {
    "README.md",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "tsconfig.node.json",
    "vite.config.ts",
    "eslint.config.js",
    ".prettierrc.json",
    ".prettierignore",
    "index.html",
}

FORBIDDEN_PATH_PARTS = {
    "node_modules",
    "__pycache__",
    ".venv",
    "venv",
    "dist",
    ".pytest_cache",
    ".ruff_cache",
    "coverage",
    ".vite",
    "secrets",
}

FORBIDDEN_SUFFIXES = {
    ".env",
    ".pem",
    ".key",
    ".pyc",
    ".pyo",
    ".log",
}

FORBIDDEN_NAME_FRAGMENTS = (
    "firebase-service-account",
    "firebase-adminsdk",
)


def tracked_files() -> list[str]:
    output = subprocess.check_output(
        ["git", "ls-files", "-co", "--exclude-standard", "-z"],
        cwd=ROOT,
        text=True,
    )
    return [path for path in output.split("\0") if path]


def fail(errors: list[str]) -> None:
    print("Repository structure check failed:\n")
    for error in errors:
        print(f"- {error}")
    print(
        "\nAllowed top-level layout:\n"
        "  README.md, .gitignore, .editorconfig, LICENSE\n"
        "  backend/   FastAPI app + tests\n"
        "  frontend/  React + Vite app + tests\n"
        "  scripts/   CI helper scripts\n"
        "  .github/   workflows and PR templates"
    )
    sys.exit(1)


def main() -> None:
    errors: list[str] = []
    files = tracked_files()
    if not files:
        fail(["git ls-files returned no tracked files"])

    root_entries = {Path(path).parts[0] for path in files}
    for entry in sorted(root_entries):
        path = ROOT / entry
        if path.is_dir() or entry in ALLOWED_ROOT_DIRS:
            if entry not in ALLOWED_ROOT_DIRS:
                errors.append(f"unexpected top-level directory: {entry}/")
        elif entry not in ALLOWED_ROOT_FILES:
            errors.append(f"unexpected top-level file: {entry}")

    for rel in files:
        path = Path(rel)
        parts = path.parts
        name = path.name.lower()

        if any(part in FORBIDDEN_PATH_PARTS for part in parts):
            errors.append(f"generated or secret path must not be committed: {rel}")
            continue

        if path.suffix in FORBIDDEN_SUFFIXES or name in {".env", ".env.local"}:
            errors.append(f"forbidden file type committed: {rel}")
            continue

        if any(fragment in name for fragment in FORBIDDEN_NAME_FRAGMENTS):
            errors.append(f"credential file must not be committed: {rel}")
            continue

        if parts[0] == ".github":
            if rel not in ALLOWED_GITHUB_FILES:
                errors.append(f"unexpected GitHub file: {rel}")
            continue

        if parts[0] == "scripts":
            if len(parts) != 2 or path.suffix != ".py":
                errors.append(f"scripts/ may only contain top-level .py files: {rel}")
            continue

        if parts[0] == "backend":
            if len(parts) == 2 and parts[1] not in ALLOWED_BACKEND_ROOT_FILES:
                errors.append(f"unexpected backend root file: {rel}")
            elif len(parts) > 2 and parts[1] not in {"app", "tests"}:
                errors.append(f"backend source must live in app/ or tests/: {rel}")
            elif path.suffix == ".py" and parts[1] == "app" and "tests" in parts:
                errors.append(f"do not nest tests inside backend/app: {rel}")
            continue

        if parts[0] == "frontend":
            if len(parts) == 2 and parts[1] not in ALLOWED_FRONTEND_ROOT_FILES:
                errors.append(f"unexpected frontend root file: {rel}")
            elif len(parts) > 2 and parts[1] not in {"src", "public"}:
                errors.append(f"frontend source must live in src/ or public/: {rel}")
            continue

        if parts[0] not in ALLOWED_ROOT_FILES and parts[0] not in ALLOWED_ROOT_DIRS:
            errors.append(f"file is outside the allowed layout: {rel}")

    python_files = [path for path in files if path.endswith(".py")]
    for rel in python_files:
        if not (rel.startswith("backend/") or rel.startswith("scripts/")):
            errors.append(f"Python files belong in backend/ or scripts/: {rel}")

    ts_files = [path for path in files if path.endswith((".ts", ".tsx", ".css"))]
    for rel in ts_files:
        if not rel.startswith("frontend/"):
            errors.append(f"frontend source belongs in frontend/: {rel}")

    if errors:
        fail(sorted(set(errors)))

    print(f"Repository structure OK ({len(files)} tracked files).")


if __name__ == "__main__":
    main()
