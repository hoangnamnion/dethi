// ==========================================
// 4. LOGIC GIẢM ĐỒ HỌA (LOW GRAPHICS)
// ==========================================
function applyLowGraphics(enabled) {
    let styleTag = document.getElementById('low-graphics-style');
    
    if (enabled) {
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'low-graphics-style';
            styleTag.innerHTML = `
                /* TRIỆT TIÊU TOÀN BỘ HIỆU ỨNG VÀ BÓNG MỜ (GIẢM LOAD CPU/GPU MẠNH NHẤT) */
                *, *::before, *::after {
                    animation: none !important;
                    transition: none !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    filter: none !important;
                    box-shadow: none !important;
                    text-shadow: none !important;
                    border-radius: 0 !important;
                }
                
                /* ẨN TOÀN BỘ THÀNH PHẦN TRANG TRÍ VÀ ẢNH ĐỘNG */
                .mesh-bg, .mesh-blob, .particle, .falling-icon, .bg-vignette, .bg-overlay, #particles, .announcement-banner, .social-notify, .running-cat, img[src*=".gif"], canvas {
                    display: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                }
                
                /* NỀN ĐƠN SẮC TỐI GIẢN */
                body, html, .app-full, .main-container {
                    background: #f1f5f9 !important;
                }
                
                .bg-image {
                    background: none !important;
                    display: none !important;
                }
                
                /* PHẲNG HÓA TẤT CẢ CÁC KHUNG VÀ THẺ (FLAT DESIGN) */
                .login-card, .container-box, .action-card, .menu-btn, .mode-box, .result-box, .modal > div {
                    background: #ffffff !important;
                    border: 1px solid #94a3b8 !important;
                    border-radius: 4px !important;
                }
                
                /* CHỮ ĐEN DỄ NHÌN HƠN */
                .login-title, .login-subtitle, .menu-btn, .card-title, label, p, span, div {
                    color: #0f172a;
                }
                
                /* PHẲNG HÓA TẤT CẢ CÁC NÚT */
                button, .btn, .btn-login, .btn-sso, .btn-start-mode, .btn-resume, .btn-new, .option-item {
                    border-radius: 2px !important;
                    background: #e2e8f0 !important;
                    color: #0f172a !important;
                    border: 1px solid #cbd5e1 !important;
                }
            `;
            document.head.appendChild(styleTag);
        }
        document.body.classList.add('low-graphics-active', 'low-graphics');
        localStorage.setItem('lowGraphics', 'true'); // Lưu thêm format cũ để tương thích thi.html
        localStorage.setItem('low_graphics', 'true');
    } else {
        if (styleTag) styleTag.remove();
        document.body.classList.remove('low-graphics-active', 'low-graphics');
        localStorage.setItem('lowGraphics', 'false');
        localStorage.setItem('low_graphics', 'false');
    }
    
    // Cập nhật nút bấm nếu có trên màn hình
    const btn = document.getElementById('lowGraphicsBtn');
    if (btn) {
        btn.innerHTML = `🎮 Giảm đồ họa: ${enabled ? 'Bật ✅' : 'Tắt'}`;
    }
    const btnThi = document.getElementById('btnLowGraphics');
    if (btnThi) {
        btnThi.innerHTML = enabled ? '⚡ Bật Hiệu Ứng' : '⚡ Tắt Hiệu Ứng';
    }
}

// ==========================================
// 5. HIỆU ỨNG HỎA LỰC & COMBO
// ==========================================
const comboStyle = document.createElement('style');
comboStyle.innerHTML = `
    .combo-badge {
        position: absolute;
        top: -10px; 
        right: 0px;
        background: linear-gradient(135deg, #ff9a9e, #fecfef); /* Mặc định < 10 */
        color: #d63031;
        padding: 8px 25px;
        border-radius: 30px;
        font-weight: 800;
        font-size: 1.3em;
        box-shadow: 0 4px 15px rgba(255, 100, 100, 0.4);
        z-index: 9999;
        transform: rotate(5deg);
        animation: popCombo 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    /* MÀU TÍM X10 */
    .combo-lvl-1 { background: linear-gradient(135deg, #a29bfe, #6c5ce7) !important; color: white !important; box-shadow: 0 4px 15px rgba(108, 92, 231, 0.5) !important; }
    
    /* MÀU ĐỎ TÍM X15 */
    .combo-lvl-2 { background: linear-gradient(135deg, #ff9ff3, #f368e0) !important; color: white !important; box-shadow: 0 4px 15px rgba(243, 104, 224, 0.5) !important; }
    
    /* MÀU ĐỎ X20 */
    .combo-lvl-3 { background: linear-gradient(135deg, #ff4d4d, #eb4d4b) !important; color: white !important; box-shadow: 0 4px 15px rgba(235, 77, 75, 0.5) !important; }
    
    /* MÀU ĐEN X30 */
    .combo-lvl-4 { background: linear-gradient(135deg, #2f3542, #1e272e) !important; color: #f1c40f !important; box-shadow: 0 4px 15px rgba(30, 39, 46, 0.5) !important; border: 2px solid #f1c40f; }

    @keyframes popCombo {
        0% { transform: scale(0) rotate(-20deg) translateX(50px); opacity: 0; }
        100% { transform: scale(1) rotate(5deg) translateX(0); opacity: 1; }
    }
    @keyframes shakeScreen {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px) rotate(-1deg); }
        50% { transform: translateX(5px) rotate(1deg); }
        75% { transform: translateX(-5px); }
    }
    .social-notify {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 12px 20px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        transform: translateX(-150%);
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        border-left: 5px solid #00b894;
    }
    .social-notify.show { transform: translateX(0); }
    .social-avatar {
        width: 40px; height: 40px;
        background: #eee;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.2em;
    }
`;
document.head.appendChild(comboStyle);

