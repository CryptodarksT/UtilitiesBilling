#!/bin/bash
echo "========================================"
echo "    PAYOO - BUILD SCRIPT TỔNG HỢP"
echo "========================================"
echo ""

# Kiểm tra yêu cầu hệ thống
echo "🔍 Kiểm tra yêu cầu hệ thống..."

# Kiểm tra Python
if command -v python3 &> /dev/null; then
    echo "✅ Python đã cài đặt"
    python3 --version
    PYTHON_OK=true
else
    echo "❌ Python không được cài đặt!"
    echo "📥 Cài đặt Python: sudo apt install python3 python3-pip (Ubuntu/Debian)"
    PYTHON_OK=false
fi

# Kiểm tra Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js đã cài đặt"
    node --version
    NODE_OK=true
else
    echo "❌ Node.js không được cài đặt!"
    echo "📥 Cài đặt Node.js: https://nodejs.org"
    NODE_OK=false
fi

echo ""
echo "========================================"
echo "        LỰA CHỌN BUILD"
echo "========================================"
echo ""
echo "1. Build Python Desktop App (Linux/macOS)"
echo "2. Build Web Application"
echo "3. Build Electron Desktop App"
echo "4. Build All (Full Package)"
echo "5. Thoát"
echo ""
read -p "Nhập lựa chọn (1-5): " choice

case $choice in
    1)
        echo ""
        echo "========================================"
        echo "    BUILD PYTHON DESKTOP APP"
        echo "========================================"
        if [ "$PYTHON_OK" = false ]; then
            echo "❌ Python chưa cài đặt!"
            exit 1
        fi

        if [ ! -f "payoo-desktop/main.py" ]; then
            echo "❌ Không tìm thấy payoo-desktop/main.py"
            exit 1
        fi

        echo "🚀 Bắt đầu build Python Desktop App..."
        cd payoo-desktop

        # Tạo virtual environment
        if [ ! -d "venv" ]; then
            echo "🔧 Tạo virtual environment..."
            python3 -m venv venv
        fi

        # Kích hoạt virtual environment
        source venv/bin/activate

        # Cài đặt dependencies
        echo "📦 Cài đặt dependencies..."
        pip install -r requirements.txt

        # Build với PyInstaller
        echo "🔨 Build executable..."
        pyinstaller --onefile --windowed --name=PayooDesktop \
            --distpath=dist \
            --workpath=build \
            --add-data=src:src \
            --add-data=assets:assets \
            --hidden-import=customtkinter \
            --hidden-import=CTkMessagebox \
            --hidden-import=requests \
            --hidden-import=cryptography \
            --hidden-import=pandas \
            --hidden-import=openpyxl \
            --hidden-import=matplotlib \
            --hidden-import=numpy \
            --hidden-import=PIL \
            --hidden-import=tkinter \
            --noconsole \
            main.py

        if [ $? -eq 0 ]; then
            echo "✅ Build Python Desktop App hoàn thành!"
            echo "📁 File: payoo-desktop/dist/PayooDesktop"
        else
            echo "❌ Build thất bại!"
            exit 1
        fi

        cd ..
        ;;
    2)
        echo ""
        echo "========================================"
        echo "       BUILD WEB APPLICATION"
        echo "========================================"
        if [ "$NODE_OK" = false ]; then
            echo "❌ Node.js chưa cài đặt!"
            exit 1
        fi

        if [ ! -f "package.json" ]; then
            echo "❌ Không tìm thấy package.json"
            exit 1
        fi

        echo "🚀 Bắt đầu build Web Application..."
        echo "📦 Cài đặt dependencies..."
        npm install

        if [ $? -ne 0 ]; then
            echo "❌ Lỗi cài đặt dependencies"
            exit 1
        fi

        echo "🔨 Build production..."
        npm run build

        if [ $? -eq 0 ]; then
            echo "✅ Build Web Application hoàn thành!"
            echo "📁 Files tại: dist/"
        else
            echo "❌ Lỗi build"
            exit 1
        fi
        ;;
    3)
        echo ""
        echo "========================================"
        echo "    BUILD ELECTRON DESKTOP APP"
        echo "========================================"
        if [ "$NODE_OK" = false ]; then
            echo "❌ Node.js chưa cài đặt!"
            exit 1
        fi

        echo "🚀 Bắt đầu build Electron Desktop App..."
        echo "📦 Cài đặt dependencies..."
        npm install

        echo "📦 Cài đặt Electron..."
        npm install electron electron-builder --save-dev

        echo "🔨 Build web app..."
        npm run build

        # Tạo electron-main.js nếu chưa có
        if [ ! -f "electron-main.js" ]; then
            echo "📝 Tạo electron-main.js..."
            cat > electron-main.js << 'EOF'
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL('http://localhost:5000');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
EOF
        fi

        echo "🔨 Build Electron app..."
        npx electron-builder --linux

        if [ $? -eq 0 ]; then
            echo "✅ Build Electron Desktop App hoàn thành!"
            echo "📁 Files tại: dist-electron/"
        else
            echo "❌ Lỗi build Electron"
            exit 1
        fi
        ;;
    4)
        echo ""
        echo "========================================"
        echo "         BUILD ALL PACKAGES"
        echo "========================================"
        echo "🚀 Bắt đầu build tất cả packages..."

        # Build Python Desktop App
        if [ "$PYTHON_OK" = true ]; then
            echo ""
            echo "🐍 Building Python Desktop App..."
            cd payoo-desktop
            if [ ! -d "venv" ]; then
                python3 -m venv venv
            fi
            source venv/bin/activate
            pip install -r requirements.txt
            python3 build.py
            if [ $? -eq 0 ]; then
                echo "✅ Python Desktop App hoàn thành!"
            else
                echo "❌ Lỗi build Python app"
                exit 1
            fi
            cd ..
        fi

        # Build Web Application
        if [ "$NODE_OK" = true ]; then
            echo ""
            echo "🌐 Building Web Application..."
            npm install
            npm run build
            if [ $? -eq 0 ]; then
                echo "✅ Web Application hoàn thành!"
            else
                echo "❌ Lỗi build web app"
                exit 1
            fi
        fi

        echo ""
        echo "========================================"
        echo "        BUILD ALL HOÀN THÀNH!"
        echo "========================================"
        echo ""
        echo "📦 Packages đã được tạo:"
        if [ "$PYTHON_OK" = true ]; then
            echo "    - payoo-desktop/dist/PayooDesktop"
        fi
        if [ "$NODE_OK" = true ]; then
            echo "    - dist/index.js (Web server)"
            echo "    - dist/public/ (Static files)"
        fi
        ;;
    5)
        echo ""
        echo "👋 Thoát script build"
        exit 0
        ;;
    *)
        echo "❌ Lựa chọn không hợp lệ!"
        exit 1
        ;;
esac

echo ""
echo "========================================"
echo "           THÀNH CÔNG!"
echo "========================================"
echo ""
echo "🎉 Build hoàn thành thành công!"
echo "📖 Xem chi tiết tại: HƯỚNG_DẪN_BUILD_TOÀN_DIỆN.md"
echo "📧 Hỗ trợ: dev@payoo.vn"
echo ""