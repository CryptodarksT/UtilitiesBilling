# Payoo Desktop - Quick Start Guide

## 🚀 Chạy ứng dụng nhanh

### Windows
1. Chạy file `START-PAYOO.bat`
2. Chờ ứng dụng khởi động
3. Bắt đầu sử dụng!

### Linux/macOS
```bash
# Cài đặt dependencies
pip install -r requirements.txt

# Chạy ứng dụng
python main.py
```

## 🔧 Cấu hình nhanh

### 1. Mở ứng dụng
- Double-click `START-PAYOO.bat` (Windows)
- Hoặc chạy `python main.py`

### 2. Cấu hình API
1. Vào tab **"⚙️ Quản trị"**
2. Chọn **"🔑 Cấu hình API"**
3. Điền thông tin API:

#### MoMo Business
- Partner Code: `YOUR_PARTNER_CODE`
- Access Key: `YOUR_ACCESS_KEY`
- Secret Key: `YOUR_SECRET_KEY`

#### BIDV API
- API Key: `YOUR_API_KEY`
- API Secret: `YOUR_API_SECRET`

### 3. Test kết nối
- Nhấn **"Test Connection"** cho từng API
- Đảm bảo tất cả hiển thị màu xanh ✅

### 4. Bắt đầu sử dụng
1. Vào tab **"🔍 Tra cứu hóa đơn"**
2. Nhập mã hóa đơn: `PD29007350490`
3. Nhấn **"Tìm kiếm"**
4. Chọn **"💳 Thanh toán"**

## 🆘 Khắc phục sự cố

### Lỗi "Module not found"
```bash
pip install -r requirements.txt
```

### Lỗi kết nối API
1. Kiểm tra internet
2. Xác thực API credentials
3. Kiểm tra firewall

### Ứng dụng không khởi động
1. Cập nhật Python >= 3.8
2. Reinstall dependencies
3. Kiểm tra logs

## 💡 Mẹo sử dụng

- **Shortcut**: Ctrl+R để refresh
- **Theme**: Đổi theme trong Settings
- **Backup**: Tự động backup trong Settings
- **Logs**: Xem logs trong tab Admin

## 📞 Hỗ trợ

- **Email**: support@payoo.vn
- **Phone**: 1900 1234
- **Docs**: https://docs.payoo.vn