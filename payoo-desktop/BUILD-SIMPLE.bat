@echo off
echo ========================================
echo      PAYOO DESKTOP BUILD SCRIPT
echo ========================================
echo.

REM Check Python installation
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python không được cài đặt!
    echo 📥 Tải Python tại: https://python.org/downloads
    echo 💡 Nhớ chọn "Add Python to PATH" khi cài đặt
    pause
    exit /b 1
)

echo ✅ Python đã cài đặt
python --version

REM Check if in correct directory
if not exist "main.py" (
    echo ❌ Không tìm thấy main.py
    echo 📁 Đảm bảo bạn đang ở thư mục payoo-desktop
    pause
    exit /b 1
)

echo ✅ Source code đã sẵn sàng

REM Create virtual environment if not exists
if not exist "venv" (
    echo 🔧 Tạo virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ❌ Không thể tạo virtual environment
        pause
        exit /b 1
    )
)

echo 🔧 Kích hoạt virtual environment...
call venv\Scripts\activate

REM Install dependencies
echo 📦 Cài đặt dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Không thể cài đặt dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies đã cài đặt

REM Install PyInstaller
echo 📦 Cài đặt PyInstaller...
pip install pyinstaller
if %errorlevel% neq 0 (
    echo ❌ Không thể cài đặt PyInstaller
    pause
    exit /b 1
)

echo ✅ PyInstaller đã cài đặt

REM Clean previous builds
echo 🧹 Dọn dẹp build cũ...
if exist "build" rmdir /s /q "build"
if exist "dist" rmdir /s /q "dist"
if exist "*.spec" del "*.spec"

echo 🔨 Bắt đầu build executable...
echo ⏳ Quá trình này có thể mất 3-5 phút...
echo.

REM Build with PyInstaller
pyinstaller --onefile --windowed --name=PayooDesktop ^
    --distpath=dist ^
    --workpath=build ^
    --specpath=. ^
    --add-data=src;src ^
    --add-data=assets;assets ^
    --hidden-import=customtkinter ^
    --hidden-import=CTkMessagebox ^
    --hidden-import=requests ^
    --hidden-import=cryptography ^
    --hidden-import=pandas ^
    --hidden-import=openpyxl ^
    --hidden-import=matplotlib ^
    --hidden-import=numpy ^
    --hidden-import=PIL ^
    --hidden-import=tkinter ^
    --hidden-import=tkinter.ttk ^
    --hidden-import=tkinter.filedialog ^
    --hidden-import=tkinter.messagebox ^
    --hidden-import=json ^
    --hidden-import=threading ^
    --hidden-import=datetime ^
    --hidden-import=webbrowser ^
    --collect-all=customtkinter ^
    --collect-all=CTkMessagebox ^
    --noconsole ^
    --icon=assets/icon.ico ^
    main.py

if %errorlevel% neq 0 (
    echo ❌ Build thất bại!
    echo 🔍 Kiểm tra lỗi ở trên để khắc phục
    pause
    exit /b 1
)

echo.
echo ========================================
echo             BUILD THÀNH CÔNG!
echo ========================================
echo.
echo 📁 File executable: dist\PayooDesktop.exe
echo 📊 Kích thước: 
for %%I in (dist\PayooDesktop.exe) do echo    %%~zI bytes

echo.
echo 🧪 Test chạy ứng dụng...
cd dist
start PayooDesktop.exe
cd ..

echo.
echo ✅ Hoàn thành! Ứng dụng đã được build thành công
echo 📋 Các file được tạo:
echo    - dist\PayooDesktop.exe (executable chính)
echo    - build\ (thư mục tạm, có thể xóa)
echo    - PayooDesktop.spec (file cấu hình PyInstaller)
echo.
echo 💡 Để tạo installer, chạy: python create_installer.py
echo 📧 Hỗ trợ: dev@payoo.vn
echo.
pause