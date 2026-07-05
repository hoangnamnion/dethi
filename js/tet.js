/* =============================================================
   FILE: tet.js
   CHỨC NĂNG: Tạo hiệu ứng mưa icon Tết (Emoji falling effect)
   ============================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Nếu đang bật chế độ tối giản đồ họa -> Cấm chạy hiệu ứng Tết (tiết kiệm CPU)
    if (localStorage.getItem('low_graphics') === 'true' || localStorage.getItem('lowGraphics') === 'true') {
        return; 
    }
    // 1. Chèn CSS dùng cho hiệu ứng cao cấp
    const tetStyle = document.createElement('style');
    tetStyle.innerHTML = `
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
            /* Bỏ drop-shadow để chống giật lag */
        }

        @keyframes fallAnimation {
            0% { transform: translateY(-50px) rotate(0deg) scale(0.5); opacity: 0; }
            10% { transform: translateY(10vh) rotate(var(--mid-rotation)) scale(1.2); opacity: 0.9; }
            85% { opacity: 0.9; }
            100% { transform: translateY(115vh) rotate(var(--end-rotation)) scale(1); opacity: 0; }
        }

        @keyframes swayAnimation {
            0% { transform: translateX(var(--sway-start)); }
            100% { transform: translateX(var(--sway-end)); }
        }
    `;
    document.head.appendChild(tetStyle);

    const MAX_ICONS = 15; // Giảm xuống 15 để đỡ lag
    let currentIconCount = 0;
    window.updateTetIconCount = function(delta) { currentIconCount += delta; }

    function spawnIcon() {
        if (currentIconCount < MAX_ICONS && (!localStorage.getItem('low_graphics') || localStorage.getItem('low_graphics') === 'false')) {
            createFallingIcon();
        }
        const nextSpawnTime = Math.random() * 800 + 600; // Giãn thời gian rơi
        setTimeout(spawnIcon, nextSpawnTime);
    }
    spawnIcon();
    // THÊM BÉ GIF NGỒI HỌC VÀO GÓC TRÁI DƯỚI CÙNG
    const studyGif = document.createElement('img');
    studyGif.src = 'anhnen/hoc.gif';
    studyGif.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 100px; /* Độ to của ảnh, có thể đổi */
        z-index: 9999;
        pointer-events: none; /* Tránh click nhầm vào ảnh làm kẹt nút */
        opacity: 0.9;
        filter: drop-shadow(0 5px 15px rgba(0,0,0,0.2));
        animation: floatGif 3s ease-in-out infinite; /* Cho nó lơ lửng nhẹ */
    `;
    document.body.appendChild(studyGif);

    // Đẩy thêm CSS lơ lửng cho ảnh bé GIF ngồi học
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatGif {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
        }
        
        /* Hiệu ứng mèo chạy đi và chạy về */
        @keyframes catRunAnimation {
            0% { left: -150px; transform: scaleX(1); }
            49.9% { left: 110vw; transform: scaleX(1); }
            50% { left: 110vw; transform: scaleX(-1); } /* Quay đầu lại */
            99.9% { left: -150px; transform: scaleX(-1); }
            100% { left: -150px; transform: scaleX(1); }
        }
    `;
    document.head.appendChild(style);

    // BÉ MÈO CHẠY QUA LẠI BÊN DƯỚI MÀN HÌNH
    const buildCat = document.createElement('div');
    buildCat.className = 'running-cat';
    buildCat.style.cssText = `
        position: fixed;
        bottom: 0px; /* Sát mép dưới cùng */
        left: -150px; /* Nằm ngoài màn hình */
        z-index: 10001; 
        pointer-events: none;
        animation: catRunAnimation 25s linear infinite; /* Chạy tà tà mất 25s cho chặng đi-về */
        display: flex;
        align-items: flex-end;
    `;
    
    // Thử load ảnh meo.gif trong máy bạn, nếu không có ảnh thì tự hiện mặt bé mèo Emoji 🐈
    const catImg = document.createElement('img');
    catImg.src = 'anhnen/meo.gif';
    catImg.style.height = '60px'; // To nhỏ ảnh mèo
    catImg.style.objectFit = 'contain';
    
    catImg.onerror = () => {
        // Nếu ảnh không tồn tại, vẽ 1 con mèo bằng biểu tượng
        buildCat.innerHTML = '<span style="font-size: 50px; filter: drop-shadow(2px 5px 5px rgba(0,0,0,0.3));">🐈💨</span>';
    };
    buildCat.appendChild(catImg);
    document.body.appendChild(buildCat);

});

// Danh sách các icon Tết muốn rơi
const tetIcons = ['☀️', '🌴', '🍉', '🏖️', '🍹', '🍦', '🌻'];

function createFallingIcon() {
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
    
    // Đảo ngược kích thước đôi chút để tạo hiệu ứng 3D (bỏ blur/shadow để chống giật)
    if (size < 16) {
        inner.style.opacity = '0.6';
    } else if (size > 24) {
        inner.style.opacity = '0.9';
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

    if(window.updateTetIconCount) window.updateTetIconCount(1);

    // Xóa icon khi rơi xong
    setTimeout(() => {
        if(container.parentNode) container.remove();
        if(window.updateTetIconCount) window.updateTetIconCount(-1);
    }, fallDuration * 1000);
}
