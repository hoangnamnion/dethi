// js/tkhethan.js
// DANH SÁCH TÀI KHOẢN ĐÃ HẾT HẠN (EXPIRED ACCOUNTS)
// Thêm tên đăng nhập của những học sinh đã hết hạn vào mảng dưới đây.
// Tài khoản hết hạn sẽ nhận được thông báo yêu cầu gia hạn ở giữa màn hình.

const EXPIRED_ACCOUNTS = [


    // Thêm các tài khoản khác ở đây, cách nhau bởi dấu phẩy
];

// Hàm hiển thị thông báo hết hạn ở giữa màn hình
function showExpiredModal(username) {
    if (document.getElementById('expired-modal')) return;

    const modalHtml = `
        <div id="expired-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 9999999;">
            <div style="background: white; padding: 40px; border-radius: 24px; text-align: center; max-width: 450px; width: 90%; box-shadow: 0 15px 40px rgba(0,0,0,0.3); animation: popInExpired 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <div style="font-size: 60px; margin-bottom: 20px;">⏳</div>
                <h2 style="color: #d63031; margin-bottom: 15px; font-weight: 800; font-size: 1.8em; font-family: 'Montserrat', 'Inter', Arial, sans-serif;">TÀI KHOẢN ĐÃ HẾT HẠN</h2>
                <p style="color: #2d3436; margin-bottom: 25px; font-size: 1.1em; line-height: 1.6; font-family: 'Montserrat', 'Inter', Arial, sans-serif;">Tài khoản <strong style="color: #007bff; font-size: 1.2em;">${username}</strong> của bạn đã hết hạn sử dụng. Vui lòng gia hạn thêm để tiếp tục ôn thi.</p>
                
                <div style="background: #fff8e1; color: #b7791f; padding: 20px; border-radius: 16px; margin-bottom: 25px; text-align: left; font-size: 0.95em; border-left: 5px solid #f6e05e; font-family: 'Montserrat', 'Inter', Arial, sans-serif;">
                    <strong style="display: block; margin-bottom: 8px; font-size: 1.1em; color: #975a16;">📌 Thông tin gia hạn:</strong>
                    <div style="display: flex; align-items: center; margin-bottom: 5px;">
                        <span style="font-size: 1.2em; margin-right: 10px;">📞</span> Zalo: <strong>0378787154</strong>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="font-size: 1.2em; margin-right: 10px;">💵</span> Phí gia hạn: <strong>30.000 VNĐ / Kỳ thi</strong>
                    </div>
                </div>
                
                <button onclick="document.getElementById('expired-modal').remove()" style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; border: none; padding: 15px 30px; border-radius: 14px; font-weight: 700; font-size: 1.1em; cursor: pointer; transition: all 0.3s; width: 100%; box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3); font-family: 'Montserrat', 'Inter', Arial, sans-serif;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(0, 123, 255, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 15px rgba(0, 123, 255, 0.3)';">Đóng thông báo</button>
            </div>
        </div>
        <style>
            @keyframes popInExpired {
                0% { transform: scale(0.8) translateY(20px); opacity: 0; }
                100% { transform: scale(1) translateY(0); opacity: 1; }
            }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Tự động kiểm tra nếu người dùng đã đăng nhập nhưng tài khoản nằm trong danh sách hết hạn
document.addEventListener('DOMContentLoaded', () => {
    const currentUserStr = sessionStorage.getItem('current_user');
    if (currentUserStr) {
        try {
            const currentUser = JSON.parse(currentUserStr);
            if (currentUser && currentUser.accountId) {
                // Kiểm tra hết hạn
                if (EXPIRED_ACCOUNTS.includes(currentUser.accountId)) {
                    // Hiển thị thông báo
                    showExpiredModal(currentUser.accountId);
                    // Xóa session để đăng xuất
                    sessionStorage.removeItem('current_user');
                    // Nếu không ở trang login thì sau vài giây sẽ chuyển về login
                    if (!window.location.pathname.includes('login')) {
                        setTimeout(() => {
                            window.location.href = "login.html";
                        }, 5000);
                    }
                    return; // Dừng lại ở đây, không tracking online nữa
                }

                // --- KÍCH HOẠT TRACKING ONLINE NẾU TÀI KHOẢN HỢP LỆ ---
                startOnlineTracking(currentUser.username || currentUser.accountId);
            }
        } catch (e) {
            console.error("Lỗi parse session:", e);
        }
    }
});

// ==========================================
// ONLINE TRACKING (CLOUDFLARE WORKER)
// Chỉ theo dõi trạng thái online, không kiểm tra thiết bị
// ==========================================
function startOnlineTracking(username) {
    if (typeof API_BASE === 'undefined') {
        console.log("Online tracking: chưa cấu hình API_BASE");
        return;
    }

    const encodedName = encodeURIComponent(username);

    // Hàm gửi ping
    const sendPing = () => {
        fetch(`${API_BASE}?action=pingOnline&username=${encodedName}`)
            .catch(() => {});
    };

    // Hàm báo offline
    const sendOffline = () => {
        fetch(`${API_BASE}?action=offlineUser&username=${encodedName}`, {
            keepalive: true
        }).catch(() => {});
    };

    // Ping ngay khi mở trang
    sendPing();

    // Ping lặp lại mỗi 30 giây
    setInterval(sendPing, 30000);

    // Offline khi đóng tab
    window.addEventListener('beforeunload', () => {
        sendOffline();
    });
}
