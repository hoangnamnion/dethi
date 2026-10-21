// =====================================================
// CẤU HÌNH API & TELEGRAM BOT — CHỈ CẦN THAY ĐỔI 1 CHỖ DUY NHẤT NÀY
// =====================================================
// Sau khi deploy Worker lên Cloudflare, paste URL vào đây:
const API_BASE = "https://severtkdethi.caovannamutt.workers.dev";

// CẤU HÌNH TELEGRAM BOT (Đã mã hoá Base64 nhẹ)
const _T_TOKEN_ = "ODU4ODI1MjYzMzpBQUhnLURaREVqUnZiOVhvMjNPbkF5bzFXT091NE5iS0hERQ==";
const _T_CHAT_ = "Njc1NDM1NjQ0Ng==";
const getTelegramBotToken = () => atob(_T_TOKEN_);
const getTelegramChatId = () => atob(_T_CHAT_);

// =====================================================
// TỰ ĐỘNG KHỞI TẠO TÀI KHOẢN (CHẠY TĨNH KHÔNG CẦN ĐĂNG NHẬP)
// =====================================================
(function autoBypassAuth() {
    const defaultUser = {
        username: "Người Dùng Trải Nghiệm",
        accountId: "guest",
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        deviceId: "offline_static_device",
        exams: []
    };
    if (!sessionStorage.getItem('current_user')) {
        sessionStorage.setItem('current_user', JSON.stringify(defaultUser));
    }
    if (!localStorage.getItem('saved_user')) {
        localStorage.setItem('saved_user', JSON.stringify(defaultUser));
    }
    if (!localStorage.getItem('current_user')) {
        localStorage.setItem('current_user', JSON.stringify(defaultUser));
    }
})();

// =====================================================
// NẠP TỰ ĐỘNG ENGINE 120HZ CHO TOÀN BỘ CÁC TRANG
// =====================================================
(function autoLoad120Hz() {
    if (!document.getElementById('script-fps120')) {
        const s = document.createElement('script');
        s.id = 'script-fps120';
        s.src = 'js/fps120.js';
        document.head.appendChild(s);
    }
})();


// =====================================================
// ĐỘNG CƠ THEME TẬP TRUNG ÔN TOÀN HỆ THỐNG (GIẢM MÀU MÈ)
// =====================================================
(function initUniversalThemeEngine() {
    function applySavedTheme() {
        const isFocus = localStorage.getItem('neo_focus_theme') === 'true';
        if (isFocus) {
            document.documentElement.classList.add('theme-focus');
            if (document.body) document.body.classList.add('theme-focus');
        } else {
            document.documentElement.classList.remove('theme-focus');
            if (document.body) document.body.classList.remove('theme-focus');
        }
        updateGlobalThemeUI(isFocus);
    }

    applySavedTheme();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applySavedTheme);
    }

    window.toggleFocusTheme = function() {
        const isFocus = !document.body.classList.contains('theme-focus');
        if (isFocus) {
            document.documentElement.classList.add('theme-focus');
            document.body.classList.add('theme-focus');
            localStorage.setItem('neo_focus_theme', 'true');
        } else {
            document.documentElement.classList.remove('theme-focus');
            document.body.classList.remove('theme-focus');
            localStorage.setItem('neo_focus_theme', 'false');
        }
        updateGlobalThemeUI(isFocus);
        showUniversalThemeToast(isFocus);
    };

    window.initFocusTheme = applySavedTheme;

    function updateGlobalThemeUI(isFocus) {
        const btns = document.querySelectorAll('.btn-focus-theme-toggle, #btnFocusThemeToolbar, #btnToggleThemeInModal, #btnIndexThemeToggle, #btnIndexDrawerTheme, #btnProductThemeToggle, #btnTuluanThemeHeader, #btnTuluanDrawerTheme, #btnReviewThemeToggle, #btnOnsaiThemeToggle, #btnFlashcardThemeToggle');
        btns.forEach(btn => {
            if (isFocus) {
                btn.style.background = '#e2e8f0';
                btn.style.borderColor = '#94a3b8';
            } else {
                btn.style.background = '#ffffff';
                btn.style.borderColor = '';
            }
        });

        const textEls = document.querySelectorAll('.theme-toggle-text, #themeToolbarText, #themeModalText, #themeTuluanText, #drawerThemeText');
        textEls.forEach(el => {
            el.textContent = isFocus ? 'Màu Pop Art' : 'Giảm màu mè';
        });

        const iconEls = document.querySelectorAll('.theme-toggle-icon, #themeToolbarIcon, #themeModalIcon, #themeTuluanIcon, #drawerThemeIcon');
        iconEls.forEach(el => {
            el.textContent = isFocus ? '🎨' : '🌱';
        });
    }

    function showUniversalThemeToast(isFocus) {
        let toast = document.getElementById('themeGlobalToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'themeGlobalToast';
            toast.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#1e293b; color:#ffffff; padding:10px 22px; border-radius:999px; font-weight:800; font-size:0.88rem; z-index:99999; box-shadow:0 6px 18px rgba(0,0,0,0.25); border:2px solid #ffffff; transition:opacity 0.3s; pointer-events:none;';
            document.body.appendChild(toast);
        }
        toast.innerHTML = isFocus ? '🌱 Đã bật Theme Giảm màu mè (Tập trung ôn)' : '🎨 Đã chuyển về Theme Neo-Brutalism rực rỡ';
        toast.style.opacity = '1';
        toast.style.display = 'block';
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.style.display = 'none'; }, 300);
        }, 2000);
    }
})();


