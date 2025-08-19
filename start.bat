@echo off
title Code Guardian Security Scanner

echo 🛡️  Starting Code Guardian Security Scanner...

:: Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java is not installed. Please install Java 17 or higher.
    pause
    exit /b 1
)

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo ✅ All prerequisites are satisfied!

:: Start backend
echo Starting Spring Boot backend...
cd backend

if exist mvnw.cmd (
    start "Backend" mvnw.cmd spring-boot:run
) else (
    start "Backend" mvn spring-boot:run
)

:: Return to root directory
cd ..

:: Wait for backend to start
echo Waiting for backend to start...
timeout /t 10 /nobreak >nul

:: Start frontend
echo Setting up and starting React frontend...
cd frontend

:: Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)

:: Start frontend
start "Frontend" npm start

:: Wait for frontend to start
timeout /t 5 /nobreak >nul

echo.
echo 🎉 Code Guardian is now running!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:8080
echo 💊 Health:   http://localhost:8080/api/health
echo.
echo Press any key to open the application in your browser...
pause >nul

:: Open browser
start http://localhost:3000

echo.
echo Code Guardian is running in separate windows.
echo Close those windows to stop the services.
pause 