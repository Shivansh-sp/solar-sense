# SolarSense AI - Complete Application Startup Script (PowerShell)
# Handles both frontend and backend startup with process management

Write-Host "🚀 SolarSense AI - Complete Application Startup" -ForegroundColor Cyan
Write-Host "ℹ️  Starting both frontend and backend servers..." -ForegroundColor Blue
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "❌ Frontend or backend directory not found!" -ForegroundColor Red
    Write-Host "❌ Please run this script from the SolarSense project root directory." -ForegroundColor Red
    exit 1
}

# Check if package.json files exist
if (-not (Test-Path "frontend/package.json")) {
    Write-Host "❌ Frontend package.json not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "backend/package.json")) {
    Write-Host "❌ Backend package.json not found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Environment validation passed" -ForegroundColor Green

# Function to handle cleanup
function Stop-AllProcesses {
    Write-Host "⚠️  Shutting down gracefully..." -ForegroundColor Yellow
    
    if ($backendJob) {
        Write-Host "ℹ️  Stopping backend server..." -ForegroundColor Blue
        Stop-Job $backendJob -ErrorAction SilentlyContinue
        Remove-Job $backendJob -ErrorAction SilentlyContinue
    }
    
    if ($frontendJob) {
        Write-Host "ℹ️  Stopping frontend server..." -ForegroundColor Blue
        Stop-Job $frontendJob -ErrorAction SilentlyContinue
        Remove-Job $frontendJob -ErrorAction SilentlyContinue
    }
    
    Write-Host "✅ All servers stopped gracefully" -ForegroundColor Green
    exit 0
}

# Set up cleanup handlers
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Stop-AllProcesses }

# Start backend
Write-Host "ℹ️  Starting Backend Server..." -ForegroundColor Blue
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    npm start
}

# Wait for backend to start
$backendReady = $false
$timeout = 30
$elapsed = 0

while (-not $backendReady -and $elapsed -lt $timeout) {
    Start-Sleep -Seconds 1
    $elapsed++
    
    $backendOutput = Receive-Job $backendJob -ErrorAction SilentlyContinue
    if ($backendOutput) {
        Write-Host "[BACKEND] $backendOutput" -ForegroundColor White
        if ($backendOutput -match "SolarSense Backend running on port") {
            $backendReady = $true
            Write-Host "✅ Backend server started successfully" -ForegroundColor Green
        }
    }
}

if (-not $backendReady) {
    Write-Host "❌ Backend startup timeout" -ForegroundColor Red
    Stop-AllProcesses
}

# Wait a moment for backend to fully initialize
Start-Sleep -Seconds 2

# Start frontend
Write-Host "ℹ️  Starting Frontend Server..." -ForegroundColor Blue
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location frontend
    npm run dev
}

# Wait for frontend to start
$frontendReady = $false
$timeout = 60
$elapsed = 0

while (-not $frontendReady -and $elapsed -lt $timeout) {
    Start-Sleep -Seconds 1
    $elapsed++
    
    $frontendOutput = Receive-Job $frontendJob -ErrorAction SilentlyContinue
    if ($frontendOutput) {
        Write-Host "[FRONTEND] $frontendOutput" -ForegroundColor White
        if ($frontendOutput -match "Local:" -and $frontendOutput -match "http://localhost:3000") {
            $frontendReady = $true
            Write-Host "✅ Frontend server started successfully" -ForegroundColor Green
        }
    }
}

if (-not $frontendReady) {
    Write-Host "❌ Frontend startup timeout" -ForegroundColor Red
    Stop-AllProcesses
}

# Application is ready
Write-Host ""
Write-Host "🚀 Application Ready!" -ForegroundColor Cyan
Write-Host "✅ Backend: http://localhost:5000" -ForegroundColor Green
Write-Host "✅ Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "ℹ️  Press Ctrl+C to stop both servers" -ForegroundColor Blue
Write-Host ""

# Keep the script running and monitor jobs
try {
    while ($true) {
        Start-Sleep -Seconds 5
        
        # Check if jobs are still running
        if ($backendJob.State -eq "Failed" -or $backendJob.State -eq "Completed") {
            Write-Host "❌ Backend job failed or completed unexpectedly" -ForegroundColor Red
            Stop-AllProcesses
        }
        
        if ($frontendJob.State -eq "Failed" -or $frontendJob.State -eq "Completed") {
            Write-Host "❌ Frontend job failed or completed unexpectedly" -ForegroundColor Red
            Stop-AllProcesses
        }
        
        # Show any new output
        $backendOutput = Receive-Job $backendJob -ErrorAction SilentlyContinue
        if ($backendOutput) {
            Write-Host "[BACKEND] $backendOutput" -ForegroundColor White
        }
        
        $frontendOutput = Receive-Job $frontendJob -ErrorAction SilentlyContinue
        if ($frontendOutput) {
            Write-Host "[FRONTEND] $frontendOutput" -ForegroundColor White
        }
    }
} catch {
    Write-Host "⚠️  Script interrupted" -ForegroundColor Yellow
    Stop-AllProcesses
}
