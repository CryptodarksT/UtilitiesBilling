@echo off
echo ========================================
echo     PAYOO - KIỂM TRA HỆ THỐNG
echo ========================================
echo.

set ERRORS=0
set WARNINGS=0

echo 🔍 Kiểm tra yêu cầu hệ thống...
echo.

REM ======================================
REM KIỂM TRA PYTHON
REM ======================================
echo [1/8] Kiểm tra Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python không được cài đặt
    echo    📥 Tải tại: https://python.org/downloads
    echo    💡 Chọn "Add Python to PATH" khi cài đặt
    set /a ERRORS+=1
) else (
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
    echo ✅ Python %PYTHON_VERSION% đã cài đặt
    
    REM Kiểm tra pip
    pip --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ⚠️  pip không có sẵn
        set /a WARNINGS+=1
    ) else (
        echo ✅ pip đã cài đặt
    )
)

REM ======================================
REM KIỂM TRA NODE.JS
REM ======================================
echo [2/8] Kiểm tra Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js không được cài đặt
    echo    📥 Tải tại: https://nodejs.org
    echo    💡 Khuyến nghị version 18+
    set /a ERRORS+=1
) else (
    for /f "tokens=1" %%i in ('node --version 2^>^&1') do set NODE_VERSION=%%i
    echo ✅ Node.js %NODE_VERSION% đã cài đặt
    
    REM Kiểm tra npm
    npm --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ⚠️  npm không có sẵn
        set /a WARNINGS+=1
    ) else (
        echo ✅ npm đã cài đặt
    )
)

REM ======================================
REM KIỂM TRA FILES DỰ ÁN
REM ======================================
echo [3/8] Kiểm tra files dự án...

if exist "payoo-desktop\main.py" (
    echo ✅ Python Desktop App source code
) else (
    echo ❌ Không tìm thấy payoo-desktop\main.py
    set /a ERRORS+=1
)

if exist "payoo-desktop\requirements.txt" (
    echo ✅ Python requirements.txt
) else (
    echo ❌ Không tìm thấy payoo-desktop\requirements.txt
    set /a ERRORS+=1
)

if exist "package.json" (
    echo ✅ Web App package.json
) else (
    echo ❌ Không tìm thấy package.json
    set /a ERRORS+=1
)

if exist "client\src" (
    echo ✅ Frontend source code
) else (
    echo ❌ Không tìm thấy client\src
    set /a ERRORS+=1
)

if exist "server\index.ts" (
    echo ✅ Backend source code
) else (
    echo ❌ Không tìm thấy server\index.ts
    set /a ERRORS+=1
)

REM ======================================
REM KIỂM TRA PYTHON DEPENDENCIES
REM ======================================
echo [4/8] Kiểm tra Python dependencies...

if exist "payoo-desktop\requirements.txt" (
    python -c "import customtkinter" >nul 2>&1
    if %errorlevel% neq 0 (
        echo ⚠️  customtkinter chưa cài đặt
        set /a WARNINGS+=1
    ) else (
        echo ✅ customtkinter
    )
    
    python -c "import requests" >nul 2>&1
    if %errorlevel% neq 0 (
        echo ⚠️  requests chưa cài đặt
        set /a WARNINGS+=1
    ) else (
        echo ✅ requests
    )
    
    python -c "import pandas" >nul 2>&1
    if %errorlevel% neq 0 (
        echo ⚠️  pandas chưa cài đặt
        set /a WARNINGS+=1
    ) else (
        echo ✅ pandas
    )
    
    python -c "import openpyxl" >nul 2>&1
    if %errorlevel% neq 0 (
        echo ⚠️  openpyxl chưa cài đặt
        set /a WARNINGS+=1
    ) else (
        echo ✅ openpyxl
    )
) else (
    echo ❌ Không thể kiểm tra Python dependencies
)

REM ======================================
REM KIỂM TRA NODE.JS DEPENDENCIES
REM ======================================
echo [5/8] Kiểm tra Node.js dependencies...

if exist "node_modules" (
    echo ✅ node_modules đã cài đặt
) else (
    echo ⚠️  node_modules chưa cài đặt
    echo    💡 Chạy: npm install
    set /a WARNINGS+=1
)

