# Hướng dẫn triển khai hoàn chỉnh - Payoo VPS Windows

## 📋 Thông tin VPS
- **IP:** 160.30.44.141
- **Tài khoản:** Administrator  
- **Mật khẩu:** Hnvt1403@
- **Hệ điều hành:** Windows Server

## 🚀 Triển khai nhanh (5 bước)

### Bước 1: Kết nối VPS
```
1. Mở Remote Desktop Connection
2. Nhập IP: 160.30.44.141
3. Đăng nhập: Administrator / Hnvt1403@
```

### Bước 2: Cài đặt Node.js + PostgreSQL
```
1. Tải Node.js v20.x: https://nodejs.org/en/download/
2. Tải PostgreSQL: https://www.postgresql.org/download/windows/
3. Cài đặt cả hai với tùy chọn mặc định
```

### Bước 3: Tạo database PostgreSQL
```sql
-- Mở pgAdmin sau khi cài PostgreSQL
CREATE DATABASE payoo_db;
CREATE USER payoo_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE payoo_db TO payoo_user;
```

### Bước 4: Deploy ứng dụng
```cmd
# Mở Command Prompt as Administrator
cd C:\
git clone [your-repo-url] payoo-app
cd payoo-app

# Chạy script tự động
build.bat
start.bat
```

### Bước 5: Cấu hình API Keys
Cập nhật file `.env` với API keys thực tế:
```env
BIDV_API_KEY=your_real_bidv_key
MOMO_PARTNER_CODE=your_real_momo_code
VNPAY_TMN_CODE=your_real_vnpay_code
```

## 🔧 Cấu hình chi tiết

### Database Connection
```env
DATABASE_URL=postgresql://payoo_user:secure_password_123@localhost:5432/payoo_db
```

### API Keys cần thiết
1. **BIDV API** - Liên hệ BIDV để đăng ký
2. **MoMo Business** - Đăng ký tại business.momo.vn
3. **VNPay** - Đăng ký tại vnpay.vn

### Firewall Configuration
```cmd
netsh advfirewall firewall add rule name="Payoo App" dir=in action=allow protocol=TCP localport=5000
```

## 📊 Quản lý ứng dụng

### PM2 Commands
```cmd
pm2 list          # Xem trạng thái
pm2 logs payoo    # Xem logs
pm2 restart payoo # Restart ứng dụng
pm2 stop payoo    # Dừng ứng dụng
pm2 monit         # Monitor real-time
```

### Kiểm tra ứng dụng
- **URL:** http://160.30.44.141:5000
- **Admin API Key:** pk_admin_1752565555_abcdef123456

## 🛠️ Troubleshooting

### Lỗi phổ biến
1. **Port 5000 busy:** `pm2 kill` rồi `pm2 start ecosystem.config.js`
2. **Database error:** Kiểm tra PostgreSQL service đã start
3. **API errors:** Kiểm tra API keys trong file `.env`

### Logs location
- App logs: `C:\payoo-app\logs\`
- PM2 logs: `C:\Users\Administrator\.pm2\logs\`

## 🔒 Bảo mật

### Bảo mật cơ bản
1. Đổi mật khẩu Administrator
2. Cập nhật Windows Security
3. Backup database định kỳ
4. Monitor logs thường xuyên

### Backup Database
```cmd
pg_dump -U payoo_user -h localhost payoo_db > backup_$(date +%Y%m%d).sql
```

## 📱 Tính năng ứng dụng

### Đăng nhập hệ thống
- Sử dụng API key thay vì Google login
- Admin key: `pk_admin_1752565555_abcdef123456`

### Chức năng chính
- ✅ Tra cứu hóa đơn điện/nước
- ✅ Thanh toán MoMo/VNPay
- ✅ Quản lý thẻ tín dụng
- ✅ Upload Excel hàng loạt
- ✅ Thanh toán tự động
- ✅ Lịch sử giao dịch

## 🔄 Cập nhật ứng dụng

```cmd
cd C:\payoo-app
git pull origin main
npm install
npm run build
pm2 restart payoo
```

## 📞 Hỗ trợ

- **Docs:** `README_DEPLOYMENT.md`
- **Scripts:** `build.bat`, `start.bat`, `deploy.ps1`
- **Config:** `ecosystem.config.js`, `production.env`

---

✨ **Ứng dụng sẽ chạy tại:** http://160.30.44.141:5000

🔑 **Admin Login:** Sử dụng API key `pk_admin_1752565555_abcdef123456`