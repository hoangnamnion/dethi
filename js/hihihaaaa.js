// File chứa cấu hình hệ thống & thông tin nhạy cảm

// 1. CẤU HÌNH TELEGRAM BOT (Đã mã hoá Base64 nhẹ)
const _T_TOKEN_ = "ODU4ODI1MjYzMzpBQUhnLURaREVqUnZiOVhvMjNPbkF5bzFXT091NE5iS0hERQ==";
const _T_CHAT_ = "Njc1NDM1NjQ0Ng==";
const getTelegramBotToken = () => atob(_T_TOKEN_);
const getTelegramChatId = () => atob(_T_CHAT_);

// 2. DANH SÁCH ĐỀ THI MẶC ĐỊNH (Dành cho ai không được gán đề riêng)
const DEFAULT_EXAMS = [
    { file: '4', ten: 'Bim Đại Cương 50 Câu Đầu' },
    { file: '5', ten: 'Bim Đại Cương 50 Câu Tiếp' },
    { file: '6', ten: 'Bim Đại Cương 60 Câu Cuối' },
    { file: '7', ten: 'Bim Đại Cương 160 Câu',  },
    { file: '1', ten: 'Vật Lý Kiến Trúc 35 Câu Đầu' },
    { file: '2', ten: 'Vật Lý Kiến Trúc 35 Câu Sau' },
    { file: '3', ten: 'Vật Lý Kiến Trúc 70 Câu' },

    
    { ten: 'Trang Có Đề Thi', url: 'sbvl.html', IMG: 'anhnen/pdf.gif' }
];

// 3. DANH SÁCH TÀI KHOẢN DO ADMIN CẤP (CƠ SỞ DỮ LIỆU THU NHỎ)
// Cấu trúc: "TàiKhoản": { pass: "MậtKhẩu", name: "Tên Hiển Thị", exams: [...] }
// Nếu bỏ trống "exams", hệ thống sẽ tự nạp DEFAULT_EXAMS ở trên.
const VALID_ACCOUNTS = {
    "admin": { pass: "admin123", name: "Quản Trị Viên" },
    "hung": { pass: "hung123", name: "Idol Hưng Đẹp Zai" },
    "trung": { pass: "trung123", name: "Quang Trung" },
    "quyen": { pass: "quyen123", name: "Văn Quyến" },
    "minhduc": { pass: "minhduc123", name: "Đặng Minh Đức Đẹp Zai" },
    "quangvu": { pass: "quangvu123", name: "Quang Vũ" }, 
    "75dckn24": {
        pass: "vip123",
        name: "Lớp 75DCKN24",
        exams: [
            { file: '8', ten: 'Bim Đại Cương 50 Câu Đầu' },
            { file: '8', ten: 'Bim Đại Cương 50 Câu Tiếp' },
            { file: '8', ten: 'Bim Đại Cương 60 Câu Cuối' },
            { file: '8', ten: 'Bim Đại Cương 160 Câu' },
        ]
    },

        "thuy": {
        pass: "thuy123",
        name: "Nguyễn Thị Thủy",
        exams: [
            { file: 'luatxd1', ten: 'Luật Xây Dựng 70 câu đầu',icon: '🔥' },
            { file: 'luatxd2', ten: 'Luật Xây Dựng 67 câu tiếp',icon: '🔥' },
            { file: 'luatxd', ten: 'Luật Xây Dựng Toàn Bộ 137 câu',icon: '🔥' },
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
