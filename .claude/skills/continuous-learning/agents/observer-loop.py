#!/usr/bin/env python3
"""
Continuous Learning - Observer background loop (Cross-platform)

Fix for #521: Added re-entrancy guard, cooldown throttle, and
tail-based sampling to prevent memory explosion from runaway
parallel Claude analysis processes.
"""

import datetime
import os
import signal
import subprocess
import sys
import tempfile
import threading
import time
from pathlib import Path

# Import detect_project module
sys.path.insert(0, str(Path(__file__).parent))
from detect_project import detect_project, HOMUNCULUS_DIR

# Configuration
ANALYSIS_COOLDOWN = int(os.environ.get("ECC_OBSERVER_ANALYSIS_COOLDOWN", "60"))
OBSERVER_INTERVAL_SECONDS = int(os.environ.get("OBSERVER_INTERVAL_SECONDS", "300"))
MIN_OBSERVATIONS = int(os.environ.get("MIN_OBSERVATIONS", "5"))
MAX_ANALYSIS_LINES = int(os.environ.get("ECC_OBSERVER_MAX_ANALYSIS_LINES", "500"))
TIMEOUT_SECONDS = int(os.environ.get("ECC_OBSERVER_TIMEOUT_SECONDS", "120"))
MAX_TURNS = int(os.environ.get("ECC_OBSERVER_MAX_TURNS", "10"))

# Global state
analyzing = False
last_analysis_time = 0
usr1_fired = False
should_exit = False


def get_log_file(project_dir: str) -> Path:
    """Get log file path for the observer."""
    return Path(project_dir) / "observer.log"


def get_observations_file(project_dir: str) -> Path:
    """Get observations file path."""
    return Path(project_dir) / "observations.jsonl"


def get_pid_file(project_dir: str) -> Path:
    """Get PID file path."""
    return Path(project_dir) / ".observer.pid"


def log_message(project_dir: str, message: str):
    """Log a message to the observer log file."""
    log_file = get_log_file(project_dir)
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {message}\n")


def get_observations_count(observations_file: Path) -> int:
    """Get count of observations in file."""
    if not observations_file.exists():
        return 0
    try:
        with open(observations_file, encoding="utf-8") as f:
            return sum(1 for _ in f)
    except Exception:
        return 0


def sample_observations(observations_file: Path, max_lines: int) -> Path:
    """Sample recent observations for analysis."""
    if not observations_file.exists():
        return observations_file

    # Read last N lines
    try:
        with open(observations_file, encoding="utf-8") as f:
            lines = f.readlines()

        if len(lines) <= max_lines:
            return observations_file

        # Create temp file with sampled lines
        fd, temp_path = tempfile.mkstemp(
            prefix="ecc-observer-analysis.",
            suffix=".jsonl",
            dir=str(observations_file.parent)
        )
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                f.writelines(lines[-max_lines:])
            return Path(temp_path)
        except Exception:
            os.unlink(temp_path)
            return observations_file
    except Exception:
        return observations_file


def check_session_guardian(project_dir: str) -> bool:
    """Run session-guardian checks."""
    guardian_script = Path(__file__).parent.parent / "agents" / "session-guardian.sh"
    if not guardian_script.exists():
        # Try Python version if shell script not available
        return True

    try:
        result = subprocess.run(
            ["bash", str(guardian_script)],
            capture_output=True,
            timeout=30
        )
        return result.returncode == 0
    except Exception:
        return True  # Allow through if guardian fails


