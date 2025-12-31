/* =============================================================
   FILE: tet.js
   CHỨC NĂNG: Tạo hiệu ứng mưa icon Tết (Emoji falling effect)
   ============================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Cứ 400ms lại sinh ra 1 icon rơi
    setInterval(createFallingIcon, 400);
});

// Danh sách các icon Tết muốn rơi
const tetIcons = ['🌸', '🍀', '🧧', '🎇', '❤', '🎆', '🧨'];

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