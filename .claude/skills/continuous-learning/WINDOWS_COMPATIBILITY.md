# Continuous Learning - Windows Compatibility Notes

This directory contains cross-platform scripts for the Continuous Learning system.

## Windows Compatibility Status

| Script | Unix (Shell) | Windows (Python/Batch) | Status |
|--------|--------------|------------------------|--------|
| `detect-project.sh` | ✅ Available | ✅ `detect-project.py` | Cross-platform |
| `observer-loop.sh` | ✅ Available | ✅ `observer-loop.py` | Cross-platform |
| `start-observer.sh` | ✅ Available | ✅ `start-observer.bat` | Cross-platform wrapper |
| `instinct-cli.py` | ✅ Available | ✅ Native Python | Already cross-platform |

## Usage

### Unix/Linux/macOS
```bash
# Detect project
source .claude/skills/continuous-learning/scripts/detect-project.sh

# Start observer
bash .claude/skills/continuous-learning/agents/start-observer.sh
```

### Windows
```cmd
:: Detect project (prints env vars)
python .claude\skills\continuous-learning\scripts\detect-project.py --export

:: Start observer
.claude\skills\continuous-learning\agents\start-observer.bat

:: Or directly with Python
python .claude\skills\continuous-learning\agents\observer-loop.py
```

## Implementation Notes

### detect-project.py
- Equivalent to `detect-project.sh`
- Detects project context from git or environment variables
- Updates project registry
- Creates necessary directory structure
- Supports `--export` flag to print environment variables

### observer-loop.py
- Equivalent to `observer-loop.sh`
- Cross-platform signal handling (SIGUSR1 on Unix)
- File-based triggering for Windows
- Same cooldown and re-entrancy guards
- Same analysis and archiving logic

### start-observer.bat
- Wrapper script for Windows
- Calls Python observer-loop.py
- Handles Ctrl+C gracefully

## Known Limitations

1. **Signal Handling**: Windows doesn't support SIGUSR1. Use file-based triggers instead.
2. **File Locking**: The Python scripts use cross-platform file locking where possible.
3. **Observer on Windows**: By default, observer analysis is skipped on Windows due to known hang issues. Set `ECC_OBSERVER_ALLOW_WINDOWS=true` to override.

## Migration Guide

If you previously used shell scripts on Windows (via WSL/Git Bash):

1. Switch to Python scripts for better Windows native support
2. Update any automation to call `.bat` files instead of `.sh`
3. Environment variables work the same way

## Dependencies

- Python 3.7+
- Standard library only (no external dependencies)
