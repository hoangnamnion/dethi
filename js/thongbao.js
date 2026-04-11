// ===============================================
// FILE CẤU HÌNH LỜI THÔNG BÁO CHẠY NGANG ĐỈNH TRANG
// ===============================================

// Anh chỉ cần thay đổi nội dung chữ ở trong dấu ngoặc kép dưới đây:
const NOI_DUNG_THONG_BAO = "Top 1 :  Tài khoản: hung 🏆 Điểm: 44/50 ; Top 2 : Tài khoản: hung 🏆 Điểm: 44/50 ; Top 3 : Tài khoản: hung 🏆 Điểm: 44/50 ;";

// Tự động áp dụng thông báo vào trang web (KHÔNG CẦN CHỈNH SỬA PHẦN NÀY)
document.addEventListener('DOMContentLoaded', () => {
    const marqueeElement = document.querySelector('.marquee-text');
    if (marqueeElement) {
        marqueeElement.innerHTML = NOI_DUNG_THONG_BAO;
    }
});
