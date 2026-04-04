// File chứa cấu hình hệ thống & thông tin nhạy cảm

// 1. CẤU HÌNH TELEGRAM BOT (Đã mã hoá Base64 nhẹ)
const _T_TOKEN_ = "ODU4ODI1MjYzMzpBQUhnLURaREVqUnZiOVhvMjNPbkF5bzFXT091NE5iS0hERQ==";
const _T_CHAT_ = "Njc1NDM1NjQ0Ng==";
const getTelegramBotToken = () => atob(_T_TOKEN_);
const getTelegramChatId = () => atob(_T_CHAT_);

// 2. DANH SÁCH ĐỀ THI MẶC ĐỊNH (Dành cho ai không được gán đề riêng)
const DEFAULT_EXAMS = [
    { file: '1', ten: 'TIN HỌC ĐẠI CƯƠNG' },
    { file: '2', ten: 'Tin Học Cơ Bản' },
    { file: '3', ten: 'Kiểm Tra Giữa Kỳ' },
    { ten: 'VIẾT BÁO CÁO', url: 'index.html', icon: '📝' }
];

// 3. DANH SÁCH TÀI KHOẢN DO ADMIN CẤP (CƠ SỞ DỮ LIỆU THU NHỎ)
// Cấu trúc: "TàiKhoản": { pass: "MậtKhẩu", name: "Tên Hiển Thị", exams: [...] }
// Nếu bỏ trống "exams", hệ thống sẽ tự nạp DEFAULT_EXAMS ở trên.
const VALID_ACCOUNTS = {
    "admin": { pass: "admin123", name: "Quản Trị Viên" }, // admin thấy mọi thứ mặc định
    "lop12a1": { 
        pass: "vip123", 
        name: "Lớp 12A1",
        exams: [
            { file: 'toán_12a1', ten: 'Đề Toán Học Kỳ 1 - Nhóm A' },
            { file: 'ly_12a1', ten: 'Đề Lý 15 phút' }
        ]
    },
    "hoangnam": { 
        pass: "123456", 
        name: "Cao Văn Nam",
        exams: [
            { file: 'nam', ten: 'BÀI KIỂM TRA ĐẶC BIỆT CỦA NAM', icon: '🔥' }
        ]
    },
    "hocsinh1": { pass: "hs111", name: "Học sinh hệ thống" }
};
