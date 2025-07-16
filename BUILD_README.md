# 🚀 PAYOO BUILD SYSTEM

## 📋 Tổng Quan

Hệ thống build tự động cho dự án Payoo, hỗ trợ build cả **Python Desktop App** và **Web Application** với các script tiện ích.

## 📁 Cấu Trúc Build System

```
├── BUILD_ALL.bat              # Script build tổng hợp (Windows)
├── build_all.sh               # Script build tổng hợp (Linux/macOS)
├── CHECK_SYSTEM.bat           # Kiểm tra hệ thống (Windows)
├── check_system.sh            # Kiểm tra hệ thống (Linux/macOS)
├── HƯỚNG_DẪN_BUILD_TOÀN_DIỆN.md  # Hướng dẫn chi tiết
├── BUILD_README.md            # File này
└── payoo-desktop/
    ├── BUILD-SIMPLE.bat       # Build Python app đơn giản
    ├── build.py               # Build Python app nâng cao
    ├── create_installer.py    # Tạo installer
    └── TEST_APP.py            # Test app trước build
```

## 🏃 Quick Start

### Windows
```cmd
# Kiểm tra hệ thống
CHECK_SYSTEM.bat

# Build tất cả
BUILD_ALL.bat
```

### Linux/macOS
```bash
# Cấp quyền thực thi
chmod +x *.sh

# Kiểم tra hệ thống
./check_system.sh

# Build tất cả
./build_all.sh
```

## 🔧 Build Options

### 1. Build Python Desktop App
**Output**: File `.exe` (Windows) hoặc executable (Linux/macOS)

**Windows**:
```cmd
cd payoo-desktop
BUILD-SIMPLE.bat
```

**Linux/macOS**:
```bash
cd payoo-desktop
python3 build.py
```

### 2. Build Web Application
**Output**: Static files + Server

```bash
npm install
npm run build
npm start
```

### 3. Build Electron Desktop App
**Output**: Desktop app từ web

```bash
npm install
npm install electron electron-builder --save-dev
npm run build
npx electron-builder
```

## 🧪 Testing

### Kiểm Tra Hệ Thống
```bash
# Windows
CHECK_SYSTEM.bat

# Linux/macOS
./check_system.sh
```

### Test Python App
```bash
cd payoo-desktop
python TEST_APP.py
```

## 📦 Output Files

### Python Desktop App
- `payoo-desktop/dist/PayooDesktop.exe` - Executable chính
- `payoo-desktop/dist/install.bat` - Installer script
- `payoo-desktop/dist/README.md` - Hướng dẫn

### Web Application
- `dist/index.js` - Server file
- `dist/public/` - Static files
- `package.json` - Dependencies

### Electron App
- `dist-electron/` - Electron packages
- `dist-electron/Payoo Desktop Setup.exe` - Installer
- `dist-electron/win-unpacked/` - Portable files

## 🛠️ Customization

### Thay Đổi Build Config

**Python App** (`payoo-desktop/build.py`):
```python
# Thay đổi tên app
"--name=PayooDesktop"

# Thay đổi icon
"--icon=assets/icon.ico"

# Thêm hidden imports
"--hidden-import=module_name"
```

**Web App** (`package.json`):
```json
{
  "scripts": {
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
  }
}
```

**Electron App** (`package.json`):
```json
{
  "build": {
    "appId": "com.payoo.desktop",
    "productName": "Payoo Desktop",
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**❌ Python not found**
- Cài đặt Python từ https://python.org/downloads
- Chọn "Add Python to PATH"

**❌ Node.js not found**
- Cài đặt Node.js từ https://nodejs.org
- Khuyến nghị version 18+

**❌ Build failed**
- Chạy `CHECK_SYSTEM.bat` để kiểm tra
- Cài đặt đầy đủ dependencies
- Kiểm tra logs để tìm lỗi cụ thể

**❌ Dependencies missing**
```bash
# Python
pip install -r payoo-desktop/requirements.txt

# Node.js
npm install
```

### Debug Mode

**Python App**:
```bash
# Build với console để debug
pyinstaller --onefile --console main.py
```

**Web App**:
```bash
# Development mode
npm run dev

# Build với debug
npm run build -- --debug
```

## 📊 Performance Tips

### Giảm Kích Thước Python App
```bash
# Sử dụng UPX compression
pip install upx
pyinstaller --upx-dir=path/to/upx main.py

# Loại bỏ modules không cần
pyinstaller --exclude-module=matplotlib main.py
```

### Tối Ưu Web App
```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/public

# Minify build
npm run build -- --minify
```

## 🚀 Deployment

### Python Desktop App
1. **Standalone**: Copy `.exe` file
2. **Installer**: Chạy `install.bat`
3. **MSI**: Sử dụng WiX Toolset

### Web Application
1. **Static**: Upload `dist/public/` lên CDN
2. **Server**: Deploy `dist/index.js` lên server
3. **Docker**: Build container image
4. **Cloud**: Deploy lên Vercel/Netlify

### CI/CD Integration

**GitHub Actions**:
```yaml
name: Build All
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Build All
        run: ./build_all.sh
```

## 📝 Scripts Reference

### BUILD_ALL.bat / build_all.sh
Script chính để build tất cả packages

**Options**:
1. Build Python Desktop App
2. Build Web Application
3. Build Electron Desktop App
4. Build All (Full Package)

### CHECK_SYSTEM.bat / check_system.sh
Kiểm tra hệ thống trước khi build

**Checks**:
- Python/Node.js installation
- Source code completeness
- Dependencies availability
- System requirements
- Internet connection

### payoo-desktop/BUILD-SIMPLE.bat
Build Python app đơn giản với PyInstaller

**Features**:
- Tự động cài đặt dependencies
- Build với cấu hình tối ưu
- Tạo installer script
- Test app sau khi build

### payoo-desktop/build.py
Build Python app nâng cao với nhiều options

**Features**:
- Kiểm tra version Python
- Tạo spec file tùy chỉnh
- Tối ưu kích thước
- Tạo distribution package

## 🔄 Build Flow

```
1. CHECK_SYSTEM → Kiểm tra hệ thống
2. BUILD_ALL → Chọn build option
3. Dependencies → Cài đặt packages
4. Build → Tạo executables
5. Test → Kiểm tra output
6. Package → Tạo distribution
```

## 📞 Support

- **Email**: dev@payoo.vn
- **Documentation**: `HƯỚNG_DẪN_BUILD_TOÀN_DIỆN.md`
- **Issues**: GitHub Issues
- **Wiki**: Project Wiki

---

*Cập nhật: 16/07/2025*  
*Build System Version: 1.0.0*