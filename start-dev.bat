@echo off
REM Tomato Disease Classifier - Local Development Startup (Windows)

echo.
echo Tomato Disease Classifier - Local Development
echo ==================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed. Please install Python 3.9+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do echo Python found: %%i
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
pip install -q -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing dependencies
    pause
    exit /b 1
)
cd ..
echo Dependencies installed successfully
echo.

REM Start backend
echo Starting backend server on http://localhost:8000
cd backend
start cmd /k "uvicorn app:app --reload"
cd ..
timeout /t 3 /nobreak

REM Test backend
echo Testing backend...
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo Backend is responding
) else (
    echo Backend is starting up...
)

echo.
echo Frontend information:
echo   Navigate to: http://localhost:5000
echo   To serve frontend, run in another terminal:
echo   cd frontend ^& python -m http.server 5000
echo.
echo API Documentation: http://localhost:8000/docs
echo.
echo Close the command window above to stop the backend.
echo.
pause
