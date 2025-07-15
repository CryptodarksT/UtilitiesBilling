@echo off
echo Starting Payoo Desktop...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python not found! Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "src" (
    echo Source directory not found!
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate
    echo Installing dependencies...
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)

REM Run the application
echo Starting Payoo Desktop Application...
python main.py

if %errorlevel% neq 0 (
    echo Application exited with error code %errorlevel%
    pause
)

deactivate