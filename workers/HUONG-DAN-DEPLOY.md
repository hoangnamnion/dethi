# 🚀 Hướng Dẫn Deploy Worker API

## Bước 1: Tạo Worker trên Cloudflare Dashboard

1. Vào [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create**
2. Chọn **Create Worker**
3. Đặt tên: `exam-api` (hoặc tên bạn thích)
4. Nhấn **Deploy** (tạo worker rỗng trước)

## Bước 2: Paste code Worker

1. Sau khi tạo xong, nhấn **Edit Code** (Quick Edit)
2. Xóa hết code mặc định
3. Mở file `workers/exam-api.js` trong project → Copy toàn bộ nội dung
4. Paste vào editor trên Cloudflare
5. Nhấn **Save and Deploy**

## Bước 3: Tạo KV Namespace (Database)

1. Trong Dashboard → **Workers & Pages** → **KV** → **Create a namespace**
2. Đặt tên: `EXAM_DB`
3. Nhấn **Add**

## Bước 4: Bind KV vào Worker

1. Vào Worker `exam-api` → **Settings** → **Variables and Secrets**
2. Kéo xuống mục **KV Namespace Bindings** → **Add binding**
3. **Variable name**: `DB` (BẮT BUỘC phải đúng tên này)
4. **KV namespace**: chọn `EXAM_DB` vừa tạo
5. Nhấn **Save**

## Bước 5: Cập nhật URL trong code frontend

1. Copy URL Worker của bạn (dạng: `https://exam-api.xxxxx.workers.dev`)
2. Mở file `js/api-config.js`
3. Thay `https://exam-api.YOUR_SUBDOMAIN.workers.dev` bằng URL thật

```js
const API_BASE = "https://exam-api.ten-cua-ban.workers.dev";
```

## Bước 6: Import dữ liệu tài khoản cũ

Sau khi deploy xong, vào trang Admin Dashboard → thêm tài khoản → nhấn "Lưu Lên Server".
Dữ liệu sẽ được lưu vào Cloudflare KV thay vì Google Sheets.

## Test nhanh

Truy cập URL Worker trên trình duyệt, sẽ thấy:
```json
{"status":"ok","message":"🚀 Exam API Worker is running!"}
```

Nếu thấy dòng này là Worker đã hoạt động! ✅
