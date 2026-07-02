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