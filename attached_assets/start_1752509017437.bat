@echo off
chcp 65001 >nul
cls

echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    🎙️ BẢNG ĐIỀU KHIỂN ELEVENLABS v2.0.0                    ║
echo ║                        Hệ thống AI Voice Generation                         ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

echo [INFO] Đang khởi động ứng dụng...
echo [INFO] Kiểm tra Node.js...

node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] ❌ Node.js chưa được cài đặt!
    echo [INFO] Vui lòng tải và cài đặt Node.js từ: https://nodejs.org
    pause
    exit /b 1
)

echo [SUCCESS] ✅ Node.js đã được cài đặt
echo [INFO] Kiểm tra dependencies...

if not exist "node_modules" (
    echo [INFO] 📦 Đang cài đặt dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] ❌ Lỗi cài đặt dependencies!
        pause
        exit /b 1
    )
) else (
    echo [SUCCESS] ✅ Dependencies đã được cài đặt
)

echo.
echo [INFO] 🚀 Đang khởi động server development...
echo [INFO] ⏳ Vui lòng đợi trong giây lát...
echo.

start "" "http://localhost:3000"

echo [SUCCESS] ✅ Ứng dụng đang chạy tại: http://localhost:3000
echo [INFO] 🌐 Trình duyệt sẽ tự động mở sau 5 giây...
echo [INFO] 🛑 Nhấn Ctrl+C để dừng server
echo.

call npm run dev

pause
