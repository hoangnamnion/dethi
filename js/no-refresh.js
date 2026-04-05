// js/no-refresh.js
// Chặn pull-to-refresh trên Android WebView & Mobile browsers
(function() {
    let startY = 0;
    let startX = 0;

    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        const y = e.touches[0].clientY;
        const x = e.touches[0].clientX;
        const dy = y - startY;
        const dx = x - startX;

        // Chỉ chặn khi kéo xuống (dy > 0) và đang ở đầu trang
        // Và hướng kéo chủ yếu là dọc (không phải vuốt ngang)
        if (Math.abs(dy) > Math.abs(dx) && dy > 0) {
            // Tìm element đang scroll
            let el = e.target;
            let canScroll = false;
            while (el && el !== document.body && el !== document.documentElement) {
                if (el.scrollTop > 0) {
                    canScroll = true;
                    break;
                }
                el = el.parentElement;
            }
            // Nếu không có element nào đang scroll được (ở đầu trang) -> chặn
            if (!canScroll) {
                e.preventDefault();
            }
        }
    }, { passive: false });
})();
