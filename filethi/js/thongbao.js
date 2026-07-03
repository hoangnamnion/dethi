// ===============================================
// FILE CẤU HÌNH LỜI THÔNG BÁO CHẠY NGANG ĐỈNH TRANG
// ===============================================

// Anh chỉ cần thay đổi nội dung chữ ở trong dấu ngoặc kép dưới đây:
const NOI_DUNG_THONG_BAO = "Chúc Bạn Ôn Thi Thật Tốt Ạ";

// Tự động áp dụng thông báo vào trang web (KHÔNG CẦN CHỈNH SỬA PHẦN NÀY)
document.addEventListener('DOMContentLoaded', () => {
    const marqueeElement = document.querySelector('.marquee-text');
    if (marqueeElement) {
        marqueeElement.innerHTML = NOI_DUNG_THONG_BAO;
    }
});

