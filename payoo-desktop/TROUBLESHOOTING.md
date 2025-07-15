# 🔧 Troubleshooting - Payoo Desktop Build

## 🚨 Lỗi thường gặp và cách khắc phục

### 1. Python không được cài đặt
```
❌ Error: 'python' is not recognized as an internal or external command
```

**Giải pháp:**
```bash
# Tải Python từ https://python.org/downloads
# Chọn "Add Python to PATH" khi cài đặt
# Restart Command Prompt
python --version
```

### 2. Module không tìm thấy
```
❌ Error: ModuleNotFoundError: No module named 'customtkinter'
```

**Giải pháp:**
```bash
# Cài đặt tất cả dependencies
pip install -r requirements.txt

# Hoặc cài đặt từng cái
pip install customtkinter CTkMessagebox requests cryptography pandas openpyxl
```

### 3. PyInstaller không tìm thấy
```
❌ Error: No module named 'PyInstaller'
```

**Giải pháp:**
```bash
pip install pyinstaller
```

### 4. Lỗi quyền truy cập
```
❌ Error: [Errno 13] Permission denied
```

**Giải pháp:**
```bash
# Chạy Command Prompt as Administrator
# Hoặc thay đổi quyền thư mục
icacls "C:\path\to\payoo-desktop" /grant Users:F
```

### 5. Build thành công nhưng exe không chạy
```
❌ Exe file được tạo nhưng không chạy hoặc tắt ngay
```

**Giải pháp:**
```bash
# Build với console để debug
pyinstaller --onefile --console main.py

# Chạy để xem lỗi cụ thể
dist/PayooDesktop.exe

# Hoặc chạy với Python trực tiếp
python main.py
```

### 6. Lỗi SSL/TLS
```
❌ Error: SSL: CERTIFICATE_VERIFY_FAILED
```

**Giải pháp:**
```bash
# Cập nhật certificates
pip install --upgrade certifi

# Hoặc tắt SSL verification (chỉ dùng cho development)
python -m pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements.txt
```

### 7. Antivirus block file
```
❌ Windows Defender hoặc antivirus khác block file exe
```

**Giải pháp:**
```bash
# Thêm exception cho thư mục build
# Windows Defender > Virus & threat protection > Exclusions
# Thêm thư mục: C:\path\to\payoo-desktop\dist
```

### 8. Lỗi UPX compression
```
❌ Error: UPX is not available
```

**Giải pháp:**
```bash
# Tải UPX từ https://upx.github.io/
# Giải nén và thêm vào PATH
# Hoặc build không dùng UPX
pyinstaller --onefile --noupx main.py
```

### 9. Lỗi import circular
```
❌ Error: ImportError: cannot import name 'X' from partially initialized module
```

**Giải pháp:**
```bash
# Kiểm tra và sửa circular imports trong code
# Hoặc thêm __init__.py vào các thư mục module
```

### 10. Lỗi memory/disk space
```
❌ Error: [Errno 28] No space left on device
```

**Giải pháp:**
```bash
# Xóa thư mục build/dist cũ
rmdir /s build dist

# Giải phóng disk space
# Đảm bảo có ít nhất 1GB trống
```

## 🧪 Debug workflow

### Bước 1: Kiểm tra cơ bản
```bash
python --version
pip --version
python -c "import sys; print(sys.path)"
```

### Bước 2: Test imports
```bash
python TEST_APP.py
```

### Bước 3: Test main script
```bash
python main.py
```

### Bước 4: Build với debug
```bash
pyinstaller --onefile --console --debug=all main.py
```

### Bước 5: Check logs
```bash
# Xem log file được tạo
type build\PayooDesktop\warn-PayooDesktop.txt
```

## 📝 Các file log quan trọng

- `build/PayooDesktop/warn-PayooDesktop.txt` - Warnings
- `build/PayooDesktop/xref-PayooDesktop.html` - Cross references
- `PayooDesktop.spec` - PyInstaller spec file

## 🔍 Kiểm tra hệ thống

### Check Python environment
```bash
python -c "import sys; print('\n'.join(sys.path))"
python -c "import site; print(site.getsitepackages())"
```

### Check installed packages
```bash
pip list
pip show customtkinter
pip show PyInstaller
```

### Check file permissions
```bash
icacls main.py
icacls src\
```

## 🛠️ Tools hỗ trợ debug

### Auto-py-to-exe (GUI version)
```bash
pip install auto-py-to-exe
auto-py-to-exe
```

### PyInstaller Analysis
```bash
pyi-analysis_toc PayooDesktop.spec
```

### Dependency Walker
- Tải từ: http://www.dependencywalker.com/
- Mở file exe để xem dependencies

## 🆘 Khi tất cả đều thất bại

1. **Chạy trên máy khác** - Test trên máy Windows khác
2. **Sử dụng Docker** - Build trong container
3. **Virtual Machine** - Test trên VM clean
4. **Online builders** - Sử dụng GitHub Actions
5. **Liên hệ support** - dev@payoo.vn

## 📞 Thông tin hỗ trợ

### Khi báo lỗi, bao gồm:
- Windows version
- Python version
- PyInstaller version
- Full error message
- Steps to reproduce
- File structure screenshot

### Channels hỗ trợ:
- **Email**: dev@payoo.vn
- **GitHub**: Issues tab
- **Discord**: #payoo-support
- **Telegram**: @payoo_support

### Log files cần gửi:
- `build/PayooDesktop/warn-PayooDesktop.txt`
- `payoo.spec`
- Console output
- Screenshot of error

---

*Cập nhật: 2025-07-15*
*Version: 2.0.0*