# 🚀 Hướng dẫn Build nhanh - Payoo Desktop

## 📋 Cách 1: Build tự động (Đơn giản nhất)

### Windows
```bash
# Chạy file batch tự động
BUILD-SIMPLE.bat
```

### Linux/Mac
```bash
# Chạy script build Python
python build.py
```

## 🧪 Cách 2: Kiểm tra trước khi build

```bash
# Test ứng dụng trước
python TEST_APP.py

# Nếu pass hết test, chạy build
python build.py
```

## 🎯 Cách 3: Build thủ công từng bước

### Bước 1: Chuẩn bị
```bash
# Cài đặt dependencies
pip install -r requirements.txt

# Cài đặt PyInstaller
pip install pyinstaller
```

### Bước 2: Build
```bash
pyinstaller --onefile --windowed --name=PayooDesktop ^
    --add-data=src;src ^
    --add-data=assets;assets ^
    --hidden-import=customtkinter ^
    --hidden-import=CTkMessagebox ^
    --icon=assets/icon.ico ^
    main.py
```

### Bước 3: Kiểm tra
```bash
# File sẽ được tạo tại:
dist/PayooDesktop.exe

# Test chạy
cd dist
PayooDesktop.exe
```

## 📦 Tạo installer

```bash
# Sau khi build xong
python create_installer.py

# Sẽ tạo file: PayooDesktop_Installer.zip
```

## 🔧 Khắc phục lỗi thường gặp

### Lỗi "Python not found"
```bash
# Cài đặt Python từ: https://python.org/downloads
# Chọn "Add Python to PATH"
```

### Lỗi "Module not found"
```bash
pip install -r requirements.txt
```

### Lỗi "Permission denied"
```bash
# Chạy Command Prompt as Administrator
```

### Build thành công nhưng exe không chạy
```bash
# Build với console để debug
pyinstaller --onefile --console main.py

# Chạy để xem lỗi
dist/PayooDesktop.exe
```

## 📊 Thông tin build

- **Output**: `dist/PayooDesktop.exe`
- **Size**: ~50-100MB
- **Time**: 3-5 phút
- **Requirements**: Windows 10+, Python 3.8+

## 🎉 Hoàn thành

Sau khi build thành công:
1. File exe tại: `dist/PayooDesktop.exe`
2. Test chạy trực tiếp
3. Tạo installer: `python create_installer.py`
4. Chia sẻ file: `PayooDesktop_Installer.zip`

## 📞 Hỗ trợ

- Email: dev@payoo.vn
- Issues: GitHub Issues
- Docs: BUILD_STEP_BY_STEP.md