// =====================================================
// QUẢN LÝ THÔNG BÁO BẢN CẬP NHẬT MỚI & SNOOZE 2 TIẾNG
// =====================================================
const CURRENT_UPDATE_VERSION = 'v2.6_20261021';

function checkNewUpdateNotification() {
    let snoozeUntil = 0;
    try {
        snoozeUntil = parseInt(localStorage.getItem('snooze_update_until') || '0', 10);
    } catch (e) {}

    const isSnoozed = Date.now() < snoozeUntil;
    const dot = document.querySelector('.update-pulse-dot');
    if (dot) {
        dot.style.display = isSnoozed ? 'none' : 'inline-block';
    }

    // Nếu đang trong thời gian tắt 2 tiếng thì không tự bung popup
    if (isSnoozed) {
        return;
    }

    // Cứ load trang là tự động thông báo
    const modal = document.getElementById('updateModal');
    if (modal) {
        setTimeout(() => {
            openUpdateModal();
        }, 700);
    }
}

function openUpdateModal() {
    const modal = document.getElementById('updateModal');
    if (modal) modal.style.display = 'flex';
}

function closeUpdateModal() {
    const modal = document.getElementById('updateModal');
    if (modal) modal.style.display = 'none';
}

function snoozeUpdateModal(hours = 2) {
    const snoozeUntil = Date.now() + (hours * 60 * 60 * 1000);
    try {
        localStorage.setItem('snooze_update_until', snoozeUntil.toString());
    } catch (e) {}
    closeUpdateModal();
    const dots = document.querySelectorAll('.update-pulse-dot');
    dots.forEach(d => d.style.display = 'none');
    showSnoozeToast(hours);
}

function showSnoozeToast(hours) {
    let toast = document.getElementById('snoozeGlobalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'snoozeGlobalToast';
        toast.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#0f172a; color:#fef08a; padding:10px 22px; border-radius:999px; font-weight:800; font-size:0.88rem; z-index:99999; box-shadow:0 6px 18px rgba(0,0,0,0.3); border:2.5px solid #000000; transition:opacity 0.3s; pointer-events:none;';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `⏰ Đã tắt thông báo tự động trong ${hours} tiếng!`;
    toast.style.opacity = '1';
    toast.style.display = 'block';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 2500);
}

window.openUpdateModal = openUpdateModal;
window.closeUpdateModal = closeUpdateModal;
window.snoozeUpdateModal = snoozeUpdateModal;
window.checkNewUpdateNotification = checkNewUpdateNotification;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkNewUpdateNotification);
} else {
    checkNewUpdateNotification();
}
