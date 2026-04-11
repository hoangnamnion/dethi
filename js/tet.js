/* =============================================================
   FILE: tet.js
   CHỨC NĂNG: Tạo hiệu ứng mưa icon Tết (Emoji falling effect)
   ============================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Nếu đang bật chế độ tối giản đồ họa -> Cấm chạy hiệu ứng Tết (tiết kiệm CPU)
    if (localStorage.getItem('low_graphics') === 'true' || localStorage.getItem('lowGraphics') === 'true') {
        return; 
    }

    // Cứ 400ms lại sinh ra 1 icon rơi
    setInterval(createFallingIcon, 400);

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
    const icon = document.createElement('div');
    icon.classList.add('falling-icon');

    // Chọn ngẫu nhiên 1 icon từ danh sách
    const randomIcon = tetIcons[Math.floor(Math.random() * tetIcons.length)];
    icon.innerText = randomIcon;

    // Kích thước ngẫu nhiên (từ 15px đến 30px)
    const size = Math.random() * 10 + 10;
    icon.style.fontSize = `${size}px`;
    
    // Vị trí ngang ngẫu nhiên (từ 0% đến 100% màn hình)
    icon.style.left = `${Math.random() * 100}vw`;
    
    // Tốc độ rơi ngẫu nhiên (từ 4s đến 8s)
    const duration = Math.random() * 4 + 4;
    icon.style.animationDuration = `${duration}s`;
    
    // Thêm vào body
    document.body.appendChild(icon);

    // Xóa icon khi rơi xong để tránh nặng máy
    setTimeout(() => {
        icon.remove();
    }, duration * 1000);
}