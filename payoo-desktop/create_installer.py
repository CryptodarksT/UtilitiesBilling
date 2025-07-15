#!/usr/bin/env python3
"""
Script tạo installer cho Payoo Desktop
"""

import os
import sys
import shutil
import zipfile
from pathlib import Path

def create_installer():
    """Tạo installer package"""
    print("📦 Tạo installer cho Payoo Desktop...")
    
    # Kiểm tra file executable
    exe_path = Path("dist/PayooDesktop.exe")
    if not exe_path.exists():
        print("❌ Không tìm thấy PayooDesktop.exe")
        print("💡 Chạy build.py hoặc BUILD-SIMPLE.bat trước")
        return False
    
    # Tạo thư mục installer
    installer_dir = Path("installer")
    if installer_dir.exists():
        shutil.rmtree(installer_dir)
    installer_dir.mkdir()
    
    # Copy executable
    shutil.copy2(exe_path, installer_dir / "PayooDesktop.exe")
    
    # Tạo file README
    readme_content = """
# Payoo Desktop - Hệ thống thanh toán hóa đơn

## Cài đặt

1. Copy file `PayooDesktop.exe` vào thư mục bạn muốn
2. Chạy `install.bat` với quyền Administrator
3. Hoặc chạy trực tiếp `PayooDesktop.exe`

## Tính năng

- 🔍 Tra cứu hóa đơn điện, nước, internet, TV
- 💳 Thanh toán qua MoMo, BIDV, ZaloPay, Visa
- 📊 Quản lý lịch sử giao dịch
- ⚙️ Giám sát trạng thái API
- 🔧 Quản trị hệ thống
- 🛠️ Cài đặt ứng dụng

## Hỗ trợ

- Email: support@payoo.vn
- Website: https://payoo.vn
- Docs: https://docs.payoo.vn

## Yêu cầu hệ thống

- Windows 10 trở lên
- RAM: 4GB
- Storage: 100MB trống
- Internet connection
"""
    
    with open(installer_dir / "README.txt", "w", encoding="utf-8") as f:
        f.write(readme_content)
    
    # Tạo install script
    install_script = """@echo off
echo Installing Payoo Desktop...
echo.

REM Check admin rights
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Cần quyền Administrator để cài đặt
    echo 💡 Chạy lại với "Run as Administrator"
    pause
    exit /b 1
)

REM Create installation directory
set INSTALL_DIR=%PROGRAMFILES%\\PayooDesktop
if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
)

REM Copy executable
echo 📁 Copying files...
copy "PayooDesktop.exe" "%INSTALL_DIR%\\" >nul
if %errorlevel% neq 0 (
    echo ❌ Không thể copy file
    pause
    exit /b 1
)

REM Create desktop shortcut
echo 🖥️ Creating desktop shortcut...
set DESKTOP=%USERPROFILE%\\Desktop
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\\CreateShortcut.vbs"
echo sLinkFile = "%DESKTOP%\\Payoo Desktop.lnk" >> "%TEMP%\\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\\CreateShortcut.vbs"
echo oLink.TargetPath = "%INSTALL_DIR%\\PayooDesktop.exe" >> "%TEMP%\\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%INSTALL_DIR%" >> "%TEMP%\\CreateShortcut.vbs"
echo oLink.Description = "Payoo Desktop - Hệ thống thanh toán hóa đơn" >> "%TEMP%\\CreateShortcut.vbs"
echo oLink.IconLocation = "%INSTALL_DIR%\\PayooDesktop.exe,0" >> "%TEMP%\\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\\CreateShortcut.vbs"

cscript /nologo "%TEMP%\\CreateShortcut.vbs" >nul
del "%TEMP%\\CreateShortcut.vbs"

REM Create start menu shortcut
echo 📋 Creating start menu shortcut...
set STARTMENU=%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs
if not exist "%STARTMENU%\\Payoo Desktop" (
    mkdir "%STARTMENU%\\Payoo Desktop"
)

echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\\CreateStartMenu.vbs"
echo sLinkFile = "%STARTMENU%\\Payoo Desktop\\Payoo Desktop.lnk" >> "%TEMP%\\CreateStartMenu.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\\CreateStartMenu.vbs"
echo oLink.TargetPath = "%INSTALL_DIR%\\PayooDesktop.exe" >> "%TEMP%\\CreateStartMenu.vbs"
echo oLink.WorkingDirectory = "%INSTALL_DIR%" >> "%TEMP%\\CreateStartMenu.vbs"
echo oLink.Description = "Payoo Desktop - Hệ thống thanh toán hóa đơn" >> "%TEMP%\\CreateStartMenu.vbs"
echo oLink.IconLocation = "%INSTALL_DIR%\\PayooDesktop.exe,0" >> "%TEMP%\\CreateStartMenu.vbs"
echo oLink.Save >> "%TEMP%\\CreateStartMenu.vbs"

cscript /nologo "%TEMP%\\CreateStartMenu.vbs" >nul
del "%TEMP%\\CreateStartMenu.vbs"

REM Add to Add/Remove Programs
echo 📝 Registering application...
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\PayooDesktop" /v "DisplayName" /t REG_SZ /d "Payoo Desktop" /f >nul
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\PayooDesktop" /v "UninstallString" /t REG_SZ /d "%INSTALL_DIR%\\uninstall.bat" /f >nul
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\PayooDesktop" /v "DisplayIcon" /t REG_SZ /d "%INSTALL_DIR%\\PayooDesktop.exe" /f >nul
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\PayooDesktop" /v "DisplayVersion" /t REG_SZ /d "2.0.0" /f >nul
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\PayooDesktop" /v "Publisher" /t REG_SZ /d "Payoo Vietnam" /f >nul

REM Create uninstaller
echo 🗑️ Creating uninstaller...
echo @echo off > "%INSTALL_DIR%\\uninstall.bat"
echo echo Uninstalling Payoo Desktop... >> "%INSTALL_DIR%\\uninstall.bat"
echo del "%DESKTOP%\\Payoo Desktop.lnk" 2^>nul >> "%INSTALL_DIR%\\uninstall.bat"
echo rmdir /s /q "%STARTMENU%\\Payoo Desktop" 2^>nul >> "%INSTALL_DIR%\\uninstall.bat"
echo reg delete "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\PayooDesktop" /f 2^>nul >> "%INSTALL_DIR%\\uninstall.bat"
echo rmdir /s /q "%INSTALL_DIR%" >> "%INSTALL_DIR%\\uninstall.bat"
echo echo Payoo Desktop has been uninstalled. >> "%INSTALL_DIR%\\uninstall.bat"
echo pause >> "%INSTALL_DIR%\\uninstall.bat"

echo.
echo ========================================
echo          INSTALLATION COMPLETE!
echo ========================================
echo.
echo ✅ Payoo Desktop đã được cài đặt thành công
echo 📁 Thư mục cài đặt: %INSTALL_DIR%
echo 🖥️ Shortcut trên Desktop: Payoo Desktop
echo 📋 Start Menu: Payoo Desktop
echo.
echo 🚀 Chạy ứng dụng từ Desktop hoặc Start Menu
echo 🗑️ Gỡ cài đặt: Control Panel > Programs > Payoo Desktop
echo.
pause
"""
    
    with open(installer_dir / "install.bat", "w", encoding="utf-8") as f:
        f.write(install_script)
    
    # Tạo portable launcher
    portable_script = """@echo off
echo Starting Payoo Desktop (Portable)...
echo.

REM Check if executable exists
if not exist "PayooDesktop.exe" (
    echo ❌ Không tìm thấy PayooDesktop.exe
    echo 📁 Đảm bảo file nằm trong cùng thư mục
    pause
    exit /b 1
)

REM Create temp directory for user data
set TEMP_DIR=%TEMP%\\PayooDesktop
if not exist "%TEMP_DIR%" (
    mkdir "%TEMP_DIR%"
)

REM Set environment variables
set PAYOO_PORTABLE=1
set PAYOO_DATA_DIR=%TEMP_DIR%

REM Run application
echo 🚀 Starting Payoo Desktop...
start "" PayooDesktop.exe

echo ✅ Payoo Desktop đã được khởi chạy (Portable mode)
echo 📁 Data directory: %TEMP_DIR%
echo.
echo 💡 Portable mode: Dữ liệu sẽ được lưu trong thư mục tạm
echo 📋 Để cài đặt vĩnh viễn, chạy install.bat với quyền Admin
echo.
timeout /t 3 /nobreak >nul
"""
    
    with open(installer_dir / "portable.bat", "w", encoding="utf-8") as f:
        f.write(portable_script)
    
    # Tạo ZIP package
    zip_path = Path("PayooDesktop_Installer.zip")
    if zip_path.exists():
        zip_path.unlink()
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_path in installer_dir.rglob('*'):
            if file_path.is_file():
                arcname = file_path.relative_to(installer_dir)
                zipf.write(file_path, arcname)
    
    # Tạo thông tin package
    package_info = f"""
📦 PAYOO DESKTOP INSTALLER PACKAGE
==================================

✅ Đã tạo thành công:
📁 {installer_dir}/ - Thư mục installer
📦 {zip_path} - Package ZIP

📋 Nội dung package:
- PayooDesktop.exe (executable chính)
- install.bat (installer với quyền Admin)
- portable.bat (chạy portable mode)
- README.txt (hướng dẫn)

🚀 Cách sử dụng:
1. Giải nén {zip_path}
2. Chạy install.bat (Administrator) để cài đặt
3. Hoặc chạy portable.bat để dùng portable mode
4. Hoặc chạy trực tiếp PayooDesktop.exe

📊 Thông tin:
- Kích thước: {exe_path.stat().st_size / 1024 / 1024:.1f} MB
- Version: 2.0.0
- Platform: Windows 10+
- Build date: {exe_path.stat().st_mtime}

💡 Lưu ý:
- Installer cần quyền Administrator
- Portable mode không cần cài đặt
- Dữ liệu sẽ được lưu trong %APPDATA%\\PayooDesktop

📞 Hỗ trợ:
- Email: support@payoo.vn
- Website: https://payoo.vn
- Docs: https://docs.payoo.vn
"""
    
    print(package_info)
    
    # Ghi thông tin vào file
    with open("INSTALLER_INFO.txt", "w", encoding="utf-8") as f:
        f.write(package_info)
    
    return True

if __name__ == "__main__":
    success = create_installer()
    if success:
        print("\n🎉 Installer đã được tạo thành công!")
        print("📦 Tệp cần gửi: PayooDesktop_Installer.zip")
    else:
        print("\n❌ Có lỗi xảy ra khi tạo installer")
        sys.exit(1)