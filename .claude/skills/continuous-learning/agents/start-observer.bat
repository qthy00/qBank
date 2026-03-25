@echo off
REM Continuous Learning - Observer start script for Windows
REM This is a wrapper that calls the Python version

cd /d "%~dp0"
python "%~dp0\observer-loop.py" %*
