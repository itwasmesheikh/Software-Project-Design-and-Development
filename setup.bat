@echo off
SETLOCAL

echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing backend dependencies
    exit /b %ERRORLEVEL%
)

echo Building backend...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error building backend
    exit /b %ERRORLEVEL%
)

cd ..

echo Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing frontend dependencies
    exit /b %ERRORLEVEL%
)

echo Building frontend...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error building frontend
    exit /b %ERRORLEVEL%
)

cd ..

echo Setup completed successfully!
echo To start the development servers:
echo   1. Open a terminal and run: cd backend ^&^& npm run dev
echo   2. Open another terminal and run: cd frontend ^&^& npm run dev