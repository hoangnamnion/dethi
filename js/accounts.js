// =====================================================
// DANH SÁCH TÀI KHOẢN — js/accounts.js
// Thêm/sửa/xóa tài khoản tại đây.
// =====================================================
// Cấu trúc:
//   "tentaikhoan": { pass: "matkhau", name: "Tên Hiển Thị" }
//   "tentaikhoan": { pass: "matkhau", name: "Tên", exams: [...] }  ← Phân quyền đề riêng
//   "tentaikhoan": { pass: "matkhau", name: "Tên", status: "expired" }  ← Hết hạn
//   "tentaikhoan": { pass: "matkhau", name: "Tên", status: "banned" }   ← Bị cấm
// =====================================================
// ⚠️ File này là DỰ PHÒNG. Dữ liệu trên Worker (admin.html) có ưu tiên cao hơn.
// =====================================================

const VALID_ACCOUNTS = {

    // ===== THÊM TÀI KHOẢN VÀO ĐÂY =====
    "admin": { pass: "admin123", name: "CAO VĂN NAM" },
    "doanha": { pass: "doanhan123", name: "Đoàn Thị Hà" },
    "dat": { pass: "dat123", name: "Nguyễn Cũng Đạt" },
    "duc": { pass: "duc123", name: "Đặng Minh Đức" },
    "quyen": { pass: "quyen123", name: "Nguyễn Văn Quyến" },
    "minhkhang": { pass: "minhkhang123", name: "Nguyễn Minh Khang" },
    "thuy": { pass: "thuy123", name: "Nguyễn Thị Thủy" },
    "manh": { pass: "manh123", name: "Lương Thế Mạnh" },
    "anhtuan": {
        pass: "anhtuan123",
        name: "Nguyễn Anh Tuấn",
        exams: [
            { ten: 'Luật Xây Dựng', url: 'LXD.html' },
            { ten: 'Chủ Nghĩa Xã Hội Khoa Học', url: 'CNXHKH.html' }
        ]
    },
    "cong": {
        pass: "cong123",
        name: "Phạm Văn Công",
        exams: [
            { ten: 'Luật Xây Dựng', url: 'LXD.html' },
            { ten: 'Chủ Nghĩa Xã Hội Khoa Học', url: 'CNXHKH.html' }
        ]
    },
        "hung": {
        pass: "hung123",
        name: "Đinh Duy Hưng",
        exams: [
            { ten: 'Luật Xây Dựng', url: 'LXD.html' },
            { ten: 'Chủ Nghĩa Xã Hội Khoa Học', url: 'CNXHKH.html' }
        ]
    },
            "lanh": {
        pass: "lanh123",
        name: "Lê Văn Lanh",
        exams: [
            { ten: 'Luật Xây Dựng', url: 'LXD.html' },
            { ten: 'Chủ Nghĩa Xã Hội Khoa Học', url: 'CNXHKH.html' },
            { file: 'tinhoc', ten: 'Full Tin Học' },
        ]
    },
            "quyvinh": {
        pass: "quyvinh123",
        name: "Lê Quý Vinh",
        exams: [
            { ten: 'Luật Xây Dựng', url: 'LXD.html' },
            { ten: 'Chủ Nghĩa Xã Hội Khoa Học', url: 'CNXHKH.html' }
        ]
    },
                "tinhoc": {
        pass: "tinhoc123",
        name: "Tài Khoản Cấp Riêng",
        exams: [
            { file: 'tinhoc', ten: 'Full Tin Học' },
        ]
    },
    // Ví dụ phân quyền thẳng vào 1 chương (Đề thi con):
    "vidu": {
        pass: "vidu123",
        name: "Học Sinh Ví Dụ",
        exams: [
            { file: 'cnxhkhchuong1', ten: 'Chương I' },
            { file: 'cnxhkhchuong2', ten: 'Chương II' }
        ]
    },


};
