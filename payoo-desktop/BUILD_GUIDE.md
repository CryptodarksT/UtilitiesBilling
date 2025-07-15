# Build Guide - Payoo Desktop

## 🛠️ Development Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Git (optional, for version control)

### 1. Clone Repository
```bash
git clone https://github.com/payoo-vn/payoo-desktop.git
cd payoo-desktop
```

### 2. Install Dependencies
```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Run Development Version
```bash
python main.py
```

## 📦 Building Executable

### Method 1: Using build.py (Recommended)
```bash
# Run automated build script
python build.py

# Output files will be in dist/ directory
```

### Method 2: Manual PyInstaller
```bash
# Install PyInstaller
pip install pyinstaller

# Build executable
pyinstaller --onefile --windowed --name PayooDesktop main.py

# Add dependencies
pyinstaller --onefile --windowed --name PayooDesktop \
  --add-data "src;src" \
  --add-data "assets;assets" \
  --hidden-import customtkinter \
  --hidden-import CTkMessagebox \
  main.py
```

## 🎯 Build Options

### Debug Build
```bash
# Build with console window (for debugging)
pyinstaller --onefile --console --name PayooDesktop-Debug main.py
```

### Optimized Build
```bash
# Build with UPX compression
pyinstaller --onefile --windowed --upx-dir /path/to/upx --name PayooDesktop main.py
```

### Build with Icon
```bash
# Build with custom icon
pyinstaller --onefile --windowed --icon=assets/icon.ico --name PayooDesktop main.py
```

## 📋 Build Requirements

### System Requirements
- **OS**: Windows 10+, macOS 10.15+, Linux Ubuntu 18.04+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Python**: 3.8-3.11 (3.12 not fully tested)

### Python Dependencies
```
customtkinter>=5.2.0
CTkMessagebox>=2.5
requests>=2.31.0
cryptography>=41.0.0
pandas>=2.0.0
openpyxl>=3.1.0
Pillow>=10.0.0
```

### Build Dependencies
```
pyinstaller>=5.13.0
auto-py-to-exe>=2.40.0 (optional GUI)
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Missing Module Errors
```bash
# Solution: Add hidden imports
pyinstaller --hidden-import module_name main.py
```

#### 2. File Not Found Errors
```bash
# Solution: Add data files
pyinstaller --add-data "src;src" main.py
```

#### 3. Large Executable Size
```bash
# Solution: Use UPX compression
pyinstaller --upx-dir /path/to/upx main.py
```

#### 4. Antivirus False Positives
- Add exclusion for build directory
- Use code signing certificate
- Submit to antivirus vendors

### Platform-Specific Issues

#### Windows
- Use `--noconsole` instead of `--windowed`
- Add `--uac-admin` for elevated permissions
- Use `--version-file` for version info

#### macOS
- Use `--osx-bundle-identifier` for app ID
- Add `--codesign-identity` for signing
- Use `--create-dmg` for distribution

#### Linux
- Install system dependencies: `sudo apt-get install python3-tk`
- Use `--strip` for smaller binaries
- Add desktop file for integration

## 🚀 Distribution

### Creating Installer

#### Windows (NSIS)
```bash
# Install NSIS
# Create installer script
makensis installer.nsi
```

#### macOS (DMG)
```bash
# Create DMG
hdiutil create -size 200m -srcfolder dist/ -format UDZO PayooDesktop.dmg
```

#### Linux (AppImage)
```bash
# Create AppImage
wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage
./appimagetool-x86_64.AppImage PayooDesktop.AppDir
```

### Code Signing

#### Windows
```bash
# Sign executable
signtool sign /f certificate.pfx /p password /t http://timestamp.url PayooDesktop.exe
```

#### macOS
```bash
# Sign app
codesign --deep --force --verify --verbose --sign "Developer ID Application: Company Name" PayooDesktop.app
```

## 📊 Build Optimization

### Size Optimization
- Use `--strip` flag
- Remove unused imports
- Compress with UPX
- Use `--exclude-module` for unused modules

### Performance Optimization
- Use `--onefile` for single executable
- Enable `--optimize` flag
- Use `--noupx` if UPX causes issues

### Security Hardening
- Enable code signing
- Use `--key` for encryption
- Add integrity checks
- Implement auto-update mechanism

## 🧪 Testing

### Pre-Release Testing
```bash
# Run tests
python -m pytest tests/

# Test executable
dist/PayooDesktop.exe --version
```

### Cross-Platform Testing
- Test on Windows 10/11
- Test on macOS 10.15+
- Test on Ubuntu 18.04+
- Test with different Python versions

## 📝 Release Process

1. **Version Bump**: Update version in `__init__.py`
2. **Changelog**: Update `CHANGELOG.md`
3. **Build**: Run `python build.py`
4. **Test**: Test executable thoroughly
5. **Sign**: Code sign the executable
6. **Package**: Create installer/package
7. **Upload**: Upload to distribution channels
8. **Tag**: Create git tag for release

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
name: Build
on: [push, pull_request]
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Build executable
        run: python build.py
      - name: Upload artifact
        uses: actions/upload-artifact@v2
        with:
          name: PayooDesktop
          path: dist/
```

## 📞 Support

If you encounter issues during the build process:

1. Check the troubleshooting section
2. Search existing issues on GitHub
3. Create a new issue with:
   - Operating system and version
   - Python version
   - Error messages
   - Build command used
   - Dependencies installed

For urgent build issues, contact: dev@payoo.vn