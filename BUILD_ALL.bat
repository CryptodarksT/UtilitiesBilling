@echo off
echo ========================================
echo    PAYOO - BUILD SCRIPT TỔNG HỢP
echo ========================================
echo.

REM Kiểm tra yêu cầu hệ thống
echo 🔍 Kiểm tra yêu cầu hệ thống...

REM Kiểm tra Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python không được cài đặt!
    echo 📥 Tải Python tại: https://python.org/downloads
    set PYTHON_OK=false
) else (
    echo ✅ Python đã cài đặt
    python --version
    set PYTHON_OK=true
)

REM Kiểm tra Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js không được cài đặt!
    echo 📥 Tải Node.js tại: https://nodejs.org
    set NODE_OK=false
) else (
    echo ✅ Node.js đã cài đặt
    node --version
    set NODE_OK=true
)

echo.
echo ========================================
echo        LỰA CHỌN BUILD
echo ========================================
echo.
echo 1. Build Python Desktop App (.exe)
echo 2. Build Web Application
echo 3. Build Electron Desktop App
echo 4. Build All (Full Package)
echo 5. Thoát
echo.
set /p choice="Nhập lựa chọn (1-5): "

if "%choice%"=="1" goto build_python
if "%choice%"=="2" goto build_web
if "%choice%"=="3" goto build_electron
if "%choice%"=="4" goto build_all
if "%choice%"=="5" goto exit
goto invalid_choice

:build_python
echo.
echo ========================================
echo    BUILD PYTHON DESKTOP APP
echo ========================================
if "%PYTHON_OK%"=="false" (
    echo ❌ Python chưa cài đặt!
    goto exit
)

if not exist "payoo-desktop\main.py" (
    echo ❌ Không tìm thấy payoo-desktop\main.py
    goto exit
)

echo 🚀 Bắt đầu build Python Desktop App...
cd payoo-desktop
call BUILD-SIMPLE.bat
cd ..
echo ✅ Build Python Desktop App hoàn thành!
goto success

:build_web
echo.
echo ========================================
echo       BUILD WEB APPLICATION
echo ========================================
if "%NODE_OK%"=="false" (
    echo ❌ Node.js chưa cài đặt!
    goto exit
)

if not exist "package.json" (
    echo ❌ Không tìm thấy package.json
    goto exit
)

echo 🚀 Bắt đầu build Web Application...
echo 📦 Cài đặt dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Lỗi cài đặt dependencies
    goto exit
)

echo 🔨 Build production...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Lỗi build
    goto exit
)

echo ✅ Build Web Application hoàn thành!
echo 📁 Files tại: dist/
goto success

:build_electron
echo.
echo ========================================
echo    BUILD ELECTRON DESKTOP APP
echo ========================================
if "%NODE_OK%"=="false" (
    echo ❌ Node.js chưa cài đặt!
    goto exit
)

echo 🚀 Bắt đầu build Electron Desktop App...
echo 📦 Cài đặt dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Lỗi cài đặt dependencies
    goto exit
)

echo 📦 Cài đặt Electron...
npm install electron electron-builder --save-dev
if %errorlevel% neq 0 (
    echo ❌ Lỗi cài đặt Electron
    goto exit
)

echo 🔨 Build web app...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Lỗi build web app
    goto exit
)

REM Tạo electron-main.js nếu chưa có
if not exist "electron-main.js" (
    echo 📝 Tạo electron-main.js...
    call :create_electron_main
)

echo 🔨 Build Electron app...
npx electron-builder --win
if %errorlevel% neq 0 (
    echo ❌ Lỗi build Electron
    goto exit
)

echo ✅ Build Electron Desktop App hoàn thành!
echo 📁 Files tại: dist-electron/
goto success

:build_all
echo.
echo ========================================
echo         BUILD ALL PACKAGES
echo ========================================
echo 🚀 Bắt đầu build tất cả packages...

REM Build Python Desktop App
if "%PYTHON_OK%"=="true" (
    echo.
    echo 🐍 Building Python Desktop App...
    cd payoo-desktop
    call BUILD-SIMPLE.bat
    cd ..
    if %errorlevel% neq 0 (
        echo ❌ Lỗi build Python app
        goto exit
    )
    echo ✅ Python Desktop App hoàn thành!
)

REM Build Web Application
if "%NODE_OK%"=="true" (
    echo.
    echo 🌐 Building Web Application...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Lỗi cài đặt dependencies
        goto exit
    )
    
    npm run build
    if %errorlevel% neq 0 (
        echo ❌ Lỗi build web app
        goto exit
    )
    echo ✅ Web Application hoàn thành!
)

echo.
echo ========================================
echo        BUILD ALL HOÀN THÀNH!
echo ========================================
echo.
echo 📦 Packages đã được tạo:
if "%PYTHON_OK%"=="true" (
    echo    - payoo-desktop\dist\PayooDesktop.exe
)
if "%NODE_OK%"=="true" (
    echo    - dist\index.js (Web server)
    echo    - dist\public\ (Static files)
)
goto success

:create_electron_main
echo const { app, BrowserWindow } = require('electron'); > electron-main.js
echo const path = require('path'); >> electron-main.js
echo. >> electron-main.js
echo function createWindow() { >> electron-main.js
echo     const mainWindow = new BrowserWindow({ >> electron-main.js
echo         width: 1200, >> electron-main.js
echo         height: 800, >> electron-main.js
echo         webPreferences: { >> electron-main.js
echo             nodeIntegration: true, >> electron-main.js
echo             contextIsolation: false >> electron-main.js
echo         } >> electron-main.js
echo     }); >> electron-main.js
echo. >> electron-main.js
echo     mainWindow.loadURL('http://localhost:5000'); >> electron-main.js
echo } >> electron-main.js
echo. >> electron-main.js
echo app.whenReady().then(createWindow); >> electron-main.js
echo. >> electron-main.js
echo app.on('window-all-closed', () =^> { >> electron-main.js
echo     if (process.platform !== 'darwin') { >> electron-main.js
echo         app.quit(); >> electron-main.js
echo     } >> electron-main.js
echo }); >> electron-main.js
exit /b

:success
echo.
echo ========================================
echo           THÀNH CÔNG!
echo ========================================
echo.
echo 🎉 Build hoàn thành thành công!
echo 📖 Xem chi tiết tại: HƯỚNG_DẪN_BUILD_TOÀN_DIỆN.md
echo 📧 Hỗ trợ: dev@payoo.vn
echo.
pause
exit /b 0

:invalid_choice
echo ❌ Lựa chọn không hợp lệ!
pause
exit /b 1

:exit
echo.
echo 👋 Thoát script build
pause
exit /b 0