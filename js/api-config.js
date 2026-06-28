// =====================================================
// CẤU HÌNH API & TELEGRAM BOT — CHỈ CẦN THAY ĐỔI 1 CHỖ DUY NHẤT NÀY
// =====================================================
// Sau khi deploy Worker lên Cloudflare, paste URL vào đây:
const API_BASE = "https://dethiapi.caovannamutt.workers.dev";

// CẤU HÌNH TELEGRAM BOT (Đã mã hoá Base64 nhẹ)
const _T_TOKEN_ = "ODU4ODI1MjYzMzpBQUhnLURaREVqUnZiOVhvMjNPbkF5bzFXT091NE5iS0hERQ==";
const _T_CHAT_ = "Njc1NDM1NjQ0Ng==";
const getTelegramBotToken = () => atob(_T_TOKEN_);
const getTelegramChatId = () => atob(_T_CHAT_);
