# Hướng dẫn khắc phục lỗi Firebase Authentication

## Lỗi hiện tại:
```
auth/requests-to-this-api-identitytoolkit-method-google.cloud.identitytoolkit.v1.projectconfigservice.getprojectconfig-are-blocked
```

## Nguyên nhân:
Domain Replit của bạn chưa được phép truy cập Firebase Authentication.

## Domain cần thêm:
```
https://a9e3c388-0336-41e8-bc65-763a65a88cb9-00-1hsiywfbxgh0f.picard.replit.dev
```

## OAuth đã cấu hình:
✓ Client ID: 339580374296-qfuqibsucua1v7pk5r8nb6sg77enfj1m.apps.googleusercontent.com
✓ Project ID: ai-futures-2025
✓ Redirect URIs và JavaScript origins đã có domain Replit

## Tình trạng hiện tại:
- OAuth Client ID đã được cấu hình cho domain Replit
- Project ID: ai-futures-2025 (NHƯNG environment variable có thể là telegrampro-301eb)
- Domain quá dài: a9e3c388-0336-41e8-bc65-763a65a88cb9-00-1hsiywfbxgh0f.picard.replit.dev

## Các bước khắc phục:

### Bước 1: Thêm domain vào Firebase Console
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project của bạn
3. Vào **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. **LƯU Ý**: Domain Replit quá dài, hãy thêm:
   - `*.replit.dev` (cho phép tất cả subdomain Replit)
   - `*.picard.replit.dev` (cho phép subdomain picard)
   - `localhost` (cho development)
6. Click **Save**

### Bước 2: Kiểm tra Google Cloud Console
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Chọn project Firebase của bạn
3. Tìm API key (cùng key với `VITE_FIREBASE_API_KEY`)
4. Click vào API key
5. Trong phần **Application restrictions**:
   - Chọn **HTTP referrers (websites)**
   - Thêm:
     ```
     https://a9e3c388-0336-41e8-bc65-763a65a88cb9-00-1hsiywfbxgh0f.picard.replit.dev/*
     https://*.replit.dev/*
     ```
6. Click **Save**

### Bước 3: Cấu hình OAuth 2.0 (nếu cần)
1. Trong Google Cloud Console, vào **APIs & Services** → **Credentials**
2. Tìm OAuth 2.0 Client ID cho Web application
3. Click vào để chỉnh sửa
4. Thêm vào **Authorized JavaScript origins**:
   ```
   https://a9e3c388-0336-41e8-bc65-763a65a88cb9-00-1hsiywfbxgh0f.picard.replit.dev
   ```
5. Thêm vào **Authorized redirect URIs**:
   ```
   https://a9e3c388-0336-41e8-bc65-763a65a88cb9-00-1hsiywfbxgh0f.picard.replit.dev
   ```
6. Click **Save**

### Bước 4: Đợi và thử lại
- Sau khi thêm domain, đợi 5-10 phút để cấu hình được cập nhật
- Refresh lại trang web và thử đăng nhập lại

## Lưu ý quan trọng:
- Domain Replit có thể thay đổi khi bạn restart project
- Nếu domain thay đổi, bạn cần cập nhật lại trong Firebase Console
- Khi deploy lên production, nhớ thêm domain production vào danh sách

## Test sau khi khắc phục:
1. Refresh trang web (Ctrl + F5)
2. Click nút "Đăng nhập với Google"
3. Nếu vẫn lỗi, kiểm tra Console để xem lỗi chi tiết

## Domain dự phòng để thêm:
```
*.replit.dev
*.repl.co
localhost
127.0.0.1
```

## Nếu vẫn không được, thử cách khác:

### Cách 2: Tạo Custom Domain
1. Trong Replit, vào **Deployments** → **Custom domains**
2. Tạo domain ngắn hơn (VD: `payoo-app.replit.app`)
3. Thêm domain mới này vào Firebase Console

### Cách 3: Sử dụng Localhost để test
1. Chạy app trên localhost: `npm run dev`
2. Thêm `localhost` vào Firebase authorized domains
3. Test trên `http://localhost:5000`