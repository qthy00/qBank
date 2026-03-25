#!/usr/bin/env python3
"""
Continuous Learning - Project Detection Helper (Cross-platform)

Shared logic for detecting current project context.
Used by observe and observer scripts.

Exports:
  _CLV2_PROJECT_ID     - Short hash identifying the project (or "global")
  _CLV2_PROJECT_NAME   - Human-readable project name
  _CLV2_PROJECT_ROOT   - Absolute path to project root
  _CLV2_PROJECT_DIR    - Project-scoped storage directory under homunculus

Detection priority:
  1. CLAUDE_PROJECT_DIR env var (if set)
  2. git remote URL (hashed for uniqueness across machines)
  3. git repo root path (fallback, machine-specific)
  4. "global" (no project context detected)
"""

import hashlib
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Optional, Tuple

# Configuration
HOME = Path.home()
HOMUNCULUS_DIR = HOME / ".claude" / "homunculus"
PROJECTS_DIR = HOMUNCULUS_DIR / "projects"
REGISTRY_FILE = HOMUNCULUS_DIR / "projects.json"


def resolve_python_cmd() -> Optional[str]:
    """Resolve Python command to use."""
    env_cmd = os.environ.get("CLV2_PYTHON_CMD")
    if env_cmd:
        return env_cmd

    # Try common Python commands
    for cmd in ["python3", "python", "py"]:
        try:
            result = subprocess.run(
                [cmd, "--version"],
                capture_output=True,
                timeout=5
            )
            if result.returncode == 0:
                return cmd
        except (subprocess.TimeoutExpired, FileNotFoundError):
            continue
    return None


def detect_project() -> Dict[str, str]:
    """
    Detect current project context.
    Returns dict with id, name, root, project_dir.
    """
    project_root = None
    source_hint = ""

    # 1. Try CLAUDE_PROJECT_DIR env var
    env_dir = os.environ.get("CLAUDE_PROJECT_DIR")
    if env_dir and os.path.isdir(env_dir):
        project_root = Path(env_dir).resolve()
        source_hint = "env"

    # 2. Try git repo root
    if not project_root:
        try:
            result = subprocess.run(
                ["git", "rev-parse", "--show-toplevel"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                project_root = Path(result.stdout.strip()).resolve()
                source_hint = "git"
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass

    # 3. No project — global fallback
    if not project_root:
        return {
            "id": "global",
            "name": "global",
            "root": "",
            "project_dir": str(HOMUNCULUS_DIR),
            "instincts_personal": str(HOMUNCULUS_DIR / "instincts" / "personal"),
            "instincts_inherited": str(HOMUNCULUS_DIR / "instincts" / "inherited"),
            "evolved_dir": str(HOMUNCULUS_DIR / "evolved"),
            "observations_file": str(HOMUNCULUS_DIR / "observations.jsonl"),
        }

    project_name = project_root.name

    # Derive project ID from git remote URL or path
    remote_url = ""
    try:
        result = subprocess.run(
            ["git", "-C", str(project_root), "remote", "get-url", "origin"],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            remote_url = result.stdout.strip()
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass

    # Strip credentials from remote URL
    if remote_url and "://" in remote_url:
        # Handle https://user:pass@github.com/...
        if "@" in remote_url.split("://")[1]:
            parts = remote_url.split("://")
            url_part = parts[1]
            if "@" in url_part:
                remote_url = f"{parts[0]}://{url_part.split('@')[1]}"

    hash_source = remote_url if remote_url else str(project_root)
    project_id = hashlib.sha256(hash_source.encode()).hexdigest()[:12]

    project_dir = PROJECTS_DIR / project_id

    # Ensure directory structure
    for subdir in [
        project_dir / "instincts" / "personal",
        project_dir / "instincts" / "inherited",
        project_dir / "observations.archive",
        project_dir / "evolved" / "skills",
        project_dir / "evolved" / "commands",
        project_dir / "evolved" / "agents",
    ]:
        subdir.mkdir(parents=True, exist_ok=True)

    # Update registry
    update_registry(project_id, project_name, str(project_root), remote_url)

    return {
        "id": project_id,
        "name": project_name,
        "root": str(project_root),
        "remote": remote_url,
        "project_dir": str(project_dir),
        "instincts_personal": str(project_dir / "instincts" / "personal"),
        "instincts_inherited": str(project_dir / "instincts" / "inherited"),
        "evolved_dir": str(project_dir / "evolved"),
        "observations_file": str(project_dir / "observations.jsonl"),
    }


def update_registry(pid: str, pname: str, proot: str, premote: str) -> None:
    """Update the projects.json registry."""
    try:
        REGISTRY_FILE.parent.mkdir(parents=True, exist_ok=True)

        try:
            with open(REGISTRY_FILE, encoding="utf-8") as f:
                registry = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            registry = {}

        now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        entry = registry.get(pid, {})

        metadata = {
            "id": pid,
            "name": pname,
            "root": proot,
            "remote": premote,
            "created_at": entry.get("created_at", now),
            "last_seen": now,
        }

        registry[pid] = metadata

        # Write atomically
        tmp_file = REGISTRY_FILE.parent / f".{REGISTRY_FILE.name}.tmp.{os.getpid()}"
        with open(tmp_file, "w", encoding="utf-8") as f:
            json.dump(registry, f, indent=2)
            f.write("\n")
        tmp_file.replace(REGISTRY_FILE)

        # Also write project-specific metadata
        project_dir = PROJECTS_DIR / pid
        project_file = project_dir / "project.json"
        with open(project_file, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)
            f.write("\n")

    except Exception:
        pass  # Non-fatal


def get_env_vars() -> Dict[str, str]:
    """Get environment variables for scripts."""
    project = detect_project()
    env_vars = {
        "_CLV2_PROJECT_ID": project["id"],
        "_CLV2_PROJECT_NAME": project["name"],
        "_CLV2_PROJECT_ROOT": project["root"],
        "_CLV2_PROJECT_DIR": project["project_dir"],
        "PROJECT_ID": project["id"],
        "PROJECT_NAME": project["name"],
        "PROJECT_ROOT": project["root"],
        "PROJECT_DIR": project["project_dir"],
        "CLV2_OBSERVER_SENTINEL_FILE": str(Path(project["project_dir"]) / ".observer.lock" if project["root"] else Path(project["project_dir"]) / ".observer.lock"),
        "CLV2_IS_WINDOWS": str(sys.platform == "win32").lower(),
    }

    python_cmd = resolve_python_cmd()
    if python_cmd:
        env_vars["CLV2_PYTHON_CMD"] = python_cmd
        env_vars["_CLV2_PYTHON_CMD"] = python_cmd

    return env_vars


def print_env_vars():
    """Print environment variables in shell format."""
    env_vars = get_env_vars()
    for key, value in env_vars.items():
        # Escape special characters for shell
        escaped = value.replace('"', '\\"').replace("'", "\\'")
        if sys.platform == "win32":
            print(f"set {key}={escaped}")
        else:
            print(f'export {key}="{escaped}"')


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--export":
        print_env_vars()
    else:
        project = detect_project()
        print(f"Project: {project['name']} ({project['id']})")
        print(f"Root: {project['root']}")
        print(f"Project dir: {project['project_dir']}")
