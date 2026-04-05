// js/music.js
(function() {
    let currentAudio = null;
    let isPlaying = false;
    let currentSongIndex = 1; // Bắt đầu từ 1.mp3

    function initMusicPlayer() {
        const btn = document.createElement('button');
        btn.id = 'floating-music-btn';
        btn.innerHTML = '🎵';
        btn.title = 'Bật/Tắt Nhạc';
        
        btn.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 45px;
            height: 45px;
            background: rgba(255, 255, 255, 0.9);
            color: #636e72;
            border: 2px solid #b2bec3;
            backdrop-filter: blur(5px);
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            z-index: 9999;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        btn.onmouseover = () => {
            btn.style.transform = 'scale(1.1)';
            btn.style.boxShadow = '0 6px 20px rgba(9, 132, 227, 0.3)';
        };
        btn.onmouseout = () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        };

        currentAudio = new Audio();
        
        // KHI BÀI HÁT KẾT THÚC -> CHUYỂN BÀI MỚI
        currentAudio.onended = () => {
            playNextSong();
        };

        btn.onclick = () => {
            if (isPlaying) {
                currentAudio.pause();
                isPlaying = false;
                btn.innerHTML = '🎵';
                btn.style.background = 'rgba(255, 255, 255, 0.9)';
                btn.style.color = '#636e72';
                btn.style.borderColor = '#b2bec3';
            } else {
                if (!currentAudio.src || currentAudio.src === "") {
                    // Lần đầu bật
                    currentAudio.src = 'nhac/' + currentSongIndex + '.mp3';
                    currentAudio.play().catch(e => console.log("Lỗi play nhạc:", e));
                } else {
                    currentAudio.play().catch(e => console.log("Lỗi play nhạc:", e));
                }
                isPlaying = true;
                btn.innerHTML = '⏸️';
                btn.style.background = 'linear-gradient(135deg, #74b9ff, #0984e3)';
                btn.style.color = 'white';
                btn.style.borderColor = 'transparent';
            }
        };

        document.body.appendChild(btn);
    }
    
    // Hàm chuyển sang bài tiếp theo (tuần tự)
    function playNextSong() {
        currentSongIndex++;
        currentAudio.src = 'nhac/' + currentSongIndex + '.mp3';
        
        currentAudio.play().catch(e => {
            // Nếu lỗi (nghĩa là không tìm thấy file nhạc này trong thư mục, ví dụ chỉ có 1 2 3 mà gọi 4)
            // Thì reset lặp về bài 1
            if (currentSongIndex > 1) {
                currentSongIndex = 1;
                currentAudio.src = 'nhac/1.mp3';
                currentAudio.play().catch(err => console.log("Hết nhạc, không thể play lại bài 1:", err));
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMusicPlayer);
    } else {
        initMusicPlayer();
    }
})();
