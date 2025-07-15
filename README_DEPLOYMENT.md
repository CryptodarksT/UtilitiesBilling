# Hướng dẫn triển khai Payoo trên VPS Windows

## Thông tin VPS
- **IP:** 160.30.44.141
- **Tài khoản:** Administrator
- **Mật khẩu:** Hnvt1403@

## Các bước triển khai nhanh

### 1. Kết nối VPS
1. Mở Remote Desktop Connection
2. Nhập IP: `160.30.44.141`
3. Đăng nhập với tài khoản `Administrator` và mật khẩu `Hnvt1403@`

### 2. Cài đặt các phần mềm cần thiết

#### Node.js
1. Tải Node.js v20.x từ: https://nodejs.org/en/download/
2. Cài đặt với các tùy chọn mặc định
3. Mở Command Prompt và kiểm tra: `node --version`

#### PostgreSQL
1. Tải PostgreSQL từ: https://www.postgresql.org/download/windows/
2. Cài đặt với mật khẩu cho user `postgres`
3. Mở pgAdmin và tạo:
   - Database: `payoo_db`
   - User: `payoo_user` với mật khẩu `secure_password_123`

### 3. Triển khai ứng dụng

#### Tùy chọn 1: Sử dụng PowerShell Script (Khuyến nghị)
```powershell
# Chạy PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\deploy.ps1
```

#### Tùy chọn 2: Thủ công
```cmd
# Chạy build script
build.bat

# Cập nhật file .env với API keys thực tế
# Chạy start script
start.bat
```

### 4. Cấu hình API Keys

Cập nhật file `.env` với các key thực tế:

```env
# BIDV API (Liên hệ BIDV để lấy)
BIDV_API_KEY=your_real_bidv_key
BIDV_API_SECRET=your_real_bidv_secret

# MoMo Business API (Đăng ký tại business.momo.vn)
MOMO_PARTNER_CODE=your_momo_partner_code
MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key

# VNPay (Đăng ký tại vnpay.vn)
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
```

### 5. Kiểm tra và bảo mật

#### Kiểm tra ứng dụng
- Truy cập: http://160.30.44.141:5000
- Đăng nhập với API key admin: `pk_admin_1752565555_abcdef123456`

#### Bảo mật cơ bản
1. Đổi mật khẩu Administrator
2. Cấu hình Windows Firewall
3. Cập nhật Windows thường xuyên
4. Backup database định kỳ

### 6. Quản lý ứng dụng

#### PM2 Commands
```cmd
pm2 list          # Xem trạng thái
pm2 logs          # Xem logs
pm2 restart payoo # Restart ứng dụng
pm2 stop payoo    # Dừng ứng dụng
pm2 monit         # Monitor real-time
```

#### Logs
- Application logs: `C:\payoo-app\logs\`
- PM2 logs: `C:\Users\Administrator\.pm2\logs\`

#### Backup database
```cmd
pg_dump -U payoo_user -h localhost payoo_db > backup_$(Get-Date -Format "yyyyMMdd").sql
```

### 7. Troubleshooting

#### Lỗi thường gặp
1. **Port 5000 already in use:** `pm2 kill` và restart
2. **Database connection error:** Kiểm tra PostgreSQL service
3. **PM2 not found:** Cài đặt lại PM2 globally

#### Kiểm tra logs
```cmd
pm2 logs --lines 100  # Xem 100 dòng logs cuối
```

### 8. Cập nhật ứng dụng

```cmd
cd C:\payoo-app
git pull origin main  # Nếu dùng git
npm install           # Cài đặt dependencies mới
npm run build         # Build lại
pm2 restart payoo     # Restart ứng dụng
```

## Liên hệ hỗ trợ

- **Email:** admin@payoo.vn
- **Hotline:** 1900-xxxx

---
*Tài liệu này được tạo cho việc triển khai ứng dụng Payoo trên VPS Windows 160.30.44.141*