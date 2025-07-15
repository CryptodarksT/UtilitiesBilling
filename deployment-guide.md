# Hướng dẫn triển khai ứng dụng Payoo lên VPS Windows

## Thông tin VPS
- IP: 160.30.44.141
- Tài khoản: Administrator
- Mật khẩu: Hnvt1403@

## 1. Chuẩn bị VPS Windows

### Bước 1: Cài đặt Node.js
1. Kết nối Remote Desktop tới VPS
2. Tải và cài đặt Node.js v20.x từ: https://nodejs.org/
3. Kiểm tra cài đặt: `node --version` và `npm --version`

### Bước 2: Cài đặt PostgreSQL
1. Tải PostgreSQL từ: https://www.postgresql.org/download/windows/
2. Cài đặt với mật khẩu mạnh cho user postgres
3. Tạo database cho ứng dụng:
   ```sql
   CREATE DATABASE payoo_db;
   CREATE USER payoo_user WITH PASSWORD 'secure_password_123';
   GRANT ALL PRIVILEGES ON DATABASE payoo_db TO payoo_user;
   ```

### Bước 3: Cài đặt PM2 (Process Manager)
```cmd
npm install -g pm2
npm install -g pm2-windows-service
```

## 2. Triển khai ứng dụng

### Bước 1: Tải mã nguồn
```cmd
cd C:\
git clone [repository-url] payoo-app
cd payoo-app
```

### Bước 2: Cài đặt dependencies
```cmd
npm install
```

### Bước 3: Build ứng dụng
```cmd
npm run build
```

### Bước 4: Cấu hình environment
Tạo file `.env` với nội dung:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://payoo_user:secure_password_123@localhost:5432/payoo_db

# API Keys
BIDV_API_KEY=your_bidv_api_key
BIDV_API_SECRET=your_bidv_api_secret
MOMO_PARTNER_CODE=your_momo_partner_code
MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
```

### Bước 5: Chạy migration database
```cmd
npm run db:push
```

### Bước 6: Khởi chạy ứng dụng với PM2
```cmd
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 3. Cấu hình Windows Service

### Tạo Windows Service
```cmd
pm2-service-install
pm2-service-start
```

## 4. Cấu hình Firewall và IIS (tùy chọn)

### Mở port firewall
```cmd
netsh advfirewall firewall add rule name="Payoo App" dir=in action=allow protocol=TCP localport=5000
```

### Cấu hình IIS làm reverse proxy (tùy chọn)
1. Cài đặt IIS
2. Cài đặt URL Rewrite module
3. Cấu hình reverse proxy từ port 80 → 5000

## 5. Monitoring và Logs

### Xem logs
```cmd
pm2 logs
pm2 monit
```

### Restart ứng dụng
```cmd
pm2 restart payoo
```

## 6. Backup và Bảo mật

### Backup database
```cmd
pg_dump payoo_db > backup_$(date +%Y%m%d).sql
```

### Bảo mật
- Đổi mật khẩu mặc định
- Cấu hình SSL certificate
- Giới hạn quyền truy cập database
- Cập nhật thường xuyên