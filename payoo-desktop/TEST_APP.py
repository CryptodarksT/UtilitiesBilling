#!/usr/bin/env python3
"""
Test script để kiểm tra ứng dụng trước khi build
"""

import sys
import os
import importlib.util
import traceback
from pathlib import Path

def test_imports():
    """Test tất cả imports cần thiết"""
    print("🧪 Testing imports...")
    
    required_modules = [
        'tkinter',
        'customtkinter',
        'CTkMessagebox',
        'requests',
        'cryptography',
        'pandas',
        'openpyxl',
        'json',
        'threading',
        'datetime',
        'webbrowser'
    ]
    
    failed_imports = []
    
    for module in required_modules:
        try:
            __import__(module)
            print(f"  ✅ {module}")
        except ImportError as e:
            print(f"  ❌ {module}: {e}")
            failed_imports.append(module)
    
    if failed_imports:
        print(f"\n❌ Một số module chưa được cài đặt: {failed_imports}")
        print("💡 Chạy: pip install -r requirements.txt")
        return False
    
    print("✅ Tất cả imports thành công")
    return True

def test_file_structure():
    """Test cấu trúc file"""
    print("\n🧪 Testing file structure...")
    
    required_files = [
        'main.py',
        'requirements.txt',
        'build.py',
        'src/__init__.py',
        'src/api/__init__.py',
        'src/gui/__init__.py',
        'src/utils/__init__.py'
    ]
    
    required_dirs = [
        'src',
        'src/api',
        'src/gui', 
        'src/utils',
        'assets'
    ]
    
    missing_files = []
    missing_dirs = []
    
    # Check files
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
            print(f"  ❌ {file_path}")
        else:
            print(f"  ✅ {file_path}")
    
    # Check directories
    for dir_path in required_dirs:
        if not Path(dir_path).is_dir():
            missing_dirs.append(dir_path)
            print(f"  ❌ {dir_path}/")
        else:
            print(f"  ✅ {dir_path}/")
    
    if missing_files or missing_dirs:
        print(f"\n❌ Thiếu files: {missing_files}")
        print(f"❌ Thiếu directories: {missing_dirs}")
        return False
    
    print("✅ Cấu trúc file đầy đủ")
    return True

def test_app_modules():
    """Test các modules của ứng dụng"""
    print("\n🧪 Testing app modules...")
    
    app_modules = [
        'src.api.bidv_service',
        'src.api.momo_service',
        'src.api.visa_service',
        'src.api.zalopay_service',
        'src.gui.bill_lookup_frame',
        'src.gui.payment_frame',
        'src.gui.history_frame',
        'src.gui.settings_frame',
        'src.gui.admin_frame',
        'src.gui.status_frame',
        'src.utils.config_manager',
        'src.utils.excel_processor'
    ]
    
    failed_modules = []
    
    for module in app_modules:
        try:
            # Add current directory to path
            sys.path.insert(0, str(Path.cwd()))
            
            spec = importlib.util.spec_from_file_location(
                module, 
                str(Path(module.replace('.', os.sep) + '.py'))
            )
            
            if spec and spec.loader:
                mod = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(mod)
                print(f"  ✅ {module}")
            else:
                print(f"  ❌ {module}: Cannot find module")
                failed_modules.append(module)
                
        except Exception as e:
            print(f"  ❌ {module}: {e}")
            failed_modules.append(module)
    
    if failed_modules:
        print(f"\n❌ Một số modules có lỗi: {failed_modules}")
        return False
    
    print("✅ Tất cả app modules thành công")
    return True

def test_main_script():
    """Test main script"""
    print("\n🧪 Testing main script...")
    
    try:
        # Test syntax
        with open('main.py', 'r', encoding='utf-8') as f:
            code = f.read()
        
        compile(code, 'main.py', 'exec')
        print("  ✅ main.py syntax OK")
        
        # Test imports in main.py
        lines = code.split('\n')
        import_lines = [line for line in lines if line.strip().startswith('from src.') or line.strip().startswith('import')]
        
        print(f"  ✅ Found {len(import_lines)} import statements")
        
        return True
        
    except SyntaxError as e:
        print(f"  ❌ Syntax error in main.py: {e}")
        return False
    except Exception as e:
        print(f"  ❌ Error in main.py: {e}")
        return False

def test_build_prerequisites():
    """Test điều kiện build"""
    print("\n🧪 Testing build prerequisites...")
    
    # Check Python version
    python_version = sys.version_info
    if python_version < (3, 8):
        print(f"  ❌ Python version {python_version.major}.{python_version.minor} < 3.8")
        return False
    else:
        print(f"  ✅ Python version {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    # Check PyInstaller
    try:
        import PyInstaller
        print(f"  ✅ PyInstaller installed: {PyInstaller.__version__}")
    except ImportError:
        print("  ❌ PyInstaller not installed")
        print("  💡 Run: pip install pyinstaller")
        return False
    
    # Check disk space
    import shutil
    free_space = shutil.disk_usage('.').free / 1024 / 1024  # MB
    if free_space < 500:  # 500MB minimum
        print(f"  ❌ Insufficient disk space: {free_space:.1f}MB < 500MB")
        return False
    else:
        print(f"  ✅ Disk space: {free_space:.1f}MB")
    
    print("✅ Build prerequisites OK")
    return True

def run_comprehensive_test():
    """Chạy tất cả tests"""
    print("🚀 PAYOO DESKTOP - COMPREHENSIVE TEST")
    print("=" * 50)
    
    tests = [
        ("File Structure", test_file_structure),
        ("Python Imports", test_imports),
        ("App Modules", test_app_modules),
        ("Main Script", test_main_script),
        ("Build Prerequisites", test_build_prerequisites)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Running {test_name}...")
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name} PASSED")
            else:
                print(f"❌ {test_name} FAILED")
        except Exception as e:
            print(f"❌ {test_name} ERROR: {e}")
            traceback.print_exc()
    
    print("\n" + "=" * 50)
    print(f"🧪 TEST RESULTS: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED! Ready to build.")
        print("💡 Run: python build.py hoặc BUILD-SIMPLE.bat")
        return True
    else:
        print("❌ Some tests failed. Fix issues before building.")
        return False

if __name__ == "__main__":
    success = run_comprehensive_test()
    
    if not success:
        print("\n🔧 TROUBLESHOOTING:")
        print("1. pip install -r requirements.txt")
        print("2. Check file structure") 
        print("3. Fix import errors")
        print("4. Run test again")
        
    input("\nPress Enter to exit...")
    sys.exit(0 if success else 1)