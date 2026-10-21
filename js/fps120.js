// ======================================================================
// FPS 120 & THERMAL ECO ENGINE — SIÊU TỐI ƯU HIỆU NĂNG & CHỐNG NÓNG MÁY
// Loại bỏ scroll-lag, ngắt repaint dư thừa, triệt tiêu gánh nặng CPU/GPU
// ======================================================================
(function setupTurboAndThermalEngine() {
    'use strict';

    // 1. Tối ưu CSS hiệu năng cao & triệt tiêu phát nhiệt phần cứng
    function applyTurboStyles() {
        if (document.getElementById('engine-turbo-style')) return;
        const style = document.createElement('style');
        style.id = 'engine-turbo-style';
        style.textContent = `
            /* Phản hồi tức thì, loại bỏ độ trễ cuộn trang */
            html {
                scroll-behavior: auto !important;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: optimizeSpeed !important;
            }
            body {
                -webkit-overflow-scrolling: touch;
            }
            /* Phản hồi click/touch siêu nhạy không có độ trễ 300ms */
            a, button, .menu-btn, .option-item, .btn-neo, .nav-btn, .chip-btn {
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            /* GPU Containment: Trình duyệt không phải tính toán lại layout toàn bộ cây DOM */
            .option-item, .review-card, .menu-btn {
                contain: layout style;
            }
            /* Virtual Rendering tự nhiên: Bỏ qua render các card chưa cuộn tới */
            .review-card, .menu-btn {
                content-visibility: auto;
                contain-intrinsic-size: 1px 110px;
            }
            /* Chế độ Mát Máy / Tiết Kiệm Pin Cực Cao (Low Graphics / Eco Mode) */
            body.low-graphics, body.eco-mode {
                background-image: none !important;
            }
            body.low-graphics::before, body.eco-mode::before {
                display: none !important;
            }
            body.low-graphics *, body.eco-mode * {
                animation: none !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyTurboStyles);
    } else {
        applyTurboStyles();
    }

    // 2. Helper requestAnimationFrame chuẩn tần số quét, tự nghỉ khi tab ẩn
    window.raf120 = function(fn) {
        if (document.hidden) return;
        return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || setTimeout)(fn);
    };

    // 3. Khởi tạo chế độ Mát máy từ thiết lập đã lưu hoặc pin yếu
    try {
        if (localStorage.getItem('neo_eco_mode') === 'true') {
            document.body.classList.add('low-graphics');
        }
        if (navigator.getBattery) {
            navigator.getBattery().then(function(battery) {
                if (battery.level <= 0.20 && !battery.charging) {
                    document.body.classList.add('low-graphics');
                }
            }).catch(function() {});
        }
    } catch (e) {}
})();