def analyze_observations(project: dict) -> bool:
    """Analyze observations and create instincts."""
    global analyzing

    project_dir = project["project_dir"]
    observations_file = get_observations_file(project_dir)

    if not observations_file.exists():
        return False

    obs_count = get_observations_count(observations_file)
    if obs_count < MIN_OBSERVATIONS:
        return False

    log_message(project_dir, f"Analyzing {obs_count} observations for project {project['name']}...")

    # Check for Windows
    is_windows = sys.platform == "win32"
    allow_windows = os.environ.get("ECC_OBSERVER_ALLOW_WINDOWS", "").lower() == "true"

    if is_windows and not allow_windows:
        log_message(project_dir, "Skipping claude analysis on Windows due to known non-interactive hang issue (#295). Set ECC_OBSERVER_ALLOW_WINDOWS=true to override.")
        return False

    # Check for claude CLI
    claude_cmd = None
    for cmd in ["claude", "claude.exe"]:
        try:
            result = subprocess.run([cmd, "--version"], capture_output=True, timeout=5)
            if result.returncode == 0:
                claude_cmd = cmd
                break
        except Exception:
            continue

    if not claude_cmd:
        log_message(project_dir, "claude CLI not found, skipping analysis")
        return False

    # Check session guardian
    if not check_session_guardian(project_dir):
        log_message(project_dir, "Observer cycle skipped by session-guardian")
        return False

    # Sample observations
    analysis_file = sample_observations(observations_file, MAX_ANALYSIS_LINES)
    analysis_count = get_observations_count(analysis_file)
    log_message(project_dir, f"Using last {analysis_count} of {obs_count} observations for analysis")

    # Create prompt
    instincts_dir = Path(project_dir) / "instincts" / "personal"
    prompt = f"""Read {analysis_file} and identify patterns for the project {project['name']} (user corrections, error resolutions, repeated workflows, tool preferences).
If you find 3+ occurrences of the same pattern, create an instinct file in {instincts_dir}/<id>.md.

CRITICAL: Every instinct file MUST use this exact format:

---
id: kebab-case-name
trigger: when <specific condition>
confidence: <0.3-0.85 based on frequency: 3-5 times=0.5, 6-10=0.7, 11+=0.85>
domain: <one of: code-style, testing, git, debugging, workflow, file-patterns>
source: session-observation
scope: project
project_id: {project['id']}
project_name: {project['name']}
---

# Title

## Action
<what to do, one clear sentence>

## Evidence
- Observed N times in session <id>
- Pattern: <description>
- Last observed: <date>

Rules:
- Be conservative, only clear patterns with 3+ observations
- Use narrow, specific triggers
- Never include actual code snippets, only describe patterns
- If a similar instinct already exists in {instincts_dir}/, update it instead of creating a duplicate
- The YAML frontmatter (between --- markers) with id field is MANDATORY
- If a pattern seems universal (not project-specific), set scope to global instead of project
- Examples of global patterns: always validate user input, prefer explicit error handling
- Examples of project patterns: use React functional components, follow Django REST framework conventions
"""

    # Write prompt to temp file
    fd, prompt_file = tempfile.mkstemp(
        prefix="ecc-observer-prompt.",
        dir=str(observations_file.parent)
    )
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(prompt)

        # Run analysis
        log_message(project_dir, f"Starting claude analysis (timeout: {TIMEOUT_SECONDS}s)")

        env = os.environ.copy()
        env["ECC_SKIP_OBSERVE"] = "1"
        env["ECC_HOOK_PROFILE"] = "minimal"

        process = subprocess.Popen(
            [claude_cmd, "--model", "haiku", "--max-turns", str(MAX_TURNS), "--print",
             "--allowedTools", "Read,Write"],
            stdin=open(prompt_file, "r", encoding="utf-8"),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            env=env
        )

        # Wait with timeout
        try:
            stdout, _ = process.communicate(timeout=TIMEOUT_SECONDS)
            exit_code = process.returncode

            # Log output
            if stdout:
                log_message(project_dir, stdout.decode("utf-8", errors="replace"))

            if exit_code != 0:
                log_message(project_dir, f"Claude analysis failed (exit {exit_code})")

        except subprocess.TimeoutExpired:
            log_message(project_dir, f"Claude analysis timed out after {TIMEOUT_SECONDS}s; terminating process")
            process.kill()
            process.wait()

        # Archive observations
        if observations_file.exists():
            archive_dir = Path(project_dir) / "observations.archive"
            archive_dir.mkdir(parents=True, exist_ok=True)
            timestamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
            archive_file = archive_dir / f"processed-{timestamp}-{os.getpid()}.jsonl"
            observations_file.rename(archive_file)
            log_message(project_dir, f"Archived observations to {archive_file}")

        return True

    finally:
        # Cleanup
        if analysis_file != observations_file and analysis_file.exists():
            analysis_file.unlink()
        if Path(prompt_file).exists():
            Path(prompt_file).unlink()


def prune_pending_instincts(project_dir: str):
    """Prune expired pending instincts."""
    try:
        script_dir = Path(__file__).parent
        result = subprocess.run(
            [sys.executable, str(script_dir / "instinct-cli.py"), "prune", "--quiet"],
            capture_output=True,
            timeout=60
        )
        if result.returncode != 0:
            log_message(project_dir, f"Warning: instinct prune failed (non-fatal)")
    except Exception as e:
        log_message(project_dir, f"Warning: instinct prune failed: {e}")


def signal_handler(signum, frame):
    """Handle USR1 signal for immediate analysis."""
    global usr1_fired
    usr1_fired = True


def cleanup(project_dir: str):
    """Cleanup on exit."""
    pid_file = get_pid_file(project_dir)
    try:
        if pid_file.exists():
            with open(pid_file, encoding="utf-8") as f:
                stored_pid = f.read().strip()
            if stored_pid == str(os.getpid()):
                pid_file.unlink()
    except Exception:
        pass


def main():
    """Main observer loop."""
    global analyzing, last_analysis_time, usr1_fired, should_exit

    # Detect project
    project = detect_project()
    project_dir = project["project_dir"]

    # Setup PID file
    pid_file = get_pid_file(project_dir)
    pid_file.write_text(str(os.getpid()), encoding="utf-8")

    log_message(project_dir, f"Observer started for {project['name']} (PID: {os.getpid()})")

    # Prune pending instincts
    prune_pending_instincts(project_dir)

    # Setup signal handlers (Unix only)
    if hasattr(signal, 'SIGUSR1'):
        signal.signal(signal.SIGUSR1, signal_handler)

    try:
        while not should_exit:
            # Check if analysis was triggered
            if usr1_fired:
                usr1_fired = False

                # Re-entrancy guard
                if analyzing:
                    log_message(project_dir, "Analysis already in progress, skipping signal")
                    continue

                # Cooldown check
                now = time.time()
                elapsed = now - last_analysis_time
                if elapsed < ANALYSIS_COOLDOWN:
                    log_message(project_dir, f"Analysis cooldown active ({int(elapsed)}s < {ANALYSIS_COOLDOWN}s), skipping")
                    continue

                analyzing = True
                analyze_observations(project)
                last_analysis_time = time.time()
                analyzing = False
            else:
                # Regular interval analysis
                analyzing = True
                analyze_observations(project)
                last_analysis_time = time.time()
                analyzing = False

            # Sleep with interrupt handling
            for _ in range(OBSERVER_INTERVAL_SECONDS):
                if usr1_fired or should_exit:
                    break
                time.sleep(1)

    except KeyboardInterrupt:
        log_message(project_dir, "Observer stopped by user")
    finally:
        cleanup(project_dir)


if __name__ == "__main__":
    main()
