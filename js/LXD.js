// File chứa cấu hình hệ thống & thông tin nhạy cảm
// Cấu hình Telegram đã được chuyển sang api-config.js để dùng chung cho toàn hệ thống

// 2. DANH SÁCH ĐỀ THI MẶC ĐỊNH (Dành cho ai không được gán đề riêng)
const DEFAULT_EXAMS = [
    { ten: 'Trang Chủ', url: 'index.html', IMG: 'img/muiten.jpg' },
    { file: 'luatxd1', ten: 'Luật Xây Dựng 1-30 câu' },
    { file: 'luatxd2', ten: 'Luật Xây Dựng 31-64 câu' },
    { file: 'luatxd3', ten: 'Luật Xây Dựng 61-90 câu' },
    { file: 'luatxd4', ten: 'Luật Xây Dựng 91-120 câu' },
    { file: 'luatxd5', ten: 'Luật Xây Dựng 121-137 câu' },
    { file: 'luatxd', ten: 'Full Luật Xây Dựng 137 câu' },


];

// 3. DANH SÁCH TÀI KHOẢN DO ADMIN CẤP (CƠ SỞ DỮ LIỆU THU NHỎ)
// Cấu trúc: "TàiKhoản": { pass: "MậtKhẩu", name: "Tên Hiển Thị", exams: [...] }
// Nếu bỏ trống "exams", hệ thống sẽ tự nạp DEFAULT_EXAMS ở trên.
