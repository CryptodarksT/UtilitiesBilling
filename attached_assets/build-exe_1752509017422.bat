@echo off
chcp 65001 >nul
echo.
echo ====================================================
echo 🎙️ BẢNG ĐIỀU KHIỂN ELEVENLABS - BUILD EXE
echo ====================================================
echo.
echo ⚡ Bắt đầu build ứng dụng standalone...
echo.

REM Kiểm tra Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ KHÔNG TÌM THẤY NODE.JS!
    echo 📥 Vui lòng cài đặt Node.js từ: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js đã được cài đặt
node --version
npm --version
echo.

REM Kiểm tra node_modules
if not exist "node_modules\" (
    echo 📦 Đang cài đặt dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Lỗi khi cài đặt dependencies!
        pause
        exit /b 1
    )
    echo ✅ Cài đặt dependencies thành công
    echo.
)

REM Build ứng dụng web
echo 🔨 Đang build ứng dụng web...
npm run build
if errorlevel 1 (
    echo ❌ Lỗi khi build ứng dụng web!
    pause
    exit /b 1
)
echo ✅ Build ứng dụng web thành công
echo.

REM Build Electron EXE
echo 🔧 Đang tạo file EXE...
npm run dist-win
if errorlevel 1 (
    echo ❌ Lỗi khi tạo file EXE!
    echo 💡 Thử chạy: npm install electron electron-builder --save-dev
    pause
    exit /b 1
)

echo.
echo ====================================================
echo ✅ BUILD THÀNH CÔNG!
echo ====================================================
echo.
echo 📁 File EXE đã được tạo tại:
echo    📦 Installer: dist-electron\Bang-Dieu-Khien-ElevenLabs-Setup.exe
echo    🔧 Portable: dist-electron\win-unpacked\Bang-Dieu-Khien-ElevenLabs.exe
echo.
echo 🎯 Hướng dẫn:
echo    1. Chạy Setup.exe để cài đặt
echo    2. Hoặc chạy trực tiếp Portable.exe
echo    3. Chia sẻ file cho người khác sử dụng
echo.

REM Mở thư mục chứa file EXE
if exist "dist-electron\" (
    echo 📂 Mở thư mục chứa file EXE...
    explorer dist-electron
)

echo 🎉 Hoàn thành! Nhấn phím bất kỳ để thoát...
pause >nul