let lastStreak = 0; // Lưu trạng thái trước để biết khi nào bị mất chuỗi

function showComboFire(streak) {
    const quizArea = document.getElementById('quizArea');
    if (!quizArea) return;
    
    // Đảm bảo quizArea có position relative để badge bám chuẩn xác
    if (quizArea.style.position !== 'relative') {
        quizArea.style.position = 'relative';
    }

    if (localStorage.getItem('low_graphics') === 'true' || localStorage.getItem('lowGraphics') === 'true') return;

    // KIỂM TRA MẤT CHUỖI
    if (streak === 0 && lastStreak >= 5) {
        // Bọc vào Div flex TRÀN VIỀN để CHUẨN XÁC 100% GIỮA IOS
        const sadContainer = document.createElement('div');
        sadContainer.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.85); z-index: 99999;
            display: flex; justify-content: center; align-items: center;
            animation: popInOut 1s forwards;
        `;
        
        const sadGif = document.createElement('img');
        sadGif.src = 'anhnen/logochu.gif';
        sadGif.style.cssText = `max-width: 80%; max-height: 80vh; object-fit: contain;`;
        
        sadContainer.appendChild(sadGif);
        document.body.appendChild(sadContainer);
        setTimeout(() => sadContainer.remove(), 1000);
    }
    
    lastStreak = streak;

    if (streak >= 5) {
        let badge = document.querySelector('.combo-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'combo-badge';
            quizArea.appendChild(badge); // Bám vào quizArea mục tiêu
        }
        
        // Reset level màu
        badge.classList.remove('combo-lvl-1', 'combo-lvl-2', 'combo-lvl-3', 'combo-lvl-4');
        
        let prefix = "🔥";
        if (streak >= 30) {
            badge.classList.add('combo-lvl-4');
            prefix = "☠️ GODLIKE";
        } else if (streak >= 20) {
            badge.classList.add('combo-lvl-3');
            prefix = "🩸 RAMPAGE";
        } else if (streak >= 15) {
            badge.classList.add('combo-lvl-2');
            prefix = "😈 ULTRA";
        } else if (streak >= 10) {
            badge.classList.add('combo-lvl-1');
            prefix = "🔮 SUPER";
        }
        
        badge.innerHTML = `${prefix} X${streak} COMBO!`;
        
        // Rung nhẹ toàn màn hình khi đạt mỗi mốc chia hết cho 5
        if (streak % 5 === 0) {
            document.body.style.animation = 'none';
            document.body.offsetHeight; // trigger reflow
            document.body.style.animation = 'shakeScreen 0.5s';
        }
    } else {
        const badge = document.querySelector('.combo-badge');
        if (badge) badge.remove();
    }
}

// ==========================================
// 6. THÔNG BÁO SOCIAL PROOF (FAKE)
// ==========================================


function showSocialNotify() {
    // Không hiện nếu đang trong chế độ giảm đồ họa cực cao (để tiết kiệm pin/cpu)
    if (localStorage.getItem('low_graphics') === 'true') return;

    let notify = document.querySelector('.social-notify');
    if (!notify) {
        notify = document.createElement('div');
        notify.className = 'social-notify';
        document.body.appendChild(notify);
    }

    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const action = fakeActions[Math.floor(Math.random() * fakeActions.length)];
    const emoji = ["🎓", "✨", "🔥", "🚀", "💡", "📚"][Math.floor(Math.random() * 6)];

    notify.innerHTML = `
        <div class="social-avatar">${emoji}</div>
        <div style="font-size: 0.9em; color: #2d3436; line-height:1.4">
            <b style="color:#00b894">${name}</b> ${action}
        </div>
    `;

    setTimeout(() => notify.classList.add('show'), 100);
    setTimeout(() => notify.classList.remove('show'), 6000);
}

// Chạy thông báo ngẫu nhiên mỗi 10 giây
(function startSocialLoop() {
    const nextTime = Math.floor(Math.random() * 50000) + 8000; // Ngẫu nhiên 8-12s
    setTimeout(() => {
        showSocialNotify();
        startSocialLoop();
    }, nextTime);
})();

function toggleLowGraphics() {
    const currentState = localStorage.getItem('low_graphics') === 'true';
    const newState = !currentState;
    localStorage.setItem('low_graphics', newState);
    applyLowGraphics(newState);
    
    if (typeof showToast === 'function') {
        showToast(`Hệ thống: Đã ${newState ? 'BẬT' : 'TẮT'} chế độ giảm đồ họa cao!`, newState ? 'success' : 'warning');
    }
}

// Tự động áp dụng khi load trang
(function() {
    const checkReady = setInterval(() => {
        if (document.body) {
            clearInterval(checkReady);
            const saved = localStorage.getItem('low_graphics') === 'true';
            applyLowGraphics(saved);
        }
    }, 50);
})();