if exist "node_modules\react" (
    echo ✅ React
) else (
    echo ⚠️  React chưa cài đặt
    set /a WARNINGS+=1
)

if exist "node_modules\express" (
    echo ✅ Express
) else (
    echo ⚠️  Express chưa cài đặt
    set /a WARNINGS+=1
)

if exist "node_modules\typescript" (
    echo ✅ TypeScript
) else (
    echo ⚠️  TypeScript chưa cài đặt
    set /a WARNINGS+=1
)

REM ======================================
REM KIỂM TRA DUNG LƯỢNG
REM ======================================
echo [6/8] Kiểm tra dung lượng...

for /f "tokens=3" %%i in ('dir /-c %SystemDrive%\ 2^>nul ^| find "bytes free"') do set FREE_BYTES=%%i
set /a FREE_MB=%FREE_BYTES% / 1024 / 1024
if %FREE_MB% LSS 2000 (
    echo ⚠️  Dung lượng trống: %FREE_MB%MB (khuyến nghị: 2000MB+)
    set /a WARNINGS+=1
) else (
    echo ✅ Dung lượng trống: %FREE_MB%MB
)

REM ======================================
REM KIỂM TRA MEMORY
REM ======================================
echo [7/8] Kiểm tra RAM...

for /f "skip=1" %%i in ('wmic computersystem get TotalPhysicalMemory') do (
    set /a TOTAL_RAM=%%i / 1024 / 1024
    goto :got_ram
)
:got_ram
if %TOTAL_RAM% LSS 4000 (
    echo ⚠️  RAM: %TOTAL_RAM%MB (khuyến nghị: 4000MB+)
    set /a WARNINGS+=1
) else (
    echo ✅ RAM: %TOTAL_RAM%MB
)

REM ======================================
REM KIỂM TRA INTERNET
REM ======================================
echo [8/8] Kiểm tra kết nối internet...

ping -n 1 google.com >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Không có kết nối internet
    echo    💡 Cần internet để tải dependencies
    set /a WARNINGS+=1
) else (
    echo ✅ Kết nối internet OK
)

REM ======================================
REM KẾT QUẢ TỔNG HỢP
REM ======================================
echo.
echo ========================================
echo            KẾT QUẢ KIỂM TRA
echo ========================================
echo.

if %ERRORS% equ 0 (
    if %WARNINGS% equ 0 (
        echo 🎉 HỆ THỐNG HOÀN TOÀN SẴN SÀNG!
        echo ✅ Tất cả yêu cầu đã đáp ứng
        echo 🚀 Bạn có thể bắt đầu build ngay
        echo.
        echo Để build, chạy:
        echo    BUILD_ALL.bat
    ) else (
        echo 🟡 HỆ THỐNG CÓ THỂ BUILD ĐƯỢC
        echo ✅ Không có lỗi nghiêm trọng
        echo ⚠️  Có %WARNINGS% cảnh báo
        echo 💡 Khuyến nghị khắc phục cảnh báo trước
        echo.
        echo Để build, chạy:
        echo    BUILD_ALL.bat
    )
) else (
    echo 🔴 HỆ THỐNG CHƯA SẴN SÀNG
    echo ❌ Có %ERRORS% lỗi cần khắc phục
    echo ⚠️  Có %WARNINGS% cảnh báo
    echo 💡 Khắc phục tất cả lỗi trước khi build
    echo.
    echo Cần khắc phục:
    if %ERRORS% gtr 0 (
        echo    - Cài đặt Python và/hoặc Node.js
        echo    - Đảm bảo source code đầy đủ
        echo    - Cài đặt dependencies
    )
)

echo.
echo ========================================
echo               HƯỚNG DẪN
echo ========================================
echo.
echo 📖 Hướng dẫn chi tiết: HƯỚNG_DẪN_BUILD_TOÀN_DIỆN.md
echo 🔧 Build script: BUILD_ALL.bat
echo 📧 Hỗ trợ: dev@payoo.vn
echo.
echo Để cài đặt Python dependencies:
echo    cd payoo-desktop
echo    pip install -r requirements.txt
echo.
echo Để cài đặt Node.js dependencies:
echo    npm install
echo.
pause