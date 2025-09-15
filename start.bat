@echo off
REM SolarSense AI - Complete Application Startup Script (Windows Batch)
REM Handles both frontend and backend startup

echo.
echo 🚀 SolarSense AI - Complete Application Startup
echo ℹ️  Starting both frontend and backend servers...
echo.

REM Check if we're in the right directory
if not exist "frontend" (
    echo ❌ Frontend directory not found!
    echo ❌ Please run this script from the SolarSense project root directory.
    pause
    exit /b 1
)

if not exist "backend" (
    echo ❌ Backend directory not found!
    echo ❌ Please run this script from the SolarSense project root directory.
    pause
    exit /b 1
)

REM Check if package.json files exist
if not exist "frontend\package.json" (
    echo ❌ Frontend package.json not found!
    pause
    exit /b 1
)

if not exist "backend\package.json" (
    echo ❌ Backend package.json not found!
    pause
    exit /b 1
)

echo ✅ Environment validation passed

REM Start backend in a new window
echo ℹ️  Starting Backend Server...
start "SolarSense Backend" cmd /k "cd backend && npm start"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend in a new window
echo ℹ️  Starting Frontend Server...
start "SolarSense Frontend" cmd /k "cd frontend && npm run dev"

REM Wait for frontend to start
timeout /t 5 /nobreak >nul

REM Application is ready
echo.
echo 🚀 Application Ready!
echo ✅ Backend: http://localhost:5000
echo ✅ Frontend: http://localhost:3000
echo ℹ️  Both servers are running in separate windows
echo ℹ️  Close this window to continue, or press any key to exit
echo.

pause
