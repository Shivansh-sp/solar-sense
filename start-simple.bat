@echo off
echo.
echo 🚀 SolarSense AI - Starting Complete Application
echo.

REM Start backend in a new window
echo Starting Backend Server...
start "SolarSense Backend" cmd /k "cd backend && npm start"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

REM Start frontend in a new window  
echo Starting Frontend Server...
start "SolarSense Frontend" cmd /k "cd frontend && npm run dev"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

echo.
echo ✅ Both servers are starting...
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo Press any key to exit this window (servers will keep running)
pause >nul
