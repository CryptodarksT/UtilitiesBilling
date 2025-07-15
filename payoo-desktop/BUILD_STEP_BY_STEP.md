# Hướng dẫn Build Payoo Desktop từng bước

## 🔧 Bước 1: Chuẩn bị môi trường

### 1.1 Kiểm tra Python
```bash
python --version
# Cần Python 3.8 trở lên
```

### 1.2 Cài đặt Python (nếu chưa có)
- Tải Python từ: https://python.org/downloads
- Chọn "Add Python to PATH" khi cài đặt
- Restart Command Prompt sau khi cài đặt

### 1.3 Kiểm tra pip
```bash
pip --version
```

## 🛠️ Bước 2: Chuẩn bị source code

### 2.1 Download source code
- Tải toàn bộ thư mục `payoo-desktop`
- Đảm bảo có đầy đủ các file:
  - `main.py`
  - `requirements.txt`
  - `build.py`
  - Thư mục `src/`
  - Thư mục `assets/`

### 2.2 Kiểm tra cấu trúc thư mục
```
payoo-desktop/
├── main.py
├── requirements.txt
├── build.py
├── src/
│   ├── api/
│   ├── gui/
│   └── utils/
└── assets/
    └── icon.ico
```

## 📦 Bước 3: Cài đặt dependencies

### 3.1 Tạo virtual environment (khuyến nghị)
```bash
cd payoo-desktop
python -m venv venv
```

### 3.2 Kích hoạt virtual environment
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3.3 Cài đặt dependencies
```bash
pip install -r requirements.txt
```

### 3.4 Cài đặt PyInstaller
```bash
pip install pyinstaller
```

## 🚀 Bước 4: Build executable

### 4.1 Chạy script build tự động
```bash
python build.py
```

### 4.2 Hoặc build thủ công
```bash
pyinstaller --onefile --windowed --name=PayooDesktop ^
    --add-data=src;src ^
    --add-data=assets;assets ^
    --hidden-import=customtkinter ^
    --hidden-import=CTkMessagebox ^
    --hidden-import=requests ^
    --hidden-import=cryptography ^
    --hidden-import=pandas ^
    --hidden-import=openpyxl ^
    --icon=assets/icon.ico ^
    main.py
```

## 🎯 Bước 5: Kiểm tra kết quả

### 5.1 Tìm file executable
```bash
# File sẽ được tạo tại:
dist/PayooDesktop.exe
```

### 5.2 Test chạy ứng dụng
```bash
cd dist
PayooDesktop.exe
```

## 🔍 Bước 6: Khắc phục lỗi thường gặp

### 6.1 Lỗi "Module not found"
```bash
# Thêm hidden import
pyinstaller --hidden-import=module_name main.py
```

### 6.2 Lỗi "File not found"
```bash
# Thêm data files
pyinstaller --add-data=path/to/file;path/to/file main.py
```

### 6.3 Lỗi "DLL load failed"
```bash
# Cài đặt lại dependencies
pip uninstall customtkinter
pip install customtkinter
```

### 6.4 Ứng dụng chạy chậm
```bash
# Build với console để debug
pyinstaller --onefile --console main.py
```

## 📋 Bước 7: Tối ưu hóa

### 7.1 Giảm kích thước file
```bash
# Sử dụng UPX compression
pip install upx-ucl
pyinstaller --onefile --upx-dir=path/to/upx main.py
```

### 7.2 Loại bỏ modules không cần thiết
```bash
pyinstaller --exclude-module=matplotlib --exclude-module=numpy main.py
```

### 7.3 Tối ưu imports
- Chỉ import những module thực sự cần thiết
- Sử dụng `from module import specific_function`

## 🛡️ Bước 8: Tạo installer

### 8.1 Sử dụng NSIS (Windows)
```bash
# Tạo file installer.nsi
makensis installer.nsi
```

### 8.2 Sử dụng Inno Setup
- Tải Inno Setup từ: https://jrsoftware.org/isinfo.php
- Tạo script setup với GUI wizard

## 🔄 Bước 9: Automation build

### 9.1 Tạo batch script
```batch
@echo off
echo Building Payoo Desktop...
python build.py
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo Build successful!
pause
```

### 9.2 Tạo PowerShell script
```powershell
Write-Host "Building Payoo Desktop..." -ForegroundColor Green
python build.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Build successful!" -ForegroundColor Green
Read-Host "Press Enter to exit"
```

## 📝 Bước 10: Checklist cuối cùng

- [ ] Python 3.8+ đã cài đặt
- [ ] Tất cả dependencies đã cài đặt
- [ ] Source code đầy đủ
- [ ] Build thành công
- [ ] File .exe chạy được
- [ ] Tất cả tính năng hoạt động
- [ ] Không có lỗi runtime
- [ ] Kích thước file hợp lý
- [ ] Icon hiển thị đúng
- [ ] Ứng dụng ổn định

## 🆘 Hỗ trợ

### Nếu gặp vấn đề:
1. Kiểm tra Python version
2. Kiểm tra dependencies
3. Xem log build để tìm lỗi
4. Thử build với console mode
5. Kiểm tra antivirus có block không

### Liên hệ:
- Email: dev@payoo.vn
- Issue tracker: GitHub Issues
- Documentation: docs.payoo.vn

## 📊 Thống kê build

- **Python files**: 19
- **Total files**: 27
- **Build time**: ~3-5 phút
- **Output size**: ~50-100MB
- **Supported OS**: Windows 10+