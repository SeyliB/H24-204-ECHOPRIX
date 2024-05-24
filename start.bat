@echo off

rem Check if the virtual environment directory exists
if not exist ".venv" (
    echo Virtual environment not found. Creating a new one...
    python -m venv .venv
)

rem Activate the virtual environment
echo Activating virtual environment...
call .\.venv\Scripts\activate

rem Install dependencies from requirements.txt
if exist "requirements.txt" (
    echo Installing dependencies...
    pip install -r requirements.txt
) else (
    echo requirements.txt not found.
)

rem Indicate that the process is complete
echo Installation and setup complete.
