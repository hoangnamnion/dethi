// File chứa cấu hình hệ thống & thông tin nhạy cảm

// 1. CẤU HÌNH TELEGRAM BOT (Đã mã hoá Base64 nhẹ)
const _T_TOKEN_ = "ODU4ODI1MjYzMzpBQUhnLURaREVqUnZiOVhvMjNPbkF5bzFXT091NE5iS0hERQ==";
const _T_CHAT_ = "Njc1NDM1NjQ0Ng==";
const getTelegramBotToken = () => atob(_T_TOKEN_);
const getTelegramChatId = () => atob(_T_CHAT_);

// 2. DANH SÁCH ĐỀ THI MẶC ĐỊNH (Dành cho ai không được gán đề riêng)
const DEFAULT_EXAMS = [
    { file: 'luatxd1', ten: 'Luật Xây Dựng 1-30 câu' },
    { file: 'luatxd2', ten: 'Luật Xây Dựng 31-64 câu' },
    { file: 'luatxd3', ten: 'Luật Xây Dựng 61-90 câu' },
    { file: 'luatxd4', ten: 'Luật Xây Dựng 91-120 câu' },
    { file: 'luatxd5', ten: 'Luật Xây Dựng 121-137 câu' },
    { file: 'luatxd', ten: 'Full Luật Xây Dựng 137 câu' },
    { file: 'cnxhkh1', ten: 'CNXHKH Chương I 1-20 câu' },
    { file: 'cnxhkh2', ten: 'CNXHKH Chương II 1-30 câu' },
    { file: 'cnxhkh3', ten: 'CNXHKH Chương II 31-65 câu' },
    { file: 'cnxhkh4', ten: 'CNXHKH Chương III 1-30 câu' },
    { file: 'cnxhkh5', ten: 'CNXHKH Chương III 31-50 câu' },
    { file: 'cnxhkh6', ten: 'CNXHKH Chương IV 1-30 câu' },
    { file: 'cnxhkh7', ten: 'CNXHKH Chương IV 31-50 câu' },
    { file: 'cnxhkh8', ten: 'CNXHKH Chương V 1-30 câu' },
    { file: 'cnxhkh9', ten: 'CNXHKH Chương V 31-50 câu' },
    { file: 'cnxhkh10', ten: 'CNXHKH Chương VI 1-30 câu' },
    { file: 'cnxhkh11', ten: 'CNXHKH Chương VI 31-60 câu' },
    { file: 'cnxhkh12', ten: 'CNXHKH Chương VII 1-30 câu' },
    { file: 'cnxhkh13', ten: 'CNXHKH Chương VII 31-55 câu' },
    { file: 'cnxhkh', ten: 'Full VII Chương CNXHKH' },


    { ten: 'Trang Có Đề Thi', url: 'sbvl.html', IMG: 'anhnen/pdf.gif' }
];

// 3. DANH SÁCH TÀI KHOẢN DO ADMIN CẤP (CƠ SỞ DỮ LIỆU THU NHỎ)
// Cấu trúc: "TàiKhoản": { pass: "MậtKhẩu", name: "Tên Hiển Thị", exams: [...] }
// Nếu bỏ trống "exams", hệ thống sẽ tự nạp DEFAULT_EXAMS ở trên.
const VALID_ACCOUNTS = {
    "admin": { pass: "hoangnam123", name: "Quản Trị Viên", id: ["DEV_GMF5XTPQ", "DEV_23IKO5SS", "DEV_UCAISH7Y", "DEV_DXN4ABL9", "DEV_SDG1EUU7",] },
    "hung": { pass: "hung123", name: "Idol Hưng Đẹp Zai", id: "DEV_GDHUTRNB", },
    "trung": { pass: "trung123", name: "Quang Trung", id: "DEV_RTM2ST30", },
    "quyen": { pass: "quyen123", name: "Văn Quyến" },
    "minhduc": { pass: "minhduc123", name: "Đặng Minh Đức Đẹp Zai", id: ["DEV_8ZOBGNDF", "DEV_5MD7J2CL",] },
    "manh": { pass: "manh123", name: "Lương Thế Mạnh Đẹp Zai", id: "DEV_IA6BOGF5", },
    "quangvu": { pass: "quangvu123", name: "Quang Vũ" },
    "anhtuan": { pass: "anhtuan123", name: "Nguyễn Anh Tuấn", id: "DEV_V5IO5HDZ", },
    "quyvinh": { pass: "quyvinh123", name: "Lê Quý Vinh", id: ["DEV_V5IO5HDZ", "DEV_FNFDNSTU",] },
    "nga": { pass: "nga123", name: "Bùi Thúy Nga", id: "DEV_6SMOPWW4", },
    "vduc": { pass: "vduc123", name: "Văn Đức" },
    "dat": { pass: "dat123", name: "Nguyễn Cung Đạt", id: ["DEV_C6HA7784", "DEV_5s215PVQ", "DEV_5S215PVQ", "DEV_GHOZI91T",] },
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
            { file: 'luatxd1', ten: 'Luật Xây Dựng 70 câu đầu', icon: '🔥' },
            { file: 'luatxd2', ten: 'Luật Xây Dựng 67 câu tiếp', icon: '🔥' },
            { file: 'luatxd', ten: 'Luật Xây Dựng Toàn Bộ 137 câu', icon: '🔥' },
        ]
    },
    "hoangnam": {
        pass: "123456",
        name: "Cao Văn Nam",
        id: "DEV_GMF5XTPQ",
        exams: [
            { file: 'nam', ten: 'BÀI KIỂM TRA ĐẶC BIỆT CỦA NAM', icon: '🔥' }
        ]
    },
    "hocsinh1": { pass: "hs111", name: "Học sinh hệ thống" }
};