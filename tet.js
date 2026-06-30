/* =============================================================
   FILE: tet.js
   CHỨC NĂNG: Tạo hiệu ứng mưa icon Premium
   ============================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Chèn CSS dùng cho hiệu ứng cao cấp
    const style = document.createElement('style');
    style.innerHTML = `
        .premium-falling-icon {
            position: fixed;
            top: -50px;
            pointer-events: none;
            z-index: 9999;
            user-select: none;
            will-change: transform, opacity;
            animation: fallAnimation var(--fall-duration) linear forwards;
        }
        
        .premium-falling-inner {
            display: inline-block;
            animation: swayAnimation var(--sway-duration) ease-in-out infinite alternate;
            filter: drop-shadow(0 5px 15px rgba(255, 107, 107, 0.4));
        }

        @keyframes fallAnimation {
            0% { 
                transform: translateY(-50px) rotate(0deg) scale(0.5);
                opacity: 0;
            }
            10% {
                transform: translateY(10vh) rotate(var(--mid-rotation)) scale(1.2);
                opacity: 0.9;
            }
            85% {
                opacity: 0.9;
            }
            100% { 
                transform: translateY(115vh) rotate(var(--end-rotation)) scale(1);
                opacity: 0;
            }
        }

        @keyframes swayAnimation {
            0% { transform: translateX(var(--sway-start)); }
            100% { transform: translateX(var(--sway-end)); }
        }
    `;
    document.head.appendChild(style);

    // Nếu đang bật chế độ tối giản đồ họa -> Cấm chạy hiệu ứng (tiết kiệm CPU)
    if (localStorage.getItem('low_graphics') === 'true' || localStorage.getItem('lowGraphics') === 'true') {
        return; 
    }

    // 2. Logic tạo hạt mưa với số lượng giới hạn để chống giật lag
    const MAX_ICONS = 35; // Giới hạn tối đa số lượng icon trên màn hình
    let currentIconCount = 0;

    function spawnIcon() {
        if (currentIconCount < MAX_ICONS && (!localStorage.getItem('low_graphics') || localStorage.getItem('low_graphics') === 'false')) {
            createPremiumFallingIcon();
        }
        
        // Thời gian sinh icon ngẫu nhiên từ 250ms đến 650ms để tạo cảm giác tự nhiên hơn
        const nextSpawnTime = Math.random() * 400 + 250;
        setTimeout(spawnIcon, nextSpawnTime);
    }

    // Bắt đầu vòng lặp sinh icon
    spawnIcon();
});

// Danh sách các icon Tết
const tetIcons = ['🌸', '🍀', '🧧', '🎇', '❤', '🎆', '🧨', '✨', '🎊'];

function createPremiumFallingIcon() {
    const container = document.createElement('div');
    container.classList.add('premium-falling-icon');

    const inner = document.createElement('div');
    inner.classList.add('premium-falling-inner');
    
    // Chọn ngẫu nhiên 1 icon
    const randomIcon = tetIcons[Math.floor(Math.random() * tetIcons.length)];
    inner.innerText = randomIcon;

    // Các tham số ngẫu nhiên
    const size = Math.random() * 18 + 12; // Kích thước từ 12px đến 30px
    inner.style.fontSize = `${size}px`;
    
    // Đảo ngược kích thước đôi chút để tạo hiệu ứng 3D (blur cho icon nhỏ, rõ cho icon to)
    if (size < 16) {
        inner.style.filter = 'drop-shadow(0 2px 4px rgba(255,107,107,0.2)) blur(1px)';
        inner.style.opacity = '0.6';
    } else if (size > 24) {
        inner.style.filter = 'drop-shadow(0 8px 20px rgba(255,107,107,0.6))';
    }
    
    // Vị trí xuất hiện ngang ngẫu nhiên
    container.style.left = `${Math.random() * 100}vw`;
    
    // Tốc độ rơi từ 4s đến 9s
    const fallDuration = Math.random() * 5 + 4;
    container.style.setProperty('--fall-duration', `${fallDuration}s`);
    
    // Tốc độ lắc lư hai bên từ 1.5s đến 3.5s
    const swayDuration = Math.random() * 2 + 1.5;
    inner.style.setProperty('--sway-duration', `${swayDuration}s`);
    
    // Góc xoay tự nhiên trong lúc rơi
    const midRotation = Math.random() * 180 - 90;
    const endRotation = Math.random() * 720 - 360;
    container.style.setProperty('--mid-rotation', `${midRotation}deg`);
    container.style.setProperty('--end-rotation', `${endRotation}deg`);
    
    // Độ rộng lắc lư (Sway range)
    const swayStart = (Math.random() * 30 - 60) + 'px'; // -60px đến -30px
    const swayEnd = (Math.random() * 30 + 30) + 'px';   // 30px đến 60px
    inner.style.setProperty('--sway-start', swayStart);
    inner.style.setProperty('--sway-end', swayEnd);

    // Gắn inner vào container
    container.appendChild(inner);
    
    // Gắn vào body
    document.body.appendChild(container);

    // Cập nhật số lượng
    currentIconCount++;

    // Xóa icon khi rơi xong
    setTimeout(() => {
        if(container.parentNode) container.remove();
        currentIconCount--;
    }, fallDuration * 1000);
}