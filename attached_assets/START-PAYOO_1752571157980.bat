@echo off
title PAYOO PAYMENT SYSTEM LAUNCHER
color 0A

echo ===============================================
echo   PAYOO PAYMENT SYSTEM - PRODUCTION LAUNCHER
echo ===============================================
echo.

echo [1/5] Checking Java Runtime Environment...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java NOT found. Installing Java 17...
    echo.
    echo Please run: winget install Microsoft.OpenJDK.17
    echo Then restart this script.
    pause
    exit /b 1
) else (
    echo ✅ Java found
)

echo.
echo [2/5] Checking Maven Build Tool...
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Maven NOT found. Installing Maven...
    echo.
    echo Please run: winget install Apache.Maven
    echo Then restart this script.
    pause
    exit /b 1
) else (
    echo ✅ Maven found
)

echo.
echo [3/5] Building Unified Payment System...
cd /d "%~dp0unified_payment_system\backend"
echo Building JAR executable...
call mvn clean package -DskipTests -q
if %errorlevel% neq 0 (
    echo ❌ Build failed. Check Maven output above.
    pause
    exit /b 1
) else (
    echo ✅ Build successful
)

echo.
echo [4/5] Starting Payment System Server...
echo.
echo 🚀 Launching Payoo Payment System...
echo 🌐 Web application will be available at: http://localhost:8080
echo.
echo ⚠️  IMPORTANT: Keep this window open while using the application
echo    Press Ctrl+C to stop the server
echo.

echo [5/5] Starting server...
java -jar target\unified-payment-system-1.0.0.jar

echo.
echo 🛑 Server stopped.
pause
