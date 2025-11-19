# Start both backend and frontend servers

Write-Host "🚀 Starting HandyGo Development Environment..." -ForegroundColor Green

# Kill any existing Node processes
Write-Host "Cleaning up old processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start backend
Write-Host "Starting backend on port 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend'; npm run dev" -WorkingDirectory $PSScriptRoot

# Wait for backend to initialize
Start-Sleep -Seconds 4

# Start frontend
Write-Host "Starting frontend on port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'frontend'; npm run dev" -WorkingDirectory $PSScriptRoot

Start-Sleep -Seconds 3

Write-Host "`n✅ Both servers are running!" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:3000" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "`n📝 Press Ctrl+C in each terminal window to stop a server" -ForegroundColor Yellow
