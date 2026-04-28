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
    
    // Yêu cầu quyền vị trí khi vừa mở web
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // Quyền được cấp, lưu toạ độ chính xác
                sessionStorage.setItem('exact_lat', position.coords.latitude);
                sessionStorage.setItem('exact_lng', position.coords.longitude);
                console.log("Đã lưu quyền vị trí chính xác.");
            },
            function(error) {
                console.log("Từ chối hoặc lỗi quyền vị trí:", error.message);
            }
        );
    }
});
