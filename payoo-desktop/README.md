# Payoo Desktop

## 🚀 Hệ thống thanh toán hóa đơn tiện ích

Payoo Desktop là ứng dụng desktop được phát triển bằng Python với giao diện GUI hiện đại, tích hợp 100% API thật của các nhà cung cấp thanh toán Việt Nam.

## ✨ Tính năng chính

### 🔍 Tra cứu hóa đơn
- ✅ Tra cứu hóa đơn điện, nước, internet, TV
- ✅ Tích hợp BIDV API thật cho dữ liệu chính xác
- ✅ Hiển thị thông tin chi tiết khách hàng
- ✅ Lịch sử tiêu thụ và chỉ số

### 💳 Thanh toán đa dạng
- ✅ **MoMo Business**: Thanh toán qua ví điện tử
- ✅ **BIDV Banking**: Thanh toán qua ngân hàng
- ✅ **ZaloPay Business**: Thanh toán qua ZaloPay
- ✅ **Visa Direct**: Thanh toán qua thẻ tín dụng/ghi nợ

### 📊 Quản lý và báo cáo
- ✅ Xử lý hàng loạt qua file Excel
- ✅ Lịch sử giao dịch chi tiết
- ✅ Xuất báo cáo Excel/PDF
- ✅ Thống kê theo thời gian

### ⚙️ Quản trị hệ thống
- ✅ Cấu hình API từng nhà cung cấp
- ✅ Theo dõi trạng thái API real-time
- ✅ Quản lý database và backup
- ✅ Xem logs hệ thống

## 🛠️ Cài đặt

### Yêu cầu hệ thống
- **OS**: Windows 10/11, macOS 10.15+, Linux Ubuntu 18.04+
- **Python**: 3.8 trở lên
- **RAM**: 4GB+
- **Dung lượng**: 500MB+
- **Kết nối**: Internet ổn định

### Cài đặt từ source code

```bash
# Clone repository
git clone https://github.com/payoo-vn/payoo-desktop.git
cd payoo-desktop

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy ứng dụng
python main.py
```

### Build thành executable

```bash
# Chạy build script
python build.py

# File .exe sẽ có trong thư mục dist/
# Chạy install.bat để cài đặt
```

## 📋 Hướng dẫn sử dụng

### 1. Cấu hình API

Trước khi sử dụng, bạn cần cấu hình API credentials:

1. Mở tab **"⚙️ Quản trị"**
2. Chọn tab **"🔑 Cấu hình API"**
3. Nhập thông tin API cho từng nhà cung cấp:

#### MoMo Business
```
Partner Code: MOMO_PARTNER_CODE
Access Key: MOMO_ACCESS_KEY
Secret Key: MOMO_SECRET_KEY
```

#### BIDV API
```
API Key: BIDV_API_KEY
API Secret: BIDV_API_SECRET
API URL: https://openapi.bidv.com.vn/...
```

#### ZaloPay Business
```
App ID: ZALOPAY_APP_ID
Key 1: ZALOPAY_KEY1
Key 2: ZALOPAY_KEY2
```

#### Visa Direct
```
User ID: VISA_USER_ID
Password: VISA_PASSWORD
Certificate: /path/to/cert.pem
Private Key: /path/to/key.pem
```

### 2. Tra cứu hóa đơn

1. Mở tab **"🔍 Tra cứu hóa đơn"**
2. Nhập mã hóa đơn hoặc thông tin khách hàng
3. Nhấn **"Tìm kiếm"**
4. Chọn hóa đơn cần thanh toán

### 3. Thanh toán

1. Sau khi chọn hóa đơn, chuyển sang tab **"💳 Thanh toán"**
2. Chọn phương thức thanh toán
3. Nhập thông tin bổ sung (nếu cần)
4. Nhấn **"💳 Thanh toán"**
5. Làm theo hướng dẫn trên trang thanh toán

### 4. Xử lý hàng loạt

1. Tạo file Excel theo template
2. Upload file trong tab **"📊 Xử lý hàng loạt"**
3. Kiểm tra và xác nhận dữ liệu
4. Chạy xử lý tự động

## 🔧 Cấu hình nâng cao

### Database
Ứng dụng sử dụng SQLite làm database mặc định. Có thể cấu hình PostgreSQL/MySQL trong settings.

### Logging
Logs được lưu trong thư mục `~/.payoo/logs/`:
- `app.log`: Logs ứng dụng
- `api.log`: Logs API calls
- `error.log`: Logs lỗi

### Security
- API credentials được mã hóa AES-256
- Dữ liệu nhạy cảm không lưu plaintext
- Hỗ trợ 2FA cho admin login

## 🤝 Hỗ trợ

### Liên hệ
- **Email**: support@payoo.vn
- **Hotline**: 1900 1234
- **Website**: https://payoo.vn
- **GitHub**: https://github.com/payoo-vn/payoo-desktop

### Báo lỗi
Vui lòng tạo issue trên GitHub hoặc gửi email với thông tin:
- Phiên bản ứng dụng
- Hệ điều hành
- Logs lỗi
- Các bước tái tạo lỗi

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🔄 Changelog

### v2.0.0 (2025-07-15)
- ✅ Giao diện GUI mới với CustomTkinter
- ✅ Tích hợp API thật 100%
- ✅ Hỗ trợ 4 phương thức thanh toán
- ✅ Xử lý Excel bulk operations
- ✅ Admin panel hoàn chỉnh
- ✅ Real-time API monitoring
- ✅ Database backup/restore
- ✅ Mã hóa cấu hình

### v1.0.0 (2025-01-01)
- ✅ Phiên bản đầu tiên
- ✅ Tra cứu hóa đơn cơ bản
- ✅ Thanh toán MoMo

## 🎯 Roadmap

### v2.1.0 (Q3 2025)
- [ ] Hỗ trợ thêm ngân hàng
- [ ] Mobile app companion
- [ ] API webhooks
- [ ] Advanced reporting

### v2.2.0 (Q4 2025)
- [ ] Multi-language support
- [ ] Plugin system
- [ ] Cloud synchronization
- [ ] Advanced analytics

---

**Phát triển bởi Payoo Development Team** 🚀