#!/bin/bash

echo "========================================"
echo "     PAYOO - KIỂM TRA HỆ THỐNG"
echo "========================================"
echo ""

ERRORS=0
WARNINGS=0

echo "🔍 Kiểm tra yêu cầu hệ thống..."
echo ""

# ======================================
# KIỂM TRA PYTHON
# ======================================
echo "[1/8] Kiểm tra Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
    echo "✅ Python $PYTHON_VERSION đã cài đặt"
    
    # Kiểm tra pip
    if command -v pip3 &> /dev/null; then
        echo "✅ pip đã cài đặt"
    else
        echo "⚠️  pip không có sẵn"
        ((WARNINGS++))
    fi
else
    echo "❌ Python không được cài đặt"
    echo "    📥 Cài đặt: sudo apt install python3 python3-pip (Ubuntu/Debian)"
    echo "    📥 Cài đặt: brew install python3 (macOS)"
    ((ERRORS++))
fi

# ======================================
# KIỂM TRA NODE.JS
# ======================================
echo "[2/8] Kiểm tra Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version 2>&1)
    echo "✅ Node.js $NODE_VERSION đã cài đặt"
    
    # Kiểm tra npm
    if command -v npm &> /dev/null; then
        echo "✅ npm đã cài đặt"
    else
        echo "⚠️  npm không có sẵn"
        ((WARNINGS++))
    fi
else
    echo "❌ Node.js không được cài đặt"
    echo "    📥 Tải tại: https://nodejs.org"
    echo "    💡 Khuyến nghị version 18+"
    ((ERRORS++))
fi

# ======================================
# KIỂM TRA FILES DỰ ÁN
# ======================================
echo "[3/8] Kiểm tra files dự án..."

if [ -f "payoo-desktop/main.py" ]; then
    echo "✅ Python Desktop App source code"
else
    echo "❌ Không tìm thấy payoo-desktop/main.py"
    ((ERRORS++))
fi

if [ -f "payoo-desktop/requirements.txt" ]; then
    echo "✅ Python requirements.txt"
else
    echo "❌ Không tìm thấy payoo-desktop/requirements.txt"
    ((ERRORS++))
fi

if [ -f "package.json" ]; then
    echo "✅ Web App package.json"
else
    echo "❌ Không tìm thấy package.json"
    ((ERRORS++))
fi

if [ -d "client/src" ]; then
    echo "✅ Frontend source code"
else
    echo "❌ Không tìm thấy client/src"
    ((ERRORS++))
fi

if [ -f "server/index.ts" ]; then
    echo "✅ Backend source code"
else
    echo "❌ Không tìm thấy server/index.ts"
    ((ERRORS++))
fi

# ======================================
# KIỂM TRA PYTHON DEPENDENCIES
# ======================================
echo "[4/8] Kiểm tra Python dependencies..."

if [ -f "payoo-desktop/requirements.txt" ]; then
    if python3 -c "import customtkinter" &> /dev/null; then
        echo "✅ customtkinter"
    else
        echo "⚠️  customtkinter chưa cài đặt"
        ((WARNINGS++))
    fi
    
    if python3 -c "import requests" &> /dev/null; then
        echo "✅ requests"
    else
        echo "⚠️  requests chưa cài đặt"
        ((WARNINGS++))
    fi
    
    if python3 -c "import pandas" &> /dev/null; then
        echo "✅ pandas"
    else
        echo "⚠️  pandas chưa cài đặt"
        ((WARNINGS++))
    fi
    
    if python3 -c "import openpyxl" &> /dev/null; then
        echo "✅ openpyxl"
    else
        echo "⚠️  openpyxl chưa cài đặt"
        ((WARNINGS++))
    fi
else
    echo "❌ Không thể kiểm tra Python dependencies"
fi

# ======================================
# KIỂM TRA NODE.JS DEPENDENCIES
# ======================================
echo "[5/8] Kiểm tra Node.js dependencies..."

if [ -d "node_modules" ]; then
    echo "✅ node_modules đã cài đặt"
else
    echo "⚠️  node_modules chưa cài đặt"
    echo "    💡 Chạy: npm install"
    ((WARNINGS++))
fi

if [ -d "node_modules/react" ]; then
    echo "✅ React"
else
    echo "⚠️  React chưa cài đặt"
    ((WARNINGS++))
fi

if [ -d "node_modules/express" ]; then
    echo "✅ Express"
else
    echo "⚠️  Express chưa cài đặt"
    ((WARNINGS++))
fi

