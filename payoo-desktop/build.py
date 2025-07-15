#!/usr/bin/env python3
"""
Build script để tạo file executable cho Payoo Desktop
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path

def main():
    """Hàm chính để build ứng dụng"""
    print("🚀 Bắt đầu build Payoo Desktop...")
    
    # Kiểm tra Python version
    if sys.version_info < (3, 8):
        print("❌ Cần Python 3.8 trở lên")
        return False
    
    # Cài đặt dependencies
    print("📦 Cài đặt dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        print("✅ Đã cài đặt dependencies")
    except subprocess.CalledProcessError:
        print("❌ Lỗi cài đặt dependencies")
        return False
    
    # Tạo thư mục build
    build_dir = Path("build")
    dist_dir = Path("dist")
    
    if build_dir.exists():
        shutil.rmtree(build_dir)
    if dist_dir.exists():
        shutil.rmtree(dist_dir)
    
    print("🔨 Tạo executable với PyInstaller...")
    
    # Tạo file spec cho PyInstaller
    spec_content = '''
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('src', 'src'),
        ('assets', 'assets'),
    ],
    hiddenimports=[
        'customtkinter',
        'CTkMessagebox',
        'requests',
        'cryptography',
        'pandas',
        'openpyxl',
        'matplotlib',
        'numpy',
        'PIL',
        'tkinter',
        'tkinter.ttk',
        'tkinter.filedialog',
        'tkinter.messagebox'
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='PayooDesktop',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='assets/icon.ico' if os.path.exists('assets/icon.ico') else None,
)
'''
    
    # Ghi file spec
    with open("payoo.spec", "w", encoding="utf-8") as f:
        f.write(spec_content)
    
    # Chạy PyInstaller
    try:
        subprocess.run([
            sys.executable, "-m", "PyInstaller", 
            "--onefile", 
            "--windowed",
            "--name=PayooDesktop",
            "--icon=assets/icon.ico" if os.path.exists("assets/icon.ico") else "",
            "--add-data=src;src",
            "--add-data=assets;assets",
            "--hidden-import=customtkinter",
            "--hidden-import=CTkMessagebox",
            "--hidden-import=requests",
            "--hidden-import=cryptography",
            "--hidden-import=pandas",
            "--hidden-import=openpyxl",
            "main.py"
        ], check=True)
        print("✅ Đã tạo executable thành công")
    except subprocess.CalledProcessError as e:
        print(f"❌ Lỗi tạo executable: {e}")
        return False
    
    # Tạo installer (optional)
    print("📄 Tạo installer...")
    create_installer_script()
    
    # Tạo file README cho distribution
    create_distribution_readme()
    
    print("🎉 Build hoàn thành!")
    print(f"📁 File executable: {dist_dir / 'PayooDesktop.exe'}")
    
    return True

def create_installer_script():
    """Tạo script installer cho Windows"""
    installer_script = '''
@echo off
echo Installing Payoo Desktop...

REM Tạo thư mục cài đặt
if not exist "%PROGRAMFILES%\\PayooDesktop" (
    mkdir "%PROGRAMFILES%\\PayooDesktop"
)

REM Copy file executable
copy "PayooDesktop.exe" "%PROGRAMFILES%\\PayooDesktop\\"

REM Tạo shortcut trên Desktop
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\\CreateShortcut.vbs"
echo sLinkFile = "%USERPROFILE%\\Desktop\\Payoo Desktop.lnk" >> "%TEMP%\\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\\CreateShortcut.vbs"
echo oLink.TargetPath = "%PROGRAMFILES%\\PayooDesktop\\PayooDesktop.exe" >> "%TEMP%\\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%PROGRAMFILES%\\PayooDesktop" >> "%TEMP%\\CreateShortcut.vbs"
echo oLink.Description = "Payoo Desktop - Hệ thống thanh toán hóa đơn" >> "%TEMP%\\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\\CreateShortcut.vbs"

cscript /nologo "%TEMP%\\CreateShortcut.vbs"
del "%TEMP%\\CreateShortcut.vbs"

REM Tạo shortcut trong Start Menu
if not exist "%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Payoo Desktop" (
    mkdir "%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Payoo Desktop"
)

echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\\CreateShortcut2.vbs"
echo sLinkFile = "%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Payoo Desktop\\Payoo Desktop.lnk" >> "%TEMP%\\CreateShortcut2.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\\CreateShortcut2.vbs"
echo oLink.TargetPath = "%PROGRAMFILES%\\PayooDesktop\\PayooDesktop.exe" >> "%TEMP%\\CreateShortcut2.vbs"
echo oLink.WorkingDirectory = "%PROGRAMFILES%\\PayooDesktop" >> "%TEMP%\\CreateShortcut2.vbs"
echo oLink.Description = "Payoo Desktop - Hệ thống thanh toán hóa đơn" >> "%TEMP%\\CreateShortcut2.vbs"
echo oLink.Save >> "%TEMP%\\CreateShortcut2.vbs"

cscript /nologo "%TEMP%\\CreateShortcut2.vbs"
del "%TEMP%\\CreateShortcut2.vbs"

echo Cài đặt hoàn thành!
echo Bạn có thể chạy Payoo Desktop từ Desktop hoặc Start Menu
pause
'''
    
    with open("dist/install.bat", "w", encoding="utf-8") as f:
        f.write(installer_script)
    
    print("✅ Đã tạo installer script")

def create_distribution_readme():
    """Tạo file README cho distribution"""
    readme_content = '''# Payoo Desktop

## Hệ thống thanh toán hóa đơn tiện ích

### Tính năng chính:
- ✅ Tra cứu hóa đơn điện, nước, internet, TV
- ✅ Thanh toán qua MoMo, BIDV, ZaloPay, Visa
- ✅ Xử lý hàng loạt qua file Excel
- ✅ Quản lý lịch sử giao dịch
- ✅ Theo dõi trạng thái API real-time
- ✅ Giao diện thân thiện, dễ sử dụng

### Cài đặt:
1. Chạy file `install.bat` với quyền Administrator
2. Hoặc copy `PayooDesktop.exe` vào thư mục mong muốn

### Yêu cầu hệ thống:
- Windows 10/11
- RAM: 4GB+
- Dung lượng: 200MB+
- Kết nối internet

### Hướng dẫn sử dụng:
1. Mở ứng dụng Payoo Desktop
2. Vào tab "Quản trị" để cấu hình API
3. Nhập thông tin API từ các nhà cung cấp
4. Bắt đầu sử dụng các tính năng

### Hỗ trợ:
- Email: support@payoo.vn
- Hotline: 1900 1234
- Website: https://payoo.vn

### Phiên bản: 2.0.0
### Ngày phát hành: 2025-07-15
'''
    
    with open("dist/README.md", "w", encoding="utf-8") as f:
        f.write(readme_content)
    
    print("✅ Đã tạo README file")

if __name__ == "__main__":
    if main():
        print("\n🎯 Build thành công!")
        print("📁 Kiểm tra thư mục 'dist' để lấy file executable")
        print("🚀 Chạy 'install.bat' để cài đặt ứng dụng")
    else:
        print("\n❌ Build thất bại!")
        sys.exit(1)