if [ -d "node_modules/typescript" ]; then
    echo "✅ TypeScript"
else
    echo "⚠️  TypeScript chưa cài đặt"
    ((WARNINGS++))
fi

# ======================================
# KIỂM TRA DUNG LƯỢNG
# ======================================
echo "[6/8] Kiểm tra dung lượng..."

if command -v df &> /dev/null; then
    FREE_MB=$(df -BM . | tail -1 | awk '{print $4}' | sed 's/M//')
    if [ "$FREE_MB" -lt 2000 ]; then
        echo "⚠️  Dung lượng trống: ${FREE_MB}MB (khuyến nghị: 2000MB+)"
        ((WARNINGS++))
    else
        echo "✅ Dung lượng trống: ${FREE_MB}MB"
    fi
else
    echo "⚠️  Không thể kiểm tra dung lượng"
    ((WARNINGS++))
fi

# ======================================
# KIỂM TRA MEMORY
# ======================================
echo "[7/8] Kiểm tra RAM..."

if command -v free &> /dev/null; then
    TOTAL_RAM=$(free -m | grep '^Mem:' | awk '{print $2}')
    if [ "$TOTAL_RAM" -lt 4000 ]; then
        echo "⚠️  RAM: ${TOTAL_RAM}MB (khuyến nghị: 4000MB+)"
        ((WARNINGS++))
    else
        echo "✅ RAM: ${TOTAL_RAM}MB"
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    TOTAL_RAM=$(system_profiler SPHardwareDataType | grep "Memory:" | awk '{print $2}' | sed 's/GB/000/')
    if [ "$TOTAL_RAM" -lt 4000 ]; then
        echo "⚠️  RAM: ${TOTAL_RAM}MB (khuyến nghị: 4000MB+)"
        ((WARNINGS++))
    else
        echo "✅ RAM: ${TOTAL_RAM}MB"
    fi
else
    echo "⚠️  Không thể kiểm tra RAM"
    ((WARNINGS++))
fi

# ======================================
# KIỂM TRA INTERNET
# ======================================
echo "[8/8] Kiểm tra kết nối internet..."

if ping -c 1 google.com &> /dev/null; then
    echo "✅ Kết nối internet OK"
else
    echo "⚠️  Không có kết nối internet"
    echo "    💡 Cần internet để tải dependencies"
    ((WARNINGS++))
fi

# ======================================
# KẾT QUẢ TỔNG HỢP
# ======================================
echo ""
echo "========================================"
echo "            KẾT QUẢ KIỂM TRA"
echo "========================================"
echo ""

if [ $ERRORS -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo "🎉 HỆ THỐNG HOÀN TOÀN SẴN SÀNG!"
        echo "✅ Tất cả yêu cầu đã đáp ứng"
        echo "🚀 Bạn có thể bắt đầu build ngay"
        echo ""
        echo "Để build, chạy:"
        echo "    ./build_all.sh"
    else
        echo "🟡 HỆ THỐNG CÓ THỂ BUILD ĐƯỢC"
        echo "✅ Không có lỗi nghiêm trọng"
        echo "⚠️  Có $WARNINGS cảnh báo"
        echo "💡 Khuyến nghị khắc phục cảnh báo trước"
        echo ""
        echo "Để build, chạy:"
        echo "    ./build_all.sh"
    fi
else
    echo "🔴 HỆ THỐNG CHƯA SẴN SÀNG"
    echo "❌ Có $ERRORS lỗi cần khắc phục"
    echo "⚠️  Có $WARNINGS cảnh báo"
    echo "💡 Khắc phục tất cả lỗi trước khi build"
    echo ""
    echo "Cần khắc phục:"
    if [ $ERRORS -gt 0 ]; then
        echo "    - Cài đặt Python và/hoặc Node.js"
        echo "    - Đảm bảo source code đầy đủ"
        echo "    - Cài đặt dependencies"
    fi
fi

echo ""
echo "========================================"
echo "               HƯỚNG DẪN"
echo "========================================"
echo ""
echo "📖 Hướng dẫn chi tiết: HƯỚNG_DẪN_BUILD_TOÀN_DIỆN.md"
echo "🔧 Build script: ./build_all.sh"
echo "📧 Hỗ trợ: dev@payoo.vn"
echo ""
echo "Để cài đặt Python dependencies:"
echo "    cd payoo-desktop"
echo "    pip3 install -r requirements.txt"
echo ""
echo "Để cài đặt Node.js dependencies:"
echo "    npm install"
echo ""